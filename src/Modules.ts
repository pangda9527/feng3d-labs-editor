import { Constructor } from 'feng3d';
import { Message } from './ui/components/Message';
import { ModuleView } from './ui/components/TabView';

/**
 * 模块
 *
 * 用于管理功能模块
 */
export class Modules
{
    message: Message;

    getModuleView(moduleName: string)
    {
        this.moduleViewMap[moduleName] = this.moduleViewMap[moduleName] || [];
        let moduleview = this.moduleViewMap[moduleName].pop();
        if (!moduleview)
        {
            const Cls = Modules.moduleViewCls[moduleName];
            if (!Cls)
            {
                console.error(`无法获取模块 ${moduleName} 界面类定义`);

                return;
            }
            moduleview = new Cls();
        }

        return moduleview;
    }

    /**
     * 回收模块界面
     *
     * @param moduleView 模块界面
     */
    recycleModuleView(moduleView: ModuleView)
    {
        this.moduleViewMap[moduleView.moduleName] = this.moduleViewMap[moduleView.moduleName] || [];
        this.moduleViewMap[moduleView.moduleName].push(moduleView);
    }

    private moduleViewMap: { [name: string]: ModuleView[] } = {};

    /**
     * 模块界面类定义
     */
    static moduleViewCls: { [name: string]: Constructor<ModuleView> } = {};
}

export const modules = new Modules();
