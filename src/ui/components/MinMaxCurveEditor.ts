namespace editor
{
    export var minMaxCurveEditor: MinMaxCurveEditor;

    export class MinMaxCurveEditor extends eui.Component
    {
        @feng3d.watch("_onMinMaxCurveChanged")
        minMaxCurve = new feng3d.MinMaxCurve();

        public curveGroup: eui.Group;
        public curveImage: eui.Image;


        //
        private timeline: feng3d.AnimationCurve;
        private timeline1: feng3d.AnimationCurve;
        private curveRect: feng3d.Rectangle;
        private canvasRect: feng3d.Rectangle;

        private editKey: feng3d.AnimationCurveKeyframe;
        private editorControlkey: feng3d.AnimationCurveKeyframe;
        private editTimeline: feng3d.AnimationCurve;
        private editing = false;
        private mousedownxy = { x: -1, y: -1 }
        private selectedKey: feng3d.AnimationCurveKeyframe;
        private selectTimeline: feng3d.AnimationCurve;

        private curveColor = new feng3d.Color4(1, 0, 0);
        private backColor = feng3d.Color4.fromUnit24(0x565656);
        private fillTwoCurvesColor = new feng3d.Color4(1, 1, 1, 0.2);
        private range = [1, -1];

        constructor()
        {
            super();
            this.skinName = "MinMaxCurveEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("dblclick", this.ondblclick, this);

            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);

            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("dblclick", this.ondblclick, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

            // 曲线绘制区域
            this.curveRect = new feng3d.Rectangle(this.curveGroup.x, this.curveGroup.y, this.curveGroup.width, this.curveGroup.height);
            this.canvasRect = new feng3d.Rectangle(0, 0, this.width, this.height);

            if (this.curveGroup.width < 10 || this.curveGroup.height < 10) return;

            imageUtil.init(this.canvasRect.width, this.canvasRect.height, this.backColor);
            this.drawGrid();

            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
            {
                this.timeline = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                this.timeline1 = null;

                imageUtil.drawCurve(this.timeline, this.minMaxCurve.between0And1, this.curveColor, this.curveRect);

                this.drawCurveKeys(this.timeline);
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
            {
                var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                this.timeline = minMaxCurveRandomBetweenTwoCurves.curveMin;
                this.timeline1 = minMaxCurveRandomBetweenTwoCurves.curveMax;

                imageUtil.drawBetweenTwoCurves(minMaxCurveRandomBetweenTwoCurves, this.minMaxCurve.between0And1, this.curveColor, this.fillTwoCurvesColor, this.curveRect);

                this.drawCurveKeys(this.timeline);
                this.drawCurveKeys(this.timeline1);
            }

            this.drawSelectedKey();

            // 设置绘制结果
            this.curveImage.source = imageUtil.toDataURL();
        }

        /**
         * 绘制曲线关键点
         * @param animationCurve 
         */
        private drawCurveKeys(animationCurve: feng3d.AnimationCurve)
        {
            var c = new feng3d.Color4(1, 0, 0);
            animationCurve.keys.forEach(key =>
            {
                var pos = this.curveToUIPos(key.time, key.value);
                imageUtil.drawPoint(pos.x, pos.y, c, pointSize);
            });
        }

        /**
         * 曲线上的坐标转换为UI上的坐标
         * @param time 
         * @param value 
         */
        private curveToUIPos(time: number, value: number)
        {
            var x = feng3d.FMath.mapLinear(time, 0, 1, this.curveRect.left, this.curveRect.right);
            var y = feng3d.FMath.mapLinear(value, this.range[0], this.range[1], this.curveRect.top, this.curveRect.bottom);
            return { x: x, y: y };
        }

        /**
         * UI上坐标转换为曲线上坐标
         * @param x 
         * @param y 
         */
        private uiToCurvePos(x: number, y: number)
        {
            var time = feng3d.FMath.mapLinear(x, this.curveRect.left, this.curveRect.right, 0, 1);
            var value = feng3d.FMath.mapLinear(y, this.curveRect.top, this.curveRect.bottom, this.range[0], this.range[1]);
            return { time: time, value: value };
        }

        /**
         * 绘制选中的关键点
         */
        private drawSelectedKey()
        {
            if (this.selectedKey == null || this.selectTimeline == null) return;

            var key = this.selectedKey;
            //
            var i = this.selectTimeline.keys.indexOf(key);
            if (i == -1) return;

            var n = this.selectTimeline.keys.length;
            var c = new feng3d.Color4();

            var range = this.minMaxCurve.between0And1 ? [1, 0] : [1, -1];
            var current = new feng3d.Vector2(feng3d.FMath.mapLinear(key.time, 0, 1, this.curveRect.left, this.curveRect.right),
                feng3d.FMath.mapLinear(key.value, range[0], range[1], this.curveRect.top, this.curveRect.bottom));

            imageUtil.drawPoint(current.x, current.y, c, pointSize);

            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;

            if (this.selectedKey == key)
            {
                // 绘制控制点
                if (i > 0)
                {
                    var lcp = new feng3d.Vector2(current.x - controllerLength * Math.cos(Math.atan(currenttan)), current.y + controllerLength * Math.sin(Math.atan(currenttan)));

                    imageUtil.drawPoint(lcp.x, lcp.y, c, pointSize);
                    imageUtil.drawLine(current, lcp, new feng3d.Color4());
                }
                if (i < n - 1)
                {
                    var rcp = new feng3d.Vector2(current.x + controllerLength * Math.cos(Math.atan(currenttan)), current.y - controllerLength * Math.sin(Math.atan(currenttan)));

                    imageUtil.drawPoint(rcp.x, rcp.y, c, pointSize);
                    imageUtil.drawLine(current, rcp, new feng3d.Color4());
                }
            }
        }

        private drawGrid()
        {
            //
            var lines: Line[] = [];
            var c0 = feng3d.Color4.fromUnit24(0x494949);
            var c1 = feng3d.Color4.fromUnit24(0x4f4f4f);
            for (var i = 0; i <= 10; i++)
            {
                lines.push({ start: new feng3d.Vector2(i / 10, 0), end: new feng3d.Vector2(i / 10, 1), color: i % 2 == 0 ? c0 : c1 });
            }
            for (var i = 0; i <= 2; i++)
            {
                lines.push({ start: new feng3d.Vector2(0, i / 2), end: new feng3d.Vector2(1, i / 2), color: i % 2 == 0 ? c0 : c1 });
            }
            lines.forEach(v =>
            {
                v.start.x = this.curveRect.x + this.curveRect.width * v.start.x;
                v.start.y = this.curveRect.y + this.curveRect.height * v.start.y;
                v.end.x = this.curveRect.x + this.curveRect.width * v.end.x;
                v.end.y = this.curveRect.y + this.curveRect.height * v.end.y;
                //
                imageUtil.drawLine(v.start, v.end, v.color);
            });
        }

        private _onMinMaxCurveChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);

            this.range = this.minMaxCurve.between0And1 ? [1, 0] : [1, -1];
        }

        private _onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private onMouseDown(ev: MouseEvent)
        {
            var lp = this.curveGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            this.mousedownxy.x = x;
            this.mousedownxy.y = y;

            var timeline = this.timeline;
            this.editKey = timeline.findKey(x / this.curveRect.width, 1 - y / this.curveRect.height, pointSize / this.curveRect.height);
            if (this.editKey == null && this.timeline1 != null)
            {
                timeline = this.timeline1;
                this.editKey = timeline.findKey(x / this.curveRect.width, 1 - y / this.curveRect.height, pointSize / this.curveRect.height);
            }
            if (this.editKey != null)
            {
                this.selectedKey = this.editKey;
                this.selectTimeline = timeline;
            } else if (this.selectedKey)
            {
                this.editorControlkey = this.findControlKey(this.selectedKey, x, y, pointSize);
                if (this.editorControlkey == null)
                {
                    this.selectedKey = null;
                    this.selectTimeline = null;
                }
            }

            if (this.editKey != null || this.editorControlkey != null)
            {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }

            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

        private onMouseMove(ev: MouseEvent)
        {
            this.editing = true;

            var lp = this.curveGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            if (this.editKey)
            {
                x = feng3d.FMath.clamp(x, 0, this.curveRect.width);
                y = feng3d.FMath.clamp(y, 0, this.curveRect.height);
                //
                this.editKey.time = x / this.curveRect.width;
                this.editKey.value = 1 - y / this.curveRect.height;
                this.selectTimeline.sort();

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            } else if (this.editorControlkey)
            {
                var index = this.selectTimeline.indexOfKeys(this.editorControlkey);
                if (index == 0 && x / this.curveRect.width < this.editorControlkey.time)
                {
                    this.editorControlkey.tangent = 1 - y / this.curveRect.height > this.editorControlkey.value ? Infinity : -Infinity;
                    return;
                }
                if (index == this.selectTimeline.numKeys - 1 && x / this.curveRect.width > this.editorControlkey.time) 
                {
                    this.editorControlkey.tangent = 1 - y / this.curveRect.height > this.editorControlkey.value ? -Infinity : Infinity;
                    return;
                }
                this.editorControlkey.tangent = (1 - y / this.curveRect.height - this.editorControlkey.value) / (x / this.curveRect.width - this.editorControlkey.time);

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }

        private onMouseUp(ev: MouseEvent)
        {
            this.editing = false;
            this.editorControlkey = null;

            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        }

        private findControlKey(key: feng3d.AnimationCurveKeyframe, x: number, y: number, radius: number)
        {
            var currentx = key.time * this.curveRect.width;
            var currenty = (1 - key.value) * this.curveRect.height;
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
            if (Math.abs(lcp.x - x) < radius && Math.abs(lcp.y - y) < radius)
            {
                return key;
            }
            var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
            if (Math.abs(rcp.x - x) < radius && Math.abs(rcp.y - y) < radius)
            {
                return key;
            }
            return null;
        }

        private ondblclick(ev: MouseEvent)
        {
            this.editing = false;
            this.editKey = null;
            this.editorControlkey = null;

            var lp = this.curveGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            var selectedKey = this.timeline.findKey(x / this.curveRect.width, 1 - y / this.curveRect.height, pointSize / this.curveRect.height);
            if (selectedKey != null)
            {
                this.timeline.deleteKey(selectedKey);

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null)
            {
                var selectedKey = this.timeline1.findKey(x / this.curveRect.width, 1 - y / this.curveRect.height, pointSize / this.curveRect.height);
                if (selectedKey != null)
                {
                    this.timeline1.deleteKey(selectedKey);

                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
            // 没有选中关键与控制点时，检查是否点击到曲线
            var newKey = this.timeline.addKeyAtCurve(x / this.curveRect.width, 1 - y / this.curveRect.height, pointSize / this.curveRect.height);
            if (newKey)
            {
                this.selectedKey = newKey;
                this.selectTimeline = this.timeline;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null)
            {
                var newKey = this.timeline1.addKeyAtCurve(x / this.curveRect.width, 1 - y / this.curveRect.height, pointSize / this.curveRect.height);
                if (newKey)
                {
                    this.selectedKey = newKey;
                    this.selectTimeline = this.timeline1;
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }

        }
    }

    var imageUtil = new feng3d.ImageUtil();

    /**
     * 点绘制尺寸
     */
    var pointSize = 5;

    /**
     * 控制柄长度
     */
    var controllerLength = 50;

    interface Line { start: feng3d.Vector2, end: feng3d.Vector2, color: feng3d.Color4 }
}