
declare module 'feng3d' {
    export = feng3d;
}
/// <reference path="../src/io/native/native.d.ts" />
declare module feng3d.native {
    var file: {
        stat: (path: string, callback: (err: {
            message: string;
        }, stats: editor.FileInfo) => void) => void;
        readdir: (path: string, callback: (err: {
            message: string;
        }, files: string[]) => void) => void;
        writeFile: (path: string, data: string, callback?: (err: {
            message: string;
        }) => void) => void;
        writeJsonFile: (path: string, data: Object, callback?: (err: {
            message: string;
        }) => void) => void;
        readFile: (path: string, callback: (err: {
            message: string;
        }, data: string) => void) => void;
        mkdir: (path: string, callback: (err: {
            message: string;
        }) => void) => void;
        rename: (oldPath: string, newPath: string, callback: (err: {
            message: string;
        }) => void) => void;
        move: (src: string, dest: string, callback: (err: {
            message: string;
        }) => void) => void;
        remove: (path: string, callback?: (err: {
            message: string;
        }) => void) => void;
        detailStat: (path: string, depth: number, callback: (err: {
            message: string;
        }, fileInfo: editor.FileInfo) => void) => void;
    };
    type FileInfo = feng3d.editor.FileInfo;
}
declare module feng3d.web {
    var client: {
        callServer: (objectid: string, func: string, param: any[], callback: Function) => void;
    };
}
declare module feng3d.web {
    var file: {
        stat: (path: string, callback: (err: {
            message: string;
        }, stats: {
            birthtime: number;
            mtime: number;
            isDirectory: boolean;
            size: number;
        }) => void) => void;
        readdir: (path: string, callback: (err: {
            message: string;
        }, files: string[]) => void) => void;
        writeFile: (path: string, data: string, callback: (err: {
            message: string;
        }) => void) => void;
        readFile: (path: string, callback: (err: {
            message: string;
        }, data: string) => void) => void;
        remove: (path: string, callback: (err: {
            message: string;
        }) => void) => void;
        mkdir: (path: string, callback: (err: {
            message: string;
        }) => void) => void;
        rename: (oldPath: string, newPath: string, callback: (err: {
            message: string;
        }) => void) => void;
        move: (src: string, dest: string, callback: (err: {
            message: string;
        }) => void) => void;
    };
    type FileInfo = feng3d.editor.FileInfo;
}
declare module feng3d.editor {
    type FileInfo = {
        path: string;
        birthtime: number;
        mtime: number;
        isDirectory: boolean;
        size: number;
        children: FileInfo[];
    };
    var file: {
        stat: (path: string, callback: (err: {
            message: string;
        }, stats: FileInfo) => void) => void;
        readdir: (path: string, callback: (err: {
            message: string;
        }, files: string[]) => void) => void;
        writeFile: (path: string, data: string, callback?: (err: {
            message: string;
        }) => void) => void;
        writeJsonFile: (path: string, data: Object, callback?: (err: {
            message: string;
        }) => void) => void;
        readFile: (path: string, callback: (err: {
            message: string;
        }, data: string) => void) => void;
        mkdir: (path: string, callback: (err: {
            message: string;
        }) => void) => void;
        rename: (oldPath: string, newPath: string, callback: (err: {
            message: string;
        }) => void) => void;
        move: (src: string, dest: string, callback: (err: {
            message: string;
        }) => void) => void;
        remove: (path: string, callback?: (err: {
            message: string;
        }) => void) => void;
        detailStat: (path: string, depth: number, callback: (err: {
            message: string;
        }, fileInfo: FileInfo) => void) => void;
    };
}
declare module feng3d.editor {
    var ipc: IpcRenderer;
    var shell: Shell;
    var electron: {
        call: <K extends "selected-file" | "selected-directory" | "createproject" | "initproject">(id: K, param?: ElectronAPI[K]) => void;
    };
    interface ElectronAPI {
        "selected-file": {
            callback: (path: string) => void;
            param?: Object;
        };
        "selected-directory": {
            callback: (path: string) => void;
            param?: {
                title: string;
            };
        };
        "createproject": {
            callback: () => void;
            param?: {
                path: string;
            };
        };
        "initproject": {
            callback?: () => void;
            param?: {
                path: string;
            };
        };
    }
    interface IpcRenderer {
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
    interface Shell {
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
    interface OpenExternalOptions {
        /**
         * true to bring the opened application to the foreground. The default is true.
         */
        activate: boolean;
    }
    interface ShortcutDetails {
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
declare module feng3d.editor {
    interface EditorCache {
        /**
         * 保存最后一次打开的项目路径
         */
        projectpath?: string;
        /**
         * 历史项目路径列表
         */
        historyprojectpaths?: string[];
    }
    var editorcache: EditorCache;
}
declare module feng3d.editor {
    var drag: {
        register: (displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: ("file" | "gameobject" | "animationclip" | "file_gameobject" | "file_script")[], onDragDrop?: (dragSource: DragData) => void) => void;
        unregister: (displayObject: egret.DisplayObject) => void;
        refreshAcceptables: () => void;
    };
    interface DragData {
        gameobject?: GameObject;
        animationclip?: AnimationClip;
        file_gameobject?: string;
        file_script?: string;
        file?: string;
    }
}
declare module feng3d.editor {
    var editorshortcut: {
        init: () => void;
    };
}
declare module feng3d.editor {
    class Feng3dView extends eui.Component implements eui.UIComponent {
        fullbutton: eui.Button;
        private canvas;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onResize();
        private onclick();
    }
}
declare module feng3d.editor {
    var maskview: {
        mask: (displayObject: egret.DisplayObject) => () => void;
    };
}
declare module feng3d.editor {
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    var popupview: {
        popup: (object: Object, closecallback: () => void, param?: {
            width?: number;
            height?: number;
        }) => void;
    };
}
declare module feng3d.editor {
    class Accordion extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        private components;
        titleName: string;
        constructor();
        addContent(component: eui.Component): void;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onTitleButtonClick();
    }
}
declare module feng3d.editor {
    class TreeItemRenderer extends eui.ItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        /**
         * 子节点相对父节点的缩进值，以像素为单位。默认17。
         */
        indentation: number;
        data: TreeNode;
        private watchers;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onDisclosureButtonClick();
        private updateView();
    }
}
declare module feng3d.editor {
    class MenuItemRenderer extends eui.ItemRenderer {
        data: MenuItem;
        protected dataChanged(): void;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private updateView();
        private onItemMouseDown(event);
    }
}
declare module feng3d.editor {
    interface TreeNode {
        label?: string;
        depth?: number;
        isOpen?: boolean;
        selected?: boolean;
        /**
         * 父节点
         */
        parent?: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[];
    }
    interface TreeEventMap {
        added: TreeNode;
        removed: TreeNode;
        changed: TreeNode;
        openChanged: TreeNode;
    }
    interface Tree {
        once<K extends keyof TreeEventMap>(type: K, listener: (event: TreeEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeEventMap>(type: K, data?: TreeEventMap[K], bubbles?: boolean): any;
        has<K extends keyof TreeEventMap>(type: K): boolean;
        on<K extends keyof TreeEventMap>(type: K, listener: (event: TreeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeEventMap>(type?: K, listener?: (event: TreeEventMap[K]) => any, thisObject?: any): any;
    }
    class Tree extends Event {
        _rootnode: TreeNode;
        rootnode: TreeNode;
        /**
         * 判断是否包含节点
         */
        contain(node: TreeNode, rootnode?: TreeNode): boolean;
        addNode(node: TreeNode, parentnode?: TreeNode): void;
        removeNode(node: TreeNode): void;
        destroy(node: TreeNode): void;
        updateChildrenDepth(node: TreeNode): void;
        getShowNodes(node?: TreeNode): TreeNode[];
        private isopenchanged(host, property, oldvalue);
    }
    function treeMap<T extends TreeNode>(treeNode: T, callback: (node: T, parent: T) => void): void;
}
declare module feng3d.editor {
    class Vector3DView extends eui.Component implements eui.UIComponent {
        vm: Vector3D;
        group: eui.Group;
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        wGroup: eui.Group;
        wTextInput: eui.TextInput;
        constructor();
        showw: any;
        private _showw;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onTextChange(event);
    }
}
declare module feng3d.editor {
    class Object3DComponentView extends eui.Component {
        component: Component;
        componentView: IObjectView;
        accordion: feng3d.editor.Accordion;
        deleteButton: eui.Button;
        /**
         * 对象界面数据
         */
        constructor(component: Component);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete();
        private onDeleteButton(event);
    }
}
declare module feng3d.editor {
    type MenuItem = {
        label?: string;
        accelerator?: string;
        role?: string;
        type?: 'separator';
        click?: () => void;
        submenu?: MenuItem[];
    };
    type Menu = MenuItem[];
    var menu: {
        popup: (menu: MenuItem[], mousex?: number, mousey?: number, width?: number) => void;
    };
}
declare module feng3d.editor {
    /**
     * 默认基础对象界面
     * @author feng 2016-3-11
     */
    class OVBaseDefault extends eui.Component implements IObjectView {
        private _space;
        label: eui.Label;
        constructor(objectViewInfo: ObjectViewInfo);
        private onComplete();
        space: Object;
        getAttributeView(attributeName: String): IObjectAttributeView;
        getblockView(blockName: String): IObjectBlockView;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare module feng3d.editor {
    /**
     * 默认对象属性界面
     * @author feng 2016-3-10
     */
    class OAVDefault extends eui.Component implements IObjectAttributeView {
        private textTemp;
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        label: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: AttributeViewInfo);
        dragparam: {
            accepttype: keyof DragData;
            datatype: string;
        };
        protected onComplete(): void;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private _textfocusintxt;
        private ontxtfocusin();
        private ontxtfocusout();
        private onEnterFrame();
        space: Object;
        readonly attributeName: string;
        attributeValue: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick();
        private onTextChange();
    }
}
declare module feng3d.editor {
    /**
     * 默认对象属性块界面
     * @author feng 2016-3-22
     */
    class OBVDefault extends eui.Component implements IObjectBlockView {
        private _space;
        private _blockName;
        private attributeViews;
        private itemList;
        private isInitView;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        border: eui.Rect;
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo: BlockViewInfo);
        private onComplete();
        private initView();
        space: Object;
        readonly blockName: string;
        /**
         * 更新自身界面
         */
        private $updateView();
        updateView(): void;
        getAttributeView(attributeName: String): IObjectAttributeView;
        private onTitleButtonClick();
    }
}
declare module feng3d {
    interface IObjectView extends eui.Component {
    }
}
declare module feng3d.editor {
    /**
     * 默认使用块的对象界面
     * @author feng 2016-3-22
     */
    class OVDefault extends eui.Component implements IObjectView {
        private _space;
        private _objectViewInfo;
        private blockViews;
        group: eui.Group;
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo: ObjectViewInfo);
        private onComplete();
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        /**
         * 更新自身界面
         */
        private $updateView();
        getblockView(blockName: string): IObjectBlockView;
        getAttributeView(attributeName: string): IObjectAttributeView;
    }
}
declare module feng3d.editor {
    class BooleanAttrView extends eui.Component implements feng3d.IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        label: eui.Label;
        checkBox: eui.CheckBox;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        private onComplete();
        space: any;
        updateView(): void;
        protected onChange(event: egret.Event): void;
        readonly attributeName: string;
        attributeValue: any;
    }
}
declare module feng3d.editor {
    /**
     * 默认对象属性界面
     * @author feng 2016-3-10
     */
    class OAVNumber extends OAVDefault {
        fractionDigits: number;
        attributeValue: number;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare module feng3d {
    class ObjectViewEvent extends egret.Event {
        static VALUE_CHANGE: string;
        space: any;
        attributeName: string;
        attributeValue: any;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        toString(): string;
    }
}
declare module feng3d.editor {
    class OAVVector3D extends eui.Component implements IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        label: eui.Label;
        vector3DView: feng3d.editor.Vector3DView;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        space: Object;
        readonly attributeName: string;
        attributeValue: Object;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare module feng3d.editor {
    class OAVArray extends eui.Component implements IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        private isInitView;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Rect;
        contentGroup: eui.Group;
        sizeTxt: eui.TextInput;
        private attributeViews;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        space: Object;
        readonly attributeName: string;
        attributeValue: any[];
        /**
         * 更新自身界面
         */
        private $updateView();
        private initView();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private onTitleButtonClick();
        private onsizeTxtfocusout();
    }
    class OAVArrayItem extends OAVDefault {
        constructor(arr: any[], index: number, componentParam: Object);
        protected onComplete(): void;
    }
}
declare module feng3d.editor {
    class OAVObject3DComponentList extends eui.Component implements IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        private accordions;
        group: eui.Group;
        addComponentButton: eui.Button;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        private onAddComponentButtonClick();
        space: GameObject;
        readonly attributeName: string;
        attributeValue: Object;
        private initView();
        private addComponentView(component);
        /**
         * 更新界面
         */
        updateView(): void;
        private removedComponentView(component);
        private onaddedcompont(event);
        private onremovedComponent(event);
    }
}
declare module feng3d.editor {
    interface InspectorViewDataEventMap {
        change: any;
    }
    interface InspectorViewData {
        once<K extends keyof InspectorViewDataEventMap>(type: K, listener: (event: InspectorViewDataEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof InspectorViewDataEventMap>(type: K, data?: InspectorViewDataEventMap[K], bubbles?: boolean): any;
        has<K extends keyof InspectorViewDataEventMap>(type: K): boolean;
        on<K extends keyof InspectorViewDataEventMap>(type: K, listener: (event: InspectorViewDataEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof InspectorViewDataEventMap>(type?: K, listener?: (event: InspectorViewDataEventMap[K]) => any, thisObject?: any): any;
    }
    /**
     * 巡视界面数据
     * @author feng     2017-03-20
     */
    class InspectorViewData extends Event {
        viewData: any;
        viewDataList: any[];
        constructor(editor3DData: Editor3DData);
        showData(data: any, removeBack?: boolean): void;
        back(): void;
        private updateView();
    }
}
declare module feng3d.editor {
    /**
     * 巡视界面
     * @author feng     2017-03-20
     */
    class InspectorView extends eui.Component implements eui.UIComponent {
        backButton: eui.Button;
        group: eui.Group;
        private view;
        private inspectorViewData;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onDataChange();
        private updateView();
        private onBackClick();
    }
}
declare module feng3d.editor {
    class HierarchyTreeItemRenderer extends TreeItemRenderer {
        data: HierarchyNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private setdargSource(dragSource);
        private onclick();
        private onrightclick(e);
    }
}
declare module feng3d.editor {
    class HierarchyView extends eui.Component implements eui.UIComponent {
        addButton: eui.Button;
        list: eui.List;
        private listData;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private updateHierarchyTree();
        private selectedObject3DChanged(host, property, oldvalue);
        private onAddButtonClick();
    }
}
declare module feng3d.editor {
    var assets: {
        projectPath: string;
        assetsPath: string;
        showFloder: string;
        rootfileinfo: any;
        initproject: (path: string, callback: () => void) => void;
        getFileInfo: (path: string, fileinfo?: FileInfo) => FileInfo;
        deletefile: (path: string) => void;
        addfile: (path: string, content: string, newfile?: boolean) => void;
        addfolder: (folder: string, newfile?: boolean) => void;
        rename: (oldPath: string, newPath: string, callback?: () => void) => void;
        move: (src: string, dest: string, callback?: (err: {
            message: string;
        }) => void) => void;
        getparentdir: (path: string) => string;
        popupmenu: (fileinfo: FileInfo) => void;
        getnewpath: (path: string, callback: (newpath: string) => void) => void;
        saveGameObject: (gameobject: GameObject) => void;
        saveObject: (object: Object, filename: string) => void;
    };
}
declare module feng3d.editor {
    class AssetsFileNode {
        fileinfo: FileInfo;
        image: string;
        name: string;
        selected: boolean;
        constructor(fileinfo: FileInfo);
    }
}
declare module feng3d.editor {
    interface AssetsTreeNode extends TreeNode {
        /**
         * 父节点
         */
        parent?: AssetsTreeNode;
        /**
         * 子节点列表
         */
        children: AssetsTreeNode[];
        fileinfo: FileInfo;
    }
    class AssetsTree extends Tree {
        rootnode: AssetsTreeNode;
        init(fileinfo: FileInfo): void;
        getAssetsTreeNode(path: string): AssetsTreeNode;
        remove(path: string): void;
        add(fileinfo: FileInfo): void;
        getNode(path: string): AssetsTreeNode;
    }
    var assetstree: AssetsTree;
}
declare module feng3d.editor {
    class AssetsFileItemRenderer extends eui.ItemRenderer {
        icon: eui.Image;
        nameLabel: eui.Label;
        nameeditTxt: eui.TextInput;
        data: AssetsFileNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private ondoubleclick();
        private onclick();
        private onrightclick(e);
        private onnameLabelclick();
        private onnameeditend();
    }
}
declare module feng3d.editor {
    class AssetsTreeItemRenderer extends TreeItemRenderer {
        namelabel: eui.Label;
        nameeditTxt: eui.TextInput;
        data: AssetsTreeNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private onclick();
        private onrightclick(e);
        private onnameLabelclick();
        private onnameeditend();
    }
}
declare module feng3d.editor {
    class AssetsView extends eui.Component implements eui.UIComponent {
        treelist: eui.List;
        floderpathTxt: eui.Label;
        includeTxt: eui.TextInput;
        excludeTxt: eui.TextInput;
        filelistgroup: eui.Group;
        filelist: eui.List;
        private listData;
        private filelistData;
        constructor();
        private onComplete();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private initlist();
        updateAssetsView(): void;
        updateAssetsTree(): void;
        updateShowFloder(host?: any, property?: string, oldvalue?: any): void;
        private onfilter();
        private selectedfilechanged();
        private onfilelistrightclick();
        private onfloderpathTxtLink(evt);
    }
}
declare module feng3d.editor {
    class MainView extends eui.Component implements eui.UIComponent {
        mainGroup: eui.Group;
        topGroup: eui.Group;
        mainButton: eui.Button;
        moveButton: eui.ToggleButton;
        rotateButton: eui.ToggleButton;
        scaleButton: eui.ToggleButton;
        helpButton: eui.Button;
        settingButton: eui.Button;
        hierachyGroup: eui.Group;
        assetsGroup: eui.Group;
        private watchers;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onMainMenu(item);
        private onHelpButtonClick();
        private onButtonClick(event);
        private onObject3DOperationIDChange();
    }
}
declare module feng3d.editor {
    class AssetAdapter implements eui.IAssetAdapter {
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        getAsset(source: string, compFunc: Function, thisObject: any): void;
    }
}
declare module feng3d.editor {
    class LoadingUI extends egret.Sprite {
        constructor();
        private textField;
        private createView();
        setProgress(current: number, total: number): void;
    }
}
declare module feng3d.editor {
    class MainUI extends eui.UILayer {
        /**
         * 加载进度界面
         * loading process interface
         */
        private loadingView;
        protected createChildren(): void;
        /**
         * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
         * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
         */
        private onConfigComplete(event);
        private isThemeLoadEnd;
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        private onThemeLoadComplete();
        private isResourceLoadEnd;
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        private onResourceLoadComplete(event);
        private mainView;
        private createScene();
        private onresize();
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event);
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError(event);
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress(event);
    }
}
declare module feng3d.editor {
    class ThemeAdapter implements eui.IThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
    }
}
declare module feng3d.editor {
    interface EditorUI {
        stage: egret.Stage;
        assetsview: AssetsView;
        mainview: MainView;
        maskLayer: eui.UILayer;
        popupLayer: eui.UILayer;
    }
    var editorui: EditorUI;
}
declare module feng3d.editor {
    class Editor3DData {
        stage: egret.Stage;
        selectedObject: GameObject | FileInfo;
        object3DOperationID: number;
        /**
         * 巡视界面数据
         */
        inspectorViewData: InspectorViewData;
        constructor();
    }
}
declare module feng3d.editor {
    class Editor3DEvent extends Event {
    }
}
declare module feng3d.editor {
    class Object3DControllerTarget {
        private static _instance;
        static readonly instance: Object3DControllerTarget;
        private _controllerTargets;
        private _startScaleVec;
        private _isWoldCoordinate;
        private _isBaryCenter;
        private _showObject3D;
        private _controllerToolTransfrom;
        private _controllerTool;
        private _startTransformDic;
        showObject3D: Transform;
        controllerTool: Transform;
        controllerTargets: Transform[];
        private constructor();
        private onShowObjectTransformChanged(event);
        private updateControllerImage();
        /**
         * 开始移动
         */
        startTranslation(): void;
        translation(addPos: Vector3D): void;
        stopTranslation(): void;
        startRotate(): void;
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: Vector3D): void;
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1: number, normal1: Vector3D, angle2: number, normal2: Vector3D): void;
        stopRote(): void;
        startScale(): void;
        doScale(scale: Vector3D): void;
        stopScale(): void;
    }
}
declare module feng3d.editor {
    class Object3DMoveModel extends Component {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;
        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;
        oCube: CoordinateCube;
        init(gameObject: GameObject): void;
        private initModels();
    }
    class CoordinateAxis extends Component {
        private segmentMaterial;
        private material;
        private xArrow;
        readonly color: Color;
        private selectedColor;
        private length;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        private update();
    }
    class CoordinateCube extends Component {
        private colorMaterial;
        private oCube;
        color: Color;
        selectedColor: Color;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        update(): void;
    }
    class CoordinatePlane extends Component {
        private colorMaterial;
        private segmentGeometry;
        color: Color;
        borderColor: Color;
        selectedColor: Color;
        private selectedborderColor;
        readonly width: number;
        private _width;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        update(): void;
    }
}
declare module feng3d.editor {
    class Object3DRotationModel extends Component {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;
        init(gameObject: GameObject): void;
        private initModels();
    }
    class CoordinateRotationAxis extends Component {
        private segmentGeometry;
        private torusGeometry;
        private sector;
        radius: number;
        readonly color: Color;
        private backColor;
        private selectedColor;
        selected: boolean;
        private _selected;
        /**
         * 过滤法线显示某一面线条
         */
        filterNormal: Vector3D;
        private _filterNormal;
        init(gameObject: GameObject): void;
        private initModels();
        update(): void;
        showSector(startPos: Vector3D, endPos: Vector3D): void;
        hideSector(): void;
    }
    /**
     * 扇形对象
     */
    class SectorObject3D extends Component {
        private segmentGeometry;
        private geometry;
        private borderColor;
        radius: number;
        private _start;
        private _end;
        /**
         * 构建3D对象
         */
        init(gameObject: GameObject): void;
        update(start?: number, end?: number): void;
    }
    class CoordinateRotationFreeAxis extends Component {
        private segmentGeometry;
        private sector;
        private radius;
        color: Color;
        private backColor;
        private selectedColor;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        private initModels();
        update(): void;
    }
}
declare module feng3d.editor {
    class Object3DScaleModel extends Component {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;
        init(gameObject: GameObject): void;
        private initModels();
    }
    class CoordinateScaleCube extends Component {
        private coordinateCube;
        private segmentGeometry;
        readonly color: Color;
        private selectedColor;
        private length;
        selected: boolean;
        private _selected;
        scaleValue: number;
        private _scale;
        init(gameObject: GameObject): void;
        update(): void;
    }
}
declare module feng3d.editor {
    class Object3DControllerToolBase extends Component {
        private _selectedItem;
        private _toolModel;
        protected ismouseDown: boolean;
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;
        protected _object3DControllerTarget: Object3DControllerTarget;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected toolModel: Component;
        selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateRotationAxis | CoordinateRotationFreeAxis | CoordinateScaleCube;
        object3DControllerTarget: Object3DControllerTarget;
        protected updateToolModel(): void;
        protected onMouseDown(): void;
        protected onMouseUp(): void;
        protected onScenetransformChanged(): void;
        protected onCameraScenetransformChanged(): void;
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross(): Vector3D;
        protected getMousePlaneCross(): Vector3D;
    }
}
declare module feng3d.editor {
    class Object3DMoveTool extends Object3DControllerToolBase {
        protected toolModel: Object3DMoveModel;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        private startPos;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare module feng3d.editor {
    class Object3DRotationTool extends Object3DControllerToolBase {
        protected toolModel: Object3DRotationModel;
        private startPlanePos;
        private stepPlaneCross;
        private startMousePos;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare module feng3d.editor {
    class Object3DScaleTool extends Object3DControllerToolBase {
        protected toolModel: Object3DScaleModel;
        private startMousePos;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
    }
}
declare module feng3d.editor {
    class Object3DControllerTool extends Component {
        private object3DMoveTool;
        private object3DRotationTool;
        private object3DScaleTool;
        private _currentTool;
        private object3DControllerTarget;
        init(gameObject: GameObject): void;
        private onSelectedObject3DChange();
        private onObject3DOperationIDChange();
        private onObject3DMoveTool();
        private onObject3DRotationTool();
        private onObject3DScaleTool();
        private currentTool;
    }
}
declare module feng3d.editor {
    interface HierarchyNode extends TreeNode {
        gameobject: GameObject;
        /**
         * 父节点
         */
        parent?: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[];
    }
    class HierarchyTree extends Tree {
        rootnode: HierarchyNode;
        init(gameobject: GameObject): void;
        delete(gameobject: GameObject): void;
        add(gameobject: GameObject): void;
        remove(gameobject: GameObject): void;
        /**
         * 获取节点
         */
        getNode(gameObject: GameObject): HierarchyNode;
    }
    var hierarchyTree: HierarchyTree;
}
declare module feng3d.editor {
    var hierarchy: Hierarchy;
    class Hierarchy {
        constructor(rootObject3D: GameObject);
        private ongameobjectadded(event);
        private ongameobjectremoved(event);
        resetScene(scene: GameObject): void;
        private onImport();
        addGameoObjectFromAsset(path: string, parent?: GameObject): void;
        private onSaveScene();
    }
}
declare module feng3d.editor {
    class SceneControl {
        private dragSceneMousePoint;
        private dragSceneCameraGlobalMatrix3D;
        private fpsController;
        constructor();
        private onDragSceneStart();
        private onDragScene();
        private onFpsViewStart();
        private onFpsViewStop();
        private rotateSceneCenter;
        private rotateSceneCameraGlobalMatrix3D;
        private rotateSceneMousePoint;
        private onMouseRotateSceneStart();
        private onMouseRotateScene();
        private onLookToSelectedObject3D();
        private onMouseWheelMoveSceneCamera(event);
    }
    class SceneControlConfig {
        mouseWheelMoveStep: number;
        defaultLookDistance: number;
        lookDistance: number;
    }
}
declare module feng3d.editor {
    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    class GroundGrid extends Component {
        private num;
        private segmentGeometry;
        private level;
        private step;
        private groundGridObject;
        init(gameObject: GameObject): void;
        private update();
    }
}
declare module feng3d.editor {
    var engine: Engine;
    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    class Main3D {
        constructor();
        private init();
        private test();
    }
}
declare module feng3d.editor {
    class EditorComponent extends Component {
        private scene3D;
        init(gameobject: GameObject): void;
        private onAddComponentToScene(event);
        private onRemoveComponentFromScene(event);
    }
}
declare module feng3d.editor {
    class EditorEnvironment {
        constructor();
        private init();
    }
}
declare module feng3d.editor {
    type MouseEvent = egret.TouchEvent;
    var MouseEvent: {
        prototype: TouchEvent;
        new (): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: string;
        /** 鼠标弹起 */
        MOUSE_UP: string;
        /** 鼠标移动 */
        MOUSE_MOVE: string;
        /** 鼠标单击 */
        CLICK: string;
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
        /** 右键点击 */
        RIGHT_CLICK: "rightclick";
        /** 双击 */
        DOUBLE_CLICK: "dblclick";
    };
}
declare module feng3d.editor {
    var mouseEventEnvironment: MouseEventEnvironment;
    class MouseEventEnvironment {
        private webTouchHandler;
        private canvas;
        private touch;
        overDisplayObject: egret.DisplayObject;
        rightmousedownObject: egret.DisplayObject;
        constructor();
        private onMouseMove(event);
        private getWebTouchHandler();
    }
}
declare module feng3d.editor {
    class MouseRayTestScript extends Script {
        init(gameObject: GameObject): void;
        private onclick();
        update(): void;
        /**
         * 销毁
         */
        dispose(): void;
    }
}
declare module feng3d.editor {
    class DirectionLightIcon extends Script {
        private lightIcon;
        private lightLines;
        private textureMaterial;
        private directionalLight;
        init(gameObject: GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
    }
}
declare module feng3d.editor {
    class PointLightIcon extends Script {
        private lightIcon;
        private lightLines;
        private lightLines1;
        private lightpoints;
        private textureMaterial;
        private pointLight;
        private segmentGeometry;
        private pointGeometry;
        init(gameObject: GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
    }
}
declare module feng3d.editor {
}
declare module feng3d.editor {
    var threejsLoader: {
        load: (url: string, onParseComplete?: (group: any) => void) => void;
    };
}
declare module feng3d.editor {
    /**
     * 层级界面创建3D对象列表数据
     */
    var createObjectConfig: MenuItem[];
    var needcreateComponentGameObject: GameObject;
    /**
     * 层级界面创建3D对象列表数据
     */
    var createObject3DComponentConfig: MenuItem[];
}
declare module feng3d.editor {
    function objectViewConfig(): void;
}
/**
 * 快捷键配置
 */
declare var shortcutConfig: ({
    key: string;
    command: string;
    stateCommand: string;
    when: string;
} | {
    key: string;
    command: string;
    when: string;
} | {
    key: string;
    stateCommand: string;
    when: string;
})[];
declare module feng3d.editor {
    interface EditorEventMap {
        saveScene: any;
        import: any;
    }
    interface EditorEvent {
        once<K extends keyof EditorEventMap>(type: K, listener: (event: EditorEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof EditorEventMap>(type: K, data?: EditorEventMap[K], bubbles?: boolean): any;
        has<K extends keyof EditorEventMap>(type: K): boolean;
        on<K extends keyof EditorEventMap>(type: K, listener: (event: EditorEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof EditorEventMap>(type?: K, listener?: (event: EditorEventMap[K]) => any, thisObject?: any): any;
    }
    var $editorEventDispatcher: EditorEvent;
}
declare module feng3d.editor {
    var editor3DData: Editor3DData;
    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    class Editor extends eui.UILayer {
        constructor();
        private init();
        private initeditorcache(callback);
        private _onAddToStage();
    }
}
