const Path = require('node:path');
const fs = require('node:fs');
const { parse } = require('node-html-parser');
const md = require('markdown-it')({ html: true }).use(
  require('markdown-it-anchor')
);

const temp = md.renderer.rules.fence.bind(md.renderer.rules);
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  if (token.info === 'mermaid') {
    token.attrJoin('class', 'mermaid');
  }
  return temp(tokens, idx, options, env, self);
};

const convertMdFolder = (dirPath, markdownMap, navigationMap, urlPath) => {
  const files = fs.readdirSync(dirPath, { encoding: 'utf-8' });
  for (const file of files) {
    const fileStats = fs.statSync(Path.join(dirPath, file));
    if (fileStats.isDirectory()) {
      navigationMap[file] = {};
      convertMdFolder(
        Path.join(dirPath, file),
        markdownMap,
        navigationMap[file],
        Path.join(urlPath, file)
      );
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(Path.join(dirPath, file)).toString();
      const cuttedName = file.split('.').slice(0, -1).join('.');
      navigationMap[cuttedName] = Path.join(urlPath, cuttedName);
      markdownMap.set(
        Path.join(urlPath, cuttedName),
        parse(md.render(content))
      );
    } else {
      console.log(`File could not be parsed: ${file}`);
    }
  }
};

module.exports = loadMarkdownFiles = (filePath) => {
  const markdownHTML = new Map();
  const navigationMap = {};
  convertMdFolder(
    Path.join(process.cwd(), filePath),
    markdownHTML,
    navigationMap,
    '/'
  );
  return [markdownHTML, navigationMap];
};
