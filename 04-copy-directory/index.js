const { mkdir, copyFile, readdir } = require('fs/promises');
const path = require('path');

const targetFolder = path.join(__dirname, 'files');
const folderPath = path.join(__dirname, 'files-copy');

async function makeDir() {
  try {
    await mkdir(folderPath, { recursive: true });

    copyToDir();
  } catch (err) {
    console.error(err.message);
  }
}
async function copyToDir() {
  try {
    const files = await readdir(targetFolder, { withFileTypes: true });

    files.forEach((file) => {
      if (file.isFile()) {
        copyFile(
          path.join(targetFolder, file.name),
          path.join(folderPath, file.name)
        );
      }
    });
  } catch (err) {
    console.error(err.message);
  }
}
makeDir();
