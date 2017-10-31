module feng3d.editor
{
    declare function require(name: string);

    export var ipc: IpcRenderer = require('electron').ipcRenderer;
    export var shell: Shell = require('electron').shell;

    export var electron = { call: call };

    var callbackautoid = 0;
    var callbacks = {};

    function call<K extends keyof ElectronAPI>(id: K, param?: ElectronAPI[K])
    {
        var callbackid = callbackautoid++;
        callbacks[callbackid] = param && param.callback;
        ipc.send("electron", id, callbackid, param && param.param);
    }

    ipc.on("electron", (e, id: string, callbackid: number, param: Object) =>
    {
        var callback = callbacks[callbackid];
        callback && callback(param);
        delete callbacks[callbackid];
    });

    export interface ElectronAPI
    {
        "selected-file": { callback: (path: string) => void, param?: Object };
        "selected-directory": { callback: (path: string) => void, param?: { title: string } };
        "createproject": { callback: () => void, param?: { path: string } };
        "initproject": { callback?: () => void, param?: { path: string } };
    }

    export interface IpcRenderer
    {
        // Docs: http://electron.atom.io/docs/api/ipc-renderer

        /**
         * Listens to channel, when a new message arrives listener would be called with
         * listener(event, args...).
         */
        on(channel: string, listener: Function): this;
        /**
         * Adds a one time listener function for the event. This listener is invoked only
         * the next time a message is sent to channel, after which it is removed.
         */
        once(channel: string, listener: Function): this;
        /**
         * Removes all listeners, or those of the specified channel.
         */
        removeAllListeners(channel?: string): this;
        /**
         * Removes the specified listener from the listener array for the specified
         * channel.
         */
        removeListener(channel: string, listener: Function): this;
        /**
         * Send a message to the main process asynchronously via channel, you can also send
         * arbitrary arguments. Arguments will be serialized in JSON internally and hence
         * no functions or prototype chain will be included. The main process handles it by
         * listening for channel with ipcMain module.
         */
        send(channel: string, ...args: any[]): void;
        /**
         * Send a message to the main process synchronously via channel, you can also send
         * arbitrary arguments. Arguments will be serialized in JSON internally and hence
         * no functions or prototype chain will be included. The main process handles it by
         * listening for channel with ipcMain module, and replies by setting
         * event.returnValue. Note: Sending a synchronous message will block the whole
         * renderer process, unless you know what you are doing you should never use it.
         */
        sendSync(channel: string, ...args: any[]): any;
        /**
         * Like ipcRenderer.send but the event will be sent to the <webview> element in the
         * host page instead of the main process.
         */
        sendToHost(channel: string, ...args: any[]): void;
    }


    export interface Shell
    {

        // Docs: http://electron.atom.io/docs/api/shell

        /**
         * Play the beep sound.
         */
        beep(): void;
        /**
         * Move the given file to trash and returns a boolean status for the operation.
         */
        moveItemToTrash(fullPath: string): boolean;
        /**
         * Open the given external protocol URL in the desktop's default manner. (For
         * example, mailto: URLs in the user's default mail agent).
         */
        openExternal(url: string, options?: OpenExternalOptions, callback?: (error: Error) => void): boolean;
        /**
         * Open the given file in the desktop's default manner.
         */
        openItem(fullPath: string): boolean;
        /**
         * Resolves the shortcut link at shortcutPath. An exception will be thrown when any
         * error happens.
         */
        readShortcutLink(shortcutPath: string): ShortcutDetails;
        /**
         * Show the given file in a file manager. If possible, select the file.
         */
        showItemInFolder(fullPath: string): boolean;
        /**
         * Creates or updates a shortcut link at shortcutPath.
         */
        writeShortcutLink(shortcutPath: string, operation: 'create' | 'update' | 'replace', options: ShortcutDetails): boolean;
        /**
         * Creates or updates a shortcut link at shortcutPath.
         */
        writeShortcutLink(shortcutPath: string, options: ShortcutDetails): boolean;
    }

    export interface OpenExternalOptions
    {
        /**
         * true to bring the opened application to the foreground. The default is true.
         */
        activate: boolean;
    }

    export interface ShortcutDetails
    {
        // Docs: http://electron.atom.io/docs/api/structures/shortcut-details

        /**
         * The Application User Model ID. Default is empty.
         */
        appUserModelId?: string;
        /**
         * The arguments to be applied to target when launching from this shortcut. Default
         * is empty.
         */
        args?: string;
        /**
         * The working directory. Default is empty.
         */
        cwd?: string;
        /**
         * The description of the shortcut. Default is empty.
         */
        description?: string;
        /**
         * The path to the icon, can be a DLL or EXE. icon and iconIndex have to be set
         * together. Default is empty, which uses the target's icon.
         */
        icon?: string;
        /**
         * The resource ID of icon when icon is a DLL or EXE. Default is 0.
         */
        iconIndex?: number;
        /**
         * The target to launch from this shortcut.
         */
        target: string;
    }
}