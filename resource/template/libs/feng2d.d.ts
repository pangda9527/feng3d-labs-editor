declare namespace feng2d {
    /**
     * UIRenderMode for the Canvas.
     *
     * Canvas的渲染模式
     */
    enum UIRenderMode {
        /**
         * Render at the end of the Scene using a 2D Canvas.
         *
         * 在场景的最后使用2D画布渲染。
         */
        ScreenSpaceOverlay = 0,
        /**
         * Render using the Camera configured on the Canvas.
         *
         * 使用在画布上配置的摄像机进行渲染。
         */
        ScreenSpaceCamera = 1,
        /**
         * Render using any Camera in the Scene that can render the layer.
         *
         * 使用场景中任何可以渲染图层的相机渲染。
         */
        WorldSpace = 2
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Transform2D: feng2d.Transform2D;
    }
}
declare namespace feng2d {
    /**
     * 2D变换
     *
     * 提供了比Transform更加适用于2D元素的API
     *
     * 通过修改Transform的数值实现
     */
    class Transform2D extends feng3d.Component {
        get single(): boolean;
        transformLayout: feng3d.TransformLayout;
        /**
         * 描述了2D对象在未经过变换前的位置与尺寸
         */
        get rect(): feng3d.Vector4;
        private _rect;
        /**
         * 位移
         */
        get position(): feng3d.Vector2;
        set position(v: feng3d.Vector2);
        private readonly _position;
        /**
         * 尺寸，宽高。
         */
        get size(): feng3d.Vector2;
        set size(v: feng3d.Vector2);
        private _size;
        /**
         * 与最小最大锚点形成的边框的left、right、top、bottom距离。当 anchorMin.x != anchorMax.x 时对 layout.x layout.y 赋值生效，当 anchorMin.y != anchorMax.y 时对 layout.z layout.w 赋值生效，否则赋值无效，自动被覆盖。
         */
        get layout(): feng3d.Vector4;
        set layout(v: feng3d.Vector4);
        private _layout;
        /**
         * 最小锚点，父Transform2D中左上角锚定的规范化位置。
         */
        get anchorMin(): feng3d.Vector2;
        set anchorMin(v: feng3d.Vector2);
        private _anchorMin;
        /**
         * 最大锚点，父Transform2D中左上角锚定的规范化位置。
         */
        get anchorMax(): feng3d.Vector2;
        set anchorMax(v: feng3d.Vector2);
        private _anchorMax;
        /**
         * The normalized position in this RectTransform that it rotates around.
         */
        get pivot(): feng3d.Vector2;
        set pivot(v: feng3d.Vector2);
        private _pivot;
        /**
         * 旋转
         */
        get rotation(): number;
        set rotation(v: number);
        private _rotation;
        /**
         * 缩放
         */
        get scale(): feng3d.Vector2;
        set scale(v: feng3d.Vector2);
        private readonly _scale;
        /**
         * 创建一个实体，该类为虚类
         */
        constructor();
        init(): void;
        private _onAddComponent;
        private _onRemovedComponent;
        private _onTransformLayoutChanged;
        beforeRender(renderAtomic: feng3d.RenderAtomic, scene: feng3d.Scene, camera: feng3d.Camera): void;
        /**
         * 将 Ray3 从世界空间转换为局部空间。
         *
         * @param worldRay 世界空间射线。
         * @param localRay 局部空间射线。
         */
        rayWorldToLocal(worldRay: feng3d.Ray3, localRay?: feng3d.Ray3): feng3d.Ray3;
    }
}
declare namespace feng3d {
    interface GameObject {
        /**
         * 游戏对象上的2D变换。
         */
        transform2D: feng2d.Transform2D;
    }
    interface Component {
        /**
         * 游戏对象上的2D变换。
         */
        transform2D: feng2d.Transform2D;
    }
}
declare namespace feng2d {
    /**
     * UI几何体
     */
    class UIGeometry extends feng3d.Geometry {
        __class__: "feng2d.UIGeometry";
        constructor();
    }
}
declare namespace feng3d {
    interface GeometryTypes {
        UIGeometry: feng2d.UIGeometry;
    }
    interface DefaultGeometry {
        "Default-UIGeometry": feng2d.UIGeometry;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CanvasRenderer: feng2d.CanvasRenderer;
    }
}
declare namespace feng2d {
    /**
     * 可在画布上渲染组件，使得拥有该组件的GameObject可以在画布上渲染。
     */
    class CanvasRenderer extends feng3d.Renderable {
        readonly renderAtomic: feng3d.RenderAtomic;
        geometry: UIGeometry;
        material: feng3d.Material;
        /**
         * 与世界空间射线相交
         *
         * @param worldRay 世界空间射线
         *
         * @return 相交信息
         */
        worldRayIntersection(worldRay: feng3d.Ray3): feng3d.PickingCollisionVO;
        protected _updateBounds(): void;
        /**
         * 渲染
         */
        static draw(view: feng3d.View): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Canvas: feng2d.Canvas;
    }
}
declare namespace feng2d {
    /**
     * Element that can be used for screen rendering.
     *
     * 能够被用于屏幕渲染的元素
     */
    class Canvas extends feng3d.Behaviour {
        /**
         * Is the Canvas in World or Overlay mode?
         *
         * 画布是在世界或覆盖模式?
         */
        renderMode: UIRenderMode;
        /**
         * 获取鼠标射线（与鼠标重叠的摄像机射线）
         */
        mouseRay: feng3d.Ray3;
        /**
         * 投影矩阵
         *
         * 渲染前自动更新
         */
        projection: feng3d.Matrix4x4;
        /**
         * 最近距离
         */
        near: number;
        /**
         * 最远距离
         */
        far: number;
        init(): void;
        /**
         * 更新布局
         *
         * @param width 画布宽度
         * @param height 画布高度
         */
        layout(width: number, height: number): void;
        /**
         * 计算鼠标射线
         *
         * @param view
         */
        calcMouseRay3D(view: feng3d.View): void;
    }
}
declare namespace feng3d {
    interface PrimitiveGameObject {
        Canvas: GameObject;
    }
}
declare namespace feng2d {
    class UIUniforms {
        __class__: "feng2d.ImageUniforms";
        /**
         * UI几何体尺寸，在shader中进行对几何体缩放。
         */
        u_rect: feng3d.Vector4;
        /**
         * 颜色
         */
        u_color: feng3d.Color4;
        /**
         * 纹理数据
         */
        s_texture: feng3d.Texture2D;
        /**
         * 控制图片的显示区域。
         */
        u_uvRect: feng3d.Vector4;
    }
}
declare namespace feng3d {
    interface UniformsTypes {
        ui: feng2d.UIUniforms;
    }
    interface Uniforms extends feng2d.UIUniforms {
    }
    interface DefaultMaterial {
        "Default-UIMaterial": Material;
    }
}
declare namespace feng3d {
}
declare namespace feng3d {
}
declare namespace feng3d {
    interface ComponentMap {
        Rect: feng2d.Rect;
    }
}
declare namespace feng2d {
    /**
     * 矩形纯色组件
     *
     * 用于填充UI中背景等颜色。
     */
    class Rect extends feng3d.Component {
        /**
         * 填充颜色。
         */
        color: feng3d.Color4;
        beforeRender(renderAtomic: feng3d.RenderAtomic, scene: feng3d.Scene, camera: feng3d.Camera): void;
    }
}
declare namespace feng3d {
    interface PrimitiveGameObject {
        Rect: GameObject;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Image: feng2d.Image;
    }
}
declare namespace feng2d {
    /**
     * 图片组件
     *
     * 用于显示图片
     */
    class Image extends feng3d.Component {
        /**
         * The source texture of the Image element.
         *
         * 图像元素的源纹理。
         */
        image: feng3d.Texture2D;
        /**
         * Tinting color for this Image.
         *
         * 为该图像着色。
         */
        color: feng3d.Color4;
        /**
         * 使图片显示实际尺寸
         */
        setNativeSize(): void;
        beforeRender(renderAtomic: feng3d.RenderAtomic, scene: feng3d.Scene, camera: feng3d.Camera): void;
    }
}
declare namespace feng3d {
    interface PrimitiveGameObject {
        Image: GameObject;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Button: feng2d.Button;
    }
}
declare namespace feng2d {
    /**
     * 按钮状态
     */
    enum ButtonState {
        /**
         * 弹起状态，默认状态。
         */
        up = "up",
        /**
         * 鼠标在按钮上状态。
         */
        over = "over",
        /**
         * 鼠标按下状态。
         */
        down = "down",
        /**
         * 选中时弹起状态。
         */
        selected_up = "selected_up",
        /**
         * 选中时鼠标在按钮上状态。
         */
        selected_over = "selected_over",
        /**
         * 选中时鼠标按下状态。
         */
        selected_down = "selected_down",
        /**
         * 禁用状态。
         */
        disabled = "disabled"
    }
    /**
     * 按钮
     */
    class Button extends feng3d.Behaviour {
        /**
         * 按钮所处状态。
         */
        state: ButtonState;
        /**
         * 所有状态数据，每一个状态数据中记录了子对象的当前数据。
         */
        allStateData: {};
        private _stateInvalid;
        /**
         * 保存当前状态，例如在编辑器中编辑完按钮某一状态后调用该方法进行保存当前状态数据。
         */
        saveState(): void;
        private _onStateChanged;
        /**
         * 每帧执行
         */
        update(interval?: number): void;
        /**
         * 更新状态
         */
        private _updateState;
    }
}
declare namespace feng3d {
    interface PrimitiveGameObject {
        Button: GameObject;
    }
}
declare namespace feng2d {
    /**
     * 绘制文本
     *
     * @param canvas 画布
     * @param _text 文本
     * @param style 文本样式
     * @param resolution 分辨率
     */
    function drawText(canvas: HTMLCanvasElement, _text: string, style: TextStyle, resolution?: number): HTMLCanvasElement;
}
declare namespace feng2d {
    /**
     * 文本上渐变方向。
     */
    enum TEXT_GRADIENT {
        /**
         * 纵向梯度。
         */
        LINEAR_VERTICAL = 0,
        /**
         * 横向梯度。
         */
        LINEAR_HORIZONTAL = 1
    }
    /**
     * 通用字体。
     */
    enum FontFamily {
        'Arial' = "Arial",
        'serif' = "serif",
        'sans-serif' = "sans-serif",
        'monospace' = "monospace",
        'cursive' = "cursive",
        'fantasy' = "fantasy",
        'system-ui' = "system-ui",
        '宋体' = "\u5B8B\u4F53"
    }
    /**
     * 字体样式。
     */
    enum FontStyle {
        'normal' = "normal",
        'italic' = "italic",
        'oblique' = "oblique"
    }
    /**
     * 字体变体。
     */
    enum FontVariant {
        'normal' = "normal",
        'small-caps' = "small-caps"
    }
    enum FontWeight {
        'normal' = "normal",
        'bold' = "bold",
        'bolder' = "bolder",
        'lighter' = "lighter"
    }
    /**
     * 设置创建的角的类型，它可以解决带尖刺的文本问题。
     */
    enum CanvasLineJoin {
        "round" = "round",
        "bevel" = "bevel",
        "miter" = "miter"
    }
    /**
     * 画布文本基线
     */
    enum CanvasTextBaseline {
        "top" = "top",
        "hanging" = "hanging",
        "middle" = "middle",
        "alphabetic" = "alphabetic",
        "ideographic" = "ideographic",
        "bottom" = "bottom"
    }
    /**
     * 文本对齐方式
     */
    enum TextAlign {
        'left' = "left",
        'center' = "center",
        'right' = "right"
    }
    enum WhiteSpaceHandle {
        "normal" = "normal",
        'pre' = "pre",
        'pre-line' = "pre-line"
    }
    interface TextStyleEventMap {
        /**
         * 发生变化
         */
        changed: any;
    }
    interface TextStyle {
        once<K extends keyof TextStyleEventMap>(type: K, listener: (event: feng3d.Event<TextStyleEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TextStyleEventMap>(type: K, data?: TextStyleEventMap[K], bubbles?: boolean): feng3d.Event<TextStyleEventMap[K]>;
        has<K extends keyof TextStyleEventMap>(type: K): boolean;
        on<K extends keyof TextStyleEventMap>(type: K, listener: (event: feng3d.Event<TextStyleEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): void;
        off<K extends keyof TextStyleEventMap>(type?: K, listener?: (event: feng3d.Event<TextStyleEventMap[K]>) => any, thisObject?: any): void;
    }
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
        constructor(style?: Partial<TextStyle>);
        /**
         * 字体。
         */
        fontFamily: FontFamily;
        /**
         * 字体尺寸。
         */
        fontSize: number;
        /**
         * 字体样式。
         */
        fontStyle: FontStyle;
        /**
         * 字体变体。
         */
        fontVariant: FontVariant;
        /**
         * 字型粗细。
         */
        fontWeight: FontWeight;
        /**
         * 用于填充文本的颜色。
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
         */
        fill: feng3d.Color4;
        /**
         * 如果填充是一个创建渐变的颜色数组，这可以改变渐变的方向。
         */
        fillGradientType: TEXT_GRADIENT;
        /**
         * 如果填充是一个颜色数组来创建渐变，这个数组可以设置停止点
         */
        fillGradientStops: number[];
        /**
         * 将用于文本笔划的画布填充样式。
         */
        stroke: feng3d.Color4;
        /**
         * 一个表示笔画厚度的数字。
         */
        strokeThickness: number;
        /**
         * lineJoin属性设置创建的角的类型，它可以解决带尖刺的文本问题。
         */
        lineJoin: CanvasLineJoin;
        /**
         * 当使用“miter”lineJoin模式时，miter限制使用。这可以减少或增加呈现文本的尖锐性。
         */
        miterLimit: number;
        /**
         * 字母之间的间距，默认为0
         */
        letterSpacing: number;
        /**
         * 呈现文本的基线。
         */
        textBaseline: CanvasTextBaseline;
        /**
         * 是否为文本设置一个投影。
         */
        dropShadow: boolean;
        /**
         * 投影颜色。
         */
        dropShadowColor: feng3d.Color4;
        /**
         * 投影角度。
         */
        dropShadowAngle: number;
        /**
         * 阴影模糊半径。
         */
        dropShadowBlur: number;
        /**
         * 投影距离。
         */
        dropShadowDistance: number;
        /**
         * 是否应使用自动换行。
         */
        wordWrap: boolean;
        /**
         * 能否把单词分多行。
         */
        breakWords: boolean;
        /**
         * 多行文本对齐方式。
         */
        align: TextAlign;
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
        whiteSpace: WhiteSpaceHandle;
        /**
         * 文本的换行宽度。
         */
        wordWrapWidth: number;
        /**
         * 行高。
         */
        lineHeight: number;
        /**
         * 行距。
         */
        leading: number;
        /**
         * 内边距，用于文字被裁减问题。
         */
        padding: number;
        /**
         * 是否修剪透明边界。
         */
        trim: boolean;
        /**
         * 使数据失效
         */
        invalidate(): void;
        /**
         *
         * 生成用于' TextMetrics.measureFont() '的字体样式字符串。
         */
        toFontString(): string;
    }
}
declare namespace feng2d {
    /**
     * 文本度量
     *
     * 用于度量指定样式的文本的宽度。
     *
     * 从pixi.js移植
     *
     * @see https://github.com/pixijs/pixi.js/blob/dev/packages/text/src/TextMetrics.js
     */
    export class TextMetrics {
        /**
         * 被测量的文本。
         */
        text: string;
        /**
         * 被测量的样式。
         */
        style: TextStyle;
        /**
         * 测量出的宽度。
         */
        width: number;
        /**
         * 测量出的高度。
         */
        height: number;
        /**
         * 根据样式分割成的多行文本。
         */
        lines: string[];
        /**
         * An array of the line widths for each line matched to `lines`
         */
        lineWidths: number[];
        /**
         * The measured line height for this style
         */
        lineHeight: number;
        /**
         * The maximum line width for all measured lines
         */
        maxLineWidth: number;
        /**
         * The font properties object from TextMetrics.measureFont
         */
        fontProperties: IFontMetrics;
        /**
         * Cached canvas element for measuring text
         */
        static _canvas: HTMLCanvasElement;
        /**
         * Cache for context to use.
         */
        static _context: CanvasRenderingContext2D;
        /**
         * Cache of {@see PIXI.TextMetrics.FontMetrics} objects.
         */
        static _fonts: {
            [key: string]: IFontMetrics;
        };
        /**
         * String used for calculate font metrics.
         * These characters are all tall to help calculate the height required for text.
         */
        static METRICS_STRING: string;
        /**
         * Baseline symbol for calculate font metrics.
         */
        static BASELINE_SYMBOL: string;
        /**
         * Baseline multiplier for calculate font metrics.
         */
        static BASELINE_MULTIPLIER: number;
        /**
         * Cache of new line chars.
         */
        static _newlines: number[];
        /**
         * Cache of breaking spaces.
         */
        static _breakingSpaces: number[];
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
        constructor(text: string, style: TextStyle, width: number, height: number, lines: string[], lineWidths: number[], lineHeight: number, maxLineWidth: number, fontProperties: IFontMetrics);
        /**
         * Measures the supplied string of text and returns a Rectangle.
         *
         * @param text - the text to measure.
         * @param style - the text style to use for measuring
         * @param wordWrap - optional override for if word-wrap should be applied to the text.
         * @param canvas - optional specification of the canvas to use for measuring.
         * @return measured width and height of the text.
         */
        static measureText(text: string, style: TextStyle, wordWrap: boolean, canvas?: HTMLCanvasElement): TextMetrics;
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
        static wordWrap(text: string, style: TextStyle, canvas?: HTMLCanvasElement): string;
        /**
         * Convienience function for logging each line added during the wordWrap
         * method
         *
         * @private
         * @param  line        - The line of text to add
         * @param  newLine     - Add new line character to end
         * @return A formatted line
         */
        static addLine(line: string, newLine?: boolean): string;
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
        static getFromCache(key: string, letterSpacing: number, cache: {
            [key: string]: number;
        }, context: CanvasRenderingContext2D): number;
        /**
         * Determines whether we should collapse breaking spaces
         *
         * @private
         * @param whiteSpace  The TextStyle property whiteSpace
         * @return should collapse
         */
        static collapseSpaces(whiteSpace: string): boolean;
        /**
         * Determines whether we should collapse newLine chars
         *
         * @private
         * @param whiteSpace  The white space
         * @return should collapse
         */
        static collapseNewlines(whiteSpace: string): boolean;
        /**
         * trims breaking whitespaces from string
         *
         * @private
         * @param text  The text
         * @return trimmed string
         */
        static trimRight(text: string): string;
        /**
         * Determines if char is a newline.
         *
         * @private
         * @param char  The character
         * @return True if newline, False otherwise.
         */
        static isNewline(char: string): boolean;
        /**
         * Determines if char is a breaking whitespace.
         *
         * @private
         * @param char  The character
         * @return True if whitespace, False otherwise.
         */
        static isBreakingSpace(char: string): boolean;
        /**
         * Splits a string into words, breaking-spaces and newLine characters
         *
         * @private
         * @param text       The text
         * @return A tokenized array
         */
        static tokenize(text: string): string[];
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
        static canBreakWords(token: string, breakWords: boolean): boolean;
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
        static canBreakChars(char: string, nextChar: string, token: string, index: number, breakWords: boolean): boolean;
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
        static wordWrapSplit(token: string): string[];
        /**
         * Calculates the ascent, descent and fontSize of a given font-style
         *
         * @param font - String representing the style of the font
         * @return Font properties object
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline
         */
        static measureFont(font: string): IFontMetrics;
        /**
         * Clear font metrics in metrics cache.
         *
         * @param font - font name. If font name not set then clear cache for all fonts.
         */
        static clearMetrics(font?: string): void;
    }
    /**
     * A number, or a string containing a number.
     */
    interface IFontMetrics {
        /**
         * Font ascent
         */
        ascent: number;
        /**
         * Font descent
         */
        descent: number;
        /**
         * Font size
         */
        fontSize: number;
    }
    export {};
}
declare namespace feng3d {
    interface ComponentMap {
        Text: feng2d.Text;
    }
}
declare namespace feng2d {
    /**
     * 文本组件
     *
     * 用于显示文字。
     */
    class Text extends feng3d.Component {
        /**
         * 文本内容。
         */
        text: string;
        /**
         * 是否根据文本自动调整宽高。
         */
        autoSize: boolean;
        style: TextStyle;
        /**
         * 显示图片的区域，(0, 0, 1, 1)表示完整显示图片。
         */
        private _uvRect;
        private _image;
        private _canvas;
        private _invalid;
        beforeRender(renderAtomic: feng3d.RenderAtomic, scene: feng3d.Scene, camera: feng3d.Camera): void;
        invalidate(): void;
        private _styleChanged;
    }
}
declare namespace feng3d {
    interface PrimitiveGameObject {
        Text: GameObject;
    }
}
//# sourceMappingURL=feng2d.d.ts.map