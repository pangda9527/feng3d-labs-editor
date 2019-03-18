export declare var mrsToolTarget: MRSToolTarget;
export declare class MRSToolTarget {
    private _controllerTargets;
    private _startScaleVec;
    private _controllerTool;
    private _startTransformDic;
    private _position;
    private _rotation;
    controllerTool: feng3d.Transform;
    controllerTargets: feng3d.Transform[];
    constructor();
    private onSelectedGameObjectChange;
    private updateControllerImage;
    /**
     * 开始移动
     */
    startTranslation(): void;
    translation(addPos: feng3d.Vector3): void;
    stopTranslation(): void;
    startRotate(): void;
    /**
     * 绕指定轴旋转
     * @param angle 旋转角度
     * @param normal 旋转轴
     */
    rotate1(angle: number, normal: feng3d.Vector3): void;
    /**
     * 按指定角旋转
     * @param angle1 第一方向旋转角度
     * @param normal1 第一方向旋转轴
     * @param angle2 第二方向旋转角度
     * @param normal2 第二方向旋转轴
     */
    rotate2(angle1: number, normal1: feng3d.Vector3, angle2: number, normal2: feng3d.Vector3): void;
    stopRote(): void;
    startScale(): void;
    doScale(scale: feng3d.Vector3): void;
    stopScale(): void;
    private getTransformData;
    private rotateRotation;
}
//# sourceMappingURL=MRSToolTarget.d.ts.map