namespace editor
{
    export var minMaxCurveEditor: MinMaxCurveEditor;

    export class MinMaxCurveEditor extends eui.Component
    {
        @feng3d.watch("_onMinMaxCurveChanged")
        minMaxCurve = new feng3d.MinMaxCurve();

        public curveGroup: eui.Group;
        public curveImage: eui.Image;

        constructor()
        {
            super();
            this.skinName = "MinMaxCurveEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.updateView();

            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        }

        $onRemoveFromStage()
        {
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
            {
                // var animationCurve = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                // var imagedata = feng3d.imageUtil.createAnimationCurveRect(animationCurve, this.minMaxCurve.between0And1, this.curveGroup.width - 2, this.curveGroup.height - 2, new feng3d.Color3(1, 0, 0), new feng3d.Color3().fromUnit(0x565656));
                // this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);

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
            var animationCurve = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;

            //
            var canvasWidth = this.curveGroup.width - 2;
            var canvasHeight = this.curveGroup.height - 2;

            // 曲线绘制区域
            var curveRect = new feng3d.Rectangle(0, 0, canvasWidth, canvasHeight);
            curveRect.inflate(-20, - 20);

            //
            clearCanvas(canvas, canvasWidth, canvasHeight, "#565656");

            if (animationCurve.keys.length > 0)
            {
                var sameples = animationCurve.getSamples(curveRect.width);
                var xSamples = sameples.map((value, i) => (curveRect.x + curveRect.width * i / (sameples.length - 1)));
                var ySamples = sameples.map(value => (curveRect.y + curveRect.height * (1 - value)));
                // 绘制曲线
                drawPointsCurve(canvas, xSamples, ySamples, 'white', 3);
            }

            for (let i = 0, n = animationCurve.keys.length; i < n; i++)
            {
                var key = animationCurve.keys[i];
                var currentx = curveRect.x + key.time * curveRect.width;
                var currenty = curveRect.y + (1 - key.value) * curveRect.height;
                var currenttan = key.tangent * curveRect.height / curveRect.width;

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
            var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imageData);
        }

        private _onMinMaxCurveChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    /**
     * 点绘制尺寸
     */
    var pointSize = 16;

    /**
     * 控制柄长度
     */
    var controllerLength = 100;

    /**
     * 清理画布
     * @param canvas 画布
     */
    function clearCanvas(canvas: HTMLCanvasElement, width: number, height: number, fillStyle = 'black')
    {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width;
        canvas.height = height;
        //
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制背景
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * 绘制曲线
     * @param canvas 画布 
     * @param points 曲线上的点
     * @param strokeStyle 曲线颜色
     */
    function drawPointsCurve(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], strokeStyle = 'white', lineWidth = 3)
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
    function drawPoints(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], fillStyle = 'white', lineWidth = 3)
    {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = fillStyle;
        for (let i = 0; i < xpoints.length; i++)
        {
            ctx.fillRect(xpoints[i] - lineWidth / 2, ypoints[i] - lineWidth / 2, lineWidth, lineWidth);
        }

    }
}