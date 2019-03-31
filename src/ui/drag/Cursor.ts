namespace editor
{
    class Cursor
    {
        private o = new Map<any, "e-resize" | "n-resize">();

        add(id: any, value: "e-resize" | "n-resize")
        {
            this.o.set(id, value);
            this.update();
        }

        clear(id: any)
        {
            this.o.delete(id);
            this.update();
        }

        private update()
        {
            var v = this.o.getValues().reverse()[0];
            document.body.style.cursor = v || "auto";
        }
    }
    /**
     * 鼠标光标管理
     */
    export var cursor = new Cursor();
}