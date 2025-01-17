const fs = require('fs'); // подключение модуля fs
const path = require('path'); // подключение модуля path

// путь к файлу text.txt
const filePath = path.join(__dirname, 'text.txt');

// создание потока для чтения файла
const readStream = fs.createReadStream(filePath, 'utf-8');

// обработка события потока
readStream.on('data', function (chunk) {
  console.log(chunk.toString());
});

readStream.on('error', (err) => {
  console.error('Ошибка при чтении файла:', err.message);
});
