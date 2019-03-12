namespace editor
{
    /**
     * 菜单配置
     */
    export var menuConfig: MenuConfig;

    /**
     * 菜单配置
     */
    export class MenuConfig
    {
        /**
         * 主菜单
         */
        getMainMenu()
        {
            var mainMenu: MenuItem[] = [
                {
                    label: "新建项目", click: () =>
                    {
                        popupview.popupObject({ newprojectname: "newproject" }, (data) =>
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
                    label: "打开最近的项目",
                    submenu: editorcache.lastProjects.map(element =>
                    {
                        var menuItem: MenuItem =
                        {
                            label: element, click: () =>
                            {
                                if (editorcache.projectname != element)
                                {
                                    editorcache.projectname = element;
                                    window.location.reload();
                                }
                            }
                        };
                        return menuItem;
                    }),
                    click: () =>
                    {
                        popupview.popupObject({ newprojectname: "newproject" }, (data) =>
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
                        var gameobject = hierarchy.rootnode.gameobject;
                        editorAsset.saveObject(gameobject);
                    }
                },
                {
                    label: "导入项目", click: () =>
                    {
                        editorRS.selectFile((filelist) =>
                        {
                            editorRS.importProject(filelist.item(0), () =>
                            {
                                console.log("导入项目完成");
                                editorAsset.initproject(() =>
                                {
                                    editorAsset.runProjectScript(() =>
                                    {
                                        editorAsset.readScene("default.scene.json", (err, scene) =>
                                        {
                                            engine.scene = scene;
                                            editorui.assetview.invalidateAssettree();
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
                        editorRS.exportProject(function (err, content)
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
                        editorRS.upgradeProject(() =>
                        {
                            alert("升级完成！");
                        });
                    },
                },
                {
                    label: "清空项目",
                    click: () =>
                    {
                        editorAsset.rootFile.remove();
                        editorAsset.initproject(() =>
                        {
                            editorAsset.runProjectScript(() =>
                            {
                                engine.scene = creatNewScene()
                                editorui.assetview.invalidateAssettree();
                                console.log("清空项目完成!");
                            });
                        });
                    },
                }
            ];
            return mainMenu;
        }

        /**
         * 层级界面创建3D对象列表数据
         */
        getCreateObjectMenu()
        {
            var menu: MenuItem[] = [
                //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
                {
                    label: "游戏对象", click: () =>
                    {
                        hierarchy.addGameObject(feng3d.gameObjectFactory.createGameObject());
                    }
                },
                { type: "separator" },
                {
                    label: "3D对象",
                    submenu: [
                        {
                            label: "平面", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createPlane());
                            }
                        },
                        {
                            label: "立方体", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createCube());
                            }
                        },
                        {
                            label: "球体", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createSphere());
                            }
                        },
                        {
                            label: "胶囊体", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createCapsule());
                            }
                        },
                        {
                            label: "圆柱体", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createCylinder());
                            }
                        },
                        {
                            label: "圆锥体", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createCone());
                            }
                        },
                        {
                            label: "圆环", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createTorus());
                            }
                        },
                        {
                            label: "地形", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createTerrain());
                            }
                        },
                        {
                            label: "水", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createWater());
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
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createPointLight());
                            }
                        },
                        {
                            label: "方向光源", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createDirectionalLight());
                            }
                        },
                        {
                            label: "聚光灯", click: () =>
                            {
                                hierarchy.addGameObject(feng3d.gameObjectFactory.createSpotLight());
                            }
                        },
                    ],
                },
                {
                    label: "粒子系统", click: () =>
                    {
                        hierarchy.addGameObject(feng3d.gameObjectFactory.createParticle());
                    }
                },
                {
                    label: "摄像机", click: () =>
                    {
                        hierarchy.addGameObject(feng3d.gameObjectFactory.createCamera());
                    }
                },
            ];
            return menu;
        }

        /**
         * 获取创建游戏对象组件菜单
         * @param gameobject 游戏对象
         */
        getCreateComponentMenu(gameobject: feng3d.GameObject)
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
                        { label: "CartoonComponent", click: () => { gameobject.addComponent(feng3d.CartoonComponent); } },
                        { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
                        { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
                        { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
                        { label: "OutLineComponent", click: () => { gameobject.addComponent(feng3d.OutLineComponent); } },
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

    }
    menuConfig = new MenuConfig();

    /**
     * 下载项目
     * @param projectname 
     */
    function openDownloadProject(projectname: string, callback?: () => void)
    {
        editorAsset.rootFile.delete();
        downloadProject(projectname, callback);
    }

    /**
     * 下载项目
     * @param projectname 
     */
    function downloadProject(projectname: string, callback?: () => void)
    {
        var path = "projects/" + projectname;
        feng3d.loader.loadBinary(path, (content) =>
        {
            editorRS.importProject(<any>content, () =>
            {
                editorAsset.initproject(() =>
                {
                    editorAsset.runProjectScript(() =>
                    {
                        editorAsset.readScene("default.scene.json", (err, scene) =>
                        {
                            engine.scene = scene;
                            editorui.assetview.invalidateAssettree();
                            console.log(`${projectname} 项目下载完成!`);
                            callback && callback();
                        });
                    });
                });
            });
        });
    }
}