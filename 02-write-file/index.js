const fs = require('fs');
const path = require('path');
const { stdin } = process;

console.log('Hello, what are we going write?');
const filePath = path.join(__dirname, 'text.txt');
let textFile = '';

stdin.on('data', (data) => {
  if (data.toString() === 'exit\n' || data.toString() === 'exit\r\n') exitScript();

  textFile += data;
  fs.writeFile(filePath, textFile, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  exitScript();
});

function exitScript() {
  console.log('\n Poka!');
  process.exit();
}
