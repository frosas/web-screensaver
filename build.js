const ejs = require('ejs');
const fs = require('fs');
const {promisify} = require('potpourri/dist/es5');
const path = require('path');

process.on('unhandledRejection', error => { throw error; });

const whenTemplate = promisify(fs.readFile)('index.ejs', 'utf8');

const imagesDir = 'images';
const whenImages = promisify(fs.readdir)(`public/${imagesDir}`).then(file => {
    return file.filter(file => isImage(file)).map(file => `${imagesDir}/${file}`);
});
    
Promise.all([whenTemplate, whenImages]).then(([template, images]) => {
    const html = ejs.render(template, {images});
    return promisify(fs.writeFile)('public/index.html', html);
});

const isImage = file => ['.gif', '.jpg', '.png'].includes(path.extname(file));