namespace feng3d.editor
{
    var zip: JSZip;
    var _projectname: string;

    export var zipfs: FS = {
        hasProject(projectname: string, callback: (has: boolean) => void)
        {
            callback(false);
        },
        getProjectList(callback: (err: Error, projects: string[]) => void)
        {
            callback(null, []);
        },
        /**
         * 创建项目
         */
        createproject(projectname: string, callback: () => void)
        {
            _projectname = projectname;
            zip = new JSZip();
            var request = new XMLHttpRequest();
            request.open('Get', "./templates/template.zip", true);
            request.responseType = "arraybuffer";
            request.onload = (ev) =>
            {
                zip.loadAsync(request.response).then((value) =>
                {
                    callback();
                });
            };
            request.onerror = (ev) =>
            {
                error(request.responseURL + "不存在，无法初始化项目！");
            }
            request.send();
        },
        initproject(projectname: string, callback: () => void)
        {
            _projectname = projectname;
            callback();
        },
        //
        stat(path: string, callback: (err: { message: string; }, stats: FileInfo) => void): void
        {
            var file = zip.files[path] || zip.files[path + "/"];
            if (file)
            {
                var fileInfo = {
                    path: path,
                    size: 0/*file.size*/,
                    isDirectory: file.dir,
                    birthtime: file.date.getTime(),
                    mtime: file.date.getTime(),
                }
                callback(null, fileInfo);
            } else
            {
                callback({ message: path + " 不存在" }, null);
            }
        },
        readdir(path: string, callback: (err: { message: string; }, files: string[]) => void): void
        {
            var allfilepaths = Object.keys(zip.files);
            var subfilemap = {};
            allfilepaths.forEach(element =>
            {
                var result = new RegExp(path + "\\/([\\w.]+)\\b").exec(element);
                if (result != null)
                {
                    subfilemap[result[1]] = 1;
                }
            });
            var files = Object.keys(subfilemap);
            callback(null, files);
        },
        writeFile(path: string, data: string, callback?: (err: { message: string; }) => void): void
        {
            try
            {
                zip.file(path, data);
                callback && callback(null);
            } catch (error)
            {
                callback && callback(error);
            }
        },
        readFile(path: string, encoding: string, callback: (err: { message: string; }, data: string) => void): void
        {
            try
            {
                zip.file(path).async("string").then((data) =>
                {
                    callback(null, data);
                }, (reason) =>
                    {
                        callback(reason, null);
                    });
            } catch (error)
            {
                callback(error, null);
            }
        },
        mkdir(path: string, callback: (err: { message: string; }) => void): void
        {
            zip.folder(path);
            callback(null);
        },
        rename(oldPath: string, newPath: string, callback: (err: { message: string; }) => void): void
        {
            try
            {
                zip.file(oldPath).async("arraybuffer").then((value) =>
                {
                    zip.file(newPath, value);
                    zip.remove(oldPath);
                    callback && callback(null);
                }, (reason) =>
                    {
                        callback && callback(reason);
                    });
            } catch (error)
            {
                callback && callback(error);
            }
        },
        move(src: string, dest: string, callback?: (err: { message: string; }, destfileinfo: FileInfo) => void): void
        {
            try
            {
                var srcstats = zip.file(src);
                var destexists = zip.file(dest);
                if (destexists && !destexists.dir)
                {
                    zip.remove(dest);
                }
                if (srcstats.dir)
                {
                    if (!destexists)
                        zip.folder(dest);
                    var files = Object.keys(zip.folder(src).files);
                    files.forEach((file, index) =>
                    {
                        zipfs.move(src + "/" + file, dest + "/" + file);
                    });
                    zip.remove(src);
                }
                else
                {
                    //使用重命名移动文件
                    zipfs.rename(src, dest, null)
                }
                if (callback)
                {
                    zipfs.stat(dest, (err, destfileinfo) =>
                    {
                        callback(null, destfileinfo);
                    });
                }
            } catch (error)
            {
                callback && callback(error, null);
            }
        },
        remove(path: string, callback?: (err: { message: string; }) => void): void
        {
            try
            {
                var file = zip.file(path);
                if (file.dir)
                {
                    //返回文件和子目录的数组
                    var files = Object.keys(zip.folder(path).files);
                    files.forEach(function (file, index)
                    {
                        zipfs.remove(path + "/" + file, null);
                    });
                    //清除文件夹
                    zip.remove(path);
                }
                else
                {
                    zip.remove(path);
                }
                callback && callback(null);
            } catch (error)
            {
                callback && callback(error);
            }
        },
        /**
         * 获取文件绝对路径
         */
        getAbsolutePath(path: string, callback: (err, absolutePath: string) => void): void
        {
            callback(null, null);
        }
    };
}