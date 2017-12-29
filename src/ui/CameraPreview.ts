namespace feng3d.editor
{
    export class CameraPreview extends eui.Component implements eui.UIComponent
    {
        public fullbutton: eui.Button;
        private canvas: HTMLElement;
        private previewEngine: Engine;

        get camera()
        {
            return this._camera;
        }
        set camera(value)
        {
            if (this._camera)
            {
                ticker.offframe(this.onframe, this);
            }
            this._camera = value;
            this.previewEngine.camera = this._camera;
            this.visible = !!this._camera;
            this.canvas.style.display = this._camera ? "inline" : "none";
            if (this._camera)
            {
                ticker.onframe(this.onframe, this);
            }
        }

        private _camera: Camera;

        constructor()
        {
            super();
            this.skinName = "CameraPreview";
            this.visible = false;
            //
            var canvas = this.canvas = <HTMLCanvasElement>document.getElementById("cameraPreviewCanvas");;
            this.previewEngine = new Engine(canvas);
            this.previewEngine.stop();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            watcher.watch(editorData, "selectedObjects", this.onDataChange, this);

            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);

            this.onResize();
            this.onDataChange();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()
            watcher.unwatch(editorData, "selectedObjects", this.onDataChange, this);
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
        }

        private onResize()
        {
            if (!this.stage)
                return;

            var lt = this.localToGlobal(0, 0);
            var rb = this.localToGlobal(this.width, this.height);
            var bound1 = new Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);

            // var bound2 = this.getTransformedBounds(this.stage);
            var bound = bound1;

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
                    var camera = selectedGameObjects[i].getComponent(Camera);
                    if (camera)
                    {
                        this.camera = camera;
                        return;
                    }
                }
            }
            this.camera = null;
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