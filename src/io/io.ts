module feng3d.editor
{
    export type FileInfo = { path: string, birthtime: number, mtime: number, isDirectory: boolean, size: number, children: FileInfo[] };

    export var file = feng3d.native.file;
    // export var file = feng3d.web.file;
}