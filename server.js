const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// display
app.get("/api/vehicles", (req, res) => {
    const vehicles = JSON.parse(fs.readFileSync("data.json"));
    res.json(vehicles);
});

// search vehicle
app.get("/api/vehicles/:id", (req, res) => {
    const vehicles = JSON.parse(fs.readFileSync("data.json"));
    const vehicle = vehicles.find(v => v.id == req.params.id);

    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
});

// register vehicle
app.post("/api/vehicles", (req, res) => {
    const vehicles = JSON.parse(fs.readFileSync("data.json"));

    const { plate_number, owner, vehicle_type, color } = req.body;

    const duplicate = vehicles.find(
        v => v.plate_number.toLowerCase() === plate_number.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(400).json({ message: "Plate number already exists" });
    }

    const vehicle = {
        id: vehicles.length > 0
            ? Math.max(...vehicles.map(v => v.id)) + 1
            : 1,
        plate_number: plate_number.trim().toUpperCase(),
        owner,
        vehicle_type,
        color
    };

    vehicles.push(vehicle);

    fs.writeFileSync("data.json", JSON.stringify(vehicles, null, 2));

    res.status(201).json({ message: "Vehicle registered successfully", vehicle });
});

// delete vehicle
app.delete("/api/vehicles/:id", (req, res) => {
    const vehicles = JSON.parse(fs.readFileSync("data.json"));
    const id = Number(req.params.id);
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicles.splice(index, 1);

    fs.writeFileSync("data.json", JSON.stringify(vehicles, null, 2));

    res.json({ message: "Vehilce deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});