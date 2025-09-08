//JS client for rest API (object literal module)

(function (global) {
  const base = "/api";

  async function request(url, opts) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json")
      ? await res.json()
      : await res.text();
    if (!res.ok) throw data && data.error ? data : { error: "Network error" };
    return data;
  }
  function normalizeListPayload(payload) {
    const webs = payload && payload.webs ? payload.webs : [];
    return webs.map((w) => ({ slug: w.route || w.slug, file: w.file }));
  }
  const client = {
    list(cb) {
      request(`${base}/list`)
        .then((payload) => cb({ webs: normalizeListPayload(payload) }))
        .catch((err) => alert(err.error || "List error"));
    },

    new({ slug, html }, cb) {
      request(`${base}/new`, {
        method: "POST",
        body: JSON.stringify({ slug, html }),
      })
        .then(cb)
        .catch((err) => alert(err.error || "Create error"));
    },

    edit(slug, html, cb) {
      request(`${base}/edit`, {
        method: "POST",
        body: JSON.stringify({ slug, html }),
      })
        .then(cb)
        .catch((err) => alert(err.error || "Edit error"));
    },

    delete(slug, cb) {
      request(`${base}/delete`, {
        method: "POST",
        body: JSON.stringify({ slug }),
      })
        .then(cb)
        .catch((err) => alert(err.error || "Delete error"));
    },

    getContent(slug, cb) {
      request(`${base}/content/${slug}`)
        .then((html) => cb(typeof html === "string" ? html : html?.html ?? ""))
        .catch((err) => alert(err.error || "Content error"));
    },
  };

  global.mycomponent = client;
})(window);
