const path = require("path");
const hbs = require("hbs");
const express = require("express");
const morgan = require("morgan");
const myweb = require("./data/myweb.js");
const apiRouter = require("./routes/api.js");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES (css, js, img)
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

(async () => {
  await myweb.initIfNotExists();
})();

// Home render
app.get("/", async (req, res, next) => {
  try {
    const content = await myweb.readContent("main");
    return res.render("home", { layout: "layouts/main", content });
  } catch (err) {
    return next(err);
  }
});

// Rest API
app.use("/api", apiRouter);

// Admin panel
app.get("/admin", (req, res) => {
  return res.render("admin", { layout: "layouts/admin" });
});

// Dynamic routes
app.get("/:route", async (req, res, next) => {
  try {
    const { route } = req.params;
    if (route === "admin" || route === "api") {
      return next();
    }
    const content = await myweb.readContent(route);
    if (content === null) return res.status(404).send("Not found");
    return res.render("pag", { layout: "layouts/main", content });
  } catch (err) {
    return next(err);
  }
});

// 404
app.use((req, res) => res.status(404).send("404!"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
