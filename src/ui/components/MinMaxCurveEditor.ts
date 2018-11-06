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
        private curveRect: feng3d.Rectangle;
        private canvasRect: feng3d.Rectangle;

        private editKey: feng3d.AnimationCurveKeyframe;
        private controlkey: feng3d.AnimationCurveKeyframe;
        private editing = false;
        private mousedownxy = { x: -1, y: -1 }

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

            clearCanvas(canvas, this.canvasRect.width, this.canvasRect.height, "#565656");
            this.drawGrid();

            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
            {
                this.drawCurve();
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
            {
                var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                var imagedata = feng3d.imageUtil.createMinMaxCurveRandomBetweenTwoCurvesRect(minMaxCurveRandomBetweenTwoCurves, this.minMaxCurve.between0And1, this.curveGroup.width - 2, this.curveGroup.height - 2, new feng3d.Color3(1, 0, 0), new feng3d.Color3().fromUnit(0x565656));
                this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
            }
        }

        private drawCurve()
        {
            var animationCurve = this.timeline = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;

            //
            if (animationCurve.keys.length > 0)
            {
                var sameples = animationCurve.getSamples(this.curveRect.width);
                var xSamples = sameples.map((value, i) => (this.curveRect.x + this.curveRect.width * i / (sameples.length - 1)));
                var ySamples = sameples.map(value => (this.curveRect.y + this.curveRect.height * value));
                // 绘制曲线
                drawPointsCurve(canvas, xSamples, ySamples, 'white', 1);
            }

            for (let i = 0, n = animationCurve.keys.length; i < n; i++)
            {
                var key = animationCurve.keys[i];
                var currentx = this.curveRect.x + key.time * this.curveRect.width;
                var currenty = this.curveRect.y + key.value * this.curveRect.height;
                var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;

                // 绘制曲线端点
                drawPoints(canvas, [currentx], [currenty], "red", pointSize)

                // 绘制控制点
                if (i > 0)
                {
                    // 左边控制点
                    var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPoints(canvas, [lcp.x], [lcp.y], "blue", pointSize)
                }
                if (i < n - 1)
                {
                    var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPoints(canvas, [rcp.x], [rcp.y], "blue", pointSize)
                }
                // 绘制控制点
                if (i > 0)
                {
                    // 左边控制点
                    var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPointsCurve(canvas, [currentx, lcp.x], [currenty, lcp.y], "yellow", 1)
                }
                if (i < n - 1)
                {
                    var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                    drawPointsCurve(canvas, [currentx, rcp.x], [currenty, rcp.y], "yellow", 1)
                }
            }
            var imageData = ctx.getImageData(0, 0, this.canvasRect.width, this.canvasRect.height);
            this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imageData);
        }

        private drawGrid()
        {
            //
            var lines0: Line[] = [];
            var lines1: Line[] = [];
            var line: { start: { x: number, y: number }, end: { x: number, y: number } };
            for (var i = 0; i <= 10; i++)
            {
                line = { start: { x: i / 10, y: 0 }, end: { x: i / 10, y: 1 } };
                if (i % 2 == 0)
                    lines0.push(line);
                else
                    lines1.push(line);
            }
            for (var i = 0; i <= 2; i++)
            {
                line = { start: { x: 0, y: i / 2 }, end: { x: 1, y: i / 2 } };
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
            drawLines(canvas, lines0, "#494949");
            drawLines(canvas, lines1, "#4f4f4f");
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

            this.editKey = this.timeline.findKey(x / this.curveRect.width, y / this.curveRect.height, pointSize / this.curveRect.height / 2);
            if (this.editKey == null)
            {
                this.controlkey = this.findControlPoint(x, y);
            }

            if (this.editKey != null || this.controlkey != null)
            {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
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
                this.editKey.value = y / this.curveRect.height;
                this.timeline.sort();

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            } else if (this.controlkey)
            {
                var index = this.timeline.indexOfKeys(this.controlkey);
                if (index == 0 && x / this.curveRect.width < this.controlkey.time)
                {
                    this.controlkey.tangent = y / this.curveRect.height > this.controlkey.value ? Infinity : -Infinity;
                    return;
                }
                if (index == this.timeline.numKeys - 1 && x / this.curveRect.width > this.controlkey.time) 
                {
                    this.controlkey.tangent = y / this.curveRect.height > this.controlkey.value ? -Infinity : Infinity;
                    return;
                }
                this.controlkey.tangent = (y / this.curveRect.height - this.controlkey.value) / (x / this.curveRect.width - this.controlkey.time);

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
        }

        private onMouseUp(ev: MouseEvent)
        {
            this.editing = false;
            this.editKey = null;
            this.controlkey = null;

            feng3d.windowEventProxy.off("mousemove", this.onMouseMove);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp);
        }

        private findControlPoint(x: number, y: number)
        {
            for (let i = 0; i < this.timeline.numKeys; i++)
            {
                var key = this.timeline.getKey(i);
                var currentx = key.time * this.curveRect.width;
                var currenty = key.value * this.curveRect.height;
                var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
                var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                if (Math.abs(lcp.x - x) < pointSize / 2 && Math.abs(lcp.y - y) < pointSize / 2)
                {
                    return key;
                }
                var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                if (Math.abs(rcp.x - x) < pointSize / 2 && Math.abs(rcp.y - y) < pointSize / 2)
                {
                    return key;
                }
            }
            return null;
        }

        private ondblclick(ev: MouseEvent)
        {
            this.editing = false;
            this.editKey = null;
            this.controlkey = null;

            var lp = this.curveGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            var selectedKey = this.timeline.findKey(x / this.curveRect.width, y / this.curveRect.height, pointSize / this.curveRect.height / 2);
            if (selectedKey != null)
            {
                this.timeline.deleteKey(selectedKey);

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            } else 
            {
                // 没有选中关键与控制点时，检查是否点击到曲线
                var result = this.timeline.addKeyAtCurve(x / this.curveRect.width, y / this.curveRect.height, pointSize / this.curveRect.height / 2);

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
        }
    }

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
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
    function clearCanvas(canvas: HTMLCanvasElement, width: number, height: number, fillStyle = "#565656")
    {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width;
        canvas.height = height;
        //
        var ctx = canvas.getContext("2d");
        // ctx.clearRect(0, 0, width, height);
        // 绘制背景
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * 绘制曲线
     * @param canvas 画布 
     * @param points 曲线上的点
     * @param strokeStyle 曲线颜色
     */
    function drawPointsCurve(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], strokeStyle = 'white', lineWidth = 1)
    {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.moveTo(xpoints[0], ypoints[0]);
        for (let i = 1; i < xpoints.length; i++)
        {
            ctx.lineTo(xpoints[i], ypoints[i]);
        }
        ctx.stroke();
    }

    /**
     * 绘制点
     * @param canvas 画布 
     * @param xpoints 曲线上的点x坐标
     * @param ypoints 曲线上的点y坐标
     * @param fillStyle 曲线颜色
     */
    function drawPoints(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], fillStyle = 'white', lineWidth = 1)
    {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = fillStyle;
        for (let i = 0; i < xpoints.length; i++)
        {
            ctx.fillRect(xpoints[i] - lineWidth / 2, ypoints[i] - lineWidth / 2, lineWidth, lineWidth);
        }
    }

    /**
     * 绘制线条
     * @param canvas 画布 
     * @param lines 线条列表数据
     * @param strokeStyle 线条颜色
     */
    function drawLines(canvas: HTMLCanvasElement, lines: Line[], strokeStyle = 'white', lineWidth = 1)
    {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        for (let i = 0; i < lines.length; i++)
        {
            ctx.moveTo(lines[i].start.x, lines[i].start.y);
            ctx.lineTo(lines[i].end.x, lines[i].end.y);
        }
        ctx.stroke();
    }

    interface Line { start: { x: number, y: number }, end: { x: number, y: number } }

}