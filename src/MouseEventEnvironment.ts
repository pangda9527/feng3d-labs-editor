module feng3d.editor
{
    export var mouseEventEnvironment: MouseEventEnvironment;

    export class MouseEventEnvironment
    {
        private webTouchHandler: { canvas: HTMLCanvasElement, touch: egret.sys.TouchHandler, getLocation(event: any): Point }
        private canvas: HTMLCanvasElement;
        private touch: egret.sys.TouchHandler;

        overDisplayObject: egret.DisplayObject;
        rightmousedownObject: egret.DisplayObject;

        constructor()
        {
            this.webTouchHandler = this.getWebTouchHandler();
            this.canvas = this.webTouchHandler.canvas;
            this.touch = this.webTouchHandler.touch;

            this.webTouchHandler.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

            input.on("rightmousedown", (e) =>
            {
                var location = this.webTouchHandler.getLocation(e.data.event);
                var x = location.x;
                var y = location.y;

                this.rightmousedownObject = this.touch["findTarget"](x, y);
            });
            input.on("rightmouseup", (e) =>
            {
                var location = this.webTouchHandler.getLocation(e.data.event);
                var x = location.x;
                var y = location.y;

                var target: egret.DisplayObject = this.touch["findTarget"](x, y);
                if (target == this.rightmousedownObject)
                {
                    egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.RIGHT_CLICK, true, true, x, y);
                    this.rightmousedownObject = null;
                }
            });
            input.on("dblclick", (e) =>
            {
                var location = this.webTouchHandler.getLocation(e.data.event);
                var x = location.x;
                var y = location.y;

                var target: egret.DisplayObject = this.touch["findTarget"](x, y);
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.DOUBLE_CLICK, true, true, x, y);
            });
        }

        private onMouseMove(event: MouseEvent)
        {
            var location = this.webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;

            var target: egret.DisplayObject = this.touch["findTarget"](x, y);
            if (target == this.overDisplayObject)
                return;
            var preOverDisplayObject = this.overDisplayObject;
            this.overDisplayObject = target;
            if (preOverDisplayObject)
            {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, MouseEvent.MOUSE_OUT, true, true, x, y);
            }
            if (this.overDisplayObject)
            {
                egret.TouchEvent.dispatchTouchEvent(this.overDisplayObject, MouseEvent.MOUSE_OVER, true, true, x, y);
            }
        }

        private getWebTouchHandler()
        {
            var list = document.querySelectorAll(".egret-player");
            var length = list.length;
            var player = null;
            for (var i = 0; i < length; i++)
            {
                var container = <HTMLDivElement>list[i];
                player = container["egret-player"];
                if (player)
                    break;
            }
            return player.webTouchHandler;
        }
    }
}