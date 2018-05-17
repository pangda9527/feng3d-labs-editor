namespace feng3d.editor
{
    export var fs: EditorFS;
    if (typeof require == "undefined")
    {
        fs = <EditorFS>indexedDBfs;
        assets.fstype = FSType.indexedDB;
    } else
    {
        fs = require(__dirname + "/io/file.js").file;
        assets.fstype = FSType.native;
    }

    export interface EditorFS extends FS
    {
        /**
         * 创建项目
         */
        createproject(projectname: string, callback: () => void);
        selectFile?: (callback: (file: FileList) => void) => void;
        /**
         * 导出项目
         */
        exportProject?(callback: (err: Error, data: Blob) => void);
        /**
         * 导入项目
         */
        importProject?(file: File, callback: () => void);
        /**
         * 监听编译脚本
         */
        watchCompileScript?(callback: () => void);
    }

    (() =>
    {
        /**
         * 创建项目
         */
        fs.createproject = (projectname: string, callback: () => void) =>
        {
            fs.initproject(projectname, () =>
            {
                //
                var zip = new JSZip();
                var request = new XMLHttpRequest();
                request.open('Get', editorData.getEditorAssetsPath("templates/template.zip"), true);
                request.responseType = "arraybuffer";
                request.onload = (ev) =>
                {
                    zip.loadAsync(request.response).then(() =>
                    {
                        var filepaths = Object.keys(zip.files);
                        filepaths.sort();

                        readfiles()
                        /**
                         * 读取zip中所有文件
                         */
                        function readfiles()
                        {
                            if (filepaths.length > 0)
                            {
                                var filepath = filepaths.shift();
                                var file = zip.files[filepath];
                                if (file.dir)
                                {
                                    fs.mkdir(filepath, readfiles);
                                } else
                                {
                                    file.async("arraybuffer").then((data) =>
                                    {
                                        fs.writeFile(filepath, data, readfiles);
                                    }, (reason) =>
                                        {
                                            console.warn(reason);
                                            readfiles();
                                        });
                                }
                            } else
                            {
                                if (fs.watchCompileScript)
                                {
                                    fs.watchCompileScript(callback);
                                    return;
                                }
                                callback();
                            }
                        }
                    });
                };
                request.onerror = (ev) =>
                {
                    error(request.responseURL + "不存在，无法初始化项目！");
                }
                request.send();
            });
        }
    })();

    (() =>
    {
        var isSelectFile = false;

        fs.selectFile = (callback: (file: FileList) => void) =>
        {
            selectFileCallback = callback;
            isSelectFile = true;
        }

        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = "none";
        fileInput.addEventListener('change', function (event)
        {
            selectFileCallback && selectFileCallback(fileInput.files);
            selectFileCallback = null;
            fileInput.value = null;
        });
        // document.body.appendChild(fileInput);
        window.addEventListener("click", () =>
        {
            if (isSelectFile)
                fileInput.click();
            isSelectFile = false;
        });

        var selectFileCallback: (file: FileList) => void;
    })();

    (() =>
    {
        if (!fs.exportProject)
        {
            fs.exportProject = readdirToZip;

            function readdirToZip(callback: (err: Error, data: Blob) => void)
            {
                var zip = new JSZip();
                fs.getAllfilepathInFolder("", (err, filepaths) =>
                {
                    readfiles();
                    function readfiles()
                    {
                        if (filepaths.length > 0)
                        {
                            var filepath = filepaths.shift();
                            fs.readFile(filepath, (err, data: ArrayBuffer) =>
                            {
                                //处理文件夹
                                data && zip.file(filepath, data);
                                readfiles();
                            });
                        } else
                        {
                            zip.generateAsync({ type: "blob" }).then(function (content)
                            {
                                callback(null, content);
                            });
                        }
                    }
                });
            }
        }
    })();
    (() =>
    {
        fs.importProject = (file: File, callback: () => void) =>
        {
            var zip = new JSZip();
            zip.loadAsync(file).then((value) =>
            {
                var filepaths = Object.keys(value.files);
                filepaths.sort();

                writeFiles();

                function writeFiles()
                {
                    if (filepaths.length > 0)
                    {
                        var filepath = filepaths.shift();
                        if (value.files[filepath].dir)
                        {
                            fs.mkdir(filepath, (err) =>
                            {
                                writeFiles();
                            });
                        } else
                        {
                            zip.file(filepath).async("arraybuffer").then((data) =>
                            {
                                fs.writeFile(filepath, data, (err) =>
                                {
                                    writeFiles();
                                });
                            }, (reason) =>
                                {
                                });
                        }
                    } else
                    {
                        callback();
                    }
                }
            });
        }
    })();

    export type FileInfo = { path: string, birthtime: number, mtime: number, isDirectory: boolean, size: number };

    export interface FS
    {
        hasProject(projectname: string, callback: (has: boolean) => void): void;
        getProjectList(callback: (err: Error | null, projects: string[] | null) => void): void;
        initproject(projectname: string, callback: () => void): void;
        stat(path: string, callback: (err: Error | null, stats: FileInfo | null) => void): void;
        readdir(path: string, callback: (err: Error | null, files: string[] | null) => void): void;
        writeFile(path: string, data: ArrayBuffer, callback?: ((err: Error | null) => void) | undefined): void;
        /**
         * 读取文件为字符串
         */
        readFileAsString(path: string, callback: (err: Error | null, data: string | null) => void): void;
        /**
         * 读取文件为Buffer
         */
        readFile(path: string, callback: (err: Error | null, data: ArrayBuffer | undefined) => void): void;
        mkdir(path: string, callback: (err: Error | null) => void): void;
        rename(oldPath: string, newPath: string, callback: (err: Error | null) => void): void;
        move(src: string, dest: string, callback?: ((err: Error | null) => void) | undefined): void;
        remove(path: string, callback?: ((err: Error | null) => void) | undefined): void;
        /**
         * 获取文件绝对路径
         */
        getAbsolutePath(path: string, callback: (err: Error | null, absolutePath: string | null) => void): void;
        /**
         * 获取指定文件下所有文件路径列表
         */
        getAllfilepathInFolder(dirpath: string, callback: (err: Error | null, filepaths: string[] | null) => void): void;
    }
}