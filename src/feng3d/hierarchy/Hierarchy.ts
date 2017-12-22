namespace feng3d.editor
{
    export var hierarchy: Hierarchy;

    export class Hierarchy
    {
        constructor(rootGameObject: GameObject)
        {
            hierarchyTree.init(rootGameObject);

            //
            editorDispatcher.on("import", this.onImport, this);
            rootGameObject.on("added", this.ongameobjectadded, this);
            rootGameObject.on("removed", this.ongameobjectremoved, this);
        }

        private ongameobjectadded(event: Event<GameObject>)
        {
            hierarchyTree.add(event.data);
        }

        private ongameobjectremoved(event: Event<GameObject>)
        {
            hierarchyTree.remove(event.data);
        }

        resetScene(scene: GameObject)
        {
            scene.children.forEach(element =>
            {
            });
        }

        private onImport()
        {
            fs.selectFile((file) =>
            {
                var reader = new FileReader();
                reader.addEventListener('load', function (event)
                {
                    var content = event.target["result"];
                    var json = JSON.parse(content);
                    var scene = feng3d.serialization.deserialize(json);
                    hierarchy.resetScene(scene);
                });
                reader.readAsText(file[0]);
            }, { name: 'JSON', extensions: ['json'] });
        }

        addGameoObjectFromAsset(path: string, parent?: GameObject)
        {
            fs.readFile(path, (err, content) =>
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
}