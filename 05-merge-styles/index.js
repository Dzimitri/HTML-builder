const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

// функция для объединения стилей
function mergeStyles() {
  // создание выходного потока записи
  const writeStream = fs.createWriteStream(outputFile);

  // чтение директории с файлами стилей
  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    // фильтруются только файлы .css
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    // чтение каждого CSS-файл и записи в bundle.css
    cssFiles.forEach((file, index) => {
      const filePath = path.join(stylesDir, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');

      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });

      readStream.on('end', () => {
        if (index === cssFiles.length - 1) {
          // закрытие потока записи после обработки последнего файла
          writeStream.end();
          console.log('Стили успешно объединены!');
        }
      });

      readStream.on('error', (err) => {
        console.error(`Ошибка чтения файла ${file.name}:`, err);
      });
    });
  });
}

// проверка наличия папки project-dist и вызываем функцию
fs.mkdir(outputDir, { recursive: true }, (err) => {
  if (err) throw err;
  mergeStyles();
});
