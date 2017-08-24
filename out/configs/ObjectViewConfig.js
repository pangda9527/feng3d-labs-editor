var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        function objectViewConfig() {
            //
            objectview.defaultBaseObjectViewClass = "DefaultBaseObjectView";
            objectview.defaultObjectViewClass = "DefaultObjectView";
            objectview.defaultObjectAttributeViewClass = "DefaultObjectAttributeView";
            objectview.defaultObjectAttributeBlockView = "DefaultObjectBlockView";
            //
            objectview.defaultTypeAttributeView["Boolean"] = { component: "BooleanAttrView" };
            objectview.defaultTypeAttributeView["Vector3D"] = { component: "OAVVector3D" };
            setObjectview(feng3d.Transform, {
                component: "",
                componentParam: null,
                attributeDefinitionVec: [
                    { name: "x", block: "" },
                    { name: "y", block: "" },
                    { name: "z", block: "" },
                    { name: "rx", block: "" },
                    { name: "ry", block: "" },
                    { name: "rz", block: "" },
                    { name: "sx", block: "" },
                    { name: "sy", block: "" },
                    { name: "sz", block: "" },
                ],
                blockDefinitionVec: []
            });
            setObjectview(feng3d.GameObject, {
                component: "",
                componentParam: null,
                attributeDefinitionVec: [
                    {
                        name: "name",
                        block: ""
                    },
                    {
                        name: "visible",
                        block: ""
                    },
                    {
                        name: "mouseEnabled",
                        block: ""
                    },
                    {
                        name: "components",
                        component: "OAVObject3DComponentList",
                        block: ""
                    }
                ],
                blockDefinitionVec: []
            });
            setObjectview(feng3d.Renderer, {
                component: "",
                componentParam: null,
                attributeDefinitionVec: [
                    {
                        name: "enabled",
                        block: ""
                    },
                    {
                        name: "material",
                        block: ""
                    },
                ],
                blockDefinitionVec: []
            });
            function setObjectview(cls, classDefinition) {
                cls["objectview"] = classDefinition;
            }
        }
        editor.objectViewConfig = objectViewConfig;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=ObjectViewConfig.js.map