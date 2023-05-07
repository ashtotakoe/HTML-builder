const fs = require('fs');
const path = require('path');
let filesArr = [];
const targetDir = path.join(__dirname, 'secret-folder');
fs.readdir(targetDir, { withFileTypes: true }, (err, files) => {
  filesArr = files;
  fileChecker();
});

const fileChecker = () => {
  filesArr.forEach((file) => {
    if (!file.isDirectory()) {
      fs.stat(path.join(targetDir, file.name), (err, stat) => {
        if (err) throw err;
        console.log(
          path.parse(path.join(targetDir, file.name)).name +
            ' - ' +
            path.extname(file.name).slice(1) +
            ' - ' +
            stat.size / 1024 +
            'kb'
        );
      });
    }
  });
};
