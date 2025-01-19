// подключение модулей
const fs = require('fs');
const path = require('path');

// настройка записи в файл
const outputPath = path.join(__dirname, 'output.txt'); //объединяет путь к файлу
const output = fs.createWriteStream(outputPath); // создает поток для записи данных в файл

process.stdout.write('Hi, how are you?\n'); // process.stdout выводит сообщение в консоль

// process.stdin для получения данных из консоли
// process.stdin.on('data') слушает ввод пользователя
process.stdin.on('data', (data) => {
  const text = data.toString().trim(); // преобразует ввод в строку и удаляет пробелы по краям
  if (text.toLowerCase() === 'exit') {
    process.stdout.write('See you later.\n');
    process.exit();
  }
  output.write(text + '\n');
});
// обработчик ошибок
output.on('error', (err) => {
  console.error('An error occurred while writing:', err.message);
});
