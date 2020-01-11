namespace editor
{
    export class NumberTextInputBinder extends TextInputBinder
    {
        /**
		 * 步长，精度
		 */
        step = 0.001;

		/**
		 * 按下上下方向键时增加的步长数量
		 */
        stepDownup = 10;

		/**
		 * 移动一个像素时增加的步长数量
		 */
        stepScale = 1;

        /**
         * 最小值
         */
        minValue = NaN;

        /**
         * 最小值
         */
        maxValue = NaN;

        /**
         * 控制器
         */
        controller: egret.DisplayObject;

        toText(v: number)
        {
            // 消除数字显示为类似 0.0000000001 的问题
            var fractionDigits = 1; while (fractionDigits * this.step < 1) { fractionDigits *= 10; }
            var text = String(Math.round(fractionDigits * (Math.round(v / this.step) * this.step)) / fractionDigits);
            return text;
        }

        toValue(v: string)
        {
            var n = Number(v) || 0;
            var fractionDigits = 1; while (fractionDigits * this.step < 1) { fractionDigits *= 10; }
            n = Math.round(fractionDigits * (Math.round(n / this.step) * this.step)) / fractionDigits;
            return n;
        }

        initView()
        {
            super.initView();
            if (this.editable)
            {
                // feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
                this.controller && this.controller.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
                MouseOnDisableScroll.register(this.controller);
            }
        }

        dispose()
        {
            super.dispose();
            // feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            this.controller && this.controller.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            MouseOnDisableScroll.unRegister(this.controller);
        }

        protected onValueChanged()
        {
            var value = this.space[this.attribute];
            if (!isNaN(this.minValue))
            {
                value = Math.max(this.minValue, value);
            }
            if (!isNaN(this.maxValue))
            {
                value = Math.min(this.maxValue, value);
            }
            this.space[this.attribute] = value
            super.onValueChanged();
        }

        private mouseDownPosition = new feng3d.Vector2();
        private mouseDownValue = 0;

        private onMouseDown(e: egret.MouseEvent)
        {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);

            //
            this.mouseDownPosition = mousePos;
            this.mouseDownValue = this.space[this.attribute];

            //
            feng3d.windowEventProxy.on("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        }

        private onStageMouseMove()
        {
            this.space[this.attribute] = this.mouseDownValue + ((feng3d.windowEventProxy.clientX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - feng3d.windowEventProxy.clientY)) * this.step * this.stepScale;
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
                this.space[this.attribute] += this.step * this.stepDownup;
                this.textInput.text = this.toText.call(this, this.space[this.attribute]);
            } else if (event.key == "ArrowDown")
            {
                this.space[this.attribute] -= this.step * this.stepDownup;
                this.textInput.text = this.toText.call(this, this.space[this.attribute]);
            }
            this.invalidateView();
        }
    }
}