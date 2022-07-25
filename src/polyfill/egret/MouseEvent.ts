import { windowEventProxy } from 'feng3d';

export { };
declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace egret
    {
        export interface Stage
        {
            stageX: number;
            stageY: number;
        }

        /**
         * 扩展鼠标事件，增加鼠标 按下、弹起、移动、点击、移入、移出、右击、双击事件
         */
        export type MouseEvent = egret.TouchEvent;
        export let MouseEvent: {
            prototype: TouchEvent;
            new(): TouchEvent;
            /** 鼠标按下 */
            MOUSE_DOWN: 'mousedown';
            /** 鼠标弹起 */
            MOUSE_UP: 'mouseup';
            /** 鼠标移动 */
            MOUSE_MOVE: 'mousemove';
            /** 鼠标单击 */
            CLICK: 'click';
            /** 鼠标中键按下 */
            MIDDLE_MOUSE_DOWN: 'middlemousedown';
            /** 鼠标中键弹起 */
            MIDDLE_MOUSE_UP: 'middlemouseup';
            /** 鼠标中键点击 */
            MIDDLE_Click: 'middleclick';
            /** 鼠标移出 */
            MOUSE_OUT: 'mouseout';
            /** 鼠标移入 */
            MOUSE_OVER: 'mouseover';
            /** 右键按下 */
            RIGHT_MOUSE_DOWN: 'rightmousedown';
            /** 鼠标右键弹起 */
            RIGHT_MOUSE_UP: 'rightmouseup';
            /** 右键点击 */
            RIGHT_CLICK: 'rightclick';
            /** 双击 */
            DOUBLE_CLICK: 'dblclick';
        };

    }
}

egret.MouseEvent = egret.TouchEvent as any;

(() =>
{
    // 映射事件名称
    egret.MouseEvent.MOUSE_DOWN = 'mousedown';
    egret.MouseEvent.MIDDLE_MOUSE_DOWN = 'middlemousedown';
    egret.MouseEvent.MOUSE_UP = 'mouseup';
    egret.MouseEvent.MIDDLE_MOUSE_UP = 'middlemouseup';
    egret.MouseEvent.RIGHT_MOUSE_UP = 'rightmouseup';
    egret.MouseEvent.MOUSE_MOVE = 'mousemove';
    egret.MouseEvent.CLICK = 'click';
    egret.MouseEvent.MIDDLE_Click = 'middleclick';
    egret.MouseEvent.MOUSE_OUT = 'mouseout';
    egret.MouseEvent.RIGHT_MOUSE_DOWN = 'rightmousedown';
    egret.MouseEvent.RIGHT_CLICK = 'rightclick';
    egret.MouseEvent.DOUBLE_CLICK = 'dblclick';
    //
})();

let overDisplayObject: egret.DisplayObject;
export const mouseEventEnvironment = () =>
{
    // 鼠标按下时选中对象
    let mousedownObject: egret.DisplayObject;
    // /**
    //  * 鼠标按下的按钮编号
    //  */
    // var mousedownButton: number;
    const webTouchHandler: { canvas: HTMLCanvasElement, touch: egret.sys.TouchHandler, getLocation(event: any): egret.Point } = getWebTouchHandler();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const canvas: HTMLCanvasElement = webTouchHandler.canvas;
    const touch: egret.sys.TouchHandler = webTouchHandler.touch;

    webTouchHandler.canvas.addEventListener('mousemove', onMouseMove);

    windowEventProxy.on('mousedown', (event) =>
    {
        const e = event.data;
        const location = webTouchHandler.getLocation(e);
        const x = location.x;
        const y = location.y;

        const target = touch['findTarget'](x, y);

        // mousedownButton = e.button;
        mousedownObject = target;
        if (e.button === 0)
        {
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_DOWN, true, true, x, y);
        }
        else if (e.button === 1)
        {
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_DOWN, true, true, x, y);
        }
        else if (e.button === 2)
        {
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_DOWN, true, true, x, y);
        }
    });

    windowEventProxy.on('mouseup', (event) =>
    {
        const e = event.data;
        // 右键按下
        const location = webTouchHandler.getLocation(e);
        const x = location.x;
        const y = location.y;

        const target: egret.DisplayObject = touch['findTarget'](x, y);

        if (e.button === 0)
        {
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_UP, true, true, x, y);
            if (mousedownObject === target)
            {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.CLICK, true, true, x, y);
            }
        }
        else if (e.button === 1)
        {
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_UP, true, true, x, y);
            if (mousedownObject === target)
            {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_Click, true, true, x, y);
            }
        }
        else if (e.button === 2)
        {
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_UP, true, true, x, y);
            if (mousedownObject === target)
            {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_CLICK, true, true, x, y);
            }
        }
        mousedownObject = null;
    });
    windowEventProxy.on('dblclick', (e) =>
    {
        const location = webTouchHandler.getLocation(e);
        const x = location.x;
        const y = location.y;

        const target: egret.DisplayObject = touch['findTarget'](x, y);
        egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.DOUBLE_CLICK, true, true, x, y);
    });

    // 调试，查看鼠标下的对象
    windowEventProxy.on('keyup', (event) =>
    {
        const e = event.data;
        if (e.key === 'p')
        {
            const location = webTouchHandler.getLocation(e);
            let target: egret.DisplayObject = touch['findTarget'](location.x, location.y);
            const arr = [target];
            while (target.parent)
            {
                target = target.parent;
                arr.push(target);
            }
            window['earr'] = arr;
            console.log(arr);
        }
    });

    function onMouseMove(event: globalThis.MouseEvent)
    {
        const location = webTouchHandler.getLocation(event);
        const x = location.x;
        const y = location.y;

        const target: egret.DisplayObject = touch['findTarget'](x, y);
        target.stage.stageX = x;
        target.stage.stageY = y;
        egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_MOVE, true, true, x, y);
        if (target === overDisplayObject)
        {
            return;
        }
        const preOverDisplayObject = overDisplayObject;
        overDisplayObject = target;
        if (preOverDisplayObject)
        {
            egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, egret.MouseEvent.MOUSE_OUT, true, true, x, y);
        }
        if (overDisplayObject)
        {
            egret.TouchEvent.dispatchTouchEvent(overDisplayObject, egret.MouseEvent.MOUSE_OVER, true, true, x, y);
        }
    }

    function getWebTouchHandler()
    {
        const list = document.querySelectorAll('.egret-player');
        const length = list.length;
        let player = null;
        for (let i = 0; i < length; i++)
        {
            const container = <HTMLDivElement>list[i];
            player = container['egret-player'];
            if (player)
            { break; }
        }

        return player.webTouchHandler;
    }
};
