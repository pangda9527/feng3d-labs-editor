namespace feng3d.editor
{
    //
    objectview.defaultBaseObjectViewClass = "OVBaseDefault";
    objectview.defaultObjectViewClass = "OVDefault";
    objectview.defaultObjectAttributeViewClass = "OAVDefault";
    objectview.defaultObjectAttributeBlockView = "OBVDefault";
    //
    objectview.setDefaultTypeAttributeView("Boolean", { component: "BooleanAttrView" });
    objectview.setDefaultTypeAttributeView("number", { component: "OAVNumber" });
    objectview.setDefaultTypeAttributeView("Vector3", { component: "OAVVector3D" });
    objectview.setDefaultTypeAttributeView("Array", { component: "OAVArray" });
    objectview.setDefaultTypeAttributeView("Function", { component: "OAVFunction" });
    objectview.setDefaultTypeAttributeView("Color3", { component: "OAVColorPicker" });
    objectview.setDefaultTypeAttributeView("Color4", { component: "OAVColorPicker" });
    objectview.setDefaultTypeAttributeView("Texture2D", { component: "OAVTexture2D" });
}