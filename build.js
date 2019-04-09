'use strict';

// var build = require("@feng3d/build");
var build = require("./node_modules/@feng3d/build/out/index");

var process = require('child_process');
var fs = require("fs");
var path = require("path");


watchcopyDir("../feng3d/out", "resource/template/libs");

/**
 * Watch for changes in TypeScript
 */
build.watchProject([
    { path: __dirname, }
]);

function watchcopyDir(srcdir, destdir)
{
    var realsrcdir = path.join(__dirname, srcdir);
    var realdestdir = path.join(__dirname, destdir);
    fs.readdir(realsrcdir, (err, files) =>
    {
        if (err) return;
        files.forEach(element =>
        {
            var src = `${realsrcdir}/${element}`;
            var dest = `${realdestdir}/${element}`;
            watchCopyFile(src, dest);
        });
    });

    function watchCopyFile(src, dest)
    {
        if (fs.existsSync(src))
        {
            fs.watchFile(src, () =>
            {
                copyfile();
            });
            copyfile();
        }
        function copyfile()
        {
            var str = fs.readFileSync(src, "utf8");
            if (src.indexOf(".js.map") != -1)
            {
                str = str.replace(`"sourceRoot":""`, `"sourceRoot":"../${srcdir}/"`);
            }
            fs.writeFileSync(dest, str, "utf8");
        }
    }
}