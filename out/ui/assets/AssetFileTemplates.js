define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetFileTemplates = /** @class */ (function () {
        function AssetFileTemplates() {
        }
        /**
         *
         * @param scriptName 脚本名称（类名）
         */
        AssetFileTemplates.prototype.getNewScript = function (scriptName) {
            return scriptTemplate.replace("NewScript", scriptName);
        };
        /**
         *
         * @param shadername shader名称
         */
        AssetFileTemplates.prototype.getNewShader = function (shadername) {
            return shaderTemplate.replace(new RegExp("NewShader", "g"), shadername);
        };
        return AssetFileTemplates;
    }());
    exports.AssetFileTemplates = AssetFileTemplates;
    exports.assetFileTemplates = new AssetFileTemplates();
    var scriptTemplate = "\nclass NewScript extends feng3d.Script\n{\n\n    /** \n     * \u6D4B\u8BD5\u5C5E\u6027 \n     */\n    @feng3d.serialize\n    @feng3d.oav()\n    t_attr = new feng3d.Color4();\n\n    /**\n     * \u521D\u59CB\u5316\u65F6\u8C03\u7528\n     */\n    init()\n    {\n\n    }\n\n    /**\n     * \u66F4\u65B0\n     */\n    update()\n    {\n\n    }\n\n    /**\n     * \u9500\u6BC1\u65F6\u8C03\u7528\n     */\n    dispose()\n    {\n\n    }\n}";
    var shaderTemplate = "\nclass NewShaderUniforms\n{\n    /** \n     * \u989C\u8272 \n     */\n    @feng3d.serialize\n    @feng3d.oav()\n    u_color = new feng3d.Color4();\n}\n\nfeng3d.shaderConfig.shaders[\"NewShader\"] = {\n    cls: NewShaderUniforms,\n    vertex: `\n    \n    attribute vec3 a_position;\n    \n    uniform mat4 u_modelMatrix;\n    uniform mat4 u_viewProjection;\n    \n    void main() {\n    \n        vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\n        gl_Position = u_viewProjection * globalPosition;\n    }`,\n    fragment: `\n    \n    precision mediump float;\n    \n    uniform vec4 u_color;\n    \n    void main() {\n        \n        gl_FragColor = u_color;\n    }\n    `,\n};\n\ntype NewShaderMaterial = feng3d.Material & { uniforms: NewShaderUniforms; };\ninterface MaterialFactory\n{\n    create(shader: \"NewShader\", raw?: gPartial<NewShaderMaterial>): NewShaderMaterial;\n}\n\ninterface MaterialRawMap\n{\n    NewShader: gPartial<NewShaderMaterial>;\n}";
});
//# sourceMappingURL=AssetFileTemplates.js.map