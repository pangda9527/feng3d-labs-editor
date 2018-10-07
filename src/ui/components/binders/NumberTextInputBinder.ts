namespace editor
{
    export class NumberTextInputBinder extends TextInputBinder
    {
        /**
		 * 步长，精度
		 */
        step = 0.001;

		/**
		 * 键盘上下方向键步长
		 */
        stepDownup = 0.001;

		/**
		 * 移动一个像素时增加的步长数量
		 */
        stepScale = 1;

        /**
         * 控制器
         */
        controller: egret.DisplayObject;

        toText = function (v)
        {
            // 消除数字显示为类似 0.0000000001 的问题
            var fractionDigits = 1; while (fractionDigits * this.step < 1) { fractionDigits *= 10; }
            var text = String(Math.round(fractionDigits * (Math.round(v / this.step) * this.step)) / fractionDigits);
            return text;
        }

        toValue = function (v)
        {
            return Number(v) || 0;
        }

        initView()
        {
            super.initView();
            if (this.editable)
            {
                feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            }
        }

        dispose()
        {
            super.dispose();
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
        }

        private mouseDownPosition = new feng3d.Vector2();
        private mouseDownValue = 0;

        private onMouseDown()
        {
            if (!this.controller) return;
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var p = this.controller.localToGlobal(0, 0);
            if (!new feng3d.Rectangle(p.x, p.y, this.controller.width, this.controller.height).containsPoint(mousePos)) return;

            //
            this.mouseDownPosition = mousePos;
            this.mouseDownValue = this.attributeValue;

            //
            feng3d.windowEventProxy.on("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        }

        private onStageMouseMove()
        {
            this.attributeValue = this.mouseDownValue + ((feng3d.windowEventProxy.clientX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - feng3d.windowEventProxy.clientY)) * this.step * this.stepScale;
        }

        private onStageMouseUp()
        {
            feng3d.windowEventProxy.off("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onStageMouseUp, this);
        }

        protected ontxtfocusin()
        {
            super.ontxtfocusin();
            feng3d.windowEventProxy.on("keydown", this.onWindowKeyDown, this);
        }

        protected ontxtfocusout()
        {
            super.ontxtfocusout();
            feng3d.windowEventProxy.off("keydown", this.onWindowKeyDown, this);
        }

        private onWindowKeyDown(event: KeyboardEvent)
        {
            if (event.key == "ArrowUp")
            {
                this.attributeValue += this.step;
                this.textInput.text = this.toText.call(this, this.attributeValue);
            } else if (event.key == "ArrowDown")
            {
                this.attributeValue -= this.step;
                this.textInput.text = this.toText.call(this, this.attributeValue);
            }
        }
    }
}