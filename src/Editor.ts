import { task, View, serialization } from 'feng3d';
import { editorRS } from './assets/EditorRS';
import { editorcache } from './caches/Editorcache';
import { EditorData } from './global/EditorData';
import { editorui } from './global/editorui';
import { modules } from './Modules';
import { mouseEventEnvironment } from './polyfill/egret/MouseEvent';
import { Editorshortcut } from './shortcut/Editorshortcut';
import { editorAsset } from './ui/assets/EditorAsset';
import { Message } from './ui/components/Message';
import { MainUI } from './ui/MainUI';
import { MainView } from './ui/MainView';

//
export var editorData: EditorData;

/**
 * editor的版本号
 */
export var version: string = "2018.08.22";

console.log(`editor version ${version}`)

/**
 * 编辑器
 */
export class Editor extends eui.UILayer
{
    constructor()
    {
        super();
        // giteeOauth.oauth();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
    }

    private onAddedToStage()
    {
        editorui.stage = this.stage;

        //
        modules.message = new Message();

        //
        task.series([
            this.initEgret.bind(this),
            editorRS.initproject.bind(editorRS),
            this.init.bind(this),
        ])(() =>
        {
            console.log(`初始化完成。`);
            // 移除无效入口类显示对象
            this.parent && this.parent.removeChild(this);
        });
    }

    /**
     * 初始化 Egret
     * 
     * @param callback 完成回调
     */
    private initEgret(callback: () => void)
    {
        var mainui = new MainUI(() =>
        {
            //
            var tooltipLayer = new eui.UILayer();
            tooltipLayer.touchEnabled = false;
            this.stage.addChild(tooltipLayer);
            editorui.tooltipLayer = tooltipLayer;
            //
            var popupLayer = new eui.UILayer();
            popupLayer.touchEnabled = false;
            this.stage.addChild(popupLayer);
            editorui.popupLayer = popupLayer;
            //
            var messageLayer = new eui.UILayer();
            messageLayer.touchEnabled = false;
            this.stage.addChild(messageLayer);
            editorui.messageLayer = messageLayer;
            //
            editorcache.projectname = editorcache.projectname || "newproject";

            editorui.stage.removeChild(mainui);
            callback();
        });
        editorui.stage.addChild(mainui);
    }

    private init(callback: () => void)
    {
        document.head.getElementsByTagName("title")[0].innerText = "feng3d-editor -- " + editorcache.projectname;

        editorcache.setLastProject(editorcache.projectname);

        editorAsset.initproject(() =>
        {
            editorAsset.runProjectScript(() =>
            {
                editorAsset.readScene("default.scene.json", (err, scene) =>
                {
                    if (err)
                        editorData.gameScene = View.createNewScene();
                    else
                        editorData.gameScene = scene;

                    //
                    this.initMainView()
                    new Editorshortcut();
                    mouseEventEnvironment();
                    callback();
                });
            });
        });

        window.addEventListener("beforeunload", () =>
        {
            let obj = serialization.serialize(editorData.gameScene.gameObject);
            editorRS.fs.writeObject("default.scene.json", obj);
        });
    }

    private initMainView()
    {
        //
        var mainView = new MainView();
        editorui.mainview = mainView;
        this.stage.addChildAt(mainView, 1);
    }

}
