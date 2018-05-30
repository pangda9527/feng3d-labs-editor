namespace editor
{
    export var toolTip: ToolTip;

    export interface ITipView extends egret.DisplayObject
    {
        value: any;
    }

    export class ToolTip
    {
        /**
         * 默认 提示界面
         */
        defaultTipview = () => TipString;
        /**
         * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
         */
        tipviewmap = new Map<any, new () => ITipView>();

        private tipmap = new Map<egret.DisplayObject, any>();
        private tipView: ITipView;

        register(displayObject: egret.DisplayObject, tip: any)
        {
            if (!displayObject) return;
            this.tipmap.set(displayObject, tip);
            this.ischeck = !!this.tipmap.size;
        }

        unregister(displayObject: egret.DisplayObject)
        {
            if (!displayObject) return;
            this.tipmap.delete(displayObject);
            this.ischeck = !!this.tipmap.size;
        }

        private get ischeck()
        {
            return this._ischeck;
        }
        private set ischeck(v)
        {
            if (this._ischeck == v) return;
            this._ischeck = v;
            if (this._ischeck)
            {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            } else
            {
                feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            }
        }
        private _ischeck = false;

        private onMouseMove(event: MouseEvent)
        {
            var displayObjects = this.tipmap.getKeys().filter((item) =>
            {
                if (!item.stage) return false;
                return item.getTransformedBounds(item.stage).contains(event.clientX, event.clientY);
            });
            var displayObject = displayObjects[0];
            if (displayObject)
            {
                var tip = this.tipmap.get(displayObject);
                var tipviewcls = this.tipviewmap.get(tip.constructor);
                if (!tipviewcls)
                    tipviewcls = this.defaultTipview();
                if (this.tipView)
                {
                    if (!(this.tipView instanceof tipviewcls))
                    {
                        this.removeTipview();
                    }
                }
                if (!this.tipView)
                {
                    this.tipView = new tipviewcls();
                }
                editorui.tooltipLayer.addChild(this.tipView);
                this.tipView.value = tip;
                this.tipView.x = event.clientX;
                this.tipView.y = event.clientY - this.tipView.height;
            } else
            {
                this.removeTipview();
            }
        }

        private removeTipview()
        {
            if (this.tipView)
            {
                this.tipView.parent.removeChild(this.tipView);
                this.tipView = null;
            }
        }

    }

    toolTip = new ToolTip();
}