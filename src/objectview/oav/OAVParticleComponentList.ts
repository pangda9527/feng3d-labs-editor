namespace editor
{
    @feng3d.OAVComponent()
    export class OAVParticleComponentList extends OAVBase
    {
        protected _space: feng3d.ParticleSystem;

        //
        group: eui.Group;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVParticleComponentList";
        }

        get space()
        {
            return this._space;
        }

        set space(value)
        {
            this._space = value;
            this.dispose();
            this.initView();
        }

        get attributeName(): string
        {
            return this._attributeName;
        }

        get attributeValue(): Object
        {
            return this._space[this._attributeName];
        }

        set attributeValue(value: Object)
        {
            if (this._space[this._attributeName] != value)
            {
                this._space[this._attributeName] = value;
            }
            this.updateView();
        }

        initView(): void
        {
            (<eui.VerticalLayout>this.group.layout).gap = -1;

            var components = <any>this.attributeValue;
            for (var i = 0; i < components.length; i++)
            {
                this.addComponentView(components[i]);
            }
        }

        dispose()
        {
            var components = <any>this.attributeValue;
            for (var i = 0; i < components.length; i++)
            {
                this.removedComponentView(components[i]);
            }
        }

		/**
		 * 更新界面
		 */
        updateView(): void
        {
            for (var i = 0, n = this.group.numChildren; i < n; i++)
            {
                var child = this.group.getChildAt(i)
                if (child instanceof ParticleComponentView)
                    child.updateView();
            }
        }

        private addComponentView(component: feng3d.ParticleModule)
        {
            var o: Object;
            var displayObject = new ParticleComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        }

        private removedComponentView(component: feng3d.ParticleModule)
        {
            for (var i = this.group.numChildren - 1; i >= 0; i--)
            {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof ParticleComponentView && displayObject.component == component)
                {
                    this.group.removeChild(displayObject);
                }
            }
        }
    }
}