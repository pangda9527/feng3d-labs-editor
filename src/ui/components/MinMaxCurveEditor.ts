import { watch, MinMaxCurve, AnimationCurve, Rectangle, AnimationCurveKeyframe, Color4, ImageUtil, watcher, MinMaxCurveMode, mathUtil, Vector2, serialization, WrapMode, gPartial } from 'feng3d';
import { editorui } from '../../global/editorui';
import { NumberTextInputBinder } from './binders/NumberTextInputBinder';
import { menu } from './Menu';

export class MinMaxCurveEditor extends eui.Component
{
    static minMaxCurveEditor: MinMaxCurveEditor;

    @watch("_onMinMaxCurveChanged")
    minMaxCurve = new MinMaxCurve();

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
    public preWrapModeBtn: eui.Button;
    public postWrapModeBtn: eui.Button;
    public keyPosLab: eui.Label;


    //
    private timeline: AnimationCurve;
    private timeline1: AnimationCurve;
    private curveRect: Rectangle;
    private canvasRect: Rectangle;

    private editKey: AnimationCurveKeyframe;
    private editorControlkey: AnimationCurveKeyframe;
    private editing = false;
    private mousedownxy = { x: -1, y: -1 }
    private selectedKey: AnimationCurveKeyframe;
    private selectTimeline: AnimationCurve;

    private curveColor = new Color4(1, 0, 0);
    private backColor = Color4.fromUnit24(0x565656);
    private fillTwoCurvesColor = new Color4(1, 1, 1, 0.2);
    private range = [1, -1];

    private imageUtil = new ImageUtil();

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

        this.sampleImages = [this.sample_0, this.sample_1, this.sample_2, this.sample_3, this.sample_4, this.sample_5, this.sample_6, this.sample_7];

