module feng3d.editor
{
    export var hierarchy: Hierarchy;

    export class Hierarchy
    {
        constructor(rootObject3D: GameObject)
        {
            hierarchyTree.init(rootObject3D);

            //
            $editorEventDispatcher.on("saveScene", this.onSaveScene, this);
            $editorEventDispatcher.on("import", this.onImport, this);
            rootObject3D.on("added", this.ongameobjectadded, this);
            rootObject3D.on("removed", this.ongameobjectremoved, this);
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
                // this.addObject3D(element, null, true);
            });
        }

        private onImport()
        {
            file.selectFile((file) =>
            {
                var reader = new FileReader();
                reader.addEventListener('load', function (event)
                {
                    var content = event.target["result"];
                    var json = JSON.parse(content);
                    var scene = feng3d.serialization.deserialize(json);
                    hierarchy.resetScene(scene);
                });
                reader.readAsText(file);
            }, { name: 'JSON', extensions: ['json'] });
        }

        addGameoObjectFromAsset(path: string, parent?: GameObject)
        {
            file.readFile(path, (err, content) =>
            {
                var json = JSON.parse(content);
                var gameobject = serialization.deserialize(json);
                gameobject.name = path.split("/").pop().split(".").shift();
                if (parent)
                    parent.addChild(gameobject);
                else
                    hierarchyTree.rootnode.gameobject.addChild(gameobject);
                editor3DData.selectedObject = gameobject;
            });
        }

        private onSaveScene()
        {
            assets.saveGameObject(hierarchyTree.rootnode.gameobject);
        }
    }
}