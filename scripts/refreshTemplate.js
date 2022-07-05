// 拷贝文件到 template 网站

const fs = require('fs-extra')

var copyFiles = [
    // feng3d
    ['../feng3d/out/feng3d.js', 'resource/template/libs/feng3d.js'],
    ['../feng3d/out/feng3d.d.ts', 'resource/template/libs/feng3d.d.ts'],

    ['../feng2d/out/feng2d.js', 'resource/template/libs/feng2d.js'],
    ['../feng2d/out/feng2d.d.ts', 'resource/template/libs/feng2d.d.ts'],

    ['../cannon/out/cannon.js', 'resource/template/libs/cannon.js'],
    ['../cannon/out/cannon.d.ts', 'resource/template/libs/cannon.d.ts'],

    ['../cannon-plugin/out/cannon-plugin.js', 'resource/template/libs/cannon-plugin.js'],
    ['../cannon-plugin/out/cannon-plugin.d.ts', 'resource/template/libs/cannon-plugin.d.ts'],
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