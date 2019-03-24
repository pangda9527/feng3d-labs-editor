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
            var moduleview = this.moduleViewMap[moduleName];
            if (!moduleview)
            {
                var cls = Modules.moduleViewCls[moduleName];
                if (!cls)
                {
                    feng3d.error(`无法获取模块 ${moduleName} 界面类定义`);
                    return;
                }

                this.moduleViewMap[moduleName] = moduleview = new cls();
            }
            return moduleview;
        }
        private moduleViewMap: { [name: string]: ModuleView } = {};

        /**
         * 模块界面类定义
         */
        static moduleViewCls: { [name: string]: feng3d.Constructor<ModuleView> } = {};
    }

    modules = new Modules();
}