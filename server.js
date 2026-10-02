const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());


function authenticate(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).send(`
            <?xml version="1.0" encoding="UTF-8"?>
            <error>
                <status>401</status>
                <message>API Key requerida</message>
            </error>
        `);
    }

    if (apiKey !== API_KEY) {
        return res.status(403).send(`
            <?xml version="1.0" encoding="UTF-8"?>
            <error>
                <status>403</status>
                <message>API Key incorrecta</message>
            </error>
        `);
    }

    next();
}


app.get("/", (req, res) => {
    res.json({
        name: "DataSync XML API",
        status: "online",
        endpoint: "/api/datasync/products"
    });
});


app.get("/api/datasync/products", authenticate, (req, res) => {

    const products = [
        {
            id: 1,
            name: "Producto A",
            price: 150,
            stock: 20
        },
        {
            id: 2,
            name: "Producto B",
            price: 250,
            stock: 10
        },
        {
            id: 3,
            name: "Producto C",
            price: 350,
            stock: 5
        }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<products>
    ${products.map(product => `
    <product>
        <id>${product.id}</id>
        <name>${product.name}</name>
        <price>${product.price}</price>
        <stock>${product.stock}</stock>
    </product>
    `).join("")}
</products>`;

    res
        .status(200)
        .type("application/xml")
        .send(xml);
});


app.get("/test", (req, res) => {

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<test>
    <status>success</status>
    <message>XML funcionando correctamente</message>
</test>`;

    res
        .status(200)
        .type("application/xml")
        .send(xml);
});

app.use((req, res) => {

    res.status(404).type("application/xml").send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <error>
            <status>404</status>
            <message>Endpoint no encontrado</message>
        </error>
    `);
});


app.listen(PORT, () => {

    console.log(`

Servidor:
http://localhost:${PORT}

XML de prueba:
http://localhost:${PORT}/test

XML para DataSync:
http://localhost:${PORT}/api/datasync/products

API Key:
${API_KEY}

`);
});