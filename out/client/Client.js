var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.client = {
            callServer: callServer
        };
        var callbackMap = {};
        var callbackAutoID = 0;
        //阻塞信息
        var blockMsgs = [];
        var ws;
        /**
         * 调用服务端方法
         * @param objectid 服务端对象编号
         * @param func 方法名称
         * @param param 参数
         */
        function callServer(objectid, func, param, callback) {
            var callbackid = callbackAutoID++;
            callbackMap[callbackid] = callback;
            var msg = { objectid: objectid, func: func, param: param, callbackid: callbackid };
            send(msg);
        }
        function send(msg) {
            if (ws && ws.readyState == ws.OPEN) {
                ws.send(JSON.stringify(msg));
            }
            else {
                blockMsgs.push(msg);
                readyWS(function (ws) {
                    blockMsgs.forEach(function (element) {
                        ws.send(JSON.stringify(element));
                    });
                    blockMsgs.length = 0;
                });
            }
        }
        function readyWS(callback) {
            if (ws) {
                if (ws.readyState == ws.OPEN) {
                    callback(ws);
                    return;
                }
                if (ws.readyState == ws.CONNECTING) {
                    return;
                }
                ws.onopen = null;
                ws.onmessage = null;
            }
            ws = new WebSocket("ws://localhost:8181");
            ws.onopen = function (e) {
                console.log('Connection to server opened');
                callback(ws);
            };
            ws.onmessage = function (ev) {
                var msg = JSON.parse(ev.data);
                if (msg.callbackid !== undefined) {
                    var callback = callbackMap[msg.callbackid];
                    if (callback)
                        callback.apply(null, msg.data);
                    else
                        console.log("收到服务器回调信息", msg);
                    delete callbackMap[msg.callbackid];
                }
            };
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Client.js.map