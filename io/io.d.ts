type FileInfo = { path: string, birthtime: number, mtime: number, isDirectory: boolean, size: number, children: FileInfo[] };

interface FileUtils
{
    // selectedDirectory({ title: string }, callback: (path) => void);
    /**
     * 创建项目
     */
    createproject(path: string, callback: () => void);
    initproject(projectpath: string, callback: () => void);
    selectFile?: (callback: (file: File) => void, param?: Object) => void;
    //
    stat(path: string, callback: (err: { message: string; }, stats: FileInfo) => void): void;
    readdir(path: string, callback: (err: { message: string; }, files: string[]) => void): void;
    writeFile(path: string, data: string, callback?: (err: { message: string; }) => void): void;
    readFile(path: string, callback: (err: { message: string; }, data: string) => void): void;
    mkdir(path: string, callback: (err: { message: string; }) => void): void;
    rename(oldPath: string, newPath: string, callback: (err: { message: string; }) => void): void;
    move(src: string, dest: string, callback?: (err: { message: string; }, destfileinfo: FileInfo) => void): void;
    remove(path: string, callback?: (err: { message: string; }) => void): void;
    detailStat(path: string, callback: (err: { message: string; }, stats: FileInfo) => void);
}