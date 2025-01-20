const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const assetsSrcPath = path.join(__dirname, 'assets');
const assetsDestPath = path.join(projectDistPath, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const outputHtmlPath = path.join(projectDistPath, 'index.html');
const outputCssPath = path.join(projectDistPath, 'style.css');

// создание папки project-dist
async function createProjectDist() {
  await fs.promises.rm(projectDistPath, { recursive: true, force: true });
  await fs.promises.mkdir(projectDistPath, { recursive: true });
}

// копирование папки assets
async function copyAssets(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const items = await fs.promises.readdir(src, { withFileTypes: true });
  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

// объединение стилей
async function mergeStyles() {
  const files = await fs.promises.readdir(stylesPath, { withFileTypes: true });
  const writeStream = fs.createWriteStream(outputCssPath);
  for (const file of files) {
    const filePath = path.join(stylesPath, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      writeStream.write(data + '\n');
    }
  }
  writeStream.end();
}

// генерация HTML
async function generateHtml() {
  let template = await fs.promises.readFile(templatePath, 'utf-8');
  const components = await fs.promises.readdir(componentsPath, {
    withFileTypes: true,
  });
  for (const component of components) {
    if (component.isFile() && path.extname(component.name) === '.html') {
      const componentName = path.basename(component.name, '.html');
      const componentContent = await fs.promises.readFile(
        path.join(componentsPath, component.name),
        'utf-8',
      );
      template = template.replace(`{{${componentName}}}`, componentContent);
    }
  }
  await fs.promises.writeFile(outputHtmlPath, template, 'utf-8');
}

// основная функция
async function buildPage() {
  try {
    console.log('Начало сборки...');
    await createProjectDist();
    console.log('Папка project-dist создана.');
    await copyAssets(assetsSrcPath, assetsDestPath);
    console.log('Папка assets скопирована.');
    await mergeStyles();
    console.log('CSS-файлы объединены.');
    await generateHtml();
    console.log('HTML-файл сгенерирован.');
    console.log('Сборка завершена!');
  } catch (error) {
    console.error('Ошибка при сборке:', error);
  }
}

// запуск сборки
buildPage();
