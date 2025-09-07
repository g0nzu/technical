// Easy MYWEB Testing

const myweb = require("../data/myweb");

(async () => {
  await myweb.initIfNotexists();
  console.log("Initial list", await myweb.list());

  await myweb.new("about", "<h1>About</h1><p>This is the about page.</p>");
  console.log("After new", await myweb.list());

  console.log("Read about:", await myweb.readContent("about"));

  await myweb.edit(
    "about",
    "<h1>About us</h1><p>This is the updated about page.</p>"
  );

  await myweb.delete("about");
  console.log("Final list", await myweb.list());
})();
