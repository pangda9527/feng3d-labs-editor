module feng3d.editor
{

	export class ObjectViewTest extends egret.Sprite
	{

		public constructor()
		{
			super();

			ClassUtils.addClassNameSpace("feng3d.editor");
			ClassUtils.addClassNameSpace("egret");
			this.init();
		}

		public init()
		{
			$objectViewConfig = {

				defaultBaseObjectViewClass: ClassUtils.getQualifiedClassName(DefaultBaseObjectView),
				defaultObjectViewClass: ClassUtils.getQualifiedClassName(DefaultObjectView),
				defaultObjectAttributeViewClass: ClassUtils.getQualifiedClassName(DefaultObjectAttributeView),
				defaultObjectAttributeBlockView: ClassUtils.getQualifiedClassName(DefaultObjectBlockView),
				attributeDefaultViewClassByTypeVec: {},
				classConfigVec: {}
			};

			var box = new eui.Group();
			var hLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
			hLayout.gap = 10;
			hLayout.paddingTop = 30;
			hLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
			box.layout = hLayout;
			this.addChild(box);

			var attributeTypeDefinition: AttributeTypeDefinition = { type: ClassUtils.getQualifiedClassName(Boolean), component: ClassUtils.getQualifiedClassName(BooleanAttrView) };
			$objectViewConfig.attributeDefaultViewClassByTypeVec[attributeTypeDefinition.type] = attributeTypeDefinition;

			var view = ObjectView.getObjectView({ a: 1, b: false, c: "abc" });
			box.addChild(view);

			var spriteConfig: ClassDefinition = {
				name: ClassUtils.getQualifiedClassName(egret.Sprite),
				component: "",
				componentParam: null,
				attributeDefinitionVec: [
					{ name: "accessibilityImplementation", block: "坐标" },
					{ name: "x", block: "坐标" },
					{ name: "y", block: "坐标" },
					{ name: "z", block: "坐标" },
				],
				blockDefinitionVec: []
			};
			$objectViewConfig.classConfigVec[spriteConfig.name] = spriteConfig;
			box.addChild(ObjectView.getObjectView(new egret.Sprite()));

			spriteConfig.component = ClassUtils.getQualifiedClassName(CustomObjectView);
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
			console.log(egret.getTimer() - t);
			t = egret.getTimer();
			var fullConfig: any = <any>$objectViewConfig;
			var fullConfigStr: string = <any>JSON.stringify(fullConfig);
			console.log(fullConfigStr);
			var fullConfig1: any = <any>JSON.parse(fullConfigStr);
			$objectViewConfig.attributeDefaultViewClassByTypeVec = {};
			$objectViewConfig.classConfigVec = {};
			box.addChild(ObjectView.getObjectView(a));
			console.log(egret.getTimer() - t);
			t = egret.getTimer();
			$objectViewConfig = fullConfig1;
			box.addChild(ObjectView.getObjectView(a));
			console.log(egret.getTimer() - t);
			t = egret.getTimer();
		}

		protected onValueChange(event: ObjectViewEvent)
		{
			console.log(event["toString"]());
		}

		private initBlockConfig()
		{


			var classDefinition: ClassDefinition = {
				name: ClassUtils.getQualifiedClassName(ObjectA),
				component: "",
				componentParam: null,
				attributeDefinitionVec: [
					{ name: "x", block: "坐标" },
					{ name: "x", block: "坐标" },
					{ name: "y", block: "坐标" },
					{ name: "z", block: "坐标" },
					{ name: "rx", block: "旋转" },
					{ name: "ry", block: "旋转" },
					{ name: "rz", block: "旋转" },
					{ name: "sx", block: "缩放" },
					{ name: "sy", block: "缩放" },
					{ name: "sz", block: "缩放" },
					{ name: "custom", block: "缩放", component: ClassUtils.getQualifiedClassName(CustomAttrView) },
					{ name: "a", block: "自定义块" },
					{ name: "b", block: "自定义块" },
				],
				blockDefinitionVec: [
					{ name: "自定义块", component: ClassUtils.getQualifiedClassName(CustomBlockView) }
				]
			};

			$objectViewConfig.classConfigVec[classDefinition.name] = classDefinition;

			var attributeTypeDefinition = { type: ClassUtils.getQualifiedClassName(Boolean), component: ClassUtils.getQualifiedClassName(BooleanAttrView) };
			$objectViewConfig.attributeDefaultViewClassByTypeVec[attributeTypeDefinition.type] = attributeTypeDefinition;
		}
	}
}