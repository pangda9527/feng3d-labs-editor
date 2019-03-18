namespace editor
{
    //
    feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
    feng3d.objectview.defaultObjectViewClass = "OVDefault";
    feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
    feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";
    //
    feng3d.objectview.setDefaultTypeAttributeView("Boolean", { component: "OAVBoolean" });
    feng3d.objectview.setDefaultTypeAttributeView("String", { component: "OAVString" });
    feng3d.objectview.setDefaultTypeAttributeView("number", { component: "OAVNumber" });
    feng3d.objectview.setDefaultTypeAttributeView("Vector3", { component: "OAVVector3D" });
    feng3d.objectview.setDefaultTypeAttributeView("Array", { component: "OAVArray" });
    feng3d.objectview.setDefaultTypeAttributeView("Function", { component: "OAVFunction" });
    feng3d.objectview.setDefaultTypeAttributeView("Color3", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("Color4", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("Texture2D", { component: "OAVTexture2D" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxGradient", { component: "OAVMinMaxGradient" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxCurve", { component: "OAVMinMaxCurve" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxCurveVector3", { component: "OAVMinMaxCurveVector3" });
    //
}