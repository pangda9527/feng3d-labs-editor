module feng3d
{

	/**
	 * ObjectView总配置数据
	 * @author feng 2016-3-23
	 */
	export interface ObjectViewConfig
	{

		/**
		 * 默认基础类型对象界面类定义
		 */
		defaultBaseObjectViewClass: string;

		/**
		 * 默认对象界面类定义
		 */
		defaultObjectViewClass: string;

		/**
		 * 默认对象属性界面类定义
		 */
		defaultObjectAttributeViewClass: string;

		/**
		 * 属性块默认界面
		 */
		defaultObjectAttributeBlockView: string;

		/**
		 * 指定属性类型界面类定义字典（key:属性类名称,value:属性界面类定义）
		 */
		attributeDefaultViewClassByTypeVec: AttributeTypeDefinition[];

		/**
		 * ObjectView类配置字典 （key：类名称，value：ObjectView类配置）
		 */
		classConfigVec: ClassDefinition[];
	}

	export var $objectViewConfig: ObjectViewConfig = {

		defaultBaseObjectViewClass: "",
		defaultObjectViewClass: "",
		defaultObjectAttributeViewClass: "",
		defaultObjectAttributeBlockView: "",
		attributeDefaultViewClassByTypeVec: [],
		classConfigVec: []
	};
}