namespace editor
{
    /**
     * 消息模块
     * 
     * 用于显示提示信息，例如屏幕中间的上浮信息
     */
    export class Message
    {
        constructor()
        {
            feng3d.dispatcher.on("message", this.onMessage, this);
        }

        private onMessage(event: feng3d.Event<string>)
        {
            console.log(event.data);
        }
    }
}