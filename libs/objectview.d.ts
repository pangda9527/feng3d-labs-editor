declare module feng3d {
    /**
     * 排序比较函数
     * @author feng 2016-3-29
     */
    class SortCompare {
        /**
         * 比较字符串
         * @param a
         * @param b
         * @return
         */
        static stringCompare(a: string, b: string): number;
    }
}
declare module feng3d {
    /**
     * 属性信息
     * @author feng 2016-3-28
     */
    class AttributeInfo {
        /**
         * 属性名称
         */
        name: string;
        /**
         * 属性类型
         */
        type: string;
        /**
         * 是否可写
         */
        writable: boolean;
        /**
         * 构建
         */
        constructor(name?: string, type?: string, writable?: boolean);
        /**
         * 比较字符串
         * @param a
         * @param b
         * @return
         */
        static compare(a: AttributeInfo, b: AttributeInfo): number;
    }
}
declare module feng3d {
    /**
     * 定义属性
     * @author feng 2016-3-23
     */
    interface AttributeDefinition {
        /**
         * 属性名称
         */
        name: string;
        /**
         * 所属块名称
         */
        block?: string;
        /**
         * 组件
         */
        component?: string;
        /**
         * 组件参数
         */
        componentParam?: Object;
    }
}
declare module feng3d {
    /**
     * 定义特定属性类型默认界面
     * @author feng 2016-3-25
     */
    interface AttributeTypeDefinition {
        /**
         * 属性类型
         */
        type: string;
        /**
         * 界面类
         */
        component: string;
        /**
         * 组件参数
         */
        componentParam?: Object;
    }
}
declare module feng3d {
    /**
     * 块定义
     * @author feng 2016-3-23
     */
    interface BlockDefinition {
        /**
         * 块名称
         */
        name: string;
        /**
         * 组件
         */
        component?: string;
        /**
         * 组件参数
         */
        componentParam?: Object;
    }
}
declare module feng3d {
    /**
     * ObjectView类配置
     * @author feng 2016-3-23
     */
    interface ClassDefinition {
        /**
         * 类名
         */
        name: string;
        /**
         * 组件
         */
        component: string;
        /**
         * 组件参数
         */
        componentParam: Object;
        /**
         * 自定义对象属性定义字典（key:属性名,value:属性定义）
         */
        attributeDefinitionVec: AttributeDefinition[];
        /**
         * 自定义对象属性块界面类定义字典（key:属性块名称,value:自定义对象属性块界面类定义）
         */
        blockDefinitionVec: BlockDefinition[];
    }
}
declare module feng3d {
    /**
     * 对象属性界面接口
     * @author feng 2016-3-10
     */
    interface IObjectAttributeView {
        /**
         * 界面所属对象（空间）
         */
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        /**
         * 属性名称
         */
        attributeName: string;
        /**
         * 属性值
         */
        attributeValue: Object;
    }
}
declare module feng3d {
    /**
     * 对象属性块界面接口
     * @author feng 2016-3-22
     */
    interface IObjectBlockView {
        /**
         * 界面所属对象（空间）
         */
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        /**
         * 块名称
         */
        blockName: string;
        /**
         * 获取属性界面
         * @param attributeName		属性名称
         */
        getAttributeView(attributeName: string): IObjectAttributeView;
    }
}
declare module feng3d {
    /**
     * 对象界面接口
     * @author feng 2016-3-11
     */
    interface IObjectView {
        /**
         * 界面所属对象（空间）
         */
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        /**
         * 获取块界面
         * @param blockName		块名称
         */
        getblockView(blockName: string): IObjectBlockView;
        /**
         * 获取属性界面
         * @param attributeName		属性名称
         */
        getAttributeView(attributeName: string): IObjectAttributeView;
    }
}
declare module feng3d {
    /**
     * 对象属性信息
     * @author feng 2016-3-10
     */
    class AttributeViewInfo {
        /**
         * 属性名称
         */
        name: string;
        /**
         * 属性类型
         */
        type: string;
        /**
         * 是否可写
         */
        writable: boolean;
        /**
         * 所属块名称
         */
        block: string;
        /**
         * 组件
         */
        component: string;
        /**
         * 组件参数
         */
        componentParam: Object;
        /**
         * 属性所属对象
         */
        owner: Object;
    }
}
declare module feng3d {
    /**
     * 对象属性块
     * @author feng 2016-3-22
     */
    interface BlockViewInfo {
        /**
         * 块名称
         */
        name: string;
        /**
         * 组件
         */
        component?: string;
        /**
         * 组件参数
         */
        componentParam?: Object;
        /**
         * 属性信息列表
         */
        itemList: AttributeViewInfo[];
        /**
         * 属性拥有者
         */
        owner: Object;
    }
}
declare module feng3d {
    /**
     * 对象信息
     * @author feng 2016-3-29
     */
    interface ObjectViewInfo {
        /**
         * 类名
         */
        name: string;
        /**
         * 组件
         */
        component: string;
        /**
         * 组件参数
         */
        componentParam: Object;
        /**
         * 对象属性列表
         */
        objectAttributeInfos: AttributeViewInfo[];
        /**
         * 对象块信息列表
         */
        objectBlockInfos: BlockViewInfo[];
        /**
         * 保存类的一个实例，为了能够获取动态属性信息
         */
        owner: Object;
    }
}
declare module feng3d {
    /**
     * ObjectView总配置数据
     * @author feng 2016-3-23
     */
    interface ObjectViewConfig {
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
    var $objectViewConfig: ObjectViewConfig;
}
declare module feng3d {
    /**
     * 对象界面
     * @author feng 2016-3-10
     */
    class ObjectView {
        /**
         * 获取对象界面
         *
         * @static
         * @param {Object} object				用于生成界面的对象
         * @returns {egret.DisplayObject}		对象界面
         *
         * @memberOf ObjectView
         */
        getObjectView(object: Object): any;
        /**
         * 获取属性界面
         *
         * @static
         * @param {AttributeViewInfo} attributeViewInfo			属性界面信息
         * @returns {egret.DisplayObject}						属性界面
         *
         * @memberOf ObjectView
         */
        getAttributeView(attributeViewInfo: AttributeViewInfo): any;
        private getAttributeDefaultViewClassByType(type);
        /**
         * 获取块界面
         *
         * @static
         * @param {BlockViewInfo} blockViewInfo			块界面信息
         * @returns {egret.DisplayObject}				块界面
         *
         * @memberOf ObjectView
         */
        getBlockView(blockViewInfo: BlockViewInfo): any;
        /**
         * 获取对象信息
         * @param object
         * @return
         */
        private getObjectInfo(object);
        private getClassConfig(object);
        /**
         * 获取对象属性列表
         */
        private getObjectAttributeInfos(object, filterReg?);
        /**
         * 获取对象块信息列表
         *
         * @private
         * @static
         * @param {Object} object			对象
         * @returns {BlockViewInfo[]}		对象块信息列表
         *
         * @memberOf ObjectView
         */
        private getObjectBlockInfos(object);
        /**
         * 获取属性界面信息
         *
         * @private
         * @static
         * @param {Object} object				属性所属对象
         * @param {string} attributeName		属性名称
         * @returns {AttributeViewInfo}			属性界面信息
         *
         * @memberOf ObjectView
         */
        private getAttributeViewInfo(object, attributeName);
        /**
         * 获取属性定义
         *
         * @private
         * @static
         * @param {Object} object					属性所属对象
         * @param {string} attributeName			属性名称
         * @returns {AttributeDefinition}			属性定义信息
         *
         * @memberOf ObjectView
         */
        private getAttributeDefinition(object, attributeName);
    }
    var objectview: ObjectView;
}
