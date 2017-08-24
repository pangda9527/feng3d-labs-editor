namespace feng3d.editor
{
    export var project = {
        init: init,
    };

    function init(path: string, callback: (err: { message: string }, fileInfo: FileInfo) => void)
    {
        client.callServer("project", "init", [path], callback);
    }
}