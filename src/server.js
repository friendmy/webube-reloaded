import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => console.log(req, res));

const handleListening = () => console.log(`✔ Server listening on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
