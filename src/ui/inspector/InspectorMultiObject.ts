namespace editor
{
    export var inspectorMultiObject: InspectorMultiObject;

    /**
     * 检查器多对象
     * 
     * 处理多个对象在检查器中显示问题
     */
    export class InspectorMultiObject
    {
        convertInspectorObject(selectedObjects: (feng3d.GameObject | AssetsFile)[]): any
        {
            var selectedObjects = editorData.selectedObjects;
            if (selectedObjects && selectedObjects.length > 0)
                return selectedObjects[0];
            else
                return null;
        }

    }

    inspectorMultiObject = new InspectorMultiObject();
}