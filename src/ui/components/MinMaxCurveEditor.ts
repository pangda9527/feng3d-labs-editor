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

            clearCanvas(this.canvasRect.width, this.canvasRect.height, feng3d.Color4.fromUnit24(0x565656));
            this.drawGrid();

            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
            {
                this.timeline = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                this.timeline1 = null;

                this.drawCurve(this.timeline);
                this.drawCurveKeys(this.timeline);
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
            {
                var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                this.timeline = minMaxCurveRandomBetweenTwoCurves.curveMin;
                this.timeline1 = minMaxCurveRandomBetweenTwoCurves.curveMax;

                var imagedata = new feng3d.ImageUtil(this.curveRect.width, this.curveRect.height, new feng3d.Color4().fromUnit(0xff565656))
                    .drawImageDataBetweenTwoCurves(minMaxCurveRandomBetweenTwoCurves, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                ctx.putImageData(imagedata.imageData, this.curveRect.x, this.curveRect.y);

                this.drawCurve(this.timeline);
                this.drawCurveKeys(this.timeline);
                this.drawCurve(this.timeline1);
                this.drawCurveKeys(this.timeline1);
            }

            this.drawSelectedKey();

            // 设置绘制结果
            var imageData = ctx.getImageData(0, 0, this.canvasRect.width, this.canvasRect.height);
            this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imageData);
        }

        /**
         * 绘制曲线
         * @param animationCurve 
         */
        private drawCurve(animationCurve: feng3d.AnimationCurve)
        {
            // 绘制曲线
            if (animationCurve.keys.length > 0)
            {
                var sameples = animationCurve.getSamples(this.curveRect.width);

                var xSamples = sameples.map(value => (this.curveRect.x + this.curveRect.width * value.time));
                var ySamples = sameples.map(value => (this.curveRect.y + this.curveRect.height * (1 - value.value)));
                // 绘制曲线
                drawPointsCurve(xSamples, ySamples, new feng3d.Color4(1, 0, 0));
            }
        }

        /**
         * 绘制曲线关键点
         * @param animationCurve 
         */
        private drawCurveKeys(animationCurve: feng3d.AnimationCurve)
        {
            // 绘制曲线关键点
            for (let i = 0, n = animationCurve.keys.length; i < n; i++)
            {
                var key = animationCurve.keys[i];
                var currentx = this.curveRect.x + key.time * this.curveRect.width;
                var currenty = this.curveRect.y + (1 - key.value) * this.curveRect.height;

                // 绘制曲线端点
                drawPoints([currentx], [currenty], new feng3d.Color4(1, 0, 0), pointSize)
            }
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

            var currentx = this.curveRect.x + key.time * this.curveRect.width;
            var currenty = this.curveRect.y + (1 - key.value) * this.curveRect.height;
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;

            if (this.selectedKey == key)
            {
                // 绘制控制点
                if (i > 0)
                {
                    // 左边控制点
                    var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPoints([lcp.x], [lcp.y], new feng3d.Color4(0, 0, 1), pointSize)
                }
                if (i < n - 1)
                {
                    var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPoints([rcp.x], [rcp.y], new feng3d.Color4(0, 0, 1), pointSize)
                }
                // 绘制控制点
                if (i > 0)
                {
                    // 左边控制点
                    var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPointsCurve([currentx, lcp.x], [currenty, lcp.y], new feng3d.Color4(1, 1, 0));
                }
                if (i < n - 1)
                {
                    var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPointsCurve([currentx, rcp.x], [currenty, rcp.y], new feng3d.Color4(1, 1, 0));
                }
            }
        }

        private drawGrid()
        {
            //
            var lines0: Line[] = [];
            var lines1: Line[] = [];
            var line: Line;
            for (var i = 0; i <= 10; i++)
            {
                line = { start: new feng3d.Vector2(i / 10, 0), end: new feng3d.Vector2(i / 10, 1) };
                if (i % 2 == 0)
                    lines0.push(line);
                else
                    lines1.push(line);
            }
            for (var i = 0; i <= 2; i++)
            {
                line = { start: new feng3d.Vector2(0, i / 2), end: new feng3d.Vector2(1, i / 2) };
                if (i % 2 == 0)
                    lines0.push(line);
                else
                    lines1.push(line);
            }
            lines0.concat(lines1).forEach(v =>
            {
                v.start.x = this.curveRect.x + this.curveRect.width * v.start.x;
                v.start.y = this.curveRect.y + this.curveRect.height * v.start.y;
                v.end.x = this.curveRect.x + this.curveRect.width * v.end.x;
                v.end.y = this.curveRect.y + this.curveRect.height * v.end.y;
            });
            drawLines(lines0, feng3d.Color4.fromUnit24(0x494949));
            drawLines(lines1, feng3d.Color4.fromUnit24(0x4f4f4f));
        }

        private _onMinMaxCurveChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
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

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imageUtil = new feng3d.ImageUtil();

    /**
     * 点绘制尺寸
     */
    var pointSize = 5;

    /**
     * 控制柄长度
     */
    var controllerLength = 50;

    /**
     * 清理画布
     * @param canvas 画布
     */
    function clearCanvas(width: number, height: number, fillStyle = feng3d.Color4.fromUnit24(0x565656))
    {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width;
        canvas.height = height;
        //
        var ctx = canvas.getContext("2d");
        // ctx.clearRect(0, 0, width, height);
        // 绘制背景
        ctx.fillStyle = fillStyle.toColor3().toHexString();
        ctx.fillRect(0, 0, width, height);

        imageUtil.init(width, height, fillStyle);
    }

    /**
     * 绘制曲线
     * @param canvas 画布 
     * @param points 曲线上的点
     * @param strokeStyle 曲线颜色
     */
    function drawPointsCurve(xpoints: number[], ypoints: number[], strokeStyle = new feng3d.Color4())
    {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = strokeStyle.toColor3().toHexString();
        ctx.moveTo(xpoints[0], ypoints[0]);
        for (let i = 1; i < xpoints.length; i++)
        {
            ctx.lineTo(xpoints[i], ypoints[i]);
        }
        ctx.stroke();

        //
        for (let i = 0; i < xpoints.length - 1; i++)
        {
            imageUtil.drawLine(new feng3d.Vector2(xpoints[i], ypoints[i]), new feng3d.Vector2(xpoints[i + 1], ypoints[i + 1]), strokeStyle);
        }
    }

    /**
     * 绘制点
     * @param canvas 画布 
     * @param xpoints 曲线上的点x坐标
     * @param ypoints 曲线上的点y坐标
     * @param fillStyle 曲线颜色
     */
    function drawPoints(xpoints: number[], ypoints: number[], fillStyle = new feng3d.Color4(), pointSize = 1)
    {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = fillStyle.toColor3().toHexString();
        for (let i = 0; i < xpoints.length; i++)
        {
            ctx.fillRect(xpoints[i] - pointSize / 2, ypoints[i] - pointSize / 2, pointSize, pointSize);
        }

        //
        for (let i = 0; i < xpoints.length; i++)
        {
            imageUtil.drawPoint(xpoints[i], ypoints[i], fillStyle, pointSize);
        }
    }

    /**
     * 绘制线条
     * @param canvas 画布 
     * @param lines 线条列表数据
     * @param strokeStyle 线条颜色
     */
    function drawLines(lines: Line[], strokeStyle = new feng3d.Color4(), lineWidth = 1)
    {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle.toColor3().toHexString();
        for (let i = 0; i < lines.length; i++)
        {
            ctx.moveTo(lines[i].start.x, lines[i].start.y);
            ctx.lineTo(lines[i].end.x, lines[i].end.y);
        }
        ctx.stroke();

        //
        for (let i = 0; i < lines.length - 1; i++)
        {
            imageUtil.drawLine(lines[i].start, lines[i].end, strokeStyle);
        }
    }

    interface Line { start: feng3d.Vector2, end: feng3d.Vector2 }
}