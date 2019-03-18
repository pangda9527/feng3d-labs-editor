declare namespace egret {
    /**
     * 扩展鼠标事件，增加鼠标 按下、弹起、移动、点击、移入、移出、右击、双击事件
     */
    type MouseEvent = egret.TouchEvent;
    var MouseEvent: {
        prototype: TouchEvent;
        new (): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: "mousedown";
        /** 鼠标弹起 */
        MOUSE_UP: "mouseup";
        /** 鼠标移动 */
        MOUSE_MOVE: "mousemove";
        /** 鼠标单击 */
        CLICK: "click";
        /** 鼠标中键按下 */
        MIDDLE_MOUSE_DOWN: "middlemousedown";
        /** 鼠标中键弹起 */
        MIDDLE_MOUSE_UP: "middlemouseup";
        /** 鼠标中键点击 */
        MIDDLE_Click: "middleclick";
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
        /** 右键按下 */
        RIGHT_MOUSE_DOWN: "rightmousedown";
        /** 鼠标右键弹起 */
        RIGHT_MOUSE_UP: "rightmouseup";
        /** 右键点击 */
        RIGHT_CLICK: "rightclick";
        /** 双击 */
        DOUBLE_CLICK: "dblclick";
    };
    var mouseEventEnvironment: () => void;
}
//# sourceMappingURL=MouseEvent.d.ts.map