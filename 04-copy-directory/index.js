const { mkdir, copyFile, readdir } = require('fs/promises');
const path = require('path');

const targetFolder = path.join(__dirname, 'files');
const folderPath = path.join(__dirname, 'dir');

async function makeDir() {
  try {
    const folder = await mkdir(folderPath, { recursive: true });
    console.log(folder);
    copyToDir();
  } catch (err) {
    console.error(err.message);
  }
}
async function copyToDir() {
  try {
    const files = await readdir(targetFolder, { withFileTypes: true });

    files.forEach((file) => {
      console.log(file);
      copyFile(
        path.join(targetFolder, file.name),
        path.join(folderPath, file.name)
      );
    });
  } catch (err) {
    console.error(err.message);
  }
}
makeDir();
