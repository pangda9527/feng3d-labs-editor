module feng3d.editor
{
    export var electron: Electron;
    if (isNative)
        electron = require(__dirname + "/electron/rendererprocess.js").electron;

    export interface Electron
    {
        call<K extends keyof ElectronAPI>(id: K, param?: ElectronAPI[K]);
        showItemInFolder(fullPath: string): boolean
    }

    export interface ElectronAPI
    {
        "selected-file": { callback: (path: string) => void, param?: Object };
        "selected-directory": { callback: (path: string) => void, param?: { title: string } };
    }
}