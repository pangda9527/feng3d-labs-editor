"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 是否支持本地API
 */
exports.supportNative = !(typeof __dirname == "undefined");
if (exports.supportNative) {
    exports.nativeFS = require(__dirname + "/native/NativeFSBase.js").nativeFS;
    exports.nativeAPI = require(__dirname + "/native/electron_renderer.js");
}
//# sourceMappingURL=NativeRequire.js.map