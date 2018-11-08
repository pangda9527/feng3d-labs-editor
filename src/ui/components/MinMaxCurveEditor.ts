namespace editor
{
    export var minMaxCurveEditor: MinMaxCurveEditor;

    export class MinMaxCurveEditor extends eui.Component
    {
        @feng3d.watch("_onMinMaxCurveChanged")
        minMaxCurve = new feng3d.MinMaxCurve();

        public viewGroup: eui.Group;
        public curveImage: eui.Image;
        public curveGroup: eui.Group;
        public multiplierInput: eui.TextInput;
        public y_0: eui.Label;
        public y_1: eui.Label;
        public y_2: eui.Label;
        public y_3: eui.Label;
        public x_0: eui.Label;
        public x_1: eui.Label;
        public x_2: eui.Label;
        public x_3: eui.Label;
        public x_4: eui.Label;
        public x_5: eui.Label;
        public x_6: eui.Label;
        public x_7: eui.Label;
        public x_8: eui.Label;
        public x_9: eui.Label;
        public x_10: eui.Label;
        public samplesOperationBtn: eui.Button;
        public samplesGroup: eui.Group;
        public sample_0: eui.Image;
        public sample_1: eui.Image;
        public sample_2: eui.Image;
        public sample_3: eui.Image;
        public sample_4: eui.Image;
        public sample_5: eui.Image;
        public sample_6: eui.Image;
        public sample_7: eui.Image;

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

        private imageUtil = new feng3d.ImageUtil();

        /**
         * 点绘制尺寸
         */
        private pointSize = 5;

        /**
         * 控制柄长度
         */
        private controllerLength = 50;
        private yLabels: eui.Label[];
        private xLabels: eui.Label[];
        private sampleImages: eui.Image[];

        constructor()
        {
            super();
            this.skinName = "MinMaxCurveEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.yLabels = [this.y_0, this.y_1, this.y_2, this.y_3];
            this.xLabels = [this.x_0, this.x_1, this.x_2, this.x_3, this.x_4, this.x_5, this.x_6, this.x_7, this.x_8, this.x_9, this.x_10];

            this.sampleImages = [this.sample_0, this.sample_1, this.sample_2, this.sample_3, this.sample_4, this.sample_5, this.sample_5, this.sample_6, this.sample_7];

            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("dblclick", this.ondblclick, this);

            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);

            this.addBinder(new NumberTextInputBinder().init({
                space: this.minMaxCurve, attribute: "curveMultiplier", textInput: this.multiplierInput, editable: true,
                controller: null,
            }));

            feng3d.watcher.watch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);

            this.updateXYLabels();
            this.updateSampleImages();
            this.updateView();
        }

        $onRemoveFromStage()
        {
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);

            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("dblclick", this.ondblclick, this);

            feng3d.watcher.unwatch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

            // 曲线绘制区域
            this.curveRect = new feng3d.Rectangle(this.curveGroup.x, this.curveGroup.y, this.curveGroup.width, this.curveGroup.height);
            this.canvasRect = new feng3d.Rectangle(0, 0, this.viewGroup.width, this.viewGroup.height);

            if (this.curveGroup.width < 10 || this.curveGroup.height < 10) return;

            this.imageUtil.init(this.canvasRect.width, this.canvasRect.height, this.backColor);
            this.drawGrid();

            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
            {
                this.timeline = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                this.timeline1 = null;

                this.imageUtil.drawCurve(this.timeline, this.minMaxCurve.between0And1, this.curveColor, this.curveRect);

                this.drawCurveKeys(this.timeline);
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
            {
                var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                this.timeline = minMaxCurveRandomBetweenTwoCurves.curveMin;
                this.timeline1 = minMaxCurveRandomBetweenTwoCurves.curveMax;

                this.imageUtil.drawBetweenTwoCurves(minMaxCurveRandomBetweenTwoCurves, this.minMaxCurve.between0And1, this.curveColor, this.fillTwoCurvesColor, this.curveRect);

                this.drawCurveKeys(this.timeline);
                this.drawCurveKeys(this.timeline1);
            }

            this.drawSelectedKey();

            // 设置绘制结果
            this.curveImage.source = this.imageUtil.toDataURL();
        }

        private updateXYLabels()
        {
            this.yLabels[0].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[1].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.25, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[2].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.5, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[3].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.75, 1, 0, this.range[0], this.range[1])).toString();

            // for (let i = 0; i <= 10; i++)
            // {
            //     this.xLabels[i].text = (this.minMaxCurve.curveMultiplier * i / 10).toString();
            // }
        }

        private updateSampleImages()
        {
            var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
            var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;

            for (let i = 0; i < this.sampleImages.length; i++)
            {
                const element = this.sampleImages[i];
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve && curves[i])
                {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1) imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    imageUtil.drawCurve(curves[i], this.minMaxCurve.between0And1, feng3d.Color4.WHITE);

                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves && doubleCurves[i])
                {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1) imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    imageUtil.drawBetweenTwoCurves(doubleCurves[i], this.minMaxCurve.between0And1, feng3d.Color4.WHITE);

                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else
                {
                    element.parent && element.parent.removeChild(element);
                }
            }
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
                this.imageUtil.drawPoint(pos.x, pos.y, c, this.pointSize);
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
            return new feng3d.Vector2(x, y);
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

        private getKeyUIPos(key: feng3d.AnimationCurveKeyframe)
        {
            return this.curveToUIPos(key.time, key.value);
        }

        private getKeyLeftControlUIPos(key: feng3d.AnimationCurveKeyframe)
        {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var lcp = new feng3d.Vector2(current.x - this.controllerLength * Math.cos(Math.atan(currenttan)), current.y + this.controllerLength * Math.sin(Math.atan(currenttan)));
            return lcp;
        }

        private getKeyRightControlUIPos(key: feng3d.AnimationCurveKeyframe)
        {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var rcp = new feng3d.Vector2(current.x + this.controllerLength * Math.cos(Math.atan(currenttan)), current.y - this.controllerLength * Math.sin(Math.atan(currenttan)));
            return rcp;
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

            var current = this.getKeyUIPos(key);
            this.imageUtil.drawPoint(current.x, current.y, c, this.pointSize);

            if (this.selectedKey == key)
            {
                // 绘制控制点
                if (i > 0)
                {
                    var lcp = this.getKeyLeftControlUIPos(key);
                    this.imageUtil.drawPoint(lcp.x, lcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, lcp, new feng3d.Color4());
                }
                if (i < n - 1)
                {
                    var rcp = this.getKeyRightControlUIPos(key);
                    this.imageUtil.drawPoint(rcp.x, rcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, rcp, new feng3d.Color4());
                }
            }
        }

        private drawGrid(segmentW = 10, segmentH = 2)
        {
            //
            var lines: { start: feng3d.Vector2, end: feng3d.Vector2, color: feng3d.Color4 }[] = [];
            var c0 = feng3d.Color4.fromUnit24(0x494949);
            var c1 = feng3d.Color4.fromUnit24(0x4f4f4f);
            for (var i = 0; i <= segmentW; i++)
            {
                lines.push({ start: new feng3d.Vector2(i / segmentW, 0), end: new feng3d.Vector2(i / segmentW, 1), color: i % 2 == 0 ? c0 : c1 });
            }
            for (var i = 0; i <= segmentH; i++)
            {
                lines.push({ start: new feng3d.Vector2(0, i / segmentH), end: new feng3d.Vector2(1, i / segmentH), color: i % 2 == 0 ? c0 : c1 });
            }
            lines.forEach(v =>
            {
                v.start.x = this.curveRect.x + this.curveRect.width * v.start.x;
                v.start.y = this.curveRect.y + this.curveRect.height * v.start.y;
                v.end.x = this.curveRect.x + this.curveRect.width * v.end.x;
                v.end.y = this.curveRect.y + this.curveRect.height * v.end.y;
                //
                this.imageUtil.drawLine(v.start, v.end, v.color);
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
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            this.mousedownxy.x = x;
            this.mousedownxy.y = y;

            var curvePos = this.uiToCurvePos(x, y);

            var timeline = this.timeline;
            this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (this.editKey == null && this.timeline1 != null)
            {
                timeline = this.timeline1;
                this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            }
            if (this.editKey != null)
            {
                this.selectedKey = this.editKey;
                this.selectTimeline = timeline;
            } else if (this.selectedKey)
            {
                this.editorControlkey = this.findControlKey(this.selectedKey, x, y, this.pointSize);
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

            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            var curvePos = this.uiToCurvePos(x, y);

            if (this.editKey)
            {
                curvePos.time = feng3d.FMath.clamp(curvePos.time, 0, 1);
                curvePos.value = feng3d.FMath.clamp(curvePos.value, this.range[0], this.range[1]);

                //
                this.editKey.time = curvePos.time;
                this.editKey.value = curvePos.value;
                this.selectTimeline.sort();

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            } else if (this.editorControlkey)
            {
                var index = this.selectTimeline.indexOfKeys(this.editorControlkey);

                if (index == 0 && curvePos.time < this.editorControlkey.time)
                {
                    this.editorControlkey.tangent = curvePos.value > this.editorControlkey.value ? Infinity : -Infinity;
                    return;
                }
                if (index == this.selectTimeline.numKeys - 1 && curvePos.time > this.editorControlkey.time) 
                {
                    this.editorControlkey.tangent = curvePos.value > this.editorControlkey.value ? -Infinity : Infinity;
                    return;
                }
                this.editorControlkey.tangent = (curvePos.value - this.editorControlkey.value) / (curvePos.time - this.editorControlkey.time);

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
            var lcp = this.getKeyLeftControlUIPos(key);

            if (Math.abs(lcp.x - x) < radius && Math.abs(lcp.y - y) < radius)
            {
                return key;
            }

            var rcp = this.getKeyRightControlUIPos(key);
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

            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);

            var x = lp.x;
            var y = lp.y;

            var curvePos = this.uiToCurvePos(x, y);

            var selectedKey = this.timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (selectedKey != null)
            {
                this.timeline.deleteKey(selectedKey);

                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null)
            {
                var selectedKey = this.timeline1.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (selectedKey != null)
                {
                    this.timeline1.deleteKey(selectedKey);

                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
            // 没有选中关键与控制点时，检查是否点击到曲线
            var newKey = this.timeline.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
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
                var newKey = this.timeline1.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
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

    var particleCurves = [
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
    ];
    var particleCurvesSingend = [
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
    ];

    var particleDoubleCurves = [
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
    ];

    var particleDoubleCurvesSingend = [
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: -1, tangent: 0 }, { time: 1, value: -1, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
        Object.setValue(new feng3d.MinMaxCurveRandomBetweenTwoCurves(), {
            curveMin: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] },
            curveMax: { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] }
        }),
    ];
}