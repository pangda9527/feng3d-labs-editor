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

        private ongameobjectadded(event: EventVO<GameObject>)
        {
            hierarchyTree.add(event.data);
        }

        private ongameobjectremoved(event: EventVO<GameObject>)
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
            electron.call("selected-file", {
                callback: (paths) =>
                {
                    loadjs.load({
                        paths: paths, onitemload: (url, content) =>
                        {
                            var json = JSON.parse(content);
                            var scene = feng3d.serialization.deserialize(json);
                            hierarchy.resetScene(scene);
                        }
                    });
                }, param: { name: 'JSON', extensions: ['json'] }
            });
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