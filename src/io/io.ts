namespace feng3d.editor
{
    export var fs: FS;
    if (typeof require == "undefined")
    {
        fs = zipfs;
    } else
    {
        fs = require(__dirname + "/io/file.js").file;
    }

    export type FileInfo = { path: string, birthtime: number, mtime: number, isDirectory: boolean, size: number };

    export interface FS
    {
        hasProject(projectname: string, callback: (has: boolean) => void);
        getProjectList(callback: (err: Error, projects: string[]) => void);
        /**
         * 创建项目
         */
        createproject(projectname: string, callback: () => void);
        initproject(projectname: string, callback: () => void);
        selectFile?: (callback: (file: FileList) => void, param?: Object) => void;
        //
        stat(path: string, callback: (err: { message: string; }, stats: FileInfo) => void): void;
        readdir(path: string, callback: (err: { message: string; }, files: string[]) => void): void;
        writeFile(path: string, data: string | ArrayBuffer | Uint8Array, callback?: (err: { message: string; }) => void): void;
        readFile(path: string, encoding: "utf8" | "buffer", callback: (err: { message: string; }, data: string | Buffer) => void): void;
        mkdir(path: string, callback: (err: { message: string; }) => void): void;
        rename(oldPath: string, newPath: string, callback: (err: { message: string; }) => void): void;
        move(src: string, dest: string, callback?: (err: { message: string; }, destfileinfo: FileInfo) => void): void;
        remove(path: string, callback?: (err: { message: string; }) => void): void;
        /**
         * 获取文件绝对路径
         */
        getAbsolutePath(path: string, callback: (err, absolutePath: string) => void): void;
        /**
         * 获取指定文件下所有文件路径列表
         */
        getAllfilepathInFolder(dirpath: string, callback: (err: Error, filepaths: string[]) => void): void;
        /**
         * 导出项目
         */
        exportProject(callback: (err: Error, data: Blob) => void);
    }

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
                            fs.readFile(filepath, "buffer", (err, data: Buffer) =>
                            {
                                zip.file(filepath, data);
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
}