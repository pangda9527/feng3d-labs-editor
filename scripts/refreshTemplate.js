// 拷贝文件到 template 网站

const fs = require('fs-extra')

var copyFiles = [
    // feng3d
    ['../feng3d/dist/index.js', 'resource/template/libs/feng3d.js'],
    ['../feng3d/dist/index.d.ts', 'resource/template/libs/feng3d.d.ts'],

    ['../cannon/dist/index.js', 'resource/template/libs/cannon.js'],
    ['../cannon/dist/index.d.ts', 'resource/template/libs/cannon.d.ts'],

    ['../cannon-plugin/dist/index.js', 'resource/template/libs/cannon-plugin.js'],
    ['../cannon-plugin/dist/index.d.ts', 'resource/template/libs/cannon-plugin.d.ts'],
];

try
{
    copyFiles.forEach(element =>
    {
        fs.copySync(element[0], element[1])
    });
    console.log('success!')
} catch (err)
{
    console.error(err)
}