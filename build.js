const ejs = require('ejs');
const fs = require('fs');
const {promisify} = require('potpourri/dist/es5');

process.on('unhandledRejection', error => { throw error; });

const whenTemplate = promisify(fs.readFile)('index.ejs', 'utf8');

const imagesDir = 'images';
const whenImages = promisify(fs.readdir)(`public/${imagesDir}`).
    then(images => images.map(image => `${imagesDir}/${image}`));
    
Promise.all([whenTemplate, whenImages]).then(([template, images]) => {
    const html = ejs.render(template, {images});
    return promisify(fs.writeFile)('public/index.html', html);
});
