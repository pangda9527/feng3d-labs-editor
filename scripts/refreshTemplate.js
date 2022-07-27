// 拷贝文件到 template 网站

const fs = require('fs-extra');

const copyFiles = [
    // feng3d
    ['node_modules/feng3d/dist/index.js', 'resource/template/libs/feng3d.js'],
    ['node_modules/feng3d/dist/index.d.ts', 'resource/template/libs/feng3d.d.ts'],

    ['node_modules/@feng3d/cannon/dist/index.js', 'resource/template/libs/cannon.js'],
    ['node_modules/@feng3d/cannon/dist/index.d.ts', 'resource/template/libs/cannon.d.ts'],

    ['node_modules/@feng3d/cannon-plugin/dist/index.js', 'resource/template/libs/cannon-plugin.js'],
    ['node_modules/@feng3d/cannon-plugin/dist/index.d.ts', 'resource/template/libs/cannon-plugin.d.ts'],
];

try
{
    copyFiles.forEach((element) =>
    {
        fs.copySync(element[0], element[1]);
    });
    console.log('success!');
}
catch (err)
{
    console.error(err);
}
