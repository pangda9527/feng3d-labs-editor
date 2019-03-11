interface NodeRequire { }
declare var require: NodeRequire;
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
         * 创建项目
         */
        createproject(projectname: string, callback: () => void)
        {
            this.fs.initproject(projectname, (err: Error) =>
            {
                var urls = [
                    ["resource/template/app.js", "app.js"],
                    ["resource/template/index.html", "index.html"],
                    ["resource/template/project.js", "project.js"],
                    ["resource/template/tsconfig.json", "tsconfig.json"],
                    ["resource/template/libs/feng3d.js", "libs/feng3d.js"],
                    ["resource/template/libs/feng3d.d.ts", "libs/feng3d.d.ts"],
                ];
                var index = 0;
                var loadUrls = () =>
                {
                    if (index >= urls.length) { callback(); return; }
                    feng3d.loader.loadText(urls[index][0], (content) =>
                    {
                        this.fs.writeString(urls[index][1], content, (err) =>
                        {
                            if (err) feng3d.warn(err);
                            index++;
                            loadUrls();
                        });

                    }, null, (e) =>
                        {
                            feng3d.warn(e);
                            index++;
                            loadUrls();
                        });
                }
                loadUrls();
            });
        }

        upgradeProject(callback: () => void)
        {
            var urls = [
                ["resource/template/libs/feng3d.js", "libs/feng3d.js"],
                ["resource/template/libs/feng3d.d.ts", "libs/feng3d.d.ts"],
            ];
            var index = 0;
            var loadUrls = () =>
            {
                if (index >= urls.length) { callback(); return; }
                feng3d.loader.loadText(urls[index][0], (content) =>
                {
                    this.fs.writeString(urls[index][1], content, (err) =>
                    {
                        if (err) feng3d.warn(err);
                        index++;
                        loadUrls();
                    });

                }, null, (e) =>
                    {
                        feng3d.warn(e);
                        index++;
                        loadUrls();
                    });
            }
            loadUrls();
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
            this.fs.getAllfilepathInFolder("", (err, filepaths) =>
            {
                readfiles();
                function readfiles()
                {
                    if (filepaths.length > 0)
                    {
                        var filepath = filepaths.shift();
                        this.fs.readArrayBuffer(filepath, (err, data: ArrayBuffer) =>
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
                            this.fs.mkdir(filepath, (err) =>
                            {
                                writeFiles();
                            });
                        } else
                        {
                            zip.file(filepath).async("arraybuffer").then((data) =>
                            {
                                this.fs.writeArrayBuffer(filepath, data, (err) =>
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

    if (typeof require == "undefined")
    {
        feng3d.fs = feng3d.indexedDBFS;
        feng3d.rs = editorRS = new EditorRS();
    } else
    {
        var nativeFS = require(__dirname + "/native/NativeFSBase.js").nativeFS;
        feng3d.fs = new NativeFS(nativeFS);
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