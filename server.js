const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "DataSync XML API",
        status: "online",
        endpoint: "/api/datasync/products"
    });
});

app.get("/api/datasync/products", (req, res) => {

    const xmlContent = fs.readFileSync(`products_items.xml`, `utf8`);

    

    const filePath = path.join(__dirname, "products_items.xml");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).type("application/xml").send(`
                <error>
                    <status>500</status>
                    <message>No se pudo leer el archivo XML</message>
                </error>
            `);
        }

        res
            .status(200)
            .type("application/xml")
            .send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});