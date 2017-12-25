namespace feng3d.editor
{
    export var mainMenu: MenuItem[] = [
        {
            label: "新建项目", click: () =>
            {
                popupview.popup({ newprojectname: "newproject" }, (data) =>
                {
                    if (data.newprojectname && data.newprojectname.length > 0)
                    {
                        fs.createproject(data.newprojectname, () =>
                        {
                            editorcache.projectname = data.newprojectname;
                            window.location.reload();
                        });
                    }
                });
            }
        },
        {
            label: "保存场景", click: () =>
            {
                var gameobject: GameObject = hierarchyTree.rootnode.gameobject;
                assets.saveObject(gameobject, gameobject.name + ".scene", true);
            }
        },
        {
            label: "导出项目", click: () =>
            {
                fs.exportProject(function (err, content)
                {
                    // see FileSaver.js
                    saveAs(content, "example.zip");
                });
            }
        },
    ];

    /**
     * 层级界面创建3D对象列表数据
     */
    export var createObjectConfig: MenuItem[] = [
        //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
        {
            label: "GameObject", click: () =>
            {
                addToHierarchy(GameObjectFactory.createGameObject());
            }
        },
        {
            label: "Plane", click: () =>
            {
                addToHierarchy(GameObjectFactory.createPlane());
            }
        },
        {
            label: "Cube", click: () =>
            {
                addToHierarchy(GameObjectFactory.createCube());
            }
        },
        {
            label: "Sphere", click: () =>
            {
                addToHierarchy(GameObjectFactory.createSphere());
            }
        },
        {
            label: "Capsule", click: () =>
            {
                addToHierarchy(GameObjectFactory.createCapsule());
            }
        },
        {
            label: "Cylinder", click: () =>
            {
                addToHierarchy(GameObjectFactory.createCylinder());
            }
        },
        {
            label: "Cone", click: () =>
            {
                addToHierarchy(GameObjectFactory.createCone());
            }
        },
        {
            label: "Torus", click: () =>
            {
                addToHierarchy(GameObjectFactory.createTorus());
            }
        },
        {
            label: "Particle", click: () =>
            {
                addToHierarchy(GameObjectFactory.createParticle());
            }
        },
        {
            label: "Camera", click: () =>
            {
                addToHierarchy(GameObjectFactory.createCamera());
            }
        },
        {
            label: "PointLight", click: () =>
            {
                addToHierarchy(GameObjectFactory.createPointLight());
            }
        },
        {
            label: "DirectionalLight", click: () =>
            {
                var gameobject = GameObject.create("DirectionalLight");
                gameobject.addComponent(DirectionalLight);
                addToHierarchy(gameobject);
            }
        },
    ];

    function addToHierarchy(gameobject: GameObject)
    {
        var selectedNode = hierarchyTree.getSelectedNode();
        if (selectedNode)
            selectedNode.gameobject.addChild(gameobject);
        else
            hierarchyTree.rootnode.gameobject.addChild(gameobject);
        editorData.selectObject(gameobject);
    }

    export var needcreateComponentGameObject: GameObject;

    /**
     * 层级界面创建3D对象列表数据
     */
    export var createComponentConfig: MenuItem[] = [
        //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
        { label: "ParticleAnimator", click: () => { needcreateComponentGameObject.addComponent(ParticleAnimator); } },
        { label: "Camera", click: () => { needcreateComponentGameObject.addComponent(Camera); } },
        { label: "PointLight", click: () => { needcreateComponentGameObject.addComponent(PointLight); } },
        { label: "DirectionalLight", click: () => { needcreateComponentGameObject.addComponent(DirectionalLight); } },
        { label: "Script", click: () => { needcreateComponentGameObject.addComponent(Script); } },
        { label: "MouseRayTestScript", click: () => { needcreateComponentGameObject.addComponent(MouseRayTestScript); } },
        { label: "OutLineComponent", click: () => { needcreateComponentGameObject.addComponent(OutLineComponent); } },
        { label: "HoldSizeComponent", click: () => { needcreateComponentGameObject.addComponent(HoldSizeComponent); } },
        { label: "BillboardComponent", click: () => { needcreateComponentGameObject.addComponent(BillboardComponent); } },
        { label: "Animation", click: () => { needcreateComponentGameObject.addComponent(Animation); } },
        // { label: "LineComponent", click: () => { needcreateComponentGameObject.addComponent(LineComponent); } },
        { label: "CartoonComponent", click: () => { needcreateComponentGameObject.addComponent(CartoonComponent); } },
    ];
}