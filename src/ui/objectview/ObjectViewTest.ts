module feng3d.editor {

	export class ObjectViewTest extends egret.Sprite {

		public constructor() {
			super();
			this.init();
		}

		public init() {
			var box: egret.DisplayObjectContainer = new eui.Panel();
			this.addChild(box);
			var spriteConfig: ClassDefinition = ObjectViewConfig.instance.getClassConfig(egret.Sprite);
			spriteConfig.getAttributeDefinition("accessibilityImplementation").block = "坐标";
			spriteConfig.getAttributeDefinition("x").block = "坐标";
			spriteConfig.getAttributeDefinition("y").block = "坐标";
			spriteConfig.getAttributeDefinition("z").block = "坐标";
			box.addChild(ObjectView.getObjectView(new egret.Sprite()));
			spriteConfig.setCustomObjectViewClass(CustomObjectView);
			box.addChild(ObjectView.getObjectView(new egret.Sprite()));
			var a: ObjectA = new ObjectA();
			a["boo"] = true;
			a["da"] = 2;
			a["db"] = "```";
			var t: number = egret.getTimer();
			this.initBlockConfig();
			var aView: DefaultObjectView = <any>ObjectView.getObjectView(a);
			aView.addEventListener(ObjectViewEvent.VALUE_CHANGE, this.onValueChange, this);
			box.addChild(aView);
			(<egret.DisplayObject><any>aView.getblockView("坐标")).alpha = 0.5;
			(<egret.DisplayObject><any>aView.getAttributeView("ry")).alpha = 0.2;
			console.log(egret.getTimer() - t);
			t = egret.getTimer();
			var fullConfig: any = <any>ObjectViewConfig.instance;
			var fullConfigStr: string = <any>JSON.stringify(fullConfig);
			console.log(fullConfigStr);
			var fullConfig1: any = <any>JSON.parse(fullConfigStr);
			ObjectViewConfig.instance.clearConfig();
			box.addChild(ObjectView.getObjectView(a));
			console.log(egret.getTimer() - t);
			t = egret.getTimer();
			ObjectViewConfig.instance.setConfig(fullConfig1);
			box.addChild(ObjectView.getObjectView(a));
			console.log(egret.getTimer() - t);
			t = egret.getTimer();
		}

		protected onValueChange(event: ObjectViewEvent) {
			console.log(event["toString"]());
		}

		private initBlockConfig() {
			var objectAConfig: ClassDefinition = ObjectViewConfig.instance.getClassConfig(ObjectA);
			objectAConfig.getAttributeDefinition("x").block = "坐标";
			objectAConfig.getAttributeDefinition("x").block = "坐标";
			objectAConfig.getAttributeDefinition("y").block = "坐标";
			objectAConfig.getAttributeDefinition("z").block = "坐标";
			objectAConfig.getAttributeDefinition("rx").block = "旋转";
			objectAConfig.getAttributeDefinition("ry").block = "旋转";
			objectAConfig.getAttributeDefinition("rz").block = "旋转";
			objectAConfig.getAttributeDefinition("sx").block = "缩放";
			objectAConfig.getAttributeDefinition("sy").block = "缩放";
			objectAConfig.getAttributeDefinition("sz").block = "缩放";
			objectAConfig.getAttributeDefinition("custom").block = "缩放";
			objectAConfig.getAttributeDefinition("a").block = "自定义块";
			objectAConfig.getAttributeDefinition("b").block = "自定义块";
			objectAConfig.getAttributeDefinition("custom").setComponent(CustomAttrView);
			objectAConfig.getBlockDefinition("自定义块").setComponent(CustomBlockView);
			ObjectViewConfig.instance.getAttributeDefaultViewClass(Boolean).setComponent(BooleanAttrView);
		}

	}
}