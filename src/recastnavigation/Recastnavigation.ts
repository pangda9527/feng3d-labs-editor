namespace editor
{
    /**
     * 重铸导航
     * 
     *  将接收的网格模型转换为导航网格数据
     * 
     * #### 设计思路
     * 1. 将接收到的网格模型的所有三角形栅格化为体素保存到三维数组内
     * 1. 遍历所有体素计算出可行走体素
     * 1. 构建可行走轮廓
     * 1. 构建可行走（导航）网格
     * 
     * #### 参考
     * @see https://github.com/recastnavigation/recastnavigation
     */
    export class Recastnavigation
    {
        /**
         * 执行重铸导航
         */
        doRecastnavigation(mesh: { positions: number[], indices: number[] },)
        {
            
        }

        /**
         * 栅格化三角形
         */
        private rcRasterizeTriangles()
        {

        }
    }
}