const express = require("express");
const morgan = require("morgan");
const api = require("./routes/api.js");
const myweb = require("./data/myweb.js");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

//MOUNT API
app.use("/api", api);

app.get("/", (_, res) => res.json({ ok: true, api: "/api" }));

app.listen(PORT, () => console.log("API test localhost:3000"));
