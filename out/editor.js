var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../../libs/typescriptServices.d.ts" />
var ts;
(function (ts) {
    if (!ts.getClassExtendsHeritageElement) {
        ts.getClassExtendsHeritageElement = function (node) {
            const heritageClause = ts.getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
            return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
        };
    }
})(ts || (ts = {}));
var feng3d;
(function (feng3d) {
    document.body.oncontextmenu = function () { return false; };
    //给反射添加查找的空间
    feng3d.classUtils.addClassNameSpace("editor");
    feng3d.classUtils.addClassNameSpace("egret");
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * (快捷键)状态列表
     */
    feng3d.shortCutStates = {
        disableScroll: "禁止滚动",
        splitGroupDraging: "正在拖拽分割界面",
        draging: "正在拖拽中"
    };
})(feng3d || (feng3d = {}));
var egret;
(function (egret) {
    egret.MouseEvent = egret.TouchEvent;
    (() => {
        //映射事件名称
        egret.MouseEvent.MOUSE_DOWN = "mousedown";
        egret.MouseEvent.MIDDLE_MOUSE_DOWN = "middlemousedown";
        egret.MouseEvent.MOUSE_UP = "mouseup";
        egret.MouseEvent.MIDDLE_MOUSE_UP = "middlemouseup";
        egret.MouseEvent.RIGHT_MOUSE_UP = "rightmouseup";
        egret.MouseEvent.MOUSE_MOVE = "mousemove";
        egret.MouseEvent.CLICK = "click";
        egret.MouseEvent.MIDDLE_Click = "middleclick";
        egret.MouseEvent.MOUSE_OUT = "mouseout";
        egret.MouseEvent.RIGHT_MOUSE_DOWN = "rightmousedown";
        egret.MouseEvent.RIGHT_CLICK = "rightclick";
        egret.MouseEvent.DOUBLE_CLICK = "dblclick";
        //
    })();
    var overDisplayObject;
    egret.mouseEventEnvironment = () => {
        var webTouchHandler;
        var canvas;
        var touch;
        // 鼠标按下时选中对象
        var mousedownObject;
        // /**
        //  * 鼠标按下的按钮编号
        //  */
        // var mousedownButton: number;
        webTouchHandler = getWebTouchHandler();
        canvas = webTouchHandler.canvas;
        touch = webTouchHandler.touch;
        webTouchHandler.canvas.addEventListener("mousemove", onMouseMove);
        feng3d.windowEventProxy.on("mousedown", (e) => {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            // mousedownButton = e.button;
            mousedownObject = target;
            if (e.button == 0) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_DOWN, true, true, x, y);
            }
            else if (e.button == 1) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_DOWN, true, true, x, y);
            }
            else if (e.button == 2) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_DOWN, true, true, x, y);
            }
        });
        feng3d.windowEventProxy.on("mouseup", (e) => {
            //右键按下
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            if (e.button == 0) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.CLICK, true, true, x, y);
                }
            }
            else if (e.button == 1) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_Click, true, true, x, y);
                }
            }
            else if (e.button == 2) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_CLICK, true, true, x, y);
                }
            }
            mousedownObject = null;
        });
        feng3d.windowEventProxy.on("dblclick", (e) => {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.DOUBLE_CLICK, true, true, x, y);
        });
        // 调试，查看鼠标下的对象
        feng3d.windowEventProxy.on("keyup", (e) => {
            if (e.key == "p") {
                var location = webTouchHandler.getLocation(e);
                var target = touch["findTarget"](location.x, location.y);
                var arr = [target];
                while (target.parent) {
                    target = target.parent;
                    arr.push(target);
                }
                window["earr"] = arr;
                console.log(arr);
            }
        });
        function onMouseMove(event) {
            var location = webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            target.stage.stageX = x;
            target.stage.stageY = y;
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_MOVE, true, true, x, y);
            if (target == overDisplayObject)
                return;
            var preOverDisplayObject = overDisplayObject;
            overDisplayObject = target;
            if (preOverDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, egret.MouseEvent.MOUSE_OUT, true, true, x, y);
            }
            if (overDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(overDisplayObject, egret.MouseEvent.MOUSE_OVER, true, true, x, y);
            }
        }
        function getWebTouchHandler() {
            var list = document.querySelectorAll(".egret-player");
            var length = list.length;
            var player = null;
            for (var i = 0; i < length; i++) {
                var container = list[i];
                player = container["egret-player"];
                if (player)
                    break;
            }
            return player.webTouchHandler;
        }
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    //调整默认字体大小
    egret.TextField.default_size = 12;
    // 扩展焦点在文本中时 禁止出发快捷键
    var oldfocusHandler = egret.InputController.prototype["focusHandler"];
    egret.InputController.prototype["focusHandler"] = function (event) {
        oldfocusHandler.call(this, event);
        feng3d.shortcut.enable = !this._isFocus;
    };
    var oldblurHandler = egret.InputController.prototype["blurHandler"];
    egret.InputController.prototype["blurHandler"] = function (event) {
        oldblurHandler.call(this, event);
        feng3d.shortcut.enable = !this._isFocus;
    };
    //     // 扩展 TextInput , 焦点在文本中时，延缓外部通过text属性赋值到失去焦点时生效
    //     var descriptor = Object.getOwnPropertyDescriptor(eui.TextInput.prototype, "text");
    //     var oldTextSet = descriptor.set;
    //     descriptor.set = function (value)
    //     {
    //         if (this["isFocus"])
    //         {
    //             this["__temp_value__"] = value;
    //         }
    //         else
    //         {
    //             oldTextSet.call(this, value);
    //         }
    //     }
    //     Object.defineProperty(eui.TextInput.prototype, "text", descriptor);
    //     var oldFocusOutHandler = eui.TextInput.prototype["focusOutHandler"];
    //     eui.TextInput.prototype["focusOutHandler"] = function (event)
    //     {
    //         oldFocusOutHandler.call(this, event);
    //         if (this["__temp_value__"] != undefined)
    //         {
    //             this["text"] = this["__temp_value__"];
    //             delete this["__temp_value__"];
    //         }
    //     }
})(egret || (egret = {}));
var egret;
(function (egret) {
    // 注 使用 DisplayObject.prototype.getTransformedBounds 计算全局测量边界存在bug，因此扩展 getGlobalBounds 用于代替使用
    egret.DisplayObject.prototype["getGlobalBounds"] = function (resultRect) {
        var min = this.localToGlobal(0, 0);
        var max = this.localToGlobal(this.width, this.height);
        resultRect = resultRect || new feng3d.Rectangle();
        resultRect.x = min.x;
        resultRect.y = min.y;
        resultRect.width = max.x - min.x;
        resultRect.height = max.y - min.y;
        return resultRect;
    };
    egret.DisplayObject.prototype.remove = function () {
        this.parent && this.parent.removeChild(this);
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    // 扩展 Scroller 组件，添加鼠标滚轮事件
    var oldOnAddToStage = eui.Scroller.prototype.$onAddToStage;
    eui.Scroller.prototype.$onAddToStage = function (stage, nestLevel) {
        oldOnAddToStage.call(this, stage, nestLevel);
        feng3d.windowEventProxy.on("wheel", onMouseWheel, this);
    };
    var oldOnRemoveFromStage = eui.Scroller.prototype.$onRemoveFromStage;
    eui.Scroller.prototype.$onRemoveFromStage = function () {
        oldOnRemoveFromStage.call(this);
        feng3d.windowEventProxy.off("wheel", onMouseWheel, this);
    };
    // 阻止拖拽滚动界面
    var oldonTouchMove = eui.Scroller.prototype["onTouchMove"];
    eui.Scroller.prototype["onTouchMove"] = function (event) {
        if (feng3d.shortcut.getState("disableScroll"))
            return;
        oldonTouchMove.call(this, event);
    };
    function onMouseWheel(event) {
        var scroller = this;
        if (scroller.hitTestPoint(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
            scroller.viewport.scrollV = Math.clamp(scroller.viewport.scrollV + event.deltaY * 0.3, 0, Math.max(0, scroller.viewport.contentHeight - scroller.height));
        }
    }
})(egret || (egret = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var json;
(function (json) {
    let ParseOptions;
    (function (ParseOptions) {
        ParseOptions.DEFAULT = {
            allowTrailingComma: true
        };
    })(ParseOptions = json.ParseOptions || (json.ParseOptions = {}));
    /**
     * Creates a JSON scanner on the given text.
     * If ignoreTrivia is set, whitespaces or comments are ignored.
     */
    function createScanner(text, ignoreTrivia = false) {
        let pos = 0, len = text.length, value = '', tokenOffset = 0, token = 16 /* Unknown */, scanError = 0 /* None */;
        function scanHexDigits(count) {
            let digits = 0;
            let value = 0;
            while (digits < count) {
                const ch = text.charCodeAt(pos);
                if (ch >= 48 /* _0 */ && ch <= 57 /* _9 */) {
                    value = value * 16 + ch - 48 /* _0 */;
                }
                else if (ch >= 65 /* A */ && ch <= 70 /* F */) {
                    value = value * 16 + ch - 65 /* A */ + 10;
                }
                else if (ch >= 97 /* a */ && ch <= 102 /* f */) {
                    value = value * 16 + ch - 97 /* a */ + 10;
                }
                else {
                    break;
                }
                pos++;
                digits++;
            }
            if (digits < count) {
                value = -1;
            }
            return value;
        }
        function setPosition(newPosition) {
            pos = newPosition;
            value = '';
            tokenOffset = 0;
            token = 16 /* Unknown */;
            scanError = 0 /* None */;
        }
        function scanNumber() {
            const start = pos;
            if (text.charCodeAt(pos) === 48 /* _0 */) {
                pos++;
            }
            else {
                pos++;
                while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                }
            }
            if (pos < text.length && text.charCodeAt(pos) === 46 /* dot */) {
                pos++;
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                }
                else {
                    scanError = 3 /* UnexpectedEndOfNumber */;
                    return text.substring(start, pos);
                }
            }
            let end = pos;
            if (pos < text.length && (text.charCodeAt(pos) === 69 /* E */ || text.charCodeAt(pos) === 101 /* e */)) {
                pos++;
                if (pos < text.length && text.charCodeAt(pos) === 43 /* plus */ || text.charCodeAt(pos) === 45 /* minus */) {
                    pos++;
                }
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                    end = pos;
                }
                else {
                    scanError = 3 /* UnexpectedEndOfNumber */;
                }
            }
            return text.substring(start, end);
        }
        function scanString() {
            let result = '', start = pos;
            while (true) {
                if (pos >= len) {
                    result += text.substring(start, pos);
                    scanError = 2 /* UnexpectedEndOfString */;
                    break;
                }
                let ch = text.charCodeAt(pos);
                if (ch === 34 /* doubleQuote */) {
                    result += text.substring(start, pos);
                    pos++;
                    break;
                }
                if (ch === 92 /* backslash */) {
                    result += text.substring(start, pos);
                    pos++;
                    if (pos >= len) {
                        scanError = 2 /* UnexpectedEndOfString */;
                        break;
                    }
                    ch = text.charCodeAt(pos++);
                    switch (ch) {
                        case 34 /* doubleQuote */:
                            result += '\"';
                            break;
                        case 92 /* backslash */:
                            result += '\\';
                            break;
                        case 47 /* slash */:
                            result += '/';
                            break;
                        case 98 /* b */:
                            result += '\b';
                            break;
                        case 102 /* f */:
                            result += '\f';
                            break;
                        case 110 /* n */:
                            result += '\n';
                            break;
                        case 114 /* r */:
                            result += '\r';
                            break;
                        case 116 /* t */:
                            result += '\t';
                            break;
                        case 117 /* u */:
                            const ch = scanHexDigits(4);
                            if (ch >= 0) {
                                result += String.fromCharCode(ch);
                            }
                            else {
                                scanError = 4 /* InvalidUnicode */;
                            }
                            break;
                        default:
                            scanError = 5 /* InvalidEscapeCharacter */;
                    }
                    start = pos;
                    continue;
                }
                if (ch >= 0 && ch <= 0x1F) {
                    if (isLineBreak(ch)) {
                        result += text.substring(start, pos);
                        scanError = 2 /* UnexpectedEndOfString */;
                        break;
                    }
                    else {
                        scanError = 6 /* InvalidCharacter */;
                        // mark as error but continue with string
                    }
                }
                pos++;
            }
            return result;
        }
        function scanNext() {
            value = '';
            scanError = 0 /* None */;
            tokenOffset = pos;
            if (pos >= len) {
                // at the end
                tokenOffset = len;
                return token = 17 /* EOF */;
            }
            let code = text.charCodeAt(pos);
            // trivia: whitespace
            if (isWhiteSpace(code)) {
                do {
                    pos++;
                    value += String.fromCharCode(code);
                    code = text.charCodeAt(pos);
                } while (isWhiteSpace(code));
                return token = 15 /* Trivia */;
            }
            // trivia: newlines
            if (isLineBreak(code)) {
                pos++;
                value += String.fromCharCode(code);
                if (code === 13 /* carriageReturn */ && text.charCodeAt(pos) === 10 /* lineFeed */) {
                    pos++;
                    value += '\n';
                }
                return token = 14 /* LineBreakTrivia */;
            }
            switch (code) {
                // tokens: []{}:,
                case 123 /* openBrace */:
                    pos++;
                    return token = 1 /* OpenBraceToken */;
                case 125 /* closeBrace */:
                    pos++;
                    return token = 2 /* CloseBraceToken */;
                case 91 /* openBracket */:
                    pos++;
                    return token = 3 /* OpenBracketToken */;
                case 93 /* closeBracket */:
                    pos++;
                    return token = 4 /* CloseBracketToken */;
                case 58 /* colon */:
                    pos++;
                    return token = 6 /* ColonToken */;
                case 44 /* comma */:
                    pos++;
                    return token = 5 /* CommaToken */;
                // strings
                case 34 /* doubleQuote */:
                    pos++;
                    value = scanString();
                    return token = 10 /* StringLiteral */;
                // comments
                case 47 /* slash */:
                    const start = pos - 1;
                    // Single-line comment
                    if (text.charCodeAt(pos + 1) === 47 /* slash */) {
                        pos += 2;
                        while (pos < len) {
                            if (isLineBreak(text.charCodeAt(pos))) {
                                break;
                            }
                            pos++;
                        }
                        value = text.substring(start, pos);
                        return token = 12 /* LineCommentTrivia */;
                    }
                    // Multi-line comment
                    if (text.charCodeAt(pos + 1) === 42 /* asterisk */) {
                        pos += 2;
                        const safeLength = len - 1; // For lookahead.
                        let commentClosed = false;
                        while (pos < safeLength) {
                            const ch = text.charCodeAt(pos);
                            if (ch === 42 /* asterisk */ && text.charCodeAt(pos + 1) === 47 /* slash */) {
                                pos += 2;
                                commentClosed = true;
                                break;
                            }
                            pos++;
                        }
                        if (!commentClosed) {
                            pos++;
                            scanError = 1 /* UnexpectedEndOfComment */;
                        }
                        value = text.substring(start, pos);
                        return token = 13 /* BlockCommentTrivia */;
                    }
                    // just a single slash
                    value += String.fromCharCode(code);
                    pos++;
                    return token = 16 /* Unknown */;
                // numbers
                case 45 /* minus */:
                    value += String.fromCharCode(code);
                    pos++;
                    if (pos === len || !isDigit(text.charCodeAt(pos))) {
                        return token = 16 /* Unknown */;
                    }
                // found a minus, followed by a number so
                // we fall through to proceed with scanning
                // numbers
                case 48 /* _0 */:
                case 49 /* _1 */:
                case 50 /* _2 */:
                case 51 /* _3 */:
                case 52 /* _4 */:
                case 53 /* _5 */:
                case 54 /* _6 */:
                case 55 /* _7 */:
                case 56 /* _8 */:
                case 57 /* _9 */:
                    value += scanNumber();
                    return token = 11 /* NumericLiteral */;
                // literals and unknown symbols
                default:
                    // is a literal? Read the full word.
                    while (pos < len && isUnknownContentCharacter(code)) {
                        pos++;
                        code = text.charCodeAt(pos);
                    }
                    if (tokenOffset !== pos) {
                        value = text.substring(tokenOffset, pos);
                        // keywords: true, false, null
                        switch (value) {
                            case 'true': return token = 8 /* TrueKeyword */;
                            case 'false': return token = 9 /* FalseKeyword */;
                            case 'null': return token = 7 /* NullKeyword */;
                        }
                        return token = 16 /* Unknown */;
                    }
                    // some
                    value += String.fromCharCode(code);
                    pos++;
                    return token = 16 /* Unknown */;
            }
        }
        function isUnknownContentCharacter(code) {
            if (isWhiteSpace(code) || isLineBreak(code)) {
                return false;
            }
            switch (code) {
                case 125 /* closeBrace */:
                case 93 /* closeBracket */:
                case 123 /* openBrace */:
                case 91 /* openBracket */:
                case 34 /* doubleQuote */:
                case 58 /* colon */:
                case 44 /* comma */:
                case 47 /* slash */:
                    return false;
            }
            return true;
        }
        function scanNextNonTrivia() {
            let result;
            do {
                result = scanNext();
            } while (result >= 12 /* LineCommentTrivia */ && result <= 15 /* Trivia */);
            return result;
        }
        return {
            setPosition: setPosition,
            getPosition: () => pos,
            scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
            getToken: () => token,
            getTokenValue: () => value,
            getTokenOffset: () => tokenOffset,
            getTokenLength: () => pos - tokenOffset,
            getTokenError: () => scanError
        };
    }
    json.createScanner = createScanner;
    function isWhiteSpace(ch) {
        return ch === 32 /* space */ || ch === 9 /* tab */ || ch === 11 /* verticalTab */ || ch === 12 /* formFeed */ ||
            ch === 160 /* nonBreakingSpace */ || ch === 5760 /* ogham */ || ch >= 8192 /* enQuad */ && ch <= 8203 /* zeroWidthSpace */ ||
            ch === 8239 /* narrowNoBreakSpace */ || ch === 8287 /* mathematicalSpace */ || ch === 12288 /* ideographicSpace */ || ch === 65279 /* byteOrderMark */;
    }
    function isLineBreak(ch) {
        return ch === 10 /* lineFeed */ || ch === 13 /* carriageReturn */ || ch === 8232 /* lineSeparator */ || ch === 8233 /* paragraphSeparator */;
    }
    function isDigit(ch) {
        return ch >= 48 /* _0 */ && ch <= 57 /* _9 */;
    }
    /**
     * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
     */
    function getLocation(text, position) {
        const segments = []; // strings or numbers
        const earlyReturnException = new Object();
        let previousNode = undefined;
        const previousNodeInst = {
            value: {},
            offset: 0,
            length: 0,
            type: 'object',
            parent: undefined
        };
        let isAtPropertyKey = false;
        function setPreviousNode(value, offset, length, type) {
            previousNodeInst.value = value;
            previousNodeInst.offset = offset;
            previousNodeInst.length = length;
            previousNodeInst.type = type;
            previousNodeInst.colonOffset = undefined;
            previousNode = previousNodeInst;
        }
        try {
            visit(text, {
                onObjectBegin: (offset, length) => {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = undefined;
                    isAtPropertyKey = position > offset;
                    segments.push(''); // push a placeholder (will be replaced)
                },
                onObjectProperty: (name, offset, length) => {
                    if (position < offset) {
                        throw earlyReturnException;
                    }
                    setPreviousNode(name, offset, length, 'property');
                    segments[segments.length - 1] = name;
                    if (position <= offset + length) {
                        throw earlyReturnException;
                    }
                },
                onObjectEnd: (offset, length) => {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = undefined;
                    segments.pop();
                },
                onArrayBegin: (offset, length) => {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = undefined;
                    segments.push(0);
                },
                onArrayEnd: (offset, length) => {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    previousNode = undefined;
                    segments.pop();
                },
                onLiteralValue: (value, offset, length) => {
                    if (position < offset) {
                        throw earlyReturnException;
                    }
                    setPreviousNode(value, offset, length, getLiteralNodeType(value));
                    if (position <= offset + length) {
                        throw earlyReturnException;
                    }
                },
                onSeparator: (sep, offset, length) => {
                    if (position <= offset) {
                        throw earlyReturnException;
                    }
                    if (sep === ':' && previousNode && previousNode.type === 'property') {
                        previousNode.colonOffset = offset;
                        isAtPropertyKey = false;
                        previousNode = undefined;
                    }
                    else if (sep === ',') {
                        const last = segments[segments.length - 1];
                        if (typeof last === 'number') {
                            segments[segments.length - 1] = last + 1;
                        }
                        else {
                            isAtPropertyKey = true;
                            segments[segments.length - 1] = '';
                        }
                        previousNode = undefined;
                    }
                }
            });
        }
        catch (e) {
            if (e !== earlyReturnException) {
                throw e;
            }
        }
        return {
            path: segments,
            previousNode,
            isAtPropertyKey,
            matches: (pattern) => {
                let k = 0;
                for (let i = 0; k < pattern.length && i < segments.length; i++) {
                    if (pattern[k] === segments[i] || pattern[k] === '*') {
                        k++;
                    }
                    else if (pattern[k] !== '**') {
                        return false;
                    }
                }
                return k === pattern.length;
            }
        };
    }
    json.getLocation = getLocation;
    /**
     * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
     * Therefore always check the errors list to find out if the input was valid.
     */
    function parse(text, errors = [], options = ParseOptions.DEFAULT) {
        let currentProperty = null;
        let currentParent = [];
        const previousParents = [];
        function onValue(value) {
            if (Array.isArray(currentParent)) {
                currentParent.push(value);
            }
            else if (currentProperty) {
                currentParent[currentProperty] = value;
            }
        }
        const visitor = {
            onObjectBegin: () => {
                const object = {};
                onValue(object);
                previousParents.push(currentParent);
                currentParent = object;
                currentProperty = null;
            },
            onObjectProperty: (name) => {
                currentProperty = name;
            },
            onObjectEnd: () => {
                currentParent = previousParents.pop();
            },
            onArrayBegin: () => {
                const array = [];
                onValue(array);
                previousParents.push(currentParent);
                currentParent = array;
                currentProperty = null;
            },
            onArrayEnd: () => {
                currentParent = previousParents.pop();
            },
            onLiteralValue: onValue,
            onError: (error, offset, length) => {
                errors.push({ error, offset, length });
            }
        };
        visit(text, visitor, options);
        return currentParent[0];
    }
    json.parse = parse;
    /**
     * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
     */
    function parseTree(text, errors = [], options = ParseOptions.DEFAULT) {
        let currentParent = { type: 'array', offset: -1, length: -1, children: [], parent: undefined }; // artificial root
        function ensurePropertyComplete(endOffset) {
            if (currentParent.type === 'property') {
                currentParent.length = endOffset - currentParent.offset;
                currentParent = currentParent.parent;
            }
        }
        function onValue(valueNode) {
            currentParent.children.push(valueNode);
            return valueNode;
        }
        const visitor = {
            onObjectBegin: (offset) => {
                currentParent = onValue({ type: 'object', offset, length: -1, parent: currentParent, children: [] });
            },
            onObjectProperty: (name, offset, length) => {
                currentParent = onValue({ type: 'property', offset, length: -1, parent: currentParent, children: [] });
                currentParent.children.push({ type: 'string', value: name, offset, length, parent: currentParent });
            },
            onObjectEnd: (offset, length) => {
                currentParent.length = offset + length - currentParent.offset;
                currentParent = currentParent.parent;
                ensurePropertyComplete(offset + length);
            },
            onArrayBegin: (offset, length) => {
                currentParent = onValue({ type: 'array', offset, length: -1, parent: currentParent, children: [] });
            },
            onArrayEnd: (offset, length) => {
                currentParent.length = offset + length - currentParent.offset;
                currentParent = currentParent.parent;
                ensurePropertyComplete(offset + length);
            },
            onLiteralValue: (value, offset, length) => {
                onValue({ type: getLiteralNodeType(value), offset, length, parent: currentParent, value });
                ensurePropertyComplete(offset + length);
            },
            onSeparator: (sep, offset, length) => {
                if (currentParent.type === 'property') {
                    if (sep === ':') {
                        currentParent.colonOffset = offset;
                    }
                    else if (sep === ',') {
                        ensurePropertyComplete(offset);
                    }
                }
            },
            onError: (error, offset, length) => {
                errors.push({ error, offset, length });
            }
        };
        visit(text, visitor, options);
        const result = currentParent.children[0];
        if (result) {
            delete result.parent;
        }
        return result;
    }
    json.parseTree = parseTree;
    /**
     * Finds the node at the given path in a JSON DOM.
     */
    function findNodeAtLocation(root, path) {
        if (!root) {
            return undefined;
        }
        let node = root;
        for (let segment of path) {
            if (typeof segment === 'string') {
                if (node.type !== 'object' || !Array.isArray(node.children)) {
                    return undefined;
                }
                let found = false;
                for (const propertyNode of node.children) {
                    if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment) {
                        node = propertyNode.children[1];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return undefined;
                }
            }
            else {
                const index = segment;
                if (node.type !== 'array' || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
                    return undefined;
                }
                node = node.children[index];
            }
        }
        return node;
    }
    json.findNodeAtLocation = findNodeAtLocation;
    /**
     * Gets the JSON path of the given JSON DOM node
     */
    function getNodePath(node) {
        if (!node.parent || !node.parent.children) {
            return [];
        }
        const path = getNodePath(node.parent);
        if (node.parent.type === 'property') {
            const key = node.parent.children[0].value;
            path.push(key);
        }
        else if (node.parent.type === 'array') {
            const index = node.parent.children.indexOf(node);
            if (index !== -1) {
                path.push(index);
            }
        }
        return path;
    }
    json.getNodePath = getNodePath;
    /**
     * Evaluates the JavaScript object of the given JSON DOM node
     */
    function getNodeValue(node) {
        switch (node.type) {
            case 'array':
                return node.children.map(getNodeValue);
            case 'object':
                const obj = Object.create(null);
                for (let prop of node.children) {
                    const valueNode = prop.children[1];
                    if (valueNode) {
                        obj[prop.children[0].value] = getNodeValue(valueNode);
                    }
                }
                return obj;
            case 'null':
            case 'string':
            case 'number':
            case 'boolean':
                return node.value;
            default:
                return undefined;
        }
    }
    json.getNodeValue = getNodeValue;
    function contains(node, offset, includeRightBound = false) {
        return (offset >= node.offset && offset < (node.offset + node.length)) || includeRightBound && (offset === (node.offset + node.length));
    }
    json.contains = contains;
    /**
     * Finds the most inner node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.
     */
    function findNodeAtOffset(node, offset, includeRightBound = false) {
        if (contains(node, offset, includeRightBound)) {
            const children = node.children;
            if (Array.isArray(children)) {
                for (let i = 0; i < children.length && children[i].offset <= offset; i++) {
                    const item = findNodeAtOffset(children[i], offset, includeRightBound);
                    if (item) {
                        return item;
                    }
                }
            }
            return node;
        }
        return undefined;
    }
    json.findNodeAtOffset = findNodeAtOffset;
    /**
     * Parses the given text and invokes the visitor functions for each object, array and literal reached.
     */
    function visit(text, visitor, options = ParseOptions.DEFAULT) {
        const _scanner = createScanner(text, false);
        function toNoArgVisit(visitFunction) {
            return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength()) : () => true;
        }
        function toOneArgVisit(visitFunction) {
            return visitFunction ? (arg) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength()) : () => true;
        }
        const onObjectBegin = toNoArgVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisit(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisit(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisit(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
        const disallowComments = options && options.disallowComments;
        const allowTrailingComma = options && options.allowTrailingComma;
        function scanNext() {
            while (true) {
                const token = _scanner.scan();
                switch (_scanner.getTokenError()) {
                    case 4 /* InvalidUnicode */:
                        handleError(14 /* InvalidUnicode */);
                        break;
                    case 5 /* InvalidEscapeCharacter */:
                        handleError(15 /* InvalidEscapeCharacter */);
                        break;
                    case 3 /* UnexpectedEndOfNumber */:
                        handleError(13 /* UnexpectedEndOfNumber */);
                        break;
                    case 1 /* UnexpectedEndOfComment */:
                        if (!disallowComments) {
                            handleError(11 /* UnexpectedEndOfComment */);
                        }
                        break;
                    case 2 /* UnexpectedEndOfString */:
                        handleError(12 /* UnexpectedEndOfString */);
                        break;
                    case 6 /* InvalidCharacter */:
                        handleError(16 /* InvalidCharacter */);
                        break;
                }
                switch (token) {
                    case 12 /* LineCommentTrivia */:
                    case 13 /* BlockCommentTrivia */:
                        if (disallowComments) {
                            handleError(10 /* InvalidCommentToken */);
                        }
                        else {
                            onComment();
                        }
                        break;
                    case 16 /* Unknown */:
                        handleError(1 /* InvalidSymbol */);
                        break;
                    case 15 /* Trivia */:
                    case 14 /* LineBreakTrivia */:
                        break;
                    default:
                        return token;
                }
            }
        }
        function handleError(error, skipUntilAfter = [], skipUntil = []) {
            onError(error);
            if (skipUntilAfter.length + skipUntil.length > 0) {
                let token = _scanner.getToken();
                while (token !== 17 /* EOF */) {
                    if (skipUntilAfter.indexOf(token) !== -1) {
                        scanNext();
                        break;
                    }
                    else if (skipUntil.indexOf(token) !== -1) {
                        break;
                    }
                    token = scanNext();
                }
            }
        }
        function parseString(isValue) {
            const value = _scanner.getTokenValue();
            if (isValue) {
                onLiteralValue(value);
            }
            else {
                onObjectProperty(value);
            }
            scanNext();
            return true;
        }
        function parseLiteral() {
            switch (_scanner.getToken()) {
                case 11 /* NumericLiteral */:
                    let value = 0;
                    try {
                        value = JSON.parse(_scanner.getTokenValue());
                        if (typeof value !== 'number') {
                            handleError(2 /* InvalidNumberFormat */);
                            value = 0;
                        }
                    }
                    catch (e) {
                        handleError(2 /* InvalidNumberFormat */);
                    }
                    onLiteralValue(value);
                    break;
                case 7 /* NullKeyword */:
                    onLiteralValue(null);
                    break;
                case 8 /* TrueKeyword */:
                    onLiteralValue(true);
                    break;
                case 9 /* FalseKeyword */:
                    onLiteralValue(false);
                    break;
                default:
                    return false;
            }
            scanNext();
            return true;
        }
        function parseProperty() {
            if (_scanner.getToken() !== 10 /* StringLiteral */) {
                handleError(3 /* PropertyNameExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
                return false;
            }
            parseString(false);
            if (_scanner.getToken() === 6 /* ColonToken */) {
                onSeparator(':');
                scanNext(); // consume colon
                if (!parseValue()) {
                    handleError(4 /* ValueExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
                }
            }
            else {
                handleError(5 /* ColonExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
            }
            return true;
        }
        function parseObject() {
            onObjectBegin();
            scanNext(); // consume open brace
            let needsComma = false;
            while (_scanner.getToken() !== 2 /* CloseBraceToken */ && _scanner.getToken() !== 17 /* EOF */) {
                if (_scanner.getToken() === 5 /* CommaToken */) {
                    if (!needsComma) {
                        handleError(4 /* ValueExpected */, [], []);
                    }
                    onSeparator(',');
                    scanNext(); // consume comma
                    if (_scanner.getToken() === 2 /* CloseBraceToken */ && allowTrailingComma) {
                        break;
                    }
                }
                else if (needsComma) {
                    handleError(6 /* CommaExpected */, [], []);
                }
                if (!parseProperty()) {
                    handleError(4 /* ValueExpected */, [], [2 /* CloseBraceToken */, 5 /* CommaToken */]);
                }
                needsComma = true;
            }
            onObjectEnd();
            if (_scanner.getToken() !== 2 /* CloseBraceToken */) {
                handleError(7 /* CloseBraceExpected */, [2 /* CloseBraceToken */], []);
            }
            else {
                scanNext(); // consume close brace
            }
            return true;
        }
        function parseArray() {
            onArrayBegin();
            scanNext(); // consume open bracket
            let needsComma = false;
            while (_scanner.getToken() !== 4 /* CloseBracketToken */ && _scanner.getToken() !== 17 /* EOF */) {
                if (_scanner.getToken() === 5 /* CommaToken */) {
                    if (!needsComma) {
                        handleError(4 /* ValueExpected */, [], []);
                    }
                    onSeparator(',');
                    scanNext(); // consume comma
                    if (_scanner.getToken() === 4 /* CloseBracketToken */ && allowTrailingComma) {
                        break;
                    }
                }
                else if (needsComma) {
                    handleError(6 /* CommaExpected */, [], []);
                }
                if (!parseValue()) {
                    handleError(4 /* ValueExpected */, [], [4 /* CloseBracketToken */, 5 /* CommaToken */]);
                }
                needsComma = true;
            }
            onArrayEnd();
            if (_scanner.getToken() !== 4 /* CloseBracketToken */) {
                handleError(8 /* CloseBracketExpected */, [4 /* CloseBracketToken */], []);
            }
            else {
                scanNext(); // consume close bracket
            }
            return true;
        }
        function parseValue() {
            switch (_scanner.getToken()) {
                case 3 /* OpenBracketToken */:
                    return parseArray();
                case 1 /* OpenBraceToken */:
                    return parseObject();
                case 10 /* StringLiteral */:
                    return parseString(true);
                default:
                    return parseLiteral();
            }
        }
        scanNext();
        if (_scanner.getToken() === 17 /* EOF */) {
            return true;
        }
        if (!parseValue()) {
            handleError(4 /* ValueExpected */, [], []);
            return false;
        }
        if (_scanner.getToken() !== 17 /* EOF */) {
            handleError(9 /* EndOfFileExpected */, [], []);
        }
        return true;
    }
    json.visit = visit;
    /**
     * Takes JSON with JavaScript-style comments and remove
     * them. Optionally replaces every none-newline character
     * of comments with a replaceCharacter
     */
    function stripComments(text, replaceCh) {
        let _scanner = createScanner(text), parts = [], kind, offset = 0, pos;
        do {
            pos = _scanner.getPosition();
            kind = _scanner.scan();
            switch (kind) {
                case 12 /* LineCommentTrivia */:
                case 13 /* BlockCommentTrivia */:
                case 17 /* EOF */:
                    if (offset !== pos) {
                        parts.push(text.substring(offset, pos));
                    }
                    if (replaceCh !== undefined) {
                        parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
                    }
                    offset = _scanner.getPosition();
                    break;
            }
        } while (kind !== 17 /* EOF */);
        return parts.join('');
    }
    json.stripComments = stripComments;
    function getLiteralNodeType(value) {
        switch (typeof value) {
            case 'boolean': return 'boolean';
            case 'number': return 'number';
            case 'string': return 'string';
            default: return 'null';
        }
    }
})(json || (json = {}));
var editor;
(function (editor) {
    /**
     * gitee API Https
     */
    var giteeAPIHttps = {
        authorize: "https://gitee.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code",
        token: "https://gitee.com/oauth/token?grant_type=authorization_code&code={code}&client_id={client_id}&redirect_uri={redirect_uri}&client_secret={client_secret}",
    };
    var apps = [{
            client_id: "0e3da311c2d436a79839b7f1dcb88ae497e8922c477e31646067f915b47605dc",
            client_secret: "a5b4140fdc117780dd7cbe4360d1630adbbb5c87653ce03cf601f31905697f0a",
            redirect_uri: "http://feng3d.com/editor/index.html",
        },
        {
            client_id: "6480af098768d099a0922b938e500801e7f06b7632f4c97606c296cf9125237b",
            client_secret: "d55fc4fa66bde168ba91279cef814d3d059d5b4f6929ef3bc4f44ccc4f28fb4e",
            redirect_uri: "http://127.0.0.1:8080",
        }];
    /**
     * 当前 APP
     */
    var currentAPP;
    /**
     * 获取url路径
     *
     * @param template url模板
     * @param param 参数
     */
    function getHttpUrl(template, param) {
        for (const key in param) {
            if (param.hasOwnProperty(key)) {
                template = template.replace(`{${key}}`, param[key]);
            }
        }
        return template;
    }
    /**
     * gitee 认证授权
     */
    class GiteeOauth {
        /**
         * 认证授权
         *
         * @param callback 完成回调
         */
        oauth(callback) {
            var app = apps.filter(v => document.URL.indexOf(v.redirect_uri) == 0)[0];
            if (app) {
                if (document.URL.indexOf("code=") != -1) {
                    app.code = document.URL.substring(document.URL.indexOf("code=") + "code=".length);
                    currentAPP = app;
                    alert(`已认证授权`);
                    this.getAccessToken();
                    // this.getUser();
                    return;
                }
                else {
                    var url = getHttpUrl(giteeAPIHttps.authorize, app);
                    document.location = url;
                }
            }
            else {
                alert(`gitee认证只支持 ${apps.map(v => v.redirect_uri).toString()}`);
            }
        }
        getAccessToken() {
            var urls = getHttpUrl(giteeAPIHttps.token, currentAPP).split("?");
            var url = urls[0];
            var body = urls[1];
            var xhr = new XMLHttpRequest();
            //Send the proper header information along with the request
            // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = (ev) => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    // Request finished. Do processing here.
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.send(body);
        }
        getUser() {
            var request = new XMLHttpRequest();
            request.onreadystatechange = (ev) => {
                var result = ev.type;
                if (request.readyState == 4) { // 4 = "loaded"
                    request.onreadystatechange = null;
                    // handle retries in case of load failure
                    if (request.status < 200 || request.status > 300) {
                        // // increment counter
                        // numTries = ~~numTries + 1;
                        // // exit function and try again
                        // args.numRetries = args.numRetries || 0;
                        // if (numTries < ~~args.numRetries + 1)
                        // {
                        //     return loadTxt(path, callbackFn, args, numTries);
                        // }
                    }
                    // execute callback
                    // callbackFn(path, result, ev.defaultPrevented, request.responseText);
                }
            };
            request.open('Get', `https://gitee.com/api/v5/user?access_token=${currentAPP.access_token}`, true);
            request.send();
        }
    }
    editor.GiteeOauth = GiteeOauth;
    editor.giteeOauth = new GiteeOauth();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 是否支持本地API
     */
    editor.supportNative = !(typeof __dirname == "undefined");
    if (editor.supportNative) {
        editor.nativeFS = require(__dirname + "/native/NativeFSBase.js").nativeFS;
        editor.nativeAPI = require(__dirname + "/native/electron_renderer.js");
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
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
        constructor(path, onComplete, thisPtr, onError, isGetFileInfo) {
            this.updateStats(path, null, onComplete, onError);
        }
        /**
         * 判断文件名是否合法
         * @param fileName 文件名
         */
        static isLegalName(fileName) {
            return true;
        }
        /**
         * 文件/文件夹是否存在 基本探索过后才可知道是否存在
         */
        get exists() {
            return this._exists;
        }
        /**
         * 文件尺寸
         */
        get size() {
            return this._size;
        }
        /**
         * 是否是文件夹
         */
        get isDirectory() {
            return this._isDirectory;
        }
        /**
         * 创建日期
         */
        get createDate() {
            return this._createDate;
        }
        /**
         * 上次修改日期
         */
        get lastModifyDate() {
            return this._lastModifyDate;
        }
        /**
         * 路径
         * -- WEB端是相对路径
         * -- 其他端支持绝对路径 file:///xxx/yyy
         */
        get path() {
            return this._path;
        }
        /**
         * 文件或文件夹名 xxx.ks
         */
        get fileName() {
            var fileName = this.path.split("/").pop();
            return fileName;
        }
        /**
         * 不包含格式的文件名称 如 xxx.ks就是xxx
         */
        get fileNameWithoutExt() {
            var fileName = this.fileName;
            var fileNameWithoutExt = (fileName.indexOf(".") == -1) ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
            return fileNameWithoutExt;
        }
        /**
         * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
         */
        get location() {
            var paths = this.path.split("/");
            paths.pop();
            var location = paths.join("/");
            return location;
        }
        /**
         * 绝对路径
         * -- WEB端的是 http://xxxx
         * -- 其他端的是 file:///xxxx
         */
        get fullPath() {
            return this._path;
        }
        /**
         * 格式
         */
        get extension() {
            var fileName = this.fileName;
            if (fileName.indexOf(".") == -1)
                return "";
            var extension = fileName.split(".").pop();
            return extension;
        }
        /**
         * 获取该文件下的目录
         * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
         * @param onError 失败时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        getDirectoryListing(onComplete, onError, thisPtr) {
            editor.editorRS.fs.readdir(this._path, (err, files) => {
                if (err) {
                    console.warn(err);
                    onError(this);
                }
                else {
                    onComplete(this, files);
                }
            });
        }
        /**
         * 创建文件夹
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createDirectory(onComplete, onError, thisPtr) {
            editor.editorRS.fs.mkdir(this._path, (err) => {
                if (err) {
                    console.warn(this);
                    onError(this);
                    return;
                }
                this.updateStats(this._path, () => {
                    onComplete(this);
                });
            });
        }
        /**
         * 创建文件
         * @param content 初次创建时的内容 一般可为""
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createFile(content, onComplete, onError, thisPtr) {
            this.saveFile(content, onComplete, onError, thisPtr);
        }
        /**
         * 储存文件（文本格式）
         * @param content 文件内容文本
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        saveFile(content, onComplete, onError, thisPtr) {
            if (typeof content == "string") {
                var uint8Array = feng3d.dataTransform.stringToArrayBuffer(content);
                this.saveFile(uint8Array, onComplete, onError, thisPtr);
                return;
            }
            editor.editorRS.fs.writeArrayBuffer(this._path, content, (err) => {
                if (err) {
                    onError(this);
                }
                else {
                    this.updateStats(this._path, () => {
                        onComplete(this);
                    });
                }
            });
        }
        /**
         * 重命名
         * @param newName 重命名
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        rename(newName, onComplete, onError, thisPtr) {
            var oldPath = this._path;
            var newPath = this.location ? (this.location + "/" + newName) : newName;
            editor.editorRS.fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.warn(err);
                    onError(this);
                    return;
                }
                this.updateStats(newPath, () => {
                    onComplete(this);
                });
            });
        }
        /**
         * 移动文件夹
         * @param newPath 新的路径
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 失败时回调  onError([object FileObject])
         * @param thisPtr 执行域
         */
        move(newPath, onComplete, onError, thisPtr) {
            editor.editorRS.fs.move(this._path, newPath, (err) => {
                if (err) {
                    console.warn(err);
                    onError(this);
                    return;
                }
                this.updateStats(newPath, () => {
                    onComplete(this);
                });
            });
        }
        /**
         * 删除文件（夹）
         * @param onComplete onComplete([object FileObject])
         * @param onError onError([object FileObject])
         * @param thisPtr 执行域
         */
        delete(onComplete, onError, thisPtr) {
            editor.editorRS.fs.delete(this._path, (err) => {
                if (err) {
                    console.warn(err);
                    onError(this);
                    return;
                }
                this._exists = false;
                onComplete(this);
            });
        }
        /**
         * 打开文件
         * @param onFin 完成时回调 onFin(txt:string)
         * @param onError 错误时回调 onError([fileObject])
         */
        open(onFin, onError) {
            throw "未实现";
        }
        /**
         * 更新状态
         * @param callback 回调函数
         */
        updateStats(path, callback, onComplete, onError) {
            editor.editorRS.fs.exists(path, (exists) => {
                if (!exists) {
                    this._exists = false;
                    onError && onError(this);
                }
                else {
                    this._exists = true;
                    this._size = 0;
                    this._path = path;
                    this._isDirectory = path.charAt(path.length - 1) == "/";
                    this._createDate = new Date();
                    this._lastModifyDate = new Date();
                    onError && onComplete(this);
                }
                callback && callback();
            });
        }
    }
    editor.FileObject = FileObject;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 本地文件系统
     */
    class NativeFS {
        constructor(fs) {
            /**
             * 文件系统类型
             */
            this.type = feng3d.FSType.native;
            this.fs = fs;
        }
        /**
         * 读取文件为ArrayBuffer
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readArrayBuffer(path, callback) {
            var realPath = this.getAbsolutePath(path);
            this.fs.readFile(realPath, callback);
        }
        /**
         * 读取文件为字符串
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readString(path, callback) {
            this.readArrayBuffer(path, (err, data) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                feng3d.dataTransform.arrayBufferToString(data, (content) => {
                    callback(null, content);
                });
            });
        }
        /**
         * 读取文件为Object
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readObject(path, callback) {
            this.readArrayBuffer(path, (err, buffer) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                feng3d.dataTransform.arrayBufferToObject(buffer, (content) => {
                    callback(null, content);
                });
            });
        }
        /**
         * 加载图片
         * @param path 图片路径
         * @param callback 加载完成回调
         */
        readImage(path, callback) {
            this.exists(path, exists => {
                if (exists) {
                    var img = new Image();
                    img.onload = function () {
                        callback(null, img);
                    };
                    img.onerror = (evt) => {
                        callback(new Error(`加载图片${path}失败`), null);
                    };
                    img.src = this.getAbsolutePath(path);
                }
                else {
                    callback(new Error(`图片资源 ${path} 不存在`), null);
                }
            });
        }
        /**
         * 获取文件绝对路径
         * @param path （相对）路径
         */
        getAbsolutePath(path) {
            if (!this.projectname) {
                console.error(`请先使用 initproject 初始化项目`);
            }
            return this.projectname + "/" + path;
        }
        /**
         * 文件是否存在
         * @param path 文件路径
         * @param callback 回调函数
         */
        exists(path, callback) {
            var realPath = this.getAbsolutePath(path);
            this.fs.exists(realPath, callback);
        }
        /**
         * 是否为文件夹
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        isDirectory(path, callback) {
            var realPath = this.getAbsolutePath(path);
            this.fs.isDirectory(realPath, callback);
        }
        /**
         * 读取文件夹中文件列表
         *
         * @param path 路径
         * @param callback 回调函数
         */
        readdir(path, callback) {
            var realPath = this.getAbsolutePath(path);
            this.fs.readdir(realPath, callback);
        }
        /**
         * 新建文件夹
         * @param path 文件夹路径
         * @param callback 回调函数
         */
        mkdir(path, callback) {
            var realPath = this.getAbsolutePath(path);
            this.fs.mkdir(realPath, callback);
        }
        /**
         * 删除文件
         * @param path 文件路径
         * @param callback 回调函数
         */
        deleteFile(path, callback) {
            callback = callback || (() => { });
            var realPath = this.getAbsolutePath(path);
            this.isDirectory(path, result => {
                if (result) {
                    this.fs.rmdir(realPath, callback);
                }
                else {
                    this.fs.deleteFile(realPath, callback);
                }
            });
            feng3d.globalDispatcher.dispatch("fs.delete", path);
        }
        /**
         * 写ArrayBuffer(新建)文件
         * @param path 文件路径
         * @param arraybuffer 文件数据
         * @param callback 回调函数
         */
        writeArrayBuffer(path, arraybuffer, callback) {
            var realPath = this.getAbsolutePath(path);
            this.fs.writeFile(realPath, arraybuffer, err => { callback && callback(err); });
            feng3d.globalDispatcher.dispatch("fs.write", path);
        }
        /**
         * 写字符串到(新建)文件
         * @param path 文件路径
         * @param str 文件数据
         * @param callback 回调函数
         */
        writeString(path, str, callback) {
            var buffer = feng3d.dataTransform.stringToArrayBuffer(str);
            this.writeArrayBuffer(path, buffer, callback);
            feng3d.globalDispatcher.dispatch("fs.write", path);
        }
        /**
         * 写Object到(新建)文件
         * @param path 文件路径
         * @param object 文件数据
         * @param callback 回调函数
         */
        writeObject(path, object, callback) {
            var str = JSON.stringify(object, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            this.writeString(path, str, callback);
            feng3d.globalDispatcher.dispatch("fs.write", path);
        }
        /**
         * 写图片
         * @param path 图片路径
         * @param image 图片
         * @param callback 回调函数
         */
        writeImage(path, image, callback) {
            feng3d.dataTransform.imageToArrayBuffer(image, (buffer) => {
                this.writeArrayBuffer(path, buffer, callback);
            });
            feng3d.globalDispatcher.dispatch("fs.write", path);
        }
        /**
         * 复制文件
         * @param src    源路径
         * @param dest    目标路径
         * @param callback 回调函数
         */
        copyFile(src, dest, callback) {
            this.readArrayBuffer(src, (err, buffer) => {
                if (err) {
                    callback && callback(err);
                    return;
                }
                this.writeArrayBuffer(dest, buffer, callback);
            });
        }
        /**
         * 是否存在指定项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        hasProject(projectname, callback) {
            this.fs.exists(projectname, callback);
        }
        /**
         * 初始化项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        initproject(projectname, callback) {
            this.fs.exists(editor.editorcache.projectname, exists => {
                if (exists) {
                    this.projectname = editor.editorcache.projectname;
                    callback();
                    return;
                }
                editor.nativeAPI.selectDirectoryDialog((event, path) => {
                    editor.editorcache.projectname = this.projectname = path;
                    callback();
                });
            });
        }
    }
    editor.NativeFS = NativeFS;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 编辑器资源系统
     */
    class EditorRS extends feng3d.ReadWriteRS {
        /**
         * 初始化项目
         *
         * @param callback 完成回调
         */
        initproject(callback) {
            this.fs.hasProject(editor.editorcache.projectname, (has) => {
                this.fs.initproject(editor.editorcache.projectname, (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (has) {
                        callback();
                        return;
                    }
                    this.createproject(callback);
                });
            });
        }
        /**
         * 创建项目
         */
        createproject(callback) {
            var urls = [
                ["resource/template/.vscode/settings.json", ".vscode/settings.json"],
                ["resource/template/app.js", "app.js"],
                ["resource/template/index.html", "index.html"],
                ["resource/template/project.js", "project.js"],
                ["resource/template/tsconfig.json", "tsconfig.json"],
                ["resource/template/default.scene.json", "default.scene.json"],
                ["resource/template/libs/feng3d.js", "libs/feng3d.js"],
                ["resource/template/libs/feng3d.d.ts", "libs/feng3d.d.ts"],
                ["resource/template/libs/cannon.js", "libs/cannon.js"],
                ["resource/template/libs/cannon.d.ts", "libs/cannon.d.ts"],
                ["resource/template/libs/cannon-plugin.js", "libs/cannon-plugin.js"],
                ["resource/template/libs/cannon-plugin.d.ts", "libs/cannon-plugin.d.ts"],
            ];
            var index = 0;
            var loadUrls = () => {
                if (index >= urls.length) {
                    callback();
                    return;
                }
                feng3d.loader.loadText(urls[index][0], (content) => {
                    this.fs.writeString(urls[index][1], content, (err) => {
                        if (err)
                            throw err;
                        index++;
                        loadUrls();
                    });
                }, null, (e) => {
                    throw e;
                    index++;
                    loadUrls();
                });
            };
            loadUrls();
        }
        upgradeProject(callback) {
            var urls = [
                ["../feng3d/out/feng3d.js", "libs/feng3d.js"],
                ["../feng3d/out/feng3d.d.ts", "libs/feng3d.d.ts"],
                ["../physics/out/physics.js", "libs/physics.js"],
                ["../physics/out/physics.d.ts", "libs/physics.d.ts"],
            ];
            var index = 0;
            var loadUrls = () => {
                if (index >= urls.length) {
                    callback();
                    return;
                }
                feng3d.loader.loadText(urls[index][0], (content) => {
                    this.fs.writeString(urls[index][1], content, (err) => {
                        if (err)
                            console.warn(err);
                        index++;
                        loadUrls();
                    });
                }, null, (e) => {
                    console.warn(e);
                    index++;
                    loadUrls();
                });
            };
            loadUrls();
        }
        /**
         * 选择文件
         *
         * @param callback 完成回调
         */
        selectFile(callback) {
            selectFileCallback = callback;
            isSelectFile = true;
        }
        /**
         * 清理项目
         *
         * @param callback
         */
        clearProject(callback) {
            this._idMap = {};
            this._pathMap = {};
            this.fs.delete("", callback);
        }
        /**
         * 导出项目为zip压缩包
         *
         * @param filename 导出后压缩包名称
         * @param callback 完成回调
         */
        exportProjectToJSZip(filename, callback) {
            this.fs.getAllPathsInFolder("", (err, filepaths) => {
                if (err) {
                    console.error(err);
                    callback && callback();
                    return;
                }
                this.exportFilesToJSZip(filename, filepaths, callback);
            });
        }
        /**
         * 导出指定文件夹为zip压缩包
         *
         * @param filename 导出后压缩包名称
         * @param folderpath 需要导出的文件夹路径
         * @param callback 完成回调
         */
        exportFolderToJSZip(filename, folderpath, callback) {
            this.fs.getAllPathsInFolder(folderpath, (err, filepaths) => {
                if (err) {
                    console.error(err);
                    callback && callback();
                    return;
                }
                this.exportFilesToJSZip(filename, filepaths, callback);
            });
        }
        /**
         * 导出文件列表为zip压缩包
         *
         * @param filename 导出后压缩包名称
         * @param filepaths 需要导出的文件列表
         * @param callback 完成回调
         */
        exportFilesToJSZip(filename, filepaths, callback) {
            var zip = new JSZip();
            var fns = filepaths.map(p => (callback) => {
                this.fs.isDirectory(p, (result) => {
                    if (result) {
                        zip.folder(p);
                        callback();
                    }
                    else {
                        this.fs.readArrayBuffer(p, (err, data) => {
                            //处理文件夹
                            data && zip.file(p, data);
                            callback();
                        });
                    }
                });
            });
            feng3d.task.parallel(fns)(() => {
                zip.generateAsync({ type: "blob" }).then(function (content) {
                    saveAs(content, filename);
                    callback && callback();
                });
            });
        }
        /**
         * 导入项目
         */
        importProject(file, callback) {
            var zip = new JSZip();
            zip.loadAsync(file).then((value) => {
                var filepaths = Object.keys(value.files);
                filepaths.sort();
                var fns = filepaths.map(p => (callback) => {
                    if (value.files[p].dir) {
                        this.fs.mkdir(p, (err) => {
                            callback();
                        });
                    }
                    else {
                        zip.file(p).async("arraybuffer").then((data) => {
                            this.fs.writeFile(p, data, (err) => {
                                callback();
                            });
                        }, (reason) => {
                        });
                    }
                });
                feng3d.task.series(fns)(callback);
            });
        }
    }
    editor.EditorRS = EditorRS;
    if (editor.supportNative) {
        feng3d.basefs = new editor.NativeFS(editor.nativeFS);
    }
    else {
        feng3d.basefs = feng3d.indexedDBFS;
    }
    feng3d.fs = new feng3d.ReadWriteFS();
    feng3d.rs = editor.editorRS = new EditorRS();
    //
    var isSelectFile = false;
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = "none";
    fileInput.addEventListener('change', function (event) {
        selectFileCallback && selectFileCallback(fileInput.files);
        selectFileCallback = null;
        fileInput.value = null;
    });
    // document.body.appendChild(fileInput);
    window.addEventListener("click", () => {
        if (isSelectFile)
            fileInput.click();
        isSelectFile = false;
    });
    var selectFileCallback;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class EditorCache {
        constructor() {
            /**
             * 最近的项目列表
             */
            this.lastProjects = [];
            var value = localStorage.getItem("feng3d-editor");
            if (!value)
                return;
            var obj = JSON.parse(value);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this[key] = obj[key];
                }
            }
        }
        /**
         * 设置最近打开的项目
         */
        setLastProject(projectname) {
            var index = this.lastProjects.indexOf(projectname);
            if (index != -1)
                this.lastProjects.splice(index, 1);
            this.lastProjects.unshift(projectname);
        }
        save() {
            localStorage.setItem("feng3d-editor", JSON.stringify(this, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1'));
        }
    }
    editor.EditorCache = EditorCache;
    editor.editorcache = new EditorCache();
    window.addEventListener("beforeunload", () => {
        if (codeeditoWin)
            codeeditoWin.close();
        if (editor.runwin)
            editor.runwin.close();
        editor.editorcache.save();
    });
})(editor || (editor = {}));
var editor;
(function (editor) {
    class Drag {
        register(displayObject, setdargSource, accepttypes, onDragDrop) {
            this.unregister(displayObject);
            registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });
            if (setdargSource)
                displayObject.addEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
        }
        unregister(displayObject) {
            for (var i = registers.length - 1; i >= 0; i--) {
                if (registers[i].displayObject == displayObject) {
                    registers.splice(i, 1);
                }
            }
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
        }
        /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
        refreshAcceptables() {
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce((value, item) => {
                if (item != dragitem && acceptData(item, dragSource)) {
                    value.push(item);
                }
                return value;
            }, []);
        }
    }
    editor.Drag = Drag;
    ;
    editor.drag = new Drag();
    class DragData {
        constructor() {
            this.datas = [];
        }
        /**
         * 添加拖拽数据
         *
         * @param datatype
         * @param value
         */
        addDragData(datatype, value) {
            var item = { datatype: datatype, value: value };
            this.datas.push(item);
        }
        /**
         * 获取拖拽数据列表
         *
         * @param datatype
         */
        getDragData(datatype) {
            var data = this.datas.filter(v => v.datatype == datatype).map(v => v.value);
            return data;
        }
        /**
         * 是否拥有指定类型数据
         *
         * @param datatype
         */
        hasDragData(datatype) {
            var data = this.datas.filter(v => v.datatype == datatype).map(v => v.value);
            return data.length > 0;
        }
    }
    editor.DragData = DragData;
    var stage;
    var registers = [];
    /**
     * 对象与触发接受拖拽的对象列表
     */
    var accepter;
    var accepterAlpha;
    /**
     * 被拖拽数据
     */
    var dragSource;
    /**
     * 被拖拽对象
     */
    var dragitem;
    /**
     * 可接受拖拽数据对象列表
     */
    var acceptableitems;
    function getitem(displayObject) {
        for (var i = 0; i < registers.length; i++) {
            if (registers[i].displayObject == displayObject)
                return registers[i];
        }
        return null;
    }
    /**
     * 判断是否接受数据
     * @param item
     * @param dragSource
     */
    function acceptData(item, dragSource) {
        var hasdata = item.accepttypes.reduce((prevalue, accepttype) => { return prevalue || dragSource.hasDragData(accepttype); }, false);
        return hasdata;
    }
    /**
     * 是否处于拖拽中
     */
    var draging = false;
    // 鼠标按下时位置
    var mouseDownPosX = 0;
    var mouseDownPosY = 0;
    function onItemMouseDown(event) {
        mouseDownPosX = feng3d.windowEventProxy.clientX;
        mouseDownPosY = feng3d.windowEventProxy.clientY;
        if (dragitem)
            return;
        dragitem = getitem(event.currentTarget);
        if (!dragitem.setdargSource) {
            dragitem = null;
            return;
        }
        if (dragitem) {
            stage = dragitem.displayObject.stage;
            stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
            stage.addEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
            //
            feng3d.shortcut.activityState(feng3d.shortCutStates.draging);
        }
    }
    function onMouseUp(event) {
        stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
        stage.removeEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
        acceptableitems = null;
        if (accepter) {
            var accepteritem = getitem(accepter);
            if (accepter != dragitem.displayObject) {
                accepter.alpha = accepterAlpha;
                accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
            }
        }
        accepter = null;
        dragitem = null;
        draging = false;
        //
        feng3d.shortcut.deactivityState(feng3d.shortCutStates.draging);
    }
    function onMouseMove(event) {
        if (!dragitem)
            return;
        if (!draging) {
            if (Math.abs(mouseDownPosX - feng3d.windowEventProxy.clientX) +
                Math.abs(mouseDownPosY - feng3d.windowEventProxy.clientY) > 5) {
                draging = true;
            }
            return;
        }
        if (!acceptableitems) {
            //获取拖拽数据
            dragSource = new DragData();
            dragitem.setdargSource(dragSource);
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce((value, item) => {
                if (acceptData(item, dragSource) && item.displayObject.stage) {
                    item["hierarchyValue"] = getHierarchyValue(item.displayObject);
                    value.push(item);
                }
                return value;
            }, []);
            // 根据层级排序
            acceptableitems.sort((a, b) => {
                var ah = a["hierarchyValue"];
                var bh = b["hierarchyValue"];
                for (let i = 0, num = Math.min(ah.length, bh.length); i < num; i++) {
                    if (ah[i] != bh[i])
                        return ah[i] - bh[i];
                }
                return ah.length - bh.length;
            });
            acceptableitems.reverse();
        }
        if (accepter) {
            if (dragitem.displayObject != accepter) {
                accepter.alpha = accepterAlpha;
            }
            accepter = null;
        }
        //
        for (let i = 0; i < acceptableitems.length; i++) {
            const element = acceptableitems[i];
            var rect = element.displayObject.getGlobalBounds();
            if (rect.contains(event.stageX, event.stageY)) {
                accepter = element.displayObject;
                if (dragitem.displayObject != accepter) {
                    accepterAlpha = element.displayObject.alpha;
                    element.displayObject.alpha = 0.5;
                }
                break;
            }
        }
    }
    /**
     * 获取显示对象的层级
     *
     * @param displayObject
     */
    function getHierarchyValue(displayObject) {
        var hierarchys = [];
        if (displayObject.parent) {
            hierarchys.unshift(displayObject.parent.getChildIndex(displayObject));
            displayObject = displayObject.parent;
        }
        return editor.hierarchy;
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    class Cursor {
        constructor() {
            this.o = new Map();
        }
        add(id, value) {
            this.o.set(id, value);
            this.update();
        }
        clear(id) {
            this.o.delete(id);
            this.update();
        }
        update() {
            var v = Map.getValues(this.o).reverse()[0];
            document.body.style.cursor = v || "auto";
        }
    }
    /**
     * 鼠标光标管理
     */
    editor.cursor = new Cursor();
})(editor || (editor = {}));
var editor;
(function (editor) {
    class Editorshortcut {
        constructor() {
            // 初始化快捷键
            feng3d.shortcut.addShortCuts(shortcutConfig);
            //监听命令
            feng3d.shortcut.on("deleteSeletedGameObject", this.onDeleteSeletedGameObject, this);
            //
            feng3d.shortcut.on("gameobjectMoveTool", this.onGameobjectMoveTool, this);
            feng3d.shortcut.on("gameobjectRotationTool", this.onGameobjectRotationTool, this);
            feng3d.shortcut.on("gameobjectScaleTool", this.onGameobjectScaleTool, this);
            //
            feng3d.shortcut.on("openDevTools", this.onOpenDevTools, this);
            feng3d.shortcut.on("refreshWindow", this.onRefreshWindow, this);
            // 
            feng3d.shortcut.on("copy", this.onCopy, this);
            feng3d.shortcut.on("paste", this.onPaste, this);
            feng3d.shortcut.on("undo", this.onUndo, this);
        }
        onGameobjectMoveTool() {
            editor.editorData.toolType = editor.MRSToolType.MOVE;
        }
        onGameobjectRotationTool() {
            editor.editorData.toolType = editor.MRSToolType.ROTATION;
        }
        onGameobjectScaleTool() {
            editor.editorData.toolType = editor.MRSToolType.SCALE;
        }
        onDeleteSeletedGameObject() {
            var selectedObject = editor.editorData.selectedObjects;
            if (!selectedObject)
                return;
            //删除文件引用计数
            selectedObject.forEach(element => {
                if (element instanceof feng3d.GameObject) {
                    element.remove();
                }
                else if (element instanceof editor.AssetNode) {
                    element.delete();
                }
            });
            editor.editorData.clearSelectedObjects();
        }
        onOpenDevTools() {
            if (editor.nativeAPI)
                editor.nativeAPI.openDevTools();
        }
        onRefreshWindow() {
            window.location.reload();
        }
        onCopy() {
            var objects = editor.editorData.selectedObjects.filter(v => v instanceof feng3d.GameObject);
            editor.editorData.copyObjects = objects;
        }
        onPaste() {
            var undoSelectedObjects = editor.editorData.selectedObjects;
            //
            var objects = editor.editorData.copyObjects.filter(v => v instanceof feng3d.GameObject);
            if (objects.length == 0)
                return;
            var parent = objects[0].parent;
            var newGameObjects = objects.map(v => feng3d.serialization.clone(v));
            newGameObjects.forEach(v => {
                parent.addChild(v);
            });
            editor.editorData.selectMultiObject(newGameObjects, false);
            // undo
            editor.editorData.undoList.push(() => {
                newGameObjects.forEach(v => {
                    v.remove();
                });
                editor.editorData.selectMultiObject(undoSelectedObjects, false);
            });
        }
        onUndo() {
            var item = editor.editorData.undoList.pop();
            if (item)
                item();
        }
    }
    editor.Editorshortcut = Editorshortcut;
    class SceneControlConfig {
        constructor() {
            this.mouseWheelMoveStep = 0.004;
            //dynamic
            this.lookDistance = 3;
            this.sceneCameraForwardBackwardStep = 0.01;
        }
    }
    editor.SceneControlConfig = SceneControlConfig;
    editor.sceneControlConfig = new SceneControlConfig();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 模块
     *
     * 用于管理功能模块
     */
    class Modules {
        constructor() {
            this.moduleViewMap = {};
        }
        getModuleView(moduleName) {
            this.moduleViewMap[moduleName] = this.moduleViewMap[moduleName] || [];
            var moduleview = this.moduleViewMap[moduleName].pop();
            if (!moduleview) {
                var cls = Modules.moduleViewCls[moduleName];
                if (!cls) {
                    console.error(`无法获取模块 ${moduleName} 界面类定义`);
                    return;
                }
                moduleview = new cls();
            }
            return moduleview;
        }
        /**
         * 回收模块界面
         *
         * @param moduleView 模块界面
         */
        recycleModuleView(moduleView) {
            this.moduleViewMap[moduleView.moduleName] = this.moduleViewMap[moduleView.moduleName] || [];
            this.moduleViewMap[moduleView.moduleName].push(moduleView);
        }
    }
    /**
     * 模块界面类定义
     */
    Modules.moduleViewCls = {};
    editor.Modules = Modules;
    editor.modules = new Modules();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 快捷键设置界面
     */
    class ShortCutSetting extends eui.Component {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ShortCutSetting";
            this.moduleName = ShortCutSetting.moduleName;
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.searchTxt.addEventListener(egret.Event.CHANGE, this.updateView, this);
            this.updateView();
        }
        onRemovedFromStage() {
            this.searchTxt.removeEventListener(egret.Event.CHANGE, this.updateView, this);
        }
        updateView() {
            var text = this.searchTxt.text;
            var reg = new RegExp(text, "i");
            var data = shortcutConfig.filter(v => {
                for (const key in v) {
                    if (key.charAt(0) != "_") {
                        if (typeof v[key] == "string" && v[key].search(reg) != -1)
                            return true;
                    }
                }
                return false;
            });
            this.list.dataProvider = new eui.ArrayCollection(data);
        }
    }
    ShortCutSetting.moduleName = "ShortCutSetting";
    editor.ShortCutSetting = ShortCutSetting;
    editor.Modules.moduleViewCls[ShortCutSetting.moduleName] = ShortCutSetting;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 场景视图
     */
    class SceneView extends eui.Component {
        constructor() {
            super();
            this.selectedObjectsHistory = [];
            this.skinName = "SceneView";
            //
            feng3d.Stats.init(document.getElementById("stats"));
            //
            this.moduleName = SceneView.moduleName;
            //
            this._areaSelectRect = new editor.AreaSelectRect();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        }
        /**
         * 鼠标是否在界面中
         */
        get mouseInView() {
            if (!this.stage)
                return false;
            return this.getGlobalBounds().contains(this.stage.stageX, this.stage.stageY);
        }
        onAddedToStage() {
            //
            if (!this._canvas) {
                //
                this._canvas = document.createElement("canvas");
                document.getElementById("app").appendChild(this._canvas);
                this.view = new editor.EditorView(this._canvas);
                //
                var editorCamera = this.editorCamera = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "editorCamera" }).addComponent(feng3d.Camera);
                editorCamera.lens.far = 5000;
                editorCamera.transform.x = 5;
                editorCamera.transform.y = 3;
                editorCamera.transform.z = 5;
                editorCamera.transform.lookAt(new feng3d.Vector3());
                editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
                this.view.camera = editorCamera;
                //
                var editorScene = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "editorScene" }).addComponent(feng3d.Scene);
                editorScene.runEnvironment = feng3d.RunEnvironment.all;
                this.view.editorScene = editorScene;
                //
                var sceneRotateTool = editorScene.gameObject.addComponent(editor.SceneRotateTool);
                sceneRotateTool.view = this.view;
                //
                //初始化模块
                var groundGrid = editorScene.gameObject.addComponent(editor.GroundGrid);
                groundGrid.editorCamera = editorCamera;
                var mrsTool = editorScene.gameObject.addComponent(editor.MRSTool);
                mrsTool.editorCamera = editorCamera;
                this.view.editorComponent = editorScene.gameObject.addComponent(editor.EditorComponent);
                //
                feng3d.loader.loadText(editor.editorData.getEditorAssetPath("gameobjects/Trident.gameobject.json"), (content) => {
                    var trident = feng3d.serialization.deserialize(JSON.parse(content));
                    editorScene.gameObject.addChild(trident);
                });
            }
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.backRect.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            this.backRect.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            feng3d.shortcut.on("selectGameObject", this.onSelectGameObject, this);
            //
            feng3d.shortcut.on("areaSelectStart", this._onAreaSelectStart, this);
            feng3d.shortcut.on("areaSelect", this._onAreaSelect, this);
            feng3d.shortcut.on("areaSelectEnd", this._onAreaSelectEnd, this);
            //
            feng3d.shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            feng3d.shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
            feng3d.shortcut.on("mouseRotateSceneEnd", this.onMouseRotateSceneEnd, this);
            //
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", this.onSceneCameraForwardBackMouseMoveStart, this);
            feng3d.shortcut.on("sceneCameraForwardBackMouseMove", this.onSceneCameraForwardBackMouseMove, this);
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveEnd", this.onSceneCameraForwardBackMouseMoveEnd, this);
            //
            feng3d.shortcut.on("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
            //
            feng3d.shortcut.on("dragSceneStart", this.onDragSceneStart, this);
            feng3d.shortcut.on("dragScene", this.onDragScene, this);
            feng3d.shortcut.on("dragSceneEnd", this.onDragSceneEnd, this);
            //
            feng3d.shortcut.on("fpsViewStart", this.onFpsViewStart, this);
            feng3d.shortcut.on("fpsViewStop", this.onFpsViewStop, this);
            feng3d.shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
            editor.drag.register(this, null, ["file_gameobject", "file_script"], (dragdata) => {
                dragdata.getDragData("file_gameobject").forEach(v => {
                    editor.hierarchy.addGameoObjectFromAsset(v, editor.hierarchy.rootnode.gameobject);
                });
                dragdata.getDragData("file_script").forEach(v => {
                    var gameobject = this.view.mouse3DManager.selectedGameObject;
                    if (!gameobject || !gameobject.scene)
                        gameobject = editor.hierarchy.rootnode.gameobject;
                    gameobject.addScript(v.scriptName);
                });
            });
            this.once(egret.Event.ENTER_FRAME, this.onResize, this);
        }
        onRemoveFromStage() {
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.backRect.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            this.backRect.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            //
            feng3d.shortcut.off("selectGameObject", this.onSelectGameObject, this);
            //
            feng3d.shortcut.off("areaSelectStart", this._onAreaSelectStart, this);
            feng3d.shortcut.off("areaSelect", this._onAreaSelect, this);
            feng3d.shortcut.off("areaSelectEnd", this._onAreaSelectEnd, this);
            //
            feng3d.shortcut.off("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            feng3d.shortcut.off("mouseRotateScene", this.onMouseRotateScene, this);
            feng3d.shortcut.off("mouseRotateSceneEnd", this.onMouseRotateSceneEnd, this);
            //
            feng3d.shortcut.off("sceneCameraForwardBackMouseMoveStart", this.onSceneCameraForwardBackMouseMoveStart, this);
            feng3d.shortcut.off("sceneCameraForwardBackMouseMove", this.onSceneCameraForwardBackMouseMove, this);
            feng3d.shortcut.off("sceneCameraForwardBackMouseMoveEnd", this.onSceneCameraForwardBackMouseMoveEnd, this);
            //
            feng3d.shortcut.off("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
            feng3d.shortcut.off("dragSceneStart", this.onDragSceneStart, this);
            feng3d.shortcut.off("dragScene", this.onDragScene, this);
            feng3d.shortcut.off("fpsViewStart", this.onFpsViewStart, this);
            feng3d.shortcut.off("fpsViewStop", this.onFpsViewStop, this);
            feng3d.shortcut.off("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
            editor.drag.unregister(this);
            if (this._canvas) {
                this._canvas.style.display = "none";
                this._canvas = null;
            }
        }
        _onAreaSelectStart() {
            if (!this.mouseInView)
                return;
            this._areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        }
        _onAreaSelect() {
            if (!this._areaSelectStartPosition)
                return;
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rectangle = this.getGlobalBounds();
            //
            areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
            //
            this._areaSelectRect.show(this._areaSelectStartPosition, areaSelectEndPosition);
            //
            var gs = this.view.getObjectsInGlobalArea(this._areaSelectStartPosition, areaSelectEndPosition);
            var gs0 = gs.filter(g => {
                return !!editor.hierarchy.getNode(g);
            });
            editor.editorData.selectMultiObject(gs0);
        }
        _onAreaSelectEnd() {
            this._areaSelectStartPosition = null;
            this._areaSelectRect.hide();
        }
        onMouseOver() {
            feng3d.shortcut.activityState("mouseInView3D");
        }
        onMouseOut() {
            feng3d.shortcut.deactivityState("mouseInView3D");
        }
        onResize() {
            if (!this._canvas)
                return;
            this._canvas.style.display = "";
            var bound = this.getGlobalBounds();
            var style = this._canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
            feng3d.Stats.instance.dom.style.left = bound.x + "px";
            feng3d.Stats.instance.dom.style.top = bound.y + "px";
        }
        onSelectGameObject() {
            if (!this.mouseInView)
                return;
            var gameObjects = feng3d.raycaster.pickAll(this.view.mouseRay3D, this.view.editorScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
            if (gameObjects.length > 0)
                return;
            //
            gameObjects = feng3d.raycaster.pickAll(this.view.mouseRay3D, editor.editorData.gameScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
            if (gameObjects.length == 0) {
                editor.editorData.clearSelectedObjects();
                return;
            }
            //
            gameObjects = gameObjects.reduce((pv, gameObject) => {
                var node = editor.hierarchy.getNode(gameObject);
                while (!node && gameObject.parent) {
                    gameObject = gameObject.parent;
                    node = editor.hierarchy.getNode(gameObject);
                }
                if (gameObject != gameObject.scene.gameObject) {
                    pv.push(gameObject);
                }
                return pv;
            }, []);
            //
            if (gameObjects.length > 0) {
                var selectedObjectsHistory = this.selectedObjectsHistory;
                var gameObject = gameObjects.reduce((pv, cv) => {
                    if (pv)
                        return pv;
                    if (selectedObjectsHistory.indexOf(cv) == -1)
                        pv = cv;
                    return pv;
                }, null);
                if (!gameObject) {
                    selectedObjectsHistory.length = 0;
                    gameObject = gameObjects[0];
                }
                editor.editorData.selectObject(gameObject);
                selectedObjectsHistory.push(gameObject);
            }
            else {
                editor.editorData.clearSelectedObjects();
            }
        }
        onMouseRotateSceneStart() {
            if (!this.mouseInView)
                return;
            this.rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            this.rotateSceneCameraGlobalMatrix = this.editorCamera.transform.localToWorldMatrix.clone();
            this.rotateSceneCenter = null;
            //获取第一个 游戏对象
            var transformBox = editor.editorData.transformBox;
            if (transformBox) {
                this.rotateSceneCenter = transformBox.getCenter();
            }
            else {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix.forward;
                this.rotateSceneCenter.scaleNumber(editor.sceneControlConfig.lookDistance);
                this.rotateSceneCenter = this.rotateSceneCenter.addTo(this.rotateSceneCameraGlobalMatrix.getPosition());
            }
        }
        onMouseRotateScene() {
            if (!this.rotateSceneMousePoint)
                return;
            var globalMatrix = this.rotateSceneCameraGlobalMatrix.clone();
            var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var view3DRect = this.view.viewRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix.right;
            globalMatrix.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
            this.editorCamera.transform.localToWorldMatrix = globalMatrix;
        }
        onMouseRotateSceneEnd() {
            this.rotateSceneMousePoint = null;
        }
        onSceneCameraForwardBackMouseMoveStart() {
            if (!this.mouseInView)
                return;
            this.preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        }
        onSceneCameraForwardBackMouseMove() {
            if (!this.preMousePoint)
                return;
            var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var moveDistance = (currentMousePoint.x + currentMousePoint.y - this.preMousePoint.x - this.preMousePoint.y) * editor.sceneControlConfig.sceneCameraForwardBackwardStep;
            editor.sceneControlConfig.lookDistance -= moveDistance;
            var forward = this.editorCamera.transform.localToWorldMatrix.forward;
            var camerascenePosition = this.editorCamera.transform.worldPosition;
            var newCamerascenePosition = new feng3d.Vector3(forward.x * moveDistance + camerascenePosition.x, forward.y * moveDistance + camerascenePosition.y, forward.z * moveDistance + camerascenePosition.z);
            var newCameraPosition = this.editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
            this.editorCamera.transform.position = newCameraPosition;
            this.preMousePoint = currentMousePoint;
        }
        onSceneCameraForwardBackMouseMoveEnd() {
            this.preMousePoint = null;
        }
        onDragSceneStart() {
            if (!this.mouseInView)
                return;
            this.dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            this.dragSceneCameraGlobalMatrix = this.editorCamera.transform.localToWorldMatrix.clone();
        }
        onDragScene() {
            if (!this.dragSceneMousePoint)
                return;
            var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var addPoint = mousePoint.subTo(this.dragSceneMousePoint);
            var scale = this.view.getScaleByDepth(editor.sceneControlConfig.lookDistance);
            var up = this.dragSceneCameraGlobalMatrix.up;
            var right = this.dragSceneCameraGlobalMatrix.right;
            up.scaleNumber(addPoint.y * scale);
            right.scaleNumber(-addPoint.x * scale);
            var globalMatrix = this.dragSceneCameraGlobalMatrix.clone();
            globalMatrix.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            this.editorCamera.transform.localToWorldMatrix = globalMatrix;
        }
        onDragSceneEnd() {
            this.dragSceneMousePoint = null;
            this.dragSceneCameraGlobalMatrix = null;
        }
        onFpsViewStart() {
            if (!this.mouseInView)
                return;
            var fpsController = this.editorCamera.getComponent(feng3d.FPSController);
            fpsController.onMousedown();
            feng3d.ticker.onframe(this.updateFpsView, this);
        }
        onFpsViewStop() {
            var fpsController = this.editorCamera.getComponent(feng3d.FPSController);
            fpsController.onMouseup();
            feng3d.ticker.offframe(this.updateFpsView, this);
        }
        updateFpsView() {
            var fpsController = this.editorCamera.getComponent(feng3d.FPSController);
            fpsController.update();
        }
        onLookToSelectedGameObject() {
            if (!this.mouseInView)
                return;
            var transformBox = editor.editorData.transformBox;
            if (transformBox) {
                var scenePosition = transformBox.getCenter();
                var size = transformBox.getSize().length;
                size = Math.max(size, 1);
                var lookDistance = size;
                var lens = this.editorCamera.lens;
                if (lens instanceof feng3d.PerspectiveLens) {
                    lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
                }
                //
                editor.sceneControlConfig.lookDistance = lookDistance;
                var lookPos = this.editorCamera.transform.localToWorldMatrix.forward;
                lookPos.scaleNumber(-lookDistance);
                lookPos.add(scenePosition);
                var localLookPos = lookPos.clone();
                if (this.editorCamera.transform.parent) {
                    localLookPos = this.editorCamera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
                }
                egret.Tween.get(this.editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
            }
        }
        onMouseWheelMoveSceneCamera() {
            if (!this.mouseInView)
                return;
            var distance = -feng3d.windowEventProxy.deltaY * editor.sceneControlConfig.mouseWheelMoveStep * editor.sceneControlConfig.lookDistance / 10;
            this.editorCamera.transform.localToWorldMatrix = this.editorCamera.transform.localToWorldMatrix.moveForward(distance);
            editor.sceneControlConfig.lookDistance -= distance;
        }
    }
    SceneView.moduleName = "Scene";
    editor.SceneView = SceneView;
    editor.Modules.moduleViewCls[SceneView.moduleName] = SceneView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class CameraPreview extends eui.Component {
        constructor() {
            super();
            this.skinName = "CameraPreview";
        }
        get camera() {
            return this._camera;
        }
        set camera(value) {
            if (this._camera) {
                feng3d.ticker.offframe(this.onframe, this);
            }
            this._camera = value;
            this.previewView.camera = this._camera;
            this.visible = !!this._camera;
            this.canvas.style.display = this._camera ? "inline" : "none";
            if (this._camera) {
                feng3d.ticker.onframe(this.onframe, this);
            }
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
        }
        initView() {
            if (this.saveParent)
                return;
            //
            var canvas = this.canvas = document.createElement("canvas");
            (document.getElementById("CameraPreviewLayer")).appendChild(canvas);
            this.previewView = new feng3d.View(canvas);
            this.previewView.mouse3DManager.mouseInput.enable = false;
            this.previewView.stop();
            //
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(() => {
                this.parent.removeChild(this);
            });
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            this.onResize();
        }
        onResize() {
            if (!this.stage)
                return;
            this.height = this.width * 3 / 5;
            var bound = this.group.getGlobalBounds();
            var style = this.canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
        }
        onDataChange() {
            var selectedGameObjects = editor.editorData.selectedGameObjects;
            if (selectedGameObjects.length > 0) {
                for (let i = 0; i < selectedGameObjects.length; i++) {
                    var camera = selectedGameObjects[i].getComponent(feng3d.Camera);
                    if (camera) {
                        this.camera = camera;
                        this.saveParent.addChild(this);
                        return;
                    }
                }
            }
            this.camera = null;
            this.parent && this.parent.removeChild(this);
        }
        onframe() {
            if (this.previewView.scene != editor.editorData.gameScene) {
                this.previewView.scene = editor.editorData.gameScene;
            }
            this.previewView.render();
        }
    }
    editor.CameraPreview = CameraPreview;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 粒子特效控制器
     */
    class ParticleEffectController extends eui.Component {
        constructor() {
            super();
            this.particleSystems = [];
            this.skinName = "ParticleEffectController";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
            this.updateView();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.pauseBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.stopBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.pauseBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.stopBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }
        onClick(e) {
            switch (e.currentTarget) {
                case this.stopBtn:
                    this.particleSystems.forEach(v => v.stop());
                    break;
                case this.pauseBtn:
                    if (this.isParticlePlaying)
                        this.particleSystems.forEach(v => v.pause());
                    else
                        this.particleSystems.forEach(v => v.continue());
                    break;
            }
            this.updateView();
        }
        onEnterFrame() {
            var v = this.particleSystems;
            if (v) {
                var playbackSpeed = (this.particleSystems[0] && this.particleSystems[0].main.simulationSpeed) || 1;
                var playbackTime = (this.particleSystems[0] && this.particleSystems[0].time) || 0;
                var particles = this.particleSystems.reduce((pv, cv) => { pv += cv.particleCount; return pv; }, 0);
                //
                this.speedInput.text = playbackSpeed.toString();
                this.timeInput.text = playbackTime.toFixed(3);
                this.particlesInput.text = particles.toString();
            }
        }
        initView() {
            if (this.saveParent)
                return;
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(() => {
                this.parent.removeChild(this);
            });
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
        }
        updateView() {
            if (!this.particleSystems)
                return;
            this.pauseBtn.label = this.isParticlePlaying ? "Pause" : "Continue";
        }
        get isParticlePlaying() {
            return this.particleSystems.reduce((pv, cv) => { return pv || cv.isPlaying; }, false);
        }
        onDataChange() {
            var particleSystems = editor.editorData.selectedGameObjects.reduce((pv, cv) => { var ps = cv.getComponent(feng3d.ParticleSystem); ps && (pv.push(ps)); return pv; }, []);
            this.particleSystems.forEach(v => {
                v.pause();
                v.off("particleCompleted", this.updateView, this);
            });
            this.particleSystems = particleSystems;
            this.particleSystems.forEach(v => {
                v.continue();
                v.on("particleCompleted", this.updateView, this);
            });
            if (this.particleSystems.length > 0)
                this.saveParent.addChild(this);
            else
                this.parent && this.parent.removeChild(this);
        }
    }
    editor.ParticleEffectController = ParticleEffectController;
})(editor || (editor = {}));
var defaultTextFiled;
function lostFocus(display) {
    if (!defaultTextFiled) {
        defaultTextFiled = new egret.TextField();
        defaultTextFiled.visible = false;
        display.stage.addChild(defaultTextFiled);
    }
    defaultTextFiled.setFocus();
}
var editor;
(function (editor) {
    /**
     * 重命名组件
     */
    class RenameTextInput extends eui.Component {
        constructor() {
            super();
            this.skinName = "RenameTextInputSkin";
        }
        /**
         * 显示文本
         */
        get text() {
            return this.nameLabel.text;
        }
        set text(v) {
            this.nameLabel.text = v;
        }
        get textAlign() {
            return this.nameLabel.textAlign;
        }
        set textAlign(v) {
            this.nameeditTxt.textDisplay.textAlign = this.nameLabel.textAlign = v;
        }
        /**
         * 启动编辑
         */
        edit(callback) {
            this.callback = callback;
            this.textAlign = this.textAlign;
            this.nameeditTxt.text = this.nameLabel.text;
            this.nameLabel.visible = false;
            this.nameeditTxt.visible = true;
            this.nameeditTxt.textDisplay.setFocus();
            //
            this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
            feng3d.windowEventProxy.on("keyup", this.onnameeditChanged, this);
        }
        /**
         * 取消编辑
         */
        cancelEdit() {
            this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
            feng3d.windowEventProxy.off("keyup", this.onnameeditChanged, this);
            //
            this.nameeditTxt.visible = false;
            this.nameLabel.visible = true;
            if (this.nameLabel.text == this.nameeditTxt.text)
                return;
            this.nameLabel.text = this.nameeditTxt.text;
            this.callback && this.callback();
            this.callback = null;
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        onnameeditChanged() {
            if (feng3d.windowEventProxy.key == "Enter" || feng3d.windowEventProxy.key == "Escape") {
                //拾取焦点
                var inputUtils = this.nameeditTxt.textDisplay["inputUtils"];
                inputUtils["onStageDownHandler"](new egret.Event(""));
            }
        }
    }
    editor.RenameTextInput = RenameTextInput;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    class SplitGroup extends eui.Group {
        constructor() {
            super();
            new editor.SplitUIComponent().init(this);
        }
    }
    editor.SplitGroup = SplitGroup;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 可拆分UI组件
     */
    class SplitUIComponent {
        init(splitGroup) {
            this.splitGroup = splitGroup;
            this.splitGroup.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.splitGroup.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.splitGroup.stage) {
                this.onAddedToStage();
            }
        }
        /**
         * 销毁
         */
        dispose() {
            if (this.splitGroup.stage) {
                this.onRemovedFromStage();
            }
            this.splitGroup = null;
        }
        onAddedToStage() {
            splitManager.addSplitGroup(this.splitGroup);
        }
        onRemovedFromStage() {
            splitManager.removeSplitGroup(this.splitGroup);
        }
    }
    editor.SplitUIComponent = SplitUIComponent;
    let SplitGroupState;
    (function (SplitGroupState) {
        /**
         * 默认状态，鼠标呈现正常形态
         */
        SplitGroupState[SplitGroupState["default"] = 0] = "default";
        /**
         * 鼠标处在分割线上，呈现上下或者左右箭头形态
         */
        SplitGroupState[SplitGroupState["onSplit"] = 1] = "onSplit";
        /**
         * 处于拖拽分隔线状态
         */
        SplitGroupState[SplitGroupState["draging"] = 2] = "draging";
    })(SplitGroupState || (SplitGroupState = {}));
    /**
     * 可拆分UI组件管理器
     */
    class SplitManager {
        constructor() {
            this.isdebug = false;
            /**
             * 状态
             */
            this.state = SplitGroupState.default;
            //
            this.splitGroups = [];
        }
        addSplitGroup(splitGroup) {
            this.splitGroups.push(splitGroup);
            if (this.splitGroups.length > 0) {
                editor.editorui.stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onPick, this);
            }
        }
        removeSplitGroup(splitGroup) {
            var index = this.splitGroups.indexOf(splitGroup);
            if (index != -1)
                this.splitGroups.splice(index, 1);
            if (this.splitGroups.length == 0) {
                editor.editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onPick, this);
            }
        }
        onPick(e) {
            if (this.state == SplitGroupState.draging)
                return;
            if (feng3d.shortcut.getState(feng3d.shortCutStates.draging))
                return;
            if (feng3d.shortcut.getState("inModal"))
                return;
            //
            let checkItems = this.getAllCheckItems();
            if (this.isdebug) {
                let s = this["a"] = this["a"] || new egret.Sprite();
                editor.editorui.tooltipLayer.addChild(s);
                s.graphics.clear();
                s.graphics.beginFill(0xff0000);
                checkItems.forEach(v => {
                    s.graphics.drawRect(v.rect.x, v.rect.y, v.rect.width, v.rect.height);
                });
                s.graphics.endFill();
            }
            else {
                let s = this["a"];
                if (s && s.parent)
                    s.parent.removeChild(s);
            }
            checkItems.reverse();
            let result = checkItems.filter(v => { return v.rect.contains(e.stageX, e.stageY); });
            var checkItem = result[0];
            if (checkItem) {
                this.state = SplitGroupState.onSplit;
                feng3d.shortcut.activityState("splitGroupDraging");
                //
                this.preElement = checkItem.splitGroup.getElementAt(checkItem.index);
                this.nextElement = checkItem.splitGroup.getElementAt(checkItem.index + 1);
                editor.cursor.add(this, checkItem.splitGroup.layout instanceof eui.HorizontalLayout ? "e-resize" : "n-resize");
                //
                editor.editorui.stage.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            }
            else {
                splitManager.state = SplitGroupState.default;
                feng3d.shortcut.deactivityState("splitGroupDraging");
                document.body.style.cursor = "auto";
                editor.cursor.clear(this);
                //
                editor.editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            }
            this.checkItem = checkItem;
        }
        getAllCheckItems() {
            var checkItems = this.splitGroups.reduce((pv, cv) => {
                cv.$children.reduce((pv0, cv0, ci) => {
                    if (ci == 0)
                        return pv0;
                    var item = { splitGroup: cv, index: ci - 1, rect: null };
                    var elementRect = cv.$children[ci - 1].getGlobalBounds();
                    if (cv.layout instanceof eui.HorizontalLayout) {
                        item.rect = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                    }
                    else {
                        item.rect = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                    }
                    pv0.push(item);
                    return pv0;
                }, pv);
                return pv;
            }, []);
            return checkItems;
        }
        onMouseDown(e) {
            this.state = SplitGroupState.draging;
            // 拖拽分割
            feng3d.windowEventProxy.on("mousemove", this.onDragMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onDragMouseUp, this);
            var checkItem = this.checkItem;
            if (!checkItem)
                return;
            this.dragingMousePoint = new feng3d.Vector2(e.stageX, e.stageY);
            //
            var preElement = this.preElement;
            var nextElement = this.nextElement;
            var preElementRect = this.preElementRect = preElement.getGlobalBounds();
            var nextElementRect = this.nextElementRect = nextElement.getGlobalBounds();
            //
            //
            var minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
            var maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
            var minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
            var maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
            this.dragRect = new feng3d.Rectangle(minX, minY, maxX - minX, maxY - minY);
        }
        /**
         * 拖拽分割
         */
        onDragMouseMove() {
            var preElement = this.preElement;
            var nextElement = this.nextElement;
            var stageX = feng3d.windowEventProxy.clientX;
            var stageY = feng3d.windowEventProxy.clientY;
            var checkItem = this.checkItem;
            if (checkItem.splitGroup.layout instanceof eui.HorizontalLayout) {
                var layerX = Math.max(this.dragRect.left, Math.min(this.dragRect.right, stageX));
                var preElementWidth = this.preElementRect.width + (layerX - this.dragingMousePoint.x);
                var nextElementWidth = this.nextElementRect.width - (layerX - this.dragingMousePoint.x);
                preElement.percentWidth = preElementWidth / checkItem.splitGroup.width * 100;
                nextElement.percentWidth = nextElementWidth / checkItem.splitGroup.width * 100;
            }
            else if (checkItem.splitGroup.layout instanceof eui.VerticalLayout) {
                var layerY = Math.max(this.dragRect.top, Math.min(this.dragRect.bottom, stageY));
                var preElementHeight = this.preElementRect.height + (layerY - this.dragingMousePoint.y);
                var nextElementHeight = this.nextElementRect.height - (layerY - this.dragingMousePoint.y);
                preElement.percentHeight = preElementHeight / checkItem.splitGroup.height * 100;
                nextElement.percentHeight = nextElementHeight / checkItem.splitGroup.height * 100;
            }
        }
        /**
         * 停止拖拽
         */
        onDragMouseUp() {
            this.state = SplitGroupState.default;
            this.dragingMousePoint = null;
            this.checkItem = null;
            feng3d.windowEventProxy.off("mousemove", this.onDragMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onDragMouseUp, this);
            feng3d.globalDispatcher.dispatch("viewLayout.changed");
        }
    }
    var splitManager = new SplitManager();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * Tab 界面
     */
    class TabView extends eui.Group {
        constructor() {
            super();
            /**
             * 按钮池
             */
            this._tabViewButtonPool = [];
            /**
             * 模块按钮列表
             */
            this._tabButtons = [];
            /**
             * 模块界面列表
             */
            this._moduleViews = [];
            /**
             * 显示模块
             */
            this._showModuleIndex = -1;
        }
        /**
         * 获取模块名称列表
         */
        getModuleNames() {
            var moduleNames = this._moduleViews.map(v => v.moduleName);
            return moduleNames;
        }
        setModuleNames(moduleNames) {
            // 移除所有模块界面
            this._moduleViews.concat().forEach(v => {
                v.parent && v.parent.removeChild(v);
            });
            //
            this._moduleViews = [];
            moduleNames.forEach(v => {
                this.addModuleByName(v);
            });
            this._showModuleIndex = 0;
        }
        childrenCreated() {
            super.childrenCreated();
            //
            this.$children.forEach(v => {
                this._moduleViews.push(v);
            });
            this._moduleViews.forEach((v, index) => {
                v.parent && v.parent.removeChild(v);
                if (this._showModuleIndex == null && v.visible)
                    this._showModuleIndex = index;
                v.visible = true;
            });
            //
            this._tabViewInstance = new TabViewUI();
            this._tabViewInstance.left = this._tabViewInstance.right = this._tabViewInstance.top = this._tabViewInstance.bottom = 0;
            this.addChild(this._tabViewInstance);
            //
            // this._tabViewInstance.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.onComplete();
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            //
            this.tabGroup = this._tabViewInstance.tabGroup;
            this.contentGroup = this._tabViewInstance.contentGroup;
            // 获取按钮列表
            for (let i = this.tabGroup.numChildren - 1; i >= 0; i--) {
                let child = this.tabGroup.getChildAt(i);
                if (child instanceof TabViewButton) {
                    this._tabViewButtonPool.push(child);
                    this.tabGroup.removeChildAt(i);
                }
            }
            //
            if (this.stage) {
                this._onAddedToStage();
            }
        }
        _onAddedToStage() {
            editor.drag.register(this.tabGroup, null, ["moduleView"], (dragSource) => {
                dragSource.getDragData("moduleView").forEach(v => {
                    if (v.tabView == this) {
                        let result = this._moduleViews.filter(v => v.moduleName == v.moduleName)[0];
                        if (result) {
                            let index = this._moduleViews.indexOf(result);
                            this._moduleViews.splice(index, 1);
                            this._moduleViews.push(result);
                            this._invalidateView();
                        }
                    }
                    else {
                        let moduleView = v.tabView.removeModule(v.moduleName);
                        this.addModule(moduleView);
                    }
                    feng3d.globalDispatcher.dispatch("viewLayout.changed");
                });
            });
            editor.drag.register(this.contentGroup, null, ["moduleView"], (dragSource) => {
                dragSource.getDragData("moduleView").forEach(v => {
                    if (v.tabView == this && this._moduleViews.length == 1)
                        return;
                    let moduleView = v.tabView.removeModule(v.moduleName);
                    var rect = this.getGlobalBounds();
                    var center = rect.center;
                    var mouse = new feng3d.Vector2(editor.editorui.stage.stageX, editor.editorui.stage.stageY);
                    var sub = mouse.sub(center);
                    sub.x = sub.x / rect.width;
                    sub.y = sub.y / rect.height;
                    if (sub.x * sub.x > sub.y * sub.y) {
                        this.addModuleToLeft(moduleView, sub.x < 0 ? 4 : 6);
                    }
                    else {
                        this.addModuleToLeft(moduleView, sub.y < 0 ? 8 : 2);
                    }
                    feng3d.globalDispatcher.dispatch("viewLayout.changed");
                });
            });
            this._invalidateView();
        }
        addModuleToLeft(moduleView, dir = 4) {
            //
            var tabView = new TabView();
            tabView.addModule(moduleView);
            //
            var splitGroup = new editor.SplitGroup();
            this.copyLayoutInfo(this, splitGroup);
            if (dir == 4 || dir == 6) {
                var layout = splitGroup.layout = new eui.HorizontalLayout();
                layout.gap = 2;
                //
                tabView.percentHeight = 100;
                tabView.percentWidth = 30;
                this.percentHeight = 100;
                this.percentWidth = 70;
            }
            else if (dir == 8 || dir == 2) {
                var layout1 = splitGroup.layout = new eui.VerticalLayout();
                layout1.gap = 2;
                //
                tabView.percentHeight = 30;
                tabView.percentWidth = 100;
                this.percentHeight = 70;
                this.percentWidth = 100;
            }
            //
            var parent = this.parent;
            var index = parent.getChildIndex(this);
            parent.removeChildAt(index);
            //
            if (dir == 4 || dir == 8) {
                splitGroup.addChild(tabView);
                splitGroup.addChild(this);
            }
            else if (dir == 2 || dir == 6) {
                splitGroup.addChild(this);
                splitGroup.addChild(tabView);
            }
            //
            parent.addChildAt(splitGroup, index);
        }
        addModuleByName(moduleName) {
            var moduleView = editor.modules.getModuleView(moduleName);
            if (moduleView) {
                moduleView.top = moduleView.bottom = moduleView.left = moduleView.right = 0;
                this._moduleViews.push(moduleView);
                this._showModuleIndex = this._moduleViews.length - 1;
                this._invalidateView();
            }
            else {
                console.warn(`没有找到对应模块界面 ${moduleName}`);
            }
        }
        addModule(moduleView) {
            this._moduleViews.push(moduleView);
            this._showModuleIndex = this._moduleViews.length - 1;
            this._invalidateView();
        }
        removeModule(moduleName) {
            let moduleView = this._moduleViews.filter(v => v.moduleName == moduleName)[0];
            var index = this._moduleViews.indexOf(moduleView);
            console.assert(index != -1);
            this._moduleViews.splice(index, 1);
            this.adjust(this);
            this._invalidateView();
            return moduleView;
        }
        adjust(view) {
            var parent = view.parent;
            if (view instanceof TabView) {
                // 当模块全被移除时移除 TabView
                if (view._moduleViews.length == 0) {
                    this.remove();
                    this.adjust(parent);
                }
            }
            else if (view instanceof editor.SplitGroup) {
                if (view.numChildren > 1) {
                    if (view.layout instanceof eui.HorizontalLayout) {
                        var total = view.$children.reduce((pv, cv) => { return pv + cv.width; }, 0);
                        view.$children.forEach((v) => { v.percentWidth = v.width / total * 100; });
                    }
                    else if (view.layout instanceof eui.VerticalLayout) {
                        var total = view.$children.reduce((pv, cv) => { return pv + cv.height; }, 0);
                        view.$children.forEach((v) => { v.percentHeight = v.height / total * 100; });
                    }
                }
                else if (view.numChildren == 1) {
                    var child = view.getChildAt(0);
                    this.copyLayoutInfo(view, child);
                    //
                    var index = parent.getChildIndex(view);
                    parent.removeChildAt(index);
                    parent.addChildAt(child, index);
                    //
                    this.adjust(parent);
                }
                else {
                    console.assert(false);
                }
            }
            // 找到对象所属窗口，删除空窗口
            var windowView = editor.WindowView.getWindow(parent);
            if (windowView && windowView.contenGroup.numChildren == 0)
                windowView.remove();
        }
        copyLayoutInfo(src, dest) {
            dest.x = src.x;
            dest.y = src.y;
            dest.width = src.width;
            dest.height = src.height;
            dest.top = src.top;
            dest.bottom = src.bottom;
            dest.left = src.left;
            dest.right = src.right;
            dest.percentWidth = src.percentWidth;
            dest.percentHeight = src.percentHeight;
        }
        onRemovedFromStage() {
            editor.drag.unregister(this.tabGroup);
            editor.drag.unregister(this.contentGroup);
        }
        /**
         * 界面显示失效
         */
        _invalidateView() {
            this.once(egret.Event.ENTER_FRAME, this._updateView, this);
        }
        /**
         * 更新界面
         */
        _updateView() {
            var moduleNames = this._moduleViews.map(v => v.moduleName);
            // 设置默认显示模块名称
            this._showModuleIndex = Math.clamp(this._showModuleIndex, 0, this._moduleViews.length - 1);
            this._tabButtons.forEach(v => {
                v.removeEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
                v.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onTabButtonRightClick, this);
                //
                editor.drag.unregister(v);
            });
            //
            var buttonNum = this._tabButtons.length;
            var viewNum = this._moduleViews.length;
            for (var i = 0, max = Math.max(buttonNum, viewNum); i < max; i++) {
                if (i >= buttonNum) {
                    //
                    var tabButton = this._tabViewButtonPool.pop();
                    if (!tabButton)
                        tabButton = new TabViewButton();
                    this._tabButtons.push(tabButton);
                }
                if (i >= viewNum) {
                    var tabButton = this._tabButtons[i];
                    tabButton.parent && tabButton.parent.removeChild(tabButton);
                    this._tabViewButtonPool.push(tabButton);
                }
                if (i < viewNum) {
                    var tabButton = this._tabButtons[i];
                    var moduleView = this._moduleViews[i];
                    //
                    tabButton.moduleName = moduleView.moduleName;
                    this.tabGroup.addChild(tabButton);
                    //
                    if (i == this._showModuleIndex) {
                        tabButton.currentState = "selected";
                        this.contentGroup.addChild(moduleView);
                    }
                    else {
                        tabButton.currentState = "up";
                        if (moduleView.parent)
                            moduleView.parent.removeChild(moduleView);
                    }
                }
            }
            this._tabButtons.length = viewNum;
            this._tabButtons.forEach(v => {
                v.addEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
                //
                editor.drag.register(v, (dragSource) => {
                    dragSource.addDragData("moduleView", { tabView: this, moduleName: v.moduleName });
                }, []);
                v.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onTabButtonRightClick, this);
            });
        }
        /**
         * 点击按钮事件
         *
         * @param e
         */
        _onTabButtonClick(e) {
            var index = this._tabButtons.indexOf(e.currentTarget);
            if (index != this._showModuleIndex) {
                this._showModuleIndex = index;
                this._invalidateView();
            }
        }
        onTabButtonRightClick(e) {
            var tabButton = e.currentTarget;
            editor.menu.popup([
                {
                    label: "Close Tab", click: () => {
                        var moduleView = this.removeModule(tabButton.moduleName);
                        editor.modules.recycleModuleView(moduleView);
                    }
                },
                { type: "separator" },
                {
                    label: "Add Tab",
                    submenu: [editor.SceneView.moduleName, editor.InspectorView.moduleName, editor.HierarchyView.moduleName, editor.ProjectView.moduleName,].map(v => {
                        var item = {
                            label: v,
                            click: () => { this.addModuleByName(v); },
                        };
                        return item;
                    }),
                },
            ]);
        }
    }
    editor.TabView = TabView;
    /**
     * TabView 按钮
     */
    class TabViewButton extends eui.Button {
        constructor() {
            super();
            this.skinName = "TabViewButtonSkin";
        }
        /**
         * 模块名称
         */
        get moduleName() {
            return this._moduleName;
        }
        set moduleName(value) {
            this._moduleName = value;
            this._invalidateView();
        }
        childrenCreated() {
            super.childrenCreated();
            this._invalidateView();
        }
        _invalidateView() {
            this.once(egret.Event.ENTER_FRAME, this._updateView, this);
        }
        _updateView() {
            this.label = this._moduleName;
            this.iconDisplay.source = `${this._moduleName}Icon_png`;
        }
    }
    class TabViewUI extends eui.Component {
        constructor() {
            super();
            this.skinName = "TabViewSkin";
        }
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    class WindowView extends eui.Panel {
        constructor() {
            super();
            this.boundDragInfo = { type: -1, startX: 0, startY: 0, stage: null, rect: new feng3d.Rectangle(), draging: false };
            this.skinName = "WindowView";
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        }
        /**
         * 获取所属窗口
         *
         * @param view 窗口中的 contenGroup
         */
        static getWindow(contenGroup) {
            var p = contenGroup.parent;
            while (p && !(p instanceof WindowView)) {
                p = p.parent;
            }
            var windowView = p;
            if (windowView && windowView.contenGroup == contenGroup) {
                return windowView;
            }
            return null;
        }
        onAddedToStage() {
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }
        onRemoveFromStage() {
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
        }
        onMouseMove() {
            if (this.boundDragInfo.draging)
                return;
            var rect = this.getGlobalBounds();
            var stageX = this.stage.stageX;
            var stageY = this.stage.stageY;
            var size = 4;
            var leftRect = new feng3d.Rectangle(rect.x, rect.y, size, rect.height);
            var rightRect = new feng3d.Rectangle(rect.right - size, rect.y, size, rect.height);
            var bottomRect = new feng3d.Rectangle(rect.x, rect.bottom - size, rect.width, size);
            this.boundDragInfo.type = -1;
            if (leftRect.contains(stageX, stageY)) {
                this.boundDragInfo.type = 4;
            }
            else if (rightRect.contains(stageX, stageY)) {
                this.boundDragInfo.type = 6;
            }
            else if (bottomRect.contains(stageX, stageY)) {
                this.boundDragInfo.type = 2;
            }
            if (this.boundDragInfo.type != -1) {
                this.stage.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
                editor.cursor.add(this, this.boundDragInfo.type == 2 ? "n-resize" : "e-resize");
            }
            else {
                editor.cursor.clear(this);
                this.stage.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            }
        }
        onMouseDown(e) {
            this.boundDragInfo.draging = true;
            this.boundDragInfo.startX = e.stageX;
            this.boundDragInfo.startY = e.stageY;
            this.boundDragInfo.stage = this.stage;
            this.boundDragInfo.rect = new feng3d.Rectangle(this.x, this.y, this.width, this.height);
            feng3d.windowEventProxy.on("mousemove", this.onBoundDrag, this);
            feng3d.windowEventProxy.on("mouseup", this.onBoundDragEnd, this);
        }
        onBoundDrag() {
            var offsetX = this.boundDragInfo.stage.stageX - this.boundDragInfo.startX;
            var offsetY = this.boundDragInfo.stage.stageY - this.boundDragInfo.startY;
            if (this.boundDragInfo.type == 4) {
                if (offsetX < this.boundDragInfo.rect.width) {
                    this.x = this.boundDragInfo.rect.x + offsetX;
                    this.width = this.boundDragInfo.rect.width - offsetX;
                }
            }
            else if (this.boundDragInfo.type == 6) {
                if (-offsetX < this.boundDragInfo.rect.width) {
                    this.width = this.boundDragInfo.rect.width + offsetX;
                }
            }
            else if (this.boundDragInfo.type == 2) {
                if (-offsetY + 20 < this.boundDragInfo.rect.height) {
                    this.height = this.boundDragInfo.rect.height + offsetY;
                }
            }
        }
        onBoundDragEnd() {
            this.boundDragInfo.draging = false;
            feng3d.windowEventProxy.off("mousemove", this.onBoundDrag, this);
            feng3d.windowEventProxy.off("mouseup", this.onBoundDragEnd, this);
        }
    }
    editor.WindowView = WindowView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 在界面后面添加一层透明界面，当点击到透明界面时关闭界面。
     */
    class Maskview {
        mask(displayObject) {
            var maskReck = new eui.Rect();
            maskReck.alpha = 0;
            if (displayObject.stage) {
                onAddedToStage();
            }
            else {
                displayObject.once(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
            }
            function onAddedToStage() {
                maskReck.width = displayObject.stage.stageWidth;
                maskReck.height = displayObject.stage.stageHeight;
                var index = displayObject.parent.getChildIndex(displayObject);
                editor.editorui.popupLayer.addChildAt(maskReck, index);
                //
                maskReck.addEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                feng3d.shortcut.activityState("inModal");
            }
            function removeDisplayObject() {
                if (displayObject.parent)
                    displayObject.parent.removeChild(displayObject);
            }
            function onRemoveFromStage() {
                maskReck.removeEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                if (maskReck.parent) {
                    maskReck.parent.removeChild(maskReck);
                }
                feng3d.ticker.nextframe(() => {
                    feng3d.shortcut.deactivityState("inModal");
                });
            }
        }
    }
    editor.Maskview = Maskview;
    ;
    editor.maskview = new Maskview();
})(editor || (editor = {}));
var editor;
(function (editor) {
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
        popupObject(object, param = {}) {
            var view = feng3d.objectview.getObjectView(object);
            var background = new eui.Rect(param.width || 300, param.height || 300, 0xf0f0f0);
            view.addChildAt(background, 0);
            //
            if (param.closecallback) {
                var closecallback = param.closecallback;
                param.closecallback = () => {
                    closecallback && closecallback(object);
                };
            }
            this.popupView(view, param);
        }
        /**
         * 弹出一个界面
         *
         * @param view
         * @param param
         */
        popupView(view, param = {}) {
            editor.editorui.popupLayer.addChild(view);
            if (param.width !== undefined)
                view.width = param.width;
            if (param.height !== undefined)
                view.height = param.height;
            var x0 = (editor.editorui.stage.stageWidth - view.width) / 2;
            var y0 = (editor.editorui.stage.stageHeight - view.height) / 2;
            if (param.x !== undefined) {
                x0 = param.x;
            }
            if (param.y !== undefined) {
                y0 = param.y;
            }
            x0 = Math.clamp(x0, 0, editor.editorui.popupLayer.stage.stageWidth - view.width);
            y0 = Math.clamp(y0, 0, editor.editorui.popupLayer.stage.stageHeight - view.height);
            view.x = x0;
            view.y = y0;
            if (param.closecallback) {
                view.addEventListener(egret.Event.REMOVED_FROM_STAGE, param.closecallback, null);
            }
            if (param.mode != false)
                editor.maskview.mask(view);
        }
        /**
         * 弹出一个包含objectview的窗口
         *
         * @param object
         * @param closecallback
         * @param param
         */
        popupObjectWindow(object, param = {}) {
            var view = feng3d.objectview.getObjectView(object);
            var window = new editor.WindowView();
            window.contenGroup.addChild(view);
            window.title = `${object.constructor["name"]}`;
            //
            if (param.closecallback) {
                var closecallback = param.closecallback;
                param.closecallback = () => {
                    closecallback && closecallback(object);
                };
            }
            this.popupView(window, param);
        }
        /**
         * 弹出一个包含给出界面的窗口
         *
         * @param view
         * @param closecallback
         * @param param
         */
        popupViewWindow(view, param = {}) {
            var window = new editor.WindowView();
            window.contenGroup.addChild(view);
            //
            this.popupView(window, param);
        }
    }
    editor.Popupview = Popupview;
    ;
    editor.popupview = new Popupview();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 下拉列表
     */
    class ComboBox extends eui.Component {
        constructor() {
            super();
            /**
             * 数据
             */
            this.dataProvider = [];
            this.skinName = "ComboBoxSkin";
        }
        /**
         * 选中数据
         */
        get data() {
            return this._data;
        }
        set data(v) {
            this._data = v;
            if (this.label) {
                if (this._data)
                    this.label.text = this._data.label;
                else
                    this.label.text = "";
            }
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.init();
            this.updateview();
            this.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.list.addEventListener(egret.Event.CHANGE, this.onlistChange, this);
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.list.removeEventListener(egret.Event.CHANGE, this.onlistChange, this);
        }
        init() {
            this.list = new eui.List();
            this.list.itemRenderer = eui.ItemRenderer;
        }
        updateview() {
            if (this.data == null && this.dataProvider != null)
                this.data = this.dataProvider[0];
            if (this.data)
                this.label.text = this.data.label;
            else
                this.label.text = "";
        }
        onClick() {
            if (!this.dataProvider)
                return;
            this.list.dataProvider = new eui.ArrayCollection(this.dataProvider);
            var rect = this.getTransformedBounds(this.stage);
            this.list.x = rect.left;
            this.list.y = rect.bottom;
            this.list.selectedIndex = this.dataProvider.indexOf(this.data);
            editor.editorui.popupLayer.addChild(this.list);
            editor.maskview.mask(this.list);
        }
        onlistChange() {
            this.data = this.list.selectedItem;
            this.updateview();
            if (this.list.parent)
                this.list.parent.removeChild(this.list);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    }
    editor.ComboBox = ComboBox;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class Accordion extends eui.Component {
        constructor() {
            super();
            /**
             * 标签名称
             */
            this.titleName = "";
            this.components = [];
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "Accordion";
        }
        addContent(component) {
            if (!this.contentGroup)
                this.components.push(component);
            else
                this.contentGroup.addChild(component);
        }
        removeContent(component) {
            var index = this.components ? this.components.indexOf(component) : -1;
            if (index != -1)
                this.components.splice(index, 1);
            else
                component.parent && component.parent.removeChild(component);
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.titleGroup.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.titleLabel.text = this.titleName;
            if (this.components) {
                for (var i = 0; i < this.components.length; i++) {
                    this.contentGroup.addChild(this.components[i]);
                }
                this.components = null;
                delete this.components;
            }
        }
        onRemovedFromStage() {
            this.titleGroup.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        }
        onTitleButtonClick() {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        }
    }
    editor.Accordion = Accordion;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class ColorPicker extends eui.Component {
        constructor() {
            super();
            this._value = new feng3d.Color3();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ColorPicker";
        }
        get value() {
            return this._value;
        }
        set value(v) {
            this._value = v;
            if (this.picker) {
                if (this._value instanceof feng3d.Color3) {
                    this.picker.fillColor = this._value.toInt();
                }
                else {
                    this.picker.fillColor = this._value.toColor3().toInt();
                }
            }
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.picker.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }
        onRemovedFromStage() {
            this.picker.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }
        onClick() {
            if (!editor.colorPickerView)
                editor.colorPickerView = new editor.ColorPickerView();
            editor.colorPickerView.color = this.value;
            var pos = this.localToGlobal(0, 0);
            // pos.x = pos.x - colorPickerView.width;
            pos.x = pos.x - 318;
            editor.colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
            //
            editor.popupview.popupView(editor.colorPickerView, {
                x: pos.x, y: pos.y,
                closecallback: () => {
                    editor.colorPickerView.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                }
            });
        }
        onPickerViewChanged() {
            this.value = editor.colorPickerView.color;
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    }
    editor.ColorPicker = ColorPicker;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class TreeItemRenderer extends eui.ItemRenderer {
        constructor() {
            super();
            /**
             * 子结点相对父结点的缩进值，以像素为单位。默认17。
             */
            this.indentation = 17;
            this.watchers = [];
            this.skinName = "TreeItemRendererSkin";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            //
            this.disclosureButton.addEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
            this.updateView();
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            while (this.watchers.length > 0) {
                this.watchers.pop().unwatch();
            }
            //
            this.disclosureButton.removeEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
        }
        onDisclosureButtonClick() {
            if (this.data)
                this.data.isOpen = !this.data.isOpen;
        }
        updateView() {
            this.disclosureButton.visible = this.data ? (this.data.children && this.data.children.length > 0) : false;
            this.contentGroup.left = (this.data ? this.data.depth : 0) * this.indentation;
            this.disclosureButton.selected = this.data ? this.data.isOpen : false;
        }
    }
    editor.TreeItemRenderer = TreeItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class TreeNode extends feng3d.EventDispatcher {
        constructor(obj) {
            super();
            /**
             * 标签
             */
            this.label = "";
            /**
             * 是否打开
             */
            this.isOpen = false;
            /**
             * 是否选中
             */
            this.selected = false;
            /**
             * 父结点
             */
            this.parent = null;
            if (obj) {
                Object.assign(this, obj);
            }
        }
        /**
         * 目录深度
         */
        get depth() {
            var d = 0;
            var p = this.parent;
            while (p) {
                d++;
                p = p.parent;
            }
            return d;
        }
        /**
         * 销毁
         */
        destroy() {
            if (this.children) {
                this.children.concat().forEach(element => {
                    element.destroy();
                });
            }
            this.remove();
            this.parent = null;
            this.children = null;
        }
        /**
         * 判断是否包含结点
         */
        contain(node) {
            while (node) {
                if (node == this)
                    return true;
                node = node.parent;
            }
            return false;
        }
        addChild(node) {
            node.remove();
            console.assert(!node.contain(this), "无法添加到自身结点中!");
            if (this.children.indexOf(node) == -1)
                this.children.push(node);
            node.parent = this;
            this.dispatch("added", node, true);
        }
        remove() {
            if (this.parent) {
                var index = this.parent.children.indexOf(this);
                if (index != -1)
                    this.parent.children.splice(index, 1);
                this.dispatch("removed", this, true);
                this.parent = null;
            }
        }
        getShowNodes() {
            var nodes = [this];
            if (this.isOpen) {
                this.children.forEach(element => {
                    nodes = nodes.concat(element.getShowNodes());
                });
            }
            return nodes;
        }
        openParents() {
            var p = this.parent;
            while (p) {
                p.isOpen = true;
                p = p.parent;
            }
        }
        openChanged() {
            this.dispatch("openChanged", null, true);
        }
        selectedChanged() {
            this.openParents();
        }
    }
    __decorate([
        feng3d.watch("openChanged")
    ], TreeNode.prototype, "isOpen", void 0);
    __decorate([
        feng3d.watch("selectedChanged")
    ], TreeNode.prototype, "selected", void 0);
    editor.TreeNode = TreeNode;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class ComponentView extends eui.Component {
        /**
         * 对象界面数据
         */
        constructor(component) {
            super();
            this.component = component;
            component.on("refreshView", this.onRefreshView, this);
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ComponentSkin";
        }
        /**
         * 更新界面
         */
        updateView() {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        }
        onComplete() {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.componentIcon = this.accordion["componentIcon"];
            this.helpBtn = this.accordion["helpBtn"];
            this.operationBtn = this.accordion["operationBtn"];
            if (this.component instanceof feng3d.Transform) {
                this.componentIcon.source = "Transform_png";
            }
            else if (this.component instanceof feng3d.Water) {
                this.componentIcon.source = "Water_png";
            }
            else if (this.component instanceof feng3d.Terrain) {
                this.componentIcon.source = "Terrain_png";
            }
            else if (this.component instanceof feng3d.Renderable) {
                this.componentIcon.source = "Model_png";
            }
            else if (this.component instanceof feng3d.ScriptComponent) {
                this.componentIcon.source = "ScriptComponent_png";
            }
            else if (this.component instanceof feng3d.Camera) {
                this.componentIcon.source = "Camera_png";
            }
            else if (this.component instanceof feng3d.AudioSource) {
                this.componentIcon.source = "AudioSource_png";
            }
            else if (this.component instanceof feng3d.SpotLight) {
                this.componentIcon.source = "SpotLight_png";
            }
            else if (this.component instanceof feng3d.PointLight) {
                this.componentIcon.source = "PointLight_png";
            }
            else if (this.component instanceof feng3d.DirectionalLight) {
                this.componentIcon.source = "DirectionalLight_png";
            }
            else if (this.component instanceof feng3d.FPSController) {
                this.componentIcon.source = "FPSController_png";
            }
            else if (this.component instanceof feng3d.AudioListener) {
                this.componentIcon.source = "AudioListener_png";
            }
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage)
                this.onAddToStage();
        }
        onDeleteButton(event) {
            if (this.component.gameObject)
                this.component.gameObject.removeComponent(this.component);
        }
        onAddToStage() {
            this.initScriptView();
            this.updateView();
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
            this.operationBtn.addEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
            this.helpBtn.addEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
            feng3d.globalDispatcher.on("asset.scriptChanged", this.onScriptChanged, this);
        }
        onRemovedFromStage() {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
            this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
            this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
            feng3d.globalDispatcher.off("asset.scriptChanged", this.onScriptChanged, this);
        }
        onRefreshView() {
            this.accordion.removeContent(this.componentView);
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
        }
        updateEnableCB() {
            if (this.component instanceof feng3d.Behaviour) {
                this.enabledCB.selected = this.component.enabled;
                this.enabledCB.visible = true;
            }
            else {
                this.enabledCB.visible = false;
            }
        }
        onEnableCBChange() {
            if (this.component instanceof feng3d.Behaviour) {
                this.component.enabled = this.enabledCB.selected;
            }
        }
        initScriptView() {
            // 初始化Script属性界面
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.watch(this.component, "scriptName", this.onScriptChanged, this);
                var component = this.component;
                if (component.scriptInstance) {
                    this.scriptView = feng3d.objectview.getObjectView(component.scriptInstance, { autocreate: false });
                    this.accordion.addContent(this.scriptView);
                }
            }
        }
        removeScriptView() {
            // 移除Script属性界面
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.unwatch(this.component, "scriptName", this.onScriptChanged, this);
            }
            if (this.scriptView) {
                if (this.scriptView.parent)
                    this.scriptView.parent.removeChild(this.scriptView);
            }
        }
        onOperationBtnClick() {
            var menus = [];
            if (!(this.component instanceof feng3d.Transform)) {
                menus.push({
                    label: "移除组件",
                    click: () => {
                        if (this.component.gameObject)
                            this.component.gameObject.removeComponent(this.component);
                    }
                });
            }
            editor.menu.popup(menus);
        }
        onHelpBtnClick() {
            window.open(`http://feng3d.gitee.io/#/script`);
        }
        onScriptChanged() {
            setTimeout(() => {
                this.removeScriptView();
                this.initScriptView();
            }, 10);
        }
    }
    editor.ComponentView = ComponentView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class ParticleComponentView extends eui.Component {
        /**
         * 对象界面数据
         */
        constructor(component) {
            super();
            this.component = component;
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ParticleComponentView";
        }
        /**
         * 更新界面
         */
        updateView() {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        }
        onComplete() {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage)
                this.onAddToStage();
        }
        onAddToStage() {
            this.updateView();
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
        }
        onRemovedFromStage() {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
        }
        updateEnableCB() {
            this.enabledCB.selected = this.component.enabled;
        }
        onEnableCBChange() {
            this.component.enabled = this.enabledCB.selected;
        }
    }
    editor.ParticleComponentView = ParticleComponentView;
})(editor || (editor = {}));
var editor;
(function (editor) {
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
        popup(menuItems) {
            var menuItem = this.handleShow({ submenu: menuItems });
            if (menuItem.submenu.length == 0)
                return;
            var menuUI = MenuUI.create(menuItem.submenu, null);
            editor.maskview.mask(menuUI);
            return menuUI;
        }
        /**
         * 处理菜单中 show==false的菜单项
         *
         * @param menuItem 菜单数据
         */
        handleShow(menuItem) {
            if (menuItem.submenu) {
                var submenu = menuItem.submenu.filter(v => v.show != false);
                for (let i = submenu.length - 1; i >= 0; i--) {
                    if (submenu[i].type == 'separator') {
                        if (i == 0 || i == submenu.length - 1) {
                            submenu.splice(i, 1);
                        }
                        else if (submenu[i - 1].type == 'separator') {
                            submenu.splice(i, 1);
                        }
                    }
                }
                menuItem.submenu = submenu;
                menuItem.submenu.forEach(v => this.handleShow(v));
            }
            return menuItem;
        }
        /**
         * 弹出枚举选择菜单
         *
         * @param enumDefinition 枚举定义
         * @param currentValue 当前枚举值
         * @param selectCallBack 选择回调
         */
        popupEnum(enumDefinition, currentValue, selectCallBack) {
            var menu = [];
            for (const key in enumDefinition) {
                if (enumDefinition.hasOwnProperty(key)) {
                    if (isNaN(Number(key))) {
                        menu.push({
                            label: (currentValue == enumDefinition[key] ? "√ " : "   ") + key,
                            click: ((v) => {
                                return () => selectCallBack(v);
                            })(enumDefinition[key])
                        });
                    }
                }
            }
            this.popup(menu);
        }
    }
    editor.Menu = Menu;
    ;
    editor.menu = new Menu();
    class MenuUI extends eui.List {
        constructor() {
            super();
            this.itemRenderer = MenuItemRenderer;
            this.onComplete();
        }
        get subMenuUI() {
            return this._subMenuUI;
        }
        set subMenuUI(v) {
            if (this._subMenuUI)
                this._subMenuUI.remove();
            this._subMenuUI = v;
            if (this._subMenuUI)
                this._subMenuUI.parentMenuUI = this;
        }
        get topMenu() {
            var m = this.parentMenuUI ? this.parentMenuUI.topMenu : this;
            return m;
        }
        static create(menuItems, menuItemRendererRect = null) {
            var menuUI = new MenuUI();
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menuItems);
            menuUI.dataProvider = dataProvider;
            editor.editorui.popupLayer.addChild(menuUI);
            if (!menuItemRendererRect) {
                menuUI.x = feng3d.windowEventProxy.clientX;
                menuUI.y = feng3d.windowEventProxy.clientY;
                if (menuUI.x + menuUI.width > editor.editorui.popupLayer.stage.stageWidth - 10)
                    menuUI.x = editor.editorui.popupLayer.stage.stageWidth - menuUI.width - 10;
            }
            else {
                menuUI.x = menuItemRendererRect.right;
                menuUI.y = menuItemRendererRect.top;
                if (menuUI.x + menuUI.width > editor.editorui.popupLayer.stage.stageWidth) {
                    menuUI.x = menuItemRendererRect.left - menuUI.width;
                }
            }
            if (menuUI.y + menuUI.height > editor.editorui.popupLayer.stage.stageHeight)
                menuUI.y = editor.editorui.popupLayer.stage.stageHeight - menuUI.height;
            return menuUI;
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.updateView();
        }
        onRemovedFromStage() {
            this.subMenuUI = null;
            this.parentMenuUI = null;
        }
        updateView() {
        }
        remove() {
            this.parent && this.parent.removeChild(this);
        }
    }
    class MenuItemRenderer extends eui.ItemRenderer {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "MenuItemRender";
        }
        dataChanged() {
            super.dataChanged();
            this.updateView();
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);
            this.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);
            this.menuUI = this.parent;
            this.updateView();
        }
        onRemovedFromStage() {
            this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
            this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);
            this.menuUI = null;
        }
        updateView() {
            if (!this.data)
                return;
            this.touchEnabled = true;
            this.touchChildren = true;
            if (this.data.type == 'separator') {
                this.skin.currentState = "separator";
                this.touchEnabled = false;
                this.touchChildren = false;
            }
            else {
                this.subSign.visible = (!!this.data.submenu && this.data.submenu.length > 0);
                this.skin.currentState = "normal";
            }
            this.subSign.textColor = this.label.textColor = this.data.enable != false ? 0x000000 : 0x6E6E6E;
            this.selectedRect.visible = false;
        }
        onItemMouseDown(event) {
            if (this.data.enable == false)
                return;
            if (this.data.click) {
                this.data.click();
                this.menuUI.topMenu.remove();
            }
        }
        onItemMouseOver() {
            if (this.data.submenu) {
                if (this.data.enable != false) {
                    var rect = this.getTransformedBounds(this.stage);
                    this.menuUI.subMenuUI = MenuUI.create(this.data.submenu, rect);
                    this.menuUI.subMenuUI.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
                }
            }
            else {
                this.menuUI.subMenuUI = null;
            }
            this.selectedRect.visible = this.data.enable != false;
        }
        onItemMouseOut() {
            if (!this.menuUI.subMenuUI)
                this.selectedRect.visible = false;
        }
        onsubMenuUIRemovedFromeStage(e) {
            var current = e.currentTarget;
            current.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            this.selectedRect.visible = false;
        }
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    let MessageType;
    (function (MessageType) {
        MessageType[MessageType["Normal"] = 0] = "Normal";
        MessageType[MessageType["Error"] = 1] = "Error";
    })(MessageType || (MessageType = {}));
    /**
     * 消息模块
     *
     * 用于显示提示信息，例如屏幕中间的上浮信息
     */
    class Message {
        constructor() {
            this._messages = [];
            this._showMessageIndex = 0;
            this._messageLabelPool = [];
            /**
             * 显示间隔
             */
            this._interval = 400;
            feng3d.globalDispatcher.on("message", this._onMessage, this);
            feng3d.globalDispatcher.on("message.error", this._onErrorMessage, this);
        }
        _onMessage(event) {
            this._messages.push([MessageType.Normal, event.data]);
            feng3d.ticker.on(this._interval, this._showMessage, this);
        }
        _onErrorMessage(event) {
            this._messages.push([MessageType.Error, event.data]);
            feng3d.ticker.on(this._interval, this._showMessage, this);
        }
        _getMessageItem(message) {
            var label = this._messageLabelPool.pop();
            if (!label) {
                label = new eui.Label();
            }
            label.size = 30;
            label.alpha = 1;
            label.text = message[1];
            switch (message[0]) {
                case MessageType.Error:
                    label.textColor = 0xff0000;
                    break;
                default:
                    label.textColor = 0xffffff;
                    break;
            }
            return label;
        }
        _showMessage() {
            if (this._showMessageIndex >= this._messages.length) {
                this._showMessageIndex = 0;
                this._messages = [];
                return;
            }
            let message = this._messages[this._showMessageIndex++];
            let showItem = this._getMessageItem(message);
            //
            showItem.x = (editor.editorui.stage.stageWidth - showItem.width) / 2;
            showItem.y = (editor.editorui.stage.stageHeight - showItem.height) / 4;
            editor.editorui.messageLayer.addChild(showItem);
            //
            egret.Tween.get(showItem).to({ y: (editor.editorui.stage.stageHeight - showItem.height) / 8, alpha: 0 }, 1000, egret.Ease.sineIn).call(() => {
                editor.editorui.messageLayer.removeChild(showItem);
                this._messageLabelPool.push(showItem);
            });
        }
    }
    editor.Message = Message;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class ToolTip {
        constructor() {
            /**
             * 默认 提示界面
             */
            this.defaultTipview = () => editor.TipString;
            /**
             * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
             */
            this.tipviewmap = new Map();
            this.tipmap = new Map();
        }
        register(displayObject, tip) {
            if (!displayObject)
                return;
            this.tipmap.set(displayObject, tip);
            displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
        }
        unregister(displayObject) {
            if (!displayObject)
                return;
            this.tipmap.delete(displayObject);
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
        }
        onMouseOver(event) {
            this.removeTipview();
            var displayObject = event.currentTarget;
            var tip = this.tipmap.get(displayObject);
            var tipviewcls = this.tipviewmap.get(tip.constructor);
            if (!tipviewcls)
                tipviewcls = this.defaultTipview();
            this.tipView = new tipviewcls();
            editor.editorui.tooltipLayer.addChild(this.tipView);
            this.tipView.value = tip;
            this.tipView.x = feng3d.windowEventProxy.clientX;
            this.tipView.y = feng3d.windowEventProxy.clientY - this.tipView.height;
            //
            displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        }
        onMouseOut(event) {
            var displayObject = event.currentTarget;
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            this.removeTipview();
        }
        removeTipview() {
            if (this.tipView) {
                this.tipView.parent.removeChild(this.tipView);
                this.tipView = null;
            }
        }
    }
    editor.ToolTip = ToolTip;
    editor.toolTip = new ToolTip();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xff0000];
    /**
     */
    class ColorPickerView extends eui.Component {
        constructor() {
            super();
            //
            this.color = new feng3d.Color4(0.2, 0.5, 0);
            this.skinName = "ColorPickerView";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            var w = this.group1.width - 4;
            var h = this.group1.height - 4;
            this.image1.source = new feng3d.ImageUtil(w, h).drawMinMaxGradient(new feng3d.Gradient().fromColors(colors), false).toDataURL();
            this.updateView();
            //
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }
        $onRemoveFromStage() {
            //
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            //
            super.$onRemoveFromStage();
        }
        onMouseDown(e) {
            this._mouseDownGroup = e.currentTarget;
            this.onMouseMove();
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        }
        onMouseMove() {
            var image = this.image0;
            if (this._mouseDownGroup == this.group0)
                image = this.image0;
            else
                image = this.image1;
            var p = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var start = image.localToGlobal(0, 0);
            var end = image.localToGlobal(image.width, image.height);
            var rw = Math.clamp((p.x - start.x) / (end.x - start.x), 0, 1);
            var rh = Math.clamp((p.y - start.y) / (end.y - start.y), 0, 1);
            if (this.group0 == this._mouseDownGroup) {
                this.rw = rw;
                this.rh = rh;
                var color = getColorPickerRectAtPosition(this.basecolor.toInt(), rw, rh);
            }
            else if (this.group1 == this._mouseDownGroup) {
                this.ratio = rh;
                var basecolor = this.basecolor = getMixColorAtRatio(rh, colors);
                var color = getColorPickerRectAtPosition(basecolor.toInt(), this.rw, this.rh);
            }
            if (this.color instanceof feng3d.Color3) {
                this.color = color;
            }
            else {
                this.color = new feng3d.Color4(color.r, color.g, color.b, this.color.a);
            }
        }
        onMouseUp() {
            this._mouseDownGroup = null;
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        }
        ontxtfocusin(e) {
            this._textfocusintxt = e.currentTarget;
        }
        ontxtfocusout(e) {
            this._textfocusintxt = null;
            this.updateView();
        }
        onTextChange(e) {
            if (this._textfocusintxt == e.currentTarget) {
                var color = this.color.clone();
                switch (this._textfocusintxt) {
                    case this.txtR:
                        color.r = (Number(this.txtR.text) || 0) / 255;
                        break;
                    case this.txtG:
                        color.g = (Number(this.txtG.text) || 0) / 255;
                        break;
                    case this.txtB:
                        color.b = (Number(this.txtB.text) || 0) / 255;
                        break;
                    case this.txtA:
                        color.a = (Number(this.txtA.text) || 0) / 255;
                        break;
                    case this.txtColor:
                        color.fromUnit(Number("0x" + this.txtColor.text) || 0);
                        break;
                }
                this.color = color;
            }
        }
        onColorChanged(property, oldValue, newValue) {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            if (oldValue && newValue && !oldValue.equals(newValue)) {
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }
        updateView() {
            if (this._textfocusintxt != this.txtR)
                this.txtR.text = Math.round(this.color.r * 255).toString();
            if (this._textfocusintxt != this.txtG)
                this.txtG.text = Math.round(this.color.g * 255).toString();
            if (this._textfocusintxt != this.txtB)
                this.txtB.text = Math.round(this.color.b * 255).toString();
            if (this._textfocusintxt != this.txtA)
                this.txtA.text = Math.round(this.color.a * 255).toString();
            if (this._textfocusintxt != this.txtColor)
                this.txtColor.text = this.color.toHexString().substr(1);
            if (this._mouseDownGroup == null) {
                //
                var result = getColorPickerRectPosition(this.color.toInt());
                this.basecolor = result.color;
                this.rw = result.ratioW;
                this.rh = result.ratioH;
                this.ratio = getMixColorRatio(this.basecolor.toInt(), colors);
            }
            if (this._mouseDownGroup != this.group0) {
                //
                this.image0.source = new feng3d.ImageUtil(this.group0.width - 16, this.group0.height - 16).drawColorPickerRect(this.basecolor.toInt()).toDataURL();
            }
            this.pos1.y = this.ratio * (this.group1.height - this.pos1.height);
            //
            this.pos0.x = this.rw * (this.group0.width - this.pos0.width);
            this.pos0.y = this.rh * (this.group0.height - this.pos0.height);
            //
            if (this.color instanceof feng3d.Color3) {
                this._groupAParent = this._groupAParent || this.groupA.parent;
                this.groupA.parent && this.groupA.parent.removeChild(this.groupA);
            }
            else {
                if (this.groupA.parent == null && this._groupAParent) {
                    this._groupAParent.addChildAt(this.groupA, 3);
                }
            }
        }
    }
    __decorate([
        feng3d.watch("onColorChanged")
    ], ColorPickerView.prototype, "color", void 0);
    editor.ColorPickerView = ColorPickerView;
    /**
     * 获取颜色的基色以及颜色拾取矩形所在位置
     * @param color 查找颜色
     */
    function getColorPickerRectPosition(color) {
        var black = new feng3d.Color3(0, 0, 0);
        var white = new feng3d.Color3(1, 1, 1);
        var c = new feng3d.Color3().fromUnit(color);
        var max = Math.max(c.r, c.g, c.b);
        if (max != 0)
            c = black.mix(c, 1 / max);
        var min = Math.min(c.r, c.g, c.b);
        if (min != 1)
            c = white.mix(c, 1 / (1 - min));
        var ratioH = 1 - max;
        var ratioW = 1 - min;
        return {
            /**
             * 基色
             */
            color: c,
            /**
             * 横向位置
             */
            ratioW: ratioW,
            /**
             * 纵向位置
             */
            ratioH: ratioH
        };
    }
    function getMixColorRatio(color, colors, ratios) {
        if (!ratios) {
            ratios = [];
            for (let i = 0; i < colors.length; i++) {
                ratios[i] = i / (colors.length - 1);
            }
        }
        var colors1 = colors.map(v => new feng3d.Color3().fromUnit(v));
        var c = new feng3d.Color3().fromUnit(color);
        var r = c.r;
        var g = c.g;
        var b = c.b;
        for (var i = 0; i < colors1.length - 1; i++) {
            var c0 = colors1[i];
            var c1 = colors1[i + 1];
            //
            if (c.equals(c0))
                return ratios[i];
            if (c.equals(c1))
                return ratios[i + 1];
            //
            var r1 = c0.r + c1.r;
            var g1 = c0.g + c1.g;
            var b1 = c0.b + c1.b;
            //
            var v = r * r1 + g * g1 + b * b1;
            if (v > 2) {
                var result = 0;
                if (r1 == 1) {
                    result = Math.mapLinear(r, c0.r, c1.r, ratios[i], ratios[i + 1]);
                }
                else if (g1 == 1) {
                    result = Math.mapLinear(g, c0.g, c1.g, ratios[i], ratios[i + 1]);
                }
                else if (b1 == 1) {
                    result = Math.mapLinear(b, c0.b, c1.b, ratios[i], ratios[i + 1]);
                }
                return result;
            }
        }
        return 0;
    }
    /**
     * 获取颜色的基色以及颜色拾取矩形所在位置
     * @param color 查找颜色
     */
    function getColorPickerRectAtPosition(color, rw, rh) {
        var leftTop = new feng3d.Color3(1, 1, 1);
        var rightTop = new feng3d.Color3().fromUnit(color);
        var leftBottom = new feng3d.Color3(0, 0, 0);
        var rightBottom = new feng3d.Color3(0, 0, 0);
        var top = leftTop.mixTo(rightTop, rw);
        var bottom = leftBottom.mixTo(rightBottom, rw);
        var v = top.mixTo(bottom, rh);
        return v;
    }
    function getMixColorAtRatio(ratio, colors, ratios) {
        if (!ratios) {
            ratios = [];
            for (let i = 0; i < colors.length; i++) {
                ratios[i] = i / (colors.length - 1);
            }
        }
        var colors1 = colors.map(v => new feng3d.Color3().fromUnit(v));
        for (var i = 0; i < colors1.length - 1; i++) {
            if (ratios[i] <= ratio && ratio <= ratios[i + 1]) {
                var mix = Math.mapLinear(ratio, ratios[i], ratios[i + 1], 0, 1);
                var c = colors1[i].mixTo(colors1[i + 1], mix);
                return c;
            }
        }
        return colors1[0];
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 区域选择框
     */
    class AreaSelectRect extends eui.Rect {
        constructor() {
            super(...arguments);
            this.fillAlpha = 0.5;
            this.fillColor = 0x8888ff;
        }
        /**
         * 显示
         * @param start 起始位置
         * @param end 结束位置
         */
        show(start, end) {
            var minX = Math.min(start.x, end.x);
            var maxX = Math.max(start.x, end.x);
            var minY = Math.min(start.y, end.y);
            var maxY = Math.max(start.y, end.y);
            this.x = minX;
            this.y = minY;
            this.width = maxX - minX;
            this.height = maxY - minY;
            editor.editorui.popupLayer.addChild(this);
        }
        /**
         * 隐藏
         */
        hide() {
            this.parent && this.parent.removeChild(this);
        }
    }
    editor.AreaSelectRect = AreaSelectRect;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 最大最小曲线界面
     */
    class MinMaxCurveView extends eui.Component {
        constructor() {
            super();
            this.minMaxCurve = new feng3d.MinMaxCurve();
            this.skinName = "MinMaxCurveView";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.updateView();
        }
        $onRemoveFromStage() {
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            super.$onRemoveFromStage();
        }
        updateView() {
            this.constantGroup.visible = false;
            this.curveGroup.visible = false;
            this.randomBetweenTwoConstantsGroup.visible = false;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant) {
                this.constantGroup.visible = true;
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.constantTextInput, editable: true,
                    controller: this.constantTextInput,
                }));
            }
            else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.TwoConstants) {
                this.randomBetweenTwoConstantsGroup.visible = true;
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constantMin", textInput: this.minValueTextInput, editable: true,
                    controller: this.minValueTextInput,
                }));
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constantMax", textInput: this.maxValueTextInput, editable: true,
                    controller: this.maxValueTextInput,
                }));
            }
            else {
                this.curveGroup.visible = true;
                var imageUtil = new feng3d.ImageUtil(this.curveGroup.width - 2, this.curveGroup.height - 2, feng3d.Color4.fromUnit(0xff565656));
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                    imageUtil.drawCurve(this.minMaxCurve.curve, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.TwoCurves) {
                    imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curveMax, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                this.curveImage.source = imageUtil.toDataURL();
            }
        }
        onReSize() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        _onMinMaxCurveChanged() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        onClick(e) {
            switch (e.currentTarget) {
                case this.modeBtn:
                    editor.menu.popupEnum(feng3d.MinMaxCurveMode, this.minMaxCurve.mode, (v) => {
                        this.minMaxCurve.mode = v;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    });
                    break;
                case this.curveGroup:
                    editor.minMaxCurveEditor = editor.minMaxCurveEditor || new editor.MinMaxCurveEditor();
                    editor.minMaxCurveEditor.minMaxCurve = this.minMaxCurve;
                    var pos = this.localToGlobal(0, 0);
                    pos.x = pos.x - 318;
                    editor.minMaxCurveEditor.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    //
                    editor.popupview.popupView(editor.minMaxCurveEditor, {
                        x: pos.x, y: pos.y, closecallback: () => {
                            editor.minMaxCurveEditor.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                        }
                    });
                    break;
            }
        }
        onPickerViewChanged() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        _onRightClick() {
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant || this.minMaxCurve.mode == feng3d.MinMaxCurveMode.TwoConstants)
                return;
            var menus = [{
                    label: "Copy", click: () => {
                        copyCurve = feng3d.serialization.clone(this.minMaxCurve);
                    }
                }];
            if (copyCurve && this.minMaxCurve.mode == copyCurve.mode && copyCurve.between0And1 == this.minMaxCurve.between0And1) {
                menus.push({
                    label: "Paste", click: () => {
                        if (copyCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                            this.minMaxCurve.curve = feng3d.serialization.clone(copyCurve.curve);
                        }
                        else if (copyCurve.mode == feng3d.MinMaxCurveMode.TwoCurves) {
                            this.minMaxCurve.curveMin = feng3d.serialization.clone(copyCurve.curveMin);
                            this.minMaxCurve.curveMax = feng3d.serialization.clone(copyCurve.curveMax);
                        }
                        this.minMaxCurve.curveMultiplier = copyCurve.curveMultiplier;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            editor.menu.popup(menus);
        }
    }
    __decorate([
        feng3d.watch("_onMinMaxCurveChanged")
    ], MinMaxCurveView.prototype, "minMaxCurve", void 0);
    editor.MinMaxCurveView = MinMaxCurveView;
    var copyCurve;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class MinMaxCurveEditor extends eui.Component {
        constructor() {
            super();
            this.minMaxCurve = new feng3d.MinMaxCurve();
            this.editing = false;
            this.mousedownxy = { x: -1, y: -1 };
            this.curveColor = new feng3d.Color4(1, 0, 0);
            this.backColor = feng3d.Color4.fromUnit24(0x565656);
            this.fillTwoCurvesColor = new feng3d.Color4(1, 1, 1, 0.2);
            this.range = [1, -1];
            this.imageUtil = new feng3d.ImageUtil();
            /**
             * 点绘制尺寸
             */
            this.pointSize = 5;
            /**
             * 控制柄长度
             */
            this.controllerLength = 50;
            this.skinName = "MinMaxCurveEditor";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.yLabels = [this.y_0, this.y_1, this.y_2, this.y_3];
            this.xLabels = [this.x_0, this.x_1, this.x_2, this.x_3, this.x_4, this.x_5, this.x_6, this.x_7, this.x_8, this.x_9, this.x_10];
            this.sampleImages = [this.sample_0, this.sample_1, this.sample_2, this.sample_3, this.sample_4, this.sample_5, this.sample_6, this.sample_7];
            this.viewGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            editor.editorui.stage.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondblclick, this);
            this.sampleImages.forEach(v => v.addEventListener(egret.MouseEvent.CLICK, this.onSampleClick, this));
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.minMaxCurve, attribute: "curveMultiplier", textInput: this.multiplierInput, editable: true,
                controller: null,
            }));
            this.preWrapModeBtn.addEventListener(egret.MouseEvent.CLICK, this.onPreWrapModeBtn, this);
            this.postWrapModeBtn.addEventListener(egret.MouseEvent.CLICK, this.onPostWrapMode, this);
            feng3d.watcher.watch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);
            this.updateXYLabels();
            this.updateSampleImages();
            this.updateView();
        }
        $onRemoveFromStage() {
            this.sampleImages.forEach(v => v.removeEventListener(egret.MouseEvent.CLICK, this.onSampleClick, this));
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);
            this.viewGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            editor.editorui.stage.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondblclick, this);
            // feng3d.windowEventProxy.off("dblclick", this.ondblclick, this);
            this.preWrapModeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPreWrapModeBtn, this);
            this.postWrapModeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPostWrapMode, this);
            feng3d.watcher.unwatch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);
            super.$onRemoveFromStage();
        }
        updateView() {
            if (!this.stage)
                return;
            // 曲线绘制区域
            this.curveRect = new feng3d.Rectangle(this.curveGroup.x, this.curveGroup.y, this.curveGroup.width, this.curveGroup.height);
            this.canvasRect = new feng3d.Rectangle(0, 0, this.viewGroup.width, this.viewGroup.height);
            if (this.curveGroup.width < 10 || this.curveGroup.height < 10)
                return;
            this.imageUtil.init(this.canvasRect.width, this.canvasRect.height, this.backColor);
            this.drawGrid();
            this.timeline = this.minMaxCurve.curve;
            this.timeline1 = this.minMaxCurve.curveMax;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                this.imageUtil.drawCurve(this.timeline, this.minMaxCurve.between0And1, this.curveColor, this.curveRect);
                this.drawCurveKeys(this.timeline);
            }
            else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.TwoCurves) {
                this.imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curveMax, this.minMaxCurve.between0And1, this.curveColor, this.fillTwoCurvesColor, this.curveRect);
                this.drawCurveKeys(this.timeline);
                this.drawCurveKeys(this.timeline1);
            }
            this.drawSelectedKey();
            this.updateWrapModeBtnPosition();
            // 设置绘制结果
            this.curveImage.source = this.imageUtil.toDataURL();
        }
        updateXYLabels() {
            this.yLabels[0].text = (this.minMaxCurve.curveMultiplier * Math.mapLinear(0, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[1].text = (this.minMaxCurve.curveMultiplier * Math.mapLinear(0.25, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[2].text = (this.minMaxCurve.curveMultiplier * Math.mapLinear(0.5, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[3].text = (this.minMaxCurve.curveMultiplier * Math.mapLinear(0.75, 1, 0, this.range[0], this.range[1])).toString();
            // for (let i = 0; i <= 10; i++)
            // {
            //     this.xLabels[i].text = (this.minMaxCurve.curveMultiplier * i / 10).toString();
            // }
        }
        updateSampleImages() {
            var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
            var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
            for (let i = 0; i < this.sampleImages.length; i++) {
                const element = this.sampleImages[i];
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve && curves[i]) {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1)
                        imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    var curve = feng3d.serialization.setValue(new feng3d.AnimationCurve(), curves[i]);
                    imageUtil.drawCurve(curve, this.minMaxCurve.between0And1, feng3d.Color4.WHITE);
                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.TwoCurves && doubleCurves[i]) {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1)
                        imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    var curveMin = feng3d.serialization.setValue(new feng3d.AnimationCurve(), doubleCurves[i].curve);
                    var curveMax = feng3d.serialization.setValue(new feng3d.AnimationCurve(), doubleCurves[i].curveMax);
                    imageUtil.drawBetweenTwoCurves(curveMin, curveMax, this.minMaxCurve.between0And1, feng3d.Color4.WHITE);
                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else {
                    element.parent && element.parent.removeChild(element);
                }
            }
        }
        onSampleClick(e) {
            for (let i = 0; i < this.sampleImages.length; i++) {
                const element = this.sampleImages[i];
                if (element == e.currentTarget) {
                    var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
                    var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
                    if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                        this.minMaxCurve.curve = feng3d.serialization.setValue(new feng3d.AnimationCurve(), curves[i]);
                    }
                    else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.TwoCurves) {
                        this.minMaxCurve.curve = feng3d.serialization.setValue(new feng3d.AnimationCurve(), doubleCurves[i].curve);
                        this.minMaxCurve.curveMax = feng3d.serialization.setValue(new feng3d.AnimationCurve(), doubleCurves[i].curveMax);
                    }
                    this.selectedKey = null;
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    break;
                }
            }
        }
        /**
         * 绘制曲线关键点
         * @param animationCurve
         */
        drawCurveKeys(animationCurve) {
            var c = new feng3d.Color4(1, 0, 0);
            animationCurve.keys.forEach(key => {
                var pos = this.curveToUIPos(key.time, key.value);
                this.imageUtil.drawPoint(pos.x, pos.y, c, this.pointSize);
            });
        }
        /**
         * 曲线上的坐标转换为UI上的坐标
         * @param time
         * @param value
         */
        curveToUIPos(time, value) {
            var x = Math.mapLinear(time, 0, 1, this.curveRect.left, this.curveRect.right);
            var y = Math.mapLinear(value, this.range[0], this.range[1], this.curveRect.top, this.curveRect.bottom);
            return new feng3d.Vector2(x, y);
        }
        /**
         * UI上坐标转换为曲线上坐标
         * @param x
         * @param y
         */
        uiToCurvePos(x, y) {
            var time = Math.mapLinear(x, this.curveRect.left, this.curveRect.right, 0, 1);
            var value = Math.mapLinear(y, this.curveRect.top, this.curveRect.bottom, this.range[0], this.range[1]);
            return { time: time, value: value };
        }
        getKeyUIPos(key) {
            return this.curveToUIPos(key.time, key.value);
        }
        getKeyLeftControlUIPos(key) {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.inTangent * this.curveRect.height / this.curveRect.width;
            var lcp = new feng3d.Vector2(current.x - this.controllerLength * Math.cos(Math.atan(currenttan)), current.y + this.controllerLength * Math.sin(Math.atan(currenttan)));
            return lcp;
        }
        getKeyRightControlUIPos(key) {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.outTangent * this.curveRect.height / this.curveRect.width;
            var rcp = new feng3d.Vector2(current.x + this.controllerLength * Math.cos(Math.atan(currenttan)), current.y - this.controllerLength * Math.sin(Math.atan(currenttan)));
            return rcp;
        }
        /**
         * 绘制选中的关键点
         */
        drawSelectedKey() {
            if (this.selectedKey == null || this.selectTimeline == null)
                return;
            var key = this.selectedKey;
            //
            var i = this.selectTimeline.keys.indexOf(key);
            if (i == -1)
                return;
            var n = this.selectTimeline.keys.length;
            var c = new feng3d.Color4();
            var current = this.getKeyUIPos(key);
            this.imageUtil.drawPoint(current.x, current.y, c, this.pointSize);
            if (this.selectedKey == key) {
                // 绘制控制点
                if (i > 0) {
                    var lcp = this.getKeyLeftControlUIPos(key);
                    this.imageUtil.drawPoint(lcp.x, lcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, lcp, new feng3d.Color4());
                }
                if (i < n - 1) {
                    var rcp = this.getKeyRightControlUIPos(key);
                    this.imageUtil.drawPoint(rcp.x, rcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, rcp, new feng3d.Color4());
                }
            }
        }
        /**
         * 更新曲线重复模式按钮位置
         */
        updateWrapModeBtnPosition() {
            var selectTimeline = this.selectTimeline;
            this.preWrapModeBtn.visible = false;
            this.postWrapModeBtn.visible = false;
            if (!selectTimeline)
                return;
            this.preWrapModeBtn.visible = true;
            this.postWrapModeBtn.visible = true;
            var firstKey = selectTimeline.keys[0];
            var prePos = this.curveToUIPos(firstKey.time, firstKey.value);
            this.preWrapModeBtn.x = prePos.x - this.preWrapModeBtn.width - 10;
            this.preWrapModeBtn.y = prePos.y;
            var lastKey = selectTimeline.keys[selectTimeline.keys.length - 1]; /*  */
            var postPos = this.curveToUIPos(lastKey.time, lastKey.value);
            this.postWrapModeBtn.x = postPos.x + 15;
            this.postWrapModeBtn.y = postPos.y;
            if (this.editKey) {
                var editKeyPos = this.curveToUIPos(this.editKey.time, this.editKey.value);
                this.keyPosLab.x = editKeyPos.x;
                this.keyPosLab.y = editKeyPos.y - this.keyPosLab.height - 5;
                this.keyPosLab.text = this.editKey.time.toFixed(3) + "," + this.editKey.value.toFixed(3);
            }
        }
        drawGrid(segmentW = 10, segmentH = 2) {
            //
            var lines = [];
            var c0 = feng3d.Color4.fromUnit24(0x494949);
            var c1 = feng3d.Color4.fromUnit24(0x4f4f4f);
            for (var i = 0; i <= segmentW; i++) {
                lines.push({ start: new feng3d.Vector2(i / segmentW, 0), end: new feng3d.Vector2(i / segmentW, 1), color: i % 2 == 0 ? c0 : c1 });
            }
            for (var i = 0; i <= segmentH; i++) {
                lines.push({ start: new feng3d.Vector2(0, i / segmentH), end: new feng3d.Vector2(1, i / segmentH), color: i % 2 == 0 ? c0 : c1 });
            }
            lines.forEach(v => {
                v.start.x = this.curveRect.x + this.curveRect.width * v.start.x;
                v.start.y = this.curveRect.y + this.curveRect.height * v.start.y;
                v.end.x = this.curveRect.x + this.curveRect.width * v.end.x;
                v.end.y = this.curveRect.y + this.curveRect.height * v.end.y;
                //
                this.imageUtil.drawLine(v.start, v.end, v.color);
            });
        }
        _onMinMaxCurveChanged() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.range = this.minMaxCurve.between0And1 ? [1, 0] : [1, -1];
        }
        _onReSize() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        onMouseDown(ev) {
            var lp = this.viewGroup.globalToLocal(ev.stageX, ev.stageY);
            var x = lp.x;
            var y = lp.y;
            this.mousedownxy.x = x;
            this.mousedownxy.y = y;
            var curvePos = this.uiToCurvePos(x, y);
            var timeline = this.timeline;
            this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (this.editKey == null && this.timeline1 != null) {
                timeline = this.timeline1;
                this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            }
            if (this.editKey != null) {
                this.selectedKey = this.editKey;
                this.selectTimeline = timeline;
            }
            else if (this.selectedKey) {
                this.editorControlkey = this.findControlKey(this.selectedKey, x, y, this.pointSize);
                if (this.editorControlkey == null) {
                    this.selectedKey = null;
                    this.selectTimeline = null;
                }
            }
            if (this.editKey != null || this.editorControlkey != null) {
                this.keyPosLab.visible = true;
                editor.editorui.stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
                editor.editorui.stage.addEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        onMouseMove(ev) {
            this.editing = true;
            var lp = this.viewGroup.globalToLocal(ev.stageX, ev.stageY);
            var x = lp.x;
            var y = lp.y;
            var curvePos = this.uiToCurvePos(x, y);
            if (this.editKey) {
                curvePos.time = Math.clamp(curvePos.time, 0, 1);
                curvePos.value = Math.clamp(curvePos.value, this.range[0], this.range[1]);
                //
                this.editKey.time = curvePos.time;
                this.editKey.value = curvePos.value;
                this.selectTimeline.sort();
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
            else if (this.editorControlkey) {
                var index = this.selectTimeline.indexOfKeys(this.editorControlkey);
                if (index == 0 && curvePos.time < this.editorControlkey.time) {
                    this.editorControlkey.inTangent = curvePos.value > this.editorControlkey.value ? Infinity : -Infinity;
                    return;
                }
                if (index == this.selectTimeline.numKeys - 1 && curvePos.time > this.editorControlkey.time) {
                    this.editorControlkey.outTangent = curvePos.value > this.editorControlkey.value ? -Infinity : Infinity;
                    return;
                }
                this.editorControlkey.inTangent = this.editorControlkey.outTangent = (curvePos.value - this.editorControlkey.value) / (curvePos.time - this.editorControlkey.time);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }
        onMouseUp(ev) {
            this.editing = false;
            this.editorControlkey = null;
            this.keyPosLab.visible = false;
            editor.editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            editor.editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
        }
        findControlKey(key, x, y, radius) {
            var lcp = this.getKeyLeftControlUIPos(key);
            if (Math.abs(lcp.x - x) < radius && Math.abs(lcp.y - y) < radius) {
                return key;
            }
            var rcp = this.getKeyRightControlUIPos(key);
            if (Math.abs(rcp.x - x) < radius && Math.abs(rcp.y - y) < radius) {
                return key;
            }
            return null;
        }
        ondblclick(ev) {
            this.editing = false;
            this.editKey = null;
            this.editorControlkey = null;
            var lp = this.viewGroup.globalToLocal(ev.stageX, ev.stageY);
            var x = lp.x;
            var y = lp.y;
            var curvePos = this.uiToCurvePos(x, y);
            var selectedKey = this.timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (selectedKey != null) {
                this.timeline.deleteKey(selectedKey);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null) {
                var selectedKey = this.timeline1.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (selectedKey != null) {
                    this.timeline1.deleteKey(selectedKey);
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
            // 没有选中关键与控制点时，检查是否点击到曲线
            var newKey = this.timeline.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (newKey) {
                this.selectedKey = newKey;
                this.selectTimeline = this.timeline;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null) {
                var newKey = this.timeline1.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (newKey) {
                    this.selectedKey = newKey;
                    this.selectTimeline = this.timeline1;
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
        }
        onPreWrapModeBtn(e) {
            e.stopPropagation();
            var selectTimeline = this.selectTimeline;
            if (!selectTimeline)
                return;
            editor.menu.popupEnum(feng3d.WrapMode, selectTimeline.preWrapMode, (v) => {
                selectTimeline.preWrapMode = v;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            });
        }
        onPostWrapMode(e) {
            e.stopPropagation();
            var selectTimeline = this.selectTimeline;
            if (!selectTimeline)
                return;
            editor.menu.popupEnum(feng3d.WrapMode, selectTimeline.postWrapMode, (v) => {
                selectTimeline.postWrapMode = v;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            });
        }
    }
    __decorate([
        feng3d.watch("_onMinMaxCurveChanged")
    ], MinMaxCurveEditor.prototype, "minMaxCurve", void 0);
    editor.MinMaxCurveEditor = MinMaxCurveEditor;
    var particleCurves = [
        { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
        { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
        { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
        { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
        { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
        { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    ];
    var particleCurvesSingend = [
        { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
        { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
        { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
        { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
        { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
        { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    ];
    var particleDoubleCurves = [{
            curveMin: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
    ];
    var particleDoubleCurvesSingend = [
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: -1, inTangent: 0, outTangent: 0 }, { time: 1, value: -1, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
        {
            curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
        },
    ];
})(editor || (editor = {}));
var editor;
(function (editor) {
    class MinMaxCurveVector3View extends eui.Component {
        constructor() {
            super();
            this.minMaxCurveVector3 = new feng3d.MinMaxCurveVector3();
            this.skinName = "MinMaxCurveVector3View";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.xMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.yMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.zMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
        }
        $onRemoveFromStage() {
            this.xMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.yMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.zMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            super.$onRemoveFromStage();
        }
        updateView() {
            if (!this.stage)
                return;
            this.xMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.xCurve;
            this.yMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.yCurve;
            this.zMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.zCurve;
        }
        _onMinMaxCurveVector3Changed() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        _onchanged() {
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    }
    __decorate([
        feng3d.watch("_onMinMaxCurveVector3Changed")
    ], MinMaxCurveVector3View.prototype, "minMaxCurveVector3", void 0);
    editor.MinMaxCurveVector3View = MinMaxCurveVector3View;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 最大最小颜色渐变界面
     */
    class MinMaxGradientView extends eui.Component {
        constructor() {
            super();
            //
            this.minMaxGradient = new feng3d.MinMaxGradient();
            this.skinName = "MinMaxGradientView";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.secondGroupParent = this.secondGroupParent || this.secondGroup.parent;
            this.colorGroup0.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.updateView();
        }
        $onRemoveFromStage() {
            this.colorGroup0.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            super.$onRemoveFromStage();
        }
        updateView() {
            //
            if (this.colorGroup0.width > 0 && this.colorGroup0.height > 0) {
                if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Color) {
                    var color = this.minMaxGradient.getValue(0);
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(color).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Gradient) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.TwoColors) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(this.minMaxGradient.colorMin).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawColorRect(this.minMaxGradient.colorMax).toDataURL();
                    //
                    if (!this.secondGroup.parent)
                        this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.TwoGradients) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradientMin).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawMinMaxGradient(this.minMaxGradient.gradientMax).toDataURL();
                    //
                    if (!this.secondGroup.parent)
                        this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomColor) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
            }
        }
        onReSize() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        _onMinMaxGradientChanged() {
            if (this.stage)
                this.updateView();
        }
        onClick(e) {
            var view = null;
            switch (e.currentTarget) {
                case this.colorGroup0:
                    this.activeColorGroup = this.colorGroup0;
                    switch (this.minMaxGradient.mode) {
                        case feng3d.MinMaxGradientMode.Color:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.Gradient:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.TwoColors:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.colorMin;
                            break;
                        case feng3d.MinMaxGradientMode.TwoGradients:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradientMin;
                            break;
                        case feng3d.MinMaxGradientMode.RandomColor:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                    }
                    break;
                case this.colorGroup1:
                    this.activeColorGroup = this.colorGroup1;
                    switch (this.minMaxGradient.mode) {
                        case feng3d.MinMaxGradientMode.TwoColors:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.colorMax;
                            break;
                        case feng3d.MinMaxGradientMode.TwoGradients:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradientMax;
                            break;
                    }
                    break;
                case this.modeBtn:
                    editor.menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, (v) => {
                        this.minMaxGradient.mode = v;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    });
                    break;
            }
            if (view) {
                var pos = this.localToGlobal(0, 0);
                pos.x = pos.x - 318;
                view.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                //
                editor.popupview.popupView(view, {
                    x: pos.x, y: pos.y, closecallback: () => {
                        view.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                        this.activeColorGroup = null;
                    },
                });
            }
        }
        onPickerViewChanged() {
            if (this.activeColorGroup == this.colorGroup0) {
                switch (this.minMaxGradient.mode) {
                    case feng3d.MinMaxGradientMode.Color:
                        this.minMaxGradient.color = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.Gradient:
                        this.minMaxGradient.gradient = editor.gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.TwoColors:
                        this.minMaxGradient.colorMin = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.TwoGradients:
                        this.minMaxGradient.gradientMin = editor.gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.RandomColor:
                        this.minMaxGradient.gradient = editor.gradientEditor.gradient;
                        break;
                }
            }
            else if (this.activeColorGroup == this.colorGroup1) {
                switch (this.minMaxGradient.mode) {
                    case feng3d.MinMaxGradientMode.TwoColors:
                        this.minMaxGradient.colorMax = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.TwoGradients:
                        this.minMaxGradient.gradientMax = editor.gradientEditor.gradient;
                        break;
                }
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        _onRightClick(e) {
            var mode = this.minMaxGradient.mode;
            var target = e.currentTarget;
            var menus = [{
                    label: "Copy", click: () => {
                        if (target == this.colorGroup0) {
                            if (mode == feng3d.MinMaxGradientMode.Color)
                                copyColor = this.minMaxGradient.color.clone();
                            else if (mode == feng3d.MinMaxGradientMode.TwoColors)
                                copyColor = this.minMaxGradient.colorMin.clone();
                            else if (mode == feng3d.MinMaxGradientMode.TwoGradients)
                                copyGradient = feng3d.serialization.clone(this.minMaxGradient.gradientMin);
                            else
                                copyGradient = feng3d.serialization.clone(this.minMaxGradient.gradient);
                        }
                        else if (target == this.colorGroup1) {
                            if (mode == feng3d.MinMaxGradientMode.TwoColors)
                                copyColor = this.minMaxGradient.colorMax.clone();
                            else
                                copyGradient = feng3d.serialization.clone(this.minMaxGradient.gradientMax);
                        }
                    }
                }];
            if ((copyGradient != null && (mode == feng3d.MinMaxGradientMode.Gradient || mode == feng3d.MinMaxGradientMode.TwoGradients || mode == feng3d.MinMaxGradientMode.RandomColor))
                || (copyColor != null && (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.TwoColors))) {
                menus.push({
                    label: "Paste", click: () => {
                        if (target == this.colorGroup0) {
                            if (mode == feng3d.MinMaxGradientMode.Color)
                                this.minMaxGradient.color.copy(copyColor);
                            else if (mode == feng3d.MinMaxGradientMode.TwoColors)
                                this.minMaxGradient.colorMin.copy(copyColor);
                            else if (mode == feng3d.MinMaxGradientMode.TwoGradients)
                                this.minMaxGradient.gradientMin = feng3d.serialization.clone(copyGradient);
                            else
                                this.minMaxGradient.gradient = feng3d.serialization.clone(copyGradient);
                        }
                        else if (target == this.colorGroup1) {
                            if (mode == feng3d.MinMaxGradientMode.TwoColors)
                                this.minMaxGradient.colorMax.copy(copyColor);
                            else
                                this.minMaxGradient.gradientMax = feng3d.serialization.clone(copyGradient);
                        }
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            editor.menu.popup(menus);
        }
    }
    __decorate([
        feng3d.watch("_onMinMaxGradientChanged")
    ], MinMaxGradientView.prototype, "minMaxGradient", void 0);
    editor.MinMaxGradientView = MinMaxGradientView;
    var copyGradient;
    var copyColor;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class GradientEditor extends eui.Component {
        constructor() {
            super();
            this.gradient = new feng3d.Gradient();
            this.skinName = "GradientEditor";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.updateView();
            this.alphaLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorPicker.addEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        }
        $onRemoveFromStage() {
            this.alphaLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.removeEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);
            super.$onRemoveFromStage();
        }
        updateView() {
            if (!this.stage)
                return;
            var list = [];
            for (const key in feng3d.GradientMode) {
                if (isNaN(Number(key)))
                    list.push({ label: key, value: feng3d.GradientMode[key] });
            }
            this.modeCB.dataProvider = list;
            this.modeCB.data = list.filter(v => v.value == this.gradient.mode)[0];
            //
            if (this.colorImage.width > 0 && this.colorImage.height > 0) {
                this.colorImage.source = new feng3d.ImageUtil(this.colorImage.width, this.colorImage.height).drawMinMaxGradient(this.gradient).toDataURL();
            }
            if (!this._alphaSprite) {
                this.alphaLineGroup.addChild(this._alphaSprite = new egret.Sprite());
            }
            this._alphaSprite.graphics.clear();
            if (!this._colorSprite) {
                this.colorLineGroup.addChild(this._colorSprite = new egret.Sprite());
            }
            this._colorSprite.graphics.clear();
            //
            var alphaKeys = this.gradient.alphaKeys;
            for (let i = 0, n = alphaKeys.length; i < n; i++) {
                const element = alphaKeys[i];
                this._drawAlphaGraphics(this._alphaSprite.graphics, element.time, element.alpha, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == alphaKeys[i]);
            }
            var colorKeys = this.gradient.colorKeys;
            for (let i = 0, n = colorKeys.length; i < n; i++) {
                const element = colorKeys[i];
                this._drawColorGraphics(this._colorSprite.graphics, element.time, element.color, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == colorKeys[i]);
            }
            //
            this._parentGroup = this._parentGroup || this.colorGroup.parent;
            //
            if (this._alphaNumberSliderTextInputBinder) {
                this._alphaNumberSliderTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._alphaNumberSliderTextInputBinder.dispose();
            }
            //
            if (this._loactionNumberTextInputBinder) {
                this._loactionNumberTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._loactionNumberTextInputBinder.dispose();
            }
            this.controllerGroup.visible = !!this._selectedValue;
            if (this._selectedValue) {
                if (this._selectedValue.color) {
                    this.alphaGroup.parent && this.alphaGroup.parent.removeChild(this.alphaGroup);
                    this.colorGroup.parent || this._parentGroup.addChildAt(this.colorGroup, 0);
                    //
                    this.colorPicker.value = this._selectedValue.color;
                }
                else {
                    this.colorGroup.parent && this.colorGroup.parent.removeChild(this.colorGroup);
                    this.alphaGroup.parent || this._parentGroup.addChildAt(this.alphaGroup, 0);
                    this._alphaNumberSliderTextInputBinder = new editor.NumberSliderTextInputBinder().init({
                        space: this._selectedValue, attribute: "alpha",
                        slider: this.alphaSlide,
                        textInput: this.alphaInput, controller: this.alphaLabel, minValue: 0, maxValue: 1,
                    });
                    this._alphaNumberSliderTextInputBinder.on("valueChanged", this._onAlphaChanged, this);
                }
                this._loactionNumberTextInputBinder = new editor.NumberTextInputBinder().init({
                    space: this._selectedValue, attribute: "time",
                    textInput: this.locationInput, controller: this.locationLabel, minValue: 0, maxValue: 1,
                });
                this._loactionNumberTextInputBinder.on("valueChanged", this._onLocationChanged, this);
            }
        }
        _drawAlphaGraphics(graphics, time, alpha, width, height, selected) {
            graphics.beginFill(0xffffff, alpha);
            graphics.lineStyle(1, selected ? 0x0091ff : 0x606060);
            graphics.moveTo(time * width, height);
            graphics.lineTo(time * width - 5, height - 10);
            graphics.lineTo(time * width - 5, height - 15);
            graphics.lineTo(time * width + 5, height - 15);
            graphics.lineTo(time * width + 5, height - 10);
            graphics.lineTo(time * width, height);
            graphics.endFill();
        }
        _drawColorGraphics(graphics, time, color, width, height, selected) {
            graphics.beginFill(color.toInt(), 1);
            graphics.lineStyle(1, selected ? 0x0091ff : 0x606060);
            graphics.moveTo(time * width, 0);
            graphics.lineTo(time * width - 5, 10);
            graphics.lineTo(time * width - 5, 15);
            graphics.lineTo(time * width + 5, 15);
            graphics.lineTo(time * width + 5, 10);
            graphics.lineTo(time * width, 0);
            graphics.endFill();
        }
        _onAlphaChanged() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        _onLocationChanged() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        _onReSize() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        _onModeCBChange() {
            this.gradient.mode = this.modeCB.data.value;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        _onColorPickerChange() {
            if (this._selectedValue && this._selectedValue.color) {
                this._selectedValue.color = new feng3d.Color3(this.colorPicker.value.r, this.colorPicker.value.g, this.colorPicker.value.b);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }
        _onGradientChanged() {
            this._selectedValue = this.gradient.colorKeys[0];
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        _onMouseDown(e) {
            this._onMouseDownLineGroup = e.currentTarget;
            var sp = e.currentTarget.localToGlobal(0, 0);
            var localPosX = feng3d.windowEventProxy.clientX - sp.x;
            var time = localPosX / e.currentTarget.width;
            var newAlphaKey = { time: time, alpha: this.gradient.getAlpha(time) };
            var newColorKey = { time: time, color: this.gradient.getColor(time) };
            switch (e.currentTarget) {
                case this.alphaLineGroup:
                    this._selectedValue = null;
                    var onClickIndex = -1;
                    var alphaKeys = this.gradient.alphaKeys;
                    for (let i = 0, n = alphaKeys.length; i < n; i++) {
                        const element = alphaKeys[i];
                        if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8) {
                            onClickIndex = i;
                            break;
                        }
                    }
                    if (onClickIndex != -1) {
                        this._selectedValue = alphaKeys[onClickIndex];
                    }
                    else if (alphaKeys.length < 8) {
                        this._selectedValue = newAlphaKey;
                        alphaKeys.push(newAlphaKey);
                        alphaKeys.sort((a, b) => a.time - b.time);
                    }
                    break;
                case this.colorLineGroup:
                    var onClickIndex = -1;
                    var colorKeys = this.gradient.colorKeys;
                    for (let i = 0, n = colorKeys.length; i < n; i++) {
                        const element = colorKeys[i];
                        if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8) {
                            onClickIndex = i;
                            break;
                        }
                    }
                    if (onClickIndex != -1) {
                        this._selectedValue = colorKeys[onClickIndex];
                    }
                    else if (colorKeys.length < 8) {
                        this._selectedValue = newColorKey;
                        colorKeys.push(newColorKey);
                        colorKeys.sort((a, b) => a.time - b.time);
                    }
                    break;
            }
            if (this._selectedValue) {
                //
                this.updateView();
                feng3d.windowEventProxy.on("mousemove", this._onAlphaColorMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this._onAlphaColorMouseUp, this);
                this._removedTemp = false;
            }
        }
        _onAlphaColorMouseMove() {
            if (!this._selectedValue)
                return;
            var sp = this._onMouseDownLineGroup.localToGlobal(0, 0);
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rect = new feng3d.Rectangle(sp.x, sp.y, this._onMouseDownLineGroup.width, this._onMouseDownLineGroup.height);
            rect.inflate(8, 8);
            if (rect.containsPoint(mousePos)) {
                if (this._removedTemp) {
                    if (this._selectedValue.color) {
                        var index = this.gradient.colorKeys.indexOf(this._selectedValue);
                        if (index == -1)
                            this.gradient.colorKeys.push(this._selectedValue);
                        this.gradient.colorKeys.sort((a, b) => a.time - b.time);
                        ;
                    }
                    else {
                        var index = this.gradient.alphaKeys.indexOf(this._selectedValue);
                        if (index == -1)
                            this.gradient.alphaKeys.push(this._selectedValue);
                        this.gradient.alphaKeys.sort((a, b) => a.time - b.time);
                        ;
                    }
                    this._removedTemp = false;
                }
            }
            else {
                if (!this._removedTemp) {
                    if (this._selectedValue.color) {
                        var index = this.gradient.colorKeys.indexOf(this._selectedValue);
                        if (index != -1)
                            this.gradient.colorKeys.splice(index, 1);
                        this.gradient.colorKeys.sort((a, b) => a.time - b.time);
                        ;
                    }
                    else {
                        var index = this.gradient.alphaKeys.indexOf(this._selectedValue);
                        if (index != -1)
                            this.gradient.alphaKeys.splice(index, 1);
                        this.gradient.alphaKeys.sort((a, b) => a.time - b.time);
                        ;
                    }
                    this._removedTemp = true;
                }
            }
            if (this._selectedValue.color) {
                var sp = this.colorLineGroup.localToGlobal(0, 0);
                var localPosX = feng3d.windowEventProxy.clientX - sp.x;
                this._selectedValue.time = localPosX / this.colorLineGroup.width;
                this.gradient.colorKeys.sort((a, b) => a.time - b.time);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
            else {
                var sp = this.alphaLineGroup.localToGlobal(0, 0);
                var localPosX = feng3d.windowEventProxy.clientX - sp.x;
                this._selectedValue.time = localPosX / this.alphaLineGroup.width;
                this.gradient.alphaKeys.sort((a, b) => a.time - b.time);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        _onAlphaColorMouseUp() {
            if (this._removedTemp) {
                this._selectedValue = null;
            }
            this._onMouseDownLineGroup = null;
            feng3d.windowEventProxy.off("mousemove", this._onAlphaColorMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this._onAlphaColorMouseUp, this);
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }
    __decorate([
        feng3d.watch("_onGradientChanged")
    ], GradientEditor.prototype, "gradient", void 0);
    editor.GradientEditor = GradientEditor;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * String 提示框
     */
    class TipString extends eui.Component {
        constructor() {
            super();
            this.value = "";
            this.skinName = "TipString";
            this.touchChildren = this.touchEnabled = false;
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.txtLab.text = String(this.value);
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
        }
        valuechanged() {
            if (this.txtLab) {
                this.txtLab.text = String(this.value);
            }
        }
    }
    __decorate([
        feng3d.watch("valuechanged")
    ], TipString.prototype, "value", void 0);
    editor.TipString = TipString;
})(editor || (editor = {}));
var eui;
(function (eui) {
    eui.Component.prototype["addBinder"] = function (...binders) {
        this._binders = this._binders || [];
        binders.forEach(v => {
            this._binders.push(v);
        });
    };
    var old$onRemoveFromStage = eui.Component.prototype.$onRemoveFromStage;
    eui.Component.prototype["$onRemoveFromStage"] = function () {
        if (this._binders) {
            this._binders.forEach(v => v.dispose());
            this._binders.length = 0;
        }
        old$onRemoveFromStage.call(this);
    };
})(eui || (eui = {}));
var editor;
(function (editor) {
    class TextInputBinder extends feng3d.EventDispatcher {
        constructor() {
            super(...arguments);
            /**
             * 是否可编辑
             */
            this.editable = true;
        }
        /**
         * 绑定属性值转换为文本
         */
        toText(v) {
            return v;
        }
        /**
         * 文本转换为绑定属性值
         */
        toValue(v) {
            return v;
        }
        init(v) {
            Object.assign(this, v);
            //
            this.initView();
            this.invalidateView();
            //
            return this;
        }
        dispose() {
            feng3d.watcher.unwatch(this.space, this.attribute, this.onValueChanged, this);
            //
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.textInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        initView() {
            //
            if (this.editable) {
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.textInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            feng3d.watcher.watch(this.space, this.attribute, this.onValueChanged, this);
            this.textInput.enabled = this.editable;
        }
        onValueChanged() {
            var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
            objectViewEvent.space = this.space;
            objectViewEvent.attributeName = this.attribute;
            objectViewEvent.attributeValue = this.space[this.attribute];
            this.textInput.dispatchEvent(objectViewEvent);
            this.dispatch("valueChanged");
            this.invalidateView();
        }
        updateView() {
            if (!this._textfocusintxt) {
                this.textInput.text = this.toText(this.space[this.attribute]);
            }
        }
        onTextChange() {
            this.space[this.attribute] = this.toValue(this.textInput.text);
        }
        ontxtfocusin() {
            this._textfocusintxt = true;
        }
        ontxtfocusout() {
            this._textfocusintxt = false;
            this.invalidateView();
        }
        invalidateView() {
            feng3d.ticker.nextframe(this.updateView, this);
        }
    }
    editor.TextInputBinder = TextInputBinder;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class NumberTextInputBinder extends editor.TextInputBinder {
        constructor() {
            super(...arguments);
            /**
             * 步长，精度
             */
            this.step = 0.001;
            /**
             * 按下上下方向键时增加的步长数量
             */
            this.stepDownup = 10;
            /**
             * 移动一个像素时增加的步长数量
             */
            this.stepScale = 1;
            /**
             * 最小值
             */
            this.minValue = NaN;
            /**
             * 最小值
             */
            this.maxValue = NaN;
            this.mouseDownPosition = new feng3d.Vector2();
            this.mouseDownValue = 0;
        }
        toText(v) {
            // 消除数字显示为类似 0.0000000001 的问题
            var fractionDigits = 1;
            while (fractionDigits * this.step < 1) {
                fractionDigits *= 10;
            }
            var text = String(Math.round(fractionDigits * (Math.round(v / this.step) * this.step)) / fractionDigits);
            return text;
        }
        toValue(v) {
            var n = Number(v) || 0;
            var fractionDigits = 1;
            while (fractionDigits * this.step < 1) {
                fractionDigits *= 10;
            }
            n = Math.round(fractionDigits * (Math.round(n / this.step) * this.step)) / fractionDigits;
            return n;
        }
        initView() {
            super.initView();
            if (this.editable) {
                // feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
                this.controller && this.controller.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
                editor.MouseOnDisableScroll.register(this.controller);
            }
        }
        dispose() {
            super.dispose();
            // feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            this.controller && this.controller.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            editor.MouseOnDisableScroll.unRegister(this.controller);
        }
        onValueChanged() {
            var value = this.space[this.attribute];
            if (!isNaN(this.minValue)) {
                value = Math.max(this.minValue, value);
            }
            if (!isNaN(this.maxValue)) {
                value = Math.min(this.maxValue, value);
            }
            this.space[this.attribute] = value;
            super.onValueChanged();
        }
        onMouseDown(e) {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            //
            this.mouseDownPosition = mousePos;
            this.mouseDownValue = this.space[this.attribute];
            //
            feng3d.windowEventProxy.on("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        }
        onStageMouseMove() {
            this.space[this.attribute] = this.mouseDownValue + ((feng3d.windowEventProxy.clientX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - feng3d.windowEventProxy.clientY)) * this.step * this.stepScale;
        }
        onStageMouseUp() {
            feng3d.windowEventProxy.off("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onStageMouseUp, this);
        }
        ontxtfocusin() {
            super.ontxtfocusin();
            feng3d.windowEventProxy.on("keydown", this.onWindowKeyDown, this);
        }
        ontxtfocusout() {
            super.ontxtfocusout();
            feng3d.windowEventProxy.off("keydown", this.onWindowKeyDown, this);
        }
        onWindowKeyDown(event) {
            if (event.key == "ArrowUp") {
                this.space[this.attribute] += this.step * this.stepDownup;
                this.textInput.text = this.toText.call(this, this.space[this.attribute]);
            }
            else if (event.key == "ArrowDown") {
                this.space[this.attribute] -= this.step * this.stepDownup;
                this.textInput.text = this.toText.call(this, this.space[this.attribute]);
            }
            this.invalidateView();
        }
    }
    editor.NumberTextInputBinder = NumberTextInputBinder;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class NumberSliderTextInputBinder extends editor.NumberTextInputBinder {
        initView() {
            super.initView();
            if (this.editable) {
                this.slider.addEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
            }
            this.slider.enabled = this.slider.touchEnabled = this.slider.touchChildren = this.editable;
        }
        dispose() {
            super.dispose();
            this.slider.removeEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
        }
        updateView() {
            super.updateView();
            this.slider.minimum = isNaN(this.minValue) ? Number.MIN_VALUE : this.minValue;
            this.slider.maximum = isNaN(this.maxValue) ? Number.MAX_VALUE : this.maxValue;
            this.slider.snapInterval = this.step;
            this.slider.value = this.space[this.attribute];
        }
        _onSliderChanged() {
            this.space[this.attribute] = this.slider.value;
        }
    }
    editor.NumberSliderTextInputBinder = NumberSliderTextInputBinder;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 给显示对象注册禁止 Scroll 滚动功能
     *
     * 当鼠标在指定对象上按下时禁止滚动，鼠标弹起后取消禁止滚动
     */
    class MouseOnDisableScroll {
        static register(sprite) {
            if (!sprite)
                return;
            sprite.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }
        static unRegister(sprite) {
            if (!sprite)
                return;
            sprite.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }
        static onMouseDown(e) {
            feng3d.shortcut.activityState("disableScroll");
            //
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        }
        static onStageMouseUp() {
            feng3d.windowEventProxy.off("mouseup", this.onStageMouseUp, this);
            feng3d.shortcut.deactivityState("disableScroll");
        }
    }
    editor.MouseOnDisableScroll = MouseOnDisableScroll;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class TerrainView extends eui.Component {
        constructor() {
            super();
            this.skinName = "TerrainView";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.updateView();
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
        }
        updateView() {
            if (!this.stage)
                return;
        }
    }
    editor.TerrainView = TerrainView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OVTerrain = class OVTerrain extends editor.TerrainView {
        constructor(objectViewInfo) {
            super();
            this._objectViewInfo = objectViewInfo;
            this.space = objectViewInfo.owner;
        }
        getAttributeView(attributeName) {
            return null;
        }
        getblockView(blockName) {
            return null;
        }
    };
    OVTerrain = __decorate([
        feng3d.OVComponent()
    ], OVTerrain);
    editor.OVTerrain = OVTerrain;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OVFolderAsset = class OVFolderAsset extends eui.Component {
        constructor(objectViewInfo) {
            super();
            this.skinName = "OVFolderAsset";
            this._objectViewInfo = objectViewInfo;
            this.space = objectViewInfo.owner;
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.openBtn.addEventListener(egret.MouseEvent.CLICK, this.onOpenBtnClick, this);
            this.updateView();
        }
        $onRemoveFromStage() {
            this.openBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOpenBtnClick, this);
            super.$onRemoveFromStage();
        }
        updateView() {
            if (!this.stage)
                return;
            this.nameLabel.name = this.space.fileName;
        }
        getAttributeView(attributeName) {
            return null;
        }
        getblockView(blockName) {
            return null;
        }
        onOpenBtnClick() {
            editor.editorAsset.showFloder = editor.editorAsset.getAssetByID(this.space.assetId);
        }
    };
    OVFolderAsset = __decorate([
        feng3d.OVComponent()
    ], OVFolderAsset);
    editor.OVFolderAsset = OVFolderAsset;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认基础对象界面
     */
    let OVBaseDefault = class OVBaseDefault extends eui.Component {
        constructor(objectViewInfo) {
            super();
            this._space = objectViewInfo.owner;
            this.skinName = "OVBaseDefault";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.updateView();
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            this.updateView();
        }
        getAttributeView(attributeName) {
            return null;
        }
        getblockView(blockName) {
            return null;
        }
        /**
         * 更新界面
         */
        updateView() {
            this.image.visible = false;
            this.label.visible = true;
            var value = this._space;
            if (typeof value == "string" && value.indexOf("data:") == 0) {
                this.image.visible = true;
                this.label.visible = false;
                this.image.source = value;
            }
            else {
                var string = String(value);
                if (string.length > 1000)
                    string = string.substr(0, 1000) + "\n.......";
                this.label.text = string;
            }
        }
    };
    OVBaseDefault = __decorate([
        feng3d.OVComponent()
    ], OVBaseDefault);
    editor.OVBaseDefault = OVBaseDefault;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认使用块的对象界面
     */
    let OVDefault = class OVDefault extends eui.Component {
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo) {
            super();
            this._objectViewInfo = objectViewInfo;
            this._space = objectViewInfo.owner;
            this.skinName = "OVDefault";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            //
            this.invalidateView();
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.dispose();
        }
        initview() {
            if (this.blockViews)
                return;
            this.blockViews = [];
            var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
            for (var i = 0; i < objectBlockInfos.length; i++) {
                var displayObject = feng3d.objectview.getBlockView(objectBlockInfos[i]);
                displayObject.percentWidth = 100;
                displayObject.objectView = this;
                this.group.addChild(displayObject);
                this.blockViews.push(displayObject);
            }
        }
        dispose() {
            if (!this.blockViews)
                return;
            for (var i = 0; i < this.blockViews.length; i++) {
                var displayObject = this.blockViews[i];
                displayObject.objectView = null;
                this.group.removeChild(displayObject);
            }
            this.blockViews = null;
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            this.dispose();
            this.invalidateView();
        }
        invalidateView() {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        /**
         * 更新界面
         */
        updateView() {
            if (!this.stage)
                return;
            this.initview();
            for (var i = 0; i < this.blockViews.length; i++) {
                this.blockViews[i].updateView();
            }
        }
        getblockView(blockName) {
            for (var i = 0; i < this.blockViews.length; i++) {
                if (this.blockViews[i].blockName == blockName) {
                    return this.blockViews[i];
                }
            }
            return null;
        }
        getAttributeView(attributeName) {
            for (var i = 0; i < this.blockViews.length; i++) {
                var attributeView = this.blockViews[i].getAttributeView(attributeName);
                if (attributeView != null) {
                    return attributeView;
                }
            }
            return null;
        }
    };
    OVDefault = __decorate([
        feng3d.OVComponent()
    ], OVDefault);
    editor.OVDefault = OVDefault;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OVTransform = class OVTransform extends eui.Component {
        constructor(objectViewInfo) {
            super();
            this._objectViewInfo = objectViewInfo;
            this._space = objectViewInfo.owner;
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "OVTransform";
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
            this.updateView();
        }
        onAddedToStage() {
            this._space.on("transformChanged", this.updateView, this);
            //
            this.updateView();
            ["x", "y", "z", "sx", "sy", "sz"].forEach(v => {
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.space, attribute: v, textInput: this[v + "TextInput"], editable: true,
                    controller: this[v + "Label"],
                }));
            });
            ["rx", "ry", "rz"].forEach(v => {
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.space, attribute: v, textInput: this[v + "TextInput"], editable: true,
                    controller: this[v + "Label"], step: 0.1,
                }));
            });
        }
        onRemovedFromStage() {
            this._space.off("transformChanged", this.updateView, this);
            //
        }
        get space() {
            return this._space;
        }
        set space(value) {
            if (this._space)
                this._space.off("transformChanged", this.updateView, this);
            this._space = value;
            if (this._space)
                this._space.on("transformChanged", this.updateView, this);
            this.updateView();
        }
        getAttributeView(attributeName) {
            return null;
        }
        getblockView(blockName) {
            return null;
        }
        /**
         * 更新界面
         */
        updateView() {
            var transfrom = this.space;
            if (!transfrom)
                return;
        }
    };
    OVTransform = __decorate([
        feng3d.OVComponent()
    ], OVTransform);
    editor.OVTransform = OVTransform;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性块界面
     */
    let OBVDefault = class OBVDefault extends eui.Component {
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo) {
            super();
            this._space = blockViewInfo.owner;
            this._blockName = blockViewInfo.name;
            this.itemList = blockViewInfo.itemList;
            this.skinName = "OBVDefault";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
            this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.dispose();
        }
        initView() {
            if (this._blockName != null && this._blockName.length > 0) {
                this.addChildAt(this.border, 0);
                this.group.addChildAt(this.titleGroup, 0);
            }
            else {
                this.removeChild(this.border);
                this.group.removeChild(this.titleGroup);
            }
            this.attributeViews = [];
            var objectAttributeInfos = this.itemList;
            for (var i = 0; i < objectAttributeInfos.length; i++) {
                var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
                displayObject.percentWidth = 100;
                displayObject.objectView = this.objectView;
                displayObject.objectBlockView = this;
                this.contentGroup.addChild(displayObject);
                this.attributeViews.push(displayObject);
            }
        }
        dispose() {
            for (var i = 0; i < this.attributeViews.length; i++) {
                var displayObject = this.attributeViews[i];
                displayObject.objectView = null;
                displayObject.objectBlockView = null;
                this.contentGroup.removeChild(displayObject);
            }
            this.attributeViews.length = 0;
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            for (var i = 0; i < this.attributeViews.length; i++) {
                this.attributeViews[i].space = this._space;
            }
        }
        get blockName() {
            return this._blockName;
        }
        updateView() {
            for (var i = 0; i < this.attributeViews.length; i++) {
                this.attributeViews[i].updateView();
            }
        }
        getAttributeView(attributeName) {
            for (var i = 0; i < this.attributeViews.length; i++) {
                if (this.attributeViews[i].attributeName == attributeName) {
                    return this.attributeViews[i];
                }
            }
            return null;
        }
        onTitleButtonClick() {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        }
    };
    OBVDefault = __decorate([
        feng3d.OBVComponent()
    ], OBVDefault);
    editor.OBVDefault = OBVDefault;
})(editor || (editor = {}));
var feng3d;
(function (feng3d) {
    class ObjectViewEvent extends egret.Event {
    }
    ObjectViewEvent.VALUE_CHANGE = "valuechange";
    feng3d.ObjectViewEvent = ObjectViewEvent;
})(feng3d || (feng3d = {}));
var editor;
(function (editor) {
    class OAVBase extends eui.Component {
        constructor(attributeViewInfo) {
            super();
            // 占用，避免出现label命名的组件
            this.label = "";
            this._space = attributeViewInfo.owner;
            this._attributeName = attributeViewInfo.name;
            this._attributeType = attributeViewInfo.type;
            this._attributeViewInfo = attributeViewInfo;
            if (!this._attributeViewInfo.editable)
                this.alpha = 0.8;
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            this.dispose();
            this.initView();
            this.updateView();
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            var componentParam = this._attributeViewInfo.componentParam;
            if (componentParam) {
                for (var key in componentParam) {
                    if (componentParam.hasOwnProperty(key)) {
                        this[key] = componentParam[key];
                    }
                }
            }
            if (this.labelLab) {
                if (this.label)
                    this.labelLab.text = this.label;
                else
                    this.labelLab.text = this._attributeName;
            }
            if (this._attributeViewInfo.tooltip)
                editor.toolTip.register(this.labelLab, this._attributeViewInfo.tooltip);
            this.initView();
            this.updateView();
        }
        $onRemoveFromStage() {
            editor.toolTip.unregister(this.labelLab);
            super.$onRemoveFromStage();
            this.dispose();
        }
        /**
         * 初始化
         */
        initView() {
        }
        /**
         * 销毁
         */
        dispose() {
        }
        /**
         * 更新
         */
        updateView() {
        }
        get attributeName() {
            return this._attributeName;
        }
        get attributeValue() {
            return this._space[this._attributeName];
        }
        set attributeValue(value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
                var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                objectViewEvent.space = this._space;
                objectViewEvent.attributeName = this._attributeName;
                objectViewEvent.attributeValue = this.attributeValue;
                this.dispatchEvent(objectViewEvent);
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }
    editor.OAVBase = OAVBase;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性界面
     */
    let OAVDefault = class OAVDefault extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVDefault";
        }
        set dragparam(param) {
            if (param) {
                //
                editor.drag.register(this, (dragsource) => {
                    if (param.datatype)
                        dragsource[param.datatype] = this.attributeValue;
                }, [param.accepttype], (dragSource) => {
                    this.attributeValue = dragSource[param.accepttype];
                });
            }
        }
        initView() {
            this.text.percentWidth = 100;
            this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            if (this._attributeViewInfo.editable)
                feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        }
        dispose() {
            editor.drag.unregister(this);
            if (this._attributeViewInfo.editable)
                feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
            this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        ontxtfocusin() {
            this._textfocusintxt = true;
        }
        ontxtfocusout() {
            this._textfocusintxt = false;
        }
        /**
         * 更新界面
         */
        updateView() {
            this.text.enabled = this._attributeViewInfo.editable;
            var value = this.attributeValue;
            if (value === undefined) {
                this.text.text = String(value);
            }
            else if (!(value instanceof Object)) {
                this.text.text = String(value);
            }
            else {
                var valuename = value["name"] || "";
                this.text.text = valuename + " (" + value.constructor.name + ")";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
                this.text.enabled = false;
            }
        }
        onDoubleClick() {
            editor.editorData.selectObject(this.attributeValue);
        }
        onTextChange() {
            if (this._textfocusintxt) {
                switch (this._attributeType) {
                    case "String":
                        this.attributeValue = this.text.text;
                        break;
                    case "number":
                        var num = Number(this.text.text);
                        num = isNaN(num) ? 0 : num;
                        this.attributeValue = num;
                        break;
                    case "Boolean":
                        this.attributeValue = Boolean(this.text.text);
                        break;
                    default:
                        console.error(`无法处理类型${this._attributeType}!`);
                }
            }
        }
    };
    OAVDefault = __decorate([
        feng3d.OAVComponent()
    ], OAVDefault);
    editor.OAVDefault = OAVDefault;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVBoolean = class OAVBoolean extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "BooleanAttrViewSkin";
        }
        initView() {
            if (this._attributeViewInfo.editable)
                this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
            this.checkBox.enabled = this._attributeViewInfo.editable;
        }
        dispose() {
            this.checkBox.removeEventListener(egret.Event.CHANGE, this.onChange, this);
        }
        updateView() {
            this.checkBox.selected = this.attributeValue;
        }
        onChange(event) {
            this.attributeValue = this.checkBox.selected;
        }
    };
    OAVBoolean = __decorate([
        feng3d.OAVComponent()
    ], OAVBoolean);
    editor.OAVBoolean = OAVBoolean;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性界面
     */
    let OAVNumber = class OAVNumber extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            /**
             * 步长，精度
             */
            this.step = 0.001;
            /**
             * 键盘上下方向键步长
             */
            this.stepDownup = 0.001;
            /**
             * 移动一个像素时增加的步长数量
             */
            this.stepScale = 1;
            /**
             * 最小值
             */
            this.minValue = NaN;
            /**
             * 最小值
             */
            this.maxValue = NaN;
            this.skinName = "OAVNumber";
        }
        initView() {
            super.initView();
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.space, attribute: this._attributeName, textInput: this.text, editable: this._attributeViewInfo.editable,
                controller: this.labelLab, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
        }
    };
    OAVNumber = __decorate([
        feng3d.OAVComponent()
    ], OAVNumber);
    editor.OAVNumber = OAVNumber;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVString = class OAVString extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVString";
        }
        initView() {
            this.addBinder(new editor.TextInputBinder().init({ space: this.space, attribute: this._attributeName, textInput: this.txtInput, editable: this._attributeViewInfo.editable, }));
        }
    };
    OAVString = __decorate([
        feng3d.OAVComponent()
    ], OAVString);
    editor.OAVString = OAVString;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性界面
     */
    let OAVMultiText = class OAVMultiText extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVMultiText";
        }
        initView() {
            if (this._attributeViewInfo.editable)
                feng3d.watcher.watch(this.space, this._attributeName, this.updateView, this);
        }
        dispose() {
            feng3d.watcher.unwatch(this.space, this._attributeName, this.updateView, this);
        }
        updateView() {
            this.txtLab.text = this.attributeValue;
        }
    };
    OAVMultiText = __decorate([
        feng3d.OAVComponent()
    ], OAVMultiText);
    editor.OAVMultiText = OAVMultiText;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * Vector2属性界面
     */
    let OAVVector2 = class OAVVector2 extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            /**
             * 步长，精度
             */
            this.step = 0.001;
            /**
             * 键盘上下方向键步长
             */
            this.stepDownup = 10;
            /**
             * 移动一个像素时增加的步长数量
             */
            this.stepScale = 1;
            /**
             * 最小值
             */
            this.minValue = NaN;
            /**
             * 最小值
             */
            this.maxValue = NaN;
            this.skinName = "OAVVector2";
        }
        initView() {
            super.initView();
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "x", textInput: this.xTextInput, editable: this._attributeViewInfo.editable,
                controller: this.xLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "y", textInput: this.yTextInput, editable: this._attributeViewInfo.editable,
                controller: this.yLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
        }
    };
    OAVVector2 = __decorate([
        feng3d.OAVComponent()
    ], OAVVector2);
    editor.OAVVector2 = OAVVector2;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * Vector3属性界面
     */
    let OAVVector3 = class OAVVector3 extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            /**
             * 步长，精度
             */
            this.step = 0.001;
            /**
             * 键盘上下方向键步长
             */
            this.stepDownup = 0.001;
            /**
             * 移动一个像素时增加的步长数量
             */
            this.stepScale = 1;
            /**
             * 最小值
             */
            this.minValue = NaN;
            /**
             * 最小值
             */
            this.maxValue = NaN;
            this.skinName = "OAVVector3";
        }
        initView() {
            super.initView();
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "x", textInput: this.xTextInput, editable: this._attributeViewInfo.editable,
                controller: this.xLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "y", textInput: this.yTextInput, editable: this._attributeViewInfo.editable,
                controller: this.yLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "z", textInput: this.zTextInput, editable: this._attributeViewInfo.editable,
                controller: this.zLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
        }
    };
    OAVVector3 = __decorate([
        feng3d.OAVComponent()
    ], OAVVector3);
    editor.OAVVector3 = OAVVector3;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * Vector4属性界面
     */
    let OAVVector4 = class OAVVector4 extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            /**
             * 步长，精度
             */
            this.step = 0.001;
            /**
             * 键盘上下方向键步长
             */
            this.stepDownup = 0.001;
            /**
             * 移动一个像素时增加的步长数量
             */
            this.stepScale = 1;
            /**
             * 最小值
             */
            this.minValue = NaN;
            /**
             * 最小值
             */
            this.maxValue = NaN;
            this.skinName = "OAVVector4";
        }
        initView() {
            super.initView();
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "x", textInput: this.xTextInput, editable: this._attributeViewInfo.editable,
                controller: this.xLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "y", textInput: this.yTextInput, editable: this._attributeViewInfo.editable,
                controller: this.yLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "z", textInput: this.zTextInput, editable: this._attributeViewInfo.editable,
                controller: this.zLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "w", textInput: this.wTextInput, editable: this._attributeViewInfo.editable,
                controller: this.wLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
            }));
        }
    };
    OAVVector4 = __decorate([
        feng3d.OAVComponent()
    ], OAVVector4);
    editor.OAVVector4 = OAVVector4;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVArray = class OAVArray extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVArray";
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            this.updateView();
        }
        get attributeName() {
            return this._attributeName;
        }
        get attributeValue() {
            return this._space[this._attributeName];
        }
        set attributeValue(value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
            }
            this.updateView();
        }
        initView() {
            this.attributeViews = [];
            var attributeValue = this.attributeValue;
            this.sizeTxt.text = this.attributeValue.length.toString();
            for (var i = 0; i < attributeValue.length; i++) {
                var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
                displayObject.percentWidth = 100;
                this.contentGroup.addChild(displayObject);
                this.attributeViews[i] = displayObject;
            }
            this.currentState = "hide";
            this.titleGroup.addEventListener(egret.MouseEvent.CLICK, this.onTitleGroupClick, this);
            this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
        }
        dispose() {
            this.titleGroup.removeEventListener(egret.MouseEvent.CLICK, this.onTitleGroupClick, this);
            this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
            this.attributeViews = [];
            for (var i = 0; i < this.attributeViews.length; i++) {
                var displayObject = this.attributeViews[i];
                this.contentGroup.removeChild(displayObject);
            }
            this.attributeViews = null;
        }
        onTitleGroupClick() {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        }
        onsizeTxtfocusout() {
            var size = parseInt(this.sizeTxt.text);
            var attributeValue = this.attributeValue;
            var attributeViews = this.attributeViews;
            if (size != attributeValue.length) {
                for (var i = 0; i < attributeViews.length; i++) {
                    if (attributeViews[i].parent) {
                        attributeViews[i].parent.removeChild(attributeViews[i]);
                    }
                }
                attributeValue.length = size;
                for (var i = 0; i < size; i++) {
                    if (attributeValue[i] == null && this._attributeViewInfo.componentParam)
                        attributeValue[i] = feng3d.lazy.getvalue(this._attributeViewInfo.componentParam.defaultItem);
                    if (attributeViews[i] == null) {
                        var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
                        attributeViews[i] = displayObject;
                        displayObject.percentWidth = 100;
                    }
                    this.contentGroup.addChild(attributeViews[i]);
                }
            }
        }
    };
    OAVArray = __decorate([
        feng3d.OAVComponent()
    ], OAVArray);
    editor.OAVArray = OAVArray;
    class OAVArrayItem extends editor.OAVDefault {
        constructor(arr, index, componentParam) {
            var attributeViewInfo = {
                name: index + "",
                editable: true,
                componentParam: componentParam,
                owner: arr,
                type: "number",
            };
            super(attributeViewInfo);
        }
        initView() {
            super.initView();
            this.labelLab.width = 60;
        }
    }
    editor.OAVArrayItem = OAVArrayItem;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVEnum = class OAVEnum extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVEnum";
        }
        set enumClass(obj) {
            this.list = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (isNaN(Number(key)))
                        this.list.push({ label: key, value: obj[key] });
                }
            }
        }
        initView() {
            if (this._attributeViewInfo.editable) {
                this.combobox.addEventListener(egret.Event.CHANGE, this.onComboxChange, this);
            }
            this.combobox.touchEnabled = this.combobox.touchChildren = this._attributeViewInfo.editable;
        }
        dispose() {
            this.combobox.removeEventListener(egret.Event.CHANGE, this.onComboxChange, this);
        }
        updateView() {
            this.combobox.dataProvider = this.list;
            if (this.list) {
                this.combobox.data = this.list.reduce((prevalue, item) => {
                    if (prevalue)
                        return prevalue;
                    if (item.value == this.attributeValue)
                        return item;
                    return null;
                }, null);
            }
        }
        onComboxChange() {
            this.attributeValue = this.combobox.data.value;
        }
    };
    OAVEnum = __decorate([
        feng3d.OAVComponent()
    ], OAVEnum);
    editor.OAVEnum = OAVEnum;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVImage = class OAVImage extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVImage";
            this.alpha = 1;
        }
        initView() {
            var texture = this.space;
            this.image.source = texture.dataURL;
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        }
        dispose() {
        }
        updateView() {
        }
        onResize() {
            this.image.width = this.width;
            this.image.height = this.width;
            this.height = this.width;
        }
    };
    OAVImage = __decorate([
        feng3d.OAVComponent()
    ], OAVImage);
    editor.OAVImage = OAVImage;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVCubeMap = class OAVCubeMap extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVCubeMap";
            this.alpha = 1;
        }
        initView() {
            this.images = [this.px, this.py, this.pz, this.nx, this.ny, this.nz];
            this.btns = [this.pxBtn, this.pyBtn, this.pzBtn, this.nxBtn, this.nyBtn, this.nzBtn];
            // var param: { accepttype: keyof DragData; datatype?: string; } = { accepttype: "image" };
            for (let i = 0; i < propertys.length; i++) {
                this.updateImage(i);
                // drag.register(image,
                // 	(dragsource) => { },
                // 	[param.accepttype],
                // 	(dragSource) =>
                // 	{
                // 		this.attributeValue = dragSource[param.accepttype];
                // 	});
                this.btns[i].addEventListener(egret.MouseEvent.CLICK, this.onImageClick, this);
                this.btns[i].enabled = this._attributeViewInfo.editable;
                // this.btns[i].touchChildren = this.btns[i].touchEnabled = this._attributeViewInfo.editable;
            }
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        }
        updateImage(i) {
            const image = this.images[i];
            var textureCube = this.space;
            textureCube.getTextureImage(feng3d.TextureCube.ImageNames[i], (img) => {
                if (img) {
                    image.source = feng3d.dataTransform.imageToDataURL(img);
                }
                else {
                    image.source = null;
                }
            });
        }
        onImageClick(e) {
            var index = this.btns.indexOf(e.currentTarget);
            if (index != -1) {
                var textureCube = this.space;
                var texture2ds = feng3d.rs.getLoadedAssetDatasByType(feng3d.Texture2D);
                var menus = [{
                        label: `None`, click: () => {
                            textureCube.setTexture2D(feng3d.TextureCube.ImageNames[index], null);
                            this.updateImage(index);
                            this.dispatchValueChange(index);
                        }
                    }];
                texture2ds.forEach(d => {
                    menus.push({
                        label: d.name, click: () => {
                            textureCube.setTexture2D(feng3d.TextureCube.ImageNames[index], d);
                            this.updateImage(index);
                            this.dispatchValueChange(index);
                        }
                    });
                });
                editor.menu.popup(menus);
            }
        }
        dispatchValueChange(index) {
            var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
            objectViewEvent.space = this._space;
            objectViewEvent.attributeName = propertys[index];
            this.dispatchEvent(objectViewEvent);
            //
            feng3d.objectevent.dispatch(this._space, "propertyValueChanged");
        }
        dispose() {
        }
        updateView() {
        }
        onResize() {
            var w4 = Math.round(this.width / 4);
            this.px.width = this.py.width = this.pz.width = this.nx.width = this.ny.width = this.nz.width = w4;
            this.px.height = this.py.height = this.pz.height = this.nx.height = this.ny.height = this.nz.height = w4;
            //
            this.pxGroup.width = this.pyGroup.width = this.pzGroup.width = this.nxGroup.width = this.nyGroup.width = this.nzGroup.width = w4;
            this.pxGroup.height = this.pyGroup.height = this.pzGroup.height = this.nxGroup.height = this.nyGroup.height = this.nzGroup.height = w4;
            //
            this.pxGroup.x = w4 * 2;
            this.pxGroup.y = w4;
            //
            this.pyGroup.x = w4;
            //
            this.pzGroup.x = w4;
            this.pzGroup.y = w4;
            //
            this.nxGroup.y = w4;
            //
            this.nyGroup.x = w4;
            this.nyGroup.y = w4 * 2;
            //
            this.nzGroup.x = w4 * 3;
            this.nzGroup.y = w4;
            //
            this.height = w4 * 3;
        }
    };
    OAVCubeMap = __decorate([
        feng3d.OAVComponent()
    ], OAVCubeMap);
    editor.OAVCubeMap = OAVCubeMap;
    var propertys = ["positive_x_url", "positive_y_url", "positive_z_url", "negative_x_url", "negative_y_url", "negative_z_url"];
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVComponentList = class OAVComponentList extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVComponentListSkin";
        }
        onAddComponentButtonClick() {
            editor.menu.popup(editor.menuConfig.getCreateComponentMenu(this.space));
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            this.dispose();
            this.initView();
        }
        get attributeName() {
            return this._attributeName;
        }
        get attributeValue() {
            return this._space[this._attributeName];
        }
        set attributeValue(value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
            }
            this.updateView();
        }
        initView() {
            this.group.layout.gap = -1;
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.addComponentView(components[i]);
            }
            this.space.on("addComponent", this.onAddCompont, this);
            this.space.on("removeComponent", this.onRemoveComponent, this);
            editor.drag.register(this.addComponentButton, null, ["file_script"], (dragdata) => {
                dragdata.getDragData("file_script").forEach(v => {
                    this.space.addScript(v.scriptName);
                });
            });
            this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        }
        dispose() {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
            this.space.off("addComponent", this.onAddCompont, this);
            this.space.off("removeComponent", this.onRemoveComponent, this);
            editor.drag.unregister(this.addComponentButton);
            this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        }
        addComponentView(component) {
            if (component.hideFlags & feng3d.HideFlags.HideInInspector)
                return;
            var displayObject = new editor.ComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        }
        /**
         * 更新界面
         */
        updateView() {
            for (var i = 0, n = this.group.numChildren; i < n; i++) {
                var child = this.group.getChildAt(i);
                if (child instanceof editor.ComponentView)
                    child.updateView();
            }
        }
        removedComponentView(component) {
            for (var i = this.group.numChildren - 1; i >= 0; i--) {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof editor.ComponentView && displayObject.component == component) {
                    this.group.removeChild(displayObject);
                }
            }
        }
        onAddCompont(event) {
            if (event.data.component.gameObject == this.space)
                this.addComponentView(event.data.component);
        }
        onRemoveComponent(event) {
            if (event.data.component.gameObject == this.space)
                this.removedComponentView(event.data.component);
        }
    };
    OAVComponentList = __decorate([
        feng3d.OAVComponent()
    ], OAVComponentList);
    editor.OAVComponentList = OAVComponentList;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVFunction = class OAVFunction extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVFunction";
        }
        initView() {
            this.button.addEventListener(egret.MouseEvent.CLICK, this.click, this);
        }
        dispose() {
            this.button.removeEventListener(egret.MouseEvent.CLICK, this.click, this);
        }
        updateView() {
        }
        click(event) {
            this._space[this._attributeName]();
        }
    };
    OAVFunction = __decorate([
        feng3d.OAVComponent()
    ], OAVFunction);
    editor.OAVFunction = OAVFunction;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVColorPicker = class OAVColorPicker extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVColorPicker";
        }
        initView() {
            if (this._attributeViewInfo.editable) {
                this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            this.colorPicker.touchEnabled = this.colorPicker.touchChildren = this.input.enabled = this._attributeViewInfo.editable;
        }
        dispose() {
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        updateView() {
            var color = this.attributeValue;
            this.colorPicker.value = color;
            this.input.text = color.toHexString();
        }
        onChange(event) {
            //
            this.attributeValue = this.colorPicker.value.clone();
            this.input.text = this.attributeValue.toHexString();
        }
        ontxtfocusin() {
            this._textfocusintxt = true;
        }
        ontxtfocusout() {
            this._textfocusintxt = false;
            this.input.text = this.attributeValue.toHexString();
        }
        onTextChange() {
            if (this._textfocusintxt) {
                var text = this.input.text;
                if (this.attributeValue instanceof feng3d.Color3) {
                    this.colorPicker.value = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                }
                else {
                    this.colorPicker.value = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                }
            }
        }
    };
    OAVColorPicker = __decorate([
        feng3d.OAVComponent()
    ], OAVColorPicker);
    editor.OAVColorPicker = OAVColorPicker;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVMaterialName = class OAVMaterialName extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OVMaterial";
        }
        initView() {
            this.shaderComboBox.addEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            feng3d.globalDispatcher.on("asset.shaderChanged", this.onShaderComboBoxChange, this);
            this.shaderComboBox.touchChildren = this.shaderComboBox.touchEnabled = this._attributeViewInfo.editable;
        }
        dispose() {
            this.shaderComboBox.removeEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            feng3d.globalDispatcher.off("asset.shaderChanged", this.onShaderComboBoxChange, this);
        }
        updateView() {
            var material = this.space;
            this.nameLabel.text = material.shaderName;
            var data = feng3d.shaderlib.getShaderNames().sort().map((v) => { return { label: v, value: v }; });
            var selected = data.reduce((prevalue, item) => {
                if (prevalue)
                    return prevalue;
                if (item.value == material.shaderName)
                    return item;
                return null;
            }, null);
            this.shaderComboBox.dataProvider = data;
            this.shaderComboBox.data = selected;
        }
        onShaderComboBoxChange() {
            this.attributeValue = this.shaderComboBox.data.value;
            this.objectView.space = this.space;
        }
    };
    OAVMaterialName = __decorate([
        feng3d.OAVComponent()
    ], OAVMaterialName);
    editor.OAVMaterialName = OAVMaterialName;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVObjectView = class OAVObjectView extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OVDefault";
            this.alpha = 1;
        }
        initView() {
            var arr = [];
            if (Array.isArray(this.attributeValue))
                arr = this.attributeValue;
            else
                arr.push(this.attributeValue);
            this.views = [];
            arr.forEach(element => {
                var editable = true;
                if (element instanceof feng3d.Feng3dObject)
                    editable = editable && !Boolean(element.hideFlags & feng3d.HideFlags.NotEditable);
                var view = feng3d.objectview.getObjectView(element, { editable: editable });
                view.percentWidth = 100;
                this.group.addChild(view);
                this.views.push(view);
                if (element instanceof feng3d.EventDispatcher) {
                    element.on("refreshView", this.onRefreshView, this);
                }
            });
        }
        updateView() {
        }
        /**
         * 销毁
         */
        dispose() {
            this.views.forEach(element => {
                this.group.removeChild(element);
                if (element.space instanceof feng3d.EventDispatcher) {
                    element.space.on("refreshView", this.onRefreshView, this);
                }
            });
            this.views.length = 0;
        }
        onRefreshView(event) {
            this.dispose();
            this.initView();
        }
    };
    OAVObjectView = __decorate([
        feng3d.OAVComponent()
    ], OAVObjectView);
    editor.OAVObjectView = OAVObjectView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVAccordionObjectView = class OAVAccordionObjectView extends editor.OAVBase {
        /**
         * 对象界面数据
         */
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "ParticleComponentView";
        }
        /**
         * 更新界面
         */
        updateView() {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        }
        initView() {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.attributeValue).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.attributeValue, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.watch(this.attributeValue, "enabled", this.updateEnableCB, this);
            this.updateView();
        }
        dispose() {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.unwatch(this.attributeValue, "enabled", this.updateEnableCB, this);
        }
        updateEnableCB() {
            this.enabledCB.selected = this.attributeValue.enabled;
        }
        onEnableCBChange() {
            this.attributeValue.enabled = this.enabledCB.selected;
        }
    };
    OAVAccordionObjectView = __decorate([
        feng3d.OAVComponent()
    ], OAVAccordionObjectView);
    editor.OAVAccordionObjectView = OAVAccordionObjectView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVGameObjectName = class OAVGameObjectName extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVGameObjectName";
        }
        initView() {
            this.visibleCB.addEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.addEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        dispose() {
            this.visibleCB.removeEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.removeEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        updateView() {
            this.visibleCB.selected = this.space.visible;
            this.mouseEnabledCB.selected = this.space.mouseEnabled;
            this.nameInput.text = this.space.name;
        }
        onVisibleCBClick() {
            this.space.visible = !this.space.visible;
        }
        onMouseEnabledCBClick() {
            this.space.mouseEnabled = !this.space.mouseEnabled;
        }
        ontxtfocusin() {
            this._textfocusintxt = true;
        }
        ontxtfocusout() {
            this._textfocusintxt = false;
        }
        onTextChange() {
            if (this._textfocusintxt) {
                this.space.name = this.nameInput.text;
            }
        }
    };
    OAVGameObjectName = __decorate([
        feng3d.OAVComponent()
    ], OAVGameObjectName);
    editor.OAVGameObjectName = OAVGameObjectName;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 挑选（拾取）OAV界面
     */
    let OAVPick = class OAVPick extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVPick";
        }
        initView() {
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            if (this._attributeViewInfo.editable) {
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);
                var param = this._attributeViewInfo.componentParam;
                editor.drag.register(this, (dragsource) => {
                    if (param.datatype)
                        dragsource.addDragData(param.datatype, this.attributeValue);
                }, [param.accepttype], (dragSource) => {
                    this.attributeValue = dragSource.getDragData(param.accepttype)[0];
                });
            }
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        }
        dispose() {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);
            editor.drag.unregister(this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }
        onPickBtnClick() {
            var param = this._attributeViewInfo.componentParam;
            if (param.accepttype) {
                if (param.accepttype == "texture2d") {
                    var menus = [];
                    var texture2ds = editor.editorRS.getLoadedAssetDatasByType(feng3d.Texture2D);
                    texture2ds.forEach(item => {
                        menus.push({
                            label: item.name, click: () => {
                                this.attributeValue = item;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "texturecube") {
                    var menus = [];
                    var textureCubes = editor.editorRS.getLoadedAssetDatasByType(feng3d.TextureCube);
                    textureCubes.forEach(item => {
                        menus.push({
                            label: item.name, click: () => {
                                this.attributeValue = item;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "audio") {
                    var menus = [{ label: `None`, click: () => { this.attributeValue = ""; } }];
                    var audioFiles = editor.editorRS.getAssetsByType(feng3d.AudioAsset);
                    audioFiles.forEach(item => {
                        menus.push({
                            label: item.fileName, click: () => {
                                this.attributeValue = item.assetPath;
                            }
                        });
                    }, []);
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "file_script") {
                    var scriptFiles = editor.editorRS.getAssetsByType(feng3d.ScriptAsset);
                    var menus = [{ label: `None`, click: () => { this.attributeValue = null; } }];
                    scriptFiles.forEach(element => {
                        menus.push({
                            label: element.scriptName,
                            click: () => {
                                this.attributeValue = element.scriptName;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "material") {
                    var assets = editor.editorRS.getLoadedAssetDatasByType(feng3d.Material);
                    var menus = [];
                    assets.forEach(element => {
                        menus.push({
                            label: element.name,
                            click: () => {
                                this.attributeValue = element;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "geometry") {
                    var geometrys = editor.editorRS.getLoadedAssetDatasByType(feng3d.Geometry);
                    var menus = [];
                    geometrys.forEach(element => {
                        menus.push({
                            label: element.name,
                            click: () => {
                                this.attributeValue = element;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
            }
        }
        /**
         * 更新界面
         */
        updateView() {
            if (this.attributeValue === undefined) {
                this.text.text = String(this.attributeValue);
            }
            else if (!(this.attributeValue instanceof Object)) {
                this.text.text = String(this.attributeValue);
            }
            else {
                this.text.text = this.attributeValue["name"] || "";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            }
        }
        onDoubleClick() {
            if (this.attributeValue && typeof this.attributeValue == "object") {
                editor.editorData.selectObject(this.attributeValue);
            }
        }
    };
    OAVPick = __decorate([
        feng3d.OAVComponent()
    ], OAVPick);
    editor.OAVPick = OAVPick;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 挑选（拾取）OAV界面
     */
    let OAVTexture2D = class OAVTexture2D extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVTexture2D";
        }
        initView() {
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            if (this._attributeViewInfo.editable)
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        }
        dispose() {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }
        ontxtClick() {
            var menus = [];
            var texture2ds = feng3d.rs.getLoadedAssetDatasByType(feng3d.Texture2D);
            texture2ds.forEach(texture2d => {
                menus.push({
                    label: texture2d.name, click: () => {
                        this.attributeValue = texture2d;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    }
                });
            });
            editor.menu.popup(menus);
        }
        /**
         * 更新界面
         */
        updateView() {
            var texture = this.attributeValue;
            this.image.source = texture.dataURL;
        }
        onDoubleClick() {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editor.editorData.selectObject(this.attributeValue);
        }
    };
    OAVTexture2D = __decorate([
        feng3d.OAVComponent()
    ], OAVTexture2D);
    editor.OAVTexture2D = OAVTexture2D;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVParticleComponentList = class OAVParticleComponentList extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVParticleComponentList";
        }
        get space() {
            return this._space;
        }
        set space(value) {
            this._space = value;
            this.dispose();
            this.initView();
        }
        get attributeName() {
            return this._attributeName;
        }
        get attributeValue() {
            return this._space[this._attributeName];
        }
        set attributeValue(value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
            }
            this.updateView();
        }
        initView() {
            this.group.layout.gap = -1;
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.addComponentView(components[i]);
            }
        }
        dispose() {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
        }
        /**
         * 更新界面
         */
        updateView() {
            for (var i = 0, n = this.group.numChildren; i < n; i++) {
                var child = this.group.getChildAt(i);
                if (child instanceof editor.ParticleComponentView)
                    child.updateView();
            }
        }
        addComponentView(component) {
            var o;
            var displayObject = new editor.ParticleComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        }
        removedComponentView(component) {
            for (var i = this.group.numChildren - 1; i >= 0; i--) {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof editor.ParticleComponentView && displayObject.component == component) {
                    this.group.removeChild(displayObject);
                }
            }
        }
    };
    OAVParticleComponentList = __decorate([
        feng3d.OAVComponent()
    ], OAVParticleComponentList);
    editor.OAVParticleComponentList = OAVParticleComponentList;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVFeng3dPreView = class OAVFeng3dPreView extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVFeng3dPreView";
            this.alpha = 1;
        }
        initView() {
            this.cameraRotation = editor.feng3dScreenShot.camera.transform.rotation.clone();
            this.onResize();
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.ticker.on(100, this.onDrawObject, this);
            editor.MouseOnDisableScroll.register(this);
        }
        dispose() {
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.ticker.off(100, this.onDrawObject, this);
            editor.MouseOnDisableScroll.unRegister(this);
        }
        onMouseDown() {
            this.preMousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rect = this.getGlobalBounds();
            if (rect.contains(this.preMousePos.x, this.preMousePos.y)) {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
        }
        onMouseMove() {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var X_AXIS = editor.feng3dScreenShot.camera.transform.rightVector;
            var Y_AXIS = editor.feng3dScreenShot.camera.transform.upVector;
            editor.feng3dScreenShot.camera.transform.rotate(X_AXIS, mousePos.y - this.preMousePos.y);
            editor.feng3dScreenShot.camera.transform.rotate(Y_AXIS, mousePos.x - this.preMousePos.x);
            this.cameraRotation = editor.feng3dScreenShot.camera.transform.rotation.clone();
            this.preMousePos = mousePos;
        }
        onDrawObject() {
            if (this.space instanceof feng3d.GameObject) {
                editor.feng3dScreenShot.drawGameObject(this.space, this.cameraRotation);
            }
            else if (this.space instanceof feng3d.Geometry) {
                editor.feng3dScreenShot.drawGeometry(this.space, this.cameraRotation);
            }
            else if (this.space instanceof feng3d.Material) {
                editor.feng3dScreenShot.drawMaterial(this.space, this.cameraRotation);
            }
            this.image.source = editor.feng3dScreenShot.toDataURL(this.width, this.height);
        }
        onMouseUp() {
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        }
        updateView() {
        }
        onResize() {
            this.height = this.width;
            this.image.width = this.image.height = this.width;
        }
    };
    OAVFeng3dPreView = __decorate([
        feng3d.OAVComponent()
    ], OAVFeng3dPreView);
    editor.OAVFeng3dPreView = OAVFeng3dPreView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVMinMaxCurve = class OAVMinMaxCurve extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVMinMaxCurve";
        }
        initView() {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveView.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxCurveView.minMaxCurve = this.attributeValue;
            this.minMaxCurveView.touchEnabled = this.minMaxCurveView.touchChildren = this._attributeViewInfo.editable;
        }
        dispose() {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        }
        updateView() {
        }
        onChange() {
        }
    };
    OAVMinMaxCurve = __decorate([
        feng3d.OAVComponent()
    ], OAVMinMaxCurve);
    editor.OAVMinMaxCurve = OAVMinMaxCurve;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVMinMaxCurveVector3 = class OAVMinMaxCurveVector3 extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVMinMaxCurveVector3";
        }
        initView() {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveVector3View.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxCurveVector3View.minMaxCurveVector3 = this.attributeValue;
            this.minMaxCurveVector3View.touchEnabled = this.minMaxCurveVector3View.touchChildren = this._attributeViewInfo.editable;
        }
        dispose() {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveVector3View.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        }
        updateView() {
        }
        onChange() {
        }
    };
    OAVMinMaxCurveVector3 = __decorate([
        feng3d.OAVComponent()
    ], OAVMinMaxCurveVector3);
    editor.OAVMinMaxCurveVector3 = OAVMinMaxCurveVector3;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let OAVMinMaxGradient = class OAVMinMaxGradient extends editor.OAVBase {
        constructor(attributeViewInfo) {
            super(attributeViewInfo);
            this.skinName = "OAVMinMaxGradient";
        }
        initView() {
            if (this._attributeViewInfo.editable) {
                this.minMaxGradientView.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxGradientView.minMaxGradient = this.attributeValue;
            this.minMaxGradientView.touchEnabled = this.minMaxGradientView.touchChildren = this._attributeViewInfo.editable;
        }
        dispose() {
            if (this._attributeViewInfo.editable) {
                this.minMaxGradientView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        }
        updateView() {
        }
        onChange() {
        }
    };
    OAVMinMaxGradient = __decorate([
        feng3d.OAVComponent()
    ], OAVMinMaxGradient);
    editor.OAVMinMaxGradient = OAVMinMaxGradient;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 属性面板（检查器）
     */
    class InspectorView extends eui.Component {
        constructor() {
            super();
            /**
             * 历史选中对象列表
             */
            this._historySelectedObject = [];
            /**
             * 最多存储历史选中对象数量
             */
            this._maxHistorySelectedObject = 10;
            this._dataChanged = false;
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "InspectorViewSkin";
            this.moduleName = InspectorView.moduleName;
        }
        get historySelectedObjectLength() {
            return this._historySelectedObject.length;
        }
        /**
         *
         */
        preSelectedObjects() {
            this._historySelectedObject.pop();
            var v = this._historySelectedObject.pop();
            editor.editorData.selectedObjects = v;
        }
        showData(data) {
            if (this._viewData == data)
                return;
            if (this._viewData) {
                this.saveShowData();
            }
            //
            this._viewData = data;
            this.updateView();
        }
        onSaveShowData(event) {
            this.saveShowData(event.data);
        }
        updateView() {
            this.typeLab.text = ``;
            this.backButton.visible = this._historySelectedObject.length > 1;
            if (this._view && this._view.parent) {
                this._view.parent.removeChild(this._view);
            }
            if (this.emptyLabel.parent)
                this.emptyLabel.parent.removeChild(this.emptyLabel);
            if (this._viewData) {
                if (this._viewData instanceof editor.AssetNode) {
                    if (this._viewData.isDirectory)
                        return;
                    if (this._viewData.asset) {
                        this.updateShowData(this._viewData.asset);
                    }
                    else {
                        if (!this._viewData.isLoaded) {
                            var viewData = this._viewData;
                            viewData.load(() => {
                                console.assert(!!viewData.asset);
                                if (viewData == this._viewData)
                                    this.updateShowData(viewData.asset);
                            });
                        }
                    }
                }
                else {
                    this.updateShowData(this._viewData);
                }
            }
            else {
                this.group.addChild(this.emptyLabel);
            }
        }
        /**
         * 保存显示数据
         */
        saveShowData(callback) {
            if (this._dataChanged) {
                if (this._viewData.assetId) {
                    var feng3dAsset = feng3d.rs.getAssetById(this._viewData.assetId);
                    if (feng3dAsset) {
                        editor.editorRS.writeAsset(feng3dAsset, (err) => {
                            console.assert(!err, `资源 ${feng3dAsset.assetId} 保存失败！`);
                            callback && callback();
                        });
                    }
                }
                else if (this._viewData instanceof editor.AssetNode) {
                    editor.editorAsset.saveAsset(this._viewData);
                }
                this._dataChanged = false;
            }
            else {
                callback && callback();
            }
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.backButton.visible = this._historySelectedObject.length > 1;
            this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
            //
            feng3d.globalDispatcher.on("inspector.update", this.updateView, this);
            feng3d.globalDispatcher.on("inspector.saveShowData", this.onSaveShowData, this);
            //
            this.updateView();
        }
        onRemovedFromStage() {
            this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
            feng3d.globalDispatcher.off("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
            //
            feng3d.globalDispatcher.off("inspector.update", this.updateView, this);
            feng3d.globalDispatcher.off("inspector.saveShowData", this.onSaveShowData, this);
        }
        onSelectedObjectsChanged() {
            this._historySelectedObject.push(editor.editorData.selectedObjects);
            if (this._historySelectedObject.length > this._maxHistorySelectedObject)
                this._historySelectedObject.shift();
            var data = editor.inspectorMultiObject.convertInspectorObject(editor.editorData.selectedObjects);
            this.showData(data);
        }
        updateShowData(showdata) {
            this.typeLab.text = `${showdata.constructor["name"]}`;
            if (this._view)
                this._view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
            var editable = true;
            if (showdata instanceof feng3d.Feng3dObject)
                editable = !Boolean(showdata.hideFlags & feng3d.HideFlags.NotEditable);
            this._view = feng3d.objectview.getObjectView(showdata, { editable: editable });
            // this._view.percentWidth = 100;
            this.group.addChild(this._view);
            this.group.scrollV = 0;
            this._view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
        }
        onValueChanged(e) {
            this._dataChanged = true;
            if (this._viewData instanceof feng3d.FileAsset) {
                if (this._viewData.assetId) {
                    var assetNode = editor.editorAsset.getAssetByID(this._viewData.assetId);
                    assetNode && assetNode.updateImage();
                }
            }
            else if (this._viewData instanceof editor.AssetNode) {
                this._viewData.updateImage();
            }
        }
        onBackButton() {
            this.preSelectedObjects();
        }
    }
    InspectorView.moduleName = "Inspector";
    editor.InspectorView = InspectorView;
    editor.Modules.moduleViewCls[InspectorView.moduleName] = InspectorView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 检查器多对象
     *
     * 处理多个对象在检查器中显示问题
     */
    class InspectorMultiObject {
        convertInspectorObject(objects) {
            if (objects.length == 0)
                return 0;
            objects = objects.map(element => {
                if (element instanceof editor.AssetNode) {
                    if (element.asset.data)
                        element = element.asset.data;
                    else
                        element = element.asset;
                }
                return element;
            });
            if (objects.length == 1)
                return objects[0];
            var data = {};
            objects.forEach(element => {
                var type = feng3d.classUtils.getQualifiedClassName(element);
                var list = data[type] = data[type] || [];
                list.push(element);
            });
            var l = [];
            for (const type in data) {
                var element = data[type];
                l.push(`${element.length} ${type}`);
            }
            l.unshift(`${objects.length} Objects\n`);
            return l.join("\n\t");
        }
    }
    editor.InspectorMultiObject = InspectorMultiObject;
    editor.inspectorMultiObject = new InspectorMultiObject();
})(editor || (editor = {}));
var editor;
(function (editor) {
    class HierarchyTreeItemRenderer extends editor.TreeItemRenderer {
        constructor() {
            super();
            this.skinName = "HierarchyTreeItemRenderer";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            editor.drag.register(this, (dragSource) => {
                this.data.setdargSource(dragSource);
            }, ["gameobject", "file_gameobject", "file_script"], (dragdata) => {
                this.data.acceptDragDrop(dragdata);
            });
            editor.MouseOnDisableScroll.register(this);
            //
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        }
        $onRemoveFromStage() {
            editor.drag.unregister(this);
            editor.MouseOnDisableScroll.unRegister(this);
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        }
        onclick() {
            editor.editorData.selectObject(this.data.gameobject);
        }
        onDoubleClick() {
            feng3d.shortcut.dispatch("lookToSelectedGameObject");
        }
        onrightclick() {
            var menus = [];
            //scene无法删除
            if (this.data.gameobject.scene.gameObject != this.data.gameobject) {
                menus.push({
                    label: "复制", click: () => {
                        var objects = editor.editorData.selectedObjects.filter(v => v instanceof feng3d.GameObject);
                        editor.editorData.copyObjects = objects;
                    }
                }, {
                    label: "粘贴",
                    click: () => {
                        var undoSelectedObjects = editor.editorData.selectedObjects;
                        //
                        var objects = editor.editorData.copyObjects.filter(v => v instanceof feng3d.GameObject);
                        if (objects.length == 0)
                            return;
                        var newGameObjects = objects.map(v => feng3d.serialization.clone(v));
                        newGameObjects.forEach(v => {
                            this.data.gameobject.parent.addChild(v);
                        });
                        editor.editorData.selectMultiObject(newGameObjects);
                        // undo
                        editor.editorData.undoList.push(() => {
                            newGameObjects.forEach(v => {
                                v.remove();
                            });
                            editor.editorData.selectMultiObject(undoSelectedObjects, false);
                        });
                    }
                }, { type: 'separator' }, {
                    label: "副本", click: () => {
                        var undoSelectedObjects = editor.editorData.selectedObjects;
                        //
                        var objects = editor.editorData.selectedObjects.filter(v => v instanceof feng3d.GameObject);
                        var newGameObjects = objects.map(v => {
                            var no = feng3d.serialization.clone(v);
                            v.parent.addChild(no);
                            return no;
                        });
                        editor.editorData.selectMultiObject(newGameObjects);
                        // undo
                        editor.editorData.undoList.push(() => {
                            newGameObjects.forEach(v => {
                                v.remove();
                            });
                            editor.editorData.selectMultiObject(undoSelectedObjects, false);
                        });
                    }
                }, {
                    label: "删除", click: () => {
                        this.data.gameobject.parent.removeChild(this.data.gameobject);
                        var index = editor.editorData.selectedObjects.indexOf(this.data.gameobject);
                        if (index != -1) {
                            var selectedObjects = editor.editorData.selectedObjects.concat();
                            selectedObjects.splice(index, 1);
                            editor.editorData.selectMultiObject(selectedObjects);
                        }
                    }
                });
            }
            menus = menus.concat({ type: 'separator' }, editor.menuConfig.getCreateObjectMenu());
            if (menus.length > 0)
                editor.menu.popup(menus);
        }
    }
    editor.HierarchyTreeItemRenderer = HierarchyTreeItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class HierarchyView extends eui.Component {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "HierarchyViewSkin";
            this.moduleName = HierarchyView.moduleName;
        }
        onComplete() {
            this.list.itemRenderer = editor.HierarchyTreeItemRenderer;
            this.hierachyScroller.viewport = this.list;
            this.listData = this.list.dataProvider = new eui.ArrayCollection();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            editor.drag.register(this.list, null, ["gameobject", "file_gameobject", "file_script"], (dragdata) => {
                editor.hierarchy.rootnode.acceptDragDrop(dragdata);
            });
            this.list.addEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
            this.list.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
            feng3d.watcher.watch(editor.hierarchy, "rootnode", this.onRootNodeChanged, this);
            this.onRootNode(editor.hierarchy.rootnode);
            this.invalidHierarchy();
        }
        onRemovedFromStage() {
            editor.drag.unregister(this.list);
            this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
            this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
            feng3d.watcher.unwatch(editor.hierarchy, "rootnode", this.onRootNodeChanged, this);
            this.offRootNode(editor.hierarchy.rootnode);
        }
        onRootNodeChanged(newValue, oldvalue) {
            this.offRootNode(oldvalue);
            this.onRootNode(editor.hierarchy.rootnode);
            this.invalidHierarchy();
        }
        onRootNode(node) {
            if (node) {
                node.on("added", this.invalidHierarchy, this);
                node.on("removed", this.invalidHierarchy, this);
                node.on("openChanged", this.invalidHierarchy, this);
            }
        }
        offRootNode(node) {
            if (node) {
                node.off("added", this.invalidHierarchy, this);
                node.off("removed", this.invalidHierarchy, this);
                node.off("openChanged", this.invalidHierarchy, this);
            }
        }
        invalidHierarchy() {
            feng3d.ticker.nextframe(this.updateHierarchyTree, this);
        }
        updateHierarchyTree() {
            if (!editor.hierarchy.rootnode)
                return;
            var nodes = editor.hierarchy.rootnode.getShowNodes();
            this.listData.replaceAll(nodes);
        }
        onListClick(e) {
            if (e.target == this.list) {
                editor.editorData.selectObject(null);
            }
        }
        onListRightClick(e) {
            if (e.target == this.list) {
                editor.editorData.selectObject(null);
                editor.menu.popup(editor.menuConfig.getCreateObjectMenu());
            }
        }
    }
    /**
     * 模块名称
     */
    HierarchyView.moduleName = "Hierarchy";
    editor.HierarchyView = HierarchyView;
    editor.Modules.moduleViewCls[HierarchyView.moduleName] = HierarchyView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 动画面板
     */
    class AnimationView extends eui.Component {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "AnimationView";
            this.moduleName = AnimationView.moduleName;
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            //
            this.updateView();
        }
        onRemovedFromStage() {
        }
        updateView() {
        }
    }
    AnimationView.moduleName = "Animation";
    editor.AnimationView = AnimationView;
    editor.Modules.moduleViewCls[AnimationView.moduleName] = AnimationView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class EditorAsset {
        constructor() {
            /**
             * 资源ID字典
             */
            this._assetIDMap = {};
            this._assetPathMap = {};
            /**
             * 上次执行的项目脚本
             */
            this._preProjectJsContent = null;
            feng3d.globalDispatcher.on("asset.parsed", this.onParsed, this);
        }
        /**
         * 初始化项目
         * @param callback
         */
        initproject(callback) {
            editor.editorRS.init(() => {
                this._assetIDMap = {};
                this._assetPathMap = {};
                var allAssets = editor.editorRS.getAllAssets();
                allAssets.map(asset => {
                    var node = new editor.AssetNode(asset);
                    this.addAsset(node);
                    return node;
                }).forEach(element => {
                    if (element.asset.parentAsset) {
                        var parentNode = this.getAssetByID(element.asset.parentAsset.assetId);
                        parentNode.addChild(element);
                    }
                });
                this.rootFile = this.getAssetByID(editor.editorRS.root.assetId);
                this.showFloder = this.rootFile;
                this.rootFile.isOpen = true;
                callback();
            });
        }
        /**
         * 添加新资源
         *
         * @param node 资源
         */
        addAsset(node) {
            if (this._assetIDMap[node.asset.assetId])
                throw "添加重复资源！";
            if (this._assetPathMap[node.asset.assetPath])
                throw "添加重复资源！";
            this._assetIDMap[node.asset.assetId] = node;
            this._assetPathMap[node.asset.assetPath] = node;
        }
        readScene(path, callback) {
            editor.editorRS.fs.readObject(path, (err, obj) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                editor.editorRS.deserializeWithAssets(obj, (object) => {
                    var scene = object.getComponent(feng3d.Scene);
                    callback(null, scene);
                });
            });
        }
        /**
         * 根据资源编号获取文件
         *
         * @param assetId 文件路径
         */
        getAssetByID(assetId) {
            return this._assetIDMap[assetId];
        }
        /**
         * 根据资源路径获取文件
         *
         * @param path 资源路径
         */
        getAssetByPath(path) {
            return this._assetPathMap[path];
        }
        /**
         * 删除资源
         *
         * @param assetNode 资源
         */
        deleteAsset(assetNode, callback) {
            editor.editorRS.deleteAsset(assetNode.asset, (err) => {
                if (err) {
                    callback && callback(err);
                    return;
                }
                delete this._assetIDMap[assetNode.asset.assetId];
                delete this._assetPathMap[assetNode.asset.assetPath];
                feng3d.globalDispatcher.dispatch("asset.deletefile", { id: assetNode.asset.assetId });
                callback && callback(err);
            });
        }
        /**
         * 保存资源
         *
         * @param assetNode 资源
         * @param callback 完成回调
         */
        saveAsset(assetNode, callback) {
            editor.editorRS.writeAsset(assetNode.asset, (err) => {
                console.assert(!err, `资源 ${assetNode.asset.assetId} 保存失败！`);
                callback && callback();
            });
        }
        /**
         * 新增资源
         *
         * @param cls 资源类定义
         * @param fileName 文件名称
         * @param value 初始数据
         * @param folderNode 所在文件夹，如果值为null时默认添加到根文件夹中
         * @param callback 完成回调函数
         */
        createAsset(folderPath, cls, fileName, value, callback) {
            var folderNode = this.getAssetByPath(folderPath);
            var folder = folderNode.asset;
            editor.editorRS.createAsset(cls, fileName, value, folder, (err, asset) => {
                if (asset) {
                    var assetNode = new editor.AssetNode(asset);
                    assetNode.isLoaded = true;
                    this.addAsset(assetNode);
                    folderNode.addChild(assetNode);
                    editor.editorData.selectObject(assetNode);
                    callback && callback(null, assetNode);
                }
                else {
                    alert(err.message);
                }
            });
        }
        /**
         * 弹出文件菜单
         */
        popupmenu(assetNode) {
            var folder = assetNode.asset;
            // 资源所在文件夹
            var folderPath = assetNode.asset.assetPath;
            if (!assetNode.isDirectory)
                folderPath = assetNode.parent.asset.assetPath;
            var menuconfig = [
                {
                    label: "Create",
                    submenu: [
                        {
                            label: "Folder", click: () => {
                                this.createAsset(folderPath, feng3d.FolderAsset, "NewFolder");
                            }
                        },
                        {
                            label: "TS Script", click: () => {
                                var fileName = editor.editorRS.getValidChildName(folder, "NewScript");
                                this.createAsset(folderPath, feng3d.ScriptAsset, fileName, { textContent: editor.assetFileTemplates.getNewScript(fileName) }, () => {
                                    feng3d.globalDispatcher.dispatch("script.compile");
                                });
                            }
                        },
                        {
                            label: "Shader", click: () => {
                                var fileName = editor.editorRS.getValidChildName(folder, "NewShader");
                                this.createAsset(folderPath, feng3d.ShaderAsset, fileName, { textContent: editor.assetFileTemplates.getNewShader(fileName) }, () => {
                                    feng3d.globalDispatcher.dispatch("script.compile");
                                });
                            }
                        },
                        {
                            label: "js", click: () => {
                                this.createAsset(folderPath, feng3d.JSAsset, "NewJs");
                            }
                        },
                        {
                            label: "Json", click: () => {
                                this.createAsset(folderPath, feng3d.JsonAsset, "New Json");
                            }
                        },
                        {
                            label: "Txt", click: () => {
                                this.createAsset(folderPath, feng3d.TextAsset, "New Text");
                            }
                        },
                        { type: "separator" },
                        {
                            label: "立方体贴图", click: () => {
                                this.createAsset(folderPath, feng3d.TextureCubeAsset, "new TextureCube", { data: new feng3d.TextureCube() });
                            }
                        },
                        {
                            label: "Material", click: () => {
                                this.createAsset(folderPath, feng3d.MaterialAsset, "New Material", { data: new feng3d.Material() });
                            }
                        },
                        {
                            label: "几何体",
                            submenu: [
                                {
                                    label: "平面", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New PlaneGeometry", { data: new feng3d.PlaneGeometry() });
                                    }
                                },
                                {
                                    label: "立方体", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New CubeGeometry", { data: new feng3d.CubeGeometry() });
                                    }
                                },
                                {
                                    label: "球体", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New SphereGeometry", { data: new feng3d.SphereGeometry() });
                                    }
                                },
                                {
                                    label: "胶囊体", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New CapsuleGeometry", { data: new feng3d.CapsuleGeometry() });
                                    }
                                },
                                {
                                    label: "圆柱体", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New CylinderGeometry", { data: new feng3d.CylinderGeometry() });
                                    }
                                },
                                {
                                    label: "圆锥体", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New ConeGeometry", { data: new feng3d.ConeGeometry() });
                                    }
                                },
                                {
                                    label: "圆环", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New TorusGeometry", { data: new feng3d.TorusGeometry() });
                                    }
                                },
                                {
                                    label: "线段", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New SegmentGeometry", { data: new feng3d.SegmentGeometry() });
                                    }
                                },
                                {
                                    label: "地形", click: () => {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New TerrainGeometry", { data: new feng3d.TerrainGeometry() });
                                    }
                                },
                            ],
                        },
                    ]
                },
                {
                    label: "Show In Explorer", click: () => {
                        var fullpath = editor.editorRS.fs.getAbsolutePath(assetNode.asset.assetPath);
                        editor.nativeAPI.showFileInExplorer(fullpath);
                    }, enable: !!editor.nativeAPI
                }, {
                    label: "使用VSCode打开项目", click: () => {
                        editor.nativeAPI.openWithVSCode(editor.editorRS.fs.projectname, (err) => {
                            if (err)
                                throw err;
                        });
                    }, enable: !!editor.nativeAPI,
                },
                {
                    label: "Open",
                    click: () => {
                        if (assetNode.asset instanceof feng3d.StringAsset) {
                            feng3d.globalDispatcher.dispatch("openScript", assetNode.asset);
                        }
                    },
                },
                {
                    label: "Delete", click: () => {
                        assetNode.delete();
                    }, enable: assetNode != this.rootFile && assetNode != this.showFloder,
                },
                {
                    label: "Rename",
                    click: () => {
                        alert("未实现");
                    }
                },
                { type: "separator" },
                {
                    label: "Import New Asset...",
                    click: () => {
                        editor.editorRS.selectFile((fileList) => {
                            var files = [];
                            for (let i = 0; i < fileList.length; i++) {
                                files[i] = fileList[i];
                            }
                            this.inputFiles(files);
                        });
                    },
                    enable: assetNode.isDirectory,
                },
                {
                    label: "Export Package...", click: () => {
                        assetNode.export();
                    }, enable: !assetNode.isDirectory,
                },
            ];
            // 解析菜单
            this.parserMenu(menuconfig, assetNode);
            menuconfig.push({
                label: "去除背景色",
                click: () => {
                    var image = assetNode.asset["image"];
                    var imageUtil = new feng3d.ImageUtil().fromImage(image);
                    var backColor = new feng3d.Color4(222 / 255, 222 / 255, 222 / 255);
                    imageUtil.clearBackColor(backColor);
                    feng3d.dataTransform.imagedataToImage(imageUtil.imageData, 1, (img) => {
                        assetNode.asset["image"] = img;
                        this.saveAsset(assetNode);
                    });
                },
                enable: assetNode.asset.data instanceof feng3d.Texture2D,
            });
            editor.menu.popup(menuconfig);
        }
        /**
         * 保存对象
         *
         * @param object 对象
         * @param callback
         */
        saveObject(object, callback) {
            this.createAsset(this.showFloder.asset.assetPath, feng3d.GameObjectAsset, object.name, { data: object }, (err, assetNode) => {
                callback && callback(assetNode);
            });
        }
        /**
         *
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetNodes 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files, callback, assetNodes = []) {
            if (files.length == 0) {
                editor.editorData.selectMultiObject(assetNodes);
                callback && callback(assetNodes);
                return;
            }
            var file = files.shift();
            var reader = new FileReader();
            reader.addEventListener('load', (event) => {
                var result = event.target["result"];
                var showFloder = this.showFloder.asset.assetPath;
                var createAssetCallback = (err, assetNode) => {
                    if (err) {
                        alert(err.message);
                    }
                    else {
                        assetNodes.push(assetNode);
                    }
                    this.inputFiles(files, callback, assetNodes);
                };
                var fileName = file.name;
                if (feng3d.regExps.image.test(file.name)) {
                    feng3d.dataTransform.arrayBufferToImage(result, (img) => {
                        var texture2D = new feng3d.Texture2D();
                        texture2D["_pixels"] = img;
                        this.createAsset(showFloder, feng3d.TextureAsset, fileName, { data: texture2D }, createAssetCallback);
                    });
                }
                else if (feng3d.regExps.audio.test(file.name)) {
                    this.createAsset(showFloder, feng3d.AudioAsset, fileName, { arraybuffer: result }, createAssetCallback);
                }
                else {
                    this.createAsset(showFloder, feng3d.ArrayBufferAsset, fileName, { arraybuffer: result }, createAssetCallback);
                }
            }, false);
            reader.readAsArrayBuffer(file);
        }
        runProjectScript(callback) {
            editor.editorRS.fs.readString("project.js", (err, content) => {
                if (content != this._preProjectJsContent) {
                    //
                    var windowEval = eval.bind(window);
                    try {
                        // 运行project.js
                        windowEval(content);
                        // 刷新属性界面（界面中可能有脚本）
                        feng3d.globalDispatcher.dispatch("inspector.update");
                    }
                    catch (error) {
                        console.warn(error);
                    }
                }
                this._preProjectJsContent = content;
                callback && callback();
            });
        }
        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetNode 文件
         */
        parserMenu(menuconfig, assetNode) {
            if (assetNode.asset instanceof feng3d.FileAsset) {
                var filePath = assetNode.asset.assetPath;
                var extensions = feng3d.pathUtils.extname(filePath);
                switch (extensions) {
                    case "mdl":
                        menuconfig.push({ label: "解析", click: () => feng3d.mdlLoader.load(filePath) });
                        break;
                    case "obj":
                        menuconfig.push({ label: "解析", click: () => feng3d.objLoader.load(filePath) });
                        break;
                    case "mtl":
                        menuconfig.push({ label: "解析", click: () => feng3d.mtlLoader.load(filePath) });
                        break;
                    case "fbx":
                        menuconfig.push({ label: "解析", click: () => editor.threejsLoader.load(filePath) });
                        break;
                    case "md5mesh":
                        menuconfig.push({ label: "解析", click: () => feng3d.md5Loader.load(filePath) });
                        break;
                    case "md5anim":
                        menuconfig.push({ label: "解析", click: () => feng3d.md5Loader.loadAnim(filePath) });
                        break;
                }
            }
        }
        showFloderChanged(property, oldValue, newValue) {
            this.showFloder.openParents();
            feng3d.globalDispatcher.dispatch("asset.showFloderChanged", { oldpath: oldValue, newpath: newValue });
        }
        onParsed(e) {
            var data = e.data;
            if (data instanceof feng3d.FileAsset) {
                this.saveObject(data.data);
            }
        }
    }
    __decorate([
        feng3d.watch("showFloderChanged")
    ], EditorAsset.prototype, "showFloder", void 0);
    editor.EditorAsset = EditorAsset;
    editor.editorAsset = new EditorAsset();
})(editor || (editor = {}));
var codeeditoWin;
var editor;
(function (editor) {
    class AssetFileItemRenderer extends eui.ItemRenderer {
        constructor() {
            super();
            this.itemSelected = false;
            this.skinName = "AssetFileItemRenderer";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            this.selectedfilechanged();
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            feng3d.globalDispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        }
        dataChanged() {
            super.dataChanged();
            if (this.data) {
                if (this.data.isDirectory) {
                    editor.drag.register(this, (dragsource) => {
                        this.data.setdargSource(dragsource);
                    }, ["assetNodes"], (dragdata) => {
                        this.data.acceptDragDrop(dragdata);
                    });
                }
                else {
                    if (!this.data.isLoaded) {
                        var data = this.data;
                        data.load(() => {
                            console.assert(data.isLoaded);
                            if (data == this.data)
                                this.dataChanged();
                        });
                        return;
                    }
                    editor.drag.register(this, (dragsource) => {
                        this.data.setdargSource(dragsource);
                    }, []);
                }
            }
            else {
                editor.drag.unregister(this);
            }
            this.selectedfilechanged();
        }
        ondoubleclick() {
            if (this.data.isDirectory) {
                editor.editorAsset.showFloder = this.data;
            }
            else if (this.data.asset instanceof feng3d.GameObject) {
                var scene = this.data.asset.getComponent(feng3d.Scene);
                if (scene) {
                    editor.editorData.gameScene = scene;
                }
            }
        }
        onclick() {
            // 处理按下shift键时
            var isShift = feng3d.shortcut.keyState.getKeyState("shift");
            if (isShift) {
                var source = this.parent.dataProvider.source;
                var index = source.indexOf(this.data);
                var min = index, max = index;
                if (editor.editorData.selectedAssetNodes.indexOf(preAssetFile) != -1) {
                    index = source.indexOf(preAssetFile);
                    if (index < min)
                        min = index;
                    if (index > max)
                        max = index;
                }
                editor.editorData.selectMultiObject(source.slice(min, max + 1));
            }
            else {
                editor.editorData.selectObject(this.data);
                preAssetFile = this.data;
            }
        }
        onrightclick(e) {
            e.stopPropagation();
            editor.editorData.selectObject(this.data);
            editor.editorAsset.popupmenu(this.data);
        }
        selectedfilechanged() {
            var selected = false;
            if (this.data) {
                var selectedAssetFile = editor.editorData.selectedAssetNodes;
                selected = selectedAssetFile.indexOf(this.data) != -1;
                if (!selected) {
                    var assetids = editor.editorData.selectedObjects.map(v => v.assetId);
                    selected = assetids.indexOf(this.data.asset.assetId) != -1;
                }
            }
            if (this.itemSelected != selected) {
                this.itemSelected = selected;
            }
        }
    }
    editor.AssetFileItemRenderer = AssetFileItemRenderer;
    var preAssetFile;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 资源树结点
     */
    class AssetNode extends editor.TreeNode {
        /**
         * 构建
         *
         * @param asset 资源
         */
        constructor(asset) {
            super();
            this.children = [];
            /**
             * 是否已加载
             */
            this.isLoaded = false;
            this.asset = asset;
            this.isDirectory = asset.assetType == feng3d.AssetType.folder;
            this.label = asset.fileName;
            // 更新图标
            if (this.isDirectory) {
                this.image = "folder_png";
            }
            else {
                this.image = "file_png";
            }
            asset.readPreview((err, image) => {
                if (image) {
                    this.image = feng3d.dataTransform.imageToDataURL(image);
                }
                else {
                    this.updateImage();
                }
            });
        }
        /**
         * 加载
         *
         * @param callback 加载完成回调
         */
        load(callback) {
            if (this.isLoaded) {
                callback && callback();
                return;
            }
            if (this.isLoading) {
                callback && this.on("loaded", callback);
                return;
            }
            this.isLoading = true;
            editor.editorRS.readAsset(this.asset.assetId, (err, asset) => {
                console.assert(!err);
                this.isLoading = false;
                this.isLoaded = true;
                callback && callback();
                this.dispatch("loaded", this);
            });
        }
        /**
         * 更新预览图
         */
        updateImage() {
            if (this.asset instanceof feng3d.TextureAsset) {
                var texture = this.asset.data;
                this.image = editor.feng3dScreenShot.drawTexture(texture);
                feng3d.dataTransform.dataURLToImage(this.image, (image) => {
                    this.asset.writePreview(image);
                });
            }
            else if (this.asset instanceof feng3d.TextureCubeAsset) {
                var textureCube = this.asset.data;
                textureCube.onLoadCompleted(() => {
                    this.image = editor.feng3dScreenShot.drawTextureCube(textureCube);
                    feng3d.dataTransform.dataURLToImage(this.image, (image) => {
                        this.asset.writePreview(image);
                    });
                });
            }
            else if (this.asset instanceof feng3d.MaterialAsset) {
                var mat = this.asset;
                mat.data.onLoadCompleted(() => {
                    this.image = editor.feng3dScreenShot.drawMaterial(mat.data).toDataURL();
                    feng3d.dataTransform.dataURLToImage(this.image, (image) => {
                        this.asset.writePreview(image);
                    });
                });
            }
            else if (this.asset instanceof feng3d.GeometryAsset) {
                this.image = editor.feng3dScreenShot.drawGeometry(this.asset.data).toDataURL();
                feng3d.dataTransform.dataURLToImage(this.image, (image) => {
                    this.asset.writePreview(image);
                });
            }
            else if (this.asset instanceof feng3d.GameObjectAsset) {
                var gameObject = this.asset.data;
                gameObject.onLoadCompleted(() => {
                    this.image = editor.feng3dScreenShot.drawGameObject(gameObject).toDataURL();
                    feng3d.dataTransform.dataURLToImage(this.image, (image) => {
                        this.asset.writePreview(image);
                    });
                });
            }
        }
        /**
         * 删除
         */
        delete() {
            this.children.forEach(element => {
                element.delete();
            });
            this.remove();
            editor.editorAsset.deleteAsset(this);
        }
        /**
         * 获取文件夹列表
         *
         * @param includeClose 是否包含关闭的文件夹
         */
        getFolderList(includeClose = false) {
            var folders = [];
            if (this.isDirectory) {
                folders.push(this);
            }
            if (this.isOpen || includeClose) {
                this.children.forEach(v => {
                    var cfolders = v.getFolderList();
                    folders = folders.concat(cfolders);
                });
            }
            return folders;
        }
        /**
         * 获取文件列表
         */
        getFileList() {
            var files = [];
            files.push(this);
            this.children.forEach(v => {
                var cfiles = v.getFileList();
                files = files.concat(cfiles);
            });
            return files;
        }
        /**
         * 提供拖拽数据
         *
         * @param dragsource
         */
        setdargSource(dragsource) {
            var extension = this.asset.assetType;
            switch (extension) {
                case feng3d.AssetType.gameobject:
                    dragsource.addDragData("file_gameobject", this.asset);
                    break;
                case feng3d.AssetType.script:
                    dragsource.addDragData("file_script", this.asset);
                    break;
                case feng3d.AssetType.anim:
                    dragsource.addDragData("animationclip", this.asset.data);
                    break;
                case feng3d.AssetType.material:
                    dragsource.addDragData("material", this.asset.data);
                    break;
                case feng3d.AssetType.texturecube:
                    dragsource.addDragData("texturecube", this.asset.data);
                    break;
                case feng3d.AssetType.geometry:
                    dragsource.addDragData("geometry", this.asset.data);
                    break;
                case feng3d.AssetType.texture:
                    dragsource.addDragData("texture2d", this.asset.data);
                    break;
                case feng3d.AssetType.audio:
                    dragsource.addDragData("audio", this.asset.data);
                    break;
            }
            dragsource.addDragData("assetNodes", this);
        }
        /**
         * 接受拖拽数据
         *
         * @param dragdata
         */
        acceptDragDrop(dragdata) {
            if (!(this.asset instanceof feng3d.FolderAsset))
                return;
            var folder = this.asset;
            dragdata.getDragData("assetNodes").forEach(v => {
                editor.editorRS.moveAsset(v.asset, folder, (err) => {
                    if (!err) {
                        this.addChild(v);
                    }
                    else {
                        feng3d.globalDispatcher.dispatch("message.error", err.message);
                    }
                });
            });
        }
        /**
         * 导出
         */
        export() {
            var zip = new JSZip();
            var path = this.asset.assetPath;
            if (!feng3d.pathUtils.isDirectory(path))
                path = feng3d.pathUtils.dirname(path);
            var filename = this.label;
            editor.editorRS.fs.getAllPathsInFolder(path, (err, filepaths) => {
                readfiles();
                function readfiles() {
                    if (filepaths.length > 0) {
                        var filepath = filepaths.shift();
                        editor.editorRS.fs.readArrayBuffer(filepath, (err, data) => {
                            //处理文件夹
                            data && zip.file(filepath, data);
                            readfiles();
                        });
                    }
                    else {
                        zip.generateAsync({ type: "blob" }).then(function (content) {
                            saveAs(content, `${filename}.zip`);
                        });
                    }
                }
            });
        }
    }
    __decorate([
        feng3d.serialize
    ], AssetNode.prototype, "children", void 0);
    editor.AssetNode = AssetNode;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class AssetTreeItemRenderer extends editor.TreeItemRenderer {
        constructor() {
            super();
            this.skinName = "AssetTreeItemRenderer";
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            editor.MouseOnDisableScroll.register(this);
            feng3d.watcher.watch(editor.editorAsset, "showFloder", this.showFloderChanged, this);
            this.showFloderChanged();
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            editor.MouseOnDisableScroll.unRegister(this);
            feng3d.watcher.unwatch(editor.editorAsset, "showFloder", this.showFloderChanged, this);
        }
        dataChanged() {
            super.dataChanged();
            if (this.data) {
                editor.drag.register(this, (dragsource) => {
                    this.data.setdargSource(dragsource);
                }, ["assetNodes"], (dragdata) => {
                    this.data.acceptDragDrop(dragdata);
                });
            }
            else {
                editor.drag.unregister(this);
            }
            this.showFloderChanged();
        }
        showFloderChanged() {
            this.selected = this.data ? editor.editorAsset.showFloder == this.data : false;
        }
        onclick() {
            editor.editorAsset.showFloder = this.data;
        }
        onrightclick(e) {
            if (this.data.parent != null) {
                editor.editorAsset.popupmenu(this.data);
            }
            else {
                editor.editorAsset.popupmenu(this.data);
            }
        }
    }
    editor.AssetTreeItemRenderer = AssetTreeItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 项目模块视图
     */
    class ProjectView extends eui.Component {
        constructor() {
            super();
            //
            this._assettreeInvalid = true;
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ProjectView";
            //
            this.moduleName = ProjectView.moduleName;
            editor.editorui.assetview = this;
            //
            this._areaSelectRect = new editor.AreaSelectRect();
            //
            this.fileDrag = new FileDrag(this);
        }
        onComplete() {
            this.assetTreeList.itemRenderer = editor.AssetTreeItemRenderer;
            this.filelist.itemRenderer = editor.AssetFileItemRenderer;
            this.floderScroller.viewport = this.filelist;
            this.assetTreeScroller.viewport = this.assetTreeList;
            this.listData = this.assetTreeList.dataProvider = new eui.ArrayCollection();
            this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
        }
        $onAddToStage(stage, nestLevel) {
            super.$onAddToStage(stage, nestLevel);
            this.excludeTxt.text = "";
            this.filepathLabel.text = "";
            //
            editor.drag.register(this.filelistgroup, (dragsource) => { }, ["gameobject"], (dragSource) => {
                dragSource.getDragData("gameobject").forEach(v => {
                    editor.editorAsset.saveObject(v);
                });
            });
            this.initlist();
            //
            this.fileDrag.addEventListener();
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.filelist.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            editor.MouseOnDisableScroll.register(this.filelist);
            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            feng3d.globalDispatcher.on("asset.showAsset", this.onShowAsset, this);
        }
        $onRemoveFromStage() {
            super.$onRemoveFromStage();
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            editor.MouseOnDisableScroll.unRegister(this.filelist);
            feng3d.watcher.unwatch(editor.editorAsset, "showFloder", this.updateShowFloder, this);
            this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.globalDispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            feng3d.globalDispatcher.on("asset.showAsset", this.onShowAsset, this);
            //
            editor.drag.unregister(this.filelistgroup);
            this.fileDrag.removeEventListener();
        }
        initlist() {
            this.invalidateAssettree();
            editor.editorAsset.rootFile.on("openChanged", this.invalidateAssettree, this);
            editor.editorAsset.rootFile.on("added", this.invalidateAssettree, this);
            editor.editorAsset.rootFile.on("removed", this.invalidateAssettree, this);
            feng3d.watcher.watch(editor.editorAsset, "showFloder", this.updateShowFloder, this);
        }
        update() {
            if (this._assettreeInvalid) {
                this.updateAssetTree();
                this.updateShowFloder();
                this._assettreeInvalid = false;
            }
        }
        invalidateAssettree() {
            this._assettreeInvalid = true;
            feng3d.ticker.nextframe(this.update, this);
        }
        updateAssetTree() {
            var folders = editor.editorAsset.rootFile.getFolderList();
            this.listData.replaceAll(folders);
        }
        updateShowFloder(host, property, oldvalue) {
            var floder = editor.editorAsset.showFloder;
            if (!floder)
                return;
            var textFlow = new Array();
            do {
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floder.label, style: { "href": `event:${floder.asset.assetId}` } });
                floder = floder.parent;
            } while (floder);
            this.floderpathTxt.textFlow = textFlow;
            var children = editor.editorAsset.showFloder.children;
            try {
                var excludeReg = new RegExp(this.excludeTxt.text);
            }
            catch (error) {
                excludeReg = new RegExp("");
            }
            try {
                var includeReg = new RegExp(this.includeTxt.text);
            }
            catch (error) {
                includeReg = new RegExp("");
            }
            var fileinfos = children.filter((value) => {
                if (this.includeTxt.text) {
                    if (!includeReg.test(value.label))
                        return false;
                }
                if (this.excludeTxt.text) {
                    if (excludeReg.test(value.label))
                        return false;
                }
                return true;
            });
            var nodes = fileinfos.map((value) => { return value; });
            nodes = nodes.sort((a, b) => {
                if (a.isDirectory > b.isDirectory)
                    return -1;
                if (a.isDirectory < b.isDirectory)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 1;
            });
            this.filelistData.replaceAll(nodes);
            this.filelist.scrollV = 0;
            this.selectedfilechanged();
        }
        onfilter() {
            this.updateShowFloder();
        }
        selectedfilechanged() {
            var selectedAssetFile = editor.editorData.selectedAssetNodes;
            if (selectedAssetFile.length > 0)
                this.filepathLabel.text = selectedAssetFile.map(v => {
                    return v.asset.fileName + v.asset.extenson;
                }).join(",");
            else
                this.filepathLabel.text = "";
        }
        onShowAsset() {
        }
        onfilelistclick(e) {
            if (e.target == this.filelist) {
                editor.editorData.clearSelectedObjects();
            }
        }
        onfilelistrightclick(e) {
            editor.editorData.clearSelectedObjects();
            editor.editorAsset.popupmenu(editor.editorAsset.showFloder);
        }
        onfloderpathTxtLink(evt) {
            editor.editorAsset.showFloder = editor.editorAsset.getAssetByID(evt.text);
        }
        onMouseDown(e) {
            if (e.target != this.filelist)
                return;
            if (feng3d.shortcut.getState("splitGroupDraging"))
                return;
            this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        }
        onMouseMove() {
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rectangle = this.filelist.getGlobalBounds();
            //
            areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
            //
            this._areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
            //
            var min = this.areaSelectStartPosition.clone().min(areaSelectEndPosition);
            var max = this.areaSelectStartPosition.clone().max(areaSelectEndPosition);
            var areaRect = new feng3d.Rectangle(min.x, min.y, max.x - min.x, max.y - min.y);
            //
            var datas = this.filelist.$indexToRenderer.filter(v => {
                var rectangle = v.getGlobalBounds();
                return areaRect.intersects(rectangle);
            }).map(v => v.data);
            editor.editorData.selectMultiObject(datas);
        }
        onMouseUp() {
            this._areaSelectRect.hide();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        }
    }
    ProjectView.moduleName = "Project";
    editor.ProjectView = ProjectView;
    class FileDrag {
        constructor(displayobject) {
            this.addEventListener = () => {
                document.addEventListener("dragenter", dragenter, false);
                document.addEventListener("dragover", dragover, false);
                document.addEventListener("drop", drop, false);
            };
            this.removeEventListener = () => {
                document.removeEventListener("dragenter", dragenter, false);
                document.removeEventListener("dragover", dragover, false);
                document.removeEventListener("drop", drop, false);
            };
            function dragenter(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            function dragover(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            function drop(e) {
                e.stopPropagation();
                e.preventDefault();
                var dt = e.dataTransfer;
                var fileList = dt.files;
                var files = [];
                for (let i = 0; i < fileList.length; i++) {
                    files[i] = fileList[i];
                }
                if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY)) {
                    editor.editorAsset.inputFiles(files);
                }
            }
        }
    }
    editor.Modules.moduleViewCls[ProjectView.moduleName] = ProjectView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class AssetFileTemplates {
        /**
         *
         * @param scriptName 脚本名称（类名）
         */
        getNewScript(scriptName) {
            return scriptTemplate.replace("NewScript", scriptName);
        }
        /**
         *
         * @param shadername shader名称
         */
        getNewShader(shadername) {
            return shaderTemplate.replace(new RegExp("NewShader", "g"), shadername);
        }
    }
    editor.AssetFileTemplates = AssetFileTemplates;
    editor.assetFileTemplates = new AssetFileTemplates();
    var scriptTemplate = `
class NewScript extends feng3d.Script
{

    /** 
     * 测试属性 
     */
    @feng3d.serialize
    @feng3d.oav()
    t_attr = new feng3d.Color4();

    /**
     * 初始化时调用
     */
    init()
    {

    }

    /**
     * 更新
     */
    update()
    {

    }

    /**
     * 销毁时调用
     */
    dispose()
    {

    }
}`;
    var shaderTemplate = `
class NewShaderUniforms
{
    /** 
     * 颜色 
     */
    @feng3d.serialize
    @feng3d.oav()
    u_color = new feng3d.Color4();
}

feng3d.shaderConfig.shaders["NewShader"] = {
    cls: NewShaderUniforms,
    vertex: \`
    
    attribute vec3 a_position;
    
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewProjection;
    
    void main() {
    
        vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);
        gl_Position = u_viewProjection * globalPosition;
    }\`,
    fragment: \`
    
    precision mediump float;
    
    uniform vec4 u_color;
    
    void main() {
        
        gl_FragColor = u_color;
    }
    \`,
};

type NewShaderMaterial = feng3d.Material & { uniforms: NewShaderUniforms; };
interface MaterialFactory
{
    create(shader: "NewShader", raw?: feng3d.gPartial<NewShaderMaterial>): NewShaderMaterial;
}

interface MaterialRawMap
{
    NewShader: feng3d.gPartial<NewShaderMaterial>;
}`;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class TopView extends eui.Component {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "TopView";
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.moveButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.rotateButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.scaleButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.worldButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.centerButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.playBtn.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.helpButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.settingButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.qrcodeButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            feng3d.globalDispatcher.on("editor.toolTypeChanged", this.updateview, this);
            //
            var menuItems = editor.menuConfig.getMainMenu();
            var menuItem = editor.menu.handleShow({ submenu: menuItems });
            menuItems = menuItem.submenu;
            menuItems = menuItems.filter(v => v.type != "separator");
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menuItems);
            //
            this.menuList.itemRenderer = TopMenuItemRenderer;
            this.menuList.dataProvider = dataProvider;
            this.updateview();
        }
        onRemovedFromStage() {
            this.moveButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.rotateButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.scaleButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.worldButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.centerButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.playBtn.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.helpButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.settingButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.qrcodeButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            feng3d.globalDispatcher.off("editor.toolTypeChanged", this.updateview, this);
            if (editor.runwin)
                editor.runwin.close();
            editor.runwin = null;
        }
        onHelpButtonClick() {
            window.open("http://feng3d.com");
        }
        onButtonClick(event) {
            switch (event.currentTarget) {
                case this.moveButton:
                    editor.editorData.toolType = editor.MRSToolType.MOVE;
                    break;
                case this.rotateButton:
                    editor.editorData.toolType = editor.MRSToolType.ROTATION;
                    break;
                case this.scaleButton:
                    editor.editorData.toolType = editor.MRSToolType.SCALE;
                    break;
                case this.worldButton:
                    editor.editorData.isWoldCoordinate = !editor.editorData.isWoldCoordinate;
                    break;
                case this.centerButton:
                    editor.editorData.isBaryCenter = !editor.editorData.isBaryCenter;
                    break;
                case this.playBtn:
                    var e = feng3d.globalDispatcher.dispatch("inspector.saveShowData", () => {
                        let obj = feng3d.serialization.serialize(editor.editorData.gameScene.gameObject);
                        editor.editorRS.fs.writeObject("default.scene.json", obj, (err) => {
                            if (err) {
                                console.warn(err);
                                return;
                            }
                            if (editor.editorRS.fs.type == feng3d.FSType.indexedDB) {
                                if (editor.runwin)
                                    editor.runwin.close();
                                editor.runwin = window.open(`run.html?fstype=${feng3d.fs.type}&project=${editor.editorcache.projectname}`);
                                return;
                            }
                            var path = editor.editorRS.fs.getAbsolutePath("index.html");
                            if (editor.runwin)
                                editor.runwin.close();
                            editor.runwin = window.open(path);
                        });
                    });
                    var a = e;
                    break;
                case this.qrcodeButton:
                    setTimeout(() => {
                        $('#output').show();
                    }, 10);
                    break;
            }
        }
        updateview() {
            this.labelLab.text = editor.editorcache.projectname;
            this.moveButton.selected = editor.editorData.toolType == editor.MRSToolType.MOVE;
            this.rotateButton.selected = editor.editorData.toolType == editor.MRSToolType.ROTATION;
            this.scaleButton.selected = editor.editorData.toolType == editor.MRSToolType.SCALE;
            this.worldButton.selected = !editor.editorData.isWoldCoordinate;
            this.centerButton.selected = editor.editorData.isBaryCenter;
        }
    }
    editor.TopView = TopView;
    var showMenuItem;
    var items;
    class TopMenuItemRenderer extends eui.ItemRenderer {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "TopMenuItemRender";
        }
        dataChanged() {
            super.dataChanged();
            this.updateView();
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);
            this.updateView();
        }
        onRemovedFromStage() {
            this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
        }
        updateView() {
            if (!this.data)
                return;
            this.touchEnabled = true;
            this.touchChildren = true;
            this.skin.currentState = "normal";
            this.selectedRect.visible = false;
        }
        onItemMouseDown(event) {
            if (showMenuItem)
                return;
            var list = this.parent;
            console.assert(list instanceof eui.List);
            items = list.$children.filter(v => v instanceof TopMenuItemRenderer).map((v) => { return { item: v, rect: v.getGlobalBounds() }; });
            showMenu(this);
            feng3d.windowEventProxy.on("mousemove", onMenuMouseMove);
        }
    }
    editor.TopMenuItemRenderer = TopMenuItemRenderer;
    function showMenu(item) {
        removeMenu();
        //
        var rect = item.getTransformedBounds(item.stage);
        var menuView = editor.menu.popup(item.data.submenu);
        menuView.x = rect.x;
        menuView.y = rect.bottom;
        menuView.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromeStage, null);
        showMenuItem = { menu: menuView, item: item };
    }
    function onMenuMouseMove() {
        var p = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var overitem = items.filter(v => v.rect.contains(p.x, p.y))[0];
        if (!overitem)
            return;
        if (showMenuItem.item == overitem.item)
            return;
        showMenu(overitem.item);
    }
    function removeMenu() {
        if (showMenuItem) {
            showMenuItem.menu.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromeStage, null);
            showMenuItem.menu.remove();
        }
        ;
        showMenuItem = null;
    }
    function onRemoveFromeStage() {
        removeMenu();
        feng3d.windowEventProxy.off("mousemove", onMenuMouseMove);
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    class NavigationView extends eui.Component {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "NavigationView";
            this.moduleName = NavigationView.moduleName;
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
        }
        onRemovedFromStage() {
        }
    }
    NavigationView.moduleName = "Navigation";
    editor.NavigationView = NavigationView;
    editor.Modules.moduleViewCls[NavigationView.moduleName] = NavigationView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 主分割界面
     *
     * 用于管理分割界面，以及处理界面布局
     */
    class MainSplitView extends eui.Component {
        constructor() {
            super();
            this.skinName = "MainSplitView";
        }
        childrenCreated() {
            super.childrenCreated();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            feng3d.globalDispatcher.on("viewLayout.changed", this._saveViewLayout, this);
            feng3d.globalDispatcher.on("viewLayout.reset", this._resetLayout, this);
            this._initViewLayout();
        }
        onRemovedFromStage() {
            feng3d.globalDispatcher.off("viewLayout.changed", this._saveViewLayout, this);
            feng3d.globalDispatcher.off("viewLayout.reset", this._resetLayout, this);
        }
        _initViewLayout() {
            if (!this.view) {
                editor.editorcache.viewLayout = editor.editorcache.viewLayout || editor.viewLayoutConfig.Default;
                //
                this.view = this._createViews(editor.editorcache.viewLayout);
                this.addChild(this.view);
            }
        }
        _saveViewLayout() {
            var sp = this.getChildAt(0);
            var data = this._getData(sp);
            editor.editorcache.viewLayout = data;
        }
        _resetLayout(event) {
            editor.editorcache.viewLayout = event.data || editor.viewLayoutConfig.Default;
            if (this.view != null) {
                this.view.remove();
                this._resolve(this.view);
                this.view = null;
            }
            this._initViewLayout();
        }
        _resolve(sp) {
            if (sp instanceof editor.SplitGroup) {
                sp.$children.forEach(v => this._resolve(v));
            }
            if (sp instanceof editor.TabView) {
                sp["_moduleViews"].forEach(v => {
                    editor.modules.recycleModuleView(v);
                });
            }
        }
        _getData(sp) {
            let data = {};
            data.x = sp.x;
            data.y = sp.y;
            data.width = sp.width;
            data.height = sp.height;
            if (sp instanceof eui.Group || sp instanceof eui.Component) {
                data.percentWidth = sp.percentWidth;
                data.percentHeight = sp.percentHeight;
                data.top = sp.top;
                data.bottom = sp.bottom;
                data.left = sp.left;
                data.right = sp.right;
            }
            if (sp instanceof editor.SplitGroup) {
                data.type = "SplitGroup";
                if (sp.layout instanceof eui.HorizontalLayout) {
                    data.layout = "HorizontalLayout";
                }
                else if (sp.layout instanceof eui.VerticalLayout) {
                    data.layout = "VerticalLayout";
                }
                var children = [];
                for (let i = 0; i < sp.numChildren; i++) {
                    const element = sp.getChildAt(i);
                    children[i] = this._getData(element);
                }
                data.children = children;
            }
            if (sp instanceof editor.TabView) {
                data.type = "TabView";
                data.modules = sp.getModuleNames();
            }
            return data;
        }
        _createViews(data) {
            var displayObject;
            if (data.type == "SplitGroup") {
                var splitGroup = displayObject = new editor.SplitGroup();
                if (data.layout == "HorizontalLayout") {
                    let horizontalLayout = splitGroup.layout = new eui.HorizontalLayout();
                    horizontalLayout.gap = 2;
                }
                else if (data.layout == "VerticalLayout") {
                    let verticalLayout = splitGroup.layout = new eui.VerticalLayout();
                    verticalLayout.gap = 2;
                }
                var children = data.children;
                for (let i = 0; i < children.length; i++) {
                    let child = this._createViews(children[i]);
                    splitGroup.addChild(child);
                }
            }
            else if (data.type == "TabView") {
                var tabView = displayObject = new editor.TabView();
                tabView.setModuleNames(data.modules);
            }
            if (displayObject instanceof eui.Group || displayObject instanceof eui.Component) {
                if (data.percentWidth == null)
                    data.percentWidth = NaN;
                if (data.percentHeight == null)
                    data.percentHeight = NaN;
                if (data.top == null)
                    data.top = NaN;
                if (data.bottom == null)
                    data.bottom = NaN;
                if (data.left == null)
                    data.left = NaN;
                if (data.right == null)
                    data.right = NaN;
                //
                displayObject.percentWidth = data.percentWidth;
                displayObject.percentHeight = data.percentHeight;
                displayObject.top = data.top;
                displayObject.bottom = data.bottom;
                displayObject.left = data.left;
                displayObject.right = data.right;
            }
            displayObject.x = data.x;
            displayObject.y = data.y;
            displayObject.width = data.width;
            displayObject.height = data.height;
            return displayObject;
        }
    }
    editor.MainSplitView = MainSplitView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class MainView extends eui.Component {
        constructor() {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "MainViewSkin";
        }
        onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        }
        onAddedToStage() {
            window.addEventListener("resize", this.onresize.bind(this));
            this.onresize();
        }
        onRemovedFromStage() {
            window.removeEventListener("resize", this.onresize.bind(this));
        }
        onresize() {
            this.stage.setContentSize(window.innerWidth, window.innerHeight);
            editor.editorui.mainview.width = this.stage.stageWidth;
            editor.editorui.mainview.height = this.stage.stageHeight;
        }
    }
    editor.MainView = MainView;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    class AssetAdapter {
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        getAsset(source, compFunc, thisObject) {
            function onGetRes(data) {
                compFunc.call(thisObject, data, source);
            }
            if (RES.hasRes(source)) {
                let data = RES.getRes(source);
                if (data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source, onGetRes, this);
                }
            }
            else {
                RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
    }
    editor.AssetAdapter = AssetAdapter;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    class LoadingUI extends egret.Sprite {
        constructor() {
            super();
            this.createView();
        }
        createView() {
            this.textField = new egret.TextField();
            this.addChild(this.textField);
            this.textField.y = 300;
            this.textField.width = 480;
            this.textField.height = 100;
            this.textField.textAlign = "center";
        }
        setProgress(current, total) {
            this.textField.text = `Loading...${current}/${total}`;
        }
    }
    editor.LoadingUI = LoadingUI;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    class MainUI extends eui.UILayer {
        constructor(onComplete = null) {
            super();
            this.isThemeLoadEnd = false;
            this.isResourceLoadEnd = false;
            this.onComplete = onComplete;
        }
        createChildren() {
            super.createChildren();
            //inject the custom material parser
            //注入自定义的素材解析器
            let assetAdapter = new editor.AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new editor.ThemeAdapter());
            //Config loading process interface
            //设置加载进度界面
            this.loadingView = new editor.LoadingUI();
            this.stage.addChild(this.loadingView);
            // initialize the Resource loading library
            //初始化Resource资源加载库
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig("./resource/default.res.json", "./resource/");
        }
        /**
         * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
         * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
         */
        onConfigComplete(event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("./resource/default.thm.json", this.stage);
            theme.once(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup("preload");
        }
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        onThemeLoadComplete() {
            this.isThemeLoadEnd = true;
            this.createScene();
        }
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        onResourceLoadComplete(event) {
            if (event.groupName == "preload") {
                this.stage.removeChild(this.loadingView);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                this.isResourceLoadEnd = true;
                this.createScene();
            }
        }
        createScene() {
            if (this.isThemeLoadEnd && this.isResourceLoadEnd && this.onComplete) {
                this.onComplete();
            }
        }
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        onItemLoadError(event) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        }
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        onResourceLoadError(event) {
            //TODO
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //ignore loading failed projects
            this.onResourceLoadComplete(event);
        }
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        onResourceProgress(event) {
            if (event.groupName == "preload") {
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        }
    }
    editor.MainUI = MainUI;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    class ThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url, compFunc, errorFunc, thisObject) {
            function onGetRes(e) {
                compFunc.call(thisObject, e);
            }
            function onError(e) {
                if (e.resItem.url == url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
            }
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
            RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
        }
    }
    editor.ThemeAdapter = ThemeAdapter;
})(editor || (editor = {}));
var editor;
(function (editor) {
    editor.editorui = {};
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 游戏对象控制器类型
     */
    let MRSToolType;
    (function (MRSToolType) {
        /**
         * 移动
         */
        MRSToolType[MRSToolType["MOVE"] = 0] = "MOVE";
        /**
         * 旋转
         */
        MRSToolType[MRSToolType["ROTATION"] = 1] = "ROTATION";
        /**
         * 缩放
         */
        MRSToolType[MRSToolType["SCALE"] = 2] = "SCALE";
    })(MRSToolType = editor.MRSToolType || (editor.MRSToolType = {}));
    /**
     * 编辑器数据
     */
    class EditorData {
        constructor() {
            this._selectedObjects = [];
            /**
             * 被复制的对象
             */
            this.copyObjects = [];
            this._toolType = MRSToolType.MOVE;
            this._selectedGameObjects = [];
            this._selectedGameObjectsInvalid = true;
            this._isBaryCenter = true;
            this._isWoldCoordinate = false;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._selectedAssetNodes = [];
            /**
             * 历史记录undo列表
             */
            this.undoList = [];
        }
        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        get selectedObjects() {
            return this._selectedObjects;
        }
        set selectedObjects(v) {
            v = v.filter(v => !!v);
            if (!v)
                v = [];
            if (v == this._selectedObjects)
                return;
            if (v.length == this.selectedObjects.length && Array.unique(v.concat(this._selectedObjects)).length == v.length)
                return;
            this._selectedObjects = v;
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.globalDispatcher.dispatch("editor.selectedObjectsChanged");
        }
        clearSelectedObjects() {
            this.selectedObjects = [];
        }
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(object) {
            var selecteds = this.selectedObjects.concat();
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd)
                selecteds.length = 0;
            //
            var index = selecteds.indexOf(object);
            if (index == -1)
                selecteds.push(object);
            else
                selecteds.splice(index, 1);
            //
            this.selectedObjects = selecteds;
        }
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectMultiObject(objs, isAdd) {
            var selecteds = this.selectedObjects.concat();
            if (isAdd === undefined) {
                isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            }
            if (!isAdd)
                selecteds.length = 0;
            //
            objs.forEach(v => {
                var index = selecteds.indexOf(v);
                if (index == -1)
                    selecteds.push(v);
                else
                    selecteds.splice(index, 1);
            });
            //
            this.selectedObjects = selecteds;
        }
        /**
         * 使用的控制工具类型
         */
        get toolType() {
            return this._toolType;
        }
        set toolType(v) {
            if (this._toolType == v)
                return;
            this._toolType = v;
            feng3d.globalDispatcher.dispatch("editor.toolTypeChanged");
        }
        /**
         * 选中游戏对象列表
         */
        get selectedGameObjects() {
            if (this._selectedGameObjectsInvalid) {
                this._selectedGameObjects.length = 0;
                this.selectedObjects.forEach(v => {
                    if (v instanceof feng3d.GameObject)
                        this._selectedGameObjects.push(v);
                });
                this._selectedGameObjectsInvalid = false;
            }
            return this._selectedGameObjects;
        }
        /**
         * 坐标原点是否在质心
         */
        get isBaryCenter() {
            return this._isBaryCenter;
        }
        set isBaryCenter(v) {
            if (this._isBaryCenter == v)
                return;
            this._isBaryCenter = v;
            this._transformBoxInvalid = true;
            feng3d.globalDispatcher.dispatch("editor.isBaryCenterChanged");
        }
        /**
         * 是否使用世界坐标
         */
        get isWoldCoordinate() {
            return this._isWoldCoordinate;
        }
        set isWoldCoordinate(v) {
            if (this._isWoldCoordinate == v)
                return;
            this._isWoldCoordinate = v;
            feng3d.globalDispatcher.dispatch("editor.isWoldCoordinateChanged");
        }
        /**
         * 变换对象
         */
        get transformGameObject() {
            if (this._transformGameObjectInvalid) {
                var length = this.selectedGameObjects.length;
                if (length > 0)
                    this._transformGameObject = this.selectedGameObjects[length - 1];
                else
                    this._transformGameObject = null;
                this._transformGameObjectInvalid = false;
            }
            return this._transformGameObject;
        }
        get transformBox() {
            if (this._transformBoxInvalid) {
                var length = this.selectedGameObjects.length;
                if (length > 0) {
                    this._transformBox = null;
                    this.selectedGameObjects.forEach(cv => {
                        var box = cv.worldBounds;
                        if (editor.editorData.isBaryCenter || this._transformBox == null) {
                            this._transformBox = box.clone();
                        }
                        else {
                            this._transformBox.union(box);
                        }
                    });
                }
                else {
                    this._transformBox = null;
                }
                this._transformBoxInvalid = false;
            }
            return this._transformBox;
        }
        /**
         * 选中游戏对象列表
         */
        get selectedAssetNodes() {
            if (this._selectedAssetFileInvalid) {
                this._selectedAssetNodes.length = 0;
                this.selectedObjects.forEach(v => {
                    if (v instanceof editor.AssetNode)
                        this._selectedAssetNodes.push(v);
                });
                this._selectedAssetFileInvalid = false;
            }
            return this._selectedAssetNodes;
        }
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetPath(url) {
            return document.URL.substring(0, document.URL.lastIndexOf("/") + 1) + "resource/" + url;
        }
    }
    editor.EditorData = EditorData;
    editor.editorData = new EditorData();
})(editor || (editor = {}));
var editor;
(function (editor) {
    class MRSToolTarget {
        constructor() {
            this._startScaleVec = [];
            this._position = new feng3d.Vector3();
            this._rotation = new feng3d.Vector3();
            feng3d.globalDispatcher.on("editor.isWoldCoordinateChanged", this.invalidateControllerImage, this);
            feng3d.globalDispatcher.on("editor.isBaryCenterChanged", this.invalidateControllerImage, this);
            //
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
        }
        get controllerTool() {
            return this._controllerTool;
        }
        set controllerTool(value) {
            this._controllerTool = value;
            if (this._controllerTool) {
                this._controllerTool.position = this._position;
                this._controllerTool.rotation = this._rotation;
            }
        }
        set controllerTargets(value) {
            if (this._controllerTargets) {
                this._controllerTargets.forEach(v => {
                    v.off("scenetransformChanged", this.invalidateControllerImage, this);
                });
            }
            this._controllerTargets = value;
            if (this._controllerTargets) {
                this._controllerTargets.forEach(v => {
                    v.on("scenetransformChanged", this.invalidateControllerImage, this);
                });
            }
            this.invalidateControllerImage();
        }
        onSelectedGameObjectChange() {
            //筛选出 工具控制的对象
            var transforms = editor.editorData.selectedGameObjects.reduce((result, item) => {
                result.push(item.transform);
                return result;
            }, []);
            if (transforms.length > 0) {
                this.controllerTargets = transforms;
            }
            else {
                this.controllerTargets = null;
            }
        }
        invalidateControllerImage() {
            feng3d.ticker.nextframe(this.updateControllerImage, this);
        }
        updateControllerImage() {
            if (!this._controllerTargets || this._controllerTargets.length == 0)
                return;
            var transform = this._controllerTargets[this._controllerTargets.length - 1];
            var position = new feng3d.Vector3();
            if (editor.editorData.isBaryCenter) {
                position.copy(transform.worldPosition);
            }
            else {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    position.add(this._controllerTargets[i].worldPosition);
                }
                position.scaleNumber(1 / this._controllerTargets.length);
            }
            var rotation = new feng3d.Vector3();
            if (!editor.editorData.isWoldCoordinate) {
                rotation = this._controllerTargets[0].rotation;
            }
            this._position = position;
            this._rotation = rotation;
            if (this._controllerTool) {
                this._controllerTool.position = position;
                this._controllerTool.rotation = rotation;
            }
        }
        /**
         * 开始移动
         */
        startTranslation() {
            this._startTransformDic = new Map();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        }
        translation(addPos) {
            if (!this._controllerTargets)
                return;
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var gameobject = objects[i];
                var transform = this._startTransformDic.get(gameobject);
                var localMove = addPos.clone();
                if (gameobject.parent)
                    localMove = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                gameobject.position = transform.position.addTo(localMove);
            }
        }
        stopTranslation() {
            this._startTransformDic = null;
        }
        startRotate() {
            this._startTransformDic = new Map();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        }
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle, normal) {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var localnormal;
            var gameobject = objects[0];
            if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempTransform = this._startTransformDic.get(gameobject);
                if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                    gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                }
                else {
                    localnormal = normal.clone();
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (editor.editorData.isBaryCenter) {
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                    else {
                        var localPivotPoint = this._position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempTransform.position.x, tempTransform.position.y, tempTransform.position.z).appendRotation(localnormal, angle, localPivotPoint).getPosition();
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                }
            }
        }
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1, normal1, angle2, normal2) {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var gameobject = objects[0];
            if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                if (gameobject.parent) {
                    normal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                    normal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                }
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempsceneTransform = this._startTransformDic.get(gameobject);
                var tempPosition = tempsceneTransform.position.clone();
                var tempRotation = tempsceneTransform.rotation.clone();
                if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                    tempRotation = this.rotateRotation(tempRotation, normal2, angle2);
                    gameobject.rotation = this.rotateRotation(tempRotation, normal1, angle1);
                }
                else {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (gameobject.parent) {
                        localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (editor.editorData.isBaryCenter) {
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    }
                    else {
                        var localPivotPoint = this._position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = feng3d.Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).getPosition();
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).getPosition();
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    }
                }
            }
        }
        stopRote() {
            this._startTransformDic = null;
        }
        startScale() {
            for (var i = 0; i < this._controllerTargets.length; i++) {
                this._startScaleVec[i] = this._controllerTargets[i].scale.clone();
            }
        }
        doScale(scale) {
            console.assert(!!scale.length);
            for (var i = 0; i < this._controllerTargets.length; i++) {
                var result = this._startScaleVec[i].multiplyTo(scale);
                this._controllerTargets[i].sx = result.x;
                this._controllerTargets[i].sy = result.y;
                this._controllerTargets[i].sz = result.z;
            }
        }
        stopScale() {
            this._startScaleVec.length = 0;
        }
        getTransformData(transform) {
            return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
        }
        rotateRotation(rotation, axis, angle) {
            var rotationmatrix = new feng3d.Matrix4x4();
            rotationmatrix.fromRotation(rotation.x, rotation.y, rotation.z);
            rotationmatrix.appendRotation(axis, angle);
            var newrotation = rotationmatrix.decompose()[1];
            var v = Math.round((newrotation.x - rotation.x) / 180);
            if (v % 2 != 0) {
                newrotation.x += 180;
                newrotation.y = 180 - newrotation.y;
                newrotation.z += 180;
            }
            function toround(a, b, c = 360) {
                return Math.round((b - a) / c) * c + a;
            }
            newrotation.x = toround(newrotation.x, rotation.x);
            newrotation.y = toround(newrotation.y, rotation.y);
            newrotation.z = toround(newrotation.z, rotation.z);
            return newrotation;
        }
    }
    editor.MRSToolTarget = MRSToolTarget;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 移动工具模型组件
     */
    let MToolModel = class MToolModel extends feng3d.Component {
        init() {
            super.init();
            this.gameObject.name = "GameObjectMoveModel";
            this.initModels();
        }
        initModels() {
            this.xAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.transform.rz = -90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1, 1);
            this.zAxis.transform.rx = 90;
            this.gameObject.addChild(this.zAxis.gameObject);
            this.yzPlane = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "yzPlane" }).addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0, 1);
            this.yzPlane.transform.rz = 90;
            this.gameObject.addChild(this.yzPlane.gameObject);
            this.xzPlane = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xzPlane" }).addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.xzPlane.gameObject);
            this.xyPlane = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xyPlane" }).addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1, 1);
            this.xyPlane.transform.rx = -90;
            this.gameObject.addChild(this.xyPlane.gameObject);
            this.oCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(CoordinateCube);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    };
    MToolModel = __decorate([
        feng3d.RegisterComponent()
    ], MToolModel);
    editor.MToolModel = MToolModel;
    let CoordinateAxis = class CoordinateAxis extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.color = new feng3d.Color4(1, 0, 0, 0.99);
            this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            this.length = 100;
            //
            this.selected = false;
        }
        init() {
            super.init();
            feng3d.watcher.watch(this, "selected", this.update, this);
            var xLine = new feng3d.GameObject();
            var model = xLine.addComponent(feng3d.Renderable);
            var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            segmentGeometry.addSegment({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.length, 0) });
            this.segmentMaterial = model.material = feng3d.Material.create("segment");
            this.gameObject.addChild(xLine);
            //
            this.xArrow = new feng3d.GameObject();
            model = this.xArrow.addComponent(feng3d.Renderable);
            model.geometry = feng3d.serialization.setValue(new feng3d.ConeGeometry(), { bottomRadius: 5, height: 18 });
            this.material = model.material = feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "color" });
            this.material.renderParams.enableBlend = true;
            this.xArrow.transform.y = this.length;
            this.gameObject.addChild(this.xArrow);
            var mouseHit = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "hitCoordinateAxis" });
            model = mouseHit.addComponent(feng3d.Renderable);
            model.geometry = feng3d.serialization.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length });
            //model.material = materialFactory.create("color");
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        }
        update() {
            if (!this.isinit)
                return;
            var color = this.selected ? this.selectedColor : this.color;
            this.segmentMaterial.uniforms.u_segmentColor = color;
            //
            this.material.uniforms.u_diffuseInput = color;
        }
    };
    CoordinateAxis = __decorate([
        feng3d.RegisterComponent()
    ], CoordinateAxis);
    editor.CoordinateAxis = CoordinateAxis;
    let CoordinateCube = class CoordinateCube extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.isinit = false;
            this.color = new feng3d.Color4(1, 1, 1, 0.99);
            this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            this.selected = false;
        }
        init() {
            super.init();
            feng3d.watcher.watch(this, "selected", this.update, this);
            //
            this.oCube = new feng3d.GameObject();
            var model = this.oCube.addComponent(feng3d.Renderable);
            model.geometry = feng3d.serialization.setValue(new feng3d.CubeGeometry(), { width: 8, height: 8, depth: 8 });
            this.colorMaterial = model.material = feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "color" });
            this.colorMaterial.renderParams.enableBlend = true;
            this.oCube.mouseEnabled = true;
            this.gameObject.addChild(this.oCube);
            this.isinit = true;
            this.update();
        }
        update() {
            if (!this.isinit)
                return;
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
        }
    };
    CoordinateCube = __decorate([
        feng3d.RegisterComponent()
    ], CoordinateCube);
    editor.CoordinateCube = CoordinateCube;
    class CoordinatePlane extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.color = new feng3d.Color4(1, 0, 0, 0.2);
            this.borderColor = new feng3d.Color4(1, 0, 0, 0.99);
            this.selectedColor = new feng3d.Color4(1, 0, 0, 0.5);
            this.selectedborderColor = new feng3d.Color4(1, 1, 0, 0.99);
            this._width = 20;
            //
            this.selected = false;
        }
        //
        get width() { return this._width; }
        init() {
            super.init();
            feng3d.watcher.watch(this, "selected", this.update, this);
            var plane = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "plane" });
            var model = plane.addComponent(feng3d.Renderable);
            plane.transform.x = plane.transform.z = this._width / 2;
            model.geometry = feng3d.serialization.setValue(new feng3d.PlaneGeometry(), { width: this._width, height: this._width });
            this.colorMaterial = model.material = feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "color" });
            this.colorMaterial.renderParams.cullFace = feng3d.CullFace.NONE;
            this.colorMaterial.renderParams.enableBlend = true;
            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);
            var border = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "border" });
            model = border.addComponent(feng3d.Renderable);
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            model.material = feng3d.Material.create("segment", { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) });
            this.gameObject.addChild(border);
            this.isinit = true;
            this.update();
        }
        update() {
            if (!this.isinit)
                return;
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
            var color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(0, 0, 0), end: new feng3d.Vector3(this._width, 0, 0), startColor: color, endColor: color }];
            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, 0), end: new feng3d.Vector3(this._width, 0, this._width), startColor: color, endColor: color });
            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, this._width), end: new feng3d.Vector3(0, 0, this._width), startColor: color, endColor: color });
            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(0, 0, this._width), end: new feng3d.Vector3(0, 0, 0), startColor: color, endColor: color });
        }
    }
    editor.CoordinatePlane = CoordinatePlane;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 旋转工具模型组件
     */
    let RToolModel = class RToolModel extends feng3d.Component {
        init() {
            super.init();
            this.gameObject.name = "GameObjectRotationModel";
            this.initModels();
        }
        initModels() {
            this.xAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);
            this.cameraAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "cameraAxis" }).addComponent(CoordinateRotationAxis);
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);
            this.freeAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "freeAxis" }).addComponent(CoordinateRotationFreeAxis);
            this.freeAxis.color.setTo(1, 1, 1);
            this.freeAxis.update();
            this.gameObject.addChild(this.freeAxis.gameObject);
        }
    };
    RToolModel = __decorate([
        feng3d.RegisterComponent()
    ], RToolModel);
    editor.RToolModel = RToolModel;
    let CoordinateRotationAxis = class CoordinateRotationAxis extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.radius = 80;
            this.color = new feng3d.Color4(1, 0, 0, 0.99);
            this.backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
            this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            this.selected = false;
        }
        init() {
            super.init();
            feng3d.watcher.watch(this, "selected", this.update, this);
            feng3d.watcher.watch(this, "filterNormal", this.update, this);
            this.initModels();
        }
        initModels() {
            var border = new feng3d.GameObject();
            var model = border.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            var mouseHit = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Renderable);
            this.torusGeometry = model.geometry = feng3d.serialization.setValue(new feng3d.TorusGeometry(), { radius: this.radius, tubeRadius: 2 });
            model.material = new feng3d.Material();
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        }
        update() {
            if (!this.isinit)
                return;
            this.sector.radius = this.radius;
            this.torusGeometry.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;
            var inverseGlobalMatrix = this.transform.worldToLocalMatrix;
            if (this.filterNormal) {
                var localNormal = inverseGlobalMatrix.deltaTransformVector(this.filterNormal);
            }
            this.segmentGeometry.segments = [];
            var points = [];
            for (var i = 0; i <= 360; i++) {
                points[i] = new feng3d.Vector3(Math.sin(i * Math.DEG2RAD), Math.cos(i * Math.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0) {
                    var show = true;
                    if (localNormal) {
                        show = points[i - 1].dot(localNormal) > 0 && points[i].dot(localNormal) > 0;
                    }
                    if (show) {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                    }
                    else if (this.selected) {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: this.backColor, endColor: this.backColor });
                    }
                }
            }
        }
        showSector(startPos, endPos) {
            var inverseGlobalMatrix = this.transform.worldToLocalMatrix;
            var localStartPos = inverseGlobalMatrix.transformVector(startPos);
            var localEndPos = inverseGlobalMatrix.transformVector(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * Math.RAD2DEG;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * Math.RAD2DEG;
            //
            var min = Math.min(startAngle, endAngle);
            var max = Math.max(startAngle, endAngle);
            if (max - min > 180) {
                min += 360;
            }
            this.sector.update(min, max);
            this.gameObject.addChild(this.sector.gameObject);
        }
        hideSector() {
            if (this.sector.gameObject.parent)
                this.sector.gameObject.parent.removeChild(this.sector.gameObject);
        }
    };
    CoordinateRotationAxis = __decorate([
        feng3d.RegisterComponent()
    ], CoordinateRotationAxis);
    editor.CoordinateRotationAxis = CoordinateRotationAxis;
    /**
     * 扇形对象
     */
    let SectorGameObject = class SectorGameObject extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.borderColor = new feng3d.Color4(0, 1, 1, 0.6);
            this.radius = 80;
            this._start = 0;
            this._end = 0;
        }
        /**
         * 构建3D对象
         */
        init() {
            super.init();
            this.gameObject.name = "sector";
            var model = this.gameObject.addComponent(feng3d.Renderable);
            this.geometry = model.geometry = new feng3d.CustomGeometry();
            model.material = feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "color", uniforms: { u_diffuseInput: new feng3d.Color4(0.5, 0.5, 0.5, 0.2) } });
            model.material.renderParams.enableBlend = true;
            model.material.renderParams.cullFace = feng3d.CullFace.NONE;
            var border = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "border" });
            model = border.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.isinit = true;
            this.update(0, 0);
        }
        update(start = 0, end = 0) {
            if (!this.isinit)
                return;
            this._start = Math.min(start, end);
            this._end = Math.max(start, end);
            var length = Math.floor(this._end - this._start);
            if (length == 0)
                length = 1;
            var vertexPositionData = [];
            var indices = [];
            vertexPositionData[0] = 0;
            vertexPositionData[1] = 0;
            vertexPositionData[2] = 0;
            for (var i = 0; i < length; i++) {
                vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * Math.DEG2RAD);
                vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * Math.DEG2RAD);
                vertexPositionData[i * 3 + 5] = 0;
                if (i > 0) {
                    indices[(i - 1) * 3] = 0;
                    indices[(i - 1) * 3 + 1] = i;
                    indices[(i - 1) * 3 + 2] = i + 1;
                }
            }
            if (indices.length == 0)
                indices = [0, 0, 0];
            this.geometry.positions = vertexPositionData;
            this.geometry.indices = indices;
            //绘制边界
            var startPoint = new feng3d.Vector3(this.radius * Math.cos((this._start - 0.1) * Math.DEG2RAD), this.radius * Math.sin((this._start - 0.1) * Math.DEG2RAD), 0);
            var endPoint = new feng3d.Vector3(this.radius * Math.cos((this._end + 0.1) * Math.DEG2RAD), this.radius * Math.sin((this._end + 0.1) * Math.DEG2RAD), 0);
            //
            this.segmentGeometry.segments = [
                { start: new feng3d.Vector3(), end: startPoint, startColor: this.borderColor, endColor: this.borderColor },
                { start: new feng3d.Vector3(), end: endPoint, startColor: this.borderColor, endColor: this.borderColor },
            ];
        }
    };
    SectorGameObject = __decorate([
        feng3d.RegisterComponent()
    ], SectorGameObject);
    editor.SectorGameObject = SectorGameObject;
    class CoordinateRotationFreeAxis extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.radius = 80;
            this.color = new feng3d.Color4(1, 0, 0, 0.99);
            this.backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
            this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            this.selected = false;
        }
        init() {
            super.init();
            feng3d.watcher.watch(this, "selected", this.update, this);
            this.initModels();
        }
        initModels() {
            var border = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "border" });
            var model = border.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) }
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.gameObject.addChild(this.sector.gameObject);
            this.isinit = true;
            this.update();
        }
        update() {
            if (!this.isinit)
                return;
            this.sector.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;
            var inverseGlobalMatrix = this.transform.worldToLocalMatrix;
            var segments = [];
            var points = [];
            for (var i = 0; i <= 360; i++) {
                points[i] = new feng3d.Vector3(Math.sin(i * Math.DEG2RAD), Math.cos(i * Math.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0) {
                    segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                }
            }
            this.segmentGeometry.segments = segments;
        }
    }
    editor.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 缩放工具模型组件
     */
    let SToolModel = class SToolModel extends feng3d.Component {
        init() {
            super.init();
            this.gameObject.name = "GameObjectScaleModel";
            this.initModels();
        }
        initModels() {
            this.xCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xCube" }).addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);
            this.yCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "yCube" }).addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);
            this.zCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "zCube" }).addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);
            this.oCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(editor.CoordinateCube);
            this.oCube.gameObject.transform.scale = new feng3d.Vector3(1.2, 1.2, 1.2);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    };
    SToolModel = __decorate([
        feng3d.RegisterComponent()
    ], SToolModel);
    editor.SToolModel = SToolModel;
    let CoordinateScaleCube = class CoordinateScaleCube extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.color = new feng3d.Color4(1, 0, 0, 0.99);
            this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            this.length = 100;
            //
            this.selected = false;
            //
            this.scaleValue = 1;
        }
        init() {
            super.init();
            feng3d.watcher.watch(this, "selected", this.update, this);
            feng3d.watcher.watch(this, "scaleValue", this.update, this);
            var xLine = new feng3d.GameObject();
            var model = xLine.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "coordinateCube" }).addComponent(editor.CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);
            var mouseHit = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Renderable);
            model.geometry = feng3d.serialization.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length - 4 });
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        }
        update() {
            if (!this.isinit)
                return;
            this.coordinateCube.color = this.color;
            this.coordinateCube.selectedColor = this.selectedColor;
            this.coordinateCube.update();
            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.scaleValue * this.length, 0), startColor: this.color, endColor: this.color }];
            //
            this.coordinateCube.transform.y = this.length * this.scaleValue;
            this.coordinateCube.selected = this.selected;
        }
    };
    CoordinateScaleCube = __decorate([
        feng3d.RegisterComponent()
    ], CoordinateScaleCube);
    editor.CoordinateScaleCube = CoordinateScaleCube;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class MRSToolBase extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.ismouseDown = false;
        }
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.invalidate(); }
        init() {
            super.init();
            var holdSizeComponent = this.gameObject.addComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.holdSize = 0.005;
            //
            this.on("addedToScene", this.onAddedToScene, this);
            this.on("removedFromScene", this.onRemovedFromScene, this);
        }
        onAddedToScene() {
            this.mrsToolTarget.controllerTool = this.transform;
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            feng3d.ticker.onframe(this.updateToolModel, this);
        }
        onRemovedFromScene() {
            this.mrsToolTarget.controllerTool = null;
            //
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
            feng3d.ticker.offframe(this.updateToolModel, this);
        }
        invalidate() {
            feng3d.ticker.nextframe(this.update, this);
        }
        update() {
            var holdSizeComponent = this.gameObject.getComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.camera = this._editorCamera;
        }
        onItemMouseDown(event) {
            feng3d.shortcut.activityState("inTransforming");
        }
        get toolModel() {
            return this._toolModel;
        }
        set toolModel(value) {
            if (this._toolModel)
                this.gameObject.removeChild(this._toolModel.gameObject);
            this._toolModel = value;
            ;
            if (this._toolModel) {
                this.gameObject.addChild(this._toolModel.gameObject);
            }
        }
        get selectedItem() {
            return this._selectedItem;
        }
        set selectedItem(value) {
            if (this._selectedItem == value)
                return;
            if (this._selectedItem)
                this._selectedItem.selected = false;
            this._selectedItem = value;
            if (this._selectedItem)
                this._selectedItem.selected = true;
        }
        updateToolModel() {
        }
        onMouseDown() {
            this.selectedItem = null;
            this.ismouseDown = true;
        }
        onMouseUp() {
            this.ismouseDown = false;
            this.movePlane3D = null;
            this.startSceneTransform = null;
            feng3d.ticker.nextframe(() => {
                feng3d.shortcut.deactivityState("inTransforming");
            });
        }
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        getLocalMousePlaneCross() {
            //射线与平面交点
            var crossPos = this.getMousePlaneCross();
            //把交点从世界转换为模型空间
            var inverseGlobalMatrix = this.startSceneTransform.clone();
            inverseGlobalMatrix.invert();
            crossPos = inverseGlobalMatrix.transformVector(crossPos);
            return crossPos;
        }
        getMousePlaneCross() {
            var line3D = this.gameObject.scene.mouseRay3D;
            //射线与平面交点
            var crossPos = this.movePlane3D.intersectWithLine3(line3D);
            return crossPos;
        }
    }
    editor.MRSToolBase = MRSToolBase;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 位移工具
     */
    let MTool = class MTool extends editor.MRSToolBase {
        constructor() {
            super(...arguments);
            /**
             * 用于判断是否改变了XYZ
             */
            this.changeXYZ = new feng3d.Vector3();
        }
        init() {
            super.init();
            this.toolModel = new feng3d.GameObject().addComponent(editor.MToolModel);
        }
        onAddedToScene() {
            super.onAddedToScene();
            this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yzPlane.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.xzPlane.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.xyPlane.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
        }
        onRemovedFromScene() {
            super.onRemovedFromScene();
            this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yzPlane.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.xzPlane.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.xyPlane.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
        }
        onItemMouseDown(event) {
            if (!feng3d.shortcut.getState("mouseInView3D"))
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            if (!this.editorCamera)
                return;
            super.onItemMouseDown(event);
            //全局矩阵
            var globalMatrix = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix.transformVector(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix.transformVector(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix.transformVector(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix.transformVector(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new feng3d.Plane();
            //
            switch (event.currentTarget) {
                case this.toolModel.xAxis:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.set(1, 0, 0);
                    break;
                case this.toolModel.yAxis:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.set(0, 1, 0);
                    break;
                case this.toolModel.zAxis:
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.set(0, 0, 1);
                    break;
                case this.toolModel.yzPlane:
                    this.selectedItem = this.toolModel.yzPlane;
                    this.movePlane3D.fromPoints(po, py, pz);
                    this.changeXYZ.set(0, 1, 1);
                    break;
                case this.toolModel.xzPlane:
                    this.selectedItem = this.toolModel.xzPlane;
                    this.movePlane3D.fromPoints(po, px, pz);
                    this.changeXYZ.set(1, 0, 1);
                    break;
                case this.toolModel.xyPlane:
                    this.selectedItem = this.toolModel.xyPlane;
                    this.movePlane3D.fromPoints(po, px, py);
                    this.changeXYZ.set(1, 1, 0);
                    break;
                case this.toolModel.oCube:
                    this.selectedItem = this.toolModel.oCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                    this.changeXYZ.set(1, 1, 1);
                    break;
            }
            //
            this.startSceneTransform = globalMatrix.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            this.startPos = this.toolModel.transform.position;
            this.mrsToolTarget.startTranslation();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }
        onMouseMove() {
            var crossPos = this.getLocalMousePlaneCross();
            var addPos = crossPos.subTo(this.startPlanePos);
            addPos.x *= this.changeXYZ.x;
            addPos.y *= this.changeXYZ.y;
            addPos.z *= this.changeXYZ.z;
            var sceneTransform = this.startSceneTransform.clone();
            sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
            var sceneAddpos = sceneTransform.getPosition().subTo(this.startSceneTransform.getPosition());
            this.mrsToolTarget.translation(sceneAddpos);
        }
        onMouseUp() {
            super.onMouseUp();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            this.mrsToolTarget.stopTranslation();
            this.startPos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }
        updateToolModel() {
            //鼠标按下时不更新
            if (this.ismouseDown)
                return;
            if (!this.editorCamera)
                return;
            var cameraPos = this.editorCamera.transform.worldPosition;
            var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
            this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
            this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
            this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
            this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
            this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
            this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
        }
    };
    MTool = __decorate([
        feng3d.RegisterComponent()
    ], MTool);
    editor.MTool = MTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let RTool = class RTool extends editor.MRSToolBase {
        init() {
            super.init();
            this.toolModel = new feng3d.GameObject().addComponent(editor.RToolModel);
        }
        onAddedToScene() {
            super.onAddedToScene();
            this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.on("mousedown", this.onItemMouseDown, this);
        }
        onRemovedFromScene() {
            super.onRemovedFromScene();
            this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.off("mousedown", this.onItemMouseDown, this);
        }
        onItemMouseDown(event) {
            if (!feng3d.shortcut.getState("mouseInView3D"))
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            if (!this.editorCamera)
                return;
            super.onItemMouseDown(event);
            //全局矩阵
            var globalMatrix = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix.getPosition();
            var xDir = globalMatrix.right;
            var yDir = globalMatrix.up;
            var zDir = globalMatrix.forward;
            //摄像机前方方向
            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            var cameraPos = cameraSceneTransform.getPosition();
            this.movePlane3D = new feng3d.Plane();
            switch (event.currentTarget) {
                case this.toolModel.xAxis:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(xDir, pos);
                    break;
                case this.toolModel.yAxis:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(yDir, pos);
                    break;
                case this.toolModel.zAxis:
                    this.selectedItem = this.toolModel.zAxis;
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(zDir, pos);
                    break;
                case this.toolModel.freeAxis:
                    this.selectedItem = this.toolModel.freeAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
                case this.toolModel.cameraAxis:
                    this.selectedItem = this.toolModel.cameraAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
            }
            this.startPlanePos = this.getMousePlaneCross();
            this.stepPlaneCross = this.startPlanePos.clone();
            //
            this.startMousePos = new feng3d.Vector2(editor.editorui.stage.stageX, editor.editorui.stage.stageY);
            this.startSceneTransform = globalMatrix.clone();
            this.mrsToolTarget.startRotate();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }
        onMouseMove() {
            if (!this.editorCamera)
                return;
            switch (this.selectedItem) {
                case this.toolModel.xAxis:
                case this.toolModel.yAxis:
                case this.toolModel.zAxis:
                case this.toolModel.cameraAxis:
                    var origin = this.startSceneTransform.getPosition();
                    var planeCross = this.getMousePlaneCross();
                    var startDir = this.stepPlaneCross.subTo(origin);
                    startDir.normalize();
                    var endDir = planeCross.subTo(origin);
                    endDir.normalize();
                    //计算夹角
                    var cosValue = startDir.dot(endDir);
                    cosValue = Math.clamp(cosValue, -1, 1);
                    var angle = Math.acos(cosValue) * Math.RAD2DEG;
                    //计算是否顺时针
                    var sign = this.movePlane3D.getNormal().cross(startDir).dot(endDir);
                    sign = sign > 0 ? 1 : -1;
                    angle = angle * sign;
                    //
                    this.mrsToolTarget.rotate1(angle, this.movePlane3D.getNormal());
                    this.stepPlaneCross.copy(planeCross);
                    this.mrsToolTarget.startRotate();
                    //绘制扇形区域
                    if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                        this.selectedItem.showSector(this.startPlanePos, planeCross);
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = new feng3d.Vector2(editor.editorui.stage.stageX, editor.editorui.stage.stageY);
                    var offset = endPoint.subTo(this.startMousePos);
                    var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    this.mrsToolTarget.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    this.mrsToolTarget.startRotate();
                    break;
            }
        }
        onMouseUp() {
            super.onMouseUp();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                this.selectedItem.hideSector();
            }
            this.mrsToolTarget.stopRote();
            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }
        updateToolModel() {
            if (!this.editorCamera)
                return;
            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix.clone();
            var cameraDir = cameraSceneTransform.forward;
            cameraDir.negate();
            //
            var xyzAxis = [this.toolModel.xAxis, this.toolModel.yAxis, this.toolModel.zAxis];
            for (var i = 0; i < xyzAxis.length; i++) {
                var axis = xyzAxis[i];
                axis.filterNormal = cameraDir;
            }
            //朝向摄像机
            var temp = cameraSceneTransform.clone();
            temp.append(this.toolModel.transform.worldToLocalMatrix);
            var rotation = temp.decompose()[1];
            this.toolModel.freeAxis.transform.rotation = rotation;
            this.toolModel.cameraAxis.transform.rotation = rotation;
        }
    };
    RTool = __decorate([
        feng3d.RegisterComponent()
    ], RTool);
    editor.RTool = RTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let STool = class STool extends editor.MRSToolBase {
        constructor() {
            super(...arguments);
            /**
             * 用于判断是否改变了XYZ
             */
            this.changeXYZ = new feng3d.Vector3();
        }
        init() {
            super.init();
            this.toolModel = new feng3d.GameObject().addComponent(editor.SToolModel);
        }
        onAddedToScene() {
            super.onAddedToScene();
            this.toolModel.xCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
        }
        onRemovedFromScene() {
            super.onRemovedFromScene();
            this.toolModel.xCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
        }
        onItemMouseDown(event) {
            if (!feng3d.shortcut.getState("mouseInView3D"))
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            if (!this.editorCamera)
                return;
            super.onItemMouseDown(event);
            //全局矩阵
            var globalMatrix = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix.transformVector(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix.transformVector(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix.transformVector(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix.transformVector(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new feng3d.Plane();
            switch (event.currentTarget) {
                case this.toolModel.xCube:
                    this.selectedItem = this.toolModel.xCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.set(1, 0, 0);
                    break;
                case this.toolModel.yCube:
                    this.selectedItem = this.toolModel.yCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.set(0, 1, 0);
                    break;
                case this.toolModel.zCube:
                    this.selectedItem = this.toolModel.zCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.set(0, 0, 1);
                    break;
                case this.toolModel.oCube:
                    this.selectedItem = this.toolModel.oCube;
                    this.startMousePos = new feng3d.Vector2(editor.editorui.stage.stageX, editor.editorui.stage.stageY);
                    this.changeXYZ.set(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            this.mrsToolTarget.startScale();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }
        onMouseMove() {
            var addPos = new feng3d.Vector3();
            var addScale = new feng3d.Vector3();
            if (this.selectedItem == this.toolModel.oCube) {
                var currentMouse = new feng3d.Vector2(editor.editorui.stage.stageX, editor.editorui.stage.stageY);
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.set(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / editor.editorui.stage.stageHeight;
                addScale.set(scale, scale, scale);
            }
            else {
                var crossPos = this.getLocalMousePlaneCross();
                var offset = crossPos.subTo(this.startPlanePos);
                if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0) {
                    addScale.x = offset.x / this.startPlanePos.x;
                }
                if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0) {
                    addScale.y = offset.y / this.startPlanePos.y;
                }
                if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0) {
                    addScale.z = offset.z / this.startPlanePos.z;
                }
                addScale.x += 1;
                addScale.y += 1;
                addScale.z += 1;
            }
            this.mrsToolTarget.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        }
        onMouseUp() {
            super.onMouseUp();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            this.mrsToolTarget.stopScale();
            this.startPlanePos = null;
            this.startSceneTransform = null;
            //
            this.toolModel.xCube.scaleValue = 1;
            this.toolModel.yCube.scaleValue = 1;
            this.toolModel.zCube.scaleValue = 1;
        }
    };
    STool = __decorate([
        feng3d.RegisterComponent()
    ], STool);
    editor.STool = STool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 设置永久可见
     */
    function setAwaysVisible(component) {
        var models = component.getComponentsInChildren(feng3d.Renderable);
        models.forEach(element => {
            if (element.material && !element.material.assetId) {
                element.material.renderParams.depthtest = false;
            }
        });
    }
    /**
     * 位移旋转缩放工具
     */
    let MRSTool = class MRSTool extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.mrsToolTarget = new editor.MRSToolTarget();
        }
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.invalidate(); }
        init() {
            super.init();
            this.mrsToolObject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "MRSTool" });
            this.mTool = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "MTool" }).addComponent(editor.MTool);
            this.rTool = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "RTool" }).addComponent(editor.RTool);
            this.sTool = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "STool" }).addComponent(editor.STool);
            this.mTool.mrsToolTarget = this.mrsToolTarget;
            this.rTool.mrsToolTarget = this.mrsToolTarget;
            this.sTool.mrsToolTarget = this.mrsToolTarget;
            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);
            //
            this.currentTool = this.mTool;
            //
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.globalDispatcher.on("editor.toolTypeChanged", this.onToolTypeChange, this);
        }
        dispose() {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            //
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            feng3d.globalDispatcher.off("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.globalDispatcher.off("editor.toolTypeChanged", this.onToolTypeChange, this);
            super.dispose();
        }
        invalidate() {
            feng3d.ticker.nextframe(this.update, this);
        }
        update() {
            this.mTool.editorCamera = this._editorCamera;
            this.rTool.editorCamera = this._editorCamera;
            this.sTool.editorCamera = this._editorCamera;
        }
        onSelectedGameObjectChange() {
            var objects = editor.editorData.selectedGameObjects.filter(v => !(v.hideFlags & feng3d.HideFlags.DontTransform));
            //筛选出 工具控制的对象
            if (objects.length > 0) {
                this.gameObject.addChild(this.mrsToolObject);
            }
            else {
                this.mrsToolObject.remove();
            }
        }
        onToolTypeChange() {
            switch (editor.editorData.toolType) {
                case editor.MRSToolType.MOVE:
                    this.currentTool = this.mTool;
                    break;
                case editor.MRSToolType.ROTATION:
                    this.currentTool = this.rTool;
                    break;
                case editor.MRSToolType.SCALE:
                    this.currentTool = this.sTool;
                    break;
            }
        }
        set currentTool(value) {
            if (this._currentTool == value)
                return;
            if (this._currentTool) {
                this._currentTool.gameObject.remove();
            }
            this._currentTool = value;
            if (this._currentTool) {
                this.mrsToolObject.addChild(this._currentTool.gameObject);
            }
        }
    };
    MRSTool = __decorate([
        feng3d.RegisterComponent()
    ], MRSTool);
    editor.MRSTool = MRSTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class HierarchyNode extends editor.TreeNode {
        constructor(obj) {
            super(obj);
            this.isOpen = false;
            /**
             * 父结点
             */
            this.parent = null;
            /**
             * 子结点列表
             */
            this.children = [];
            feng3d.watcher.watch(this.gameobject, "name", this.update, this);
            this.update();
        }
        /**
         * 提供拖拽数据
         *
         * @param dragSource
         */
        setdargSource(dragSource) {
            dragSource.addDragData("gameobject", this.gameobject);
        }
        /**
         * 接受拖拽数据
         *
         * @param dragdata
         */
        acceptDragDrop(dragdata) {
            dragdata.getDragData("gameobject").forEach(v => {
                if (!v.contains(this.gameobject)) {
                    var localToWorldMatrix = v.transform.localToWorldMatrix;
                    this.gameobject.addChild(v);
                    v.transform.localToWorldMatrix = localToWorldMatrix;
                    //
                    editor.hierarchy.getNode(v).openParents();
                }
            });
            dragdata.getDragData("file_gameobject").forEach(v => {
                let gameobject = editor.hierarchy.addGameoObjectFromAsset(v, this.gameobject);
                editor.hierarchy.getNode(gameobject).openParents();
            });
            dragdata.getDragData("file_script").forEach(v => {
                this.gameobject.addScript(v.scriptName);
            });
        }
        /**
         * 销毁
         */
        destroy() {
            feng3d.watcher.unwatch(this.gameobject, "name", this.update, this);
            this.gameobject = null;
            super.destroy();
        }
        update() {
            this.label = this.gameobject.name;
        }
    }
    editor.HierarchyNode = HierarchyNode;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class Hierarchy {
        constructor() {
            this._selectedGameObjects = [];
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
            feng3d.watcher.watch(this, "rootGameObject", this.rootGameObjectChanged, this);
        }
        /**
         * 获取选中结点
         */
        getSelectedNode() {
            var node = editor.editorData.selectedGameObjects.reduce((pv, cv) => { pv = pv || this.getNode(cv); return pv; }, null);
            return node;
        }
        /**
         * 获取结点
         */
        getNode(gameObject) {
            var node = nodeMap.get(gameObject);
            return node;
        }
        delete(gameobject) {
            var node = nodeMap.get(gameobject);
            if (node) {
                node.destroy();
                nodeMap.delete(gameobject);
            }
        }
        /**
         * 添加游戏对象到层级树
         *
         * @param gameobject 游戏对象
         */
        addGameObject(gameobject) {
            if (gameobject.getComponent(feng2d.Transform2D)) {
                this.addUI(gameobject);
                return;
            }
            var selectedNode = this.getSelectedNode();
            if (selectedNode)
                selectedNode.gameobject.addChild(gameobject);
            else
                this.rootnode.gameobject.addChild(gameobject);
            editor.editorData.selectObject(gameobject);
        }
        /**
         * 添加UI
         *
         * @param gameobject
         */
        addUI(gameobject) {
            var selectedNode = this.getSelectedNode();
            if (selectedNode && selectedNode.gameobject.getComponent(feng2d.Transform2D)) {
                selectedNode.gameobject.addChild(gameobject);
            }
            else {
                var canvas = this.rootnode.gameobject.getComponentsInChildren(feng2d.Canvas)[0];
                if (!canvas) {
                    canvas = feng3d.GameObject.createPrimitive("Canvas").getComponent(feng2d.Canvas);
                    this.rootnode.gameobject.addChild(canvas.gameObject);
                }
                canvas.gameObject.addChild(gameobject);
            }
            editor.editorData.selectObject(gameobject);
        }
        addGameoObjectFromAsset(gameobjectAsset, parent) {
            var gameobject = gameobjectAsset.getAssetData();
            console.assert(!gameobject.parent);
            if (parent)
                parent.addChild(gameobject);
            else
                this.rootnode.gameobject.addChild(gameobject);
            editor.editorData.selectObject(gameobject);
            return gameobject;
        }
        rootGameObjectChanged(newValue, oldValue) {
            if (oldValue) {
                oldValue.off("addChild", this.ongameobjectadded, this);
                oldValue.off("removeChild", this.ongameobjectremoved, this);
            }
            if (newValue) {
                this.init(newValue);
                newValue.on("addChild", this.ongameobjectadded, this);
                newValue.on("removeChild", this.ongameobjectremoved, this);
            }
        }
        onSelectedGameObjectChanged() {
            this._selectedGameObjects.forEach(element => {
                var node = this.getNode(element);
                if (node)
                    node.selected = false;
                else
                    debugger; // 为什么为空，是否被允许？
            });
            this._selectedGameObjects = editor.editorData.selectedGameObjects.concat();
            this._selectedGameObjects.forEach(element => {
                var node = this.getNode(element);
                node.selected = true;
            });
        }
        ongameobjectadded(event) {
            this.add(event.data.child);
        }
        ongameobjectremoved(event) {
            var node = nodeMap.get(event.data.child);
            this.remove(node);
        }
        init(gameobject) {
            if (this.rootnode)
                this.rootnode.destroy();
            nodeMap.clear();
            var node = new editor.HierarchyNode({ gameobject: gameobject });
            nodeMap.set(gameobject, node);
            node.isOpen = true;
            this.rootnode = node;
            gameobject.children.forEach(element => {
                this.add(element);
            });
        }
        add(gameobject) {
            if (gameobject.hideFlags & feng3d.HideFlags.HideInHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node) {
                node.remove();
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode) {
                if (!node) {
                    node = new editor.HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                parentnode.addChild(node);
            }
            gameobject.children.forEach(element => {
                this.add(element);
            });
            return node;
        }
        remove(node) {
            if (!node)
                return;
            node.children.forEach(element => {
                this.remove(element);
            });
            node.remove();
        }
    }
    editor.Hierarchy = Hierarchy;
    var nodeMap = new Map();
    editor.hierarchy = new Hierarchy();
})(editor || (editor = {}));
var editor;
(function (editor) {
    let SceneRotateTool = class SceneRotateTool extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.isload = false;
        }
        get view() { return this._view; }
        set view(v) { this._view = v; this.load(); }
        init() {
            super.init();
            this.load();
        }
        load() {
            if (!this.view)
                return;
            if (this.isload)
                return;
            this.isload = true;
            feng3d.loader.loadText(editor.editorData.getEditorAssetPath("gameobjects/SceneRotateTool.gameobject.json"), (content) => {
                var rotationToolModel = feng3d.serialization.deserialize(JSON.parse(content));
                this.onLoaded(rotationToolModel);
            });
        }
        onLoaded(rotationToolModel) {
            var arrowsX = this.arrowsX = rotationToolModel.find("arrowsX");
            var arrowsY = this.arrowsY = rotationToolModel.find("arrowsY");
            var arrowsZ = this.arrowsZ = rotationToolModel.find("arrowsZ");
            var arrowsNX = this.arrowsNX = rotationToolModel.find("arrowsNX");
            var arrowsNY = this.arrowsNY = rotationToolModel.find("arrowsNY");
            var arrowsNZ = this.arrowsNZ = rotationToolModel.find("arrowsNZ");
            var planeX = rotationToolModel.find("planeX");
            var planeY = rotationToolModel.find("planeY");
            var planeZ = rotationToolModel.find("planeZ");
            var planeNX = rotationToolModel.find("planeNX");
            var planeNY = rotationToolModel.find("planeNY");
            var planeNZ = rotationToolModel.find("planeNZ");
            var { toolView: toolView, canvas } = this.newView();
            toolView.root.addChild(rotationToolModel);
            rotationToolModel.transform.sx = 0.01;
            rotationToolModel.transform.sy = 0.01;
            rotationToolModel.transform.sz = 0.01;
            rotationToolModel.transform.z = 0.80;
            var arr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ];
            arr.forEach(element => {
                element.on("click", this.onclick, this);
            });
            var arrowsArr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ];
            feng3d.ticker.onframe(() => {
                var rect = this.view.canvas.getBoundingClientRect();
                canvas.style.top = rect.top + "px";
                canvas.style.left = (rect.left + rect.width - canvas.width) + "px";
                var rotation = this.view.camera.transform.localToWorldMatrix.clone().invert().decompose()[1];
                rotationToolModel.transform.rotation = rotation;
                //隐藏角度
                var visibleAngle = Math.cos(15 * Math.DEG2RAD);
                //隐藏正面箭头
                arrowsArr.forEach(element => {
                    if (Math.abs(element.transform.localToWorldMatrix.up.dot(feng3d.Vector3.Z_AXIS)) < visibleAngle)
                        element.visible = true;
                    else
                        element.visible = false;
                });
                //
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                    feng3d.shortcut.activityState("mouseInSceneRotateTool");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInSceneRotateTool");
                }
            });
            feng3d.windowEventProxy.on("mouseup", (e) => {
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (!bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
                    return;
                //右键点击菜单
                if (e.button == 2) {
                    editor.menu.popup([
                        {
                            label: "右视图", click: () => {
                                this.clickItem(arrowsX);
                            }
                        },
                        {
                            label: "顶视图", click: () => {
                                this.clickItem(arrowsY);
                            }
                        },
                        {
                            label: "前视图", click: () => {
                                this.clickItem(arrowsZ);
                            }
                        },
                        {
                            label: "左视图", click: () => {
                                this.clickItem(arrowsNX);
                            }
                        },
                        {
                            label: "底视图", click: () => {
                                this.clickItem(arrowsNY);
                            }
                        },
                        {
                            label: "后视图", click: () => {
                                this.clickItem(arrowsNZ);
                            }
                        },
                    ]);
                }
            });
        }
        newView() {
            var canvas = document.createElement("canvas");
            document.getElementById("SceneRotateToolLayer").appendChild(canvas);
            canvas.style.position = "absolute";
            canvas.width = 80;
            canvas.height = 80;
            // 
            var toolView = new feng3d.View(canvas);
            toolView.scene.background.a = 0.0;
            toolView.scene.ambientColor.setTo(0.2, 0.2, 0.2);
            toolView.root.addChild(feng3d.GameObject.createPrimitive("Point light"));
            return { toolView: toolView, canvas };
        }
        onclick(e) {
            this.clickItem(e.currentTarget);
        }
        clickItem(item) {
            var front_view = new feng3d.Vector3(0, 0, 0); //前视图
            var back_view = new feng3d.Vector3(0, 180, 0); //后视图
            var right_view = new feng3d.Vector3(0, 90, 0); //右视图
            var left_view = new feng3d.Vector3(0, -90, 0); //左视图
            var top_view = new feng3d.Vector3(-90, 0, 0); //顶视图
            var bottom_view = new feng3d.Vector3(90, 0, 0); //底视图
            var rotation;
            switch (item) {
                case this.arrowsX:
                    rotation = right_view;
                    break;
                case this.arrowsNX:
                    rotation = left_view;
                    break;
                case this.arrowsY:
                    rotation = top_view;
                    break;
                case this.arrowsNY:
                    rotation = bottom_view;
                    break;
                case this.arrowsZ:
                    rotation = back_view;
                    break;
                case this.arrowsNZ:
                    rotation = front_view;
                    break;
            }
            if (rotation) {
                var cameraTargetMatrix = feng3d.Matrix4x4.fromRotation(rotation.x, rotation.y, rotation.z);
                cameraTargetMatrix.invert();
                var result = cameraTargetMatrix.decompose()[1];
                feng3d.globalDispatcher.dispatch("editorCameraRotate", result);
                this.onEditorCameraRotate(result);
            }
        }
        onEditorCameraRotate(resultRotation) {
            var camera = this.view.camera;
            var forward = camera.transform.forwardVector;
            var lookDistance;
            if (editor.editorData.selectedGameObjects.length > 0) {
                //计算观察距离
                var selectedObj = editor.editorData.selectedGameObjects[0];
                var lookray = selectedObj.transform.worldPosition.subTo(camera.transform.worldPosition);
                lookDistance = Math.max(0, forward.dot(lookray));
            }
            else {
                lookDistance = editor.sceneControlConfig.lookDistance;
            }
            //旋转中心
            var rotateCenter = camera.transform.worldPosition.addTo(forward.scaleNumber(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new feng3d.Quaternion();
            resultRotation.scaleNumber(Math.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new feng3d.Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * Math.DEG2RAD, camera.transform.ry * Math.DEG2RAD, camera.transform.rz * Math.DEG2RAD);
            var rate = { rate: 0.0 };
            egret.Tween.get(rate, {
                onChange: () => {
                    var cameraQuat = sourceQuat.slerpTo(targetQuat, rate.rate);
                    camera.transform.orientation = cameraQuat;
                    //
                    var translation = camera.transform.forwardVector;
                    translation.negate();
                    translation.scaleNumber(lookDistance);
                    camera.transform.position = rotateCenter.addTo(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        }
    };
    SceneRotateTool = __decorate([
        feng3d.RegisterComponent()
    ], SceneRotateTool);
    editor.SceneRotateTool = SceneRotateTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 地面网格
     */
    let GroundGrid = class GroundGrid extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.num = 100;
        }
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) {
            if (this._editorCamera == v)
                return;
            if (this._editorCamera) {
                this._editorCamera.transform.off("transformChanged", this.update, this);
            }
            this._editorCamera = v;
            if (this._editorCamera) {
                this._editorCamera.transform.on("transformChanged", this.update, this);
                this.update();
            }
        }
        init() {
            super.init();
            var groundGridObject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "GroundGrid" });
            groundGridObject.mouseEnabled = false;
            this._gameObject.addChild(groundGridObject);
            var model = groundGridObject.addComponent(feng3d.Renderable);
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            model.material = feng3d.Material.getDefault("Segment-Material");
        }
        update() {
            if (!this.editorCamera)
                return;
            var cameraGlobalPosition = this.editorCamera.transform.worldPosition;
            var level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
            var step = Math.pow(10, level - 1);
            var startX = Math.round(cameraGlobalPosition.x / (10 * step)) * 10 * step;
            var startZ = Math.round(cameraGlobalPosition.z / (10 * step)) * 10 * step;
            //设置在原点
            startX = startZ = 0;
            step = 1;
            var halfNum = this.num / 2;
            var xcolor = new feng3d.Color4(1, 0, 0, 0.5);
            var zcolor = new feng3d.Color4(0, 0, 1, 0.5);
            var color;
            var segments = [];
            for (var i = -halfNum; i <= halfNum; i++) {
                var color0 = new feng3d.Color4().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                color0.a = ((i % 10) == 0) ? 0.5 : 0.1;
                color = (i * step + startZ == 0) ? xcolor : color0;
                segments.push({ start: new feng3d.Vector3(-halfNum * step + startX, 0, i * step + startZ), end: new feng3d.Vector3(halfNum * step + startX, 0, i * step + startZ), startColor: color, endColor: color });
                color = (i * step + startX == 0) ? zcolor : color0;
                segments.push({ start: new feng3d.Vector3(i * step + startX, 0, -halfNum * step + startZ), end: new feng3d.Vector3(i * step + startX, 0, halfNum * step + startZ), startColor: color, endColor: color });
            }
            this.segmentGeometry.segments = segments;
        }
    };
    __decorate([
        feng3d.oav()
    ], GroundGrid.prototype, "num", void 0);
    GroundGrid = __decorate([
        feng3d.RegisterComponent()
    ], GroundGrid);
    editor.GroundGrid = GroundGrid;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class EditorView extends feng3d.View {
        constructor() {
            super(...arguments);
            this.wireframeColor = new feng3d.Color4(125 / 255, 176 / 255, 250 / 255);
        }
        /**
         * 绘制场景
         */
        render() {
            if (editor.editorData.gameScene != this.scene) {
                if (this.scene) {
                    this.scene.runEnvironment = feng3d.RunEnvironment.feng3d;
                }
                this.scene = editor.editorData.gameScene;
                if (this.scene) {
                    this.scene.runEnvironment = feng3d.RunEnvironment.editor;
                    editor.hierarchy.rootGameObject = this.scene.gameObject;
                }
            }
            if (this.editorComponent) {
                this.editorComponent.scene = this.scene;
                this.editorComponent.editorCamera = this.camera;
            }
            super.render();
            if (this.contextLost)
                return;
            if (this.editorScene) {
                // 设置鼠标射线
                this.editorScene.mouseRay3D = this.mouseRay3D;
                this.editorScene.camera = this.camera;
                this.editorScene.update();
                feng3d.forwardRenderer.draw(this.gl, this.editorScene, this.camera);
                var selectedObject = this.mouse3DManager.pick(this, this.editorScene, this.camera);
                if (selectedObject)
                    this.selectedObject = selectedObject;
            }
            if (this.scene) {
                editor.editorData.selectedGameObjects.forEach(element => {
                    if (element.getComponent(feng3d.Renderable) && !element.getComponent(feng3d.ParticleSystem))
                        feng3d.wireframeRenderer.drawGameObject(this.gl, element.getComponent(feng3d.Renderable), this.scene, this.camera, this.wireframeColor);
                });
            }
        }
    }
    editor.EditorView = EditorView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let EditorComponent = class EditorComponent extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.directionLightIconMap = new Map();
            this.pointLightIconMap = new Map();
            this.spotLightIconMap = new Map();
            this.cameraIconMap = new Map();
        }
        get scene() {
            return this._scene;
        }
        set scene(v) {
            if (this._scene == v)
                return;
            if (this._scene) {
                this.scene.off("addComponent", this.onAddComponent, this);
                this.scene.off("removeComponent", this.onRemoveComponent, this);
                this.scene.getComponentsInChildren(feng3d.Component).forEach(element => {
                    this.removeComponent(element);
                });
            }
            this._scene = v;
            if (this._scene) {
                this.scene.getComponentsInChildren(feng3d.Component).forEach(element => {
                    this.addComponent(element);
                });
                this.scene.on("addComponent", this.onAddComponent, this);
                this.scene.on("removeComponent", this.onRemoveComponent, this);
                this.scene.on("addChild", this.onAddChild, this);
                this.scene.on("removeChild", this.onRemoveChild, this);
            }
        }
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { if (this._editorCamera == v)
            return; this._editorCamera = v; this.update(); }
        /**
         * 销毁
         */
        dispose() {
            this.scene = null;
            super.dispose();
        }
        onAddChild(event) {
            var components = event.data.child.getComponentsInChildren();
            components.forEach(v => {
                this.addComponent(v);
            });
        }
        onRemoveChild(event) {
            var components = event.data.child.getComponentsInChildren();
            components.forEach(v => {
                this.removeComponent(v);
            });
        }
        onAddComponent(event) {
            this.addComponent(event.data.component);
        }
        onRemoveComponent(event) {
            this.removeComponent(event.data.component);
        }
        update() {
            this.directionLightIconMap.forEach(v => {
                v.editorCamera = this.editorCamera;
            });
            this.pointLightIconMap.forEach(v => {
                v.editorCamera = this.editorCamera;
            });
            this.spotLightIconMap.forEach(v => {
                v.editorCamera = this.editorCamera;
            });
            this.cameraIconMap.forEach(v => {
                v.editorCamera = this.editorCamera;
            });
        }
        addComponent(component) {
            if (component instanceof feng3d.DirectionalLight) {
                var directionLightIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "DirectionLightIcon", }).addComponent(editor.DirectionLightIcon), { light: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(component, directionLightIcon);
            }
            else if (component instanceof feng3d.PointLight) {
                var pointLightIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "PointLightIcon" }).addComponent(editor.PointLightIcon), { light: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(component, pointLightIcon);
            }
            else if (component instanceof feng3d.SpotLight) {
                var spotLightIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "SpotLightIcon" }).addComponent(editor.SpotLightIcon), { light: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(component, spotLightIcon);
            }
            else if (component instanceof feng3d.Camera) {
                var cameraIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "CameraIcon" }).addComponent(editor.CameraIcon), { camera: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(cameraIcon.gameObject);
                this.cameraIconMap.set(component, cameraIcon);
            }
        }
        removeComponent(component) {
            if (component instanceof feng3d.DirectionalLight) {
                feng3d.serialization.setValue(this.directionLightIconMap.get(component), { light: null }).gameObject.remove();
                this.directionLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.PointLight) {
                feng3d.serialization.setValue(this.pointLightIconMap.get(component), { light: null }).gameObject.remove();
                this.pointLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.SpotLight) {
                feng3d.serialization.setValue(this.spotLightIconMap.get(component), { light: null }).gameObject.remove();
                this.spotLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.Camera) {
                feng3d.serialization.setValue(this.cameraIconMap.get(component), { camera: null }).gameObject.remove();
                this.cameraIconMap.delete(component);
            }
        }
    };
    EditorComponent = __decorate([
        feng3d.RegisterComponent()
    ], EditorComponent);
    editor.EditorComponent = EditorComponent;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * feng3d预览图工具
     */
    class Feng3dScreenShot {
        constructor() {
            this.defaultGeometry = feng3d.Geometry.getDefault("Sphere");
            this.defaultMaterial = feng3d.Material.getDefault("Default-Material");
            this.materialObject = feng3d.serialization.setValue(new feng3d.GameObject(), { components: [{ __class__: "feng3d.MeshRenderer" }] });
            this.geometryObject = feng3d.serialization.setValue(new feng3d.GameObject(), { components: [{ __class__: "feng3d.MeshRenderer", }, { __class__: "feng3d.WireframeComponent", }] });
            // 初始化3d
            var view = this.view = new feng3d.View();
            view.canvas.style.visibility = "hidden";
            view.setSize(64, 64);
            //
            var scene = this.scene = view.scene;
            scene.background.fromUnit(0xff525252);
            scene.ambientColor.setTo(0.4, 0.4, 0.4);
            //
            var camera = this.camera = view.camera;
            camera.lens = new feng3d.PerspectiveLens(45);
            //
            var light = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "DirectionalLight",
                components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
            });
            scene.gameObject.addChild(light);
            this.container = new feng3d.GameObject();
            this.container.name = "渲染截图容器";
            scene.gameObject.addChild(this.container);
            view.stop();
        }
        /**
         * 绘制贴图
         * @param texture 贴图
         */
        drawTexture(texture) {
            var image = texture.activePixels;
            var w = 64;
            var h = 64;
            var canvas2D = document.createElement("canvas");
            canvas2D.width = w;
            canvas2D.height = h;
            var context2D = canvas2D.getContext("2d");
            context2D.fillStyle = "black";
            if (image instanceof HTMLImageElement)
                context2D.drawImage(image, 0, 0, w, h);
            else if (image instanceof ImageData)
                context2D.putImageData(image, 0, 0);
            else
                context2D.fillRect(0, 0, w, h);
            //
            var dataUrl = canvas2D.toDataURL();
            return dataUrl;
        }
        /**
         * 绘制立方体贴图
         * @param textureCube 立方体贴图
         */
        drawTextureCube(textureCube) {
            var pixels = textureCube["_pixels"];
            var canvas2D = document.createElement("canvas");
            var width = 64;
            canvas2D.width = width;
            canvas2D.height = width;
            var context2D = canvas2D.getContext("2d");
            context2D.fillStyle = "black";
            // context2D.fillRect(10, 10, 100, 100);
            var w4 = Math.round(width / 4);
            var Yoffset = w4 / 2;
            //
            var X = w4 * 2;
            var Y = w4;
            if (pixels[0])
                context2D.drawImage(pixels[0], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = 0;
            if (pixels[1])
                context2D.drawImage(pixels[1], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = w4;
            if (pixels[2])
                context2D.drawImage(pixels[2], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = 0;
            Y = w4;
            if (pixels[3])
                context2D.drawImage(pixels[3], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = w4 * 2;
            if (pixels[4])
                context2D.drawImage(pixels[4], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4 * 3;
            Y = w4;
            if (pixels[5])
                context2D.drawImage(pixels[5], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            var dataUrl = canvas2D.toDataURL();
            return dataUrl;
        }
        /**
         * 绘制材质
         * @param material 材质
         */
        drawMaterial(material, cameraRotation = new feng3d.Vector3(20, -90, 0)) {
            var mode = this.materialObject.getComponent(feng3d.Renderable);
            mode.geometry = this.defaultGeometry;
            mode.material = material;
            //
            cameraRotation && (this.camera.transform.rotation = cameraRotation);
            this._drawGameObject(this.materialObject);
            return this;
        }
        /**
         * 绘制材质
         * @param geometry 材质
         */
        drawGeometry(geometry, cameraRotation = new feng3d.Vector3(-20, 120, 0)) {
            var model = this.geometryObject.getComponent(feng3d.Renderable);
            model.geometry = geometry;
            model.material = this.defaultMaterial;
            cameraRotation && (this.camera.transform.rotation = cameraRotation);
            this._drawGameObject(this.geometryObject);
            return this;
        }
        /**
         * 绘制游戏对象
         * @param gameObject 游戏对象
         */
        drawGameObject(gameObject, cameraRotation = new feng3d.Vector3(20, -120, 0)) {
            cameraRotation && (this.camera.transform.rotation = cameraRotation);
            this._drawGameObject(gameObject);
            return this;
        }
        /**
         * 转换为DataURL
         */
        toDataURL(width = 64, height = 64) {
            this.view.setSize(width, height);
            this.view.render();
            var dataUrl = this.view.canvas.toDataURL();
            return dataUrl;
        }
        updateCameraPosition(gameObject) {
            //
            var bounds = gameObject.worldBounds;
            var scenePosition = bounds.getCenter();
            var size = bounds.getSize().length;
            size = Math.max(size, 1);
            var lookDistance = size;
            var lens = this.camera.lens;
            if (lens instanceof feng3d.PerspectiveLens) {
                lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
            }
            //
            var lookPos = this.camera.transform.localToWorldMatrix.forward;
            lookPos.scaleNumber(-lookDistance);
            lookPos.add(scenePosition);
            var localLookPos = lookPos.clone();
            if (this.camera.transform.parent) {
                localLookPos = this.camera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
            }
            this.camera.transform.position = localLookPos;
        }
        _drawGameObject(gameObject) {
            this.container.removeChildren();
            //
            this.container.addChild(gameObject);
            //
            this.updateCameraPosition(gameObject);
        }
    }
    editor.Feng3dScreenShot = Feng3dScreenShot;
    editor.feng3dScreenShot = new Feng3dScreenShot();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 导航代理
     */
    class NavigationAgent {
        constructor() {
            /**
             * 距离边缘半径
             */
            this.radius = 0.5;
            /**
             * 允许行走高度
             */
            this.height = 2;
            /**
             * 允许爬上的阶梯高度
             */
            this.stepHeight = 0.4;
            /**
             * 允许行走坡度
             */
            this.maxSlope = 45; //[0,60]
        }
    }
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "radius", void 0);
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "height", void 0);
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "stepHeight", void 0);
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "maxSlope", void 0);
    editor.NavigationAgent = NavigationAgent;
    /**
     * 导航组件，提供生成导航网格功能
     */
    let Navigation = class Navigation extends feng3d.Component {
        constructor() {
            super(...arguments);
            this.agent = new NavigationAgent();
        }
        init() {
            super.init();
            this.hideFlags = this.hideFlags | feng3d.HideFlags.DontSaveInBuild;
            this._navobject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "NavObject", hideFlags: feng3d.HideFlags.DontSave });
            var pointsObject = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "allowedVoxels",
                components: [{
                        __class__: "feng3d.MeshRenderer",
                        material: feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 1, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                        geometry: this._allowedVoxelsPointGeometry = new feng3d.PointGeometry()
                    },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "rejectivedVoxels",
                components: [{
                        __class__: "feng3d.MeshRenderer",
                        material: feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(1, 0, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                        geometry: this._rejectivedVoxelsPointGeometry = new feng3d.PointGeometry()
                    },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "debugVoxels",
                components: [{
                        __class__: "feng3d.MeshRenderer",
                        material: feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 0, 1), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                        geometry: this._debugVoxelsPointGeometry = new feng3d.PointGeometry()
                    },]
            });
            this._navobject.addChild(pointsObject);
        }
        /**
         * 清楚oav网格模型
         */
        clear() {
            this._navobject && this._navobject.remove();
        }
        /**
         * 计算导航网格数据
         */
        bake() {
            var geometrys = this._getNavGeometrys(this.gameObject.scene.gameObject);
            if (geometrys.length == 0) {
                this._navobject && this._navobject.remove();
                return;
            }
            this.gameObject.scene.gameObject.addChild(this._navobject);
            this._navobject.transform.position = new feng3d.Vector3();
            var geometry = feng3d.geometryUtils.mergeGeometry(geometrys);
            this._recastnavigation = this._recastnavigation || new editor.Recastnavigation();
            this._recastnavigation.doRecastnavigation(geometry, this.agent);
            var voxels = this._recastnavigation.getVoxels();
            var voxels0 = voxels.filter(v => v.flag == editor.VoxelFlag.Default);
            var voxels1 = voxels.filter(v => v.flag != editor.VoxelFlag.Default);
            var voxels2 = voxels.filter(v => !!(v.flag & editor.VoxelFlag.IsContour));
            this._allowedVoxelsPointGeometry.points = voxels0.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) }; });
            this._rejectivedVoxelsPointGeometry.points = voxels1.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) }; });
            // this._debugVoxelsPointGeometry.points = voxels2.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
        }
        /**
         * 获取参与导航的几何体列表
         * @param gameobject
         * @param geometrys
         */
        _getNavGeometrys(gameobject, geometrys) {
            geometrys = geometrys || [];
            if (!gameobject.visible)
                return geometrys;
            var model = gameobject.getComponent(feng3d.Renderable);
            var geometry = model && model.geometry;
            if (geometry) {
                var matrix = gameobject.transform.localToWorldMatrix;
                var positions = Array.apply(null, geometry.positions);
                matrix.transformVectors(positions, positions);
                var indices = Array.apply(null, geometry.indices);
                //
                geometrys.push({ positions: positions, indices: indices });
            }
            gameobject.children.forEach(element => {
                this._getNavGeometrys(element, geometrys);
            });
            return geometrys;
        }
    };
    __decorate([
        feng3d.oav({ component: "OAVObjectView" })
    ], Navigation.prototype, "agent", void 0);
    __decorate([
        feng3d.oav()
    ], Navigation.prototype, "clear", null);
    __decorate([
        feng3d.oav()
    ], Navigation.prototype, "bake", null);
    Navigation = __decorate([
        feng3d.AddComponentMenu("Navigation/Navigation"),
        feng3d.RegisterComponent()
    ], Navigation);
    editor.Navigation = Navigation;
})(editor || (editor = {}));
// see https://github.com/sshirokov/ThreeBSP
// see https://github.com/chandlerprall/ThreeCSG/blob/master/ThreeCSG.js
var feng3d;
(function (feng3d) {
    /**
     * 精度值
     */
    var EPSILON = 1e-5;
    /**
     * 共面
     */
    var COPLANAR = 0;
    /**
     * 正面
     */
    var FRONT = 1;
    /**
     * 反面
     */
    var BACK = 2;
    /**
     * 横跨
     */
    var SPANNING = 3;
    class ThreeBSP {
        constructor(geometry) {
            if (geometry instanceof ThreeBSPNode) {
                this.tree = geometry;
            }
            else {
                this.tree = new ThreeBSPNode(geometry);
            }
        }
        toGeometry() {
            var data = this.tree.getGeometryData();
            return data;
        }
        /**
         * 相减
         * @param other
         */
        subtract(other) {
            var them = other.tree.clone(), us = this.tree.clone();
            us.invert().clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        }
        ;
        /**
         * 相加
         * @param other
         */
        union(other) {
            var them = other.tree.clone(), us = this.tree.clone();
            us.clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()));
        }
        ;
        /**
         * 相交
         * @param other
         */
        intersect(other) {
            var them = other.tree.clone(), us = this.tree.clone();
            them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        }
        ;
    }
    feng3d.ThreeBSP = ThreeBSP;
    /**
     * 顶点
     */
    class ThreeBSPVertex {
        constructor(position, normal, uv) {
            this.position = position;
            this.normal = normal || new feng3d.Vector3();
            this.uv = uv || new feng3d.Vector2();
        }
        /**
         * 克隆
         */
        clone() {
            return new ThreeBSPVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
        }
        ;
        /**
         *
         * @param v 线性插值
         * @param alpha
         */
        lerp(v, alpha) {
            this.position.lerpNumber(v.position, alpha);
            this.uv.lerpNumber(v.uv, alpha);
            this.normal.lerpNumber(v.position, alpha);
            return this;
        }
        ;
        interpolate(v, alpha) {
            return this.clone().lerp(v, alpha);
        }
        ;
    }
    feng3d.ThreeBSPVertex = ThreeBSPVertex;
    /**
     * 多边形
     */
    class ThreeBSPPolygon {
        constructor(vertices) {
            this.vertices = vertices || [];
            if (this.vertices.length) {
                this.calculateProperties();
            }
        }
        /**
         * 获取多边形几何体数据
         * @param data
         */
        getGeometryData(data) {
            data = data || { positions: [], uvs: [], normals: [] };
            var vertices = data.positions = data.positions || [];
            var uvs = data.uvs = data.uvs || [];
            var normals = data.normals = data.normals || [];
            for (var i = 2, n = this.vertices.length; i < n; i++) {
                var v0 = this.vertices[0], v1 = this.vertices[i - 1], v2 = this.vertices[i];
                vertices.push(v0.position.x, v0.position.y, v0.position.z, v1.position.x, v1.position.y, v1.position.z, v2.position.x, v2.position.y, v2.position.z);
                uvs.push(v0.uv.x, v0.uv.y, v1.uv.x, v1.uv.y, v2.uv.x, v2.uv.y);
                normals.push(this.normal.x, this.normal.y, this.normal.z, this.normal.x, this.normal.y, this.normal.z, this.normal.x, this.normal.y, this.normal.z);
            }
            return data;
        }
        /**
         * 计算法线与w值
         */
        calculateProperties() {
            var a = this.vertices[0].position, b = this.vertices[1].position, c = this.vertices[2].position;
            this.normal = b.clone().subTo(a).crossTo(c.clone().subTo(a)).normalize();
            this.w = this.normal.clone().dot(a);
            return this;
        }
        ;
        /**
         * 克隆
         */
        clone() {
            var vertices = this.vertices.map((v) => { return v.clone(); });
            return new ThreeBSPPolygon(vertices);
        }
        ;
        /**
         * 翻转多边形
         */
        invert() {
            this.normal.scaleNumber(-1);
            this.w *= -1;
            this.vertices.reverse();
            return this;
        }
        ;
        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex
         */
        classifyVertex(vertex) {
            var side = this.normal.dot(vertex.position) - this.w;
            if (side < -EPSILON)
                return BACK;
            if (side > EPSILON)
                return FRONT;
            return COPLANAR;
        }
        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon
         */
        classifySide(polygon) {
            var front = 0, back = 0;
            polygon.vertices.forEach(v => {
                var side = this.classifyVertex(v);
                if (side == FRONT)
                    front += 1;
                else if (side == BACK)
                    back += 1;
            });
            if (front > 0 && back === 0) {
                return FRONT;
            }
            if (front === 0 && back > 0) {
                return BACK;
            }
            if (front === back && back === 0) {
                return COPLANAR;
            }
            return SPANNING;
        }
        /**
         * 切割多边形
         * @param poly
         */
        tessellate(poly) {
            if (this.classifySide(poly) !== SPANNING) {
                return [poly];
            }
            var f = [];
            var b = [];
            var count = poly.vertices.length;
            //切割多边形的每条边
            poly.vertices.forEach((item, i) => {
                var vi = poly.vertices[i];
                var vj = poly.vertices[(i + 1) % count];
                var ti = this.classifyVertex(vi);
                var tj = this.classifyVertex(vj);
                if (ti !== BACK) {
                    f.push(vi);
                }
                if (ti !== FRONT) {
                    b.push(vi);
                }
                // 切割横跨多边形的边
                if ((ti | tj) === SPANNING) {
                    var t = (this.w - this.normal.dot(vi.position)) / this.normal.dot(vj.clone().position.subTo(vi.position));
                    var v = vi.interpolate(vj, t);
                    f.push(v);
                    b.push(v);
                }
            });
            // 处理切割后的多边形
            var polys = [];
            if (f.length >= 3) {
                polys.push(new ThreeBSPPolygon(f));
            }
            if (b.length >= 3) {
                polys.push(new ThreeBSPPolygon(b));
            }
            return polys;
        }
        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        subdivide(polygon, coplanar_front, coplanar_back, front, back) {
            this.tessellate(polygon).forEach(poly => {
                var side = this.classifySide(poly);
                switch (side) {
                    case FRONT:
                        front.push(poly);
                        break;
                    case BACK:
                        back.push(poly);
                        break;
                    case COPLANAR:
                        if (this.normal.dot(poly.normal) > 0) {
                            coplanar_front.push(poly);
                        }
                        else {
                            coplanar_back.push(poly);
                        }
                        break;
                    default:
                        throw new Error("BUG: Polygon of classification " + side + " in subdivision");
                }
            });
        }
        ;
    }
    feng3d.ThreeBSPPolygon = ThreeBSPPolygon;
    /**
     * 结点
     */
    class ThreeBSPNode {
        constructor(data) {
            this.polygons = [];
            if (!data)
                return;
            var positions = data.positions;
            var normals = data.normals;
            var uvs = data.uvs;
            var indices = data.indices;
            // 初始化多边形
            var polygons = [];
            for (let i = 0, n = indices.length; i < n; i += 3) {
                var polygon = new ThreeBSPPolygon();
                var i0 = indices[i];
                var i1 = indices[i + 1];
                var i2 = indices[i + 2];
                polygon.vertices = [
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]), new feng3d.Vector3(normals[i0 * 3], normals[i0 * 3 + 1], normals[i0 * 3 + 2]), new feng3d.Vector2(uvs[i0 * 2], uvs[i0 * 2 + 1])),
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]), new feng3d.Vector3(normals[i1 * 3], normals[i1 * 3 + 1], normals[i1 * 3 + 2]), new feng3d.Vector2(uvs[i1 * 2], uvs[i1 * 2 + 1])),
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]), new feng3d.Vector3(normals[i2 * 3], normals[i2 * 3 + 1], normals[i2 * 3 + 2]), new feng3d.Vector2(uvs[i2 * 2], uvs[i2 * 2 + 1])),
                ];
                polygon.calculateProperties();
                polygons.push(polygon);
            }
            if (polygons.length) {
                this.build(polygons);
            }
        }
        /**
         * 获取几何体数据
         */
        getGeometryData() {
            var data = { positions: [], uvs: [], normals: [], indices: [] };
            var polygons = this.allPolygons();
            polygons.forEach(polygon => {
                polygon.getGeometryData(data);
            });
            for (let i = 0, indices = data.indices, n = data.positions.length / 3; i < n; i++) {
                indices.push(i);
            }
            return data;
        }
        /**
         * 克隆
         */
        clone() {
            var node = new ThreeBSPNode();
            node.divider = this.divider && this.divider.clone();
            node.polygons = this.polygons.map(element => {
                return element.clone();
            });
            node.front = this.front && this.front.clone();
            node.back = this.back && this.back.clone();
            return node;
        }
        ;
        /**
         * 构建树结点
         * @param polygons 多边形列表
         */
        build(polygons) {
            // 以第一个多边形为切割面
            if (this.divider == null) {
                this.divider = polygons[0].clone();
            }
            var front = [], back = [];
            //进行切割并分类
            polygons.forEach(poly => {
                this.divider.subdivide(poly, this.polygons, this.polygons, front, back);
            });
            // 继续切割平面前的多边形
            if (front.length > 0) {
                this.front = this.front || new ThreeBSPNode();
                this.front.build(front);
            }
            // 继续切割平面后的多边形
            if (back.length > 0) {
                this.back = this.back || new ThreeBSPNode();
                this.back.build(back);
            }
            return this;
        }
        ;
        /**
         * 判定是否为凸面体
         * @param polys
         */
        isConvex(polys) {
            polys.every(inner => {
                return polys.every(outer => {
                    if (inner !== outer && outer.classifySide(inner) !== BACK) {
                        return false;
                    }
                    return true;
                });
            });
            return true;
        }
        ;
        /**
         * 所有多边形
         */
        allPolygons() {
            var front = (this.front && this.front.allPolygons()) || [];
            var back = (this.back && this.back.allPolygons()) || [];
            var polygons = this.polygons.slice().concat(front).concat(back);
            return polygons;
        }
        ;
        /**
         * 翻转
         */
        invert() {
            this.polygons.forEach(poly => {
                poly.invert();
            });
            this.divider && this.divider.invert();
            this.front && this.front.invert();
            this.back && this.back.invert();
            var temp = this.back;
            this.back = this.front;
            this.front = temp;
            return this;
        }
        ;
        /**
         * 裁剪多边形
         * @param polygons
         */
        clipPolygons(polygons) {
            if (!this.divider) {
                return polygons.slice();
            }
            var front = [];
            var back = [];
            polygons.forEach(polygon => {
                this.divider.subdivide(polygon, front, back, front, back);
            });
            if (this.front) {
                front = this.front.clipPolygons(front);
            }
            if (this.back) {
                back = this.back.clipPolygons(back);
            }
            if (this.back) {
                return front.concat(back);
            }
            return front;
        }
        ;
        clipTo(node) {
            this.polygons = node.clipPolygons(this.polygons);
            this.front && this.front.clipTo(node);
            this.back && this.back.clipTo(node);
            return this;
        }
        ;
    }
    feng3d.ThreeBSPNode = ThreeBSPNode;
})(feng3d || (feng3d = {}));
var navigation;
(function (navigation) {
    class NavigationProcess {
        constructor(geometry) {
            this.data = new NavigationData();
            this.data.init(geometry);
        }
        checkMaxSlope(maxSlope) {
            var up = new feng3d.Vector3(0, 1, 0);
            var mincos = Math.cos(maxSlope * Math.DEG2RAD);
            var keys = Map.getKeys(this.data.trianglemap);
            keys.forEach(element => {
                var normal = this.data.trianglemap.get(element).getNormal();
                var dot = normal.dot(up);
                if (dot < mincos) {
                    this.data.trianglemap.delete(element);
                }
            });
        }
        checkAgentRadius(agentRadius) {
            var trianglemap = this.data.trianglemap;
            var linemap = this.data.linemap;
            var pointmap = this.data.pointmap;
            var line0map = new Map();
            //获取所有独立边
            var lines = this.getAllSingleLine();
            //调试独立边
            this.debugShowLines(lines);
            // 计算创建边缘边
            var line0s = lines.map(createLine0);
            // 调试边缘边内部方向
            this.debugShowLines1(line0s, agentRadius);
            // 方案1：遍历每个点，使得该点对所有边缘边保持大于agentRadius的距离
            // pointmap.getValues().forEach(handlePoint);
            // 方案2：遍历所有边缘边，把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上，
            line0s.forEach(handleLine0);
            trianglemap.forEach(triangle => {
                if (triangle.getNormal().dot(new feng3d.Vector3(0, 1, 0)) < 0)
                    trianglemap.delete(triangle.index);
            }); //删除面向-y方向的三角形
            // 方案3：在原有模型上减去 以独立边为轴以agentRadius为半径的圆柱（此处需要基于模型之间的剔除等运算）
            /**
             * 把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上
             * @param line0
             */
            function handleLine0(line0) {
                // 三条线段
                var ls = line0map.get(line0.leftline).segment;
                var cs = line0.segment;
                var rs = line0map.get(line0.rightline).segment;
                //
                var ld = line0map.get(line0.leftline).direction;
                var cd = line0.direction;
                var rd = line0map.get(line0.rightline).direction;
                // 顶点坐标
                var p0 = [ls.p0, ls.p1].filter((p) => { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
                var p1 = [ls.p0, ls.p1].filter((p) => { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
                var p2 = [rs.p0, rs.p1].filter((p) => { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
                var p3 = [rs.p0, rs.p1].filter((p) => { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
                // 角平分线上点坐标
                var lp = getHalfAnglePoint(p1, ld, cd, agentRadius);
                var rp = getHalfAnglePoint(p2, cd, rd, agentRadius);
                //debug
                pointGeometry.points.push({ position: lp });
                pointGeometry.points.push({ position: rp });
                pointGeometry.invalidateGeometry();
                //
                var hpmap = {};
                var points = linemap.get(line0.index).points.concat();
                handlePoints();
                function handlePoints() {
                    if (points.length == 0)
                        return;
                    var point = pointmap.get(points.shift());
                    //
                    var ld = ls.getPointDistance(point.getPoint());
                    var cd = cs.getPointDistance(point.getPoint());
                    var rd = rs.getPointDistance(point.getPoint());
                    //
                    if (cd < agentRadius) {
                        if (ld < agentRadius) //处理左夹角内点点
                         {
                            point.setPoint(lp);
                        }
                        else if (rd < agentRadius) //处理右夹角内点点
                         {
                            point.setPoint(rp);
                        }
                        else {
                            point.setPoint(point.getPoint().addTo(line0.direction.clone().scaleNumber(agentRadius - cd)));
                        }
                        //标记该点以被处理
                        hpmap[point.index] = true;
                        // 搜索临近点
                        point.getNearbyPoints().forEach((p) => {
                            if (hpmap[p])
                                return;
                            if (points.indexOf(p) != -1)
                                return;
                            points.push(p);
                        });
                    }
                    handlePoints();
                }
                /**
                 * 获取对角线上距离角的两边距离为 distance 的点
                 * @param pa 角的第一个点
                 * @param d1 角点
                 * @param d2 角的第二个点
                 * @param distance 距离
                 */
                function getHalfAnglePoint(p0, d1, d2, distance) {
                    //对角线方向
                    var djx = d1.addTo(d2).normalize();
                    var cos = djx.dot(d1);
                    var targetPoint = p0.addTo(djx.clone().normalize(distance / cos));
                    return targetPoint;
                }
            }
            /**
             * 使得该点对所有边缘边保持大于agentRadius的距离
             * @param point
             */
            function handlePoint(point) {
                var p = point.getPoint();
                var crossline0s = line0s.reduce((result, line0) => {
                    var distance = line0.segment.getPointDistance(p);
                    if (distance < agentRadius) {
                        result.push([line0, distance]);
                    }
                    return result;
                }, []);
                if (crossline0s.length == 0)
                    return;
                if (crossline0s.length == 1) {
                    point.setPoint(point.getPoint().addTo(crossline0s[0][0].direction.clone().scaleNumber(agentRadius - crossline0s[0][1])));
                }
                else {
                    //如果多于两条线段，取距离最近两条
                    if (crossline0s.length > 2) {
                        crossline0s.sort((a, b) => { return a[1] - b[1]; });
                    }
                    //对角线方向
                    var djx = crossline0s[0][0].direction.addTo(crossline0s[1][0].direction).normalize();
                    //查找两条线段的共同点
                    var points0 = linemap.get(crossline0s[0][0].index).points;
                    var points1 = linemap.get(crossline0s[1][0].index).points;
                    var ps = points0.filter((v) => { return points1.indexOf(v) != -1; });
                    if (ps.length == 1) {
                        var cross = pointmap.get(ps[0]).getPoint();
                        var cos = djx.dot(crossline0s[0][0].segment.p1.subTo(crossline0s[0][0].segment.p0).normalize());
                        var sin = Math.sqrt(1 - cos * cos);
                        var length = agentRadius / sin;
                        var targetPoint = cross.addTo(djx.clone().scaleNumber(length));
                        point.setPoint(targetPoint);
                    }
                    else {
                        ps.length;
                    }
                }
            }
            /**
             * 创建边缘边
             * @param line
             */
            function createLine0(line) {
                var line0 = new Line0();
                line0.index = line.index;
                var points = line.points.map((v) => { var point = pointmap.get(v); return new feng3d.Vector3(point.value[0], point.value[1], point.value[2]); });
                line0.segment = new feng3d.Segment3(points[0], points[1]);
                //
                var triangle = trianglemap.get(line.triangles[0]);
                if (!triangle)
                    return;
                var linepoints = line.points.map((v) => { return pointmap.get(v); });
                var otherPoint = pointmap.get(triangle.points.filter((v) => {
                    return line.points.indexOf(v) == -1;
                })[0]).getPoint();
                line0.direction = line0.segment.getNormalWithPoint(otherPoint);
                line0.leftline = pointmap.get(line.points[0]).lines.filter((line) => {
                    if (line == line0.index)
                        return false;
                    var prelines = lines.filter((l) => {
                        return l.index == line;
                    });
                    return prelines.length == 1;
                })[0];
                line0.rightline = pointmap.get(line.points[1]).lines.filter((line) => {
                    if (line == line0.index)
                        return false;
                    var prelines = lines.filter((l) => {
                        return l.index == line;
                    });
                    return prelines.length == 1;
                })[0];
                line0map.set(line0.index, line0);
                return line0;
            }
        }
        checkAgentHeight(agentHeight) {
            this.data.resetData();
            //
            var pointmap = this.data.pointmap;
            var linemap = this.data.linemap;
            var trianglemap = this.data.trianglemap;
            //
            var triangle0s = Map.getValues(trianglemap).map(createTriangle);
            Map.getValues(pointmap).forEach(handlePoint);
            //
            function createTriangle(triangle) {
                var triangle3D = triangle.getTriangle3D();
                return { triangle3D: triangle3D, index: triangle.index };
            }
            //
            function handlePoint(point) {
                // 测试点是否通过所有三角形测试
                var result = triangle0s.every(triangle0 => {
                    return true;
                });
                // 测试失败时删除该点关联的三角形
                if (!result) {
                    point.triangles.forEach(triangleindex => {
                        trianglemap.delete(triangleindex);
                    });
                }
            }
        }
        getGeometry() {
            return this.data.getGeometry();
        }
        debugShowLines1(line0s, length) {
            var segments = [];
            line0s.forEach(element => {
                var p0 = element.segment.p0.addTo(element.segment.p1).scaleNumber(0.5);
                var p1 = p0.addTo(element.direction.clone().normalize(length));
                segments.push({ start: p0, end: p1, startColor: new feng3d.Color4(1), endColor: new feng3d.Color4(0, 1) });
            });
            segmentGeometry.segments = segments;
        }
        debugShowLines(lines) {
            createSegment();
            segmentGeometry.segments.length = 0;
            lines.forEach(element => {
                var points = element.points.map((pointindex) => {
                    var value = this.data.pointmap.get(pointindex).value;
                    return new feng3d.Vector3(value[0], value[1], value[2]);
                });
                segmentGeometry.addSegment({ start: points[0], end: points[1] });
            });
        }
        /**
         * 获取所有独立边
         */
        getAllSingleLine() {
            var lines = [];
            var needLine = [];
            this.data.linemap.forEach(element => {
                element.triangles = element.triangles.filter((triangleIndex) => { return this.data.trianglemap.has(triangleIndex); });
                if (element.triangles.length == 1)
                    lines.push(element);
                else if (element.triangles.length == 0)
                    needLine.push(element);
            });
            needLine.forEach(element => {
                this.data.linemap.delete(element.index);
            });
            return lines;
        }
    }
    navigation.NavigationProcess = NavigationProcess;
    /**
     * 点
     */
    class Point {
        constructor(pointmap, linemap, trianglemap) {
            /**
             * 点连接的线段索引列表
             */
            this.lines = [];
            /**
             * 点连接的三角形索引列表
             */
            this.triangles = [];
            this.pointmap = pointmap;
            this.linemap = linemap;
            this.trianglemap = trianglemap;
        }
        /**
         * 设置该点位置
         * @param p
         */
        setPoint(p) {
            this.value = [p.x, p.y, p.z];
        }
        /**
         * 获取该点位置
         */
        getPoint() {
            return new feng3d.Vector3(this.value[0], this.value[1], this.value[2]);
        }
        /**
         * 获取相邻点索引列表
         */
        getNearbyPoints() {
            var points = this.triangles.reduce((points, triangleid) => {
                var triangle = this.trianglemap.get(triangleid);
                if (!triangle)
                    return points;
                triangle.points.forEach(point => {
                    if (point != this.index)
                        points.push(point);
                });
                return points;
            }, []);
            return points;
        }
    }
    /**
     * 边
     */
    class Line {
        constructor() {
            /**
             * 线段连接的三角形索引列表
             */
            this.triangles = [];
        }
    }
    /**
     * 三角形
     */
    class Triangle {
        constructor(pointmap, linemap, trianglemap) {
            /**
             * 包含的三个边索引
             */
            this.lines = [];
            this.pointmap = pointmap;
            this.linemap = linemap;
            this.trianglemap = trianglemap;
        }
        getTriangle3D() {
            var points = [];
            this.points.forEach(element => {
                var pointvalue = this.pointmap.get(element).value;
                points.push(new feng3d.Vector3(pointvalue[0], pointvalue[1], pointvalue[2]));
            });
            var triangle3D = new feng3d.Triangle3(points[0], points[1], points[2]);
            return triangle3D;
        }
        /**
         * 获取法线
         */
        getNormal() {
            var normal = this.getTriangle3D().getNormal();
            return normal;
        }
    }
    /**
     * 边
     */
    class Line0 {
    }
    class NavigationData {
        init(geometry) {
            var positions = geometry.positions;
            var indices = geometry.indices;
            console.assert(indices.length % 3 == 0);
            var pointmap = this.pointmap = new Map();
            var linemap = this.linemap = new Map();
            var trianglemap = this.trianglemap = new Map();
            // 合并相同点
            var pointAutoIndex = 0;
            var pointcache = {};
            var pointindexmap = {}; //通过点原来索引映射到新索引
            //
            var lineAutoIndex = 0;
            var linecache = {};
            //
            for (let i = 0, n = positions.length; i < n; i += 3) {
                var point = createPoint(positions[i], positions[i + 1], positions[i + 2]);
                pointindexmap[i / 3] = point.index;
            }
            indices = indices.map((pointindex) => { return pointindexmap[pointindex]; });
            //
            for (let i = 0, n = indices.length; i < n; i += 3) {
                var triangle = new Triangle(pointmap, linemap, trianglemap);
                triangle.index = i / 3;
                triangle.points = [indices[i], indices[i + 1], indices[i + 2]];
                trianglemap.set(triangle.index, triangle);
                //
                pointmap.get(indices[i]).triangles.push(triangle.index);
                pointmap.get(indices[i + 1]).triangles.push(triangle.index);
                pointmap.get(indices[i + 2]).triangles.push(triangle.index);
                //
                var points = triangle.points.concat().sort().map((value) => { return pointmap.get(value); });
                createLine(points[0], points[1], triangle);
                createLine(points[0], points[2], triangle);
                createLine(points[1], points[2], triangle);
            }
            function createLine(point0, point1, triangle) {
                linecache[point0.index] = linecache[point0.index] || {};
                var line = linecache[point0.index][point1.index];
                if (!line) {
                    line = linecache[point0.index][point1.index] = new Line();
                    line.index = lineAutoIndex++;
                    line.points = [point0.index, point1.index];
                    linemap.set(line.index, line);
                    //
                    point0.lines.push(line.index);
                    point1.lines.push(line.index);
                }
                line.triangles.push(triangle.index);
                //
                triangle.lines.push(line.index);
            }
            function createPoint(x, y, z) {
                var xs = x.toPrecision(6);
                var ys = y.toPrecision(6);
                var zs = z.toPrecision(6);
                pointcache[xs] = pointcache[xs] || {};
                pointcache[xs][ys] = pointcache[xs][ys] || {};
                var point = pointcache[xs][ys][zs];
                if (!point) {
                    point = pointcache[xs][ys][zs] = new Point(pointmap, linemap, trianglemap);
                    point.index = pointAutoIndex++;
                    point.value = [x, y, z];
                    pointmap.set(point.index, point);
                }
                return point;
            }
        }
        getGeometry() {
            var positions = [];
            var pointIndexMap = new Map();
            var autoId = 0;
            var indices = [];
            this.trianglemap.forEach(element => {
                var points = element.points.map((pointIndex) => {
                    if (pointIndexMap.has(pointIndex)) {
                        return pointIndexMap.get(pointIndex);
                    }
                    positions.push.apply(positions, this.pointmap.get(pointIndex).value);
                    pointIndexMap.set(pointIndex, autoId++);
                    return autoId - 1;
                });
                indices.push.apply(indices, points);
            });
            return { positions: positions, indices: indices };
        }
        resetData() {
            var geometry = this.getGeometry();
            this.clearData();
            this.init(geometry);
        }
        clearData() {
            this.pointmap.forEach(point => {
                point.pointmap = point.linemap = point.trianglemap = null;
            });
            this.pointmap.clear();
            this.linemap.forEach(line => {
            });
            this.linemap.clear();
            this.trianglemap.forEach(triangle => {
            });
            this.trianglemap.clear();
        }
    }
})(navigation || (navigation = {}));
var segmentGeometry;
var debugSegment;
//
var pointGeometry;
var debugPoint;
function createSegment() {
    console.error(`未实现`);
    var parentobject;
    if (!debugSegment) {
        debugSegment = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "segment" });
        debugSegment.mouseEnabled = false;
        //初始化材质
        var model = debugSegment.addComponent(feng3d.Renderable);
        var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
            shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
            uniforms: { u_segmentColor: new feng3d.Color4(1.0, 0, 0) },
        });
        segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
    }
    parentobject.addChild(debugSegment);
    //
    if (!debugPoint) {
        debugPoint = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "points" });
        debugPoint.mouseEnabled = false;
        var model = debugPoint.addComponent(feng3d.Renderable);
        pointGeometry = model.geometry = new feng3d.PointGeometry();
        var materialp = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
            shaderName: "point", renderParams: { renderMode: feng3d.RenderMode.POINTS },
            uniforms: { u_PointSize: 5, u_color: new feng3d.Color4() },
        });
    }
    pointGeometry.points = [];
    parentobject.addChild(debugPoint);
}
var editor;
(function (editor) {
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
        constructor() {
            /**
             * 用于体素区分是否同属一个三角形
             */
            this._triangleId = 0;
        }
        /**
         * 执行重铸导航
         */
        doRecastnavigation(mesh, agent = new editor.NavigationAgent(), voxelSize) {
            this._aabb = feng3d.Box3.formPositions(mesh.positions);
            this._voxelSize = voxelSize || new feng3d.Vector3(agent.radius / 3, agent.radius / 3, agent.radius / 3);
            this._agent = agent;
            // 
            var size = this._aabb.getSize().divide(this._voxelSize).ceil();
            this._numX = size.x + 1;
            this._numY = size.y + 1;
            this._numZ = size.z + 1;
            //
            this._voxels = [];
            for (let x = 0; x < this._numX; x++) {
                this._voxels[x] = [];
                for (let y = 0; y < this._numY; y++) {
                    this._voxels[x][y] = [];
                }
            }
            this._voxelizationMesh(mesh.indices, mesh.positions);
            this._applyAgent();
        }
        /**
         * 获取体素列表
         */
        getVoxels() {
            var voxels = [];
            for (let x = 0; x < this._numX; x++) {
                for (let y = 0; y < this._numY; y++) {
                    for (let z = 0; z < this._numZ; z++) {
                        if (this._voxels[x][y][z])
                            voxels.push(this._voxels[x][y][z]);
                    }
                }
            }
            return voxels;
        }
        /**
         * 栅格化网格
         */
        _voxelizationMesh(indices, positions) {
            for (let i = 0, n = indices.length; i < n; i += 3) {
                var pi0 = indices[i] * 3;
                var p0 = [positions[pi0], positions[pi0 + 1], positions[pi0 + 2]];
                var pi1 = indices[i + 1] * 3;
                var p1 = [positions[pi1], positions[pi1 + 1], positions[pi1 + 2]];
                var pi2 = indices[i + 2] * 3;
                var p2 = [positions[pi2], positions[pi2 + 1], positions[pi2 + 2]];
                this._voxelizationTriangle(p0, p1, p2);
            }
        }
        /**
         * 栅格化三角形
         * @param p0 三角形第一个顶点
         * @param p1 三角形第二个顶点
         * @param p2 三角形第三个顶点
         */
        _voxelizationTriangle(p0, p1, p2) {
            var triangle = feng3d.Triangle3.fromPositions(p0.concat(p1).concat(p2));
            var normal = triangle.getNormal();
            var result = triangle.rasterizeCustom(this._voxelSize, this._aabb.min);
            result.forEach((v, i) => {
                this._voxels[v.xi][v.yi][v.zi] = {
                    x: v.xv,
                    y: v.yv,
                    z: v.zv,
                    normal: normal,
                    triangleId: this._triangleId,
                    flag: VoxelFlag.Default,
                };
            });
            this._triangleId++;
        }
        /**
         * 应用代理进行计算出可行走体素
         */
        _applyAgent() {
            this._agent.maxSlope;
            this._applyAgentMaxSlope();
            this._applyAgentHeight();
            // this._applyAgentRadius();
        }
        /**
         * 筛选出允许行走坡度的体素
         */
        _applyAgentMaxSlope() {
            var mincos = Math.cos(this._agent.maxSlope * Math.DEG2RAD);
            this.getVoxels().forEach(v => {
                var dot = v.normal.dot(feng3d.Vector3.Y_AXIS);
                if (dot < mincos)
                    v.flag = v.flag | VoxelFlag.DontMaxSlope;
            });
        }
        _applyAgentHeight() {
            for (let x = 0; x < this._numX; x++) {
                for (let z = 0; z < this._numZ; z++) {
                    var preVoxel = null;
                    for (let y = this._numY - 1; y >= 0; y--) {
                        var voxel = this._voxels[x][y][z];
                        if (!voxel)
                            continue;
                        // 不同属一个三角形且上下距离小于指定高度
                        if (preVoxel != null && preVoxel.triangleId != voxel.triangleId && preVoxel.y - voxel.y < this._agent.height) {
                            voxel.flag = voxel.flag | VoxelFlag.DontHeight;
                        }
                        preVoxel = voxel;
                    }
                }
            }
        }
        _applyAgentRadius() {
            this._calculateContour();
        }
        _calculateContour() {
            for (let x = 0; x < this._numX; x++) {
                for (let y = 0; y < this._numY; y++) {
                    for (let z = 0; z < this._numZ; z++) {
                        this._checkContourVoxel(x, y, z);
                    }
                }
            }
        }
        _checkContourVoxel(x, y, z) {
            var voxel = this._voxels[x][y][z];
            if (!voxel)
                return;
            if (x == 0 || x == this._numX - 1 || y == 0 || y == this._numY - 1 || z == 0 || z == this._numZ - 1) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            }
            // this._getRoundVoxels();
            // 获取周围格子
            if (voxel.normal.equals(feng3d.Vector3.Z_AXIS)) {
            }
            voxel.normal;
            voxel.normal;
            if (!(this._isVoxelFlagDefault(x, y, z + 1) || this._voxels[x][y + 1][z + 1] || this._voxels[x][y - 1][z + 1])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 前
            if (!(this._voxels[x][y][z - 1] || this._voxels[x][y + 1][z - 1] || this._voxels[x][y - 1][z - 1])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 后
            if (!(this._voxels[x - 1][y][z] || this._voxels[x - 1][y + 1][z] || this._voxels[x - 1][y - 1][z])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 左
            if (!(this._voxels[x + 1][y][z] || this._voxels[x + 1][y + 1][z] || this._voxels[x + 1][y - 1][z])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 右
        }
        _isVoxelFlagDefault(x, y, z) {
            var voxel = this._voxels[x][y][z];
            if (!voxel)
                return false;
            return voxel.flag == VoxelFlag.Default;
        }
    }
    editor.Recastnavigation = Recastnavigation;
    let VoxelFlag;
    (function (VoxelFlag) {
        VoxelFlag[VoxelFlag["Default"] = 0] = "Default";
        VoxelFlag[VoxelFlag["DontMaxSlope"] = 1] = "DontMaxSlope";
        VoxelFlag[VoxelFlag["DontHeight"] = 2] = "DontHeight";
        VoxelFlag[VoxelFlag["IsContour"] = 4] = "IsContour";
    })(VoxelFlag = editor.VoxelFlag || (editor.VoxelFlag = {}));
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 编辑器脚本
     */
    class EditorScript extends feng3d.Behaviour {
        constructor() {
            super(...arguments);
            this.flag = feng3d.RunEnvironment.editor;
        }
    }
    editor.EditorScript = EditorScript;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class MouseRayTestScript extends editor.EditorScript {
        init() {
            super.init();
            feng3d.windowEventProxy.on("click", this.onclick, this);
        }
        onclick() {
            var mouseRay3D = this.gameObject.scene.mouseRay3D;
            var gameobject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "test" });
            var model = gameobject.addComponent(feng3d.Renderable);
            model.material = new feng3d.Material();
            model.geometry = feng3d.serialization.setValue(new feng3d.SphereGeometry(), { radius: 10 });
            gameobject.mouseEnabled = false;
            this.gameObject.addChild(gameobject);
            var position = mouseRay3D.origin.clone();
            var direction = mouseRay3D.direction.clone();
            position = gameobject.transform.inverseTransformPoint(position);
            direction = gameobject.transform.inverseTransformDirection(direction);
            gameobject.transform.position = position;
            var num = 1000;
            var translate = () => {
                gameobject.transform.translate(direction, 15);
                if (num > 0) {
                    setTimeout(function () {
                        translate();
                    }, 1000 / 60);
                }
                else {
                    gameobject.remove();
                }
                num--;
            };
            translate();
        }
        update() {
        }
        /**
         * 销毁
         */
        dispose() {
            feng3d.windowEventProxy.off("click", this.onclick, this);
        }
    }
    editor.MouseRayTestScript = MouseRayTestScript;
})(editor || (editor = {}));
var editor;
(function (editor) {
    let DirectionLightIcon = class DirectionLightIcon extends editor.EditorScript {
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        init() {
            super.init();
            feng3d.watcher.watch(this, "light", this.onLightChanged, this);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }
        initicon() {
            if (!this._editorCamera)
                return;
            var linesize = 20;
            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "DirectionLightIcon", components: [{ __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                    {
                        __class__: "feng3d.MeshRenderer", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false },
                        material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: { s_texture: { __class__: "feng3d.Texture2D", source: { url: editor.editorData.getEditorAssetPath("assets/3d/icons/sun.png") }, format: feng3d.TextureFormat.RGBA, premulAlpha: true, }, }, renderParams: { enableBlend: true }
                        },
                    },],
            });
            this._textureMaterial = lightIcon.addComponent(feng3d.Renderable).material;
            this.gameObject.addChild(lightIcon);
            //
            var num = 10;
            var segments = [];
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x, y, linesize * 5) });
            }
            num = 36;
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1) * linesize;
                var y1 = Math.cos(angle1) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{ __class__: "feng3d.HoldSizeComponent", camera: this.editorCamera, holdSize: 0.005 },
                    {
                        __class__: "feng3d.MeshRenderer",
                        material: { __class__: "feng3d.Material", shaderName: "segment", uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 163 / 255, g: 162 / 255, b: 107 / 255 } }, renderParams: { renderMode: feng3d.RenderMode.LINES } },
                        geometry: { __class__: "feng3d.SegmentGeometry", segments: segments },
                    },],
            });
            this.gameObject.addChild(lightLines);
            this.enabled = true;
        }
        update() {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this._lightLines.visible = editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
        }
        dispose() {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            super.dispose();
        }
        onLightChanged(newValue, oldValue) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (newValue) {
                this.onScenetransformChanged();
                newValue.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        }
        onScenetransformChanged() {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        }
        onMousedown() {
            editor.editorData.selectObject(this.light.gameObject);
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, () => {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        }
    };
    DirectionLightIcon = __decorate([
        feng3d.RegisterComponent()
    ], DirectionLightIcon);
    editor.DirectionLightIcon = DirectionLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class PointLightIcon extends editor.EditorScript {
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        init() {
            super.init();
            feng3d.watcher.watch(this, "light", this.onLightChanged, this);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }
        initicon() {
            if (!this._editorCamera)
                return;
            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "PointLightIcon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                    {
                        __class__: "feng3d.MeshRenderer", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                        material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.Texture2D",
                                    source: { url: editor.editorData.getEditorAssetPath("assets/3d/icons/light.png") },
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                },
                            },
                            renderParams: { enableBlend: true },
                        },
                    },
                ],
            });
            this._textureMaterial = lightIcon.getComponent(feng3d.Renderable).material;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshRenderer", material: {
                            __class__: "feng3d.Material",
                            shaderName: "segment",
                            uniforms: {
                                u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 },
                            }, renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true, }
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    }]
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Renderable).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshRenderer",
                        geometry: {
                            __class__: "feng3d.PointGeometry",
                            points: [
                                { position: { __class__: "feng3d.Vector3", x: 1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                                { position: { __class__: "feng3d.Vector3", x: -1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                                { position: { __class__: "feng3d.Vector3", y: 1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                                { position: { __class__: "feng3d.Vector3", y: -1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                                { position: { __class__: "feng3d.Vector3", z: 1 }, color: { __class__: "feng3d.Color4", b: 1 } },
                                { position: { __class__: "feng3d.Vector3", z: -1 }, color: { __class__: "feng3d.Color4", b: 1 } }
                            ],
                        },
                        material: {
                            __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { renderMode: feng3d.RenderMode.POINTS, enableBlend: true, },
                        },
                    }],
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Renderable).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        }
        update() {
            if (!this.light)
                return;
            if (!this.editorCamera)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this._lightLines.transform.scale =
                this._lightpoints.transform.scale =
                    new feng3d.Vector3(this.light.range, this.light.range, this.light.range);
            if (editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(this.editorCamera.gameObject.transform.worldPosition);
                //
                var segments = [];
                var alpha = 1;
                var backalpha = 0.5;
                var num = 36;
                var point0;
                var point1;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(0, x, y);
                    point1 = new feng3d.Vector3(0, x1, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 0, 0, alpha), endColor: new feng3d.Color4(1, 0, 0, alpha) });
                    point0 = new feng3d.Vector3(x, 0, y);
                    point1 = new feng3d.Vector3(x1, 0, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 1, 0, alpha), endColor: new feng3d.Color4(0, 1, 0, alpha) });
                    point0 = new feng3d.Vector3(x, y, 0);
                    point1 = new feng3d.Vector3(x1, y1, 0);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 0, 1, alpha), endColor: new feng3d.Color4(0, 0, 1, alpha) });
                }
                this._segmentGeometry.segments = segments;
                this._pointGeometry.points = [];
                var point = new feng3d.Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                point = new feng3d.Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        }
        dispose() {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            super.dispose();
        }
        onLightChanged(newValue, oldValue) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (newValue) {
                this.onScenetransformChanged();
                newValue.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        }
        onScenetransformChanged() {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        }
        onMousedown() {
            editor.editorData.selectObject(this.light.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, () => {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        }
    }
    editor.PointLightIcon = PointLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class SpotLightIcon extends editor.EditorScript {
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        init() {
            super.init();
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }
        initicon() {
            if (!this._editorCamera)
                return;
            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "SpotLightIcon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                    {
                        __class__: "feng3d.MeshRenderer", material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.Texture2D",
                                    source: { url: editor.editorData.getEditorAssetPath("assets/3d/icons/spot.png") },
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                }
                            },
                            renderParams: { enableBlend: true },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this._textureMaterial = lightIcon.getComponent(feng3d.Renderable).material;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshRenderer", material: {
                            __class__: "feng3d.Material", shaderName: "segment",
                            uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                            renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    },
                ],
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Renderable).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.MeshRenderer",
                        material: { __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Renderable).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        }
        update() {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            if (editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                var points = [];
                var segments = [];
                var num = 36;
                var point0;
                var point1;
                var radius = this.light.range * Math.tan(this.light.angle * Math.DEG2RAD * 0.5);
                var distance = this.light.range;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(x * radius, y * radius, distance);
                    point1 = new feng3d.Vector3(x1 * radius, y1 * radius, distance);
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                }
                //
                points.push({ position: new feng3d.Vector3(0, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, -radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, -radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(-radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(-radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                this._pointGeometry.points = points;
                this._segmentGeometry.segments = segments;
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        }
        dispose() {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            super.dispose();
        }
        onLightChanged(property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        }
        onScenetransformChanged() {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        }
        onMousedown() {
            editor.editorData.selectObject(this.light.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, () => {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        }
    }
    __decorate([
        feng3d.watch("onLightChanged")
    ], SpotLightIcon.prototype, "light", void 0);
    editor.SpotLightIcon = SpotLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    class CameraIcon extends editor.EditorScript {
        constructor() {
            super(...arguments);
            this._lensChanged = true;
        }
        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        init() {
            super.init();
            feng3d.watcher.watch(this, "camera", this.onCameraChanged, this);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }
        initicon() {
            if (!this.editorCamera)
                return;
            if (this._lightIcon)
                return;
            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "CameraIcon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                    {
                        __class__: "feng3d.MeshRenderer", material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.Texture2D",
                                    source: { url: editor.editorData.getEditorAssetPath("assets/3d/icons/camera.png") },
                                    format: feng3d.TextureFormat.RGBA,
                                }
                            },
                            renderParams: { enableBlend: true, depthMask: false },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshRenderer", material: {
                            __class__: "feng3d.Material",
                            shaderName: "segment",
                            uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                            renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    },
                ],
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Renderable).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.MeshRenderer",
                        material: { __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Renderable).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        }
        update() {
            if (!this.camera)
                return;
            if (editor.editorData.selectedGameObjects.indexOf(this.camera.gameObject) != -1) {
                if (this._lensChanged) {
                    //
                    var points = [];
                    var segments = [];
                    var lens = this.camera.lens;
                    var near = lens.near;
                    var far = lens.far;
                    var aspect = lens.aspect;
                    if (lens instanceof feng3d.PerspectiveLens) {
                        var fov = lens.fov;
                        var tan = Math.tan(fov * Math.PI / 360);
                        //
                        var nearLeft = -tan * near * aspect;
                        var nearRight = tan * near * aspect;
                        var nearTop = tan * near;
                        var nearBottom = -tan * near;
                        var farLeft = -tan * far * aspect;
                        var farRight = tan * far * aspect;
                        var farTop = tan * far;
                        var farBottom = -tan * far;
                        //
                    }
                    else if (lens instanceof feng3d.OrthographicLens) {
                        var size = lens.size;
                        //
                        var nearLeft = -size * aspect;
                        var nearRight = size;
                        var nearTop = size;
                        var nearBottom = -size;
                        var farLeft = -size;
                        var farRight = size;
                        var farTop = size;
                        var farBottom = -size;
                    }
                    points.push({ position: new feng3d.Vector3(0, farBottom, far) }, { position: new feng3d.Vector3(0, farTop, far) }, { position: new feng3d.Vector3(farLeft, 0, far) }, { position: new feng3d.Vector3(farRight, 0, far) });
                    segments.push({ start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearRight, nearBottom, near) }, { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearLeft, nearTop, near) }, { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(nearRight, nearTop, near) }, { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(nearRight, nearTop, near) }, 
                    //
                    { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(farLeft, farBottom, far) }, { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(farLeft, farTop, far) }, { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(farRight, farBottom, far) }, { start: new feng3d.Vector3(nearRight, nearTop, near), end: new feng3d.Vector3(farRight, farTop, far) }, 
                    //
                    { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farRight, farBottom, far) }, { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farLeft, farTop, far) }, { start: new feng3d.Vector3(farLeft, farTop, far), end: new feng3d.Vector3(farRight, farTop, far) }, { start: new feng3d.Vector3(farRight, farBottom, far), end: new feng3d.Vector3(farRight, farTop, far) });
                    this._pointGeometry.points = points;
                    this._segmentGeometry.segments.length = 0;
                    segments.forEach(v => {
                        this._segmentGeometry.addSegment(v);
                    });
                    this._lensChanged = false;
                }
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        }
        dispose() {
            this.enabled = false;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            super.dispose();
        }
        onCameraChanged(newValue, oldValue) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
                oldValue.off("lensChanged", this.onLensChanged, this);
            }
            if (newValue) {
                this.onScenetransformChanged();
                newValue.on("scenetransformChanged", this.onScenetransformChanged, this);
                newValue.on("lensChanged", this.onLensChanged, this);
            }
        }
        onLensChanged() {
            this._lensChanged = true;
        }
        onScenetransformChanged() {
            this.transform.localToWorldMatrix = this.camera.transform.localToWorldMatrix;
        }
        onMousedown() {
            editor.editorData.selectObject(this.camera.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, () => {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        }
    }
    editor.CameraIcon = CameraIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    editor.loadjs = {
        load: load,
        ready: ready,
    };
    /**
     * 加载文件
     * @param params.paths          加载路径
     * @param params.bundleId       加载包编号
     * @param params.success        成功回调
     * @param params.error          错误回调
     * @param params.async          是否异步加载
     * @param params.numRetries     加载失败尝试次数
     * @param params.before         加载前回调
     * @param params.onitemload     单条文件加载完成回调
     */
    function load(params) {
        // throw error if bundle is already defined
        if (params.bundleId) {
            if (params.bundleId in bundleIdCache) {
                throw "LoadJS";
            }
            else {
                bundleIdCache[params.bundleId] = true;
            }
        }
        var paths = getPaths(params.paths);
        // load scripts
        loadFiles(paths, (pathsNotFound) => {
            // success and error callbacks
            if (pathsNotFound.length)
                (params.error || devnull)(pathsNotFound);
            else
                (params.success || devnull)();
            // publish bundle load event
            publish(params.bundleId, pathsNotFound);
        }, params);
    }
    /**
     * 准备依赖包
     * @param params.depends        依赖包编号
     * @param params.success        成功回调
     * @param params.error          错误回调
     */
    function ready(params) {
        // subscribe to bundle load event
        subscribe(params.depends, (depsNotFound) => {
            // execute callbacks
            if (depsNotFound.length)
                (params.error || devnull)(depsNotFound);
            else
                (params.success || devnull)();
        });
    }
    /**
     * 完成下载包
     * @param bundleId 下载包编号
     */
    function done(bundleId) {
        publish(bundleId, []);
    }
    /**
     * 重置下载包依赖状态
     */
    function reset() {
        bundleIdCache = {};
        bundleResultCache = {};
        bundleCallbackQueue = {};
    }
    /**
     * 是否定义下载包
     * @param {string} bundleId 包编号
     */
    function isDefined(bundleId) {
        return bundleId in bundleIdCache;
    }
    var devnull = function () { }, bundleIdCache = {}, bundleResultCache = {}, bundleCallbackQueue = {};
    /**
     * 订阅包加载事件
     * @param bundleIds              包编号
     * @param callbackFn             完成回调
     */
    function subscribe(bundleIds, callbackFn) {
        var depsNotFound = [];
        // listify
        if (bundleIds instanceof String) {
            bundleIds = [bundleIds];
        }
        // define callback function
        var numWaiting = bundleIds.length;
        var fn = (bundleId, pathsNotFound) => {
            if (pathsNotFound.length)
                depsNotFound.push(bundleId);
            numWaiting--;
            if (!numWaiting)
                callbackFn(depsNotFound);
        };
        // register callback
        var i = bundleIds.length;
        while (i--) {
            let bundleId = bundleIds[i];
            // execute callback if in result cache
            let r = bundleResultCache[bundleId];
            if (r) {
                fn(bundleId, r);
                continue;
            }
            // add to callback queue
            let q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
            q.push(fn);
        }
    }
    /**
     * 派发加载包完成事件
     * @param bundleId                  加载包编号
     * @param pathsNotFound             加载失败包
     */
    function publish(bundleId, pathsNotFound) {
        // exit if id isn't defined
        if (!bundleId)
            return;
        var q = bundleCallbackQueue[bundleId];
        // cache result
        bundleResultCache[bundleId] = pathsNotFound;
        // exit if queue is empty
        if (!q)
            return;
        // empty callback queue
        while (q.length) {
            q[0](bundleId, pathsNotFound);
            q.splice(0, 1);
        }
    }
    /**
     * 加载单个文件
     * @param path                          文件路径
     * @param callbackFn                    加载完成回调
     * @param args                          加载参数
     * @param args.async                    是否异步加载
     * @param args.numRetries               尝试加载次数
     * @param args.before                   加载前回调
     * @param numTries                      当前尝试次数
     */
    function loadFile(path, callbackFn, args, numTries) {
        var loaderFun = loaders[path.type] || loadTxt;
        loaderFun(path, callbackFn, args, numTries);
    }
    /**
     * 加载单个Image文件
     * @param path                          文件路径
     * @param callbackFn                    加载完成回调
     * @param args                          加载参数
     * @param args.async                    是否异步加载
     * @param args.numRetries               尝试加载次数
     * @param args.before                   加载前回调
     * @param numTries                      当前尝试次数
     */
    function loadImage(path, callbackFn, args, numTries = 0) {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onerror = image.onload = (ev) => {
            var result = ev.type;
            // handle retries in case of load failure
            if (result == 'error') {
                // increment counter
                numTries = ~~numTries + 1;
                // exit function and try again
                args.numRetries = args.numRetries || 0;
                if (numTries < ~~args.numRetries + 1) {
                    return loadImage(path, callbackFn, args, numTries);
                }
                image.src = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMC41AP/bAEMABAIDAwMCBAMDAwQEBAQFCQYFBQUFCwgIBgkNCw0NDQsMDA4QFBEODxMPDAwSGBITFRYXFxcOERkbGRYaFBYXFv/bAEMBBAQEBQUFCgYGChYPDA8WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APH6KKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76P//Z";
            }
            // execute callback
            callbackFn(path, result, ev.defaultPrevented, image);
        };
        //
        var beforeCallbackFn = args.before || (() => true);
        if (beforeCallbackFn(path, image) !== false)
            image.src = path.url;
    }
    /**
     * 加载单个txt文件
     * @param path                          文件路径
     * @param callbackFn                    加载完成回调
     * @param args                          加载参数
     * @param args.async                    是否异步加载
     * @param args.numRetries               尝试加载次数
     * @param args.before                   加载前回调
     * @param numTries                      当前尝试次数
     */
    function loadTxt(path, callbackFn, args, numTries = 0) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = (ev) => {
            var result = ev.type;
            if (request.readyState == 4) { // 4 = "loaded"
                request.onreadystatechange = null;
                // handle retries in case of load failure
                if (request.status < 200 || request.status > 300) {
                    // increment counter
                    numTries = ~~numTries + 1;
                    // exit function and try again
                    args.numRetries = args.numRetries || 0;
                    if (numTries < ~~args.numRetries + 1) {
                        return loadTxt(path, callbackFn, args, numTries);
                    }
                }
                // execute callback
                callbackFn(path, result, ev.defaultPrevented, request.responseText);
            }
        };
        request.open('Get', path.url, true);
        //
        var beforeCallbackFn = args.before || (() => true);
        if (beforeCallbackFn(path, request) !== false)
            request.send();
    }
    /**
     * 加载单个js或者css文件
     * @param path                          文件路径
     * @param callbackFn                    加载完成回调
     * @param args                          加载参数
     * @param args.async                    是否异步加载
     * @param args.numRetries               尝试加载次数
     * @param args.before                   加载前回调
     * @param numTries                      当前尝试次数
     */
    function loadJsCss(path, callbackFn, args, numTries = 0) {
        var doc = document, isCss, e;
        if (/(^css!|\.css$)/.test(path.url)) {
            isCss = true;
            // css
            e = doc.createElement('link');
            e.rel = 'stylesheet';
            e.href = path.url.replace(/^css!/, ''); // remove "css!" prefix
        }
        else {
            // javascript
            e = doc.createElement('script');
            e.src = path.url;
            e.async = !!args.async;
        }
        e.onload = e.onerror = e.onbeforeload = function (ev) {
            var result = ev.type;
            // Note: The following code isolates IE using `hideFocus` and treats empty
            // stylesheets as failures to get around lack of onerror support
            if (isCss && 'hideFocus' in e) {
                try {
                    if (!e.sheet.cssText.length)
                        result = 'error';
                }
                catch (x) {
                    // sheets objects created from load errors don't allow access to
                    // `cssText`
                    result = 'error';
                }
            }
            // handle retries in case of load failure
            if (result == 'error') {
                // increment counter
                numTries = ~~numTries + 1;
                // exit function and try again
                args.numRetries = args.numRetries || 0;
                if (numTries < ~~args.numRetries + 1) {
                    return loadJsCss(path, callbackFn, args, numTries);
                }
            }
            // execute callback
            callbackFn(path, result, ev.defaultPrevented, e);
        };
        // add to document (unless callback returns `false`)
        var beforeCallbackFn = args.before || (() => true);
        if (beforeCallbackFn(path, e) !== false)
            doc.head.appendChild(e);
    }
    /**
     * 加载多文件
     * @param paths         文件路径
     * @param callbackFn    加载完成回调
     */
    function loadFiles(paths, callbackFn, args) {
        var notLoadFiles = paths.concat();
        var loadingFiles = [];
        var pathsNotFound = [];
        // define callback function
        var fn = (path, result, defaultPrevented, content) => {
            // handle error
            if (result == 'error')
                pathsNotFound.push(path.url);
            // handle beforeload event. If defaultPrevented then that means the load
            // will be blocked (ex. Ghostery/ABP on Safari)
            if (result[0] == 'b') {
                if (defaultPrevented)
                    pathsNotFound.push(path.url);
                else
                    return;
            }
            var index = loadingFiles.indexOf(path);
            loadingFiles.splice(index, 1);
            args.onitemload && args.onitemload(path.url, content);
            if (loadingFiles.length == 0 && notLoadFiles.length == 0)
                callbackFn(pathsNotFound);
            if (notLoadFiles.length) {
                var file = notLoadFiles[0];
                notLoadFiles.shift();
                loadingFiles.push(file);
                loadFile(file, fn, args);
            }
        };
        // load scripts
        var file;
        if (!!args.async) {
            for (var i = 0, x = notLoadFiles.length; i < x; i++) {
                file = notLoadFiles[i];
                loadingFiles.push(file);
                loadFile(file, fn, args);
            }
            notLoadFiles.length = 0;
        }
        else {
            file = notLoadFiles[0];
            notLoadFiles.shift();
            loadingFiles.push(file);
            loadFile(file, fn, args);
        }
    }
    /**
     * 获取路径以及类型
     * @param pathUrls 路径
     */
    function getPaths(pathUrls) {
        var paths = [];
        if (typeof pathUrls == "string") {
            pathUrls = [pathUrls];
        }
        if (!Array.isArray(pathUrls)) {
            pathUrls = [pathUrls];
        }
        for (var i = 0; i < pathUrls.length; i++) {
            var pathurl = pathUrls[i];
            if (typeof pathurl == "string") {
                paths[i] = { url: pathurl, type: getPathType(pathurl) };
            }
            else {
                paths[i] = pathurl;
            }
        }
        return paths;
    }
    /**
     * 获取路径类型
     * @param path 路径
     */
    function getPathType(path) {
        var type = "txt";
        for (var i = 0; i < typeRegExps.length; i++) {
            var element = typeRegExps[i];
            if (element.reg.test(path))
                type = element.type;
        }
        return type;
    }
    /**
     * 资源类型
     */
    var types = { js: "js", css: "css", txt: "txt", image: "image" };
    /**
     * 加载函数
     */
    var loaders = {
        txt: loadTxt,
        js: loadJsCss,
        css: loadJsCss,
        image: loadImage,
    };
    var typeRegExps = [
        { reg: /(^css!|\.css$)/i, type: types.css },
        { reg: /(\.js\b)/i, type: types.js },
        { reg: /(\.png\b)/i, type: types.image },
        { reg: /(\.jpg\b)/i, type: types.image },
    ];
})(editor || (editor = {}));
var editor;
(function (editor) {
    class ThreejsLoader {
        load(url, completed) {
            editor.editorRS.fs.readArrayBuffer(url, (err, data) => {
                load(data, (gameobject) => {
                    gameobject.name = feng3d.pathUtils.getName(url);
                    feng3d.globalDispatcher.dispatch("asset.parsed", gameobject);
                });
            });
        }
    }
    editor.ThreejsLoader = ThreejsLoader;
    editor.threejsLoader = new ThreejsLoader();
    var usenumberfixed = true;
    function load(url, onParseComplete) {
        var skeletonComponent;
        prepare(() => {
            //
            var loader = new window["THREE"].FBXLoader();
            if (typeof url == "string") {
                loader.load(url, onLoad, onProgress, onError);
            }
            else if (url instanceof ArrayBuffer) {
                var scene = loader.parse(url);
                onLoad(scene);
            }
            else {
                var reader = new FileReader();
                reader.addEventListener('load', function (event) {
                    var scene = loader.parse(event.target["result"]);
                    onLoad(scene);
                }, false);
                reader.readAsArrayBuffer(url);
            }
        });
        function onLoad(scene) {
            var gameobject = parse(scene);
            gameobject.transform.sx = -1;
            onParseComplete && onParseComplete(gameobject);
            console.log("onLoad");
        }
        function onProgress(event) {
            console.log(event);
        }
        function onError(err) {
            console.error(err);
        }
        function parse(object3d, parent) {
            if (object3d.type == "Bone")
                return null;
            var gameobject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: object3d.name });
            gameobject.transform.position = new feng3d.Vector3(object3d.position.x, object3d.position.y, object3d.position.z);
            gameobject.transform.orientation = new feng3d.Quaternion(object3d.quaternion.x, object3d.quaternion.y, object3d.quaternion.z, object3d.quaternion.w);
            gameobject.transform.scale = new feng3d.Vector3(object3d.scale.x, object3d.scale.y, object3d.scale.z);
            if (parent)
                parent.addChild(gameobject);
            switch (object3d.type) {
                case "PerspectiveCamera":
                    gameobject.addComponent(feng3d.Camera).lens = parsePerspectiveCamera(object3d);
                    break;
                case "SkinnedMesh":
                    var skinnedModel = gameobject.addComponent(feng3d.SkinnedMeshRenderer);
                    skinnedModel.geometry = parseGeometry(object3d.geometry);
                    skinnedModel.material.renderParams.cullFace = feng3d.CullFace.NONE;
                    console.assert(object3d.bindMode == "attached");
                    skinnedModel.skinSkeleton = parseSkinnedSkeleton(skeletonComponent, object3d.skeleton);
                    if (parent)
                        skinnedModel.initMatrix = gameobject.transform.localToWorldMatrix.clone();
                    break;
                case "Mesh":
                    var model = gameobject.addComponent(feng3d.Renderable);
                    model.geometry = parseGeometry(object3d.geometry);
                    model.material.renderParams.cullFace = feng3d.CullFace.NONE;
                    break;
                case "Group":
                    if (object3d.skeleton) {
                        skeletonComponent = gameobject.addComponent(feng3d.SkeletonComponent);
                        skeletonComponent.joints = parseSkeleton(object3d.skeleton);
                    }
                    break;
                case "Bone":
                    //Bone 由SkeletonComponent自动生成，不用解析
                    break;
                default:
                    console.warn(`没有提供 ${object3d.type} 类型对象的解析`);
                    break;
            }
            if (object3d.animations && object3d.animations.length > 0) {
                var animation = gameobject.addComponent(feng3d.Animation);
                for (var i = 0; i < object3d.animations.length; i++) {
                    var animationClip = parseAnimations(object3d.animations[i]);
                    animation.animations.push(animationClip);
                    animation.animation = animation.animations[0];
                }
            }
            object3d.children.forEach(element => {
                parse(element, gameobject);
            });
            return gameobject;
        }
    }
    function parseAnimations(animationClipData) {
        var matrixTemp = new window["THREE"].Matrix4();
        var quaternionTemp = new window["THREE"].Quaternion();
        var fmatrix = new feng3d.Matrix4x4();
        //
        var animationClip = new feng3d.AnimationClip();
        animationClip.name = animationClipData.name;
        animationClip.length = animationClipData.duration * 1000;
        animationClip.propertyClips = [];
        var tracks = animationClipData.tracks;
        var len = tracks.length;
        for (var i = 0; i < len; i++) {
            var propertyClip = parsePropertyClip(tracks[i]);
            animationClip.propertyClips.push(propertyClip);
        }
        return animationClip;
        function parsePropertyClip(keyframeTrack) {
            var propertyClip = new feng3d.PropertyClip();
            var trackName = keyframeTrack.name;
            var result = /\.bones\[(\w+)\]\.(\w+)/.exec(trackName);
            propertyClip.path = [
                [feng3d.PropertyClipPathItemType.GameObject, result[1]],
                [feng3d.PropertyClipPathItemType.Component, , "feng3d.Transform"],
            ];
            switch (result[2]) {
                case "position":
                    propertyClip.propertyName = "position";
                    break;
                case "scale":
                    propertyClip.propertyName = "scale";
                    break;
                case "quaternion":
                    propertyClip.propertyName = "orientation";
                    break;
                default:
                    console.warn(`没有处理 propertyName ${result[2]}`);
                    break;
            }
            propertyClip.propertyValues = [];
            var propertyValues = propertyClip.propertyValues;
            var times = keyframeTrack.times;
            var values = Array.from(keyframeTrack.values);
            if (usenumberfixed) {
                values = values.map((v) => { return Number(v.toFixed(6)); });
            }
            var len = times.length;
            switch (keyframeTrack.ValueTypeName) {
                case "vector":
                    propertyClip.type = "Vector3";
                    for (var i = 0; i < len; i++) {
                        propertyValues.push([times[i] * 1000, [values[i * 3], values[i * 3 + 1], values[i * 3 + 2]]]);
                    }
                    break;
                case "quaternion":
                    propertyClip.type = "Quaternion";
                    for (var i = 0; i < len; i++) {
                        propertyValues.push([times[i] * 1000, [values[i * 4], values[i * 4 + 1], values[i * 4 + 2], values[i * 4 + 3]]]);
                    }
                    break;
                default:
                    console.warn(`没有提供解析 ${keyframeTrack.ValueTypeName} 类型Track数据`);
                    break;
            }
            return propertyClip;
        }
    }
    function parseSkeleton(skeleton) {
        var joints = [];
        var skeNameDic = {};
        var len = skeleton.bones.length;
        for (var i = 0; i < len; i++) {
            skeNameDic[skeleton.bones[i].name] = i;
        }
        for (var i = 0; i < len; i++) {
            var bone = skeleton.bones[i];
            var skeletonJoint = joints[i] = new feng3d.SkeletonJoint();
            //
            skeletonJoint.name = bone.name;
            skeletonJoint.matrix = new feng3d.Matrix4x4(bone.matrixWorld.elements);
            var parentId = skeNameDic[bone.parent.name];
            if (parentId === undefined)
                parentId = -1;
            skeletonJoint.parentIndex = parentId;
        }
        return joints;
    }
    function parseSkinnedSkeleton(skeleton, skinSkeletonData) {
        var skinSkeleton = new feng3d.SkinSkeletonTemp();
        var joints = skeleton.joints;
        var jointsMap = {};
        for (var i = 0; i < joints.length; i++) {
            jointsMap[joints[i].name] = [i, joints[i].name];
        }
        var bones = skinSkeletonData.bones;
        var len = bones.length;
        skinSkeleton.numJoint = len;
        for (var i = 0; i < len; i++) {
            var jointsMapitem = jointsMap[bones[i].name];
            if (jointsMapitem == null && bones[i].parent) {
                jointsMapitem = jointsMap[bones[i].parent.name];
            }
            if (jointsMapitem) {
                skinSkeleton.joints[i] = jointsMapitem;
                joints[jointsMapitem[0]].matrix = new feng3d.Matrix4x4(skinSkeletonData.boneInverses[i].elements).invert();
            }
            else {
                console.warn(`没有在骨架中找到 骨骼 ${bones[i].name}`);
            }
        }
        return skinSkeleton;
    }
    function parseGeometry(geometry) {
        var attributes = geometry.attributes;
        var geo = new feng3d.CustomGeometry();
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                var element = attributes[key];
                var array = Array.from(element.array);
                if (usenumberfixed) {
                    array = array.map((v) => { return Number(v.toFixed(6)); });
                }
                switch (key) {
                    case "position":
                        geo.positions = array;
                        break;
                    case "normal":
                        geo.normals = array;
                        break;
                    case "uv":
                        geo.uvs = array;
                        break;
                    case "skinIndex":
                        geo.skinIndices = array;
                        break;
                    case "skinWeight":
                        geo.skinWeights = array;
                        break;
                    default:
                        console.warn("没有解析顶点数据", key);
                        break;
                }
            }
        }
        if (geometry.index) {
            geo.indices = geometry.index;
        }
        return geo;
    }
    function parsePerspectiveCamera(perspectiveCamera) {
        var perspectiveLen = new feng3d.PerspectiveLens();
        perspectiveLen.near = perspectiveCamera.near;
        perspectiveLen.far = perspectiveCamera.far;
        perspectiveLen.aspect = perspectiveCamera.aspect;
        perspectiveLen.fov = perspectiveCamera.fov;
        return perspectiveLen;
    }
    var prepare = (() => {
        var isprepare = false;
        var prepareCallbacks = [];
        var preparing = false;
        return (callback) => {
            if (isprepare) {
                callback();
                return;
            }
            prepareCallbacks.push(callback);
            if (preparing)
                return;
            preparing = true;
            editor.loadjs.load({
                paths: [
                    "threejs/three.js",
                    // <!-- FBX -->
                    "threejs/libs/inflate.min.js",
                    //
                    "threejs/loaders/AMFLoader.js",
                    "threejs/loaders/AWDLoader.js",
                    "threejs/loaders/BabylonLoader.js",
                    "threejs/loaders/ColladaLoader.js",
                    "threejs/loaders/FBXLoader.js",
                    "threejs/loaders/GLTFLoader.js",
                    "threejs/loaders/KMZLoader.js",
                    "threejs/loaders/MD2Loader.js",
                    "threejs/loaders/OBJLoader.js",
                    "threejs/loaders/MTLLoader.js",
                    "threejs/loaders/PlayCanvasLoader.js",
                    "threejs/loaders/PLYLoader.js",
                    "threejs/loaders/STLLoader.js",
                    "threejs/loaders/TGALoader.js",
                    "threejs/loaders/TDSLoader.js",
                    "threejs/loaders/UTF8Loader.js",
                    "threejs/loaders/VRMLLoader.js",
                    "threejs/loaders/VTKLoader.js",
                    "threejs/loaders/ctm/lzma.js",
                    "threejs/loaders/ctm/ctm.js",
                    "threejs/loaders/ctm/CTMLoader.js",
                ].map((value) => { return editor.editorData.getEditorAssetPath(value); }),
                bundleId: "threejs",
                success: () => {
                    Number.prototype["format"] = function () {
                        return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    };
                    // log("提供解析的 three.js 初始化完成，")
                    isprepare = true;
                    preparing = false;
                    prepareCallbacks.forEach(element => {
                        element();
                    });
                }
            });
        };
    })();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 菜单配置
     */
    class MenuConfig {
        /**
         * 主菜单
         */
        getMainMenu() {
            var mainMenu = [
                {
                    label: "文件",
                    submenu: [
                        {
                            label: "新建场景",
                            click: () => {
                                editor.editorData.gameScene = feng3d.View.createNewScene();
                            },
                        },
                        {
                            label: "打开场景",
                            click: () => {
                                alert("未实现！");
                                //
                                // editorData.gameScene = feng3d.View.createNewScene();
                            },
                        },
                        {
                            label: "新建项目", click: () => {
                                editor.popupview.popupObject({ newprojectname: "newproject" }, {
                                    closecallback: (data) => {
                                        if (data.newprojectname && data.newprojectname.length > 0) {
                                            editor.editorcache.projectname = data.newprojectname;
                                            window.location.reload();
                                        }
                                    }
                                });
                            },
                        },
                        {
                            label: "打开最近的项目",
                            submenu: editor.editorcache.lastProjects.map(element => {
                                var menuItem = {
                                    label: element, click: () => {
                                        if (editor.editorcache.projectname != element) {
                                            editor.editorcache.projectname = element;
                                            window.location.reload();
                                        }
                                    }
                                };
                                return menuItem;
                            }),
                            click: () => {
                                editor.popupview.popupObject({ newprojectname: "newproject" }, {
                                    closecallback: (data) => {
                                        if (data.newprojectname && data.newprojectname.length > 0) {
                                            editor.editorcache.projectname = data.newprojectname;
                                            window.location.reload();
                                        }
                                    }
                                });
                            }
                        },
                        {
                            label: "保存场景", click: () => {
                                var gameobject = editor.hierarchy.rootnode.gameobject;
                                editor.editorAsset.saveObject(gameobject);
                            }
                        },
                        {
                            label: "打开项目", click: () => {
                                editor.editorRS.clearProject(() => {
                                    editor.editorRS.selectFile((filelist) => {
                                        editor.editorRS.importProject(filelist.item(0), () => {
                                            editor.editorAsset.initproject(() => {
                                                editor.editorAsset.runProjectScript(() => {
                                                    editor.editorAsset.readScene("default.scene.json", (err, scene) => {
                                                        editor.editorData.gameScene = scene;
                                                        editor.editorui.assetview.invalidateAssettree();
                                                        console.log("打开项目完成!");
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        },
                        {
                            label: "导出项目", click: () => {
                                editor.editorRS.exportProjectToJSZip(`${editor.editorcache.projectname}.feng3d.zip`);
                            }
                        },
                        {
                            label: "打开网络项目",
                            submenu: [
                                {
                                    label: "地形", click: () => {
                                        openDownloadProject("terrain.feng3d.zip");
                                    },
                                },
                                {
                                    label: "自定义材质", click: () => {
                                        openDownloadProject("customshader.feng3d.zip");
                                    },
                                },
                                {
                                    label: "水", click: () => {
                                        openDownloadProject("water.feng3d.zip");
                                    },
                                },
                                {
                                    label: "灯光", click: () => {
                                        openDownloadProject("light.feng3d.zip");
                                    },
                                },
                                {
                                    label: "声音", click: () => {
                                        openDownloadProject("audio.feng3d.zip");
                                    },
                                },
                            ],
                        },
                        {
                            label: "下载网络项目",
                            submenu: [
                                {
                                    label: "地形", click: () => {
                                        downloadProject("terrain.feng3d.zip");
                                    },
                                },
                                {
                                    label: "自定义材质", click: () => {
                                        downloadProject("customshader.feng3d.zip");
                                    },
                                },
                                {
                                    label: "水", click: () => {
                                        downloadProject("water.feng3d.zip");
                                    },
                                },
                                {
                                    label: "灯光", click: () => {
                                        downloadProject("light.feng3d.zip");
                                    },
                                },
                            ],
                        },
                        {
                            label: "升级项目",
                            click: () => {
                                editor.editorRS.upgradeProject(() => {
                                    alert("升级完成！");
                                });
                            },
                        },
                        {
                            label: "清空项目",
                            click: () => {
                                editor.editorAsset.rootFile.remove();
                                editor.editorAsset.initproject(() => {
                                    editor.editorAsset.runProjectScript(() => {
                                        editor.editorData.gameScene = feng3d.View.createNewScene();
                                        editor.editorui.assetview.invalidateAssettree();
                                        console.log("清空项目完成!");
                                    });
                                });
                            },
                        },
                    ],
                },
                { type: "separator" },
                {
                    label: "调试",
                    submenu: [{
                            label: "打开开发者工具",
                            click: () => {
                                editor.nativeAPI.openDevTools();
                            }, show: !!editor.nativeAPI,
                        },
                        {
                            label: "编译脚本",
                            click: () => {
                                feng3d.globalDispatcher.dispatch("script.compile");
                            },
                        },],
                },
                {
                    label: "窗口",
                    submenu: this.getWindowSubMenus(),
                },
                {
                    label: "帮助",
                    submenu: [
                        {
                            label: "问题",
                            click: () => {
                                window.open("https://github.com/feng3d-labs/editor/issues");
                            },
                        },
                        {
                            label: "文档",
                            click: () => {
                                window.open("http://feng3d.com");
                            },
                        },
                    ],
                },
            ];
            return mainMenu;
        }
        /**
         * 获取窗口子菜单
         */
        getWindowSubMenus() {
            var menus = [
                {
                    label: "Layouts",
                    submenu: Object.keys(editor.viewLayoutConfig).map(v => {
                        return {
                            label: v,
                            click: () => {
                                feng3d.globalDispatcher.dispatch("viewLayout.reset", editor.viewLayoutConfig[v]);
                            },
                        };
                    }),
                },
            ];
            // popupview.popupViewWindow(ShortCutSetting.instance, { mode: false, width: 800, height: 600 });
            [editor.SceneView.moduleName,
                editor.InspectorView.moduleName,
                editor.HierarchyView.moduleName,
                editor.ProjectView.moduleName,
                editor.AnimationView.moduleName,
                editor.ShortCutSetting.moduleName,
            ].forEach(v => {
                menus.push({
                    label: v,
                    click: () => {
                        var tabview = new editor.TabView();
                        tabview.setModuleNames([v]);
                        tabview.left = tabview.right = tabview.top = tabview.bottom = 0;
                        editor.popupview.popupViewWindow(tabview, { mode: false });
                    },
                });
            });
            return menus;
        }
        /**
         * 层级界面创建3D对象列表数据
         */
        getCreateObjectMenu() {
            var menu = [
                //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
                {
                    label: "游戏对象", click: () => {
                        editor.hierarchy.addGameObject(new feng3d.GameObject());
                    }
                },
                { type: "separator" },
                {
                    label: "3D对象",
                    submenu: [
                        {
                            label: "平面", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Plane"));
                            }
                        },
                        {
                            label: "四边形", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Quad"));
                            }
                        },
                        {
                            label: "立方体", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Cube"));
                            }
                        },
                        {
                            label: "球体", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Sphere"));
                            }
                        },
                        {
                            label: "胶囊体", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Capsule"));
                            }
                        },
                        {
                            label: "圆柱体", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Cylinder"));
                            }
                        },
                        {
                            label: "圆锥体", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Cone"));
                            }
                        },
                        {
                            label: "圆环", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Torus"));
                            }
                        },
                        {
                            label: "线段", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Segment"));
                            }
                        },
                        {
                            label: "地形", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Terrain"));
                            }
                        },
                        {
                            label: "水", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Water"));
                            }
                        },
                    ],
                },
                {
                    label: "光源",
                    submenu: [
                        {
                            label: "点光源", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Point light"));
                            }
                        },
                        {
                            label: "方向光源", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Directional light"));
                            }
                        },
                        {
                            label: "聚光灯", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Spot light"));
                            }
                        },
                    ],
                },
                {
                    label: "UI",
                    submenu: [
                        {
                            label: "矩形", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Rect"));
                            }
                        },
                        {
                            label: "图片", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Image"));
                            }
                        },
                        {
                            label: "文本", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Text"));
                            }
                        },
                        {
                            label: "按钮", click: () => {
                                editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Button"));
                            }
                        },
                    ],
                },
                {
                    label: "粒子系统", click: () => {
                        editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Particle System"));
                    }
                },
                {
                    label: "摄像机", click: () => {
                        editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Camera"));
                    }
                },
            ];
            return menu;
        }
        /**
         * 获取创建游戏对象组件菜单
         * @param gameobject 游戏对象
         */
        getCreateComponentMenu(gameobject) {
            var menu = [];
            // 处理 由 AddComponentMenu 添加的菜单
            feng3d.menuConfig.component.forEach(item => {
                var paths = item.path.split("/");
                var currentmenu = menu;
                var currentMenuItem = null;
                paths.forEach(p => {
                    if (currentMenuItem) {
                        if (!currentMenuItem.submenu)
                            currentMenuItem.submenu = [];
                        currentmenu = currentMenuItem.submenu;
                        currentMenuItem = null;
                    }
                    currentMenuItem = currentmenu.filter(m => m.label == p)[0];
                    if (!currentMenuItem) {
                        currentMenuItem = { label: p };
                        currentmenu.push(currentMenuItem);
                    }
                    ;
                });
                currentMenuItem.click = () => { gameobject.addComponent(item.type); };
            });
            return menu;
        }
    }
    editor.MenuConfig = MenuConfig;
    editor.menuConfig = new MenuConfig();
    /**
     * 下载项目
     * @param projectname
     */
    function openDownloadProject(projectname, callback) {
        editor.editorAsset.rootFile.delete();
        downloadProject(projectname, callback);
    }
    /**
     * 下载项目
     * @param projectname
     */
    function downloadProject(projectname, callback) {
        var path = "projects/" + projectname;
        feng3d.loader.loadBinary(path, (content) => {
            editor.editorRS.importProject(content, () => {
                editor.editorAsset.initproject(() => {
                    editor.editorAsset.runProjectScript(() => {
                        editor.editorAsset.readScene("default.scene.json", (err, scene) => {
                            editor.editorData.gameScene = scene;
                            editor.editorui.assetview.invalidateAssettree();
                            console.log(`${projectname} 项目下载完成!`);
                            callback && callback();
                        });
                    });
                });
            });
        });
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    editor.viewLayoutConfig = {
        Default: { "x": 0, "y": 0, "width": 1440, "height": 712, "percentWidth": null, "percentHeight": null, "top": 0, "bottom": 0, "left": 0, "right": 0, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 1184, "height": 712, "percentWidth": 82.08333333333333, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "VerticalLayout", "children": [{ "x": 0, "y": 0, "width": 1184, "height": 458, "percentWidth": 100, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 200, "height": 458, "percentWidth": null, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Hierarchy"] }, { "x": 204, "y": 0, "width": 980, "height": 458, "percentWidth": 100, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }] }, { "x": 0, "y": 462, "width": 1184, "height": 250, "percentWidth": 100, "percentHeight": null, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Project"] }] }, { "x": 1188, "y": 0, "width": 252, "height": 712, "percentWidth": 17.63888888888889, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Inspector"] }] },
        Tall: { "x": 0, "y": 0, "width": 1920, "height": 890, "percentWidth": null, "percentHeight": null, "top": 0, "bottom": 0, "left": 0, "right": 0, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 1574, "height": 890, "percentWidth": 81.97916666666667, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 1130, "height": 890, "percentWidth": 71.79161372299873, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }, { "x": 1132, "y": 0, "width": 442, "height": 890, "percentWidth": 28.081321473951714, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "VerticalLayout", "children": [{ "x": 0, "y": 0, "width": 442, "height": 482, "percentWidth": 100, "percentHeight": 54.157303370786515, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Hierarchy"] }, { "x": 0, "y": 484, "width": 442, "height": 406, "percentWidth": 100, "percentHeight": 45.61797752808989, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Project"] }] }] }, { "x": 1576, "y": 0, "width": 344, "height": 890, "percentWidth": 17.916666666666668, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Inspector"] }] },
        Wide: { "x": 0, "y": 0, "width": 1920, "height": 890, "percentWidth": null, "percentHeight": null, "top": 0, "bottom": 0, "left": 0, "right": 0, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 1576, "height": 890, "percentWidth": 82.08333333333333, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "VerticalLayout", "children": [{ "x": 0, "y": 0, "width": 1576, "height": 638, "percentWidth": 100, "percentHeight": 71.84684684684684, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }, { "x": 0, "y": 640, "width": 1576, "height": 250, "percentWidth": 100, "percentHeight": 28.153153153153156, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 740, "height": 250, "percentWidth": 46.954314720812185, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Hierarchy"] }, { "x": 742, "y": 0, "width": 834, "height": 250, "percentWidth": 52.91878172588832, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Project"] }] }] }, { "x": 1578, "y": 0, "width": 339, "height": 890, "percentWidth": 17.63888888888889, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Inspector"] }] },
        fourSplit: { "x": 0, "y": 0, "width": 1920, "height": 890, "percentWidth": null, "percentHeight": null, "top": 0, "bottom": 0, "left": 0, "right": 0, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 1578, "height": 890, "percentWidth": 82.2976501305483, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 1131, "height": 890, "percentWidth": 71.67300380228137, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "VerticalLayout", "children": [{ "x": 0, "y": 0, "width": 1131, "height": 491, "percentWidth": 100, "percentHeight": 55.172413793103445, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 537, "height": 491, "percentWidth": 47.45395449620802, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }, { "x": 539, "y": 0, "width": 592, "height": 491, "percentWidth": 52.329360780065, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }] }, { "x": 0, "y": 493, "width": 1131, "height": 396, "percentWidth": 100, "percentHeight": 44.5141065830721, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "HorizontalLayout", "children": [{ "x": 0, "y": 0, "width": 537, "height": 396, "percentWidth": 47.45395449620802, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }, { "x": 539, "y": 0, "width": 592, "height": 396, "percentWidth": 52.329360780065, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Scene"] }] }] }, { "x": 1133, "y": 0, "width": 445, "height": 890, "percentWidth": 28.200253485424586, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "SplitGroup", "layout": "VerticalLayout", "children": [{ "x": 0, "y": 0, "width": 445, "height": 490, "percentWidth": 100, "percentHeight": 55.0561797752809, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Hierarchy"] }, { "x": 0, "y": 492, "width": 445, "height": 398, "percentWidth": 100, "percentHeight": 44.71910112359551, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Project"] }] }] }, { "x": 1580, "y": 0, "width": 340, "height": 890, "percentWidth": 17.702349869451698, "percentHeight": 100, "top": null, "bottom": null, "left": null, "right": null, "type": "TabView", "modules": ["Inspector"] }] },
    };
})(editor || (editor = {}));
var editor;
(function (editor) {
    //
    feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
    feng3d.objectview.defaultObjectViewClass = "OVDefault";
    feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
    feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";
    //
    feng3d.objectview.setDefaultTypeAttributeView("Boolean", { component: "OAVBoolean" });
    feng3d.objectview.setDefaultTypeAttributeView("String", { component: "OAVString" });
    feng3d.objectview.setDefaultTypeAttributeView("number", { component: "OAVNumber" });
    feng3d.objectview.setDefaultTypeAttributeView("Vector2", { component: "OAVVector2" });
    feng3d.objectview.setDefaultTypeAttributeView("Vector3", { component: "OAVVector3" });
    feng3d.objectview.setDefaultTypeAttributeView("Vector4", { component: "OAVVector4" });
    feng3d.objectview.setDefaultTypeAttributeView("Array", { component: "OAVArray" });
    feng3d.objectview.setDefaultTypeAttributeView("Function", { component: "OAVFunction" });
    feng3d.objectview.setDefaultTypeAttributeView("Color3", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("Color4", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("Texture2D", { component: "OAVTexture2D" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxGradient", { component: "OAVMinMaxGradient" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxCurve", { component: "OAVMinMaxCurve" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxCurveVector3", { component: "OAVMinMaxCurveVector3" });
    //
})(editor || (editor = {}));
/**
 * 快捷键配置
 */
var shortcutConfig = [
    //	key					[必须]	快捷键；用“+”连接多个按键，“!”表示没按下某键；例如 “a+!b”表示按下“a”与没按下“b”时触发。
    //	command				[可选]	要执行的command的id；使用“,”连接触发多个命令；例如 “commandA,commandB”表示满足触发条件后依次执行commandA与commandB命令。
    //	stateCommand		[可选]	要执行的状态命令id；使用“,”连接触发多个状态命令，没带“!”表示激活该状态，否则表示使其处于非激活状态；例如 “stateA,!stateB”表示满足触发条件后激活状态“stateA，使“stateB处于非激活状态。
    //	when				[可选]	快捷键激活的条件；使用“+”连接多个状态，没带“!”表示需要处于激活状态，否则需要处于非激活状态； 例如 “stateA+!stateB”表示stateA处于激活状态且stateB处于非激活状态时会判断按键是否满足条件。
    { key: "alt+rightmousedown", command: "sceneCameraForwardBackMouseMoveStart", stateCommand: "sceneCameraForwardBackMouseMoving", when: "mouseInView3D+!fpsViewing" },
    { key: "mousemove", command: "sceneCameraForwardBackMouseMove", when: "sceneCameraForwardBackMouseMoving" },
    { key: "rightmouseup", command: "sceneCameraForwardBackMouseMoveEnd", stateCommand: "!sceneCameraForwardBackMouseMoving", when: "sceneCameraForwardBackMouseMoving" },
    //
    { key: "rightmousedown", command: "fpsViewStart", stateCommand: "fpsViewing", when: "!sceneCameraForwardBackMouseMoving" },
    { key: "rightmouseup", command: "fpsViewStop", stateCommand: "!fpsViewing", when: "fpsViewing" },
    //
    { key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "mouseInView3D" },
    { key: "mousemove", command: "mouseRotateScene", when: "mouseRotateSceneing" },
    { key: "mouseup", command: "mouseRotateSceneEnd", stateCommand: "!mouseRotateSceneing", when: "mouseRotateSceneing" },
    //
    { key: "middlemousedown", command: "dragSceneStart", stateCommand: "dragSceneing", when: "mouseInView3D" },
    { key: "mousemove", command: "dragScene", when: "dragSceneing" },
    { key: "middlemouseup", command: "dragSceneEnd", stateCommand: "!dragSceneing", when: "dragSceneing" },
    //
    { key: "wheel", command: "mouseWheelMoveSceneCamera", when: "mouseInView3D" },
    //
    { key: "f", command: "lookToSelectedGameObject", when: "" },
    { key: "w", command: "gameobjectMoveTool", when: "!fpsViewing" },
    { key: "e", command: "gameobjectRotationTool", when: "!fpsViewing" },
    { key: "r", command: "gameobjectScaleTool", when: "!fpsViewing" },
    //
    { key: "del", command: "deleteSeletedGameObject", when: "" },
    //
    { key: "!alt+mousedown", stateCommand: "selecting", when: "!inModal+mouseInView3D+!splitGroupDraging" },
    { key: "mousemove", stateCommand: "!selecting", when: "selecting" },
    { key: "mouseup", command: "selectGameObject", stateCommand: "!selecting", when: "selecting" },
    //
    { key: "!alt+mousedown", command: "areaSelectStart", stateCommand: "areaSelecting", when: "!inModal+mouseInView3D+!splitGroupDraging" },
    { key: "mousemove", command: "areaSelect", when: "areaSelecting+!mouseInSceneRotateTool+!inTransforming+!selectInvalid" },
    { key: "mouseup", command: "areaSelectEnd", stateCommand: "!areaSelecting", when: "areaSelecting" },
    //
    { key: "f12", command: "openDevTools", stateCommand: "", when: "" },
    { key: "f5", command: "refreshWindow", stateCommand: "", when: "" },
    //
    { key: "ctrl+c", command: "copy" },
    { key: "ctrl+v", command: "paste" },
    { key: "ctrl+z", command: "undo" },
];
//////////////////////////////////////////////////////////////////////////////////////
//
//  The MIT License (MIT)
//
//  Copyright (c) 2015-present, Dom Chen.
//  All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy of
//  this software and associated documentation files (the "Software"), to deal in the
//  Software without restriction, including without limitation the rights to use, copy,
//  modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
//  and to permit persons to whom the Software is furnished to do so, subject to the
//  following conditions:
//
//      The above copyright notice and this permission notice shall be included in all
//      copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//////////////////////////////////////////////////////////////////////////////////////
var ts;
(function (ts) {
    let checker;
    let sourceFiles;
    let rootFileNames;
    let dependencyMap;
    let pathWeightMap;
    let visitedBlocks;
    let calledMethods = [];
    function createMap() {
        const map = Object.create(null);
        // Using 'delete' on an object causes V8 to put the object in dictionary mode.
        // This disables creation of hidden classes, which are expensive when an object is
        // constantly changing shape.
        map["__"] = undefined;
        delete map["__"];
        return map;
    }
    function reorderSourceFiles(program) {
        sourceFiles = program.getSourceFiles();
        rootFileNames = program.getRootFileNames();
        checker = program.getTypeChecker();
        visitedBlocks = [];
        buildDependencyMap();
        let result = sortOnDependency();
        sourceFiles = [];
        rootFileNames = [];
        checker = null;
        dependencyMap = null;
        visitedBlocks = [];
        return result;
    }
    ts.reorderSourceFiles = reorderSourceFiles;
    function addDependency(file, dependent) {
        if (file == dependent) {
            return;
        }
        let list = dependencyMap[file];
        if (!list) {
            list = dependencyMap[file] = [];
        }
        if (list.indexOf(dependent) == -1) {
            list.push(dependent);
        }
    }
    function buildDependencyMap() {
        dependencyMap = createMap();
        for (let i = 0; i < sourceFiles.length; i++) {
            let sourceFile = sourceFiles[i];
            if (sourceFile.isDeclarationFile) {
                continue;
            }
            visitFile(sourceFile);
        }
    }
    function visitFile(sourceFile) {
        let statements = sourceFile.statements;
        let length = statements.length;
        for (let i = 0; i < length; i++) {
            let statement = statements[i];
            if (ts.hasModifier(statement, ts.ModifierFlags.Ambient)) { // has the 'declare' keyword
                continue;
            }
            visitStatement(statements[i]);
        }
    }
    function visitStatement(statement) {
        if (!statement) {
            return;
        }
        switch (statement.kind) {
            case ts.SyntaxKind.ExpressionStatement:
                let expression = statement;
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.ClassDeclaration:
                checkInheriting(statement);
                visitStaticMember(statement);
                if (statement.transformFlags & ts.TransformFlags.ContainsDecorators) {
                    visitClassDecorators(statement);
                }
                break;
            case ts.SyntaxKind.VariableStatement:
                visitVariableList(statement.declarationList);
                break;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                let importDeclaration = statement;
                checkDependencyAtLocation(importDeclaration.moduleReference);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                visitModule(statement);
                break;
            case ts.SyntaxKind.Block:
                visitBlock(statement);
                break;
            case ts.SyntaxKind.IfStatement:
                const ifStatement = statement;
                visitExpression(ifStatement.expression);
                visitStatement(ifStatement.thenStatement);
                visitStatement(ifStatement.elseStatement);
                break;
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.WithStatement:
                const doStatement = statement;
                visitExpression(doStatement.expression);
                visitStatement(doStatement.statement);
                break;
            case ts.SyntaxKind.ForStatement:
                const forStatement = statement;
                visitExpression(forStatement.condition);
                visitExpression(forStatement.incrementor);
                if (forStatement.initializer) {
                    if (forStatement.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                        visitVariableList(forStatement.initializer);
                    }
                    else {
                        visitExpression(forStatement.initializer);
                    }
                }
                break;
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
                const forInStatement = statement;
                visitExpression(forInStatement.expression);
                if (forInStatement.initializer) {
                    if (forInStatement.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                        visitVariableList(forInStatement.initializer);
                    }
                    else {
                        visitExpression(forInStatement.initializer);
                    }
                }
                break;
            case ts.SyntaxKind.ReturnStatement:
                visitExpression(statement.expression);
                break;
            case ts.SyntaxKind.SwitchStatement:
                const switchStatment = statement;
                visitExpression(switchStatment.expression);
                switchStatment.caseBlock.clauses.forEach(element => {
                    if (element.kind === ts.SyntaxKind.CaseClause) {
                        visitExpression(element.expression);
                    }
                    element.statements.forEach(element => {
                        visitStatement(element);
                    });
                });
                break;
            case ts.SyntaxKind.LabeledStatement:
                visitStatement(statement.statement);
                break;
            case ts.SyntaxKind.ThrowStatement:
                visitExpression(statement.expression);
                break;
            case ts.SyntaxKind.TryStatement:
                const tryStatement = statement;
                visitBlock(tryStatement.tryBlock);
                visitBlock(tryStatement.finallyBlock);
                if (tryStatement.catchClause) {
                    visitBlock(tryStatement.catchClause.block);
                }
                break;
        }
    }
    function visitModule(node) {
        if (node.body.kind === ts.SyntaxKind.ModuleDeclaration) {
            visitModule(node.body);
            return;
        }
        if (node.body.kind === ts.SyntaxKind.ModuleBlock) {
            for (let statement of node.body.statements) {
                if (ts.hasModifier(statement, ts.ModifierFlags.Ambient)) { // has the 'declare' keyword
                    continue;
                }
                visitStatement(statement);
            }
        }
    }
    function checkDependencyAtLocation(node) {
        let symbol = checker.getSymbolAtLocation(node);
        if (!symbol || !symbol.declarations) {
            return;
        }
        let sourceFile = getSourceFileOfNode(symbol.declarations[0]);
        if (!sourceFile || sourceFile.isDeclarationFile) {
            return;
        }
        addDependency(getSourceFileOfNode(node).fileName, sourceFile.fileName);
    }
    function checkInheriting(node) {
        if (!node.heritageClauses) {
            return;
        }
        let heritageClause = null;
        for (const clause of node.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                heritageClause = clause;
                break;
            }
        }
        if (!heritageClause) {
            return;
        }
        let superClasses = heritageClause.types;
        if (!superClasses) {
            return;
        }
        superClasses.forEach(superClass => {
            checkDependencyAtLocation(superClass.expression);
        });
    }
    function visitStaticMember(node) {
        let members = node.members;
        if (!members) {
            return;
        }
        for (let member of members) {
            if (!ts.hasModifier(member, ts.ModifierFlags.Static)) {
                continue;
            }
            if (member.kind == ts.SyntaxKind.PropertyDeclaration) {
                let property = member;
                visitExpression(property.initializer);
            }
        }
    }
    function visitClassDecorators(node) {
        if (node.decorators) {
            visitDecorators(node.decorators);
        }
        let members = node.members;
        if (!members) {
            return;
        }
        for (let member of members) {
            let decorators;
            let functionLikeMember;
            if (member.kind === ts.SyntaxKind.GetAccessor || member.kind === ts.SyntaxKind.SetAccessor) {
                const accessors = ts.getAllAccessorDeclarations(node.members, member);
                if (member !== accessors.firstAccessor) {
                    continue;
                }
                decorators = accessors.firstAccessor.decorators;
                if (!decorators && accessors.secondAccessor) {
                    decorators = accessors.secondAccessor.decorators;
                }
                functionLikeMember = accessors.setAccessor;
            }
            else {
                decorators = member.decorators;
                if (member.kind === ts.SyntaxKind.MethodDeclaration) {
                    functionLikeMember = member;
                }
            }
            if (decorators) {
                visitDecorators(decorators);
            }
            if (functionLikeMember) {
                for (const parameter of functionLikeMember.parameters) {
                    if (parameter.decorators) {
                        visitDecorators(parameter.decorators);
                    }
                }
            }
        }
    }
    function visitDecorators(decorators) {
        for (let decorator of decorators) {
            visitCallExpression(decorator.expression);
        }
    }
    function visitExpression(expression) {
        if (!expression) {
            return;
        }
        switch (expression.kind) {
            case ts.SyntaxKind.NewExpression:
            case ts.SyntaxKind.CallExpression:
                visitCallArguments(expression);
                visitCallExpression(expression.expression);
                break;
            case ts.SyntaxKind.Identifier:
                checkDependencyAtLocation(expression);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
                checkDependencyAtLocation(expression);
                break;
            case ts.SyntaxKind.ElementAccessExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                visitObjectLiteralExpression(expression);
                break;
            case ts.SyntaxKind.ArrayLiteralExpression:
                let arrayLiteral = expression;
                arrayLiteral.elements.forEach(visitExpression);
                break;
            case ts.SyntaxKind.TemplateExpression:
                let template = expression;
                template.templateSpans.forEach(span => {
                    visitExpression(span.expression);
                });
                break;
            case ts.SyntaxKind.ParenthesizedExpression:
                let parenthesized = expression;
                visitExpression(parenthesized.expression);
                break;
            case ts.SyntaxKind.BinaryExpression:
                visitBinaryExpression(expression);
                break;
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
                visitExpression(expression.operand);
                break;
            case ts.SyntaxKind.DeleteExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.TaggedTemplateExpression:
                visitExpression(expression.tag);
                visitExpression(expression.template);
                break;
            case ts.SyntaxKind.ConditionalExpression:
                visitExpression(expression.condition);
                visitExpression(expression.whenTrue);
                visitExpression(expression.whenFalse);
                break;
            case ts.SyntaxKind.SpreadElement:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.VoidExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.YieldExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.AwaitExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.TypeOfExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.NonNullExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.TypeAssertionExpression:
                visitExpression(expression.expression);
                break;
        }
        // FunctionExpression
        // ArrowFunction
        // ClassExpression
        // OmittedExpression
        // ExpressionWithTypeArguments
        // AsExpression
    }
    function visitBinaryExpression(binary) {
        let left = binary.left;
        let right = binary.right;
        visitExpression(left);
        visitExpression(right);
        if (binary.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            (left.kind === ts.SyntaxKind.Identifier || left.kind === ts.SyntaxKind.PropertyAccessExpression) &&
            (right.kind === ts.SyntaxKind.Identifier || right.kind === ts.SyntaxKind.PropertyAccessExpression)) {
            let symbol = checker.getSymbolAtLocation(left);
            if (!symbol || !symbol.declarations) {
                return;
            }
            for (let declaration of symbol.declarations) {
                if (declaration.kind === ts.SyntaxKind.VariableDeclaration || declaration.kind === ts.SyntaxKind.PropertyDeclaration) {
                    let variable = declaration;
                    if (variable.initializer) {
                        continue;
                    }
                    if (!variable.delayInitializerList) {
                        variable.delayInitializerList = [];
                    }
                    variable.delayInitializerList.push(right);
                    if (variable.callerList) {
                        for (let callerFileName of variable.callerList) {
                            checkCallTarget(callerFileName, right);
                        }
                    }
                }
            }
        }
    }
    function visitObjectLiteralExpression(objectLiteral) {
        objectLiteral.properties.forEach(element => {
            switch (element.kind) {
                case ts.SyntaxKind.PropertyAssignment:
                    visitExpression(element.initializer);
                    break;
                case ts.SyntaxKind.ShorthandPropertyAssignment:
                    visitExpression(element.objectAssignmentInitializer);
                    break;
                case ts.SyntaxKind.SpreadAssignment:
                    visitExpression(element.expression);
                    break;
            }
        });
    }
    function visitCallArguments(callExpression) {
        if (callExpression.arguments) {
            callExpression.arguments.forEach(argument => {
                visitExpression(argument);
            });
        }
    }
    function visitCallExpression(expression) {
        expression = escapeParenthesized(expression);
        visitExpression(expression);
        switch (expression.kind) {
            case ts.SyntaxKind.FunctionExpression:
                let functionExpression = expression;
                visitBlock(functionExpression.body);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.Identifier:
                let callerFileName = getSourceFileOfNode(expression).fileName;
                checkCallTarget(callerFileName, expression);
                break;
            case ts.SyntaxKind.CallExpression:
                visitReturnedFunction(expression.expression);
                break;
        }
    }
    function visitReturnedFunction(expression) {
        expression = escapeParenthesized(expression);
        let returnExpressions = [];
        if (expression.kind === ts.SyntaxKind.CallExpression) {
            let expressions = visitReturnedFunction(expression.expression);
            for (let returnExpression of expressions) {
                let returns = visitReturnedFunction(returnExpression);
                returnExpressions = returnExpressions.concat(returns);
            }
            return returnExpressions;
        }
        let functionBlocks = [];
        switch (expression.kind) {
            case ts.SyntaxKind.FunctionExpression:
                functionBlocks.push(expression.body);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.Identifier:
                let callerFileName = getSourceFileOfNode(expression).fileName;
                let declarations = [];
                getForwardDeclarations(expression, declarations, callerFileName);
                for (let declaration of declarations) {
                    let sourceFile = getSourceFileOfNode(declaration);
                    if (!sourceFile || sourceFile.isDeclarationFile) {
                        continue;
                    }
                    if (declaration.kind === ts.SyntaxKind.FunctionDeclaration ||
                        declaration.kind === ts.SyntaxKind.MethodDeclaration) {
                        functionBlocks.push(declaration.body);
                    }
                }
                break;
        }
        for (let block of functionBlocks) {
            for (let statement of block.statements) {
                if (statement.kind === ts.SyntaxKind.ReturnStatement) {
                    let returnExpression = statement.expression;
                    returnExpressions.push(returnExpression);
                    visitCallExpression(returnExpression);
                }
            }
        }
        return returnExpressions;
    }
    function escapeParenthesized(expression) {
        if (expression.kind === ts.SyntaxKind.ParenthesizedExpression) {
            return escapeParenthesized(expression.expression);
        }
        return expression;
    }
    function checkCallTarget(callerFileName, target) {
        let declarations = [];
        getForwardDeclarations(target, declarations, callerFileName);
        for (let declaration of declarations) {
            let sourceFile = getSourceFileOfNode(declaration);
            if (!sourceFile || sourceFile.isDeclarationFile) {
                continue;
            }
            addDependency(callerFileName, sourceFile.fileName);
            if (declaration.kind === ts.SyntaxKind.FunctionDeclaration) {
                visitBlock(declaration.body);
            }
            else if (declaration.kind === ts.SyntaxKind.MethodDeclaration) {
                visitBlock(declaration.body);
                calledMethods.push(declaration);
            }
            else if (declaration.kind === ts.SyntaxKind.ClassDeclaration) {
                checkClassInstantiation(declaration);
            }
        }
    }
    function getForwardDeclarations(reference, declarations, callerFileName) {
        let symbol = checker.getSymbolAtLocation(reference);
        if (!symbol || !symbol.declarations) {
            return;
        }
        for (let declaration of symbol.declarations) {
            switch (declaration.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                    if (declarations.indexOf(declaration) == -1) {
                        declarations.push(declaration);
                    }
                    break;
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    getForwardDeclarations(declaration.moduleReference, declarations, callerFileName);
                    break;
                case ts.SyntaxKind.VariableDeclaration:
                case ts.SyntaxKind.PropertyDeclaration:
                    const variable = declaration;
                    const initializer = variable.initializer;
                    if (initializer) {
                        if (initializer.kind === ts.SyntaxKind.Identifier || initializer.kind === ts.SyntaxKind.PropertyAccessExpression) {
                            getForwardDeclarations(initializer, declarations, callerFileName);
                        }
                    }
                    else {
                        if (variable.delayInitializerList) {
                            for (let expression of variable.delayInitializerList) {
                                getForwardDeclarations(expression, declarations, callerFileName);
                            }
                        }
                        if (variable.callerList) {
                            if (variable.callerList.indexOf(callerFileName) == -1) {
                                variable.callerList.push(callerFileName);
                            }
                        }
                        else {
                            variable.callerList = [callerFileName];
                        }
                    }
                    break;
            }
        }
    }
    function checkClassInstantiation(node) {
        let methodNames = [];
        let superClass = ts.getClassExtendsHeritageElement(node);
        if (superClass) {
            let type = checker.getTypeAtLocation(superClass);
            if (type && type.symbol) {
                let declaration = ts.getDeclarationOfKind(type.symbol, ts.SyntaxKind.ClassDeclaration);
                if (declaration) {
                    methodNames = checkClassInstantiation(declaration);
                }
            }
        }
        let members = node.members;
        if (!members) {
            return [];
        }
        let index = calledMethods.length;
        for (let member of members) {
            if (ts.hasModifier(member, ts.ModifierFlags.Static)) {
                continue;
            }
            if (member.kind === ts.SyntaxKind.MethodDeclaration) { // called by super class.
                let methodName = ts.unescapeLeadingUnderscores(ts.getTextOfPropertyName(member.name));
                if (methodNames.indexOf(methodName) != -1) {
                    visitBlock(member.body);
                }
            }
            if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                let property = member;
                visitExpression(property.initializer);
            }
            else if (member.kind === ts.SyntaxKind.Constructor) {
                let constructor = member;
                visitBlock(constructor.body);
            }
        }
        for (let i = index; i < calledMethods.length; i++) {
            let method = calledMethods[i];
            for (let memeber of members) {
                if (memeber === method) {
                    let methodName = ts.unescapeLeadingUnderscores(ts.getTextOfPropertyName(method.name));
                    methodNames.push(methodName);
                }
            }
        }
        if (index == 0) {
            calledMethods.length = 0;
        }
        return methodNames;
    }
    function visitBlock(block) {
        if (!block || visitedBlocks.indexOf(block) != -1) {
            return;
        }
        visitedBlocks.push(block);
        for (let statement of block.statements) {
            visitStatement(statement);
        }
        visitedBlocks.pop();
    }
    function visitVariableList(variables) {
        if (!variables) {
            return;
        }
        variables.declarations.forEach(declaration => {
            visitExpression(declaration.initializer);
        });
    }
    function sortOnDependency() {
        let result = {};
        result.sortedFileNames = [];
        result.circularReferences = [];
        pathWeightMap = createMap();
        let dtsFiles = [];
        let tsFiles = [];
        for (let sourceFile of sourceFiles) {
            let path = sourceFile.fileName;
            if (sourceFile.isDeclarationFile) {
                pathWeightMap[path] = 10000;
                dtsFiles.push(sourceFile);
                continue;
            }
            let references = updatePathWeight(path, 0, [path]);
            if (references.length > 0) {
                result.circularReferences = references;
                break;
            }
            tsFiles.push(sourceFile);
        }
        if (result.circularReferences.length === 0) {
            tsFiles.sort(function (a, b) {
                return pathWeightMap[b.fileName] - pathWeightMap[a.fileName];
            });
            sourceFiles.length = 0;
            rootFileNames.length = 0;
            dtsFiles.concat(tsFiles).forEach(sourceFile => {
                sourceFiles.push(sourceFile);
                rootFileNames.push(sourceFile.fileName);
                result.sortedFileNames.push(sourceFile.fileName);
            });
        }
        pathWeightMap = null;
        return result;
    }
    function updatePathWeight(path, weight, references) {
        if (pathWeightMap[path] === undefined) {
            pathWeightMap[path] = weight;
        }
        else {
            if (pathWeightMap[path] < weight) {
                pathWeightMap[path] = weight;
            }
            else {
                return [];
            }
        }
        let list = dependencyMap[path];
        if (!list) {
            return [];
        }
        for (let parentPath of list) {
            if (references.indexOf(parentPath) != -1) {
                references.push(parentPath);
                return references;
            }
            let result = updatePathWeight(parentPath, weight + 1, references.concat(parentPath));
            if (result.length > 0) {
                return result;
            }
        }
        return [];
    }
    function getSourceFileOfNode(node) {
        while (node && node.kind !== ts.SyntaxKind.SourceFile) {
            node = node.parent;
        }
        return node;
    }
})(ts || (ts = {}));
/// <reference path="../libs/typescriptServices.d.ts" />
var editor;
(function (editor) {
    class ScriptCompiler {
        constructor() {
            feng3d.globalDispatcher.on("script.compile", this.onScriptCompile, this);
            feng3d.globalDispatcher.on("script.gettslibs", this.onGettsLibs, this);
            feng3d.globalDispatcher.on("openScript", this.onOpenScript, this);
            feng3d.globalDispatcher.on("fs.delete", this.onFileChanged, this);
            feng3d.globalDispatcher.on("fs.write", this.onFileChanged, this);
        }
        onOpenScript(e) {
            editor.editorData.openScript = e.data;
            if (editor.nativeAPI) {
                // 使用本地 VSCode 打开
                var path = editor.editorRS.fs.getAbsolutePath(editor.editorData.openScript.assetPath);
                editor.nativeAPI.openWithVSCode(editor.editorRS.fs.projectname, (err) => {
                    if (err)
                        throw err;
                    editor.nativeAPI.openWithVSCode(path, (err) => {
                        if (err)
                            throw err;
                    });
                });
            }
            else {
                if (codeeditoWin)
                    codeeditoWin.close();
                codeeditoWin = window.open(`codeeditor.html`);
                codeeditoWin.onload = () => {
                    feng3d.globalDispatcher.dispatch("codeeditor.openScript", editor.editorData.openScript);
                };
            }
        }
        onGettsLibs(e) {
            this.loadtslibs(e.data.callback);
        }
        /**
         * 加载 tslibs
         *
         * @param callback 完成回调
         */
        loadtslibs(callback) {
            // 加载 ts 配置
            editor.editorRS.fs.readString("tsconfig.json", (err, str) => {
                console.assert(!err);
                this.tsconfig = json.parse(str);
                console.log(this.tsconfig);
                var tslist = editor.editorRS.getAssetsByType(feng3d.ScriptAsset);
                var files = this.tsconfig.files;
                files = files.filter(v => v.indexOf("Assets") != 0);
                files = files.concat(tslist.map(v => v.assetPath));
                //
                editor.editorRS.fs.readStrings(files, (strs) => {
                    var tslibs = files.map((f, i) => {
                        let str = strs[i];
                        if (typeof str == "string")
                            return { path: f, code: str };
                        console.warn(`没有找到文件 ${f}`);
                        return null;
                    }).filter(v => !!v);
                    callback(tslibs);
                });
            });
        }
        onFileChanged(e) {
            if (!e.data)
                return;
            if (e.data.substr(-3) == ".ts") {
                feng3d.ticker.once(2000, this.onScriptCompile, this);
            }
        }
        onScriptCompile(e) {
            this.loadtslibs((tslibs) => {
                this.compile(tslibs, e && e.data && e.data.onComplete);
            });
        }
        getOptions() {
            var targetMap = {
                'es3': ts.ScriptTarget.ES3, 'es5': ts.ScriptTarget.ES5, 'es2015': ts.ScriptTarget.ES2015, 'es2016': ts.ScriptTarget.ES2016, 'es2017': ts.ScriptTarget.ES2017, 'es2018': ts.ScriptTarget.ES2018
            };
            var options = JSON.parse(JSON.stringify(this.tsconfig.compilerOptions));
            if (targetMap[options.target])
                options.target = targetMap[options.target];
            return options;
        }
        compile(tslibs, callback) {
            try {
                var output = this.transpileModule(tslibs);
                output.forEach(v => {
                    editor.editorRS.fs.writeString(v.name, v.text);
                });
                editor.editorAsset.runProjectScript(() => {
                    feng3d.globalDispatcher.dispatch("asset.scriptChanged");
                });
            }
            catch (e) {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
            callback && callback(null);
            feng3d.globalDispatcher.dispatch("message", `编译完成！`);
        }
        transpileModule(tslibs) {
            var options = this.getOptions();
            var tsSourceMap = {};
            var fileNames = [];
            tslibs.forEach(item => {
                fileNames.push(item.path);
                tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
            });
            // Output
            var outputs = [];
            // 排序
            var program = this.createProgram(fileNames, options, tsSourceMap, outputs);
            var result = ts.reorderSourceFiles(program);
            console.log(`ts 排序结果`);
            console.log(result);
            if (result.circularReferences.length > 0) {
                console.warn(`出现循环引用`);
                return;
            }
            this.tsconfig.files = result.sortedFileNames;
            editor.editorRS.fs.writeObject("tsconfig.json", this.tsconfig);
            // 编译
            var program = this.createProgram(result.sortedFileNames, options, tsSourceMap, outputs);
            program.emit();
            return outputs;
        }
        createProgram(fileNames, options, tsSourceMap, outputs) {
            return ts.createProgram(fileNames, options, {
                getSourceFile: function (fileName) {
                    return tsSourceMap[fileName];
                },
                writeFile: function (_name, text) {
                    outputs.push({ name: _name, text: text });
                },
                getDefaultLibFileName: function () { return "lib.d.ts"; },
                useCaseSensitiveFileNames: function () { return false; },
                getCanonicalFileName: function (fileName) { return fileName; },
                getCurrentDirectory: function () { return ""; },
                getNewLine: function () { return "\r\n"; },
                fileExists: function (fileName) {
                    return !!tsSourceMap[fileName];
                },
                readFile: function () { return ""; },
                directoryExists: function () { return true; },
                getDirectories: function () { return []; }
            });
        }
    }
    editor.ScriptCompiler = ScriptCompiler;
    editor.scriptCompiler = new ScriptCompiler();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * editor的版本号
     */
    editor.version = "2018.08.22";
    console.log(`editor version ${editor.version}`);
    /**
     * 编辑器
     */
    class Editor extends eui.UILayer {
        constructor() {
            super();
            // giteeOauth.oauth();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        }
        onAddedToStage() {
            editor.editorui.stage = this.stage;
            //
            editor.modules.message = new editor.Message();
            //
            feng3d.task.series([
                this.initEgret.bind(this),
                editor.editorRS.initproject.bind(editor.editorRS),
                this.init.bind(this),
            ])(() => {
                console.log(`初始化完成。`);
                // 移除无效入口类显示对象
                this.parent && this.parent.removeChild(this);
            });
        }
        /**
         * 初始化 Egret
         *
         * @param callback 完成回调
         */
        initEgret(callback) {
            var mainui = new editor.MainUI(() => {
                //
                var tooltipLayer = new eui.UILayer();
                tooltipLayer.touchEnabled = false;
                this.stage.addChild(tooltipLayer);
                editor.editorui.tooltipLayer = tooltipLayer;
                //
                var popupLayer = new eui.UILayer();
                popupLayer.touchEnabled = false;
                this.stage.addChild(popupLayer);
                editor.editorui.popupLayer = popupLayer;
                //
                var messageLayer = new eui.UILayer();
                messageLayer.touchEnabled = false;
                this.stage.addChild(messageLayer);
                editor.editorui.messageLayer = messageLayer;
                //
                editor.editorcache.projectname = editor.editorcache.projectname || "newproject";
                editor.editorui.stage.removeChild(mainui);
                callback();
            });
            editor.editorui.stage.addChild(mainui);
        }
        init(callback) {
            document.head.getElementsByTagName("title")[0].innerText = "feng3d-editor -- " + editor.editorcache.projectname;
            editor.editorcache.setLastProject(editor.editorcache.projectname);
            editor.editorAsset.initproject(() => {
                editor.editorAsset.runProjectScript(() => {
                    editor.editorAsset.readScene("default.scene.json", (err, scene) => {
                        if (err)
                            editor.editorData.gameScene = feng3d.View.createNewScene();
                        else
                            editor.editorData.gameScene = scene;
                        //
                        this.initMainView();
                        new editor.Editorshortcut();
                        egret.mouseEventEnvironment();
                        callback();
                    });
                });
            });
            window.addEventListener("beforeunload", () => {
                let obj = feng3d.serialization.serialize(editor.editorData.gameScene.gameObject);
                editor.editorRS.fs.writeObject("default.scene.json", obj);
            });
        }
        initMainView() {
            //
            var mainView = new editor.MainView();
            editor.editorui.mainview = mainView;
            this.stage.addChildAt(mainView, 1);
        }
    }
    editor.Editor = Editor;
})(editor || (editor = {}));
//# sourceMappingURL=editor.js.map