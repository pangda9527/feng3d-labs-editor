/**
 * ObjectView总配置数据
 */
var objectViewConfig = {

    defaultBaseObjectViewClass: "feng3d.DefaultBaseObjectView",
    defaultObjectViewClass: "feng3d.DefaultObjectView",
    defaultObjectAttributeViewClass: "feng3d.DefaultObjectAttributeView",
    defaultObjectAttributeBlockView: "feng3d.DefaultObjectBlockView",
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
            name: "feng3d.Object3D",
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
                    component: "feng3d.editor.OAVObject3DComponent",
                    block: ""
                }
            ],
            blockDefinitionVec: []
        },
        {
            name: "feng3d.Transform",
            component: "",
            componentParam: null,
            attributeDefinitionVec: [
                {
                    name: "position",
                    block: ""
                },
                {
                    name: "rotation",
                    block: ""
                },
                {
                    name: "scale",
                    block: ""
                }
            ],
            blockDefinitionVec: []
        }
    ]
}