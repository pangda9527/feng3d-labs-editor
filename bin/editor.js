var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var TestPageUI = (function (_super) {
            __extends(TestPageUI, _super);
            function TestPageUI() {
                _super.call(this);
            }
            TestPageUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(TestPageUI.uiView);
            };
            TestPageUI.uiView = { "type": "View", "child": [{ "props": { "x": 0, "y": 0, "skin": "comp/bg.png", "sizeGrid": "30,4,4,4", "width": 600, "height": 400 }, "type": "Image" }, { "props": { "x": 41, "y": 56, "skin": "comp/button.png", "label": "点我赋值", "width": 150, "height": 37, "sizeGrid": "4,4,4,4", "var": "btn" }, "type": "Button" }, { "props": { "x": 401, "y": 56, "skin": "comp/clip_num.png", "clipX": 10, "var": "clip" }, "type": "Clip" }, { "props": { "x": 220, "y": 143, "skin": "comp/combobox.png", "labels": "select1,select2,selecte3", "selectedIndex": 1, "sizeGrid": "4,20,4,4", "width": 200, "height": 23, "var": "combobox" }, "type": "ComboBox" }, { "props": { "x": 220, "y": 96, "skin": "comp/tab.png", "labels": "tab1,tab2,tab3", "var": "tab" }, "type": "Tab" }, { "props": { "x": 259, "y": 223, "skin": "comp/vscroll.png", "height": 150 }, "type": "VScrollBar" }, { "props": { "x": 224, "y": 223, "skin": "comp/vslider.png", "height": 150 }, "type": "VSlider" }, { "type": "List", "child": [{ "type": "Box", "child": [{ "props": { "skin": "comp/label.png", "text": "this is a list", "x": 26, "y": 5, "width": 78, "height": 20, "fontSize": 14, "name": "label" }, "type": "Label" }, { "props": { "x": 0, "y": 2, "skin": "comp/clip_num.png", "clipX": 10, "name": "clip" }, "type": "Clip" }], "props": { "name": "render", "x": 0, "y": 0, "width": 112, "height": 30 } }], "props": { "x": 452, "y": 68, "width": 128, "height": 299, "vScrollBarSkin": "comp/vscroll.png", "repeatX": 1, "var": "list" } }, { "props": { "x": 563, "y": 4, "skin": "comp/btn_close.png", "name": "close" }, "type": "Button" }, { "props": { "x": 41, "y": 112, "skin": "comp/button.png", "label": "点我赋值", "width": 150, "height": 66, "sizeGrid": "4,4,4,4", "labelSize": 30, "labelBold": true, "var": "btn2" }, "type": "Button" }, { "props": { "x": 220, "y": 188, "skin": "comp/checkbox.png", "label": "checkBox1", "var": "check" }, "type": "CheckBox" }, { "props": { "x": 220, "y": 61, "skin": "comp/radiogroup.png", "labels": "radio1,radio2,radio3", "label2'": "", "var": "radio" }, "type": "RadioGroup" }, { "type": "Panel", "child": [{ "props": { "skin": "comp/image.png" }, "type": "Image" }], "props": { "x": 299, "y": 223, "width": 127, "height": 150, "vScrollBarSkin": "comp/vscroll.png" } }, { "props": { "x": 326, "y": 188, "skin": "comp/checkbox.png", "label": "checkBox2", "labelColors": "#ff0000" }, "type": "CheckBox" }, { "type": "Box", "child": [{ "props": { "y": 70, "skin": "comp/progress.png", "width": 150, "height": 14, "sizeGrid": "4,4,4,4", "name": "progress" }, "type": "ProgressBar" }, { "props": { "y": 103, "skin": "comp/label.png", "text": "This is a Label", "width": 137, "height": 26, "fontSize": 20, "name": "label" }, "type": "Label" }, { "props": { "y": 148, "skin": "comp/textinput.png", "text": "textinput", "width": 150, "name": "input" }, "type": "TextInput" }, { "props": { "skin": "comp/hslider.png", "width": 150, "name": "slider" }, "type": "HSlider" }, { "props": { "y": 34, "skin": "comp/hscroll.png", "width": 150, "name": "scroll" }, "type": "HScrollBar" }], "props": { "x": 41, "y": 197, "var": "box" } }], "props": { "width": 600, "height": 400 } };
            return TestPageUI;
        }(laya.ui.View));
        editor.TestPageUI = TestPageUI;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var TestUI = (function (_super) {
            __extends(TestUI, _super);
            function TestUI() {
                _super.call(this);
                //btn是编辑器界面设定的，代码里面能直接使用，并且有代码提示
                this.btn.on(laya.events.Event.CLICK, this, this.onBtnClick);
                this.btn2.on(laya.events.Event.CLICK, this, this.onBtn2Click);
            }
            TestUI.prototype.onBtnClick = function () {
                //手动控制组件属性
                this.radio.selectedIndex = 1;
                this.clip.index = 8;
                this.tab.selectedIndex = 2;
                this.combobox.selectedIndex = 0;
                this.check.selected = true;
            };
            TestUI.prototype.onBtn2Click = function () {
                //通过赋值可以简单快速修改组件属性
                //赋值有两种方式：
                //简单赋值，比如：progress:0.2，就是更改progress组件的value为2
                //复杂复制，可以通知某个属性，比如：label:{color:"#ff0000",text:"Hello LayaAir"}
                this.box.dataSource = { slider: 50, scroll: 80, progress: 0.2, input: "This is a input", label: { color: "#ff0000", text: "Hello LayaAir" } };
                //list赋值，先获得一个数据源数组
                var arr = [];
                for (var i = 0; i < 100; i++) {
                    arr.push({ label: "item " + i, clip: i % 9 });
                }
                //给list赋值更改list的显示
                this.list.array = arr;
                //还可以自定义list渲染方式，可以打开下面注释看一下效果
                //list.renderHandler = new Handler(this, onListRender);
            };
            TestUI.prototype.onListRender = function (item, index) {
                //自定义list的渲染方式
                var label = item.getChildByName("label");
                if (index % 2) {
                    label.color = "#ff0000";
                }
                else {
                    label.color = "#000000";
                }
            };
            return TestUI;
        }(editor.TestPageUI));
        editor.TestUI = TestUI;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var ColorMaterialTest = (function () {
            function ColorMaterialTest() {
                this.init();
            }
            ColorMaterialTest.prototype.init = function () {
                var canvas = document.getElementById("glcanvas");
                this.view3D = new feng3d.View3D(canvas);
                //初始化颜色材质
                var colorMaterial = new feng3d.ColorMaterial();
                var cube = new feng3d.Object3D("cube", [
                    feng3d.primitives.createCube(),
                    new feng3d.Space3D(0, 0, 300),
                    colorMaterial,
                ]);
                this.view3D.scene.addChild(cube);
                //变化旋转与颜色
                setInterval(function () {
                    cube.space3D.ry += 1;
                }, 15);
                setInterval(function () {
                    colorMaterial.color.color = Math.random() * (1 << 32 - 1);
                }, 1000);
            };
            return ColorMaterialTest;
        }());
        editor.ColorMaterialTest = ColorMaterialTest;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor_1) {
        var Editor = (function () {
            function Editor() {
                //初始化feng3d
                new editor_1.ColorMaterialTest();
                //初始化界面
                Laya.init(600, 400);
                Laya.loader.load([{ url: "res/atlas/comp.json", type: laya.net.Loader.ATLAS }], laya.utils.Handler.create(null, onLoaded));
                function onLoaded() {
                    //实例UI界面
                    var testUI = new editor_1.TestUI();
                    Laya.stage.addChild(testUI);
                }
            }
            return Editor;
        }());
        editor_1.Editor = Editor;
        //启动编辑器
        var editor = new Editor();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=editor.js.map