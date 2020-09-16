var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var feng2d;
(function (feng2d) {
    /**
     * UIRenderMode for the Canvas.
     *
     * Canvas的渲染模式
     */
    let UIRenderMode;
    (function (UIRenderMode) {
        /**
         * Render at the end of the Scene using a 2D Canvas.
         *
         * 在场景的最后使用2D画布渲染。
         */
        UIRenderMode[UIRenderMode["ScreenSpaceOverlay"] = 0] = "ScreenSpaceOverlay";
        /**
         * Render using the Camera configured on the Canvas.
         *
         * 使用在画布上配置的摄像机进行渲染。
         */
        UIRenderMode[UIRenderMode["ScreenSpaceCamera"] = 1] = "ScreenSpaceCamera";
        /**
         * Render using any Camera in the Scene that can render the layer.
         *
         * 使用场景中任何可以渲染图层的相机渲染。
         */
        UIRenderMode[UIRenderMode["WorldSpace"] = 2] = "WorldSpace";
    })(UIRenderMode = feng2d.UIRenderMode || (feng2d.UIRenderMode = {}));
})(feng2d || (feng2d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 2D变换
     *
     * 提供了比Transform更加适用于2D元素的API
     *
     * 通过修改Transform的数值实现
     */
    let Transform2D = class Transform2D extends feng3d.Component {
        /**
         * 创建一个实体，该类为虚类
         */
        constructor() {
            super();
            this._rect = new feng3d.Vector4(0, 0, 100, 100);
            this._position = new feng3d.Vector2();
            this._size = new feng3d.Vector2(1, 1);
            this._layout = new feng3d.Vector4();
            this._anchorMin = new feng3d.Vector2(0.5, 0.5);
            this._anchorMax = new feng3d.Vector2(0.5, 0.5);
            this._pivot = new feng3d.Vector2(0.5, 0.5);
            this._rotation = 0;
            this._scale = new feng3d.Vector2(1, 1);
            feng3d.watcher.watch(this, "transformLayout", this._onTransformLayoutChanged, this);
        }
        get single() { return true; }
        /**
         * 描述了2D对象在未经过变换前的位置与尺寸
         */
        get rect() {
            var transformLayout = this.transformLayout;
            this._rect.init(-transformLayout.pivot.x * transformLayout.size.x, -transformLayout.pivot.y * transformLayout.size.y, transformLayout.size.x, transformLayout.size.y);
            return this._rect;
        }
        /**
         * 位移
         */
        get position() { return this._position; }
        set position(v) { this._position.copy(v); }
        /**
         * 尺寸，宽高。
         */
        get size() { return this._size; }
        set size(v) { this._size.copy(v); }
        /**
         * 与最小最大锚点形成的边框的left、right、top、bottom距离。当 anchorMin.x != anchorMax.x 时对 layout.x layout.y 赋值生效，当 anchorMin.y != anchorMax.y 时对 layout.z layout.w 赋值生效，否则赋值无效，自动被覆盖。
         */
        get layout() { return this._layout; }
        set layout(v) { this._layout.copy(v); }
        /**
         * 最小锚点，父Transform2D中左上角锚定的规范化位置。
         */
        get anchorMin() { return this._anchorMin; }
        set anchorMin(v) { this._anchorMin.copy(v); }
        /**
         * 最大锚点，父Transform2D中左上角锚定的规范化位置。
         */
        get anchorMax() { return this._anchorMax; }
        set anchorMax(v) { this._anchorMax.copy(v); }
        /**
         * The normalized position in this RectTransform that it rotates around.
         */
        get pivot() { return this._pivot; }
        set pivot(v) { this._pivot.copy(v); }
        /**
         * 旋转
         */
        get rotation() { return this._rotation; }
        set rotation(v) { this._rotation = v; }
        /**
         * 缩放
         */
        get scale() { return this._scale; }
        set scale(v) { this._scale.copy(v); }
        init() {
            super.init();
            // 处理依赖组件
            var transformLayout = this.getComponent("TransformLayout");
            if (!transformLayout) {
                transformLayout = this.gameObject.addComponent("TransformLayout");
            }
            this.transformLayout = transformLayout;
            feng3d.watcher.bind(this.transform.rotation, "z", this, "rotation");
            feng3d.watcher.bind(this.transform.scale, "x", this.scale, "x");
            feng3d.watcher.bind(this.transform.scale, "y", this.scale, "y");
            this.on("addComponent", this._onAddComponent, this);
            this.on("removeComponent", this._onRemovedComponent, this);
        }
        _onAddComponent(event) {
            if (event.data.gameobject != this.gameObject)
                return;
            var component = event.data.component;
            if (component instanceof feng3d.TransformLayout) {
                component.hideFlags = component.hideFlags | feng3d.HideFlags.HideInInspector;
                this.transformLayout = component;
            }
        }
        _onRemovedComponent(event) {
            if (event.data.gameobject != this.gameObject)
                return;
            var component = event.data.component;
            if (component instanceof feng3d.TransformLayout) {
                this.transformLayout = null;
            }
        }
        _onTransformLayoutChanged(newValue, oldValue, object, property) {
            var watcher = feng3d.watcher;
            if (oldValue) {
                watcher.unbind(oldValue.position, "x", this.position, "x");
                watcher.unbind(oldValue.position, "y", this.position, "y");
                watcher.unbind(oldValue.anchorMin, "x", this.anchorMin, "x");
                watcher.unbind(oldValue.anchorMin, "y", this.anchorMin, "y");
                watcher.unbind(oldValue.anchorMax, "x", this.anchorMax, "x");
                watcher.unbind(oldValue.anchorMax, "y", this.anchorMax, "y");
                //
                watcher.unbind(oldValue.leftTop, "x", this.layout, "x");
                watcher.unbind(oldValue.rightBottom, "x", this.layout, "y");
                watcher.unbind(oldValue.leftTop, "y", this.layout, "z");
                watcher.unbind(oldValue.rightBottom, "y", this.layout, "w");
                //
                watcher.unbind(oldValue.size, "x", this.size, "x");
                watcher.unbind(oldValue.size, "y", this.size, "y");
                watcher.unbind(oldValue.pivot, "x", this.pivot, "x");
                watcher.unbind(oldValue.pivot, "y", this.pivot, "y");
            }
            var newValue = object[property];
            if (newValue) {
                watcher.bind(newValue.position, "x", this.position, "x");
                watcher.bind(newValue.position, "y", this.position, "y");
                watcher.bind(newValue.anchorMin, "x", this.anchorMin, "x");
                watcher.bind(newValue.anchorMin, "y", this.anchorMin, "y");
                watcher.bind(newValue.anchorMax, "x", this.anchorMax, "x");
                watcher.bind(newValue.anchorMax, "y", this.anchorMax, "y");
                //
                watcher.bind(newValue.leftTop, "x", this.layout, "x");
                watcher.bind(newValue.rightBottom, "x", this.layout, "y");
                watcher.bind(newValue.leftTop, "y", this.layout, "z");
                watcher.bind(newValue.rightBottom, "y", this.layout, "w");
                //
                watcher.bind(newValue.size, "x", this.size, "x");
                watcher.bind(newValue.size, "y", this.size, "y");
                watcher.bind(newValue.pivot, "x", this.pivot, "x");
                watcher.bind(newValue.pivot, "y", this.pivot, "y");
            }
        }
        beforeRender(renderAtomic, scene, camera) {
            renderAtomic.uniforms.u_rect = this.rect;
        }
        /**
         * 将 Ray3 从世界空间转换为局部空间。
         *
         * @param worldRay 世界空间射线。
         * @param localRay 局部空间射线。
         */
        rayWorldToLocal(worldRay, localRay = new feng3d.Ray3()) {
            this.transform.rayWorldToLocal(worldRay, localRay);
            if (this.transform2D) {
                var size = new feng3d.Vector3(this.transform2D.size.x, this.transform2D.size.y, 1);
                var pivot = new feng3d.Vector3(this.transform2D.pivot.x, this.transform2D.pivot.y, 0);
                localRay.origin.divide(size).add(pivot);
                localRay.direction.divide(size).normalize();
            }
            return localRay;
        }
    };
    __decorate([
        feng3d.oav({ tooltip: "当anchorMin.x == anchorMax.x时对position.x赋值生效，当 anchorMin.y == anchorMax.y 时对position.y赋值生效，否则赋值无效，自动被覆盖。", componentParam: { step: 1, stepScale: 1, stepDownup: 1 } }),
        feng3d.serialize
    ], Transform2D.prototype, "position", null);
    __decorate([
        feng3d.oav({ tooltip: "宽度，不会影响到缩放值。当 anchorMin.x == anchorMax.x 时对 size.x 赋值生效，当anchorMin.y == anchorMax.y时对 size.y 赋值生效，否则赋值无效，自动被覆盖。", componentParam: { step: 1, stepScale: 1, stepDownup: 1 } }),
        feng3d.serialize
    ], Transform2D.prototype, "size", null);
    __decorate([
        feng3d.oav({ tooltip: "与最小最大锚点形成的边框的left、right、top、bottom距离。当 anchorMin.x != anchorMax.x 时对 layout.x layout.y 赋值生效，当 anchorMin.y != anchorMax.y 时对 layout.z layout.w 赋值生效，否则赋值无效，自动被覆盖。", componentParam: { step: 1, stepScale: 1, stepDownup: 1 } }),
        feng3d.serialize
    ], Transform2D.prototype, "layout", null);
    __decorate([
        feng3d.oav({ tooltip: "父Transform2D中左上角锚定的规范化位置。", componentParam: { step: 0.01, stepScale: 0.01, stepDownup: 0.01 } }),
        feng3d.serialize
    ], Transform2D.prototype, "anchorMin", null);
    __decorate([
        feng3d.oav({ tooltip: "最大锚点，父Transform2D中左上角锚定的规范化位置。", componentParam: { step: 0.01, stepScale: 0.01, stepDownup: 0.01 } }),
        feng3d.serialize
    ], Transform2D.prototype, "anchorMax", null);
    __decorate([
        feng3d.oav({ tooltip: "中心点" }),
        feng3d.serialize
    ], Transform2D.prototype, "pivot", null);
    __decorate([
        feng3d.oav({ tooltip: "旋转", componentParam: { step: 0.01, stepScale: 30, stepDownup: 50 } })
    ], Transform2D.prototype, "rotation", null);
    __decorate([
        feng3d.oav({ tooltip: "缩放", componentParam: { step: 0.01, stepScale: 1, stepDownup: 1 } })
    ], Transform2D.prototype, "scale", null);
    Transform2D = __decorate([
        feng3d.AddComponentMenu("Layout/Transform2D"),
        feng3d.RegisterComponent()
    ], Transform2D);
    feng2d.Transform2D = Transform2D;
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    Object.defineProperty(feng3d.GameObject.prototype, "transform2D", {
        get: function () { return this.getComponent("Transform2D"); },
    });
    Object.defineProperty(feng3d.Component.prototype, "transform2D", {
        get: function () { return this._gameObject && this._gameObject.transform2D; },
    });
})(feng3d || (feng3d = {}));
var feng2d;
(function (feng2d) {
    /**
     * UI几何体
     */
    class UIGeometry extends feng3d.Geometry {
        constructor() {
            super();
            this.positions = [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0];
            this.uvs = [0, 0, 1, 0, 1, 1, 0, 1];
            this.indices = [0, 1, 2, 0, 2, 3];
            this.normals = feng3d.geometryUtils.createVertexNormals(this.indices, this.positions, true);
            this.tangents = feng3d.geometryUtils.createVertexTangents(this.indices, this.positions, this.uvs, true);
        }
    }
    feng2d.UIGeometry = UIGeometry;
    feng3d.Geometry.setDefault("Default-UIGeometry", new UIGeometry());
})(feng2d || (feng2d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 可在画布上渲染组件，使得拥有该组件的GameObject可以在画布上渲染。
     */
    let CanvasRenderer = class CanvasRenderer extends feng3d.Renderable {
        constructor() {
            super(...arguments);
            this.renderAtomic = new feng3d.RenderAtomic();
            this.geometry = feng3d.Geometry.getDefault("Default-UIGeometry");
            this.material = feng3d.Material.getDefault("Default-UIMaterial");
        }
        /**
         * 与世界空间射线相交
         *
         * @param worldRay 世界空间射线
         *
         * @return 相交信息
         */
        worldRayIntersection(worldRay) {
            var canvas = this.getComponentsInParents("Canvas")[0];
            if (canvas)
                worldRay = canvas.mouseRay;
            var localRay = this.transform2D.rayWorldToLocal(worldRay);
            var pickingCollisionVO = this.localRayIntersection(localRay);
            if (pickingCollisionVO)
                pickingCollisionVO.cullFace = feng3d.CullFace.NONE;
            return pickingCollisionVO;
        }
        _updateBounds() {
            var bounding = this.geometry.bounding.clone();
            var transformLayout = this.getComponent("TransformLayout");
            if (transformLayout != null) {
                bounding.scale(transformLayout.size);
            }
            this._selfLocalBounds = bounding;
        }
        /**
         * 渲染
         */
        static draw(view) {
            var gl = view.gl;
            var scene = view.scene;
            var canvasList = scene.getComponentsInChildren("Canvas").filter(v => v.isVisibleAndEnabled);
            canvasList.forEach(canvas => {
                canvas.layout(gl.canvas.width, gl.canvas.height);
                // 更新鼠标射线
                canvas.calcMouseRay3D(view);
                var renderables = canvas.getComponentsInChildren("CanvasRenderer").filter(v => v.isVisibleAndEnabled);
                renderables.forEach(renderable => {
                    //绘制
                    var renderAtomic = renderable.renderAtomic;
                    renderAtomic.uniforms.u_viewProjection = canvas.projection;
                    renderable.beforeRender(renderAtomic, null, null);
                    gl.render(renderAtomic);
                });
            });
        }
    };
    __decorate([
        feng3d.oav()
    ], CanvasRenderer.prototype, "material", void 0);
    CanvasRenderer = __decorate([
        feng3d.AddComponentMenu("Rendering/CanvasRenderer"),
        feng3d.RegisterComponent()
    ], CanvasRenderer);
    feng2d.CanvasRenderer = CanvasRenderer;
})(feng2d || (feng2d = {}));
var feng2d;
(function (feng2d) {
    /**
     * Element that can be used for screen rendering.
     *
     * 能够被用于屏幕渲染的元素
     */
    let Canvas = class Canvas extends feng3d.Behaviour {
        constructor() {
            super(...arguments);
            /**
             * Is the Canvas in World or Overlay mode?
             *
             * 画布是在世界或覆盖模式?
             */
            this.renderMode = feng2d.UIRenderMode.ScreenSpaceOverlay;
            /**
             * 获取鼠标射线（与鼠标重叠的摄像机射线）
             */
            this.mouseRay = new feng3d.Ray3(new feng3d.Vector3(), new feng3d.Vector3(0, 0, 1));
            /**
             * 投影矩阵
             *
             * 渲染前自动更新
             */
            this.projection = new feng3d.Matrix4x4();
            /**
             * 最近距离
             */
            this.near = -1000;
            /**
             * 最远距离
             */
            this.far = 10000;
        }
        init() {
            // this.transform.hideFlags = this.transform.hideFlags | HideFlags.Hide;
            // this.gameObject.hideFlags = this.gameObject.hideFlags | HideFlags.DontTransform;
        }
        /**
         * 更新布局
         *
         * @param width 画布宽度
         * @param height 画布高度
         */
        layout(width, height) {
            this.transform2D.size.x = width;
            this.transform2D.size.y = height;
            this.transform2D.pivot.init(0, 0);
            this.transform.x = 0;
            this.transform.y = 0;
            this.transform.z = 0;
            this.transform.rx = 0;
            this.transform.ry = 0;
            this.transform.rz = 0;
            this.transform.sx = 1;
            this.transform.sy = 1;
            this.transform.sz = 1;
            var near = this.near;
            var far = this.far;
            this.projection.identity().appendTranslation(0, 0, -(far + near) / 2).appendScale(2 / width, -2 / height, 2 / (far - near)).appendTranslation(-1, 1, 0);
        }
        /**
         * 计算鼠标射线
         *
         * @param view
         */
        calcMouseRay3D(view) {
            this.mouseRay.origin.set(view.mousePos.x, view.mousePos.y, 0);
        }
    };
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], Canvas.prototype, "near", void 0);
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], Canvas.prototype, "far", void 0);
    Canvas = __decorate([
        feng3d.RegisterComponent()
    ], Canvas);
    feng2d.Canvas = Canvas;
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    feng3d.GameObject.registerPrimitive("Canvas", (g) => {
        g.addComponent("Transform2D");
        g.addComponent("Canvas");
    });
})(feng3d || (feng3d = {}));
var feng2d;
(function (feng2d) {
    class UIUniforms {
        constructor() {
            /**
             * UI几何体尺寸，在shader中进行对几何体缩放。
             */
            this.u_rect = new feng3d.Vector4(0, 0, 100, 100);
            /**
             * 颜色
             */
            this.u_color = new feng3d.Color4();
            /**
             * 纹理数据
             */
            this.s_texture = feng3d.Texture2D.default;
            /**
             * 控制图片的显示区域。
             */
            this.u_uvRect = new feng3d.Vector4(0, 0, 1, 1);
        }
    }
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], UIUniforms.prototype, "u_color", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], UIUniforms.prototype, "s_texture", void 0);
    feng2d.UIUniforms = UIUniforms;
    feng3d.shaderConfig.shaders["ui"] = {
        vertex: `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    
    uniform vec4 u_uvRect;
    uniform vec4 u_rect;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewProjection;
    
    varying vec2 v_uv;
    varying vec2 v_position;

    void main() 
    {
        vec2 position = u_rect.xy + a_position * u_rect.zw;
        gl_Position = u_viewProjection * u_modelMatrix * vec4(position, 0.0, 1.0);
        v_uv = u_uvRect.xy + a_uv * u_uvRect.zw;
        v_position = position.xy;
    }
    `,
        fragment: `
    precision mediump float;

    uniform sampler2D s_texture;
    varying vec2 v_uv;
    varying vec2 v_position;
    
    uniform vec4 u_color;
    
    void main() 
    {
        vec4 color = texture2D(s_texture, v_uv);
        gl_FragColor = color * u_color;
    }
    
    `,
        cls: UIUniforms,
        renderParams: { enableBlend: true, depthtest: false },
    };
    feng3d.Material.setDefault("Default-UIMaterial", { shaderName: "ui" });
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    feng3d.classUtils.addClassNameSpace("feng2d");
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    feng3d.functionwrap.extendFunction(feng3d.View.prototype, "render", function (r, interval) {
        feng2d.CanvasRenderer.draw(this);
    });
})(feng3d || (feng3d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 矩形纯色组件
     *
     * 用于填充UI中背景等颜色。
     */
    let Rect = class Rect extends feng3d.Component {
        constructor() {
            super(...arguments);
            /**
             * 填充颜色。
             */
            this.color = new feng3d.Color4();
        }
        beforeRender(renderAtomic, scene, camera) {
            super.beforeRender(renderAtomic, scene, camera);
            renderAtomic.uniforms.u_color = this.color;
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], Rect.prototype, "color", void 0);
    Rect = __decorate([
        feng3d.AddComponentMenu("UI/Rect"),
        feng3d.RegisterComponent()
    ], Rect);
    feng2d.Rect = Rect;
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    feng3d.GameObject.registerPrimitive("Rect", (g) => {
        var transform2D = g.addComponent("Transform2D");
        g.addComponent("CanvasRenderer");
        transform2D.size.x = 100;
        transform2D.size.y = 100;
        g.addComponent("Rect");
    });
})(feng3d || (feng3d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 图片组件
     *
     * 用于显示图片
     */
    let Image = class Image extends feng3d.Component {
        constructor() {
            super(...arguments);
            /**
             * The source texture of the Image element.
             *
             * 图像元素的源纹理。
             */
            this.image = feng3d.Texture2D.default;
            /**
             * Tinting color for this Image.
             *
             * 为该图像着色。
             */
            this.color = new feng3d.Color4();
        }
        /**
         * 使图片显示实际尺寸
         */
        setNativeSize() {
            var imagesize = this.image.getSize();
            this.transform2D.size.x = imagesize.x;
            this.transform2D.size.y = imagesize.y;
        }
        beforeRender(renderAtomic, scene, camera) {
            super.beforeRender(renderAtomic, scene, camera);
            renderAtomic.uniforms.s_texture = this.image;
            renderAtomic.uniforms.u_color = this.color;
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], Image.prototype, "image", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], Image.prototype, "color", void 0);
    __decorate([
        feng3d.oav({ tooltip: "使图片显示实际尺寸", componentParam: { label: "ReSize" } })
    ], Image.prototype, "setNativeSize", null);
    Image = __decorate([
        feng3d.AddComponentMenu("UI/Image"),
        feng3d.RegisterComponent()
    ], Image);
    feng2d.Image = Image;
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    feng3d.GameObject.registerPrimitive("Image", (g) => {
        var transform2D = g.addComponent("Transform2D");
        g.addComponent("CanvasRenderer");
        transform2D.size.x = 100;
        transform2D.size.y = 100;
        g.addComponent("Image");
    });
})(feng3d || (feng3d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 按钮状态
     */
    let ButtonState;
    (function (ButtonState) {
        /**
         * 弹起状态，默认状态。
         */
        ButtonState["up"] = "up";
        /**
         * 鼠标在按钮上状态。
         */
        ButtonState["over"] = "over";
        /**
         * 鼠标按下状态。
         */
        ButtonState["down"] = "down";
        /**
         * 选中时弹起状态。
         */
        ButtonState["selected_up"] = "selected_up";
        /**
         * 选中时鼠标在按钮上状态。
         */
        ButtonState["selected_over"] = "selected_over";
        /**
         * 选中时鼠标按下状态。
         */
        ButtonState["selected_down"] = "selected_down";
        /**
         * 禁用状态。
         */
        ButtonState["disabled"] = "disabled";
    })(ButtonState = feng2d.ButtonState || (feng2d.ButtonState = {}));
    /**
     * 按钮
     */
    let Button = class Button extends feng3d.Behaviour {
        constructor() {
            super(...arguments);
            /**
             * 按钮所处状态。
             */
            this.state = ButtonState.up;
            /**
             * 所有状态数据，每一个状态数据中记录了子对象的当前数据。
             */
            this.allStateData = {};
            this._stateInvalid = true;
        }
        /**
         * 保存当前状态，例如在编辑器中编辑完按钮某一状态后调用该方法进行保存当前状态数据。
         */
        saveState() {
            var stateData = {};
            // 出现相同名称时，只保存第一个数据
            var childMap = {};
            this.gameObject.children.forEach(child => {
                if (childMap[child.name])
                    return;
                childMap[child.name] = child;
            });
            for (const childname in childMap) {
                var jsonObj = feng3d.serialization.serialize(childMap[childname]);
                feng3d.serialization.deleteCLASS_KEY(jsonObj);
                stateData[childname] = jsonObj;
            }
            this.allStateData[this.state] = stateData;
        }
        _onStateChanged() {
            this._stateInvalid = true;
        }
        /**
         * 每帧执行
         */
        update(interval) {
            if (this._stateInvalid) {
                this._updateState();
                this._stateInvalid = false;
            }
        }
        /**
         * 更新状态
         */
        _updateState() {
            var statedata = this.allStateData[this.state];
            if (!statedata)
                return;
            var childMap = {};
            this.gameObject.children.forEach(child => {
                if (childMap[child.name])
                    return;
                childMap[child.name] = child;
            });
            for (const childname in childMap) {
                childMap[childname] = feng3d.serialization.setValue(childMap[childname], statedata[childname]);
            }
        }
    };
    __decorate([
        feng3d.oav({ block: "Layout", tooltip: "按钮所处状态。", component: "OAVEnum", componentParam: { enumClass: ButtonState } }),
        feng3d.watch("_onStateChanged")
    ], Button.prototype, "state", void 0);
    __decorate([
        feng3d.serialize
    ], Button.prototype, "allStateData", void 0);
    __decorate([
        feng3d.oav()
    ], Button.prototype, "saveState", null);
    Button = __decorate([
        feng3d.AddComponentMenu("UI/Button"),
        feng3d.RegisterComponent()
    ], Button);
    feng2d.Button = Button;
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    feng3d.GameObject.registerPrimitive("Button", (g) => {
        var transform2D = g.addComponent("Transform2D");
        transform2D.size.x = 160;
        transform2D.size.y = 30;
        g.addComponent("Button");
    });
})(feng3d || (feng3d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 绘制文本
     *
     * @param canvas 画布
     * @param _text 文本
     * @param style 文本样式
     * @param resolution 分辨率
     */
    function drawText(canvas, _text, style, resolution = 1) {
        canvas = canvas || document.createElement("canvas");
        if (style.fontSize < 1)
            style.fontSize = 1;
        var _font = style.toFontString();
        const context = canvas.getContext('2d');
        const measured = feng2d.TextMetrics.measureText(_text || ' ', style, style.wordWrap, canvas);
        const width = measured.width;
        const height = measured.height;
        const lines = measured.lines;
        const lineHeight = measured.lineHeight;
        const lineWidths = measured.lineWidths;
        const maxLineWidth = measured.maxLineWidth;
        const fontProperties = measured.fontProperties;
        canvas.width = Math.ceil((Math.max(1, width) + (style.padding * 2)) * resolution);
        canvas.height = Math.ceil((Math.max(1, height) + (style.padding * 2)) * resolution);
        context.scale(resolution, resolution);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = _font;
        context.lineWidth = style.strokeThickness;
        context.textBaseline = style.textBaseline;
        context.lineJoin = style.lineJoin;
        context.miterLimit = style.miterLimit;
        let linePositionX;
        let linePositionY;
        // 需要2个通过如果一个阴影;第一个绘制投影，第二个绘制文本
        const passesCount = style.dropShadow ? 2 : 1;
        for (let i = 0; i < passesCount; ++i) {
            const isShadowPass = style.dropShadow && i === 0;
            const dsOffsetText = isShadowPass ? height * 2 : 0; // 我们只想要投影，所以把文本放到屏幕外
            const dsOffsetShadow = dsOffsetText * resolution;
            if (isShadowPass) {
                // 在Safari上，带有渐变和阴影的文本不能正确定位
                // 如果画布的比例不是1: https://bugs.webkit.org/show_bug.cgi?id=197689
                // 因此，我们将样式设置为纯黑色，同时生成这个投影
                context.fillStyle = 'black';
                context.strokeStyle = 'black';
                context.shadowColor = style.dropShadowColor.toRGBA();
                context.shadowBlur = style.dropShadowBlur;
                context.shadowOffsetX = Math.cos(style.dropShadowAngle * Math.DEG2RAD) * style.dropShadowDistance;
                context.shadowOffsetY = (Math.sin(style.dropShadowAngle * Math.DEG2RAD) * style.dropShadowDistance) + dsOffsetShadow;
            }
            else {
                // 设置画布文本样式
                context.fillStyle = _generateFillStyle(canvas, style, lines, resolution);
                context.strokeStyle = style.stroke.toRGBA();
                context.shadowColor = "";
                context.shadowBlur = 0;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }
            // 一行一行绘制
            for (let i = 0; i < lines.length; i++) {
                linePositionX = style.strokeThickness / 2;
                linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;
                if (style.align === 'right') {
                    linePositionX += maxLineWidth - lineWidths[i];
                }
                else if (style.align === 'center') {
                    linePositionX += (maxLineWidth - lineWidths[i]) / 2;
                }
                if (style.stroke && style.strokeThickness) {
                    drawLetterSpacing(canvas, style, lines[i], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText, true);
                }
                if (style.fill) {
                    drawLetterSpacing(canvas, style, lines[i], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText);
                }
            }
        }
        // 除去透明边缘。
        if (style.trim) {
            const trimmed = trimCanvas(canvas);
            if (trimmed.data) {
                canvas.width = trimmed.width;
                canvas.height = trimmed.height;
                context.putImageData(trimmed.data, 0, 0);
            }
        }
        return canvas;
    }
    feng2d.drawText = drawText;
    /**
     * 生成填充样式。可以自动生成一个基于填充样式为数组的渐变。
     *
     * @param style 文本样式。
     * @param lines 多行文本。
     * @return 填充样式。
     */
    function _generateFillStyle(canvas, style, lines, resolution = 1) {
        const context = canvas.getContext('2d');
        var stylefill = style.fill;
        if (!Array.isArray(stylefill)) {
            return stylefill.toRGBA();
        }
        else if (stylefill.length === 1) {
            return stylefill[0];
        }
        // 画布颜色渐变。
        let gradient;
        let totalIterations;
        let currentIteration;
        let stop;
        const width = Math.ceil(canvas.width / resolution);
        const height = Math.ceil(canvas.height / resolution);
        const fill = stylefill.slice();
        const fillGradientStops = style.fillGradientStops.slice();
        // 初始化渐变关键帧
        if (!fillGradientStops.length) {
            const lengthPlus1 = fill.length + 1;
            for (let i = 1; i < lengthPlus1; ++i) {
                fillGradientStops.push(i / lengthPlus1);
            }
        }
        // 设置渐变起点与终点。
        fill.unshift(stylefill[0]);
        fillGradientStops.unshift(0);
        fill.push(stylefill[stylefill.length - 1]);
        fillGradientStops.push(1);
        if (style.fillGradientType === feng2d.TEXT_GRADIENT.LINEAR_VERTICAL) {
            // 创建纵向渐变
            gradient = context.createLinearGradient(width / 2, 0, width / 2, height);
            // 我们需要重复渐变，这样每一行文本都有相同的垂直渐变效果
            totalIterations = (fill.length + 1) * lines.length;
            currentIteration = 0;
            for (let i = 0; i < lines.length; i++) {
                currentIteration += 1;
                for (let j = 0; j < fill.length; j++) {
                    if (typeof fillGradientStops[j] === 'number') {
                        stop = (fillGradientStops[j] / lines.length) + (i / lines.length);
                    }
                    else {
                        stop = currentIteration / totalIterations;
                    }
                    gradient.addColorStop(stop, fill[j]);
                    currentIteration++;
                }
            }
        }
        else {
            // 从画布的中间左侧开始渐变，并在画布的中间右侧结束
            gradient = context.createLinearGradient(0, height / 2, width, height / 2);
            totalIterations = fill.length + 1;
            currentIteration = 1;
            for (let i = 0; i < fill.length; i++) {
                if (typeof fillGradientStops[i] === 'number') {
                    stop = fillGradientStops[i];
                }
                else {
                    stop = currentIteration / totalIterations;
                }
                gradient.addColorStop(stop, fill[i]);
                currentIteration++;
            }
        }
        return gradient;
    }
    /**
     * Render the text with letter-spacing.
     * 绘制文本。
     *
     * @param text 文本。
     * @param x X轴位置。
     * @param y Y轴位置。
     * @param isStroke
     */
    function drawLetterSpacing(canvas, style, text, x, y, isStroke = false) {
        const context = canvas.getContext('2d');
        const letterSpacing = style.letterSpacing;
        if (letterSpacing === 0) {
            if (isStroke) {
                context.strokeText(text, x, y);
            }
            else {
                context.fillText(text, x, y);
            }
            return;
        }
        let currentPosition = x;
        // 使用 Array.from 可以解决表情符号的分割问题。 如  "🌷","🎁","💩","😜" "👍"
        // https://medium.com/@giltayar/iterating-over-emoji-characters-the-es6-way-f06e4589516
        // https://github.com/orling/grapheme-splitter
        const stringArray = Array.from(text);
        let previousWidth = context.measureText(text).width;
        let currentWidth = 0;
        for (let i = 0; i < stringArray.length; ++i) {
            const currentChar = stringArray[i];
            if (isStroke) {
                context.strokeText(currentChar, currentPosition, y);
            }
            else {
                context.fillText(currentChar, currentPosition, y);
            }
            currentWidth = context.measureText(text.substring(i + 1)).width;
            currentPosition += previousWidth - currentWidth + letterSpacing;
            previousWidth = currentWidth;
        }
    }
    /**
      * 除去边界透明部分
      *
      * @param canvas 画布
      */
    function trimCanvas(canvas) {
        var width = canvas.width;
        var height = canvas.height;
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const len = pixels.length;
        var top = NaN;
        var left = NaN;
        var right = NaN;
        var bottom = NaN;
        var data = null;
        var i;
        var x;
        var y;
        for (i = 0; i < len; i += 4) {
            if (pixels[i + 3] !== 0) {
                x = (i / 4) % width;
                y = ~~((i / 4) / width);
                if (isNaN(top)) {
                    top = y;
                }
                if (isNaN(left)) {
                    left = x;
                }
                else if (x < left) {
                    left = x;
                }
                if (isNaN(right)) {
                    right = x + 1;
                }
                else if (right < x) {
                    right = x + 1;
                }
                if (isNaN(bottom)) {
                    bottom = y;
                }
                else if (bottom < y) {
                    bottom = y;
                }
            }
        }
        if (!isNaN(top)) {
            width = right - left;
            height = bottom - top + 1;
            data = context.getImageData(left, top, width, height);
        }
        return {
            height,
            width,
            data,
        };
    }
})(feng2d || (feng2d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 文本上渐变方向。
     */
    let TEXT_GRADIENT;
    (function (TEXT_GRADIENT) {
        /**
         * 纵向梯度。
         */
        TEXT_GRADIENT[TEXT_GRADIENT["LINEAR_VERTICAL"] = 0] = "LINEAR_VERTICAL";
        /**
         * 横向梯度。
         */
        TEXT_GRADIENT[TEXT_GRADIENT["LINEAR_HORIZONTAL"] = 1] = "LINEAR_HORIZONTAL";
    })(TEXT_GRADIENT = feng2d.TEXT_GRADIENT || (feng2d.TEXT_GRADIENT = {}));
    /**
     * 通用字体。
     */
    let FontFamily;
    (function (FontFamily) {
        FontFamily["Arial"] = "Arial";
        FontFamily["serif"] = "serif";
        FontFamily["sans-serif"] = "sans-serif";
        FontFamily["monospace"] = "monospace";
        FontFamily["cursive"] = "cursive";
        FontFamily["fantasy"] = "fantasy";
        FontFamily["system-ui"] = "system-ui";
        FontFamily["\u5B8B\u4F53"] = "\u5B8B\u4F53";
    })(FontFamily = feng2d.FontFamily || (feng2d.FontFamily = {}));
    /**
     * 字体样式。
     */
    let FontStyle;
    (function (FontStyle) {
        FontStyle["normal"] = "normal";
        FontStyle["italic"] = "italic";
        FontStyle["oblique"] = "oblique";
    })(FontStyle = feng2d.FontStyle || (feng2d.FontStyle = {}));
    /**
     * 字体变体。
     */
    let FontVariant;
    (function (FontVariant) {
        FontVariant["normal"] = "normal";
        FontVariant["small-caps"] = "small-caps";
    })(FontVariant = feng2d.FontVariant || (feng2d.FontVariant = {}));
    let FontWeight;
    (function (FontWeight) {
        FontWeight["normal"] = "normal";
        FontWeight["bold"] = "bold";
        FontWeight["bolder"] = "bolder";
        FontWeight["lighter"] = "lighter";
        // '100' = '100',
        // '200' = '200',
        // '300' = '300',
        // '400' = '400',
        // '500' = '500',
        // '600' = '600',
        // '700' = '700',
        // '800' = '800',
        // '900' = '900',
    })(FontWeight = feng2d.FontWeight || (feng2d.FontWeight = {}));
    /**
     * 设置创建的角的类型，它可以解决带尖刺的文本问题。
     */
    let CanvasLineJoin;
    (function (CanvasLineJoin) {
        CanvasLineJoin["round"] = "round";
        CanvasLineJoin["bevel"] = "bevel";
        CanvasLineJoin["miter"] = "miter";
    })(CanvasLineJoin = feng2d.CanvasLineJoin || (feng2d.CanvasLineJoin = {}));
    /**
     * 画布文本基线
     */
    let CanvasTextBaseline;
    (function (CanvasTextBaseline) {
        CanvasTextBaseline["top"] = "top";
        CanvasTextBaseline["hanging"] = "hanging";
        CanvasTextBaseline["middle"] = "middle";
        CanvasTextBaseline["alphabetic"] = "alphabetic";
        CanvasTextBaseline["ideographic"] = "ideographic";
        CanvasTextBaseline["bottom"] = "bottom";
    })(CanvasTextBaseline = feng2d.CanvasTextBaseline || (feng2d.CanvasTextBaseline = {}));
    /**
     * 文本对齐方式
     */
    let TextAlign;
    (function (TextAlign) {
        TextAlign["left"] = "left";
        TextAlign["center"] = "center";
        TextAlign["right"] = "right";
    })(TextAlign = feng2d.TextAlign || (feng2d.TextAlign = {}));
    let WhiteSpaceHandle;
    (function (WhiteSpaceHandle) {
        WhiteSpaceHandle["normal"] = "normal";
        WhiteSpaceHandle["pre"] = "pre";
        WhiteSpaceHandle["pre-line"] = "pre-line";
    })(WhiteSpaceHandle = feng2d.WhiteSpaceHandle || (feng2d.WhiteSpaceHandle = {}));
    /**
     * 文本样式
     *
     * 从pixi.js移植
     *
     * @see https://github.com/pixijs/pixi.js/blob/dev/packages/text/src/TextStyle.js
     */
    class TextStyle extends feng3d.EventDispatcher {
        /**
         * @param style 样式参数
         */
        constructor(style) {
            super();
            /**
             * 字体。
             */
            this.fontFamily = FontFamily.Arial;
            /**
             * 字体尺寸。
             */
            this.fontSize = 26;
            /**
             * 字体样式。
             */
            this.fontStyle = FontStyle.normal;
            /**
             * 字体变体。
             */
            this.fontVariant = FontVariant.normal;
            /**
             * 字型粗细。
             */
            this.fontWeight = FontWeight.normal;
            /**
             * 用于填充文本的颜色。
             * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
             */
            this.fill = new feng3d.Color4(0, 0, 0, 1);
            // fill = new MinMaxGradient();
            /**
             * 如果填充是一个创建渐变的颜色数组，这可以改变渐变的方向。
             */
            this.fillGradientType = TEXT_GRADIENT.LINEAR_VERTICAL;
            /**
             * 如果填充是一个颜色数组来创建渐变，这个数组可以设置停止点
             */
            this.fillGradientStops = [];
            /**
             * 将用于文本笔划的画布填充样式。
             */
            this.stroke = new feng3d.Color4(0, 0, 0, 1);
            /**
             * 一个表示笔画厚度的数字。
             */
            this.strokeThickness = 0;
            /**
             * lineJoin属性设置创建的角的类型，它可以解决带尖刺的文本问题。
             */
            this.lineJoin = CanvasLineJoin.miter;
            /**
             * 当使用“miter”lineJoin模式时，miter限制使用。这可以减少或增加呈现文本的尖锐性。
             */
            this.miterLimit = 10;
            /**
             * 字母之间的间距，默认为0
             */
            this.letterSpacing = 0;
            /**
             * 呈现文本的基线。
             */
            this.textBaseline = CanvasTextBaseline.alphabetic;
            /**
             * 是否为文本设置一个投影。
             */
            this.dropShadow = false;
            /**
             * 投影颜色。
             */
            this.dropShadowColor = new feng3d.Color4(0, 0, 0, 1);
            /**
             * 投影角度。
             */
            this.dropShadowAngle = 30;
            /**
             * 阴影模糊半径。
             */
            this.dropShadowBlur = 0;
            /**
             * 投影距离。
             */
            this.dropShadowDistance = 5;
            /**
             * 是否应使用自动换行。
             */
            this.wordWrap = false;
            /**
             * 能否把单词分多行。
             */
            this.breakWords = false;
            /**
             * 多行文本对齐方式。
             */
            this.align = TextAlign.left;
            /**
             * 如何处理换行与空格。
             * Default is 'pre' (preserve, preserve).
             *
             *  value       | New lines     |   Spaces
             *  ---         | ---           |   ---
             * 'normal'     | Collapse      |   Collapse
             * 'pre'        | Preserve      |   Preserve
             * 'pre-line'   | Preserve      |   Collapse
             */
            this.whiteSpace = WhiteSpaceHandle.pre;
            /**
             * 文本的换行宽度。
             */
            this.wordWrapWidth = 100;
            /**
             * 行高。
             */
            this.lineHeight = 0;
            /**
             * 行距。
             */
            this.leading = 0;
            /**
             * 内边距，用于文字被裁减问题。
             */
            this.padding = 0;
            /**
             * 是否修剪透明边界。
             */
            this.trim = false;
            feng3d.serialization.setValue(this, style);
        }
        /**
         * 使数据失效
         */
        invalidate() {
            this.dispatch("changed");
        }
        /**
         *
         * 生成用于' TextMetrics.measureFont() '的字体样式字符串。
         */
        toFontString() {
            const fontSizeString = `${this.fontSize}px`;
            // 通过引用每个字体名来清除fontFamily属性
            // 这将支持带有空格的字体名称
            let fontFamilies = this.fontFamily;
            if (!Array.isArray(this.fontFamily)) {
                fontFamilies = this.fontFamily.split(',');
            }
            for (let i = fontFamilies.length - 1; i >= 0; i--) {
                // 修剪任何多余的空白
                let fontFamily = fontFamilies[i].trim();
                // 检查字体是否已经包含字符串
                if (!(/([\"\'])[^\'\"]+\1/).test(fontFamily) && FontFamily[fontFamily] == undefined) {
                    fontFamily = `"${fontFamily}"`;
                }
                fontFamilies[i] = fontFamily;
            }
            return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${fontSizeString} ${fontFamilies.join(',')}`;
        }
    }
    __decorate([
        feng3d.oav({ block: "Font", tooltip: "字体。", component: "OAVEnum", componentParam: { enumClass: FontFamily } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fontFamily", void 0);
    __decorate([
        feng3d.oav({ block: "Font", tooltip: "字体尺寸。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fontSize", void 0);
    __decorate([
        feng3d.oav({ block: "Font", tooltip: "字体样式。", component: "OAVEnum", componentParam: { enumClass: FontStyle } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fontStyle", void 0);
    __decorate([
        feng3d.oav({ block: "Font", tooltip: "字体变体。", component: "OAVEnum", componentParam: { enumClass: FontVariant } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fontVariant", void 0);
    __decorate([
        feng3d.oav({ block: "Font", tooltip: "字型粗细。", component: "OAVEnum", componentParam: { enumClass: FontWeight } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fontWeight", void 0);
    __decorate([
        feng3d.oav({ block: "Fill", tooltip: "用于填充文本的颜色。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fill", void 0);
    __decorate([
        feng3d.oav({ block: "Fill", tooltip: "如果填充是一个创建渐变的颜色数组，这可以改变渐变的方向。", component: "OAVEnum", componentParam: { enumClass: TEXT_GRADIENT } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fillGradientType", void 0);
    __decorate([
        feng3d.oav({ block: "Fill" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "fillGradientStops", void 0);
    __decorate([
        feng3d.oav({ block: "Stroke", tooltip: "将用于文本笔划的画布填充样式。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "stroke", void 0);
    __decorate([
        feng3d.oav({ block: "Stroke", tooltip: "一个表示笔画厚度的数字。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "strokeThickness", void 0);
    __decorate([
        feng3d.oav({ block: "Stroke", tooltip: "lineJoin属性设置创建的角的类型，它可以解决带尖刺的文本问题。", component: "OAVEnum", componentParam: { enumClass: CanvasLineJoin } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "lineJoin", void 0);
    __decorate([
        feng3d.oav({ block: "Stroke", tooltip: "当使用“miter”lineJoin模式时，miter限制使用。这可以减少或增加呈现文本的尖锐性。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "miterLimit", void 0);
    __decorate([
        feng3d.oav({ block: "Layout", tooltip: "字母之间的间距，默认为0" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "letterSpacing", void 0);
    __decorate([
        feng3d.oav({ block: "Layout", tooltip: "呈现文本的基线。", component: "OAVEnum", componentParam: { enumClass: CanvasTextBaseline } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "textBaseline", void 0);
    __decorate([
        feng3d.oav({ block: "Drop Shadow", tooltip: "是否为文本设置一个投影。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "dropShadow", void 0);
    __decorate([
        feng3d.oav({ block: "Drop Shadow", tooltip: "投影颜色。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "dropShadowColor", void 0);
    __decorate([
        feng3d.oav({ block: "Drop Shadow", tooltip: "投影角度。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "dropShadowAngle", void 0);
    __decorate([
        feng3d.oav({ block: "Drop Shadow", tooltip: "阴影模糊半径。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "dropShadowBlur", void 0);
    __decorate([
        feng3d.oav({ block: "Drop Shadow", tooltip: "投影距离。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "dropShadowDistance", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline", tooltip: "是否应使用自动换行。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "wordWrap", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "breakWords", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline", tooltip: "多行文本对齐方式。", component: "OAVEnum", componentParam: { enumClass: TextAlign } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "align", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline", tooltip: "如何处理换行与空格。", component: "OAVEnum", componentParam: { enumClass: WhiteSpaceHandle } }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "whiteSpace", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline", tooltip: "文本的换行宽度。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "wordWrapWidth", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline", tooltip: "行高。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "lineHeight", void 0);
    __decorate([
        feng3d.oav({ block: "Multiline", tooltip: "行距。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "leading", void 0);
    __decorate([
        feng3d.oav({ block: "Texture", tooltip: "内边距，用于文字被裁减问题。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "padding", void 0);
    __decorate([
        feng3d.oav({ block: "Texture", tooltip: "是否修剪透明边界。" }),
        feng3d.watch("invalidate"),
        feng3d.serialize
    ], TextStyle.prototype, "trim", void 0);
    feng2d.TextStyle = TextStyle;
})(feng2d || (feng2d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 文本度量
     *
     * 用于度量指定样式的文本的宽度。
     *
     * 从pixi.js移植
     *
     * @see https://github.com/pixijs/pixi.js/blob/dev/packages/text/src/TextMetrics.js
     */
    class TextMetrics {
        /**
         * @param text - the text that was measured
         * @param style - the style that was measured
         * @param width - the measured width of the text
         * @param height - the measured height of the text
         * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
         * @param lineWidths - an array of the line widths for each line matched to `lines`
         * @param lineHeight - the measured line height for this style
         * @param maxLineWidth - the maximum line width for all measured lines
         * @param fontProperties - the font properties object from TextMetrics.measureFont
         */
        constructor(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
            this.text = text;
            this.style = style;
            this.width = width;
            this.height = height;
            this.lines = lines;
            this.lineWidths = lineWidths;
            this.lineHeight = lineHeight;
            this.maxLineWidth = maxLineWidth;
            this.fontProperties = fontProperties;
        }
        /**
         * Measures the supplied string of text and returns a Rectangle.
         *
         * @param text - the text to measure.
         * @param style - the text style to use for measuring
         * @param wordWrap - optional override for if word-wrap should be applied to the text.
         * @param canvas - optional specification of the canvas to use for measuring.
         * @return measured width and height of the text.
         */
        static measureText(text, style, wordWrap, canvas = TextMetrics._canvas) {
            wordWrap = (wordWrap === undefined || wordWrap === null) ? style.wordWrap : wordWrap;
            const font = style.toFontString();
            const fontProperties = TextMetrics.measureFont(font);
            // fallback in case UA disallow canvas data extraction
            // (toDataURI, getImageData functions)
            if (fontProperties.fontSize === 0) {
                fontProperties.fontSize = style.fontSize;
                fontProperties.ascent = style.fontSize;
            }
            const context = canvas.getContext('2d');
            if (!context) {
                throw `获取 CanvasRenderingContext2D 失败！`;
            }
            context.font = font;
            const outputText = wordWrap ? TextMetrics.wordWrap(text, style, canvas) : text;
            const lines = outputText.split(/(?:\r\n|\r|\n)/);
            const lineWidths = new Array(lines.length);
            let maxLineWidth = 0;
            for (let i = 0; i < lines.length; i++) {
                const lineWidth = context.measureText(lines[i]).width + ((lines[i].length - 1) * style.letterSpacing);
                lineWidths[i] = lineWidth;
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
            }
            let width = maxLineWidth + style.strokeThickness;
            if (style.dropShadow) {
                width += style.dropShadowDistance;
            }
            const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
            let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness)
                + ((lines.length - 1) * (lineHeight + style.leading));
            if (style.dropShadow) {
                height += style.dropShadowDistance;
            }
            return new TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
        }
        /**
         * Applies newlines to a string to have it optimally fit into the horizontal
         * bounds set by the Text object's wordWrapWidth property.
         *
         * @private
         * @param text - String to apply word wrapping to
         * @param style - the style to use when wrapping
         * @param canvas - optional specification of the canvas to use for measuring.
         * @return New string with new lines applied where required
         */
        static wordWrap(text, style, canvas = TextMetrics._canvas) {
            const context = canvas.getContext('2d');
            if (!context) {
                throw `获取 CanvasRenderingContext2D 失败！`;
            }
            let width = 0;
            let line = '';
            let lines = '';
            const cache = {};
            const { letterSpacing, whiteSpace } = style;
            // How to handle whitespaces
            const collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
            const collapseNewlines = TextMetrics.collapseNewlines(whiteSpace);
            // whether or not spaces may be added to the beginning of lines
            let canPrependSpaces = !collapseSpaces;
            // There is letterSpacing after every char except the last one
            // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
            // so for convenience the above needs to be compared to width + 1 extra letterSpace
            // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
            // ________________________________________________
            // And then the final space is simply no appended to each line
            const wordWrapWidth = style.wordWrapWidth + letterSpacing;
            // break text into words, spaces and newline chars
            const tokens = TextMetrics.tokenize(text);
            for (let i = 0; i < tokens.length; i++) {
                // get the word, space or newlineChar
                let token = tokens[i];
                // if word is a new line
                if (TextMetrics.isNewline(token)) {
                    // keep the new line
                    if (!collapseNewlines) {
                        lines += TextMetrics.addLine(line);
                        canPrependSpaces = !collapseSpaces;
                        line = '';
                        width = 0;
                        continue;
                    }
                    // if we should collapse new lines
                    // we simply convert it into a space
                    token = ' ';
                }
                // if we should collapse repeated whitespaces
                if (collapseSpaces) {
                    // check both this and the last tokens for spaces
                    const currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
                    const lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);
                    if (currIsBreakingSpace && lastIsBreakingSpace) {
                        continue;
                    }
                }
                // get word width from cache if possible
                const tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);
                // word is longer than desired bounds
                if (tokenWidth > wordWrapWidth) {
                    // if we are not already at the beginning of a line
                    if (line !== '') {
                        // start newlines for overflow words
                        lines += TextMetrics.addLine(line);
                        line = '';
                        width = 0;
                    }
                    // break large word over multiple lines
                    if (TextMetrics.canBreakWords(token, style.breakWords)) {
                        // break word into characters
                        const characters = TextMetrics.wordWrapSplit(token);
                        // loop the characters
                        for (let j = 0; j < characters.length; j++) {
                            let char = characters[j];
                            let k = 1;
                            // we are not at the end of the token
                            while (characters[j + k]) {
                                const nextChar = characters[j + k];
                                const lastChar = char[char.length - 1];
                                // should not split chars
                                if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                                    // combine chars & move forward one
                                    char += nextChar;
                                }
                                else {
                                    break;
                                }
                                k++;
                            }
                            j += char.length - 1;
                            const characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);
                            if (characterWidth + width > wordWrapWidth) {
                                lines += TextMetrics.addLine(line);
                                canPrependSpaces = false;
                                line = '';
                                width = 0;
                            }
                            line += char;
                            width += characterWidth;
                        }
                    }
                    // run word out of the bounds
                    else {
                        // if there are words in this line already
                        // finish that line and start a new one
                        if (line.length > 0) {
                            lines += TextMetrics.addLine(line);
                            line = '';
                            width = 0;
                        }
                        const isLastToken = i === tokens.length - 1;
                        // give it its own line if it's not the end
                        lines += TextMetrics.addLine(token, !isLastToken);
                        canPrependSpaces = false;
                        line = '';
                        width = 0;
                    }
                }
                // word could fit
                else {
                    // word won't fit because of existing words
                    // start a new line
                    if (tokenWidth + width > wordWrapWidth) {
                        // if its a space we don't want it
                        canPrependSpaces = false;
                        // add a new line
                        lines += TextMetrics.addLine(line);
                        // start a new line
                        line = '';
                        width = 0;
                    }
                    // don't add spaces to the beginning of lines
                    if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
                        // add the word to the current line
                        line += token;
                        // update width counter
                        width += tokenWidth;
                    }
                }
            }
            lines += TextMetrics.addLine(line, false);
            return lines;
        }
        /**
         * Convienience function for logging each line added during the wordWrap
         * method
         *
         * @private
         * @param  line        - The line of text to add
         * @param  newLine     - Add new line character to end
         * @return A formatted line
         */
        static addLine(line, newLine = true) {
            line = TextMetrics.trimRight(line);
            line = (newLine) ? `${line}\n` : line;
            return line;
        }
        /**
         * Gets & sets the widths of calculated characters in a cache object
         *
         * @private
         * @param key            The key
         * @param letterSpacing  The letter spacing
         * @param cache          The cache
         * @param context        The canvas context
         * @return The from cache.
         */
        static getFromCache(key, letterSpacing, cache, context) {
            let width = cache[key];
            if (width === undefined) {
                const spacing = ((key.length) * letterSpacing);
                width = context.measureText(key).width + spacing;
                cache[key] = width;
            }
            return width;
        }
        /**
         * Determines whether we should collapse breaking spaces
         *
         * @private
         * @param whiteSpace  The TextStyle property whiteSpace
         * @return should collapse
         */
        static collapseSpaces(whiteSpace) {
            return (whiteSpace === 'normal' || whiteSpace === 'pre-line');
        }
        /**
         * Determines whether we should collapse newLine chars
         *
         * @private
         * @param whiteSpace  The white space
         * @return should collapse
         */
        static collapseNewlines(whiteSpace) {
            return (whiteSpace === 'normal');
        }
        /**
         * trims breaking whitespaces from string
         *
         * @private
         * @param text  The text
         * @return trimmed string
         */
        static trimRight(text) {
            if (typeof text !== 'string') {
                return '';
            }
            for (let i = text.length - 1; i >= 0; i--) {
                const char = text[i];
                if (!TextMetrics.isBreakingSpace(char)) {
                    break;
                }
                text = text.slice(0, -1);
            }
            return text;
        }
        /**
         * Determines if char is a newline.
         *
         * @private
         * @param char  The character
         * @return True if newline, False otherwise.
         */
        static isNewline(char) {
            if (typeof char !== 'string') {
                return false;
            }
            return (TextMetrics._newlines.indexOf(char.charCodeAt(0)) >= 0);
        }
        /**
         * Determines if char is a breaking whitespace.
         *
         * @private
         * @param char  The character
         * @return True if whitespace, False otherwise.
         */
        static isBreakingSpace(char) {
            if (typeof char !== 'string') {
                return false;
            }
            return (TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0);
        }
        /**
         * Splits a string into words, breaking-spaces and newLine characters
         *
         * @private
         * @param text       The text
         * @return A tokenized array
         */
        static tokenize(text) {
            const tokens = [];
            let token = '';
            if (typeof text !== 'string') {
                return tokens;
            }
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (TextMetrics.isBreakingSpace(char) || TextMetrics.isNewline(char)) {
                    if (token !== '') {
                        tokens.push(token);
                        token = '';
                    }
                    tokens.push(char);
                    continue;
                }
                token += char;
            }
            if (token !== '') {
                tokens.push(token);
            }
            return tokens;
        }
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It allows one to customise which words should break
         * Examples are if the token is CJK or numbers.
         * It must return a boolean.
         *
         * @param token       The token
         * @param breakWords  The style attr break words
         * @return whether to break word or not
         */
        static canBreakWords(token, breakWords) {
            return breakWords;
        }
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It allows one to determine whether a pair of characters
         * should be broken by newlines
         * For example certain characters in CJK langs or numbers.
         * It must return a boolean.
         *
         * @param char      The character
         * @param nextChar  The next character
         * @param token     The token/word the characters are from
         * @param index     The index in the token of the char
         * @param breakWords  The style attr break words
         * @return whether to break word or not
         */
        static canBreakChars(char, nextChar, token, index, breakWords) {
            return true;
        }
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It is called when a token (usually a word) has to be split into separate pieces
         * in order to determine the point to break a word.
         * It must return an array of characters.
         *
         * @example
         * // Correctly splits emojis, eg "🤪🤪" will result in two element array, each with one emoji.
         * TextMetrics.wordWrapSplit = (token) => [...token];
         *
         * @param token The token to split
         * @return The characters of the token
         */
        static wordWrapSplit(token) {
            return token.split('');
        }
        /**
         * Calculates the ascent, descent and fontSize of a given font-style
         *
         * @param font - String representing the style of the font
         * @return Font properties object
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline
         */
        static measureFont(font) {
            // as this method is used for preparing assets, don't recalculate things if we don't need to
            if (TextMetrics._fonts[font]) {
                return TextMetrics._fonts[font];
            }
            const properties = {};
            const canvas = TextMetrics._canvas;
            const context = TextMetrics._context;
            context.font = font;
            const metricsString = TextMetrics.METRICS_STRING + TextMetrics.BASELINE_SYMBOL;
            const width = Math.ceil(context.measureText(metricsString).width);
            let baseline = Math.ceil(context.measureText(TextMetrics.BASELINE_SYMBOL).width);
            const height = 3 * baseline;
            baseline = baseline * TextMetrics.BASELINE_MULTIPLIER | 0;
            canvas.width = width;
            canvas.height = height;
            context.fillStyle = '#f00';
            context.fillRect(0, 0, width, height);
            context.font = font;
            context.textBaseline = 'alphabetic';
            context.fillStyle = '#000';
            context.fillText(metricsString, 0, baseline);
            const imagedata = context.getImageData(0, 0, width, height).data;
            const pixels = imagedata.length;
            const line = width * 4;
            let i = 0;
            let idx = 0;
            let stop = false;
            // ascent. scan from top to bottom until we find a non red pixel
            for (i = 0; i < baseline; ++i) {
                for (let j = 0; j < line; j += 4) {
                    if (imagedata[idx + j] !== 255) {
                        stop = true;
                        break;
                    }
                }
                if (!stop) {
                    idx += line;
                }
                else {
                    break;
                }
            }
            properties.ascent = baseline - i;
            idx = pixels - line;
            stop = false;
            // descent. scan from bottom to top until we find a non red pixel
            for (i = height; i > baseline; --i) {
                for (let j = 0; j < line; j += 4) {
                    if (imagedata[idx + j] !== 255) {
                        stop = true;
                        break;
                    }
                }
                if (!stop) {
                    idx -= line;
                }
                else {
                    break;
                }
            }
            properties.descent = i - baseline;
            properties.fontSize = properties.ascent + properties.descent;
            TextMetrics._fonts[font] = properties;
            return properties;
        }
        /**
         * Clear font metrics in metrics cache.
         *
         * @param font - font name. If font name not set then clear cache for all fonts.
         */
        static clearMetrics(font = '') {
            if (font) {
                delete TextMetrics._fonts[font];
            }
            else {
                TextMetrics._fonts = {};
            }
        }
    }
    /**
     * Cached canvas element for measuring text
     */
    TextMetrics._canvas = (() => {
        var c = document.createElement('canvas');
        c.width = c.height = 10;
        return c;
    })();
    /**
     * Cache for context to use.
     */
    TextMetrics._context = TextMetrics._canvas.getContext('2d');
    /**
     * Cache of {@see PIXI.TextMetrics.FontMetrics} objects.
     */
    TextMetrics._fonts = {};
    /**
     * String used for calculate font metrics.
     * These characters are all tall to help calculate the height required for text.
     */
    TextMetrics.METRICS_STRING = '|ÉqÅ';
    /**
     * Baseline symbol for calculate font metrics.
     */
    TextMetrics.BASELINE_SYMBOL = 'M';
    /**
     * Baseline multiplier for calculate font metrics.
     */
    TextMetrics.BASELINE_MULTIPLIER = 2;
    /**
     * Cache of new line chars.
     */
    TextMetrics._newlines = [
        0x000A,
        0x000D,
    ];
    /**
     * Cache of breaking spaces.
     */
    TextMetrics._breakingSpaces = [
        0x0009,
        0x0020,
        0x2000,
        0x2001,
        0x2002,
        0x2003,
        0x2004,
        0x2005,
        0x2006,
        0x2008,
        0x2009,
        0x200A,
        0x205F,
        0x3000,
    ];
    feng2d.TextMetrics = TextMetrics;
})(feng2d || (feng2d = {}));
var feng2d;
(function (feng2d) {
    /**
     * 文本组件
     *
     * 用于显示文字。
     */
    let Text = class Text extends feng3d.Component {
        constructor() {
            super(...arguments);
            /**
             * 文本内容。
             */
            this.text = "Hello 🌷 world\nHello 🌷 world";
            /**
             * 是否根据文本自动调整宽高。
             */
            this.autoSize = true;
            this.style = new feng2d.TextStyle();
            /**
             * 显示图片的区域，(0, 0, 1, 1)表示完整显示图片。
             */
            this._uvRect = new feng3d.Vector4(0, 0, 1, 1);
            this._image = new feng3d.Texture2D();
            this._invalid = true;
        }
        beforeRender(renderAtomic, scene, camera) {
            super.beforeRender(renderAtomic, scene, camera);
            var canvas = this._canvas;
            if (!this._canvas || this._invalid) {
                canvas = this._canvas = feng2d.drawText(this._canvas, this.text, this.style);
                this._image["_pixels"] = canvas;
                this._image.wrapS;
                this._image.invalidate();
                this._invalid = false;
            }
            if (this.autoSize) {
                this.transform2D.size.x = canvas.width;
                this.transform2D.size.y = canvas.height;
            }
            // 调整缩放使得更改尺寸时文字不被缩放。
            this._uvRect.z = this.transform2D.size.x / canvas.width;
            this._uvRect.w = this.transform2D.size.y / canvas.height;
            //
            renderAtomic.uniforms.s_texture = this._image;
            renderAtomic.uniforms.u_uvRect = this._uvRect;
        }
        invalidate() {
            this._invalid = true;
        }
        _styleChanged(property, oldValue, newValue) {
            if (oldValue)
                oldValue.off("changed", this.invalidate, this);
            if (newValue)
                newValue.on("changed", this.invalidate, this);
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize,
        feng3d.watch("invalidate")
    ], Text.prototype, "text", void 0);
    __decorate([
        feng3d.oav({ tooltip: "是否根据文本自动调整宽高。" }),
        feng3d.serialize
    ], Text.prototype, "autoSize", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize,
        feng3d.watch("_styleChanged")
    ], Text.prototype, "style", void 0);
    Text = __decorate([
        feng3d.AddComponentMenu("UI/Text"),
        feng3d.RegisterComponent()
    ], Text);
    feng2d.Text = Text;
})(feng2d || (feng2d = {}));
var feng3d;
(function (feng3d) {
    feng3d.GameObject.registerPrimitive("Text", (g) => {
        var transform2D = g.addComponent("Transform2D");
        g.addComponent("CanvasRenderer");
        transform2D.size.x = 160;
        transform2D.size.y = 30;
        g.addComponent("Text");
    });
})(feng3d || (feng3d = {}));
//# sourceMappingURL=feng2d.js.map