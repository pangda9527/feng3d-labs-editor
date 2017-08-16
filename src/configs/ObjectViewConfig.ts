/**
 * ObjectView总配置数据
 */
var objectViewConfig = {

    defaultBaseObjectViewClass: "feng3d.editor.DefaultBaseObjectView",
    defaultObjectViewClass: "feng3d.editor.DefaultObjectView",
    defaultObjectAttributeViewClass: "feng3d.editor.DefaultObjectAttributeView",
    defaultObjectAttributeBlockView: "feng3d.editor.DefaultObjectBlockView",
    attributeDefaultViewClassByTypeVec: [
        {
            type: "Boolean",
            component: "feng3d.editor.BooleanAttrView"
        },
        {
            type: "feng3d.Vector3D",
            component: "feng3d.editor.OAVVector3D"
        }
    ],
    classConfigVec: [
        {
            name: "feng3d.Transform",
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
        },
        {
            name: "feng3d.GameObject",
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
                    component: "feng3d.editor.OAVObject3DComponentList",
                    block: ""
                }
            ],
            blockDefinitionVec: []
        },
        {
            name: "feng3d.Renderer",
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
        },
    ]
}