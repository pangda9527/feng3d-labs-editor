namespace feng3d.editor
{
    // export var fs: FS = require(__dirname + "/io/file.js").file;
    export var fs: FS = zipfs;

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
        readFile(path: string, callback: (err: { message: string; }, data: string) => void): void;
        mkdir(path: string, callback: (err: { message: string; }) => void): void;
        rename(oldPath: string, newPath: string, callback: (err: { message: string; }) => void): void;
        move(src: string, dest: string, callback?: (err: { message: string; }, destfileinfo: FileInfo) => void): void;
        remove(path: string, callback?: (err: { message: string; }) => void): void;
    }
}