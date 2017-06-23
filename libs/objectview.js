var feng3d;
(function (feng3d) {
    /**
     * 排序比较函数
     * @author feng 2016-3-29
     */
    var SortCompare = (function () {
        function SortCompare() {
        }
        /**
         * 比较字符串
         * @param a
         * @param b
         * @return
         */
        SortCompare.stringCompare = function (a, b) {
            var index = 0;
            var len = Math.min(a.length, b.length);
            for (var i = 0; i < len; i++) {
                if (a.charCodeAt(i) != b.charCodeAt(i))
                    return a.charCodeAt(i) - b.charCodeAt(i);
            }
            if (a.length != b.length)
                return a.length - b.length;
            return 0;
        };
        return SortCompare;
    }());
    feng3d.SortCompare = SortCompare;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 属性信息
     * @author feng 2016-3-28
     */
    var AttributeInfo = (function () {
        /**
         * 构建
         */
        function AttributeInfo(name, type, writable) {
            if (name === void 0) { name = ""; }
            if (type === void 0) { type = ""; }
            if (writable === void 0) { writable = true; }
            this.name = name;
            this.type = type;
            this.writable = writable;
        }
        /**
         * 比较字符串
         * @param a
         * @param b
         * @return
         */
        AttributeInfo.compare = function (a, b) {
            return feng3d.SortCompare.stringCompare(a.name, b.name);
        };
        return AttributeInfo;
    }());
    feng3d.AttributeInfo = AttributeInfo;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 对象属性信息
     * @author feng 2016-3-10
     */
    var AttributeViewInfo = (function () {
        function AttributeViewInfo() {
        }
        return AttributeViewInfo;
    }());
    feng3d.AttributeViewInfo = AttributeViewInfo;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    feng3d.$objectViewConfig = {
        defaultBaseObjectViewClass: "",
        defaultObjectViewClass: "",
        defaultObjectAttributeViewClass: "",
        defaultObjectAttributeBlockView: "",
        attributeDefaultViewClassByTypeVec: [],
        classConfigVec: []
    };
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 对象界面
     * @author feng 2016-3-10
     */
    var ObjectView = (function () {
        function ObjectView() {
        }
        /**
         * 获取对象界面
         *
         * @static
         * @param {Object} object				用于生成界面的对象
         * @returns {egret.DisplayObject}		对象界面
         *
         * @memberOf ObjectView
         */
        ObjectView.prototype.getObjectView = function (object) {
            var classConfig = this.getObjectInfo(object);
            if (classConfig.component == null || classConfig.component == "") {
                //返回基础类型界面类定义
                if (feng3d.ClassUtils.isBaseType(classConfig.owner)) {
                    classConfig.component = feng3d.$objectViewConfig.defaultBaseObjectViewClass;
                }
            }
            if (classConfig.component == null || classConfig.component == "") {
                //使用默认类型界面类定义
                classConfig.component = feng3d.$objectViewConfig.defaultObjectViewClass;
            }
            var cls = feng3d.ClassUtils.getDefinitionByName(classConfig.component);
            var view = new cls(classConfig);
            return view;
        };
        /**
         * 获取属性界面
         *
         * @static
         * @param {AttributeViewInfo} attributeViewInfo			属性界面信息
         * @returns {egret.DisplayObject}						属性界面
         *
         * @memberOf ObjectView
         */
        ObjectView.prototype.getAttributeView = function (attributeViewInfo) {
            if (attributeViewInfo.component == null || attributeViewInfo.component == "") {
                var defaultViewClass = this.getAttributeDefaultViewClassByType(attributeViewInfo.type);
                var tempComponent = defaultViewClass ? defaultViewClass.component : "";
                if (tempComponent != null && tempComponent != "") {
                    attributeViewInfo.component = defaultViewClass.component;
                    attributeViewInfo.componentParam = defaultViewClass.componentParam;
                }
            }
            if (attributeViewInfo.component == null || attributeViewInfo.component == "") {
                //使用默认对象属性界面类定义
                attributeViewInfo.component = feng3d.$objectViewConfig.defaultObjectAttributeViewClass;
                attributeViewInfo.componentParam = null;
            }
            var cls = feng3d.ClassUtils.getDefinitionByName(attributeViewInfo.component);
            var view = new cls(attributeViewInfo);
            return view;
        };
        ObjectView.prototype.getAttributeDefaultViewClassByType = function (type) {
            var defaultViewClass = null;
            var attributeDefaultViewClassByTypeVec = feng3d.$objectViewConfig.attributeDefaultViewClassByTypeVec;
            for (var i = 0; i < attributeDefaultViewClassByTypeVec.length; i++) {
                if (attributeDefaultViewClassByTypeVec[i].type == type) {
                    defaultViewClass = attributeDefaultViewClassByTypeVec[i];
                    break;
                }
            }
            return defaultViewClass;
        };
        /**
         * 获取块界面
         *
         * @static
         * @param {BlockViewInfo} blockViewInfo			块界面信息
         * @returns {egret.DisplayObject}				块界面
         *
         * @memberOf ObjectView
         */
        ObjectView.prototype.getBlockView = function (blockViewInfo) {
            if (blockViewInfo.component == null || blockViewInfo.component == "") {
                //返回默认对象属性界面类定义
                blockViewInfo.component = feng3d.$objectViewConfig.defaultObjectAttributeBlockView;
                blockViewInfo.componentParam = null;
            }
            var cls = feng3d.ClassUtils.getDefinitionByName(blockViewInfo.component);
            var view = new cls(blockViewInfo);
            return view;
        };
        /**
         * 获取对象信息
         * @param object
         * @return
         */
        ObjectView.prototype.getObjectInfo = function (object) {
            var classConfig = this.getClassConfig(object);
            var objectInfo = {
                objectAttributeInfos: this.getObjectAttributeInfos(object),
                objectBlockInfos: this.getObjectBlockInfos(object),
                name: feng3d.ClassUtils.getQualifiedClassName(object),
                owner: object,
                component: classConfig ? classConfig.component : "",
                componentParam: classConfig ? classConfig.componentParam : null
            };
            return objectInfo;
        };
        ObjectView.prototype.getClassConfig = function (object) {
            if (object == null || object == Object.prototype)
                return null;
            var className = feng3d.ClassUtils.getQualifiedClassName(object);
            var classConfigVec = feng3d.$objectViewConfig.classConfigVec;
            for (var i = 0; i < classConfigVec.length; i++) {
                if (classConfigVec[i].name == className) {
                    return classConfigVec[i];
                }
            }
            var superCls = feng3d.ClassUtils.getSuperClass(object);
            return this.getClassConfig(superCls);
        };
        /**
         * 获取对象属性列表
         */
        ObjectView.prototype.getObjectAttributeInfos = function (object, filterReg) {
            if (filterReg === void 0) { filterReg = /(([a-zA-Z0-9])+|(\d+))/; }
            var attributeNames = [];
            var classConfig = this.getClassConfig(object);
            if (classConfig && classConfig.attributeDefinitionVec) {
                //根据配置中默认顺序生产对象属性信息列表
                var attributeDefinitions = classConfig.attributeDefinitionVec;
                for (var i = 0; i < attributeDefinitions.length; i++) {
                    if (attributeNames.indexOf(attributeDefinitions[i].name) == -1)
                        attributeNames.push(attributeDefinitions[i].name);
                }
            }
            else {
                var attributeNames = Object.keys(object);
                attributeNames = attributeNames.filter(function (value, index, array) {
                    var result = filterReg.exec(value);
                    return result[0] == value;
                });
                attributeNames = attributeNames.sort();
            }
            var objectAttributeInfos = [];
            for (var i = 0; i < attributeNames.length; i++) {
                var objectAttributeInfo = this.getAttributeViewInfo(object, attributeNames[i]);
                objectAttributeInfos.push(objectAttributeInfo);
            }
            return objectAttributeInfos;
        };
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
        ObjectView.prototype.getObjectBlockInfos = function (object) {
            var objectBlockInfos = [];
            var dic = {};
            var objectBlockInfo;
            var objectAttributeInfos = this.getObjectAttributeInfos(object);
            //收集块信息
            var i = 0;
            var tempVec = [];
            for (i = 0; i < objectAttributeInfos.length; i++) {
                var blockName = objectAttributeInfos[i].block;
                objectBlockInfo = dic[blockName];
                if (objectBlockInfo == null) {
                    objectBlockInfo = dic[blockName] = { name: blockName, owner: object, itemList: [] };
                    tempVec.push(objectBlockInfo);
                }
                objectBlockInfo.itemList.push(objectAttributeInfos[i]);
            }
            //按快的默认顺序生成 块信息列表
            var blockDefinition;
            var pushDic = {};
            var classConfig = this.getClassConfig(object);
            if (classConfig && classConfig.blockDefinitionVec) {
                for (i = 0; i < classConfig.blockDefinitionVec.length; i++) {
                    blockDefinition = classConfig.blockDefinitionVec[i];
                    objectBlockInfo = dic[blockDefinition.name];
                    if (objectBlockInfo == null) {
                        objectBlockInfo = {
                            name: blockDefinition.name,
                            owner: object,
                            itemList: []
                        };
                    }
                    objectBlockInfo.component = blockDefinition.component;
                    objectBlockInfo.componentParam = blockDefinition.componentParam;
                    objectBlockInfos.push(objectBlockInfo);
                    pushDic[objectBlockInfo.name] = true;
                }
            }
            //添加剩余的块信息
            for (i = 0; i < tempVec.length; i++) {
                if (Boolean(pushDic[tempVec[i].name]) == false) {
                    objectBlockInfos.push(tempVec[i]);
                }
            }
            return objectBlockInfos;
        };
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
        ObjectView.prototype.getAttributeViewInfo = function (object, attributeName) {
            var attributeDefinition = this.getAttributeDefinition(object, attributeName);
            var objectAttributeInfo = {
                name: attributeName,
                block: attributeDefinition ? attributeDefinition.block : "",
                component: attributeDefinition ? attributeDefinition.component : "",
                componentParam: attributeDefinition ? attributeDefinition.componentParam : null,
                owner: object,
                writable: true,
                type: feng3d.ClassUtils.getQualifiedClassName(object[attributeName])
            };
            return objectAttributeInfo;
        };
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
        ObjectView.prototype.getAttributeDefinition = function (object, attributeName) {
            var classConfig = this.getClassConfig(object);
            if (!classConfig || !classConfig.attributeDefinitionVec)
                return null;
            for (var i = 0; i < classConfig.attributeDefinitionVec.length; i++) {
                var attributeDefinition = classConfig.attributeDefinitionVec[i];
                if (attributeDefinition.name == attributeName)
                    return attributeDefinition;
            }
            return null;
        };
        return ObjectView;
    }());
    feng3d.ObjectView = ObjectView;
    feng3d.objectview = new ObjectView();
})(feng3d || (feng3d = {}));
//# sourceMappingURL=objectview.js.map