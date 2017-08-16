declare namespace feng3d.editor {
    enum DragType {
        HierarchyNode = 0,
    }
}
declare namespace feng3d.editor {
    /**
     * 拖拽源
     * @author feng		2017-01-22
     */
    class DragSource {
        /**
         * 数据拥有者
         */
        private dataHolder;
        /**
         * 格式处理函数列表
         */
        private formatHandlers;
        /**
         * 格式列表
         */
        private _formats;
        /**
         * 格式列表
         */
        readonly formats: any[];
        /**
         * 添加数据
         * @param data			数据
         * @param format		数据格式
         */
        addData(data: Object, format: string | number): void;
        /**
         * 添加处理函数
         * @param handler
         * @param format
         */
        addHandler(handler: Function, format: string | number): void;
        /**
         * 根据格式获取数据
         * @param format		格式
         * @return 				拥有的数据或者处理回调函数
         */
        dataForFormat(format: string | number): any;
        /**
         * 判断是否支持指定格式
         * @param format			格式
         * @return
         */
        hasFormat(format: string | number): boolean;
    }
}
declare namespace feng3d.editor {
    /**
     * 拖拽事件
     * @author feng		2017-01-22
     */
    class DragEvent extends egret.Event {
        /**
         * 拖拽放下事件
         */
        static DRAG_DROP: string;
        /**
         * 拖入事件
         */
        static DRAG_ENTER: string;
        /**
         * 拖出事件
         */
        static DRAG_EXIT: string;
        /**
         * 拖拽发起对象
         */
        dragInitiator: egret.DisplayObject;
        /**
         * 拖拽源
         */
        dragSource: DragSource;
        /**
         * 构建拖拽事件
         * @param type						事件类型
         * @param dragInitiator				拖拽发起对象
         * @param dragSource				拖拽源
         * @param bubbles					是否冒泡
         * @param cancelable				能否取消事件传播
         */
        constructor(type: string, dragInitiator?: egret.DisplayObject, dragSource?: DragSource, bubbles?: boolean, cancelable?: boolean);
    }
}
declare namespace feng3d.editor {
    /**
     * 拖拽管理者
     * @author feng 2017-01-22
     *
     */
    class DragManager {
        /**
         * 拖拽示例
         */
        private static _instance;
        /**
         * 拖拽管理者
         */
        private static readonly instance;
        /**
         * 是否正在拖拽
         */
        static readonly isDragging: boolean;
        /**
         * 是否被接受
         */
        static readonly isSuccess: boolean;
        /**
         * 执行拖拽
         * @param dragInitiator		拖拽发起对象
         * @param dragSource		拖拽源
         * @param mouseEvent		鼠标事件
         * @param dragImagge		拖拽图片
         * @param xOffset			X偏移
         * @param yOffset			Y偏移
         * @param imageAlpha		图片透明度
         * @param allowMove			是否允许移动
         */
        static doDrag(dragInitiator: egret.DisplayObject, dragSource: DragSource, dragImagge?: egret.DisplayObject, xOffset?: number, yOffset?: number, imageAlpha?: number, allowMove?: boolean): void;
        /**
         * 接受拖入
         * @param target		接受拖入的对象
         */
        static acceptDragDrop(target: egret.DisplayObject): void;
        /**
         * 是否接受拖入
         */
        static isAcceptDragDrop(target: egret.DisplayObject): boolean;
        /**
         * 是否正在拖拽
         */
        private isDragging;
        private _accepter;
        /**
         * 拖拽发起对象
         */
        private dragInitiator;
        /**
         * 拖拽源
         */
        private dragSource;
        /**
         * 拖拽图片
         */
        private dragImage;
        /**
         * X偏移
         */
        private xOffset;
        /**
         * y偏移
         */
        private yOffset;
        /**
         * 图片透明度
         */
        private imageAlpha;
        /**
         * 是否允许移动
         */
        private allowMove;
        /**
         * 舞台
         */
        private stage;
        /**
         * 是否放入接受者中
         */
        private isSuccess;
        /**
         * 执行拖拽
         * @param dragInitiator		拖拽发起对象
         * @param dragSource		拖拽源
         * @param dragImagge		拖拽图片
         * @param xOffset			X偏移
         * @param yOffset			Y偏移
         * @param imageAlpha		图片透明度
         * @param allowMove			是否允许移动
         */
        doDrag(dragInitiator: egret.DisplayObject, dragSource: DragSource, dragImage?: egret.DisplayObject, xOffset?: number, yOffset?: number, imageAlpha?: number, allowMove?: boolean): void;
        /**
         * 接受拖入
         * @param target		接受拖入的对象
         */
        acceptDragDrop(target: egret.DisplayObject): void;
        /**
         * 接受对象
         */
        private accepter;
        /**
         * 开始拖拽
         */
        private startDrag();
        private updateDragImage();
        private endDrag();
        /**
         * 处理接受对象鼠标移出事件
         */
        protected onAccepterMouseOut(event: MouseEvent): void;
        /**
         * 处理舞台鼠标移入事件
         */
        protected onStageMouseOver(event: MouseEvent): void;
        protected onStageMouseUp(event: MouseEvent): void;
        protected onStageMouseMove(event: MouseEvent): void;
        private addListeners();
        private removeListeners();
    }
}
declare namespace feng3d.editor {
    class Feng3dView extends eui.Component implements eui.UIComponent {
        private canvas;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onResize();
    }
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
    class TreeItemRenderer extends eui.ItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        /**
         * 子节点相对父节点的缩进值，以像素为单位。默认17。
         */
        indentation: number;
        data: HierarchyNode;
        private watchers;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onDisclosureButtonClick();
        private updateView();
        private onItemMouseDown(event);
        private onMouseUp(event);
        private onMouseMove(event);
        private onDragEnter(event);
        private onDragExit(event);
        private onDragDrop(event);
    }
}
declare namespace feng3d.editor {
    interface TreeNodeEventMap {
        added: TreeNode;
        removed: TreeNode;
        openChanged: TreeNode;
    }
    interface TreeNode {
        once<K extends keyof TreeNodeEventMap>(type: K, listener: (event: TreeNodeEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeNodeEventMap>(type: K, data?: TreeNodeEventMap[K], bubbles?: boolean): any;
        has<K extends keyof TreeNodeEventMap>(type: K): boolean;
        on<K extends keyof TreeNodeEventMap>(type: K, listener: (event: TreeNodeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeNodeEventMap>(type?: K, listener?: (event: TreeNodeEventMap[K]) => any, thisObject?: any): any;
    }
    class TreeNode extends Event {
        label: string;
        depth: number;
        isOpen: boolean;
        hasChildren: boolean;
        /**
         * 父节点
         */
        parent: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[];
        constructor();
        /**
         * 判断是否包含节点
         */
        contain(node: TreeNode): boolean;
        addNode(node: TreeNode): void;
        removeNode(node: TreeNode): void;
        destroy(): void;
        updateChildrenDepth(): void;
        getShowNodes(): TreeNode[];
        onIsOpenChange(): void;
    }
}
declare namespace feng3d.editor {
    class Tree extends eui.List {
        constructor();
    }
}
declare namespace feng3d.editor {
    class Vector3DView extends eui.Component implements eui.UIComponent {
        vm: Vector3D;
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onTextChange(event);
    }
}
declare namespace feng3d.editor {
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
    }
}
declare namespace feng3d.editor {
    /**
     * 默认基础对象界面
     * @author feng 2016-3-11
     */
    class DefaultBaseObjectView extends eui.Component implements IObjectView {
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
declare namespace feng3d.editor {
    /**
     * 默认对象属性界面
     * @author feng 2016-3-10
     */
    class DefaultObjectAttributeView extends eui.Component implements IObjectAttributeView {
        private textTemp;
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        label: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        space: Object;
        readonly attributeName: string;
        attributeValue: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        private onClick();
        private onTextChange();
    }
}
declare namespace feng3d.editor {
    /**
     * 默认对象属性块界面
     * @author feng 2016-3-22
     */
    class DefaultObjectBlockView extends eui.Component implements IObjectBlockView {
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
declare namespace feng3d {
    interface IObjectView extends eui.Component {
    }
}
declare namespace feng3d.editor {
    /**
     * 默认使用块的对象界面
     * @author feng 2016-3-22
     */
    class DefaultObjectView extends eui.Component implements IObjectView {
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
        private onAddedToStage();
        private onRemovedFromStage();
    }
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
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
        private onCreateComponent(item);
        space: GameObject;
        readonly attributeName: string;
        attributeValue: Object;
        private initView();
        private addComponentView(component);
        /**
         * 更新界面
         */
        updateView(): void;
        private onDeleteButton(event);
    }
}
declare namespace feng3d.editor {
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
        hasBackData: boolean;
        viewData: any;
        private viewDataList;
        constructor(editor3DData: Editor3DData);
        showData(data: any, removeBack?: boolean): void;
        back(): void;
        private updateView();
    }
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
    class CreateObject3DView extends eui.Component implements eui.UIComponent {
        object3dList: eui.List;
        maskSprite: eui.Rect;
        private _dataProvider;
        private _selectedCallBack;
        constructor();
        showView(data: {
            label: string;
        }[], selectedCallBack: (item: {
            label: string;
        }) => void, globalPoint?: {
            x: number;
            y: number;
        }): void;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onObject3dListChange();
        private maskMouseDown();
    }
}
declare namespace feng3d.editor {
    class HierarchyTreeItemRenderer extends TreeItemRenderer {
        data: HierarchyNode;
        constructor();
    }
}
declare namespace feng3d.editor {
    class HierarchyTree extends Tree {
        constructor();
    }
}
declare namespace feng3d.editor {
    class HierarchyView extends eui.Component implements eui.UIComponent {
        addButton: eui.Button;
        list: eui.List;
        private listData;
        private watchers;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onListChange();
        private onHierarchyNodeAdded();
        private onHierarchyNodeRemoved();
        private selectedObject3DChanged();
        private onAddButtonClick();
        private onCreateObject3d(selectedItem);
    }
}
declare namespace feng3d.editor {
    class AssetsView extends eui.Component implements eui.UIComponent {
        assetsTree: feng3d.editor.Tree;
        private listData;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
    }
}
declare namespace feng3d.editor {
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
        private onMainButtonClick();
        private onMainMenu(item);
        private onHelpButtonClick();
        private onButtonClick(event);
        private onObject3DOperationIDChange();
    }
    var createObject3DView: CreateObject3DView;
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
    class LoadingUI extends egret.Sprite {
        constructor();
        private textField;
        private createView();
        setProgress(current: number, total: number): void;
    }
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
    /**
     * 场景数据
     */
    class SceneData {
    }
}
declare namespace feng3d.editor {
    class Editor3DData {
        sceneData: SceneData;
        stage: egret.Stage;
        selectedObject: GameObject;
        camera: Camera;
        /** 3d场景 */
        scene3D: Scene3D;
        view3D: Engine;
        hierarchy: Hierarchy;
        object3DOperationID: number;
        /**
         * 鼠标在view3D中的坐标
         */
        mouseInView3D: Point;
        view3DRect: Rectangle;
        /**
         * 巡视界面数据
         */
        inspectorViewData: InspectorViewData;
        constructor();
    }
}
declare namespace feng3d.editor {
    class Editor3DEvent extends Event {
    }
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
    class Object3DMoveModel extends Component {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;
        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;
        oCube: CoordinateCube;
        constructor(gameObject: GameObject);
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
        constructor(gameObject: GameObject);
        private update();
    }
    class CoordinateCube extends Component {
        private colorMaterial;
        private oCube;
        color: Color;
        selectedColor: Color;
        selected: boolean;
        private _selected;
        constructor(gameObject: GameObject);
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
        constructor(gameObject: GameObject);
        update(): void;
    }
}
declare namespace feng3d.editor {
    class Object3DRotationModel extends Component {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;
        constructor(gameObject: GameObject);
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
        constructor(gameObject: GameObject);
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
        constructor(gameObject: GameObject);
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
        constructor(gameObject: GameObject);
        private initModels();
        update(): void;
    }
}
declare namespace feng3d.editor {
    class Object3DScaleModel extends Component {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;
        constructor(gameObject: GameObject);
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
        constructor(gameObject: GameObject);
        update(): void;
    }
}
declare namespace feng3d.editor {
    class Object3DControllerToolBase extends Component {
        private _selectedItem;
        private _toolModel;
        protected ismouseDown: boolean;
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;
        protected _object3DControllerTarget: Object3DControllerTarget;
        constructor(gameObject: GameObject);
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
declare namespace feng3d.editor {
    class Object3DMoveTool extends Object3DControllerToolBase {
        protected toolModel: Object3DMoveModel;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        private startPos;
        constructor(gameObject: GameObject);
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d.editor {
    class Object3DRotationTool extends Object3DControllerToolBase {
        protected toolModel: Object3DRotationModel;
        private startPlanePos;
        private startMousePos;
        constructor(gameObject: GameObject);
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d.editor {
    class Object3DScaleTool extends Object3DControllerToolBase {
        protected toolModel: Object3DScaleModel;
        private startMousePos;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        constructor(gameObject: GameObject);
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
    }
}
declare namespace feng3d.editor {
    class Object3DControllerTool extends Component {
        private object3DMoveTool;
        private object3DRotationTool;
        private object3DScaleTool;
        private _currentTool;
        private object3DControllerTarget;
        constructor(gameObject: GameObject);
        private onSelectedObject3DChange();
        private onObject3DOperationIDChange();
        private onObject3DMoveTool();
        private onObject3DRotationTool();
        private onObject3DScaleTool();
        private currentTool;
    }
}
declare namespace feng3d.editor {
    class HierarchyNode extends TreeNode {
        object3D: GameObject;
        /**
         * 父节点
         */
        parent: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[];
        constructor(object3D: GameObject);
        addNode(node: HierarchyNode): void;
        removeNode(node: HierarchyNode): void;
    }
}
declare namespace feng3d.editor {
    class Hierarchy {
        readonly rootNode: HierarchyNode;
        readonly selectedNode: HierarchyNode;
        constructor(rootObject3D: GameObject);
        /**
         * 获取节点
         */
        getNode(object3D: GameObject): HierarchyNode;
        addObject3D(object3D: GameObject, parentNode?: HierarchyNode, allChildren?: boolean): HierarchyNode;
        private onMouseClick(event);
        private onCreateObject3D(event);
        private onDeleteSeletedObject3D();
        resetScene(scene: GameObject): void;
        private onImport();
        private onSaveScene();
    }
}
declare namespace feng3d.editor {
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
declare namespace feng3d.editor {
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
        constructor(gameObject: GameObject);
        /**
         * 创建地面网格对象
         */
        private init();
        private update();
    }
}
declare namespace feng3d.editor {
    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    class Main3D {
        constructor();
        private process(event);
        private init();
        private test();
        private testMouseRay();
    }
}
declare namespace feng3d.editor {
    class EditorEnvironment {
        constructor();
        private init();
    }
}
declare namespace feng3d.editor {
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
    };
}
declare namespace feng3d.editor {
    var mouseEventEnvironment: MouseEventEnvironment;
    class MouseEventEnvironment {
        private webTouchHandler;
        private canvas;
        private touch;
        overDisplayObject: egret.DisplayObject;
        constructor();
        private onMouseMove(event);
        private getWebTouchHandler();
    }
}
/**
 * 层级界面创建3D对象列表数据
 */
declare var createObjectConfig: {
    label: string;
    className: string;
}[];
/**
 * 层级界面创建3D对象列表数据
 */
declare var createObject3DComponentConfig: {
    label: string;
    className: string;
}[];
/**
 * 主菜单
 */
declare var mainMenuConfig: {
    label: string;
    command: string;
}[];
/**
 * ObjectView总配置数据
 */
declare var objectViewConfig: {
    defaultBaseObjectViewClass: string;
    defaultObjectViewClass: string;
    defaultObjectAttributeViewClass: string;
    defaultObjectAttributeBlockView: string;
    attributeDefaultViewClassByTypeVec: {
        type: string;
        component: string;
    }[];
    classConfigVec: {
        name: string;
        component: string;
        componentParam: any;
        attributeDefinitionVec: ({
            name: string;
            block: string;
        } | {
            name: string;
            component: string;
            block: string;
        })[];
        blockDefinitionVec: any[];
    }[];
};
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
declare namespace feng3d.editor {
    interface EditorEventMap {
        Create_Object3D: any;
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
declare namespace feng3d.editor {
    var editor3DData: Editor3DData;
    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    class Editor extends eui.UILayer {
        constructor();
        private _onAddToStage();
    }
}
