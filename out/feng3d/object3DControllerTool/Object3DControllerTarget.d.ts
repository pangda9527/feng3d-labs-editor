declare namespace feng3d.editor {
    class Object3DControllerTarget {
        private static _instance;
        static readonly instance: Object3DControllerTarget;
        private _controllerTargets;
        private _startScaleVec;
        private _isWoldCoordinate;
        private _isBaryCenter;
        private _showObject3D;
        private _controllerToolTransfrom;
        private _controllerTool;
        private _startTransformDic;
        showObject3D: Transform;
        controllerTool: Transform;
        controllerTargets: Transform[];
        private constructor();
        private onShowObjectTransformChanged(event);
        private updateControllerImage();
        /**
         * 开始移动
         */
        startTranslation(): void;
        translation(addPos: Vector3D): void;
        stopTranslation(): void;
        startRotate(): void;
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: Vector3D): void;
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1: number, normal1: Vector3D, angle2: number, normal2: Vector3D): void;
        stopRote(): void;
        startScale(): void;
        doScale(scale: Vector3D): void;
        stopScale(): void;
    }
}
