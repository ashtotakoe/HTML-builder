const fs = require('fs');
const path = require('path');
const { stdin } = process;

console.log('Hello, what are we going write?');
const filePath = path.join(__dirname, 'text.txt');
let textFile = '';

stdin.on('data', (data) => {
  textFile += data;
  fs.writeFile(filePath, textFile, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  console.log('\n Poka!');
  process.exit();
});
