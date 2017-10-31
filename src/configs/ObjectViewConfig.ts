module feng3d.editor
{
    export function objectViewConfig()
    {
        //
        objectview.defaultBaseObjectViewClass = "OVBaseDefault";
        objectview.defaultObjectViewClass = "OVDefault";
        objectview.defaultObjectAttributeViewClass = "OAVDefault";
        objectview.defaultObjectAttributeBlockView = "OBVDefault";
        //
        objectview.defaultTypeAttributeView["Boolean"] = { component: "BooleanAttrView" };
        objectview.defaultTypeAttributeView["number"] = { component: "OAVNumber" };
        objectview.defaultTypeAttributeView["Vector3D"] = { component: "OAVVector3D" };
        objectview.defaultTypeAttributeView["Array"] = { component: "OAVArray" };

        function setObjectview(cls: any, classDefinition: ClassDefinition)
        {
            cls["objectview"] = classDefinition;
        }
    }
}