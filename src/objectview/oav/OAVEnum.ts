namespace feng3d.editor
{
    @OAVComponent()
    export class OAVEnum extends OAVBase
    {
        public label: eui.Label;
        public combobox: ComboBox;

        private list: { label: string, value: number }[];

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "OAVEnum";
        }

        set enumClass(obj)
        {
            this.list = [];
            for (const key in obj)
            {
                if (obj.hasOwnProperty(key))
                {
                    if (isNaN(Number(key)))
                        this.list.push({ label: key, value: obj[key] });
                }
            }
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number): void
        {
            super.$onAddToStage(stage, nestLevel);

            this.updateView();

            this.combobox.addEventListener(egret.Event.CHANGE, this.onComboxChange, this);
        }

        $onRemoveFromStage(): void
        {
            super.$onRemoveFromStage();

            this.combobox.removeEventListener(egret.Event.CHANGE, this.onComboxChange, this);
        }

        updateView()
        {
            this.combobox.dataProvider = this.list;
            if (this.list)
            {
                this.combobox.data = this.list.reduce((prevalue, item) =>
                {
                    if (prevalue) return prevalue;
                    if (item.value == this.attributeValue)
                        return item;
                    return null;
                }, null);
            }
        }

        private onComboxChange()
        {
            this.attributeValue = this.combobox.data.value;
        }
    }
}