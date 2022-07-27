import { shortcut } from 'feng3d';
export { };

// 调整默认字体大小
egret.TextField.default_size = 12;

// 扩展焦点在文本中时 禁止出发快捷键
const oldfocusHandler = egret.InputController.prototype['focusHandler'];
egret.InputController.prototype['focusHandler'] = function (event)
{
    oldfocusHandler.call(this, event);
    shortcut.enable = !this._isFocus;
};

const oldblurHandler = egret.InputController.prototype['blurHandler'];
egret.InputController.prototype['blurHandler'] = function (event)
{
    oldblurHandler.call(this, event);
    shortcut.enable = !this._isFocus;
};

//     // 扩展 TextInput , 焦点在文本中时，延缓外部通过text属性赋值到失去焦点时生效
//     var descriptor = Object.getOwnPropertyDescriptor(eui.TextInput.prototype, "text");
//     var oldTextSet = descriptor.set;
//     descriptor.set = function (value)
//     {
//         if (this["isFocus"])
//         {
//             this["__temp_value__"] = value;
//         }
//         else
//         {
//             oldTextSet.call(this, value);
//         }
//     }
//     Object.defineProperty(eui.TextInput.prototype, "text", descriptor);

//     var oldFocusOutHandler = eui.TextInput.prototype["focusOutHandler"];
//     eui.TextInput.prototype["focusOutHandler"] = function (event)
//     {
//         oldFocusOutHandler.call(this, event);
//         if (this["__temp_value__"] != undefined)
//         {
//             this["text"] = this["__temp_value__"];
//             delete this["__temp_value__"];
//         }
//     }
