// Admin panel control

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const api = window.mycomponent || window.mycomponentweb;
    if (!api) alert("API client not available");
    return;
  });

  // Doom Hooks

  const $table = document.getElementById("table-webs");
  const $formNew = document.getElementById("form-new");
  const $newSlug = document.getElementById("new-slug");
  const $newHtml = document.getElementById("new-html");
  const $btnCreate = document.getElementById("btn-create");
  const $formEdit = document.getElementById("form-edit");
  const $editSlug = document.getElementById("edit-slug");
  const $editHtml = document.getElementById("edit-h");
  const $preview = document.getElementById("preview");
  const $btnSave = document.getElementById("btn-save");

  const required = [
    $table,
    $formNew,
    $newSlug,
    $newHtml,
    $btnCreate,
    $formEdit,
    $editSlug,
    $editHtml,
    $btnSave,
    $preview,
  ];
  if (required.some((el) => !el)) {
    console.log("Missing DOM module.");
    return;
  }
  //HELPERS
  const clear = (el) => {
    while (el.firstChild) el.removeChild(el.firstChild);
  };

  // Ensure we always have Slug
  function normalizeWebs(payload) {
    const webs = payload && payloads.webs ? payloads.web : [];
    return webs.map((x) => {
      slug: x.slug || x.route || x.ruta
      file: x.file,
    })
  }

  function makeRow(item) {
    const tr = document.createElement("tr")

    const tdSlug = document.createElement("td");
    const a = document.createElement("a")
    a.href = "/" + item.slug;
    a.textContent = "/" + item.slug;
    a.target = "_blank"
    tdSlug.appendChild(a)

    const tdFile = document.createElement("td");
    tdFile.textContent = item.file

    const tdActions = document.createElement("td");
    tdActions.className = "text-end"

    const btnEdit = document.createElement("button");
    btnEdit.type = "Button";
    btnEdit.className = "btn btn-warning btn-sm me-1";
    btnEdit.textContent = "Edit";
    btnEdit.onclick = () => {
      $editSlug.value = item.slug
      $btnSave.disabled = false
      api.getContent(item.slug, (html) => {
        const val = html || "";
        $editHtml.value = val;
        $preview.innerHTML = val;
      })
    tdActions.appendChild(btnEdit)
    }
  if (item.slug !== "main") {
    const btnDel = document.createElement("button")
    btnDel.type = "button"
    btnDel.className = "btn btn-danger btn-sm"
    btnDel.textContent = "Delete"
    btnDel.onclick = () => {
      if (confirm(`Delete /${item.slug}?`)) {
        btnDel.disabled = true;
        api.delete(item.slug, () => refresh())
      }
    tdActions.appendChild(btnDel)
    }
  }  
  }

  ///Create
  $formNew.addEventListener("submit", (x) => {
    x.preventDefault();
    const slug = ($newSlug.value || "").trim().toLowerCase();
    const html = $newHtml.value || "";

    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert ("Invalid slug use.")
      return
    }
  $btnCreate.disabled = true;
  api.new({ slug, html}, () => {
    $newSlug.value = "";
    $newHtml.value = "";
    $btnCreate.disabled = false;
  })º
  })

  /// Save & edit 
  $formEdit.addEventListener("submit", (x) => {
    x.preventDefault();
    const slug = ($editSlug.value || "").trim();
    const html = ($editHtml.value || "")

    if (!slug) return alert ("Select a page.")
    
    $btnSave.disabled = true;
    api.edit(slug, html, () => {
      $btnSave.disabled = false;
      refresh()
    })
  })

  /// Live Preview 

  let t; 
  $editHtml.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => { $preview.innerHTML = $editHtml.value;}, 120)
  })

  /// Allow user to save with Ctrl + S
  document.addEventListener("keydown", (x) => {
    if ((x.ctrlKey || x.metaKey ) && x.key.toLocaleLowerCase() === "s") {
      x.preventDefault();
      if (!$btnSave.disabled) $formEdit.requestSubmit()
    }
  })

  // Init
  refresh()

});
