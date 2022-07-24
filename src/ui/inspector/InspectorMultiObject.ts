
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

        objects = objects.map(element =>
        {
            if (element instanceof AssetNode)
            {
                if (element.asset.data)
                    element = element.asset.data;
                else
                    element = element.asset;
            }
            return element;
        });

        if (objects.length == 1) return objects[0];

        var data: { [type: string]: any[] } = {};
        objects.forEach(element =>
        {
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
