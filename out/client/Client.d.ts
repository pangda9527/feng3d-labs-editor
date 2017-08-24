declare namespace feng3d.editor {
    var client: {
        callServer: (objectid: string, func: string, param: any[], callback: Function) => void;
    };
}
