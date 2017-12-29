namespace feng3d.editor
{
    export class Hierarchy
    {
        get rootGameObject()
        {
            return this._rootGameObject;
        }
        set rootGameObject(value)
        {
            if (this._rootGameObject)
            {
                this._rootGameObject.off("added", this.ongameobjectadded, this);
                this._rootGameObject.off("removed", this.ongameobjectremoved, this);
            }
            this._rootGameObject = value;
            if (this._rootGameObject)
            {
                hierarchyTree.init(this._rootGameObject);
                this._rootGameObject.on("added", this.ongameobjectadded, this);
                this._rootGameObject.on("removed", this.ongameobjectremoved, this);
            }
        }
        private _rootGameObject: GameObject;

        constructor()
        {
        }

        private ongameobjectadded(event: Event<GameObject>)
        {
            hierarchyTree.add(event.data);
        }

        private ongameobjectremoved(event: Event<GameObject>)
        {
            hierarchyTree.remove(event.data);
        }

        addGameoObjectFromAsset(path: string, parent?: GameObject)
        {
            fs.readFileAsString(path, (err, content: string) =>
            {
                var json = JSON.parse(content);
                var gameobject = serialization.deserialize(json);
                gameobject.name = path.split("/").pop().split(".").shift();
                if (parent)
                    parent.addChild(gameobject);
                else
                    hierarchyTree.rootnode.gameobject.addChild(gameobject);
                editorData.selectObject(gameobject);
            });
        }
    }

    export var hierarchy = new Hierarchy();
}