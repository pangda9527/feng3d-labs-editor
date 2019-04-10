declare module 'feng3d' {
    export = feng3d;
}
/// <reference path="../libs/typescriptServices.d.ts" />
declare namespace ts {
    function hasModifier(node: Node, flags: ModifierFlags): boolean;
    function getAllAccessorDeclarations(declarations: NodeArray<Declaration>, accessor: AccessorDeclaration): any;
    function getClassExtendsHeritageElement(node: ClassDeclaration | ClassExpression | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
    function getDeclarationOfKind<T extends Declaration>(symbol: Symbol, kind: T["kind"]): T | undefined;
    function getTextOfPropertyName(name: PropertyName): __String;
    interface Statement extends Node {
        transformFlags: any;
    }
    enum TransformFlags {
        ContainsDecorators
    }
    interface VariableDeclaration extends NamedDeclaration {
        callerList?: string[];
        delayInitializerList?: Expression[];
    }
    function getClassExtendsHeritageElement(node: ClassDeclaration | ClassExpression | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
    function getHeritageClause(clauses: NodeArray<HeritageClause> | undefined, kind: SyntaxKind): HeritageClause | undefined;
}
declare namespace feng3d {
}
declare namespace feng3d {
    /**
     * (快捷键)状态列表
     */
    var shortCutStates: {
        disableScroll: string;
        splitGroupDraging: string;
        draging: string;
    };
    /**
     * (快捷键)状态列表
     */
    type ShortCutStates = typeof shortCutStates;
    interface ShortCut {
        activityState<K extends keyof ShortCutStates>(state: K): void;
        deactivityState<K extends keyof ShortCutStates>(state: K): void;
        getState<K extends keyof ShortCutStates>(state: K): boolean;
    }
}
declare namespace feng3d {
    interface GlobalEvents {
        "editor.selectedObjectsChanged": any;
        "editor.isBaryCenterChanged": any;
        "editor.isWoldCoordinateChanged": any;
        "editor.toolTypeChanged": any;
        "editor.allLoaded": any;
        /**
         * 资源显示文件夹发生变化
         */
        "asset.showFloderChanged": {
            oldpath: string;
            newpath: string;
        };
        /**
         * 删除文件
         */
        "asset.deletefile": {
            id: string;
        };
        /**
         * 更新属性面板（检查器）
         */
        "inspector.update": undefined;
        /**
         * 属性面板（检查器）显示数据
         */
        "inspector.showData": any;
        /**
         * 保存属性面板（检查器）数据
         */
        "inspector.saveShowData": () => void;
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: Vector3;
        /**
         * 使用编辑器打开脚本
         */
        "codeeditor.openScript": feng3d.StringAsset;
        /**
         * 脚本编译
         */
        "script.compile": {
            onComplete?: () => void;
        };
        /**
         * 获取项目依赖库 定义
         */
        "script.gettslibs": {
            callback: (tslibs: {
                path: string;
                code: string;
            }[]) => void;
        };
        /**
         * 提示信息
         */
        "message": string;
        /**
         * 错误信息
         */
        "message.error": string;
        /**
         * 界面布局发生变化
         */
        "viewLayout.changed": string;
        /**
         * 还原默认窗口布局
         */
        "viewLayout.reset": Object;
    }
}
declare namespace egret {
    interface Stage {
        stageX: number;
        stageY: number;
    }
    /**
     * 扩展鼠标事件，增加鼠标 按下、弹起、移动、点击、移入、移出、右击、双击事件
     */
    type MouseEvent = egret.TouchEvent;
    var MouseEvent: {
        prototype: TouchEvent;
        new (): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: "mousedown";
        /** 鼠标弹起 */
        MOUSE_UP: "mouseup";
        /** 鼠标移动 */
        MOUSE_MOVE: "mousemove";
        /** 鼠标单击 */
        CLICK: "click";
        /** 鼠标中键按下 */
        MIDDLE_MOUSE_DOWN: "middlemousedown";
        /** 鼠标中键弹起 */
        MIDDLE_MOUSE_UP: "middlemouseup";
        /** 鼠标中键点击 */
        MIDDLE_Click: "middleclick";
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
        /** 右键按下 */
        RIGHT_MOUSE_DOWN: "rightmousedown";
        /** 鼠标右键弹起 */
        RIGHT_MOUSE_UP: "rightmouseup";
        /** 右键点击 */
        RIGHT_CLICK: "rightclick";
        /** 双击 */
        DOUBLE_CLICK: "dblclick";
    };
    var mouseEventEnvironment: () => void;
}
declare namespace egret {
}
declare namespace egret {
    interface DisplayObject {
        /**
         * 获取显示对象的全局测量边界
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         */
        getGlobalBounds(resultRect?: feng3d.Rectangle): feng3d.Rectangle;
        /**
         * 把自身从父对象中移除 this.parent && this.parent.removeChild(this);
         */
        remove(): void;
    }
}
declare namespace egret {
}
declare namespace json {
    const enum ScanError {
        None = 0,
        UnexpectedEndOfComment = 1,
        UnexpectedEndOfString = 2,
        UnexpectedEndOfNumber = 3,
        InvalidUnicode = 4,
        InvalidEscapeCharacter = 5,
        InvalidCharacter = 6
    }
    const enum SyntaxKind {
        OpenBraceToken = 1,
        CloseBraceToken = 2,
        OpenBracketToken = 3,
        CloseBracketToken = 4,
        CommaToken = 5,
        ColonToken = 6,
        NullKeyword = 7,
        TrueKeyword = 8,
        FalseKeyword = 9,
        StringLiteral = 10,
        NumericLiteral = 11,
        LineCommentTrivia = 12,
        BlockCommentTrivia = 13,
        LineBreakTrivia = 14,
        Trivia = 15,
        Unknown = 16,
        EOF = 17
    }
    /**
     * The scanner object, representing a JSON scanner at a position in the input string.
     */
    interface JSONScanner {
        /**
         * Sets the scan position to a new offset. A call to 'scan' is needed to get the first token.
         */
        setPosition(pos: number): void;
        /**
         * Read the next token. Returns the token code.
         */
        scan(): SyntaxKind;
        /**
         * Returns the current scan position, which is after the last read token.
         */
        getPosition(): number;
        /**
         * Returns the last read token.
         */
        getToken(): SyntaxKind;
        /**
         * Returns the last read token value. The value for strings is the decoded string content. For numbers its of type number, for boolean it's true or false.
         */
        getTokenValue(): string;
        /**
         * The start offset of the last read token.
         */
        getTokenOffset(): number;
        /**
         * The length of the last read token.
         */
        getTokenLength(): number;
        /**
         * An error code of the last scan.
         */
        getTokenError(): ScanError;
    }
    interface ParseError {
        error: ParseErrorCode;
        offset: number;
        length: number;
    }
    const enum ParseErrorCode {
        InvalidSymbol = 1,
        InvalidNumberFormat = 2,
        PropertyNameExpected = 3,
        ValueExpected = 4,
        ColonExpected = 5,
        CommaExpected = 6,
        CloseBraceExpected = 7,
        CloseBracketExpected = 8,
        EndOfFileExpected = 9,
        InvalidCommentToken = 10,
        UnexpectedEndOfComment = 11,
        UnexpectedEndOfString = 12,
        UnexpectedEndOfNumber = 13,
        InvalidUnicode = 14,
        InvalidEscapeCharacter = 15,
        InvalidCharacter = 16
    }
    type NodeType = 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null';
    interface Node {
        readonly type: NodeType;
        readonly value?: any;
        readonly offset: number;
        readonly length: number;
        readonly colonOffset?: number;
        readonly parent?: Node;
        readonly children?: Node[];
    }
    type Segment = string | number;
    type JSONPath = Segment[];
    interface Location {
        /**
         * The previous property key or literal value (string, number, boolean or null) or undefined.
         */
        previousNode?: Node;
        /**
         * The path describing the location in the JSON document. The path consists of a sequence strings
         * representing an object property or numbers for array indices.
         */
        path: JSONPath;
        /**
         * Matches the locations path against a pattern consisting of strings (for properties) and numbers (for array indices).
         * '*' will match a single segment, of any property name or index.
         * '**' will match a sequece of segments or no segment, of any property name or index.
         */
        matches: (patterns: JSONPath) => boolean;
        /**
         * If set, the location's offset is at a property key.
         */
        isAtPropertyKey: boolean;
    }
    interface ParseOptions {
        disallowComments?: boolean;
        allowTrailingComma?: boolean;
    }
    namespace ParseOptions {
        const DEFAULT: {
            allowTrailingComma: boolean;
        };
    }
    interface JSONVisitor {
        /**
         * Invoked when an open brace is encountered and an object is started. The offset and length represent the location of the open brace.
         */
        onObjectBegin?: (offset: number, length: number) => void;
        /**
         * Invoked when a property is encountered. The offset and length represent the location of the property name.
         */
        onObjectProperty?: (property: string, offset: number, length: number) => void;
        /**
         * Invoked when a closing brace is encountered and an object is completed. The offset and length represent the location of the closing brace.
         */
        onObjectEnd?: (offset: number, length: number) => void;
        /**
         * Invoked when an open bracket is encountered. The offset and length represent the location of the open bracket.
         */
        onArrayBegin?: (offset: number, length: number) => void;
        /**
         * Invoked when a closing bracket is encountered. The offset and length represent the location of the closing bracket.
         */
        onArrayEnd?: (offset: number, length: number) => void;
        /**
         * Invoked when a literal value is encountered. The offset and length represent the location of the literal value.
         */
        onLiteralValue?: (value: any, offset: number, length: number) => void;
        /**
         * Invoked when a comma or colon separator is encountered. The offset and length represent the location of the separator.
         */
        onSeparator?: (character: string, offset: number, length: number) => void;
        /**
         * When comments are allowed, invoked when a line or block comment is encountered. The offset and length represent the location of the comment.
         */
        onComment?: (offset: number, length: number) => void;
        /**
         * Invoked on an error.
         */
        onError?: (error: ParseErrorCode, offset: number, length: number) => void;
    }
    /**
     * Creates a JSON scanner on the given text.
     * If ignoreTrivia is set, whitespaces or comments are ignored.
     */
    function createScanner(text: string, ignoreTrivia?: boolean): JSONScanner;
    /**
     * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
     */
    function getLocation(text: string, position: number): Location;
    /**
     * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
     * Therefore always check the errors list to find out if the input was valid.
     */
    function parse(text: string, errors?: ParseError[], options?: ParseOptions): any;
    /**
     * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
     */
    function parseTree(text: string, errors?: ParseError[], options?: ParseOptions): Node;
    /**
     * Finds the node at the given path in a JSON DOM.
     */
    function findNodeAtLocation(root: Node, path: JSONPath): Node | undefined;
    /**
     * Gets the JSON path of the given JSON DOM node
     */
    function getNodePath(node: Node): JSONPath;
    /**
     * Evaluates the JavaScript object of the given JSON DOM node
     */
    function getNodeValue(node: Node): any;
    function contains(node: Node, offset: number, includeRightBound?: boolean): boolean;
    /**
     * Finds the most inner node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.
     */
    function findNodeAtOffset(node: Node, offset: number, includeRightBound?: boolean): Node | undefined;
    /**
     * Parses the given text and invokes the visitor functions for each object, array and literal reached.
     */
    function visit(text: string, visitor: JSONVisitor, options?: ParseOptions): any;
    /**
     * Takes JSON with JavaScript-style comments and remove
     * them. Optionally replaces every none-newline character
     * of comments with a replaceCharacter
     */
    function stripComments(text: string, replaceCh?: string): string;
}
declare namespace editor {
    var giteeOauth: GiteeOauth;
    /**
     * gitee 认证授权
     */
    class GiteeOauth {
        /**
         * 认证授权
         *
         * @param callback 完成回调
         */
        oauth(callback?: () => void): void;
        getAccessToken(): void;
        getUser(): void;
    }
}
interface NodeRequire {
}
declare var require: (s: any) => any;
declare var __dirname: string;
declare namespace editor {
    /**
     * 本地文件系统
     */
    var nativeFS: NativeFSBase;
    /**
     * 本地API
     */
    var nativeAPI: NativeAPI;
    /**
     * 是否支持本地API
     */
    var supportNative: boolean;
    /**
     * 本地API
     */
    interface NativeAPI {
        /**
         * 选择文件夹对话框
         *
         * @param callback 完成回调
         */
        selectDirectoryDialog(callback: (event: Event, path: string) => void): void;
        /**
         * 在资源管理器中显示
         *
         * @param fullPath 完整路径
         */
        showFileInExplorer(fullPath: string): void;
        /**
         * 使用 VSCode 打开项目
         *
         * @param  projectPath 项目路径
         */
        openWithVSCode(projectPath: string, callback: (err: Error) => void): void;
        /**
         * 打开开发者工具
         */
        openDevTools(): void;
    }
    /**
     * Native文件系统
     */
    interface NativeFSBase {
        /**
         * 文件是否存在
         * @param path 文件路径
         * @param callback 回调函数
         */
        exists(path: string, callback: (exists: boolean) => void): void;
        /**
         * 读取文件夹中文件列表
         * @param path 路径
         * @param callback 回调函数
         */
        readdir(path: string, callback: (err: Error, files: string[]) => void): void;
        /**
         * 新建文件夹
         *
         * @param path 文件夹路径
         * @param callback 回调函数
         */
        mkdir(path: string, callback: (err: Error) => void): void;
        /**
         * 读取文件
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readFile(path: string, callback: (err: Error, data: ArrayBuffer) => void): void;
        /**
         * 删除文件
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        deleteFile(path: string, callback: (err: Error) => void): void;
        /**
         * 删除文件夹
         *
         * @param path 文件夹路径
         * @param callback 完成回调
         */
        rmdir(path: string, callback: (err: Error) => void): void;
        /**
         * 是否为文件夹
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        isDirectory(path: string, callback: (result: boolean) => void): void;
        /**
         * 写ArrayBuffer(新建)文件
         *
         * @param path 文件路径
         * @param data 文件数据
         * @param callback 回调函数
         */
        writeFile(path: string, data: ArrayBuffer, callback: (err: Error) => void): void;
    }
}
declare namespace editor {
    /**
     * Created by 黑暗之神KDS on 2017/2/17.
     */
    /**
     * 文件对象
     * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
     * -- 其他端支持绝对路径
     * Created by kds on 2017/1/21 0021.
     */
    class FileObject {
        /**
         * 判断文件名是否合法
         * @param fileName 文件名
         */
        static isLegalName(fileName: string): boolean;
        /**
         * 构造函数
         *  -- 当存在path且isGetFileInfo==true的时候会自动探索基本信息
         *       -- 是否存在
         *       -- 文件大小
         *       -- 创建日期
         *       -- 最近一次的修改日期
         * @param path 路径 文件夹 kds\\test  文件 kds\\test\\file.js
         * @param onComplete 探查该文件完毕后的回调 onComplete([object FileObject])
         * @param thisPtr 执行域
         * @param onError 当错误时返回 onError([object FileObject])
         * @param isGetFileInfo 初始就获取下该文件的基本信息
         */
        constructor(path: string, onComplete: Function, thisPtr: any, onError: Function, isGetFileInfo: boolean);
        /**
         * 文件/文件夹是否存在 基本探索过后才可知道是否存在
         */
        readonly exists: boolean;
        private _exists;
        /**
         * 文件尺寸
         */
        readonly size: number;
        private _size;
        /**
         * 是否是文件夹
         */
        readonly isDirectory: boolean;
        private _isDirectory;
        /**
         * 创建日期
         */
        readonly createDate: Date;
        private _createDate;
        /**
         * 上次修改日期
         */
        readonly lastModifyDate: Date;
        private _lastModifyDate;
        /**
         * 路径
         * -- WEB端是相对路径
         * -- 其他端支持绝对路径 file:///xxx/yyy
         */
        readonly path: string;
        private _path;
        /**
         * 文件或文件夹名 xxx.ks
         */
        readonly fileName: string;
        /**
         * 不包含格式的文件名称 如 xxx.ks就是xxx
         */
        readonly fileNameWithoutExt: string;
        /**
         * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
         */
        readonly location: string;
        /**
         * 绝对路径
         * -- WEB端的是 http://xxxx
         * -- 其他端的是 file:///xxxx
         */
        readonly fullPath: string;
        /**
         * 格式
         */
        readonly extension: string;
        /**
         * 获取该文件下的目录
         * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
         * @param onError 失败时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        getDirectoryListing(onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 创建文件夹
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createDirectory(onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 创建文件
         * @param content 初次创建时的内容 一般可为""
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createFile(content: string | ArrayBuffer, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 储存文件（文本格式）
         * @param content 文件内容文本
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        saveFile(content: string | ArrayBuffer, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 重命名
         * @param newName 重命名
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        rename(newName: string, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 移动文件夹
         * @param newPath 新的路径
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 失败时回调  onError([object FileObject])
         * @param thisPtr 执行域
         */
        move(newPath: string, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 删除文件（夹）
         * @param onComplete onComplete([object FileObject])
         * @param onError onError([object FileObject])
         * @param thisPtr 执行域
         */
        delete(onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 打开文件
         * @param onFin 完成时回调 onFin(txt:string)
         * @param onError 错误时回调 onError([fileObject])
         */
        open(onFin: Function, onError: Function): void;
        /**
         * 更新状态
         * @param callback 回调函数
         */
        private updateStats;
    }
}
declare namespace editor {
    /**
     * 本地文件系统
     */
    class NativeFS extends feng3d.ReadWriteFS {
        /**
         * 项目路径
         */
        projectname: string;
        /**
         * 文件系统类型
         */
        readonly type: feng3d.FSType;
        fs: NativeFSBase;
        constructor(fs: NativeFSBase);
        /**
         * 读取文件为ArrayBuffer
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readArrayBuffer(path: string, callback: (err: Error, arraybuffer: ArrayBuffer) => void): void;
        /**
         * 读取文件为字符串
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readString(path: string, callback: (err: Error, str: string) => void): void;
        /**
         * 读取文件为Object
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readObject(path: string, callback: (err: Error, object: Object) => void): void;
        /**
         * 加载图片
         * @param path 图片路径
         * @param callback 加载完成回调
         */
        readImage(path: string, callback: (err: Error, img: HTMLImageElement) => void): void;
        /**
         * 获取文件绝对路径
         * @param path （相对）路径
         */
        getAbsolutePath(path: string): string;
        /**
         * 文件是否存在
         * @param path 文件路径
         * @param callback 回调函数
         */
        exists(path: string, callback: (exists: boolean) => void): void;
        /**
         * 是否为文件夹
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        isDirectory(path: string, callback: (result: boolean) => void): void;
        /**
         * 读取文件夹中文件列表
         *
         * @param path 路径
         * @param callback 回调函数
         */
        readdir(path: string, callback: (err: Error, files: string[]) => void): void;
        /**
         * 新建文件夹
         * @param path 文件夹路径
         * @param callback 回调函数
         */
        mkdir(path: string, callback?: (err: Error) => void): void;
        /**
         * 删除文件
         * @param path 文件路径
         * @param callback 回调函数
         */
        deleteFile(path: string, callback?: (err: Error) => void): void;
        /**
         * 写ArrayBuffer(新建)文件
         * @param path 文件路径
         * @param arraybuffer 文件数据
         * @param callback 回调函数
         */
        writeArrayBuffer(path: string, arraybuffer: ArrayBuffer, callback?: (err: Error) => void): void;
        /**
         * 写字符串到(新建)文件
         * @param path 文件路径
         * @param str 文件数据
         * @param callback 回调函数
         */
        writeString(path: string, str: string, callback?: (err: Error) => void): void;
        /**
         * 写Object到(新建)文件
         * @param path 文件路径
         * @param object 文件数据
         * @param callback 回调函数
         */
        writeObject(path: string, object: Object, callback?: (err: Error) => void): void;
        /**
         * 写图片
         * @param path 图片路径
         * @param image 图片
         * @param callback 回调函数
         */
        writeImage(path: string, image: HTMLImageElement, callback?: (err: Error) => void): void;
        /**
         * 复制文件
         * @param src    源路径
         * @param dest    目标路径
         * @param callback 回调函数
         */
        copyFile(src: string, dest: string, callback?: (err: Error) => void): void;
        /**
         * 是否存在指定项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        hasProject(projectname: string, callback: (has: boolean) => void): void;
        /**
         * 初始化项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        initproject(projectname: string, callback: (err?: Error) => void): void;
    }
}
declare namespace editor {
    /**
     * 编辑器资源系统
     */
    var editorRS: EditorRS;
    /**
     * 编辑器资源系统
     */
    class EditorRS extends feng3d.ReadWriteRS {
        /**
         * 初始化项目
         *
         * @param callback 完成回调
         */
        initproject(callback: (err?: Error) => void): void;
        /**
         * 创建项目
         */
        private createproject;
        upgradeProject(callback: () => void): void;
        selectFile(callback: (file: FileList) => void): void;
        /**
         * 导出项目
         */
        exportProject(callback: (err: Error, data: Blob) => void): void;
        /**
         * 导入项目
         */
        importProject(file: File, callback: () => void): void;
    }
}
declare namespace editor {
    class EditorCache {
        /**
         * 保存最后一次打开的项目路径
         */
        projectname: string;
        /**
         * 最近的项目列表
         */
        lastProjects: string[];
        /**
         * 界面布局数据
         */
        viewLayout: Object;
        /**
         * 设置最近打开的项目
         */
        setLastProject(projectname: string): void;
        constructor();
        save(): void;
    }
    var editorcache: EditorCache;
}
declare namespace editor {
    var drag: Drag;
    class Drag {
        register(displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: (keyof DragDataMap)[], onDragDrop?: (dragSource: DragData) => void): void;
        unregister(displayObject: egret.DisplayObject): void;
        /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
        refreshAcceptables(): void;
    }
    interface DragDataItem<K extends keyof DragDataMap> {
        datatype: K;
        value: DragDataMap[K];
    }
    class DragData {
        private datas;
        /**
         * 添加拖拽数据
         *
         * @param datatype
         * @param value
         */
        addDragData<K extends keyof DragDataMap>(datatype: K, value: DragDataMap[K]): void;
        /**
         * 获取拖拽数据列表
         *
         * @param datatype
         */
        getDragData<K extends keyof DragDataMap>(datatype: K): DragDataMap[K][];
        /**
         * 是否拥有指定类型数据
         *
         * @param datatype
         */
        hasDragData<K extends keyof DragDataMap>(datatype: K): boolean;
    }
    /**
     * 拖拽数据
     */
    interface DragDataMap {
        gameobject: feng3d.GameObject;
        animationclip: feng3d.AnimationClip;
        material: feng3d.Material;
        geometry: feng3d.Geometry;
        file_gameobject: feng3d.GameObject;
        /**
         * 脚本路径
         */
        file_script: feng3d.ScriptAsset;
        /**
         * 文件
         */
        assetNodes: AssetNode;
        /**
         * 声音路径
         */
        audio: feng3d.AudioAsset;
        /**
         * 纹理
         */
        texture2d: feng3d.Texture2D;
        /**
         * 立方体纹理
         */
        texturecube: feng3d.TextureCube;
    }
}
declare namespace editor {
    class Cursor {
        private o;
        add(id: any, value: "e-resize" | "n-resize"): void;
        clear(id: any): void;
        private update;
    }
    /**
     * 鼠标光标管理
     */
    var cursor: Cursor;
}
declare namespace editor {
    class Editorshortcut {
        constructor();
        private onGameobjectMoveTool;
        private onGameobjectRotationTool;
        private onGameobjectScaleTool;
        private onDeleteSeletedGameObject;
        private onOpenDevTools;
        private onRefreshWindow;
    }
    class SceneControlConfig {
        mouseWheelMoveStep: number;
        lookDistance: number;
        sceneCameraForwardBackwardStep: number;
    }
    var sceneControlConfig: SceneControlConfig;
}
declare namespace editor {
    /**
     * 快捷键设置界面
     */
    class ShortCutSetting extends eui.Component {
        searchTxt: eui.TextInput;
        list: eui.List;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private updateView;
        static readonly instance: any;
    }
}
declare namespace editor {
    var modules: Modules;
    /**
     * 模块
     *
     * 用于管理功能模块
     */
    class Modules {
        message: Message;
        getModuleView(moduleName: string): ModuleView;
        recycleModuleView(moduleView: ModuleView): void;
        private moduleViewMap;
        /**
         * 模块界面类定义
         */
        static moduleViewCls: {
            [name: string]: feng3d.Constructor<ModuleView>;
        };
    }
}
declare namespace editor {
    /**
     * 场景视图
     */
    class SceneView extends eui.Component implements ModuleView {
        private _canvas;
        private _areaSelectStartPosition;
        private _areaSelectRect;
        private engine;
        private editorCamera;
        private selectedObjectsHistory;
        private rotateSceneCenter;
        private rotateSceneCameraGlobalMatrix3D;
        private rotateSceneMousePoint;
        private preMousePoint;
        private dragSceneMousePoint;
        private dragSceneCameraGlobalMatrix3D;
        /**
         * 模块名称
         */
        moduleName: string;
        static moduleName: string;
        /**
         * 鼠标是否在界面中
         */
        private readonly mouseInView;
        constructor();
        private onAddedToStage;
        private onRemoveFromStage;
        private _onAreaSelectStart;
        private _onAreaSelect;
        private _onAreaSelectEnd;
        private _onMouseOver;
        private onMouseOut;
        private onResize;
        private onSelectGameObject;
        private onMouseRotateSceneStart;
        private onMouseRotateScene;
        private onMouseRotateSceneEnd;
        private onSceneCameraForwardBackMouseMoveStart;
        private onSceneCameraForwardBackMouseMove;
        private onSceneCameraForwardBackMouseMoveEnd;
        private onDragSceneStart;
        private onDragScene;
        private onDragSceneEnd;
        private onFpsViewStart;
        private onFpsViewStop;
        private updateFpsView;
        private onLookToSelectedGameObject;
        private onMouseWheelMoveSceneCamera;
    }
}
declare namespace editor {
    class CameraPreview extends eui.Component {
        group: eui.Group;
        private saveParent;
        private canvas;
        private previewEngine;
        camera: feng3d.Camera;
        private _camera;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        private initView;
        private onResize;
        private onDataChange;
        private onframe;
    }
}
declare namespace editor {
    /**
     * 粒子特效控制器
     */
    class ParticleEffectController extends eui.Component {
        pauseBtn: eui.Button;
        stopBtn: eui.Button;
        speedInput: eui.TextInput;
        timeInput: eui.TextInput;
        particlesInput: eui.TextInput;
        private saveParent;
        private particleSystems;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onClick;
        private onEnterFrame;
        private initView;
        private updateView;
        private readonly isParticlePlaying;
        private onDataChange;
    }
}
declare var defaultTextFiled: egret.TextField;
declare function lostFocus(display: egret.DisplayObject): void;
declare namespace editor {
    /**
     * 重命名组件
     */
    class RenameTextInput extends eui.Component implements eui.UIComponent {
        nameeditTxt: eui.TextInput;
        nameLabel: eui.Label;
        callback: () => void;
        /**
         * 显示文本
         */
        text: string;
        textAlign: string;
        constructor();
        /**
         * 启动编辑
         */
        edit(callback?: () => void): void;
        /**
         * 取消编辑
         */
        cancelEdit(): void;
        private onnameeditChanged;
    }
}
declare namespace editor {
    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    class SplitGroup extends eui.Group {
        constructor();
    }
}
declare namespace editor {
    /**
     * 可拆分UI组件
     */
    class SplitUIComponent {
        private splitGroup;
        init(splitGroup: SplitGroup): void;
        /**
         * 销毁
         */
        dispose(): void;
        private onAddedToStage;
        private onRemovedFromStage;
    }
}
declare namespace editor {
    interface ModuleView extends eui.Component {
        /**
         * 模块名称
         */
        moduleName: string;
    }
    /**
     * 拖拽数据
     */
    interface DragDataMap {
        moduleView: {
            tabView: TabView;
            moduleName: string;
        };
    }
    /**
     * Tab 界面
     */
    class TabView extends eui.Group {
        private _tabViewInstance;
        /**
         * 按钮池
         */
        private _tabViewButtonPool;
        /**
         * 模块按钮列表
         */
        private _tabButtons;
        /**
         * 模块界面列表
         */
        private _moduleViews;
        /**
         * 显示模块
         */
        private _showModuleIndex;
        private tabGroup;
        private contentGroup;
        /**
         * 获取模块名称列表
         */
        getModuleNames(): string[];
        setModuleNames(moduleNames: string[]): void;
        constructor();
        protected childrenCreated(): void;
        private onComplete;
        private _onAddedToStage;
        private addModuleToLeft;
        private addModuleByName;
        private addModule;
        private removeModule;
        private adjust;
        private copyLayoutInfo;
        private onRemovedFromStage;
        /**
         * 界面显示失效
         */
        private _invalidateView;
        /**
         * 更新界面
         */
        private _updateView;
        /**
         * 点击按钮事件
         *
         * @param e
         */
        private _onTabButtonClick;
        private onTabButtonRightClick;
    }
}
declare namespace editor {
    class WindowView extends eui.Panel {
        /**
         * 获取所属窗口
         *
         * @param view 窗口中的 contenGroup
         */
        static getWindow(contenGroup: egret.DisplayObject): WindowView;
        moveArea: eui.Group;
        titleDisplay: eui.Label;
        closeButton: eui.Button;
        contenGroup: eui.Group;
        constructor();
        private onAddedToStage;
        private onRemoveFromStage;
        private boundDragInfo;
        private onMouseMove;
        private onMouseDown;
        private onBoundDrag;
        private onBoundDragEnd;
    }
}
declare namespace editor {
    var maskview: Maskview;
    /**
     * 在界面后面添加一层透明界面，当点击到透明界面时关闭界面。
     */
    class Maskview {
        mask(displayObject: egret.DisplayObject): void;
    }
}
declare namespace editor {
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    var popupview: Popupview;
    interface PopupviewParam<T> {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        /**
         * 默认为true
         */
        mode?: boolean;
        closecallback?: (object: T) => void;
    }
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    class Popupview {
        /**
         * 弹出一个 objectview
         *
         * @param object
         * @param closecallback
         * @param param
         */
        popupObject<T>(object: T, param?: PopupviewParam<T>): void;
        /**
         * 弹出一个界面
         *
         * @param view
         * @param param
         */
        popupView(view: eui.Component, param?: PopupviewParam<any>): void;
        /**
         * 弹出一个包含objectview的窗口
         *
         * @param object
         * @param closecallback
         * @param param
         */
        popupObjectWindow<T>(object: T, param?: PopupviewParam<T>): void;
        /**
         * 弹出一个包含给出界面的窗口
         *
         * @param view
         * @param closecallback
         * @param param
         */
        popupViewWindow(view: egret.DisplayObject, param?: PopupviewParam<any>): void;
    }
}
declare namespace editor {
    /**
     * 下拉列表
     */
    class ComboBox extends eui.Component implements eui.UIComponent {
        label: eui.Label;
        list: eui.List;
        /**
         * 数据
         */
        dataProvider: {
            label: string;
            value: any;
        }[];
        /**
         * 选中数据
         */
        data: {
            label: string;
            value: any;
        };
        _data: {
            label: string;
            value: any;
        };
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private init;
        private updateview;
        private onClick;
        private onlistChange;
    }
}
declare namespace editor {
    class Accordion extends eui.Component implements eui.UIComponent {
        titleGroup: eui.Group;
        titleLabel: eui.Label;
        contentGroup: eui.Group;
        /**
         * 标签名称
         */
        titleName: string;
        private components;
        constructor();
        addContent(component: eui.Component): void;
        removeContent(component: eui.Component): void;
        protected onComplete(): void;
        protected onAddedToStage(): void;
        protected onRemovedFromStage(): void;
        private onTitleButtonClick;
    }
}
declare namespace editor {
    class ColorPicker extends eui.Component implements eui.UIComponent {
        picker: eui.Rect;
        value: feng3d.Color3 | feng3d.Color4;
        private _value;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onClick;
        private onPickerViewChanged;
    }
}
declare namespace editor {
    class TreeItemRenderer extends eui.ItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        /**
         * 子结点相对父结点的缩进值，以像素为单位。默认17。
         */
        indentation: number;
        data: TreeNode;
        private watchers;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onDisclosureButtonClick;
        private updateView;
    }
}
declare namespace editor {
    interface TreeNodeMap {
        added: TreeNode;
        removed: TreeNode;
        openChanged: TreeNode;
    }
    interface TreeNode {
        once<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeNodeMap>(type: K, data?: TreeNodeMap[K], bubbles?: boolean): feng3d.Event<TreeNodeMap[K]>;
        has<K extends keyof TreeNodeMap>(type: K): boolean;
        on<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeNodeMap>(type?: K, listener?: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any): any;
    }
    class TreeNode extends feng3d.EventDispatcher {
        /**
         * 标签
         */
        label: string;
        /**
         * 目录深度
         */
        readonly depth: number;
        /**
         * 是否打开
         */
        isOpen: boolean;
        /**
         * 是否选中
         */
        selected: boolean;
        /**
         * 父结点
         */
        parent: TreeNode;
        /**
         * 子结点列表
         */
        children: TreeNode[];
        constructor(obj?: gPartial<TreeNode>);
        /**
         * 销毁
         */
        destroy(): void;
        /**
         * 判断是否包含结点
         */
        contain(node: TreeNode): boolean;
        addChild(node: TreeNode): void;
        remove(): void;
        getShowNodes(): TreeNode[];
        openParents(): void;
        private openChanged;
        private selectedChanged;
    }
}
declare namespace editor {
    class Vector3DView extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        wGroup: eui.Group;
        wTextInput: eui.TextInput;
        vm: feng3d.Vector3 | feng3d.Vector4;
        private _vm;
        constructor();
        showw: any;
        private _showw;
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private addItemEventListener;
        private removeItemEventListener;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        updateView(): void;
        private onTextChange;
    }
}
declare namespace editor {
    class ComponentView extends eui.Component {
        component: feng3d.Components;
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        componentIcon: eui.Image;
        helpBtn: eui.Button;
        operationBtn: eui.Button;
        scriptView: feng3d.IObjectView;
        /**
         * 对象界面数据
         */
        constructor(component: feng3d.Components);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete;
        private onDeleteButton;
        private onAddToStage;
        private onRemovedFromStage;
        private onRefreshView;
        private updateEnableCB;
        private onEnableCBChange;
        private initScriptView;
        private removeScriptView;
        private onOperationBtnClick;
        private onHelpBtnClick;
        private onScriptChanged;
    }
}
declare namespace editor {
    class ParticleComponentView extends eui.Component {
        component: feng3d.ParticleModule;
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        /**
         * 对象界面数据
         */
        constructor(component: feng3d.ParticleModule);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete;
        private onAddToStage;
        private onRemovedFromStage;
        private updateEnableCB;
        private onEnableCBChange;
    }
}
declare namespace editor {
    /**
     * 菜单
     */
    var menu: Menu;
    type MenuItem = {
        /**
         * 显示标签
         */
        label?: string;
        accelerator?: string;
        role?: string;
        type?: 'separator';
        /**
         * 点击事件
         */
        click?: () => void;
        /**
         * 子菜单
         */
        submenu?: MenuItem[];
        /**
         * 是否启用，禁用时显示灰色
         */
        enable?: boolean;
        /**
         * 是否显示，默认显示
         */
        show?: boolean;
    };
    class Menu {
        /**
         * 弹出菜单
         *
         *
         * @param menuItems 菜单数据
         *
         * @returns
该功能存在一个暂时无法解决的bug
```
[{
    label: "Rendering",
    submenu: [
        { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
        { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
        { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
    ]
}]
```
如上代码中 ``` "Camera" ``` 比 ``` "DirectionalLight" ``` 要短时会出现子菜单盖住父菜单情况，代码需要修改如下才能规避该情况
```
[{
    label: "Rendering",
    submenu: [
        { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
        { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
        { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
    ]
}]
```
         *
         */
        popup(menuItems: MenuItem[]): MenuUI;
        /**
         * 处理菜单中 show==false的菜单项
         *
         * @param menuItem 菜单数据
         */
        handleShow(menuItem: MenuItem): MenuItem;
        /**
         * 弹出枚举选择菜单
         *
         * @param enumDefinition 枚举定义
         * @param currentValue 当前枚举值
         * @param selectCallBack 选择回调
         */
        popupEnum(enumDefinition: Object, currentValue: any, selectCallBack: (v: any) => void): void;
    }
    class MenuUI extends eui.List {
        subMenuUI: MenuUI;
        private _subMenuUI;
        private parentMenuUI;
        readonly topMenu: MenuUI;
        constructor();
        static create(menuItems: MenuItem[], menuItemRendererRect?: egret.Rectangle): MenuUI;
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private updateView;
        remove(): void;
    }
}
declare namespace editor {
    /**
     * 消息模块
     *
     * 用于显示提示信息，例如屏幕中间的上浮信息
     */
    class Message {
        private _messages;
        private _showMessageIndex;
        private _messageLabelPool;
        /**
         * 显示间隔
         */
        private _interval;
        constructor();
        private _onMessage;
        private _onErrorMessage;
        private _getMessageItem;
        private _showMessage;
    }
}
declare namespace editor {
    var toolTip: ToolTip;
    interface ITipView extends egret.DisplayObject {
        value: any;
    }
    class ToolTip {
        /**
         * 默认 提示界面
         */
        defaultTipview: () => typeof TipString;
        /**
         * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
         */
        tipviewmap: Map<any, new () => ITipView>;
        private tipmap;
        private tipView;
        register(displayObject: egret.DisplayObject, tip: any): void;
        unregister(displayObject: egret.DisplayObject): void;
        private onMouseOver;
        private onMouseOut;
        private removeTipview;
    }
}
declare namespace editor {
    /**
     */
    class ColorPickerView extends eui.Component {
        group0: eui.Group;
        image0: eui.Image;
        pos0: eui.Group;
        group1: eui.Group;
        image1: eui.Image;
        pos1: eui.Group;
        txtR: eui.TextInput;
        txtG: eui.TextInput;
        txtB: eui.TextInput;
        groupA: eui.Group;
        txtA: eui.TextInput;
        txtColor: eui.TextInput;
        color: feng3d.Color3 | feng3d.Color4;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private _mouseDownGroup;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        private _textfocusintxt;
        protected ontxtfocusin(e: egret.Event): void;
        protected ontxtfocusout(e: egret.Event): void;
        private onTextChange;
        private onColorChanged;
        private basecolor;
        private rw;
        private rh;
        private ratio;
        private updateView;
        private _groupAParent;
    }
    var colorPickerView: ColorPickerView;
}
declare namespace editor {
    /**
     * 区域选择框
     */
    class AreaSelectRect extends eui.Rect {
        fillAlpha: number;
        fillColor: number;
        /**
         * 显示
         * @param start 起始位置
         * @param end 结束位置
         */
        show(start: {
            x: number;
            y: number;
        }, end: {
            x: number;
            y: number;
        }): void;
        /**
         * 隐藏
         */
        hide(): void;
    }
}
declare namespace editor {
    /**
     * 最大最小曲线界面
     */
    class MinMaxCurveView extends eui.Component {
        minMaxCurve: feng3d.MinMaxCurve;
        constantGroup: eui.Group;
        constantTextInput: eui.TextInput;
        curveGroup: eui.Group;
        curveImage: eui.Image;
        randomBetweenTwoConstantsGroup: eui.Group;
        minValueTextInput: eui.TextInput;
        maxValueTextInput: eui.TextInput;
        modeBtn: eui.Button;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private onReSize;
        private _onMinMaxCurveChanged;
        private onClick;
        private onPickerViewChanged;
        private _onRightClick;
    }
}
declare namespace editor {
    var minMaxCurveEditor: MinMaxCurveEditor;
    class MinMaxCurveEditor extends eui.Component {
        minMaxCurve: feng3d.MinMaxCurve;
        viewGroup: eui.Group;
        curveImage: eui.Image;
        curveGroup: eui.Group;
        multiplierInput: eui.TextInput;
        y_0: eui.Label;
        y_1: eui.Label;
        y_2: eui.Label;
        y_3: eui.Label;
        x_0: eui.Label;
        x_1: eui.Label;
        x_2: eui.Label;
        x_3: eui.Label;
        x_4: eui.Label;
        x_5: eui.Label;
        x_6: eui.Label;
        x_7: eui.Label;
        x_8: eui.Label;
        x_9: eui.Label;
        x_10: eui.Label;
        samplesOperationBtn: eui.Button;
        samplesGroup: eui.Group;
        sample_0: eui.Image;
        sample_1: eui.Image;
        sample_2: eui.Image;
        sample_3: eui.Image;
        sample_4: eui.Image;
        sample_5: eui.Image;
        sample_6: eui.Image;
        sample_7: eui.Image;
        private timeline;
        private timeline1;
        private curveRect;
        private canvasRect;
        private editKey;
        private editorControlkey;
        private editTimeline;
        private editing;
        private mousedownxy;
        private selectedKey;
        private selectTimeline;
        private curveColor;
        private backColor;
        private fillTwoCurvesColor;
        private range;
        private imageUtil;
        /**
         * 点绘制尺寸
         */
        private pointSize;
        /**
         * 控制柄长度
         */
        private controllerLength;
        private yLabels;
        private xLabels;
        private sampleImages;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private updateXYLabels;
        private updateSampleImages;
        private onSampleClick;
        /**
         * 绘制曲线关键点
         * @param animationCurve
         */
        private drawCurveKeys;
        /**
         * 曲线上的坐标转换为UI上的坐标
         * @param time
         * @param value
         */
        private curveToUIPos;
        /**
         * UI上坐标转换为曲线上坐标
         * @param x
         * @param y
         */
        private uiToCurvePos;
        private getKeyUIPos;
        private getKeyLeftControlUIPos;
        private getKeyRightControlUIPos;
        /**
         * 绘制选中的关键点
         */
        private drawSelectedKey;
        private drawGrid;
        private _onMinMaxCurveChanged;
        private _onReSize;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        private findControlKey;
        private ondblclick;
    }
}
declare namespace editor {
    class MinMaxCurveVector3View extends eui.Component {
        minMaxCurveVector3: feng3d.MinMaxCurveVector3;
        xMinMaxCurveView: editor.MinMaxCurveView;
        yMinMaxCurveView: editor.MinMaxCurveView;
        zMinMaxCurveView: editor.MinMaxCurveView;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private _onMinMaxCurveVector3Changed;
        private _onchanged;
    }
}
declare namespace editor {
    /**
     * 最大最小颜色渐变界面
     */
    class MinMaxGradientView extends eui.Component {
        minMaxGradient: feng3d.MinMaxGradient;
        colorGroup0: eui.Group;
        colorImage0: eui.Image;
        secondGroup: eui.Group;
        colorGroup1: eui.Group;
        colorImage1: eui.Image;
        modeBtn: eui.Button;
        private secondGroupParent;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private onReSize;
        private _onMinMaxGradientChanged;
        private activeColorGroup;
        private onClick;
        private onPickerViewChanged;
        private _onRightClick;
    }
}
declare namespace editor {
    var gradientEditor: GradientEditor;
    class GradientEditor extends eui.Component {
        gradient: feng3d.Gradient;
        modeCB: ComboBox;
        controllerGroup: eui.Group;
        alphaLineGroup: eui.Group;
        colorImage: eui.Image;
        colorLineGroup: eui.Group;
        colorGroup: eui.Group;
        colorPicker: editor.ColorPicker;
        alphaGroup: eui.Group;
        alphaLabel: eui.Label;
        alphaSlide: eui.HSlider;
        alphaInput: eui.TextInput;
        locationLabel: eui.Label;
        locationInput: eui.TextInput;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private _alphaSprite;
        private _colorSprite;
        private _parentGroup;
        private _loactionNumberTextInputBinder;
        private _alphaNumberSliderTextInputBinder;
        private _selectedValue;
        private _drawAlphaGraphics;
        private _drawColorGraphics;
        private _onAlphaChanged;
        private _onLocationChanged;
        private _onReSize;
        private _onModeCBChange;
        private _onColorPickerChange;
        private _onGradientChanged;
        private _onMouseDownLineGroup;
        private _removedTemp;
        private _onMouseDown;
        private _onAlphaColorMouseMove;
        private _onAlphaColorMouseUp;
    }
}
declare namespace editor {
    /**
     * String 提示框
     */
    class TipString extends eui.Component implements eui.UIComponent {
        txtLab: eui.Label;
        constructor();
        value: string;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private valuechanged;
    }
}
declare namespace eui {
    interface Component {
        addBinder(...binders: editor.UIBinder[]): void;
    }
}
declare namespace editor {
    interface UIBinder {
        init(v: Partial<this>): this;
        dispose(): void;
    }
    interface TextInputBinderEventMap {
        valueChanged: any;
    }
    interface TextInputBinder {
        once<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.Event<TextInputBinderEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TextInputBinderEventMap>(type: K, data?: TextInputBinderEventMap[K], bubbles?: boolean): feng3d.Event<TextInputBinderEventMap[K]>;
        has<K extends keyof TextInputBinderEventMap>(type: K): boolean;
        on<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.Event<TextInputBinderEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TextInputBinderEventMap>(type?: K, listener?: (event: feng3d.Event<TextInputBinderEventMap[K]>) => any, thisObject?: any): any;
    }
    class TextInputBinder extends feng3d.EventDispatcher implements UIBinder {
        space: any;
        /**
         * 绑定属性名称
         */
        attribute: string;
        textInput: eui.TextInput;
        /**
         * 是否可编辑
         */
        editable: boolean;
        /**
         * 绑定属性值转换为文本
         */
        toText: (v: any) => any;
        /**
         * 文本转换为绑定属性值
         */
        toValue: (v: any) => any;
        init(v: Partial<this>): this;
        dispose(): void;
        protected initView(): void;
        protected onValueChanged(): void;
        protected updateView(): void;
        protected onTextChange(): void;
        private _textfocusintxt;
        protected ontxtfocusin(): void;
        protected ontxtfocusout(): void;
        protected invalidateView(): void;
    }
}
declare namespace editor {
    class NumberTextInputBinder extends TextInputBinder {
        /**
         * 步长，精度
         */
        step: number;
        /**
         * 键盘上下方向键步长
         */
        stepDownup: number;
        /**
         * 移动一个像素时增加的步长数量
         */
        stepScale: number;
        /**
         * 控制器
         */
        controller: egret.DisplayObject;
        /**
         * 最小值
         */
        minValue: number;
        /**
         * 最小值
         */
        maxValue: number;
        toText: (v: any) => string;
        toValue: (v: any) => number;
        initView(): void;
        dispose(): void;
        protected onValueChanged(): void;
        private mouseDownPosition;
        private mouseDownValue;
        private onMouseDown;
        private onStageMouseMove;
        private onStageMouseUp;
        protected ontxtfocusin(): void;
        protected ontxtfocusout(): void;
        private onWindowKeyDown;
    }
}
declare namespace editor {
    class NumberSliderTextInputBinder extends NumberTextInputBinder {
        slider: eui.HSlider;
        initView(): void;
        dispose(): void;
        protected updateView(): void;
        private _onSliderChanged;
    }
}
declare namespace editor {
    /**
     * 给显示对象注册禁止 Scroll 滚动功能
     *
     * 当鼠标在指定对象上按下时禁止滚动，鼠标弹起后取消禁止滚动
     */
    class MouseOnDisableScroll {
        static register(sprite: egret.DisplayObject): void;
        static unRegister(sprite: egret.DisplayObject): void;
        private static onMouseDown;
        private static onStageMouseUp;
    }
}
declare namespace editor {
    class TerrainView extends eui.Component {
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
    }
}
declare namespace editor {
    class OVTerrain extends TerrainView implements feng3d.IObjectView {
        space: Object;
        private _objectViewInfo;
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
    }
}
declare namespace editor {
    /**
     * 默认基础对象界面
     */
    class OVBaseDefault extends eui.Component implements feng3d.IObjectView {
        label: eui.Label;
        image: eui.Image;
        private _space;
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        space: Object;
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare namespace feng3d {
    interface IObjectView extends eui.Component {
    }
    interface IObjectBlockView extends eui.Component {
    }
    interface IObjectAttributeView extends eui.Component {
    }
}
declare namespace editor {
    /**
     * 默认使用块的对象界面
     */
    class OVDefault extends eui.Component implements feng3d.IObjectView {
        private _space;
        private _objectViewInfo;
        private blockViews;
        group: eui.Group;
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initview(): void;
        dispose(): void;
        space: Object;
        private invalidateView;
        /**
         * 更新界面
         */
        updateView(): void;
        getblockView(blockName: string): feng3d.IObjectBlockView;
        getAttributeView(attributeName: string): feng3d.IObjectAttributeView;
    }
}
declare namespace editor {
    class OVTransform extends eui.Component implements feng3d.IObjectView {
        xLabel: eui.Label;
        xTextInput: eui.TextInput;
        yLabel: eui.Label;
        yTextInput: eui.TextInput;
        zLabel: eui.Label;
        zTextInput: eui.TextInput;
        rxLabel: eui.Label;
        rxTextInput: eui.TextInput;
        ryLabel: eui.Label;
        ryTextInput: eui.TextInput;
        rzLabel: eui.Label;
        rzTextInput: eui.TextInput;
        sxLabel: eui.Label;
        sxTextInput: eui.TextInput;
        syLabel: eui.Label;
        syTextInput: eui.TextInput;
        szLabel: eui.Label;
        szTextInput: eui.TextInput;
        private _space;
        private _objectViewInfo;
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        space: feng3d.Transform;
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare namespace editor {
    /**
     * 默认对象属性块界面
     */
    class OBVDefault extends eui.Component implements feng3d.IObjectBlockView {
        private _space;
        private _blockName;
        private attributeViews;
        private itemList;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        border: eui.Rect;
        objectView: feng3d.IObjectView;
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo: feng3d.BlockViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initView(): void;
        dispose(): void;
        space: Object;
        readonly blockName: string;
        updateView(): void;
        getAttributeView(attributeName: String): feng3d.IObjectAttributeView;
        private onTitleButtonClick;
    }
}
declare namespace feng3d {
    class ObjectViewEvent extends egret.Event {
        static VALUE_CHANGE: string;
        space: any;
        attributeName: string;
    }
}
declare namespace editor {
    class OAVBase extends eui.Component implements feng3d.IObjectAttributeView {
        protected _space: any;
        protected _attributeName: string;
        protected _attributeType: string;
        protected _attributeViewInfo: feng3d.AttributeViewInfo;
        labelLab: eui.Label;
        /**
         * 对象属性界面
         */
        objectView: feng3d.IObjectView;
        /**
         * 对象属性块界面
         */
        objectBlockView: feng3d.IObjectBlockView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: any;
        private label;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        /**
         * 初始化
         */
        initView(): void;
        /**
         * 销毁
         */
        dispose(): void;
        /**
         * 更新
         */
        updateView(): void;
        readonly attributeName: string;
        attributeValue: any;
    }
}
declare namespace editor {
    /**
     * 默认对象属性界面
     */
    class OAVDefault extends OAVBase {
        labelLab: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        dragparam: {
            accepttype: keyof DragDataMap;
            datatype: string;
        };
        initView(): void;
        dispose(): void;
        private _textfocusintxt;
        protected ontxtfocusin(): void;
        protected ontxtfocusout(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick;
        private onTextChange;
    }
}
declare namespace editor {
    class OAVBoolean extends OAVBase {
        checkBox: eui.CheckBox;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected onChange(event: egret.Event): void;
    }
}
declare namespace editor {
    /**
     * 默认对象属性界面
     */
    class OAVNumber extends OAVBase {
        labelLab: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
    }
}
declare namespace editor {
    class OAVString extends OAVBase {
        txtInput: eui.TextInput;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
    }
}
declare namespace editor {
    /**
     * 默认对象属性界面
     */
    class OAVMultiText extends OAVBase {
        txtLab: eui.Label;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
    }
}
declare namespace editor {
    class OAVVector3D extends OAVBase {
        labelLab: eui.Label;
        vector3DView: editor.Vector3DView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
    }
}
declare namespace editor {
    class OAVArray extends OAVBase {
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Rect;
        contentGroup: eui.Group;
        sizeTxt: eui.TextInput;
        private attributeViews;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: Object;
        readonly attributeName: string;
        attributeValue: any[];
        initView(): void;
        dispose(): void;
        private onTitleButtonClick;
        private onsizeTxtfocusout;
    }
    class OAVArrayItem extends OAVDefault {
        constructor(arr: any[], index: number, componentParam: Object);
        initView(): void;
    }
}
declare namespace editor {
    class OAVEnum extends OAVBase {
        labelLab: eui.Label;
        combobox: ComboBox;
        private list;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        enumClass: any;
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onComboxChange;
    }
}
declare namespace editor {
    class OAVImage extends OAVBase {
        image: eui.Image;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        onResize(): void;
    }
}
declare namespace editor {
    class OAVCubeMap extends OAVBase {
        px: eui.Image;
        py: eui.Image;
        pz: eui.Image;
        nx: eui.Image;
        ny: eui.Image;
        nz: eui.Image;
        pxGroup: eui.Group;
        pxBtn: eui.Button;
        pyGroup: eui.Group;
        pyBtn: eui.Button;
        pzGroup: eui.Group;
        pzBtn: eui.Button;
        nxGroup: eui.Group;
        nxBtn: eui.Button;
        nyGroup: eui.Group;
        nyBtn: eui.Button;
        nzGroup: eui.Group;
        nzBtn: eui.Button;
        private images;
        private btns;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        private updateImage;
        private onImageClick;
        private dispatchValueChange;
        dispose(): void;
        updateView(): void;
        onResize(): void;
    }
}
declare namespace editor {
    class OAVComponentList extends OAVBase {
        protected _space: feng3d.GameObject;
        group: eui.Group;
        addComponentButton: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        private onAddComponentButtonClick;
        space: feng3d.GameObject;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        private addComponentView;
        /**
         * 更新界面
         */
        updateView(): void;
        private removedComponentView;
        private onAddCompont;
        private onRemoveComponent;
    }
}
declare namespace editor {
    class OAVFunction extends OAVBase {
        labelLab: eui.Label;
        button: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected click(event: egret.Event): void;
    }
}
declare namespace editor {
    class OAVColorPicker extends OAVBase {
        labelLab: eui.Label;
        colorPicker: editor.ColorPicker;
        input: eui.TextInput;
        attributeValue: feng3d.Color3 | feng3d.Color4;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected onChange(event: egret.Event): void;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        private onTextChange;
    }
}
declare namespace editor {
    class OAVMaterialName extends OAVBase {
        tileIcon: eui.Image;
        nameLabel: eui.Label;
        operationBtn: eui.Button;
        helpBtn: eui.Button;
        shaderComboBox: ComboBox;
        group: eui.Group;
        space: feng3d.Material;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onShaderComboBoxChange;
    }
}
declare namespace editor {
    class OAVObjectView extends OAVBase {
        group: eui.Group;
        views: feng3d.IObjectView[];
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        updateView(): void;
        /**
         * 销毁
         */
        dispose(): void;
        private onRefreshView;
    }
}
declare namespace editor {
    class OAVAccordionObjectView extends OAVBase {
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        /**
         * 对象界面数据
         */
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        /**
         * 更新界面
         */
        updateView(): void;
        initView(): void;
        dispose(): void;
        private updateEnableCB;
        private onEnableCBChange;
    }
}
declare namespace editor {
    class OAVGameObjectName extends OAVBase {
        nameInput: eui.TextInput;
        visibleCB: eui.CheckBox;
        mouseEnabledCB: eui.CheckBox;
        space: feng3d.GameObject;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onVisibleCBClick;
        private onMouseEnabledCBClick;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        private onTextChange;
    }
}
declare namespace editor {
    /**
     * 挑选（拾取）OAV界面
     */
    class OAVPick extends OAVBase {
        labelLab: eui.Label;
        text: eui.Label;
        pickBtn: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private onPickBtnClick;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick;
    }
}
declare namespace editor {
    /**
     * 挑选（拾取）OAV界面
     */
    class OAVTexture2D extends OAVBase {
        image: eui.Image;
        pickBtn: eui.Button;
        labelLab: eui.Label;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private ontxtClick;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick;
    }
}
declare namespace editor {
    class OAVParticleComponentList extends OAVBase {
        protected _space: feng3d.ParticleSystem;
        group: eui.Group;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: feng3d.ParticleSystem;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private addComponentView;
        private removedComponentView;
    }
}
declare namespace editor {
    class OAVFeng3dPreView extends OAVBase {
        image: eui.Image;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private preMousePos;
        private onMouseDown;
        private onMouseMove;
        private cameraRotation;
        private onDrawObject;
        private onMouseUp;
        updateView(): void;
        onResize(): void;
    }
}
declare namespace editor {
    class OAVMinMaxCurve extends OAVBase {
        labelLab: eui.Label;
        minMaxCurveView: editor.MinMaxCurveView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
declare namespace editor {
    class OAVMinMaxCurveVector3 extends OAVBase {
        labelLab: eui.Label;
        minMaxCurveVector3View: editor.MinMaxCurveVector3View;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
declare namespace editor {
    class OAVMinMaxGradient extends OAVBase {
        labelLab: eui.Label;
        minMaxGradientView: editor.MinMaxGradientView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
declare namespace editor {
    /**
     * 属性面板（检查器）
     */
    class InspectorView extends eui.Component implements ModuleView {
        static moduleName: string;
        typeLab: eui.Label;
        backButton: eui.Button;
        group: eui.Group;
        emptyLabel: eui.Label;
        moduleName: string;
        constructor();
        private showData;
        private onShowData;
        private onSaveShowData;
        private updateView;
        /**
         * 保存显示数据
         */
        private saveShowData;
        private _view;
        private _viewData;
        private _viewDataList;
        private _dataChanged;
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onSelectedObjectsChanged;
        private updateShowData;
        private onValueChanged;
        private onBackButton;
    }
}
declare namespace editor {
    var inspectorMultiObject: InspectorMultiObject;
    /**
     * 检查器多对象
     *
     * 处理多个对象在检查器中显示问题
     */
    class InspectorMultiObject {
        convertInspectorObject(objects: any[]): any;
    }
}
declare namespace editor {
    class HierarchyTreeItemRenderer extends TreeItemRenderer {
        data: HierarchyNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onclick;
        private onDoubleClick;
        private onrightclick;
    }
}
declare namespace editor {
    class HierarchyView extends eui.Component implements ModuleView {
        /**
         * 模块名称
         */
        static moduleName: string;
        hierachyScroller: eui.Scroller;
        list: eui.List;
        private listData;
        /**
         * 模块名称
         */
        moduleName: string;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onRootNodeChanged;
        private onRootNode;
        private offRootNode;
        private invalidHierarchy;
        private updateHierarchyTree;
        private onListClick;
        private onListRightClick;
    }
}
declare namespace editor {
    var editorAsset: EditorAsset;
    class EditorAsset {
        /**
         * 资源ID字典
         */
        private _assetIDMap;
        /**
         * 显示文件夹
         */
        showFloder: AssetNode;
        /**
         * 项目资源id树形结构
         */
        rootFile: AssetNode;
        constructor();
        /**
         * 初始化项目
         * @param callback
         */
        initproject(callback: () => void): void;
        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void): void;
        /**
         * 根据资源编号获取文件
         *
         * @param assetId 文件路径
         */
        getAssetByID(assetId: string): AssetNode;
        /**
         * 删除资源
         *
         * @param assetNode 资源
         */
        deleteAsset(assetNode: AssetNode, callback?: (err: Error) => void): void;
        /**
         * 保存资源
         *
         * @param assetNode 资源
         * @param callback 完成回调
         */
        saveAsset(assetNode: AssetNode, callback?: () => void): void;
        /**
         * 新增资源
         *
         * @param cls 资源类定义
         * @param fileName 文件名称
         * @param value 初始数据
         * @param folderNode 所在文件夹，如果值为null时默认添加到根文件夹中
         * @param callback 完成回调函数
         */
        createAsset<T extends feng3d.FileAsset>(folderNode: AssetNode, cls: new () => T, fileName?: string, value?: gPartial<T>, callback?: (err: Error, assetNode: AssetNode) => void): void;
        /**
         * 弹出文件菜单
         */
        popupmenu(assetNode: AssetNode): void;
        /**
         * 保存对象
         *
         * @param object 对象
         * @param callback
         */
        saveObject(object: feng3d.AssetData, callback?: (file: AssetNode) => void): void;
        /**
         *
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetNodes 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files: File[], callback?: (files: AssetNode[]) => void, assetNodes?: AssetNode[]): void;
        runProjectScript(callback?: () => void): void;
        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent;
        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetNode 文件
         */
        private parserMenu;
        private showFloderChanged;
        private onParsed;
    }
}
declare var codeeditoWin: Window;
declare namespace editor {
    class AssetFileItemRenderer extends eui.ItemRenderer {
        icon: eui.Image;
        data: AssetNode;
        itemSelected: boolean;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private ondoubleclick;
        private onclick;
        private onrightclick;
        private selectedfilechanged;
    }
}
declare namespace editor {
    interface AssetNodeEventMap extends TreeNodeMap {
        /**
         * 加载完成
         */
        loaded: any;
    }
    interface AssetNode {
        once<K extends keyof AssetNodeEventMap>(type: K, listener: (event: feng3d.Event<AssetNodeEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof AssetNodeEventMap>(type: K, data?: AssetNodeEventMap[K], bubbles?: boolean): feng3d.Event<AssetNodeEventMap[K]>;
        has<K extends keyof AssetNodeEventMap>(type: K): boolean;
        on<K extends keyof AssetNodeEventMap>(type: K, listener: (event: feng3d.Event<AssetNodeEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof AssetNodeEventMap>(type?: K, listener?: (event: feng3d.Event<AssetNodeEventMap[K]>) => any, thisObject?: any): any;
    }
    /**
     * 资源树结点
     */
    class AssetNode extends TreeNode {
        /**
         * 是否文件夹
         */
        isDirectory: boolean;
        /**
         * 图标名称或者路径
         */
        image: string;
        /**
         * 显示标签
         */
        label: string;
        children: AssetNode[];
        parent: AssetNode;
        asset: feng3d.FileAsset;
        /**
         * 是否已加载
         */
        isLoaded: boolean;
        /**
         * 是否加载中
         */
        private isLoading;
        /**
         * 构建
         *
         * @param asset 资源
         */
        constructor(asset: feng3d.FileAsset);
        /**
         * 加载
         *
         * @param callback 加载完成回调
         */
        load(callback?: () => void): void;
        /**
         * 更新缩略图
         */
        updateImage(): void;
        /**
         * 删除
         */
        delete(): void;
        /**
         * 获取文件夹列表
         *
         * @param includeClose 是否包含关闭的文件夹
         */
        getFolderList(includeClose?: boolean): AssetNode[];
        /**
         * 获取文件列表
         */
        getFileList(): AssetNode[];
        /**
         * 提供拖拽数据
         *
         * @param dragSource
         */
        setdargSource(dragSource: DragData): void;
        /**
         * 接受拖拽数据
         *
         * @param dragdata
         */
        acceptDragDrop(dragdata: DragData): void;
        /**
         * 导出
         */
        export(): void;
    }
}
declare namespace editor {
    class AssetTreeItemRenderer extends TreeItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        data: AssetNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private showFloderChanged;
        private onclick;
        private onrightclick;
    }
}
declare namespace editor {
    /**
     * 项目模块视图
     */
    class ProjectView extends eui.Component implements ModuleView {
        assetTreeScroller: eui.Scroller;
        assetTreeList: eui.List;
        floderpathTxt: eui.Label;
        includeTxt: eui.TextInput;
        excludeTxt: eui.TextInput;
        filelistgroup: eui.Group;
        floderScroller: eui.Scroller;
        filelist: eui.List;
        filepathLabel: eui.Label;
        private _assettreeInvalid;
        private listData;
        private filelistData;
        private fileDrag;
        private _areaSelectRect;
        /**
         * 模块名称
         */
        moduleName: string;
        static moduleName: string;
        constructor();
        private onComplete;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private initlist;
        private update;
        invalidateAssettree(): void;
        private updateAssetTree;
        private updateShowFloder;
        private onfilter;
        private selectedfilechanged;
        private onfilelistclick;
        private onfilelistrightclick;
        private onfloderpathTxtLink;
        private areaSelectStartPosition;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
    }
}
declare namespace editor {
    var assetFileTemplates: AssetFileTemplates;
    class AssetFileTemplates {
        /**
         *
         * @param scriptName 脚本名称（类名）
         */
        getNewScript(scriptName: any): string;
        /**
         *
         * @param shadername shader名称
         */
        getNewShader(shadername: string): string;
    }
}
declare namespace editor {
    class TopView extends eui.Component implements eui.UIComponent {
        menuList: eui.List;
        labelLab: eui.Label;
        topGroup: eui.Group;
        moveButton: eui.ToggleButton;
        rotateButton: eui.ToggleButton;
        scaleButton: eui.ToggleButton;
        centerButton: eui.ToggleButton;
        worldButton: eui.ToggleButton;
        helpButton: eui.Button;
        qrcodeButton: eui.Button;
        settingButton: eui.Button;
        stopBtn: eui.Button;
        playBtn: eui.Button;
        nextframeBtn: eui.Button;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onHelpButtonClick;
        private onButtonClick;
        private updateview;
    }
    class TopMenuItemRenderer extends eui.ItemRenderer {
        data: MenuItem;
        selectedRect: eui.Rect;
        label: eui.Label;
        protected dataChanged(): void;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private updateView;
        private onItemMouseDown;
    }
    var runwin: Window;
}
declare namespace editor {
    class NavigationView extends eui.Component implements ModuleView {
        moduleName: string;
        static moduleName: string;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
    }
}
declare namespace editor {
    /**
     * 主分割界面
     *
     * 用于管理分割界面，以及处理界面布局
     */
    class MainSplitView extends eui.Component implements eui.UIComponent {
        constructor();
        protected childrenCreated(): void;
        private onAddedToStage;
        private onRemovedFromStage;
        private _initViewLayout;
        private _saveViewLayout;
        private _resetLayout;
        private _resolve;
        private _getData;
        private _createViews;
    }
}
declare namespace editor {
    class MainView extends eui.Component implements eui.UIComponent {
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onresize;
    }
}
declare namespace editor {
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
declare namespace editor {
    class LoadingUI extends egret.Sprite {
        constructor();
        private textField;
        private createView;
        setProgress(current: number, total: number): void;
    }
}
declare namespace editor {
    class MainUI extends eui.UILayer {
        onComplete: () => void;
        constructor(onComplete?: () => void);
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
        private onConfigComplete;
        private isThemeLoadEnd;
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        private onThemeLoadComplete;
        private isResourceLoadEnd;
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        private onResourceLoadComplete;
        private createScene;
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError;
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError;
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress;
    }
}
declare namespace editor {
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
declare namespace editor {
    interface EditorUI {
        stage: egret.Stage;
        assetview: ProjectView;
        mainview: MainView;
        tooltipLayer: eui.UILayer;
        popupLayer: eui.UILayer;
        messageLayer: eui.UILayer;
    }
    var editorui: EditorUI;
}
declare namespace editor {
    /**
     * 编辑器数据
     */
    var editorData: EditorData;
    /**
     * 游戏对象控制器类型
     */
    enum MRSToolType {
        /**
         * 移动
         */
        MOVE = 0,
        /**
         * 旋转
         */
        ROTATION = 1,
        /**
         * 缩放
         */
        SCALE = 2
    }
    /**
     * 编辑器数据
     */
    class EditorData {
        /**
         * 游戏运行时的场景
         */
        gameScene: feng3d.Scene3D;
        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        readonly selectedObjects: (feng3d.GameObject | AssetNode)[];
        private _selectedObjects;
        clearSelectedObjects(): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(object: (feng3d.GameObject | AssetNode)): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectMultiObject(objs: (feng3d.GameObject | AssetNode)[]): void;
        /**
         * 使用的控制工具类型
         */
        toolType: MRSToolType;
        private _toolType;
        /**
         * 选中游戏对象列表
         */
        readonly selectedGameObjects: feng3d.GameObject[];
        private _selectedGameObjects;
        private _selectedGameObjectsInvalid;
        /**
         * 坐标原点是否在质心
         */
        isBaryCenter: boolean;
        private _isBaryCenter;
        /**
         * 是否使用世界坐标
         */
        isWoldCoordinate: boolean;
        private _isWoldCoordinate;
        /**
         * 变换对象
         */
        readonly transformGameObject: feng3d.GameObject;
        private _transformGameObject;
        private _transformGameObjectInvalid;
        readonly transformBox: feng3d.Box;
        private _transformBox;
        private _transformBoxInvalid;
        /**
         * 选中游戏对象列表
         */
        readonly selectedAssetNodes: AssetNode[];
        private _selectedAssetFileInvalid;
        private _selectedAssetNodes;
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetPath(url: string): string;
    }
}
declare namespace editor {
    class MRSToolTarget {
        private _controllerTargets;
        private _startScaleVec;
        private _controllerTool;
        private _startTransformDic;
        private _position;
        private _rotation;
        controllerTool: feng3d.Transform;
        controllerTargets: feng3d.Transform[];
        constructor();
        private onSelectedGameObjectChange;
        private invalidateControllerImage;
        private updateControllerImage;
        /**
         * 开始移动
         */
        startTranslation(): void;
        translation(addPos: feng3d.Vector3): void;
        stopTranslation(): void;
        startRotate(): void;
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: feng3d.Vector3): void;
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1: number, normal1: feng3d.Vector3, angle2: number, normal2: feng3d.Vector3): void;
        stopRote(): void;
        startScale(): void;
        doScale(scale: feng3d.Vector3): void;
        stopScale(): void;
        private getTransformData;
        private rotateRotation;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        MToolModel: editor.MToolModel;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateAxis: editor.CoordinateAxis;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinatePlane: editor.CoordinatePlane;
    }
}
declare namespace editor {
    /**
     * 移动工具模型组件
     */
    class MToolModel extends feng3d.Component {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;
        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;
        oCube: CoordinateCube;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
    }
    class CoordinateAxis extends feng3d.Component {
        private isinit;
        private segmentMaterial;
        private material;
        private xArrow;
        readonly color: feng3d.Color4;
        private selectedColor;
        private length;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
    class CoordinateCube extends feng3d.Component {
        private isinit;
        private colorMaterial;
        private oCube;
        color: feng3d.Color4;
        selectedColor: feng3d.Color4;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
    class CoordinatePlane extends feng3d.Component {
        private isinit;
        private colorMaterial;
        private segmentGeometry;
        color: feng3d.Color4;
        borderColor: feng3d.Color4;
        selectedColor: feng3d.Color4;
        private selectedborderColor;
        readonly width: number;
        private _width;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        RToolModel: editor.RToolModel;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SectorGameObject: editor.SectorGameObject;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateRotationFreeAxis: editor.CoordinateRotationFreeAxis;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateRotationAxis: editor.CoordinateRotationAxis;
    }
}
declare namespace editor {
    /**
     * 旋转工具模型组件
     */
    class RToolModel extends feng3d.Component {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
    }
    class CoordinateRotationAxis extends feng3d.Component {
        private isinit;
        private segmentGeometry;
        private torusGeometry;
        private sector;
        radius: number;
        readonly color: feng3d.Color4;
        private backColor;
        private selectedColor;
        selected: boolean;
        /**
         * 过滤法线显示某一面线条
         */
        filterNormal: feng3d.Vector3;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
        update(): void;
        showSector(startPos: feng3d.Vector3, endPos: feng3d.Vector3): void;
        hideSector(): void;
    }
    /**
     * 扇形对象
     */
    class SectorGameObject extends feng3d.Component {
        private isinit;
        private segmentGeometry;
        private geometry;
        private borderColor;
        radius: number;
        private _start;
        private _end;
        /**
         * 构建3D对象
         */
        init(gameObject: feng3d.GameObject): void;
        update(start?: number, end?: number): void;
    }
    class CoordinateRotationFreeAxis extends feng3d.Component {
        private isinit;
        private segmentGeometry;
        private sector;
        private radius;
        color: feng3d.Color4;
        private backColor;
        private selectedColor;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
        update(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SToolModel: editor.SToolModel;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateCube: editor.CoordinateCube;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateScaleCube: editor.CoordinateScaleCube;
    }
}
declare namespace editor {
    /**
     * 缩放工具模型组件
     */
    class SToolModel extends feng3d.Component {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
    }
    class CoordinateScaleCube extends feng3d.Component {
        private isinit;
        private coordinateCube;
        private segmentGeometry;
        readonly color: feng3d.Color4;
        private selectedColor;
        private length;
        selected: boolean;
        scaleValue: number;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
}
declare namespace editor {
    class MRSToolBase extends feng3d.Component {
        private _selectedItem;
        private _toolModel;
        protected ismouseDown: boolean;
        protected movePlane3D: feng3d.Plane3D;
        protected startSceneTransform: feng3d.Matrix4x4;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        mrsToolTarget: MRSToolTarget;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        private invalidate;
        private update;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        protected toolModel: feng3d.Component;
        selectedItem: CoordinateAxis | CoordinatePlane | CoordinateRotationFreeAxis | CoordinateRotationAxis | CoordinateCube | CoordinateScaleCube;
        protected updateToolModel(): void;
        protected onMouseDown(): void;
        protected onMouseUp(): void;
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross(): feng3d.Vector3;
        protected getMousePlaneCross(): feng3d.Vector3;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        MTool: editor.MTool;
    }
}
declare namespace editor {
    /**
     * 位移工具
     */
    class MTool extends MRSToolBase {
        protected toolModel: MToolModel;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        private startPos;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        private onMouseMove;
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        RTool: editor.RTool;
    }
}
declare namespace editor {
    class RTool extends MRSToolBase {
        protected toolModel: RToolModel;
        private startPlanePos;
        private stepPlaneCross;
        private startMousePos;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        private onMouseMove;
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        STool: editor.STool;
    }
}
declare namespace editor {
    class STool extends MRSToolBase {
        protected toolModel: SToolModel;
        private startMousePos;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        private onMouseMove;
        protected onMouseUp(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        MRSTool: editor.MRSTool;
    }
}
declare namespace editor {
    /**
     * 位移旋转缩放工具
     */
    class MRSTool extends feng3d.Component {
        private mTool;
        private rTool;
        private sTool;
        private _currentTool;
        private mrsToolObject;
        private mrsToolTarget;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        init(gameObject: feng3d.GameObject): void;
        dispose(): void;
        private invalidate;
        private update;
        private onSelectedGameObjectChange;
        private onToolTypeChange;
        private currentTool;
    }
}
declare namespace editor {
    class HierarchyNode extends TreeNode {
        isOpen: boolean;
        /**
         * 游戏对象
         */
        gameobject: feng3d.GameObject;
        /**
         * 父结点
         */
        parent: HierarchyNode;
        /**
         * 子结点列表
         */
        children: HierarchyNode[];
        constructor(obj: gPartial<HierarchyNode>);
        /**
         * 提供拖拽数据
         *
         * @param dragSource
         */
        setdargSource(dragSource: DragData): void;
        /**
         * 接受拖拽数据
         *
         * @param dragdata
         */
        acceptDragDrop(dragdata: DragData): void;
        /**
         * 销毁
         */
        destroy(): void;
        private update;
    }
}
declare namespace editor {
    var hierarchy: Hierarchy;
    class Hierarchy {
        rootnode: HierarchyNode;
        rootGameObject: feng3d.GameObject;
        constructor();
        /**
         * 获取选中结点
         */
        getSelectedNode(): HierarchyNode;
        /**
         * 获取结点
         */
        getNode(gameObject: feng3d.GameObject): HierarchyNode;
        delete(gameobject: feng3d.GameObject): void;
        /**
         * 添加游戏对象到层级树
         *
         * @param gameobject 游戏对象
         */
        addGameObject(gameobject: feng3d.GameObject): void;
        addGameoObjectFromAsset(gameobject: feng3d.GameObject, parent?: feng3d.GameObject): void;
        private _selectedGameObjects;
        private rootGameObjectChanged;
        private onSelectedGameObjectChanged;
        private ongameobjectadded;
        private ongameobjectremoved;
        private init;
        private add;
        private remove;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SceneRotateTool: editor.SceneRotateTool;
    }
}
declare namespace editor {
    class SceneRotateTool extends feng3d.Component {
        engine: EditorEngine;
        private _engine;
        private arrowsX;
        private arrowsNX;
        private arrowsY;
        private arrowsNY;
        private arrowsZ;
        private arrowsNZ;
        init(gameObject: feng3d.GameObject): void;
        private isload;
        private load;
        private onLoaded;
        private newEngine;
        private onclick;
        private clickItem;
        private onEditorCameraRotate;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        GroundGrid: editor.GroundGrid;
    }
}
declare namespace editor {
    /**
     * 地面网格
     */
    class GroundGrid extends feng3d.Component {
        private num;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        private segmentGeometry;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
}
declare namespace editor {
    class EditorEngine extends feng3d.Engine {
        wireframeColor: feng3d.Color4;
        /**
         * 编辑器场景，用于显示只在编辑器中存在的游戏对象，例如灯光Icon，对象操作工具等显示。
         */
        editorScene: feng3d.Scene3D;
        editorComponent: EditorComponent;
        /**
         * 绘制场景
         */
        render(): void;
    }
}
declare namespace editor {
    /**
    * 编辑器3D入口
    */
    class Main3D {
        constructor();
        private init;
    }
    function creatNewScene(): feng3d.Scene3D;
}
declare namespace feng3d {
    interface ComponentMap {
        EditorComponent: editor.EditorComponent;
    }
}
declare namespace editor {
    class EditorComponent extends feng3d.Component {
        scene: feng3d.Scene3D;
        private _scene;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        init(gameobject: feng3d.GameObject): void;
        /**
         * 销毁
         */
        dispose(): void;
        private onAddChild;
        private onRemoveChild;
        private onAddComponent;
        private onRemoveComponent;
        private update;
        private addComponent;
        private removeComponent;
        private directionLightIconMap;
        private pointLightIconMap;
        private spotLightIconMap;
        private cameraIconMap;
    }
}
declare namespace editor {
    var feng3dScreenShot: Feng3dScreenShot;
    /**
     * feng3d缩略图工具
     */
    class Feng3dScreenShot {
        engine: feng3d.Engine;
        scene: feng3d.Scene3D;
        camera: feng3d.Camera;
        defaultGeometry: feng3d.SphereGeometry;
        defaultMaterial: feng3d.Material;
        constructor();
        /**
         * 绘制立方体贴图
         * @param textureCube 立方体贴图
         */
        drawTextureCube(textureCube: feng3d.TextureCube): string;
        /**
         * 绘制材质
         * @param material 材质
         */
        drawMaterial(material: feng3d.Material, cameraRotation?: feng3d.Vector3): this;
        /**
         * 绘制材质
         * @param geometry 材质
         */
        drawGeometry(geometry: feng3d.Geometrys, cameraRotation?: feng3d.Vector3): this;
        /**
         * 绘制游戏对象
         * @param gameObject 游戏对象
         */
        drawGameObject(gameObject: feng3d.GameObject, cameraRotation?: feng3d.Vector3): this;
        /**
         * 转换为DataURL
         */
        toDataURL(width?: number, height?: number): string;
        updateCameraPosition(): void;
        private currentObject;
        private materialObject;
        private geometryObject;
        private _drawGameObject;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Navigation: editor.Navigation;
    }
}
declare namespace editor {
    /**
     * 导航代理
     */
    class NavigationAgent {
        /**
         * 距离边缘半径
         */
        radius: number;
        /**
         * 允许行走高度
         */
        height: number;
        /**
         * 允许爬上的阶梯高度
         */
        stepHeight: number;
        /**
         * 允许行走坡度
         */
        maxSlope: number;
    }
    /**
     * 导航组件，提供生成导航网格功能
     */
    class Navigation extends feng3d.Component {
        agent: NavigationAgent;
        private _navobject;
        private _recastnavigation;
        private _allowedVoxelsPointGeometry;
        private _rejectivedVoxelsPointGeometry;
        private _debugVoxelsPointGeometry;
        init(gameobject: feng3d.GameObject): void;
        /**
         * 清楚oav网格模型
         */
        clear(): void;
        /**
         * 计算导航网格数据
         */
        bake(): void;
        /**
         * 获取参与导航的几何体列表
         * @param gameobject
         * @param geometrys
         */
        private _getNavGeometrys;
    }
}
declare namespace feng3d {
    class ThreeBSP {
        tree: ThreeBSPNode;
        constructor(geometry?: {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        } | ThreeBSPNode);
        toGeometry(): {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        };
        /**
         * 相减
         * @param other
         */
        subtract(other: ThreeBSP): ThreeBSP;
        /**
         * 相加
         * @param other
         */
        union(other: ThreeBSP): ThreeBSP;
        /**
         * 相交
         * @param other
         */
        intersect(other: ThreeBSP): ThreeBSP;
    }
    /**
     * 顶点
     */
    class ThreeBSPVertex {
        /**
         * 坐标
         */
        position: Vector3;
        /**
         * uv
         */
        uv: Vector2;
        /**
         * 法线
         */
        normal: Vector3;
        constructor(position: Vector3, normal: Vector3, uv: Vector2);
        /**
         * 克隆
         */
        clone(): ThreeBSPVertex;
        /**
         *
         * @param v 线性插值
         * @param alpha
         */
        lerp(v: ThreeBSPVertex, alpha: number): this;
        interpolate(v: ThreeBSPVertex, alpha: number): ThreeBSPVertex;
    }
    /**
     * 多边形
     */
    class ThreeBSPPolygon {
        /**
         * 多边形所在面w值
         */
        w: number;
        /**
         * 法线
         */
        normal: Vector3;
        /**
         * 顶点列表
         */
        vertices: ThreeBSPVertex[];
        constructor(vertices?: ThreeBSPVertex[]);
        /**
         * 获取多边形几何体数据
         * @param data
         */
        getGeometryData(data?: {
            positions: number[];
            uvs: number[];
            normals: number[];
        }): {
            positions: number[];
            uvs: number[];
            normals: number[];
        };
        /**
         * 计算法线与w值
         */
        calculateProperties(): this;
        /**
         * 克隆
         */
        clone(): ThreeBSPPolygon;
        /**
         * 翻转多边形
         */
        invert(): this;
        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex
         */
        classifyVertex(vertex: ThreeBSPVertex): number;
        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon
         */
        classifySide(polygon: ThreeBSPPolygon): number;
        /**
         * 切割多边形
         * @param poly
         */
        tessellate(poly: ThreeBSPPolygon): ThreeBSPPolygon[];
        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        subdivide(polygon: ThreeBSPPolygon, coplanar_front: ThreeBSPPolygon[], coplanar_back: ThreeBSPPolygon[], front: ThreeBSPPolygon[], back: ThreeBSPPolygon[]): void;
    }
    /**
     * 结点
     */
    class ThreeBSPNode {
        /**
         * 多边形列表
         */
        polygons: ThreeBSPPolygon[];
        /**
         * 切割面
         */
        divider: ThreeBSPPolygon;
        front: ThreeBSPNode;
        back: ThreeBSPNode;
        constructor(data?: {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        });
        /**
         * 获取几何体数据
         */
        getGeometryData(): {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        };
        /**
         * 克隆
         */
        clone(): ThreeBSPNode;
        /**
         * 构建树结点
         * @param polygons 多边形列表
         */
        build(polygons: ThreeBSPPolygon[]): this;
        /**
         * 判定是否为凸面体
         * @param polys
         */
        isConvex(polys: ThreeBSPPolygon[]): boolean;
        /**
         * 所有多边形
         */
        allPolygons(): ThreeBSPPolygon[];
        /**
         * 翻转
         */
        invert(): this;
        /**
         * 裁剪多边形
         * @param polygons
         */
        clipPolygons(polygons: ThreeBSPPolygon[]): ThreeBSPPolygon[];
        clipTo(node: ThreeBSPNode): this;
    }
}
declare namespace navigation {
    class NavigationProcess {
        private data;
        constructor(geometry: {
            positions: number[];
            indices: number[];
        });
        checkMaxSlope(maxSlope: number): void;
        checkAgentRadius(agentRadius: number): void;
        checkAgentHeight(agentHeight: number): void;
        getGeometry(): {
            positions: number[];
            indices: number[];
        };
        private debugShowLines1;
        private debugShowLines;
        /**
         * 获取所有独立边
         */
        private getAllSingleLine;
    }
}
declare var segmentGeometry: feng3d.SegmentGeometry;
declare var debugSegment: feng3d.GameObject;
declare var pointGeometry: feng3d.PointGeometry;
declare var debugPoint: feng3d.GameObject;
declare function createSegment(): void;
declare namespace editor {
    /**
     * 重铸导航
     *
     *  将接收的网格模型转换为导航网格数据
     *
     * #### 设计思路
     * 1. 将接收到的网格模型的所有三角形栅格化为体素保存到三维数组内
     * 1. 遍历所有体素计算出可行走体素
     * 1. 构建可行走轮廓
     * 1. 构建可行走（导航）网格
     *
     * #### 参考
     * @see https://github.com/recastnavigation/recastnavigation
     */
    class Recastnavigation {
        /**
         * 包围盒
         */
        private _aabb;
        /**
         * 体素尺寸
         */
        private _voxelSize;
        /**
         * X 轴上 体素数量
         */
        private _numX;
        /**
         * Y 轴上 体素数量
         */
        private _numY;
        /**
         * Z 轴上 体素数量
         */
        private _numZ;
        /**
         * 体素三维数组
         */
        private _voxels;
        /**
         * 导航代理
         */
        private _agent;
        /**
         * 用于体素区分是否同属一个三角形
         */
        private _triangleId;
        /**
         * 执行重铸导航
         */
        doRecastnavigation(mesh: {
            positions: number[];
            indices: number[];
        }, agent?: NavigationAgent, voxelSize?: feng3d.Vector3): void;
        /**
         * 获取体素列表
         */
        getVoxels(): Voxel[];
        /**
         * 栅格化网格
         */
        private _voxelizationMesh;
        /**
         * 栅格化三角形
         * @param p0 三角形第一个顶点
         * @param p1 三角形第二个顶点
         * @param p2 三角形第三个顶点
         */
        private _voxelizationTriangle;
        /**
         * 应用代理进行计算出可行走体素
         */
        private _applyAgent;
        /**
         * 筛选出允许行走坡度的体素
         */
        private _applyAgentMaxSlope;
        private _applyAgentHeight;
        private _applyAgentRadius;
        private _calculateContour;
        private _checkContourVoxel;
        private _isVoxelFlagDefault;
    }
    /**
     * 体素
     */
    interface Voxel {
        x: number;
        y: number;
        z: number;
        normal: feng3d.Vector3;
        triangleId: number;
        flag: VoxelFlag;
    }
    enum VoxelFlag {
        Default = 0,
        DontMaxSlope = 1,
        DontHeight = 2,
        IsContour = 4
    }
}
declare namespace editor {
    /**
     * 编辑器脚本
     */
    class EditorScript extends feng3d.Behaviour {
        flag: feng3d.RunEnvironment;
    }
}
declare namespace editor {
    class MouseRayTestScript extends EditorScript {
        init(gameObject: feng3d.GameObject): void;
        private onclick;
        update(): void;
        /**
         * 销毁
         */
        dispose(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        DirectionLightIcon: editor.DirectionLightIcon;
    }
}
declare namespace editor {
    class DirectionLightIcon extends EditorScript {
        __class__: "editor.DirectionLightIcon";
        light: feng3d.DirectionalLight;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _textureMaterial;
        private onLightChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class PointLightIcon extends EditorScript {
        light: feng3d.PointLight;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _lightpoints;
        private _textureMaterial;
        private _segmentGeometry;
        private _pointGeometry;
        private onLightChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class SpotLightIcon extends EditorScript {
        light: feng3d.SpotLight;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _lightpoints;
        private _textureMaterial;
        private _segmentGeometry;
        private _pointGeometry;
        private onLightChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class CameraIcon extends EditorScript {
        camera: feng3d.Camera;
        editorCamera: feng3d.Camera;
        private _editorCamera;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _lightpoints;
        private _segmentGeometry;
        private _pointGeometry;
        private _lensChanged;
        private onCameraChanged;
        private onLensChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class ThreejsLoader {
        load(url: string, completed?: (gameobject: feng3d.GameObject) => void): void;
    }
    var threejsLoader: ThreejsLoader;
}
declare namespace editor {
    /**
     * 菜单配置
     */
    var menuConfig: MenuConfig;
    /**
     * 菜单配置
     */
    class MenuConfig {
        /**
         * 主菜单
         */
        getMainMenu(): MenuItem[];
        private getWindowSubMenus;
        /**
         * 层级界面创建3D对象列表数据
         */
        getCreateObjectMenu(): MenuItem[];
        /**
         * 获取创建游戏对象组件菜单
         * @param gameobject 游戏对象
         */
        getCreateComponentMenu(gameobject: feng3d.GameObject): MenuItem[];
    }
}
declare namespace editor {
    var viewLayoutConfig: {
        Default: {
            "x": number;
            "y": number;
            "width": number;
            "height": number;
            "percentWidth": any;
            "percentHeight": any;
            "top": number;
            "bottom": number;
            "left": number;
            "right": number;
            "type": string;
            "layout": string;
            "children": ({
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "layout": string;
                "children": ({
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "layout": string;
                    "children": {
                        "x": number;
                        "y": number;
                        "width": number;
                        "height": number;
                        "percentWidth": number;
                        "percentHeight": number;
                        "top": any;
                        "bottom": any;
                        "left": any;
                        "right": any;
                        "type": string;
                        "modules": string[];
                    }[];
                    "modules"?: undefined;
                } | {
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": any;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "modules": string[];
                    "layout"?: undefined;
                    "children"?: undefined;
                })[];
                "modules"?: undefined;
            } | {
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "modules": string[];
                "layout"?: undefined;
                "children"?: undefined;
            })[];
        };
        Tall: {
            "x": number;
            "y": number;
            "width": number;
            "height": number;
            "percentWidth": any;
            "percentHeight": any;
            "top": number;
            "bottom": number;
            "left": number;
            "right": number;
            "type": string;
            "layout": string;
            "children": ({
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "layout": string;
                "children": ({
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "modules": string[];
                    "layout"?: undefined;
                    "children"?: undefined;
                } | {
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "layout": string;
                    "children": {
                        "x": number;
                        "y": number;
                        "width": number;
                        "height": number;
                        "percentWidth": number;
                        "percentHeight": number;
                        "top": any;
                        "bottom": any;
                        "left": any;
                        "right": any;
                        "type": string;
                        "modules": string[];
                    }[];
                    "modules"?: undefined;
                })[];
                "modules"?: undefined;
            } | {
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "modules": string[];
                "layout"?: undefined;
                "children"?: undefined;
            })[];
        };
        Wide: {
            "x": number;
            "y": number;
            "width": number;
            "height": number;
            "percentWidth": any;
            "percentHeight": any;
            "top": number;
            "bottom": number;
            "left": number;
            "right": number;
            "type": string;
            "layout": string;
            "children": ({
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "layout": string;
                "children": ({
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "modules": string[];
                    "layout"?: undefined;
                    "children"?: undefined;
                } | {
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "layout": string;
                    "children": {
                        "x": number;
                        "y": number;
                        "width": number;
                        "height": number;
                        "percentWidth": number;
                        "percentHeight": number;
                        "top": any;
                        "bottom": any;
                        "left": any;
                        "right": any;
                        "type": string;
                        "modules": string[];
                    }[];
                    "modules"?: undefined;
                })[];
                "modules"?: undefined;
            } | {
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "modules": string[];
                "layout"?: undefined;
                "children"?: undefined;
            })[];
        };
        fourSplit: {
            "x": number;
            "y": number;
            "width": number;
            "height": number;
            "percentWidth": any;
            "percentHeight": any;
            "top": number;
            "bottom": number;
            "left": number;
            "right": number;
            "type": string;
            "layout": string;
            "children": ({
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "layout": string;
                "children": ({
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "layout": string;
                    "children": {
                        "x": number;
                        "y": number;
                        "width": number;
                        "height": number;
                        "percentWidth": number;
                        "percentHeight": number;
                        "top": any;
                        "bottom": any;
                        "left": any;
                        "right": any;
                        "type": string;
                        "layout": string;
                        "children": {
                            "x": number;
                            "y": number;
                            "width": number;
                            "height": number;
                            "percentWidth": number;
                            "percentHeight": number;
                            "top": any;
                            "bottom": any;
                            "left": any;
                            "right": any;
                            "type": string;
                            "modules": string[];
                        }[];
                    }[];
                } | {
                    "x": number;
                    "y": number;
                    "width": number;
                    "height": number;
                    "percentWidth": number;
                    "percentHeight": number;
                    "top": any;
                    "bottom": any;
                    "left": any;
                    "right": any;
                    "type": string;
                    "layout": string;
                    "children": {
                        "x": number;
                        "y": number;
                        "width": number;
                        "height": number;
                        "percentWidth": number;
                        "percentHeight": number;
                        "top": any;
                        "bottom": any;
                        "left": any;
                        "right": any;
                        "type": string;
                        "modules": string[];
                    }[];
                })[];
                "modules"?: undefined;
            } | {
                "x": number;
                "y": number;
                "width": number;
                "height": number;
                "percentWidth": number;
                "percentHeight": number;
                "top": any;
                "bottom": any;
                "left": any;
                "right": any;
                "type": string;
                "modules": string[];
                "layout"?: undefined;
                "children"?: undefined;
            })[];
        };
    };
}
declare namespace editor {
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
    stateCommand?: undefined;
} | {
    key: string;
    stateCommand: string;
    when: string;
    command?: undefined;
})[];
declare namespace ts {
    interface SortingResult {
        sortedFileNames: string[];
        circularReferences: string[];
    }
    function reorderSourceFiles(program: Program): SortingResult;
}
declare namespace editor {
    var scriptCompiler: ScriptCompiler;
    class ScriptCompiler {
        private tsconfig;
        constructor();
        private onGettsLibs;
        /**
         * 加载 tslibs
         *
         * @param callback 完成回调
         */
        private loadtslibs;
        private onFileChanged;
        private onScriptCompile;
        private getOptions;
        private compile;
        private transpileModule;
        private createProgram;
    }
}
declare namespace editor {
    var editorData: EditorData;
    /**
     * feng3d的版本号
     */
    var revision: string;
    /**
     * 编辑器
     */
    class Editor extends eui.UILayer {
        constructor();
        private onAddedToStage;
        /**
         * 初始化 Egret
         *
         * @param callback 完成回调
         */
        private initEgret;
        private init;
        private initMainView;
    }
}
//# sourceMappingURL=editor.d.ts.map