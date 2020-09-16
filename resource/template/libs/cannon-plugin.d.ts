declare namespace CANNON {
}
declare namespace feng3d {
    interface ComponentMap {
        Rigidbody: CANNON.Rigidbody;
    }
}
declare namespace CANNON {
    /**
     * 刚体
     */
    class Rigidbody extends feng3d.Behaviour {
        __class__: "physics.Rigidbody";
        body: Body;
        runEnvironment: feng3d.RunEnvironment;
        get mass(): number;
        set mass(v: number);
        init(): void;
        /**
         * 每帧执行
         */
        update(interval?: number): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Collider: CANNON.Collider;
    }
}
declare namespace CANNON {
    /**
     * 碰撞体
     */
    class Collider extends feng3d.Component {
        get shape(): Shape;
        protected _shape: Shape;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        BoxCollider: CANNON.BoxCollider;
    }
}
declare namespace CANNON {
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
        readonly shape: Box;
        protected _shape: Box;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SphereCollider: CANNON.SphereCollider;
    }
}
declare namespace CANNON {
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
        readonly shape: Sphere;
        protected _shape: Sphere;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CylinderCollider: CANNON.CylinderCollider;
    }
}
declare namespace CANNON {
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
        readonly shape: Cylinder;
        protected _shape: Cylinder;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CapsuleCollider: CANNON.CapsuleCollider;
    }
}
declare namespace CANNON {
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
        readonly shape: Trimesh;
        protected _shape: Trimesh;
        init(): void;
        private invalidateGeometry;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        PlaneCollider: CANNON.PlaneCollider;
    }
}
declare namespace CANNON {
    /**
     * 平面碰撞体
     */
    class PlaneCollider extends Collider {
        readonly shape: Plane;
        protected _shape: Plane;
        init(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        PhysicsWorld: CANNON.PhysicsWorld;
    }
}
declare namespace CANNON {
    /**
     * 物理世界组件
     */
    class PhysicsWorld extends feng3d.Behaviour {
        runEnvironment: feng3d.RunEnvironment;
        /**
         * 物理世界
         */
        world: World;
        /**
         * 重力加速度
         */
        gravity: feng3d.Vector3;
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
        Cloth: CANNON.Cloth;
    }
}
declare namespace CANNON {
    class Cloth extends feng3d.Renderable {
        runEnvironment: feng3d.RunEnvironment;
        particles: Body[][];
        constraints: DistanceConstraint[];
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
//# sourceMappingURL=cannon-plugin.d.ts.map