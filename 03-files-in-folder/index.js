const fs = require('fs');
const path = require('path');

// путь к папке, содержимое которой нужно обработать
const folderPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.promises.stat(filePath); // получаем информацию о файле
        const ext = path.extname(file.name).slice(1); // расширение файла
        const name = path.basename(file.name, `.${ext}`); // имя файла без расширения
        console.log(`${name} - ${ext} - ${stats.size} bytes`);
      }
    }
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
})();
