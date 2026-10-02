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
        return res.status(401).json({
            error: {
                status: 401,
                message: "API Key requerida"
            }
        });
    }

    if (apiKey !== API_KEY) {
        return res.status(403).json({
            error: {
                status: 403,
                message: "API Key incorrecta"
            }
        });
    }

    next();
}

app.get("/", (req, res) => {
    res.json({
        name: "DataSync JSON API",
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

    res.status(200).json({
        items: products
    });
});


app.get("/test", (req, res) => {

    res.status(200).json({
        items: [
            {
                id: 1,
                name: "Producto prueba2",
                status: "success"
            }
        ]
    });
});

app.use((req, res) => {

    res.status(404).json({
        error: {
            status: 404,
            message: "Endpoint no encontrado"
        }
    });
});


app.listen(PORT, () => {

    console.log(`

Servidor:
http://localhost:${PORT}

JSON de prueba:
http://localhost:${PORT}/test

JSON para DataSync:
http://localhost:${PORT}/api/datasync/products

========================================
`);
});