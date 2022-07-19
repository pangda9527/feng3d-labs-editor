declare namespace feng3d {
}
declare namespace feng3d {
    interface ComponentMap {
        Rigidbody: Rigidbody;
    }
    /**
     * 刚体
     */
    class Rigidbody extends feng3d.Behaviour {
        __class__: "physics.Rigidbody";
        body: CANNON.Body<CANNON.BodyEventMap>;
        runEnvironment: RunEnvironment;
        get mass(): number;
        set mass(v: number);
        init(): void;
        private _onTransformChanged;
        /**
         * 每帧执行
         */
        update(interval?: number): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Collider: Collider;
    }
    /**
     * 碰撞体
     */
    class Collider extends feng3d.Component {
        get shape(): CANNON.Shape;
        protected _shape: CANNON.Shape;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        BoxCollider: BoxCollider;
    }
    interface BoxCollider {
        get shape(): CANNON.Box;
    }
    /**
     * 长方体碰撞体
     */
    class BoxCollider extends Collider {
        /**
         * 宽度
         */
        width: number;
        /**
         * 高度
         */
        height: number;
        /**
         * 深度
         */
        depth: number;
        protected _shape: CANNON.Box;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SphereCollider: SphereCollider;
    }
    interface SphereCollider {
        get shape(): CANNON.Sphere;
    }
    /**
     * 球形碰撞体
     */
    class SphereCollider extends Collider {
        /**
         * 半径
         */
        get radius(): number;
        set radius(v: number);
        private _radius;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CylinderCollider: CylinderCollider;
    }
    interface CylinderCollider {
        get shape(): CANNON.Cylinder;
    }
    /**
     * 圆柱体碰撞体
     */
    class CylinderCollider extends Collider {
        /**
         * 顶部半径
         */
        topRadius: number;
        /**
         * 底部半径
         */
        bottomRadius: number;
        /**
         * 高度
         */
        height: number;
        /**
         * 横向分割数
         */
        segmentsW: number;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CapsuleCollider: CapsuleCollider;
    }
    interface CapsuleCollider {
        get shape(): CANNON.Trimesh;
    }
    /**
     * 胶囊体碰撞体
     */
    class CapsuleCollider extends Collider {
        /**
         * 胶囊体半径
         */
        get radius(): number;
        set radius(v: number);
        private _radius;
        /**
         * 胶囊体高度
         */
        get height(): number;
        set height(v: number);
        private _height;
        /**
         * 横向分割数
         */
        get segmentsW(): number;
        set segmentsW(v: number);
        private _segmentsW;
        /**
         * 纵向分割数
         */
        get segmentsH(): number;
        set segmentsH(v: number);
        private _segmentsH;
        /**
         * 正面朝向 true:Y+ false:Z+
         */
        get yUp(): boolean;
        set yUp(v: boolean);
        private _yUp;
        init(): void;
        private invalidateGeometry;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        PlaneCollider: PlaneCollider;
    }
    interface PlaneCollider {
        get shape(): CANNON.Plane;
    }
    /**
     * 平面碰撞体
     */
    class PlaneCollider extends Collider {
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        PhysicsWorld: PhysicsWorld;
    }
    /**
     * 物理世界组件
     */
    class PhysicsWorld extends feng3d.Behaviour {
        runEnvironment: RunEnvironment;
        /**
         * 物理世界
         */
        world: CANNON.World<CANNON.WorldEventMap>;
        /**
         * 重力加速度
         */
        gravity: Vector3;
        init(): void;
        private _isInit;
        private initWorld;
        private onAddComponent;
        private onRemovedComponent;
        private onAddChild;
        private onRemoveChild;
        update(interval?: number): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Cloth: Cloth;
    }
    class Cloth extends feng3d.Renderable {
        runEnvironment: RunEnvironment;
        particles: CANNON.Body[][];
        constraints: CANNON.DistanceConstraint[];
        init(): void;
        update(): void;
    }
}
declare namespace feng3d {
}
declare namespace feng3d {
    interface PrimitiveGameObject {
        Cloth: GameObject;
    }
}
declare namespace feng3d {
}
//# sourceMappingURL=index.d.ts.map