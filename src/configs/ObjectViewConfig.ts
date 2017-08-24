namespace feng3d.editor
{
    export function objectViewConfig()
    {
        //
        objectview.defaultBaseObjectViewClass = "DefaultBaseObjectView";
        objectview.defaultObjectViewClass = "DefaultObjectView";
        objectview.defaultObjectAttributeViewClass = "DefaultObjectAttributeView";
        objectview.defaultObjectAttributeBlockView = "DefaultObjectBlockView";
        //
        objectview.defaultTypeAttributeView["Boolean"] = { component: "BooleanAttrView" };
        objectview.defaultTypeAttributeView["Vector3D"] = { component: "OAVVector3D" };

        setObjectview(Transform, {
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

        setObjectview(GameObject, {
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

        setObjectview(Renderer, {
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

        function setObjectview(cls: any, classDefinition: ClassDefinition)
        {
            cls["objectview"] = classDefinition;
        }
    }
}