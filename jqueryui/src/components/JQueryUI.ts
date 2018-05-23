namespace ui
{
    export class Spinner extends Element
    {
        dom: HTMLInputElement;
        constructor()
        {
            super();
            var dom = document.createElement("input");
            this.dom = dom;
        }

        onAdded()
        {
            super.onAdded();
            $(this.dom).spinner();
        }
    }
}