"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Editorcache_1 = require("../caches/Editorcache");
var Hierarchy_1 = require("../feng3d/hierarchy/Hierarchy");
var EditorAsset_1 = require("../ui/assets/EditorAsset");
var EditorRS_1 = require("../assets/EditorRS");
var Main3D_1 = require("../feng3d/Main3D");
var editorui_1 = require("../global/editorui");
var NativeRequire_1 = require("../assets/NativeRequire");
var Popupview_1 = require("../ui/components/Popupview");
var ShortCutSetting_1 = require("../shortcut/ShortCutSetting");
var Navigation_1 = require("../navigation/Navigation");
/**
 * 菜单配置
 */
var MenuConfig = /** @class */ (function () {
    function MenuConfig() {
    }
    /**
     * 主菜单
     */
    MenuConfig.prototype.getMainMenu = function () {
        var mainMenu = [
            {
                label: "新建项目", click: function () {
                    Popupview_1.popupview.popupObject({ newprojectname: "newproject" }, function (data) {
                        if (data.newprojectname && data.newprojectname.length > 0) {
                            Editorcache_1.editorcache.projectname = data.newprojectname;
                            window.location.reload();
                        }
                    });
                },
            },
            {
                label: "打开最近的项目",
                submenu: Editorcache_1.editorcache.lastProjects.map(function (element) {
                    var menuItem = {
                        label: element, click: function () {
                            if (Editorcache_1.editorcache.projectname != element) {
                                Editorcache_1.editorcache.projectname = element;
                                window.location.reload();
                            }
                        }
                    };
                    return menuItem;
                }),
                click: function () {
                    Popupview_1.popupview.popupObject({ newprojectname: "newproject" }, function (data) {
                        if (data.newprojectname && data.newprojectname.length > 0) {
                            Editorcache_1.editorcache.projectname = data.newprojectname;
                            window.location.reload();
                        }
                    });
                }
            },
            {
                label: "保存场景", click: function () {
                    var gameobject = Hierarchy_1.hierarchy.rootnode.gameobject;
                    EditorAsset_1.editorAsset.saveObject(gameobject);
                }
            },
            {
                label: "导入项目", click: function () {
                    EditorRS_1.editorRS.selectFile(function (filelist) {
                        EditorRS_1.editorRS.importProject(filelist.item(0), function () {
                            console.log("导入项目完成");
                            EditorAsset_1.editorAsset.initproject(function () {
                                EditorAsset_1.editorAsset.runProjectScript(function () {
                                    EditorAsset_1.editorAsset.readScene("default.scene.json", function (err, scene) {
                                        Main3D_1.engine.scene = scene;
                                        editorui_1.editorui.assetview.invalidateAssettree();
                                        console.log("导入项目完成!");
                                    });
                                });
                            });
                        });
                    });
                }
            },
            {
                label: "导出项目", click: function () {
                    EditorRS_1.editorRS.exportProject(function (err, content) {
                        // see FileSaver.js
                        saveAs(content, Editorcache_1.editorcache.projectname + ".feng3d.zip");
                    });
                }
            },
            {
                label: "打开网络项目",
                submenu: [
                    {
                        label: "地形", click: function () {
                            openDownloadProject("terrain.feng3d.zip");
                        },
                    },
                    {
                        label: "自定义材质", click: function () {
                            openDownloadProject("customshader.feng3d.zip");
                        },
                    },
                    {
                        label: "水", click: function () {
                            openDownloadProject("water.feng3d.zip");
                        },
                    },
                    {
                        label: "灯光", click: function () {
                            openDownloadProject("light.feng3d.zip");
                        },
                    },
                ],
            },
            {
                label: "下载网络项目",
                submenu: [
                    {
                        label: "地形", click: function () {
                            downloadProject("terrain.feng3d.zip");
                        },
                    },
                    {
                        label: "自定义材质", click: function () {
                            downloadProject("customshader.feng3d.zip");
                        },
                    },
                    {
                        label: "水", click: function () {
                            downloadProject("water.feng3d.zip");
                        },
                    },
                    {
                        label: "灯光", click: function () {
                            downloadProject("light.feng3d.zip");
                        },
                    },
                ],
            },
            {
                label: "升级项目",
                click: function () {
                    EditorRS_1.editorRS.upgradeProject(function () {
                        alert("升级完成！");
                    });
                },
            },
            {
                label: "清空项目",
                click: function () {
                    EditorAsset_1.editorAsset.rootFile.remove();
                    EditorAsset_1.editorAsset.initproject(function () {
                        EditorAsset_1.editorAsset.runProjectScript(function () {
                            Main3D_1.engine.scene = Main3D_1.creatNewScene();
                            editorui_1.editorui.assetview.invalidateAssettree();
                            console.log("清空项目完成!");
                        });
                    });
                },
            },
            { type: "separator" },
            {
                label: "打开开发者工具",
                click: function () {
                    NativeRequire_1.nativeAPI.openDevTools();
                }, show: !!NativeRequire_1.nativeAPI,
            },
            {
                label: "首选项",
                submenu: [
                    {
                        label: "快捷方式",
                        click: function () {
                            Popupview_1.popupview.popupView(ShortCutSetting_1.ShortCutSetting.instance);
                        },
                    },
                ],
            }
        ];
        return mainMenu;
    };
    /**
     * 层级界面创建3D对象列表数据
     */
    MenuConfig.prototype.getCreateObjectMenu = function () {
        var menu = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
            {
                label: "游戏对象", click: function () {
                    Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createGameObject());
                }
            },
            { type: "separator" },
            {
                label: "3D对象",
                submenu: [
                    {
                        label: "平面", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createPlane());
                        }
                    },
                    {
                        label: "立方体", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createCube());
                        }
                    },
                    {
                        label: "球体", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createSphere());
                        }
                    },
                    {
                        label: "胶囊体", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createCapsule());
                        }
                    },
                    {
                        label: "圆柱体", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createCylinder());
                        }
                    },
                    {
                        label: "圆锥体", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createCone());
                        }
                    },
                    {
                        label: "圆环", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createTorus());
                        }
                    },
                    {
                        label: "地形", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createTerrain());
                        }
                    },
                    {
                        label: "水", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createWater());
                        }
                    },
                ],
            },
            {
                label: "光源",
                submenu: [
                    {
                        label: "点光源", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createPointLight());
                        }
                    },
                    {
                        label: "方向光源", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createDirectionalLight());
                        }
                    },
                    {
                        label: "聚光灯", click: function () {
                            Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createSpotLight());
                        }
                    },
                ],
            },
            {
                label: "粒子系统", click: function () {
                    Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createParticle());
                }
            },
            {
                label: "摄像机", click: function () {
                    Hierarchy_1.hierarchy.addGameObject(feng3d.gameObjectFactory.createCamera());
                }
            },
        ];
        return menu;
    };
    /**
     * 获取创建游戏对象组件菜单
     * @param gameobject 游戏对象
     */
    MenuConfig.prototype.getCreateComponentMenu = function (gameobject) {
        var menu = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
            {
                label: "SkyBox",
                click: function () { gameobject.addComponent(feng3d.SkyBox); }
            },
            {
                label: "Animator",
                submenu: [
                    { label: "ParticleSystem", click: function () { gameobject.addComponent(feng3d.ParticleSystem); } },
                    { label: "Animation", click: function () { gameobject.addComponent(feng3d.Animation); } },
                ]
            },
            {
                label: "Rendering",
                submenu: [
                    { label: "CartoonComponent", click: function () { gameobject.addComponent(feng3d.CartoonComponent); } },
                    { label: "Camera", click: function () { gameobject.addComponent(feng3d.Camera); } },
                    { label: "PointLight", click: function () { gameobject.addComponent(feng3d.PointLight); } },
                    { label: "DirectionalLight", click: function () { gameobject.addComponent(feng3d.DirectionalLight); } },
                    { label: "OutLineComponent", click: function () { gameobject.addComponent(feng3d.OutLineComponent); } },
                ]
            },
            {
                label: "Controller",
                submenu: [
                    { label: "FPSController", click: function () { gameobject.addComponent(feng3d.FPSController); } },
                ]
            },
            {
                label: "Layout",
                submenu: [
                    { label: "HoldSizeComponent", click: function () { gameobject.addComponent(feng3d.HoldSizeComponent); } },
                    { label: "BillboardComponent", click: function () { gameobject.addComponent(feng3d.BillboardComponent); } },
                ]
            },
            {
                label: "Audio",
                submenu: [
                    { label: "AudioListener", click: function () { gameobject.addComponent(feng3d.AudioListener); } },
                    { label: "AudioSource", click: function () { gameobject.addComponent(feng3d.AudioSource); } },
                ]
            },
            {
                label: "Navigation",
                submenu: [
                    { label: "Navigation", click: function () { gameobject.addComponent(Navigation_1.Navigation); } },
                ]
            },
            {
                label: "Graphics",
                submenu: [
                    { label: "Water", click: function () { gameobject.addComponent(feng3d.Water); } },
                ]
            },
            {
                label: "Script",
                submenu: [
                    { label: "Script", click: function () { gameobject.addComponent(feng3d.ScriptComponent); } },
                ]
            },
        ];
        return menu;
    };
    return MenuConfig;
}());
exports.MenuConfig = MenuConfig;
exports.menuConfig = new MenuConfig();
/**
 * 下载项目
 * @param projectname
 */
function openDownloadProject(projectname, callback) {
    EditorAsset_1.editorAsset.rootFile.delete();
    downloadProject(projectname, callback);
}
/**
 * 下载项目
 * @param projectname
 */
function downloadProject(projectname, callback) {
    var path = "projects/" + projectname;
    feng3d.loader.loadBinary(path, function (content) {
        EditorRS_1.editorRS.importProject(content, function () {
            EditorAsset_1.editorAsset.initproject(function () {
                EditorAsset_1.editorAsset.runProjectScript(function () {
                    EditorAsset_1.editorAsset.readScene("default.scene.json", function (err, scene) {
                        Main3D_1.engine.scene = scene;
                        editorui_1.editorui.assetview.invalidateAssettree();
                        console.log(projectname + " \u9879\u76EE\u4E0B\u8F7D\u5B8C\u6210!");
                        callback && callback();
                    });
                });
            });
        });
    });
}
//# sourceMappingURL=CommonConfig.js.map