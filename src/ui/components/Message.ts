namespace editor
{
    enum MessageType
    {
        Normal,
        Error,
    }
    /**
     * 消息模块
     * 
     * 用于显示提示信息，例如屏幕中间的上浮信息
     */
    export class Message
    {
        private _messages: [MessageType, string][] = [];
        private _showMessageIndex = 0;
        private _messageLabelPool: eui.Label[] = [];
        /**
         * 显示间隔
         */
        private _interval = 400;

        constructor()
        {
            feng3d.globalDispatcher.on("message", this._onMessage, this);
            feng3d.globalDispatcher.on("message.error", this._onErrorMessage, this);
        }

        private _onMessage(event: feng3d.Event<string>)
        {
            this._messages.push([MessageType.Normal, event.data]);
            feng3d.ticker.on(this._interval, this._showMessage, this);
        }

        private _onErrorMessage(event: feng3d.Event<string>)
        {
            this._messages.push([MessageType.Error, event.data]);
            feng3d.ticker.on(this._interval, this._showMessage, this);
        }

        private _getMessageItem(message: [MessageType, string])
        {
            var label = this._messageLabelPool.pop();
            if (!label)
            {
                label = new eui.Label();
            }
            label.size = 30;
            label.alpha = 1;
            label.text = message[1];
            switch (message[0])
            {
                case MessageType.Error:
                    label.textColor = 0xff0000;
                    break;
                default:
                    label.textColor = 0xffffff;
                    break;
            }
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
            showItem.y = (editorui.stage.stageHeight - showItem.height) / 4;
            editorui.messageLayer.addChild(showItem);
            //
            egret.Tween.get(showItem).to({ y: (editorui.stage.stageHeight - showItem.height) / 8, alpha: 0 }, 1000, egret.Ease.sineIn).call(() =>
            {
                editorui.messageLayer.removeChild(showItem);
                this._messageLabelPool.push(showItem);
            });
        }
    }
}