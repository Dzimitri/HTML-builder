const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true }); // создание папки, если ее нет
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath); // копируем папку
      } else {
        await fs.copyFile(srcPath, destPath); // копируем файл
      }
    }
    console.log(`Директория "${src}" успешно скопирована в "${dest}"`);
  } catch (err) {
    console.error(`Ошибка при копировании: ${err.message}`);
  }
}

const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');
copyDirectory(source, destination);
