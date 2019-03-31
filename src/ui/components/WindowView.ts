namespace editor
{
    export class WindowView extends eui.Panel
    {
        public moveArea: eui.Group;
        public titleDisplay: eui.Label;
        public closeButton: eui.Button;
        public contenGroup: eui.Group;

        constructor()
        {
            super();
            this.skinName = "WindowView";
        }
    }
}