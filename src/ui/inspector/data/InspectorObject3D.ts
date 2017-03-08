module feng3d.editor
{
    export class InspectorObject3D
    {
        // public readonly viewdata = new Object3DViewData();

        public name: string;
        public visible: boolean;
        public mouseEnabled: boolean;
        public inspectorObject3DComponent: InspectorObject3DComponent = new InspectorObject3DComponent();

        public setObject3D(object3D: Object3D)
        {
            this.name = object3D.name;
            this.visible = object3D.visible;
            this.mouseEnabled = object3D.mouseEnabled;
            //
            this.inspectorObject3DComponent.components.length = 0;
            var components = object3D.getComponents();
            for (var i = 0; i < components.length; i++)
            {
                var component = components[i];
                var componentName = ClassUtils.getQualifiedClassName(component).split(".").pop();
                this.inspectorObject3DComponent.components.push({ name: componentName, data: this.getComponentViewData(component) });
            }
        }

        private getComponentViewData(component: Object)
        {
            if (component instanceof Transform)
            {
                var transformViewBind = new TransformViewBind();
                transformViewBind.transform = component;
                component = transformViewBind.viewdata;
            }
            return component;
        }
    }

    export class InspectorObject3DComponent
    {
        public components: { name: string, data: Object }[] = [];
    }

    export class TransformViewBind
    {
        public readonly viewdata = new TransformViewData();
        private _transform: Transform;
        private _mark = false;

        constructor()
        {
            var viewdata = this.viewdata;
            Watcher.watch(viewdata.position, ["x"], this.fromviewdata, this);
            Watcher.watch(viewdata.position, ["y"], this.fromviewdata, this);
            Watcher.watch(viewdata.position, ["z"], this.fromviewdata, this);
            Watcher.watch(viewdata.rotation, ["x"], this.fromviewdata, this);
            Watcher.watch(viewdata.rotation, ["y"], this.fromviewdata, this);
            Watcher.watch(viewdata.rotation, ["z"], this.fromviewdata, this);
            Watcher.watch(viewdata.scale, ["x"], this.fromviewdata, this);
            Watcher.watch(viewdata.scale, ["y"], this.fromviewdata, this);
            Watcher.watch(viewdata.scale, ["z"], this.fromviewdata, this);
        }

        public get transform()
        {
            return this._transform;
        }

        public set transform(value)
        {
            if (this._transform != null)
            {
                this._transform.removeEventListener(TransformEvent.TRANSFORM_CHANGED, this.toviewdata, this);
            }
            this._transform = value;
            if (this._transform != null)
            {
                this.toviewdata();
                this._transform.addEventListener(TransformEvent.TRANSFORM_CHANGED, this.toviewdata, this);
            }
        }

        private toviewdata()
        {
            if (this._mark)
                return;
            this._mark = true;
            var viewdata = this.viewdata;
            var transform = this._transform;
            //
            viewdata.position.setTo(transform.x, transform.y, transform.z);
            viewdata.rotation.setTo(transform.rx, transform.ry, transform.rz);
            viewdata.scale.setTo(transform.sx, transform.sy, transform.sz);

            this._mark = false;
        }

        private fromviewdata()
        {
            if (this._mark)
                return;
            this._mark = true;
            var viewdata = this.viewdata;
            var transform = this._transform;
            //
            if (transform)
            {
                transform.x = viewdata.position.x;
                transform.y = viewdata.position.y;
                transform.z = viewdata.position.z;
                transform.rx = viewdata.rotation.x;
                transform.ry = viewdata.rotation.y;
                transform.rz = viewdata.rotation.z;
                transform.sx = viewdata.scale.x;
                transform.sy = viewdata.scale.y;
                transform.sz = viewdata.scale.z;
            }

            this._mark = false;
        }
    }

    export class Object3DViewData
    {
        public name: string;
        public visible: boolean;
    }

    export class TransformViewData
    {
        public position = new Vector3D();
        public rotation = new Vector3D();
        public scale = new Vector3D(1, 1, 1);
    }
}