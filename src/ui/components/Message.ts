namespace editor
{
    /**
     * 消息模块
     * 
     * 用于显示提示信息，例如屏幕中间的上浮信息
     */
    export class Message
    {
        private _messages: string[] = [];
        private _showMessageIndex = 0;
        private _messageLabelPool: eui.Label[] = [];
        /**
         * 显示间隔
         */
        private interval = 100;

        constructor()
        {
            feng3d.dispatcher.on("message", this._onMessage, this);
        }

        private _onMessage(event: feng3d.Event<string>)
        {
            this._messages.push(event.data);
            feng3d.ticker.on(this.interval, this._showMessage, this);
        }

        private _getMessageItem(message: string)
        {
            var label = this._messageLabelPool.pop();
            if (!label)
            {
                label = new eui.Label();
            }
            label.size = 30;
            label.alpha = 1;
            label.text = message;
            return label;
        }

        private _showMessage()
        {
            if (this._showMessageIndex >= this._messages.length)
            {
                this._showMessageIndex = 0;
                this._messages = [];
                return;
            }
            let message = this._messages[this._showMessageIndex++];
            let showItem = this._getMessageItem(message);

            //
            showItem.x = (editorui.stage.stageWidth - showItem.width) / 2;
            showItem.y = (editorui.stage.stageHeight - showItem.height) / 2;
            editorui.messageLayer.addChild(showItem);
            //
            egret.Tween.get(showItem).to({ y: showItem.y - 100, alpha: 0 }, 1000, egret.Ease.sineIn).call(() =>
            {
                editorui.messageLayer.removeChild(showItem);
                this._messageLabelPool.push(showItem);
            });
        }
    }
}