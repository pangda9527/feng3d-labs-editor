module feng3d.web
{
    export class WebFile implements FileUtils
    {
        selectedDirectory({ title: string }, callback: (path) => void)
        {

        }

        createproject(path: string, callback: () => void)
        {
            client.callServer("file", "createproject", [path], callback);
        }

        initproject(projectpath: string, callback: () => void)
        {
            client.callServer("file", "initproject", [projectpath], callback);
        }

        stat(path: string, callback: (err: { message: string; }, stats: FileInfo) => void)
        {
            client.callServer("file", "stat", [path], callback);
        }

        detailStat(path: string, callback: (err: { message: string; }, stats: FileInfo) => void) 
        {
            client.callServer("file", "detailStat", [path], callback);
        }

        readdir(path: string, callback: (err: { message: string }, files: string[]) => void): void
        {
            client.callServer("file", "readdir", [path], callback);
        }

        writeFile(path: string, data: string, callback: (err: { message: string }) => void)
        {
            client.callServer("file", "writeFile", [path, data], callback);
        }

        readFile(path: string, callback: (err: { message: string }, data: string) => void)
        {
            client.callServer("file", "readFile", [path], callback);
        }

        remove(path: string, callback: (err: { message: string }) => void)
        {
            client.callServer("file", "remove", [path], callback);
        }

        mkdir(path: string, callback: (err: { message: string }) => void)
        {
            client.callServer("file", "mkdir", [path], callback);
        }

        rename(oldPath: string, newPath: string, callback: (err: { message: string }) => void)
        {
            client.callServer("file", "rename", [oldPath, newPath], callback);
        }

        move(src: string, dest: string, callback?: (err: { message: string; }, destfileinfo: FileInfo) => void): void
        {
            client.callServer("file", "move", [src, dest], callback);
        }
    }

    export var file = new WebFile();
}