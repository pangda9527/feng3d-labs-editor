namespace egret
{
    export interface DisplayObject
    {
        /**
         * 获取显示对象的全局测量边界
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         */
        getGlobalBounds(resultRect?: feng3d.Rectangle): feng3d.Rectangle;
    }

    // 注 使用 DisplayObject.prototype.getTransformedBounds 计算全局测量边界存在bug，因此扩展 getGlobalBounds 用于代替使用
    DisplayObject.prototype["getGlobalBounds"] = function (resultRect?: feng3d.Rectangle)
    {
        var min = this.localToGlobal(0, 0);
        var max = this.localToGlobal(this.width, this.height);
        resultRect = resultRect || new feng3d.Rectangle();
        resultRect.x = min.x;
        resultRect.y = min.y;
        resultRect.width = max.x - min.x;
        resultRect.height = max.y - min.y;
        return resultRect;
    }
}