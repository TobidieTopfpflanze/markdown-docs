const fs = require("node:fs");
const Path = require("node:path");
const connectWebserver = require("./webserver/");
const loadMarkdownFiles = require("./markdown/");

const config = JSON.parse(
  fs.readFileSync(Path.join(process.cwd(), "config.json"))
);

const [ markdownData, navigationData ] = loadMarkdownFiles(config.data_path);
connectWebserver(
  config.port,
  config.assets_path,
  markdownData,
  navigationData,
  config.static_pages
);
