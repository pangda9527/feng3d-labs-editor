declare function require(module: string): any;
declare var __dirname: string;

namespace editor
{
    /**
     * 编辑器资源系统
     */
    export var editorRS: EditorRS;

    /**
     * 编辑器资源系统
     */
    export class EditorRS extends feng3d.ReadWriteRS
    {

        /**
         * 是否存在指定项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        hasProject(projectname: string, callback: (has: boolean) => void)
        {
            var readWriteFS = this.fs;
            if (readWriteFS instanceof feng3d.IndexedDBFS)
            {
                feng3d._indexedDB.hasObjectStore(readWriteFS.DBname, projectname, callback);
            } else if (readWriteFS["getProjectList"] != null)
            {
                readWriteFS["getProjectList"]((err: Error, projects: string[]) =>
                {
                    if (err)
                        throw err;
                    callback(projects.indexOf(projectname) != -1);
                });
            } else
            {
                throw "未完成 hasProject 功能！";
            }
        }

        /**
         * 获取项目列表
         * @param callback 回调函数
         */
        getProjectList(callback: (err: Error, projects: string[]) => void)
        {
            var readWriteFS = this.fs;
            if (readWriteFS instanceof feng3d.IndexedDBFS)
            {
                feng3d._indexedDB.getObjectStoreNames(readWriteFS.DBname, callback)
            } else if (readWriteFS["getProjectList"] != null)
            {
                readWriteFS["getProjectList"](callback);
            } else
            {
                throw "未完成 hasProject 功能！";
            }
        }

        /**
         * 初始化项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        initproject(projectname: string, callback: () => void)
        {
            var readWriteFS = this.fs;
            if (readWriteFS instanceof feng3d.IndexedDBFS)
            {
                feng3d._indexedDB.createObjectStore(readWriteFS.DBname, projectname, (err) =>
                {
                    if (err)
                    {
                        feng3d.warn(err);
                        return;
                    }
                    readWriteFS.projectname = projectname;
                    // todo 启动监听 ts代码变化自动编译
                    callback();
                });
            } else if (readWriteFS.type == feng3d.FSType.native)
            {
                readWriteFS.projectname = projectname;
                readWriteFS.mkdir("", (err) =>
                {
                    if (err)
                        feng3d.error(err);
                    callback();
                });

            } else
            {
                throw "未完成 hasProject 功能！";
            }
        }

        /**
         * 创建项目
         */
        createproject(projectname: string, callback: () => void)
        {
            editorRS.initproject(projectname, () =>
            {
                //
                var zip = new JSZip();
                var request = new XMLHttpRequest();
                request.open('Get', editorData.getEditorAssetPath("templates/template.zip"), true);
                request.responseType = "arraybuffer";
                request.onload = (ev) =>
                {
                    zip.loadAsync(request.response).then(() =>
                    {
                        var filepaths = Object.keys(zip.files);
                        filepaths.sort();

                        readfiles(zip, filepaths, callback)
                    });
                };
                request.onerror = (ev) =>
                {
                    feng3d.error(request.responseURL + "不存在，无法初始化项目！");
                }
                request.send();
            });
        }

        upgradeProject(callback: () => void)
        {
            //
            var zip = new JSZip();
            var request = new XMLHttpRequest();
            request.open('Get', editorData.getEditorAssetPath("templates/template.zip"), true);
            request.responseType = "arraybuffer";
            request.onload = (ev) =>
            {
                zip.loadAsync(request.response).then(() =>
                {
                    var filepaths = Object.keys(zip.files);
                    filepaths = filepaths.filter((item) =>
                    {
                        if (item.indexOf("project.js") != -1)
                            return false;
                        if (item.indexOf("default.scene.json") != -1)
                            return false;
                        return true;
                    });
                    filepaths.sort();

                    readfiles(zip, filepaths, callback)

                });
            };
            request.onerror = (ev) =>
            {
                feng3d.error(request.responseURL + "不存在，无法初始化项目！");
            }
            request.send();
        }

        selectFile(callback: (file: FileList) => void)
        {
            selectFileCallback = callback;
            isSelectFile = true;
        }

        /**
         * 导出项目
         */
        exportProject(callback: (err: Error, data: Blob) => void)
        {
            var zip = new JSZip();
            editorRS.fs.getAllfilepathInFolder("", (err, filepaths) =>
            {
                readfiles();
                function readfiles()
                {
                    if (filepaths.length > 0)
                    {
                        var filepath = filepaths.shift();
                        editorRS.fs.readArrayBuffer(filepath, (err, data: ArrayBuffer) =>
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
        /**
         * 导入项目
         */
        importProject(file: File, callback: () => void)
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
                            editorRS.fs.mkdir(filepath, (err) =>
                            {
                                writeFiles();
                            });
                        } else
                        {
                            zip.file(filepath).async("arraybuffer").then((data) =>
                            {
                                editorRS.fs.writeArrayBuffer(filepath, data, (err) =>
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
    }

    /**
     * 读取zip中所有文件到 fs
     */
    function readfiles(zip: JSZip, filepaths: string[], callback: () => void)
    {
        if (filepaths.length > 0)
        {
            var filepath = filepaths.shift();
            var file = zip.files[filepath];
            if (file.dir)
            {
                editorRS.fs.mkdir(filepath, (err) =>
                {
                    readfiles(zip, filepaths, callback);
                });
            } else
            {
                if (feng3d.regExps.image.test(filepath))
                {
                    file.async("arraybuffer").then((data) =>
                    {
                        editorRS.fs.writeArrayBuffer(filepath, data, (err: Error) =>
                        {
                            if (err)
                                console.log(err);
                            readfiles(zip, filepaths, callback)
                        });
                    }, (reason) =>
                        {
                            console.warn(reason);
                            readfiles(zip, filepaths, callback);
                        });
                } else
                {
                    file.async("string").then((data) =>
                    {
                        editorRS.fs.writeString(filepath, data, (err: Error) =>
                        {
                            if (err)
                                console.log(err);
                            readfiles(zip, filepaths, callback)
                        });
                    }, (reason) =>
                        {
                            console.warn(reason);
                            readfiles(zip, filepaths, callback);
                        });
                }
            }
        } else
        {
            callback();
        }
    }

    if (typeof require == "undefined")
    {
        feng3d.fs = feng3d.indexedDBFS;
        feng3d.rs = editorRS = new EditorRS();
    } else
    {
        var nativeFS = require(__dirname + "/io/NativeFS.js").nativeFS;
        feng3d.fs = nativeFS;
        feng3d.rs = editorRS = new EditorRS();
    }

    //
    var isSelectFile = false;
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
}