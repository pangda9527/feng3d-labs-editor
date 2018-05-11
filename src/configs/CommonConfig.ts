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
                        editorcache.projectname = data.newprojectname;
                        window.location.reload();
                    }
                });
            }
        },
        {
            label: "打开项目",
            submenu: getProjectsMenu(),
            click: () =>
            {
                popupview.popup({ newprojectname: "newproject" }, (data) =>
                {
                    if (data.newprojectname && data.newprojectname.length > 0)
                    {
                        editorcache.projectname = data.newprojectname;
                        window.location.reload();
                    }
                });
            }
        },
        {
            label: "保存场景", click: () =>
            {
                var gameobject: GameObject = hierarchyTree.rootnode.gameobject;
                editorAssets.saveObject(gameobject, gameobject.name + ".scene", true);
            }
        },
        {
            label: "导入项目", click: () =>
            {
                fs.selectFile((filelist) =>
                {
                    fs.importProject(filelist.item(0), () =>
                    {
                        console.log("导入项目完成");
                        editorAssets.initproject(editorAssets.projectname, () =>
                        {
                            editorAssets.readScene("default.scene.json", (err, scene) =>
                            {
                                engine.scene = scene;
                                editorui.assetsview.updateShowFloder();
                                assetsDispather.dispatch("changed");
                                console.log("导入项目完成!");
                            });

                        });
                    });
                });
            }
        },
        {
            label: "导出项目", click: () =>
            {
                fs.exportProject(function (err, content)
                {
                    // see FileSaver.js
                    saveAs(content, `${editorAssets.projectname}.feng3d.zip`);
                });
            }
        },
        {
            label: "下载项目",
            submenu: [
                {
                    label: "地形", click: () =>
                    {
                        downloadProject("terrain.feng3d.zip");
                    },
                },
                {
                    label: "自定义材质", click: () =>
                    {
                        downloadProject("customshader.feng3d.zip");
                    },
                },
            ],
        },
        {
            label: "清空项目",
            click: () =>
            {
                editorAssets.deletefile(editorAssets.assetsPath, () =>
                {
                    editorAssets.initproject(editorAssets.projectname, () =>
                    {
                        editorAssets.readScene("default.scene.json", (err, scene) =>
                        {
                            engine.scene = scene;
                            editorui.assetsview.updateShowFloder();
                            assetsDispather.dispatch("changed");
                            console.log("导入项目完成!");
                        });
                    });
                }, true);
            },
        }
    ];

    /**
     * 层级界面创建3D对象列表数据
     */
    export var createObjectConfig: MenuItem[] = [
        //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
        {
            label: "游戏对象", click: () =>
            {
                addToHierarchy(GameObjectFactory.createGameObject());
            }
        },
        { type: "separator" },
        {
            label: "3D对象",
            submenu: [
                {
                    label: "平面", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createPlane());
                    }
                },
                {
                    label: "立方体", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createCube());
                    }
                },
                {
                    label: "球体", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createSphere());
                    }
                },
                {
                    label: "胶囊体", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createCapsule());
                    }
                },
                {
                    label: "圆柱体", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createCylinder());
                    }
                },
                {
                    label: "圆锥体", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createCone());
                    }
                },
                {
                    label: "圆环", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createTorus());
                    }
                },
                {
                    label: "地形", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createTerrain());
                    }
                },
            ],
        },
        {
            label: "光源",
            submenu: [
                {
                    label: "点光源", click: () =>
                    {
                        addToHierarchy(GameObjectFactory.createPointLight());
                    }
                },
                {
                    label: "方向光源", click: () =>
                    {
                        var gameobject = GameObject.create("DirectionalLight");
                        gameobject.addComponent(DirectionalLight);
                        addToHierarchy(gameobject);
                    }
                },
            ],
        },
        {
            label: "粒子系统", click: () =>
            {
                addToHierarchy(GameObjectFactory.createParticle());
            }
        },
        {
            label: "摄像机", click: () =>
            {
                addToHierarchy(GameObjectFactory.createCamera());
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
        {
            label: "Animator",
            submenu: [
                { label: "ParticleAnimator", click: () => { needcreateComponentGameObject.addComponent(ParticleAnimator); } },
                { label: "Animation", click: () => { needcreateComponentGameObject.addComponent(Animation); } },
            ]
        },
        {
            label: "Rendering",
            submenu: [
                { label: "Camera", click: () => { needcreateComponentGameObject.addComponent(Camera); } },
                { label: "PointLight", click: () => { needcreateComponentGameObject.addComponent(PointLight); } },
                { label: "DirectionalLight", click: () => { needcreateComponentGameObject.addComponent(DirectionalLight); } },
                { label: "OutLineComponent", click: () => { needcreateComponentGameObject.addComponent(OutLineComponent); } },
                { label: "CartoonComponent", click: () => { needcreateComponentGameObject.addComponent(CartoonComponent); } },
                // { label: "LineComponent", click: () => { needcreateComponentGameObject.addComponent(LineComponent); } },
            ]
        },
        {
            label: "Controller",
            submenu: [
                { label: "FPSController", click: () => { needcreateComponentGameObject.addComponent(FPSController); } },
            ]
        },
        {
            label: "Layout",
            submenu: [
                { label: "HoldSizeComponent", click: () => { needcreateComponentGameObject.addComponent(HoldSizeComponent); } },
                { label: "BillboardComponent", click: () => { needcreateComponentGameObject.addComponent(BillboardComponent); } },
            ]
        },
        {
            label: "Navigation",
            submenu: [
                { label: "Navigation", click: () => { needcreateComponentGameObject.addComponent(Navigation); } },
            ]
        },
        {
            label: "Script",
            submenu: [
                { label: "Script", click: () => { needcreateComponentGameObject.addComponent(ScriptComponent); } },
            ]
        },
    ];

    /**
     * 下载项目
     * @param projectname 
     */
    function downloadProject(projectname: string)
    {
        var path = "../project/" + projectname;
        Loader.loadBinary(path, (content) =>
        {
            fs.importProject(<any>content, () =>
            {
                editorAssets.initproject(editorAssets.projectname, () =>
                {
                    editorAssets.readScene("default.scene.json", (err, scene) =>
                    {
                        engine.scene = scene;
                        editorui.assetsview.updateShowFloder();
                        assetsDispather.dispatch("changed");
                        console.log("projectname 项目下载完成!");
                    });
                });
            });
        });
    }

    /**
     * 获取项目菜单
     */
    function getProjectsMenu()
    {
        var projects: MenuItem[] = [];

        fs.getProjectList((err, ps) =>
        {
            ps.forEach(element =>
            {
                projects.push(
                    {
                        label: element, click: () =>
                        {
                            editorcache.projectname = element;
                            window.location.reload();
                        }
                    });
            });
        });

        return projects;
    }
}