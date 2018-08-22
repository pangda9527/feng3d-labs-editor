namespace editor
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
                var gameobject = hierarchyTree.rootnode.gameobject;
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
                        editorAssets.initproject(() =>
                        {
                            editorAssets.runProjectScript(() =>
                            {
                                editorAssets.readScene("default.scene.json", (err, scene) =>
                                {
                                    engine.scene = scene;
                                    editorui.assetsview.invalidateAssetstree();
                                    console.log("导入项目完成!");
                                });
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
                    saveAs(content, `${editorcache.projectname}.feng3d.zip`);
                });
            }
        },
        {
            label: "打开网络项目",
            submenu: [
                {
                    label: "地形", click: () =>
                    {
                        openDownloadProject("terrain.feng3d.zip");
                    },
                },
                {
                    label: "自定义材质", click: () =>
                    {
                        openDownloadProject("customshader.feng3d.zip");
                    },
                },
                {
                    label: "水", click: () =>
                    {
                        openDownloadProject("water.feng3d.zip");
                    },
                },
                {
                    label: "灯光", click: () =>
                    {
                        openDownloadProject("light.feng3d.zip");
                    },
                },
            ],
        },
        {
            label: "下载网络项目",
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
                {
                    label: "水", click: () =>
                    {
                        downloadProject("water.feng3d.zip");
                    },
                },
                {
                    label: "灯光", click: () =>
                    {
                        downloadProject("light.feng3d.zip");
                    },
                },
            ],
        },
        {
            label: "升级项目",
            click: () =>
            {
                fs.upgradeProject(() =>
                {
                    alert("升级完成！");
                });
            },
        },
        {
            label: "清空项目",
            click: () =>
            {
                editorAssets.deletefile(editorAssets.assetsPath, () =>
                {
                    editorAssets.initproject(() =>
                    {
                        editorAssets.runProjectScript(() =>
                        {
                            engine.scene = creatNewScene()
                            editorui.assetsview.invalidateAssetstree();
                            console.log("清空项目完成!");
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
        //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
        {
            label: "游戏对象", click: () =>
            {
                addToHierarchy(feng3d.gameObjectFactory.createGameObject());
            }
        },
        { type: "separator" },
        {
            label: "3D对象",
            submenu: [
                {
                    label: "平面", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createPlane());
                    }
                },
                {
                    label: "立方体", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createCube());
                    }
                },
                {
                    label: "球体", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createSphere());
                    }
                },
                {
                    label: "胶囊体", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createCapsule());
                    }
                },
                {
                    label: "圆柱体", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createCylinder());
                    }
                },
                {
                    label: "圆锥体", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createCone());
                    }
                },
                {
                    label: "圆环", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createTorus());
                    }
                },
                {
                    label: "地形", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createTerrain());
                    }
                },
                {
                    label: "水", click: () =>
                    {
                        addToHierarchy(feng3d.gameObjectFactory.createWater());
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
                        addToHierarchy(feng3d.gameObjectFactory.createPointLight());
                    }
                },
                {
                    label: "方向光源", click: () =>
                    {
                        var gameobject = new feng3d.GameObject({ name: "DirectionalLight" });
                        gameobject.addComponent(feng3d.DirectionalLight);
                        addToHierarchy(gameobject);
                    }
                },
                {
                    label: "聚光灯", click: () =>
                    {
                        var gameobject = new feng3d.GameObject({ name: "SpotLight" });
                        gameobject.addComponent(feng3d.SpotLight);
                        addToHierarchy(gameobject);
                    }
                },
            ],
        },
        {
            label: "粒子系统", click: () =>
            {
                addToHierarchy(feng3d.gameObjectFactory.createParticle());
            }
        },
        {
            label: "摄像机", click: () =>
            {
                addToHierarchy(feng3d.gameObjectFactory.createCamera());
            }
        },
    ];

    function addToHierarchy(gameobject: feng3d.GameObject)
    {
        var selectedNode = hierarchyTree.getSelectedNode();
        if (selectedNode)
            selectedNode.gameobject.addChild(gameobject);
        else
            hierarchyTree.rootnode.gameobject.addChild(gameobject);
        editorData.selectObject(gameobject);
    }

    /**
     * 获取创建游戏对象组件菜单
     * @param gameobject 游戏对象
     */
    export function getCreateComponentMenu(gameobject: feng3d.GameObject)
    {
        var menu: MenuItem[] = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
            {
                label: "SkyBox",
                click: () => { gameobject.addComponent(feng3d.SkyBox); }
            },
            {
                label: "Animator",
                submenu: [
                    { label: "ParticleSystem", click: () => { gameobject.addComponent(feng3d.ParticleSystem); } },
                    { label: "Animation", click: () => { gameobject.addComponent(feng3d.Animation); } },
                ]
            },
            {
                label: "Rendering",
                submenu: [
                    { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
                    { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
                    { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
                    { label: "OutLineComponent", click: () => { gameobject.addComponent(feng3d.OutLineComponent); } },
                    { label: "CartoonComponent", click: () => { gameobject.addComponent(feng3d.CartoonComponent); } },
                    // { label: "LineComponent", click: () => { needcreateComponentGameObject.addComponent(LineComponent); } },
                ]
            },
            {
                label: "Controller",
                submenu: [
                    { label: "FPSController", click: () => { gameobject.addComponent(feng3d.FPSController); } },
                ]
            },
            {
                label: "Layout",
                submenu: [
                    { label: "HoldSizeComponent", click: () => { gameobject.addComponent(feng3d.HoldSizeComponent); } },
                    { label: "BillboardComponent", click: () => { gameobject.addComponent(feng3d.BillboardComponent); } },
                ]
            },
            {
                label: "Audio",
                submenu: [
                    { label: "AudioListener", click: () => { gameobject.addComponent(feng3d.AudioListener); } },
                    { label: "AudioSource", click: () => { gameobject.addComponent(feng3d.AudioSource); } },
                ]
            },
            {
                label: "Navigation",
                submenu: [
                    { label: "Navigation", click: () => { gameobject.addComponent(Navigation); } },
                ]
            },
            {
                label: "Graphics",
                submenu: [
                    { label: "Water", click: () => { gameobject.addComponent(feng3d.Water); } },
                ]
            },
            {
                label: "Script",
                submenu: [
                    { label: "Script", click: () => { gameobject.addComponent(feng3d.ScriptComponent); } },
                ]
            },
        ];
        return menu;
    }

    /**
     * 获取创建粒子系统组件菜单
     * @param particleSystem 粒子系统
     */
    export function getCreateParticleComponentMenu(particleSystem: feng3d.ParticleSystem)
    {
        var menu: MenuItem[] = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
            // {
            //     label: "SkyBox",
            //     click: () => { gameobject.addComponent(feng3d.SkyBox); }
            // },
        ];
        return menu;
    }

    /**
     * 下载项目
     * @param projectname 
     */
    function openDownloadProject(projectname: string, callback?: () => void)
    {
        editorAssets.deletefile(editorAssets.assetsPath, () =>
        {
            downloadProject(projectname, callback);
        }, true);
    }
    /**
     * 下载项目
     * @param projectname 
     */
    function downloadProject(projectname: string, callback?: () => void)
    {
        var path = "projects/" + projectname;
        feng3d.Loader.loadBinary(path, (content) =>
        {
            fs.importProject(<any>content, () =>
            {
                editorAssets.initproject(() =>
                {
                    editorAssets.runProjectScript(() =>
                    {
                        editorAssets.readScene("default.scene.json", (err, scene) =>
                        {
                            engine.scene = scene;
                            editorui.assetsview.invalidateAssetstree();
                            console.log(`${projectname} 项目下载完成!`);
                            callback && callback();
                        });
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