
var file = require("../native/file.js").file;

var ws = require("ws");

var wss = new ws.Server({ port: 8181 });

console.log(`开启editorserver`);

var serverObject = { file: file };

wss.on('connection', function (ws)
{
    console.log('client connected');
    ws.on('message', function (message)
    {
        console.log(message);
        var msg = JSON.parse(message);
        if (msg.objectid)
        {
            callServer(msg);
            return;
        }
    });

    /**
     * 
     * @param {{ objectid: string, func: string, param: any[], callbackid: number }} msg 
     */
    function callServer(msg)
    {
        var obj = serverObject[msg.objectid];
        if (!obj)
        {
            console.warn(`服务端未提供 ${msg.objectid} 处理对象！`);
            return;
        }
        var param = msg.param.concat();
        param.push(callback);
        console.assert(obj[msg.func], `${obj} 中未提供 ${msg.func} 方法！`);
        console.assert(obj[msg.func].length == param.length, `传入 ${obj}.${msg.func} 参数数量不对！`);
        obj[msg.func].apply(file, param);

        /**
         * 
         * @param {any[]} data 
         */
        function callback(...data)
        {
            var remsg = { callbackid: msg.callbackid, data: data };
            ws.send(JSON.stringify(remsg));
        }
    }
});
