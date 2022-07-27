const fs = require('fs-extra');

const copyfiles = [
    'dist',
    'libs',
    'src',
    'projects',
    'resource',
    'packages',
    'codeeditor.html',
    'codeeditor.js',
    'favicon.ico',
    'index.html',
    'index.js',
    'run.html',
    'run.js'
];

copyfiles.forEach((v) =>
{
    fs.copy(v, `public/${v}`);
});
