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
         * 初始化项目
         * 
         * @param callback 完成回调
         */
        initproject(callback: (err?: Error) => void)
        {
            this.fs.hasProject(editorcache.projectname, (has) =>
            {
                this.fs.initproject(editorcache.projectname, (err: Error) =>
                {
                    if (err) { callback(err); return; }
                    if (has) { callback(); return; }
                    this.createproject(callback);
                });
            });
        }

        /**
         * 创建项目
         */
        private createproject(callback: (err?: Error) => void)
        {
            var urls = [
                ["resource/template/.vscode/settings.json", ".vscode/settings.json"],
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
                        if (err) throw err;
                        index++;
                        loadUrls();
                    });

                }, null, (e) =>
                {
                    throw e;
                    index++;
                    loadUrls();
                });
            }
            loadUrls();
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
                        if (err) console.warn(err);
                        index++;
                        loadUrls();
                    });

                }, null, (e) =>
                {
                    console.warn(e);
                    index++;
                    loadUrls();
                });
            }
            loadUrls();
        }

        /**
         * 选择文件
         * 
         * @param callback 完成回调
         */
        selectFile(callback: (file: FileList) => void)
        {
            selectFileCallback = callback;
            isSelectFile = true;
        }

        /**
         * 导出项目为zip压缩包
         * 
         * @param filename 导出后压缩包名称
         * @param callback 完成回调
         */
        exportProjectToJSZip(filename: string, callback?: () => void)
        {
            this.fs.getAllPathsInFolder("", (err, filepaths) =>
            {
                if (err)
                {
                    console.error(err);
                    callback && callback();
                    return;
                }
                this.exportFilesToJSZip(filename, filepaths, callback);
            });
        }

        /**
         * 导出指定文件夹为zip压缩包
         * 
         * @param filename 导出后压缩包名称
         * @param folderpath 需要导出的文件夹路径
         * @param callback 完成回调
         */
        exportFolderToJSZip(filename: string, folderpath: string, callback: () => void)
        {
            this.fs.getAllPathsInFolder(folderpath, (err, filepaths) =>
            {
                if (err)
                {
                    console.error(err);
                    callback && callback();
                    return;
                }
                this.exportFilesToJSZip(filename, filepaths, callback);
            });
        }

        /**
         * 导出文件列表为zip压缩包
         * 
         * @param filename 导出后压缩包名称
         * @param filepaths 需要导出的文件列表
         * @param callback 完成回调
         */
        exportFilesToJSZip(filename: string, filepaths: string[], callback?: () => void)
        {
            var zip = new JSZip();
            var fns = filepaths.map(p => (callback) =>
            {
                this.fs.isDirectory(p, (result) =>
                {
                    if (result)
                    {
                        zip.folder(p);
                        callback();
                    } else
                    {
                        this.fs.readArrayBuffer(p, (err, data) =>
                        {
                            //处理文件夹
                            data && zip.file(p, data);
                            callback();
                        });
                    }
                });
            });
            feng3d.task.parallel(fns)(() =>
            {
                zip.generateAsync({ type: "blob" }).then(function (content)
                {
                    saveAs(content, filename);
                    callback && callback();
                });
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

                var fns = filepaths.map(p => (callback) =>
                {
                    if (value.files[p].dir)
                    {
                        this.fs.mkdir(p, (err) =>
                        {
                            callback();
                        });
                    } else
                    {
                        zip.file(p).async("arraybuffer").then((data) =>
                        {
                            this.fs.writeFile(p, data, (err) =>
                            {
                                callback();
                            });
                        }, (reason) =>
                        {
                        });
                    }
                });

                feng3d.task.series(fns)(callback);
            });
        }
    }

    if (supportNative)
    {
        feng3d.basefs = new NativeFS(nativeFS);
    } else
    {
        feng3d.basefs = feng3d.indexedDBFS;
    }
    feng3d.fs = new feng3d.ReadWriteFS();
    feng3d.rs = editorRS = new EditorRS();

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