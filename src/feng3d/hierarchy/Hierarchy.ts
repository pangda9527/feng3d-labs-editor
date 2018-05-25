namespace editor
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
        private _rootGameObject: feng3d.GameObject;

        constructor()
        {
        }

        private ongameobjectadded(event: feng3d.Event<feng3d.GameObject>)
        {
            hierarchyTree.add(event.data);
        }

        private ongameobjectremoved(event: feng3d.Event<feng3d.GameObject>)
        {
            hierarchyTree.remove(event.data);
        }

        addGameoObjectFromAsset(path: string, parent?: feng3d.GameObject)
        {
            fs.readFileAsString(path, (err, content: string) =>
            {
                var json = JSON.parse(content);
                var gameobject = feng3d.serialization.deserialize(json);
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