const path = require('path');
const { readdir, readFile, writeFile } = require('fs');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
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
