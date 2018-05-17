namespace feng3d.editor
{
    export var fs: EditorAssets1;

    // if (typeof require == "undefined")
    // {
    // } else
    // {
    //     fs = require(__dirname + "/io/file.js").file;
    //     // assets.fstype = FSType.native;
    // }


    export class EditorAssets1 extends ReadWriteAssets
    {
        constructor(readWriteFS?: ReadWriteFS)
        {
            super();
            if (readWriteFS)
                this.fs = readWriteFS;
        }

        /**
         * 创建项目
         */
        createproject(projectname: string, callback: () => void)
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
    }

    assets = fs = new EditorAssets1(indexedDBfs);

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