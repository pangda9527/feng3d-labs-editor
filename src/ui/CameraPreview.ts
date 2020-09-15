namespace editor
{
    export class CameraPreview extends eui.Component
    {
        public group: eui.Group;
        //
        private saveParent: egret.DisplayObjectContainer;
        private canvas: HTMLElement;
        private previewView: feng3d.View;

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
            this.previewView.camera = this._camera;
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
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
        }

        private initView()
        {
            if (this.saveParent) return;

            //
            var canvas = this.canvas = document.createElement("canvas");
            (document.getElementById("CameraPreviewLayer")).appendChild(canvas);
            this.previewView = new feng3d.View(canvas);
            this.previewView.mouse3DManager.mouseInput.enable = false;
            this.previewView.stop();
            //
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(() =>
            {
                this.parent.removeChild(this);
            });
            feng3d.globalDispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);

            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);

            this.onResize();
        }

        private onResize()
        {
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

        private onDataChange()
        {
            var selectedGameObjects = editorData.selectedGameObjects;
            if (selectedGameObjects.length > 0)
            {
                for (let i = 0; i < selectedGameObjects.length; i++)
                {
                    var camera = selectedGameObjects[i].getComponent("Camera");
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
            if (this.previewView.scene != editorData.gameScene)
            {
                this.previewView.scene = editorData.gameScene;
            }
            this.previewView.render();
        }
    }
}