const fs = require("fs-extra");
const path = require("path");

// JSON REGISTRY LIVES NEXT TO THIS FILE
const DB_PATH = path.join(__dirname, "webs.json");
// HTML FILES LIVE IN ProjectRoot/web (one level above this file)
const WEB_DIR = path.join(__dirname, "..", "web");

const RESERVED = new Set(["admin", "root", "system", "null", "undefined"]);

function isValidSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug) && !RESERVED.has(slug);
}

async function loadDb() {
  const exists = await fs.pathExists(DB_PATH);
  if (!exists) return { webs: [] };
  return fs.readJson(DB_PATH);
}

async function saveDb(db) {
  await fs.outputJSON(DB_PATH, db, { spaces: 2 });
}

const myweb = {
  async initIfNotExists() {
    await fs.ensureDir(path.dirname(DB_PATH));
    await fs.ensureDir(WEB_DIR);

    const db = await loadDb();

    if (!db.webs.some((w) => w.route === "main")) {
      const mainAbs = path.join(WEB_DIR, "main.html");
      const content = `<!DOCTYPE html>
<h1>Welcome to this CMS!</h1>
<p>This is the <strong>main</strong> page.</p>
<p>Edit it from <code>/admin</code>.</p>`;
      await fs.outputFile(mainAbs, content, "utf-8");

      db.webs.push({
        route: "main",
        title: "Main Page",
        file: path
          .relative(path.join(__dirname, ".."), mainAbs)
          .replace(/\\/g, "/"),
      });

      await saveDb(db);
    }
  },

  async list() {
    const db = await loadDb();
    return db.webs;
  },

  async readContent(route) {
    const db = await loadDb();
    const page = db.webs.find((w) => w.route === route);
    if (!page) return null;
    const absPath = path.join(__dirname, "..", page.file);
    const exists = await fs.pathExists(absPath);
    if (!exists) return "";
    return fs.readFile(absPath, "utf-8");
  },

  async new(slug, content = "") {
    if (!slug) throw new Error("Route required");
    if (!isValidSlug(slug))
      throw new Error("Invalid slug, only a-z, 0-9 and - allowed");

    const db = await loadDb();
    if (db.webs.some((w) => w.route === slug)) {
      throw new Error("Route already exists");
    }

    const fileAbs = path.join(WEB_DIR, `${slug}.html`);
    await fs.outputFile(fileAbs, content, "utf-8");
    db.webs.push({
      route: slug,
      file: path
        .relative(path.join(__dirname, ".."), fileAbs)
        .replace(/\\/g, "/"),
    });
    await saveDb(db);
    return { ok: true };
  },

  async edit(slug, content = "") {
    if (!slug) throw new Error("Route required");

    const db = await loadDb();
    const page = db.webs.find((w) => w.route === slug);
    if (!page) throw new Error("Route not found");

    const abs = path.join(__dirname, "..", page.file);
    await fs.outputFile(abs, content, "utf-8");
    return { ok: true };
  },

  async delete(slug) {
    if (!slug) throw new Error("Route required");
    if (slug === "main") throw new Error("Cannot delete main page");

    const db = await loadDb();
    const idx = db.webs.findIndex((w) => w.route === slug);
    if (idx === -1) throw new Error("Route not found");

    const abs = path.join(__dirname, "..", db.webs[idx].file);
    await fs.remove(abs);
    db.webs.splice(idx, 1);
    await saveDb(db);
    return { ok: true };
  },
};

module.exports = myweb;
