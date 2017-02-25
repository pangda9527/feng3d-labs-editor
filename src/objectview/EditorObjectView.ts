module feng3d
{
    export class EditorObjectView extends EventDispatcher
    {
        public static configPath = "resource/objectview/objectview.json";
        public static COMPLETED = "completed";

        private classConfigs: string[];
        private rootPath: string;

        public init()
        {
            var loader = new Loader();
            loader.addEventListener(LoaderEvent.COMPLETE, this.onMainCompleted, this)
            loader.loadText(EditorObjectView.configPath);
        }

        private onMainCompleted(event: LoaderEvent)
        {
            var loader: Loader = event.data;
            var str: string = loader.content;
            var mainjson: { classConfigs: string[] } = JSON.parse(str);
            loader.removeEventListener(LoaderEvent.COMPLETE, this.onMainCompleted, this);

            //
            $objectViewConfig = <any>mainjson;
            this.classConfigs = mainjson.classConfigs;

            this.rootPath = EditorObjectView.configPath.substr(0, EditorObjectView.configPath.lastIndexOf("/") + 1);

            this.loadClassConfigs();
        }

        private loadClassConfigs()
        {
            if (this.classConfigs && this.classConfigs.length > 0)
            {
                var path = this.classConfigs.shift();
                var loader = new Loader();
                loader.addEventListener(LoaderEvent.COMPLETE, this.onClassCompleted, this)
                loader.loadText(this.rootPath + path);
            } else
            {
                this.dispatchEvent(new Event(EditorObjectView.COMPLETED, this));
            }
        }

        private onClassCompleted(event: LoaderEvent)
        {
            var loader: Loader = event.data;
            loader.removeEventListener(LoaderEvent.COMPLETE, this.onMainCompleted, this);
            var str: string = loader.content;
            var classDefinition: ClassDefinition = JSON.parse(str);
            $objectViewConfig.classConfigVec.push(classDefinition);

            this.loadClassConfigs();
        }
    }
}