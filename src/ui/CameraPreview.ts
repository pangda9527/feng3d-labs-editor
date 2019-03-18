namespace editor
{
    export class CameraPreview extends eui.Component
    {
        public group: eui.Group;
        //
        private saveParent: egret.DisplayObjectContainer;
        private canvas: HTMLElement;
        private previewEngine: feng3d.Engine;

        get camera()
        {
            return this._camera;
        }
        set camera(value)
        {
            if (this._camera)
            {
                feng3d.ticker.offframe(this.onframe, this);
            }
            this._camera = value;
            this.previewEngine.camera = this._camera;
            this.visible = !!this._camera;
            this.canvas.style.display = this._camera ? "inline" : "none";
            if (this._camera)
            {
                feng3d.ticker.onframe(this.onframe, this);
            }
        }

        private _camera: feng3d.Camera;

        constructor()
        {
            super();
            this.skinName = "CameraPreview";
            //
            var canvas = this.canvas = <HTMLCanvasElement>document.getElementById("cameraPreviewCanvas");;
            this.previewEngine = new feng3d.Engine(canvas);
            this.previewEngine.mouse3DManager.mouseInput.enable = false;
            this.previewEngine.stop();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
        }

        private initView()
        {
            if (this.saveParent) return;
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(() =>
            {
                this.parent.removeChild(this);
            });
            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);

            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);

            this.onResize();
        }

        private onResize()
        {
            if (!this.stage)
                return;

            var lt = this.group.localToGlobal(0, 0);
            var rb = this.group.localToGlobal(this.group.width, this.group.height);
            var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);

            var style = this.canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
        }

        private onDataChange()
        {
            var selectedGameObjects = editorData.selectedGameObjects;
            if (selectedGameObjects.length > 0)
            {
                for (let i = 0; i < selectedGameObjects.length; i++)
                {
                    var camera = selectedGameObjects[i].getComponent(feng3d.Camera);
                    if (camera)
                    {
                        this.camera = camera;
                        this.saveParent.addChild(this);
                        return;
                    }
                }
            }
            this.camera = null;
            this.parent && this.parent.removeChild(this);
        }

        private onframe()
        {
            if (this.previewEngine.scene != engine.scene)
            {
                this.previewEngine.scene = engine.scene;
            }
            this.previewEngine.render();
        }
    }
}