namespace editor
{
    export var modules: Modules;

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
            var moduleview = this.moduleViewMap[moduleName].pop();
            if (!moduleview)
            {
                var cls = Modules.moduleViewCls[moduleName];
                if (!cls)
                {
                    console.error(`无法获取模块 ${moduleName} 界面类定义`);
                    return;
                }
                moduleview = new cls();
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
        static moduleViewCls: { [name: string]: feng3d.Constructor<ModuleView> } = {};
    }

    modules = new Modules();
}