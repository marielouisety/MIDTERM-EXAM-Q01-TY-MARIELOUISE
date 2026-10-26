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


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});