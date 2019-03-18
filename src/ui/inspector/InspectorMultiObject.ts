import { AssetNode } from "../assets/AssetNode";

export var inspectorMultiObject: InspectorMultiObject;

/**
 * 检查器多对象
 * 
 * 处理多个对象在检查器中显示问题
 */
export class InspectorMultiObject
{
    convertInspectorObject(objects: any[]): any
    {
        if (objects.length == 0) return 0;
        if (objects.length == 1) return objects[0];

        var data: { [type: string]: any[] } = {};
        objects.forEach(element =>
        {
            if (element instanceof AssetNode)
            {
                element = element.asset;
            }
            var type = feng3d.classUtils.getQualifiedClassName(element);
            var list = data[type] = data[type] || [];
            list.push(element);
        });

        var l = [];
        for (const type in data)
        {
            var element = data[type];
            l.push(`${element.length} ${type}`);
        }

        l.unshift(`${objects.length} Objects\n`);
        return l.join("\n\t");
    }
}

inspectorMultiObject = new InspectorMultiObject();