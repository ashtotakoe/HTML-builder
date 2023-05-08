const fs = require('fs');
const path = require('path');
const { readdir, readFile, writeFile } = require('fs');
const fsPromise = require('fs/promises');

const templateFile = path.join(__dirname, 'template.html');
let projectDist = path.join(__dirname, 'project-dist');

fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) throw err;
  bundleCss();
});

fs.readFile(templateFile, 'utf-8', (err, data) => {
  if (err) throw err;
  let template = data;
  const componentsData = {};

  fs.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
    (err, files) => {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          fs.readFile(
            path.join(__dirname, 'components', file.name),
            'utf-8',
            (err, data) => {
              if (err) throw err;
              componentsData[path.basename(file.name, '.html')] = data;
              parseTemplate(componentsData, files.length, template);
            }
          );
        }
      });
    }
  );
});

function parseTemplate(componentsData, filesCount, template) {
  if (Object.keys(componentsData).length !== filesCount) return;

  let keywordsArr = [];
  let templateArr = template.split('');

  templateArr.forEach((elem, index) => {
    if (elem === '{' && template[index + 1] === '{') {
      let char = '';
      let counter = 2;
      let str = '';
      char = template[index + counter];
      while (char !== '}') {
        str += char;
        counter++;
        char = template[index + counter];
      }
      keywordsArr.push(str);
    }
  });

  keywordsArr.forEach((keyword) => {
    template = template.replace(`{{${keyword}}}`, componentsData[keyword]);
  });

  createDirs(template);
}

function bundleCss() {
  const bundle = path.join(__dirname, 'project-dist', 'style.css');
  const targetDir = path.join(__dirname, 'styles');
  let str = '';

  readdir(targetDir, { withFileTypes: true }, (err, arr) => {
    if (err) throw err;
    const styles = arr.filter(
      (style) => path.extname(style.name) === '.css' && style.isFile()
    );

    styles.forEach((style) => {
      readFile(path.join(targetDir, style.name), (err, buffer) => {
        if (err) throw err;
        str += buffer.toString();

        writeFile(bundle, str, (err) => {
          if (err) throw err;
        });
      });
    });
  });
}

async function createDirs(template) {
  const assets = path.join(__dirname, 'assets');
  const assetsDist = path.join(__dirname, 'project-dist', 'assets');

  await fsPromise.writeFile(path.join(projectDist, 'index.html'), template);

  await fsPromise.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });
  const assetsData = await fsPromise.readdir(assets, { withFileTypes: true });

  for await (const unit of assetsData) {
    const unitPath = path.join(assetsDist, unit.name);

    fs.mkdir(unitPath, { recursive: true }, (err) => {
      if (err) throw err;

      fs.readdir(
        path.join(__dirname, 'assets', unit.name),
        { withFileTypes: true },
        (err, data) => {
          if (err) throw err;

          data.forEach((file) => {
            fs.copyFile(
              path.join(assets, unit.name, file.name),
              path.join(unitPath, file.name),
              (err) => {
                if (err) throw err;
              }
            );
          });
        }
      );
    });
  }
}
