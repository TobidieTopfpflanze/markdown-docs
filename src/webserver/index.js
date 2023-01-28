const express = require("express");
const Path = require("node:path");
const fs = require("node:fs");
const { parse } = require("node-html-parser");

const templatePage = parse(
  fs.readFileSync(Path.join(__dirname, "index.html"), { encoding: "utf-8" })
);

const createSideNavItem = (title, ref) => {
  return `<div class="sideNavItem" onclick="changePath('${ref}')">${title}</div>`
}

const createNavDropdownItem = (title, ref) => {
  return `<div class="navDropdownItem" onclick="changePath('${ref}')">${title}</div>`
}

const createNavDropdown = (title, content) => {
  return `<div class="navDropdown">
  <div class="navDropdownTitle" onclick="openDropdown(this.parentElement)">${title}</div>
  <div class="dropdownContainer">
    ${content}
  </div>
</div>`
}

const buildNavigationItems = (data, isFirstLayer = false) => {
  let navhtml = ""
  for (const name in data) {
    const target = data[name]
    if (typeof target == "string") {
      if (isFirstLayer) {
        navhtml += createSideNavItem(name, target)
      }
      else {
        navhtml += createNavDropdownItem(name, target)
      }
    } else {
      const content = buildNavigationItems(target)
      navhtml += createNavDropdown(name, content)
    }
  }
  return navhtml
}

module.exports = start = (port = 80, assets_path, markdownData, navigationData, statics) => {
  templatePage.getElementById("SideNav").innerHTML = buildNavigationItems(navigationData, true)
  const app = express();

  app.use(
    "/",
    express.static(Path.join(process.cwd(), "src", "webserver", "public"))
  );

  if (assets_path)
    app.use("/assets", express.static(Path.join(process.cwd(), assets_path)));

  app.get("*", (req, res) => {
    const query = req.url.toLowerCase();
    const finalPage = templatePage;

    console.log(query)

    if (markdownData.has(query)) {
      finalPage.querySelector("#Content").innerHTML = markdownData.get(query);
    } else if (query == "/") {
      finalPage
        .querySelector("#Content").innerHTML = markdownData.get(statics.home);
    } else {
      finalPage
        .querySelector("#Content").innerHTML = markdownData.get(statics.not_found);
    }

    res.send(finalPage.toString());
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  return app;
};