        this.viewGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        editorui.stage.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondblclick, this);

        this.sampleImages.forEach(v => v.addEventListener(egret.MouseEvent.CLICK, this.onSampleClick, this));

        this.addEventListener(egret.Event.RESIZE, this._onReSize, this);

        this.addBinder(new NumberTextInputBinder().init({
            space: this.minMaxCurve, attribute: "curveMultiplier", textInput: this.multiplierInput, editable: true,
            controller: null,
        }));

        this.preWrapModeBtn.addEventListener(egret.MouseEvent.CLICK, this.onPreWrapModeBtn, this);
        this.postWrapModeBtn.addEventListener(egret.MouseEvent.CLICK, this.onPostWrapMode, this);

        watcher.watch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);

        this.updateXYLabels();
        this.updateSampleImages();
        this.updateView();
    }

    $onRemoveFromStage()
    {
        this.sampleImages.forEach(v => v.removeEventListener(egret.MouseEvent.CLICK, this.onSampleClick, this));

        this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);

        this.viewGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        editorui.stage.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondblclick, this);

        // windowEventProxy.off("dblclick", this.ondblclick, this);

        this.preWrapModeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPreWrapModeBtn, this);
        this.postWrapModeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPostWrapMode, this);

        watcher.unwatch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);

        super.$onRemoveFromStage()
    }

    updateView()
    {
        if (!this.stage) return;

        // 曲线绘制区域
        this.curveRect = new Rectangle(this.curveGroup.x, this.curveGroup.y, this.curveGroup.width, this.curveGroup.height);
        this.canvasRect = new Rectangle(0, 0, this.viewGroup.width, this.viewGroup.height);

        if (this.curveGroup.width < 10 || this.curveGroup.height < 10) return;

        this.imageUtil.init(this.canvasRect.width, this.canvasRect.height, this.backColor);
        this.drawGrid();

        this.timeline = this.minMaxCurve.curve;
        this.timeline1 = this.minMaxCurve.curveMax;

        if (this.minMaxCurve.mode == MinMaxCurveMode.Curve)
        {
            this.imageUtil.drawCurve(this.timeline, this.minMaxCurve.between0And1, this.curveColor, this.curveRect);

            this.drawCurveKeys(this.timeline);
        } else if (this.minMaxCurve.mode == MinMaxCurveMode.TwoCurves)
        {
            this.imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curveMax, this.minMaxCurve.between0And1, this.curveColor, this.fillTwoCurvesColor, this.curveRect);

            this.drawCurveKeys(this.timeline);
            this.drawCurveKeys(this.timeline1);
        }

        this.drawSelectedKey();
        this.updateWrapModeBtnPosition();

        // 设置绘制结果
        this.curveImage.source = this.imageUtil.toDataURL();
    }

    private updateXYLabels()
    {
        this.yLabels[0].text = (this.minMaxCurve.curveMultiplier * mathUtil.mapLinear(0, 1, 0, this.range[0], this.range[1])).toString();
        this.yLabels[1].text = (this.minMaxCurve.curveMultiplier * mathUtil.mapLinear(0.25, 1, 0, this.range[0], this.range[1])).toString();
        this.yLabels[2].text = (this.minMaxCurve.curveMultiplier * mathUtil.mapLinear(0.5, 1, 0, this.range[0], this.range[1])).toString();
        this.yLabels[3].text = (this.minMaxCurve.curveMultiplier * mathUtil.mapLinear(0.75, 1, 0, this.range[0], this.range[1])).toString();

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
            if (this.minMaxCurve.mode == MinMaxCurveMode.Curve && curves[i])
            {
                var imageUtil = new ImageUtil(element.width, element.height, this.backColor);
                if (!this.minMaxCurve.between0And1) imageUtil.drawLine(new Vector2(0, element.height / 2), new Vector2(element.width, element.height / 2), Color4.BLACK);
                var curve = serialization.setValue(new AnimationCurve(), curves[i]);
                imageUtil.drawCurve(curve, this.minMaxCurve.between0And1, Color4.WHITE);

                element.source = imageUtil.toDataURL();
                this.samplesGroup.addChild(element);
            } else if (this.minMaxCurve.mode == MinMaxCurveMode.TwoCurves && doubleCurves[i])
            {
                var imageUtil = new ImageUtil(element.width, element.height, this.backColor);
                if (!this.minMaxCurve.between0And1) imageUtil.drawLine(new Vector2(0, element.height / 2), new Vector2(element.width, element.height / 2), Color4.BLACK);

                var curveMin = serialization.setValue(new AnimationCurve(), doubleCurves[i].curve);
                var curveMax = serialization.setValue(new AnimationCurve(), doubleCurves[i].curveMax);

                imageUtil.drawBetweenTwoCurves(curveMin, curveMax, this.minMaxCurve.between0And1, Color4.WHITE);

                element.source = imageUtil.toDataURL();
                this.samplesGroup.addChild(element);
            }
            else
            {
                element.parent && element.parent.removeChild(element);
            }
        }
    }

    private onSampleClick(e: egret.MouseEvent)
    {
        for (let i = 0; i < this.sampleImages.length; i++)
        {
            const element = this.sampleImages[i];
            if (element == e.currentTarget)
            {
                var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
                var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
                if (this.minMaxCurve.mode == MinMaxCurveMode.Curve)
                {
                    this.minMaxCurve.curve = serialization.setValue(new AnimationCurve(), curves[i]);
                } else if (this.minMaxCurve.mode == MinMaxCurveMode.TwoCurves)
                {
                    this.minMaxCurve.curve = serialization.setValue(new AnimationCurve(), doubleCurves[i].curve);
                    this.minMaxCurve.curveMax = serialization.setValue(new AnimationCurve(), doubleCurves[i].curveMax);
                }
                this.selectedKey = null;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                break;
            }
        }
    }

    /**
     * 绘制曲线关键点
     * @param animationCurve 
     */
    private drawCurveKeys(animationCurve: AnimationCurve)
    {
        var c = new Color4(1, 0, 0);
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
        var x = mathUtil.mapLinear(time, 0, 1, this.curveRect.left, this.curveRect.right);
        var y = mathUtil.mapLinear(value, this.range[0], this.range[1], this.curveRect.top, this.curveRect.bottom);
        return new Vector2(x, y);
    }

    /**
     * UI上坐标转换为曲线上坐标
     * @param x 
     * @param y 
     */
    private uiToCurvePos(x: number, y: number)
    {
        var time = mathUtil.mapLinear(x, this.curveRect.left, this.curveRect.right, 0, 1);
        var value = mathUtil.mapLinear(y, this.curveRect.top, this.curveRect.bottom, this.range[0], this.range[1]);
        return { time: time, value: value };
    }

    private getKeyUIPos(key: AnimationCurveKeyframe)
    {
        return this.curveToUIPos(key.time, key.value);
    }

    private getKeyLeftControlUIPos(key: AnimationCurveKeyframe)
    {
        var current = this.curveToUIPos(key.time, key.value);
        var currenttan = key.inTangent * this.curveRect.height / this.curveRect.width;
        var lcp = new Vector2(current.x - this.controllerLength * Math.cos(Math.atan(currenttan)), current.y + this.controllerLength * Math.sin(Math.atan(currenttan)));
        return lcp;
    }

    private getKeyRightControlUIPos(key: AnimationCurveKeyframe)
    {
        var current = this.curveToUIPos(key.time, key.value);
        var currenttan = key.outTangent * this.curveRect.height / this.curveRect.width;
        var rcp = new Vector2(current.x + this.controllerLength * Math.cos(Math.atan(currenttan)), current.y - this.controllerLength * Math.sin(Math.atan(currenttan)));
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
        var c = new Color4();

        var current = this.getKeyUIPos(key);
        this.imageUtil.drawPoint(current.x, current.y, c, this.pointSize);

        if (this.selectedKey == key)
        {
            // 绘制控制点
            if (i > 0)
            {
                var lcp = this.getKeyLeftControlUIPos(key);
                this.imageUtil.drawPoint(lcp.x, lcp.y, c, this.pointSize);
                this.imageUtil.drawLine(current, lcp, new Color4());
            }
            if (i < n - 1)
            {
                var rcp = this.getKeyRightControlUIPos(key);
                this.imageUtil.drawPoint(rcp.x, rcp.y, c, this.pointSize);
                this.imageUtil.drawLine(current, rcp, new Color4());
            }
        }
    }

    /**
     * 更新曲线重复模式按钮位置
     */
    private updateWrapModeBtnPosition()
    {
        var selectTimeline = this.selectTimeline;

        this.preWrapModeBtn.visible = false;
        this.postWrapModeBtn.visible = false;

        if (!selectTimeline) return;

        this.preWrapModeBtn.visible = true;
        this.postWrapModeBtn.visible = true;

        var firstKey = selectTimeline.keys[0];
        var prePos = this.curveToUIPos(firstKey.time, firstKey.value);
        this.preWrapModeBtn.x = prePos.x - this.preWrapModeBtn.width - 10;
        this.preWrapModeBtn.y = prePos.y;

        var lastKey = selectTimeline.keys[selectTimeline.keys.length - 1];/*  */
        var postPos = this.curveToUIPos(lastKey.time, lastKey.value);
        this.postWrapModeBtn.x = postPos.x + 15;
        this.postWrapModeBtn.y = postPos.y;

        if (this.editKey)
        {
            var editKeyPos = this.curveToUIPos(this.editKey.time, this.editKey.value);
            this.keyPosLab.x = editKeyPos.x;
            this.keyPosLab.y = editKeyPos.y - this.keyPosLab.height - 5;

            this.keyPosLab.text = this.editKey.time.toFixed(3) + "," + this.editKey.value.toFixed(3);
        }
    }

    private drawGrid(segmentW = 10, segmentH = 2)
    {
        //
        var lines: { start: Vector2, end: Vector2, color: Color4 }[] = [];
        var c0 = Color4.fromUnit24(0x494949);
        var c1 = Color4.fromUnit24(0x4f4f4f);
        for (var i = 0; i <= segmentW; i++)
        {
            lines.push({ start: new Vector2(i / segmentW, 0), end: new Vector2(i / segmentW, 1), color: i % 2 == 0 ? c0 : c1 });
        }
        for (var i = 0; i <= segmentH; i++)
        {
            lines.push({ start: new Vector2(0, i / segmentH), end: new Vector2(1, i / segmentH), color: i % 2 == 0 ? c0 : c1 });
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

    private onMouseDown(ev: egret.MouseEvent)
    {
        var lp = this.viewGroup.globalToLocal(ev.stageX, ev.stageY);

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
            this.keyPosLab.visible = true;
            editorui.stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            editorui.stage.addEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
        }

        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    }

    private onMouseMove(ev: egret.MouseEvent)
    {
        this.editing = true;

        var lp = this.viewGroup.globalToLocal(ev.stageX, ev.stageY);

        var x = lp.x;
        var y = lp.y;

        var curvePos = this.uiToCurvePos(x, y);

        if (this.editKey)
        {
            curvePos.time = mathUtil.clamp(curvePos.time, 0, 1);
            curvePos.value = mathUtil.clamp(curvePos.value, this.range[0], this.range[1]);

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
                this.editorControlkey.inTangent = curvePos.value > this.editorControlkey.value ? Infinity : -Infinity;
                return;
            }
            if (index == this.selectTimeline.numKeys - 1 && curvePos.time > this.editorControlkey.time) 
            {
                this.editorControlkey.outTangent = curvePos.value > this.editorControlkey.value ? -Infinity : Infinity;
                return;
            }
            this.editorControlkey.inTangent = this.editorControlkey.outTangent = (curvePos.value - this.editorControlkey.value) / (curvePos.time - this.editorControlkey.time);

            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    }

    private onMouseUp(ev: MouseEvent)
    {
        this.editing = false;
        this.editorControlkey = null;
        this.keyPosLab.visible = false;

        editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
        editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
    }

    private findControlKey(key: AnimationCurveKeyframe, x: number, y: number, radius: number)
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

    private ondblclick(ev: egret.MouseEvent)
    {
        this.editing = false;
        this.editKey = null;
        this.editorControlkey = null;

        var lp = this.viewGroup.globalToLocal(ev.stageX, ev.stageY);

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

    private onPreWrapModeBtn(e: egret.TouchEvent)
    {
        e.stopPropagation();

        var selectTimeline = this.selectTimeline;
        if (!selectTimeline) return;
        menu.popupEnum(WrapMode, selectTimeline.preWrapMode, (v) =>
        {
            selectTimeline.preWrapMode = v;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        });
    }

    private onPostWrapMode(e: egret.TouchEvent)
    {
        e.stopPropagation();

        var selectTimeline = this.selectTimeline;
        if (!selectTimeline) return;
        menu.popupEnum(WrapMode, selectTimeline.postWrapMode, (v) =>
        {
            selectTimeline.postWrapMode = v;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        });
    }
}

var particleCurves: gPartial<AnimationCurve>[] = [
    { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
    { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
    { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
    { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
    { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
    { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
];
var particleCurvesSingend: gPartial<AnimationCurve>[] = [
    { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
    { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
    { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
    { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
    { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
    { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
];

var particleDoubleCurves: gPartial<MinMaxCurve>[] = [{
    curveMin: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
{
    curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
    curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
},
];

var particleDoubleCurvesSingend: gPartial<MinMaxCurve>[] = [
    {
        curve: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        curveMax: { keys: [{ time: 0, value: -1, inTangent: 0, outTangent: 0 }, { time: 1, value: -1, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 0, inTangent: 1, outTangent: 1 }, { time: 1, value: 1, inTangent: 1, outTangent: 1 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1 }, { time: 1, value: 0, inTangent: -1, outTangent: -1 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 1, inTangent: -2, outTangent: -2 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 0, inTangent: 2, outTangent: 2 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 1, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: -2, outTangent: -2 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
    {
        curve: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 1, inTangent: 0, outTangent: 0 }] },
        curveMax: { keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0 }, { time: 1, value: 0, inTangent: 0, outTangent: 0 }] }
    },
];
