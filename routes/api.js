const express = require("express");
const router = express.Router();
const myweb = require("../data/myweb");

// Herlper to normalize oncoming body fields
function normalizeBody(body) {
  const slug = (body.slug ?? body.route ?? body.routeName ?? "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
  const html = (body.html ?? body.content ?? body.body ?? "").toString();
  return { slug, html };
}

// GET api/list
router.get("/list", async (req, res) => {
  try {
    const webs = await myweb.list();
    res.json({ webs });
  } catch (err) {
    res.status(500).json({ error: "internal error" });
  }
});

// GET /api/content/slug
router.get("/content/:slug", async (req, res) => {
  try {
    const slug = (req.params.slug || "").toLowerCase();
    if (!slug) return res.status(400).json({ error: "route required" });

    const html = await myweb.readContent(slug);
    if (html === null)
      return res.status(404).json({ error: "route not found" });

    res.json({ html });
  } catch (err) {
    res.status(500).json({ error: "internal error" });
  }
});

// POST /api/new
router.post("/new", async (req, res) => {
  try {
    const { slug, html } = normalizeBody(req.body);
    if (!slug) return res.status(400).json({ error: "route required" });

    await myweb.new(slug, html);
    res.status(201).json({ ok: true });
  } catch (err) {
    const msg = String(err.message || err);
    if (msg.includes("Route already exists"))
      return res.status(409).json({ error: msg });
    if (msg.includes("Invalid slug") || msg.includes("required"))
      return res.status(400).json({ error: msg });
    res.status(500).json({ error: "internal error" });
  }
});

// POST /api/edit
router.post("/edit", async (req, res) => {
  try {
    const { slug, html } = normalizeBody(req.body);
    if (!slug) return res.status(400).json({ error: "route required" });

    await myweb.edit(slug, html);
    res.json({ ok: true });
  } catch (err) {
    const msg = String(err.message || err);
    if (msg.includes("Route not found"))
      return res.status(409).json({ error: msg });
    if (msg.includes("Invalid slug") || msg.includes("required"))
      return res.status(400).json({ error: msg });
    res.status(500).json({ error: "internal error" });
  }
});

// POST /api/delete
router.post("/delete", async (req, res) => {
  try {
    const { slug } = normalizeBody(req.body);
    if (!slug) return res.status(400).json({ error: "route required" });

    await myweb.delete(slug);
    res.json({ ok: true });
  } catch (err) {
    const msg = String(err.message || err);
    if (msg.includes("Cannot delete"))
      return res.status(400).json({ error: msg });
    if (msg.includes("Route not found"))
      return res.status(404).json({ error: msg });
    res.status(500).json({ error: "internal error" });
  }
});

module.exports = router;
