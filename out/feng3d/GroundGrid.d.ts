declare namespace feng3d.editor {
    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    class GroundGrid extends Component {
        private num;
        private segmentGeometry;
        private level;
        private step;
        private groundGridObject;
        constructor(gameObject: GameObject);
        /**
         * 创建地面网格对象
         */
        private init();
        private update();
    }
}
