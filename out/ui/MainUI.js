var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./LoadingUI", "./AssetAdapter", "./ThemeAdapter"], function (require, exports, LoadingUI_1, AssetAdapter_1, ThemeAdapter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainUI = /** @class */ (function (_super) {
        __extends(MainUI, _super);
        function MainUI(onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            var _this = _super.call(this) || this;
            _this.isThemeLoadEnd = false;
            _this.isResourceLoadEnd = false;
            _this.onComplete = onComplete;
            return _this;
        }
        MainUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            //inject the custom material parser
            //注入自定义的素材解析器
            var assetAdapter = new AssetAdapter_1.AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter_1.ThemeAdapter());
            //Config loading process interface
            //设置加载进度界面
            this.loadingView = new LoadingUI_1.LoadingUI();
            this.stage.addChild(this.loadingView);
            // initialize the Resource loading library
            //初始化Resource资源加载库
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig("./resource/default.res.json", "./resource/");
        };
        /**
         * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
         * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
         */
        MainUI.prototype.onConfigComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("./resource/default.thm.json", this.stage);
            theme.once(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup("preload");
        };
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        MainUI.prototype.onThemeLoadComplete = function () {
            this.isThemeLoadEnd = true;
            this.createScene();
        };
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        MainUI.prototype.onResourceLoadComplete = function (event) {
            if (event.groupName == "preload") {
                this.stage.removeChild(this.loadingView);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                this.isResourceLoadEnd = true;
                this.createScene();
            }
        };
        MainUI.prototype.createScene = function () {
            if (this.isThemeLoadEnd && this.isResourceLoadEnd && this.onComplete) {
                this.onComplete();
            }
        };
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        MainUI.prototype.onItemLoadError = function (event) {
            feng3d.warn("Url:" + event.resItem.url + " has failed to load");
        };
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        MainUI.prototype.onResourceLoadError = function (event) {
            //TODO
            feng3d.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //ignore loading failed projects
            this.onResourceLoadComplete(event);
        };
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        MainUI.prototype.onResourceProgress = function (event) {
            if (event.groupName == "preload") {
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        };
        return MainUI;
    }(eui.UILayer));
    exports.MainUI = MainUI;
});
//# sourceMappingURL=MainUI.js.map