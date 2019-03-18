"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EditorData_1 = require("../global/EditorData");
/**
 * 粒子特效控制器
 */
var ParticleEffectController = /** @class */ (function (_super) {
    __extends(ParticleEffectController, _super);
    function ParticleEffectController() {
        var _this = _super.call(this) || this;
        _this.particleSystems = [];
        _this.skinName = "ParticleEffectController";
        return _this;
    }
    ParticleEffectController.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.initView();
        this.updateView();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.pauseBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        this.stopBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
    };
    ParticleEffectController.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.pauseBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        this.stopBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
    };
    ParticleEffectController.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.stopBtn:
                this.particleSystems.forEach(function (v) { return v.stop(); });
                break;
            case this.pauseBtn:
                if (this.isParticlePlaying)
                    this.particleSystems.forEach(function (v) { return v.pause(); });
                else
                    this.particleSystems.forEach(function (v) { return v.continue(); });
                break;
        }
        this.updateView();
    };
    ParticleEffectController.prototype.onEnterFrame = function () {
        var v = this.particleSystems;
        if (v) {
            var playbackSpeed = (this.particleSystems[0] && this.particleSystems[0].main.simulationSpeed) || 1;
            var playbackTime = (this.particleSystems[0] && this.particleSystems[0].time) || 0;
            var particles = this.particleSystems.reduce(function (pv, cv) { pv += cv.numActiveParticles; return pv; }, 0);
            //
            this.speedInput.text = playbackSpeed.toString();
            this.timeInput.text = playbackTime.toFixed(3);
            this.particlesInput.text = particles.toString();
        }
    };
    ParticleEffectController.prototype.initView = function () {
        var _this = this;
        if (this.saveParent)
            return;
        this.saveParent = this.parent;
        feng3d.ticker.nextframe(function () {
            _this.parent.removeChild(_this);
        });
        feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
    };
    ParticleEffectController.prototype.updateView = function () {
        if (!this.particleSystems)
            return;
        this.pauseBtn.label = this.isParticlePlaying ? "Pause" : "Continue";
    };
    Object.defineProperty(ParticleEffectController.prototype, "isParticlePlaying", {
        get: function () {
            return this.particleSystems.reduce(function (pv, cv) { return pv || cv.isPlaying; }, false);
        },
        enumerable: true,
        configurable: true
    });
    ParticleEffectController.prototype.onDataChange = function () {
        var _this = this;
        var particleSystems = EditorData_1.editorData.selectedGameObjects.reduce(function (pv, cv) { var ps = cv.getComponent(feng3d.ParticleSystem); ps && (pv.push(ps)); return pv; }, []);
        this.particleSystems.forEach(function (v) {
            v.pause();
            v.off("particleCompleted", _this.updateView, _this);
        });
        this.particleSystems = particleSystems;
        this.particleSystems.forEach(function (v) {
            v.continue();
            v.on("particleCompleted", _this.updateView, _this);
        });
        if (this.particleSystems.length > 0)
            this.saveParent.addChild(this);
        else
            this.parent && this.parent.removeChild(this);
    };
    return ParticleEffectController;
}(eui.Component));
exports.ParticleEffectController = ParticleEffectController;
//# sourceMappingURL=ParticleEffectController.js.map