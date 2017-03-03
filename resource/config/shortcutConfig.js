var shortcutConfig = [ //
	{ "key": "rightmousedown", "command": "fpsViewStart", stateCommand: "fpsViewing", "when": "mouseInView3D" },
	{ "key": "rightmouseup", "command": "fpsViewStop", stateCommand: "!fpsViewing", "when": "fpsViewing" },
	{ "key": "f", "command": "lookToSelectedObject3D", "when": "" },
	{ "key": "w", "command": "object3DMoveTool", "when": "!fpsViewing" },
	{ "key": "e", "command": "object3DRotationTool", "when": "!fpsViewing" },
	{ "key": "r", "command": "object3DScaleTool", "when": "!fpsViewing" },
	{ "key": "alt+mousedown", "command": "mouseRotateSceneStart", "stateCommand": "mouseRotateSceneing", "when": "" }, //启动3D对象缩放工具
	{ "key": "mousemove", "command": "mouseRotateScene", "when": "mouseRotateSceneing" }, //启动3D对象缩放工具
	{ "key": "mouseup", "stateCommand": "!mouseRotateSceneing", "when": "mouseRotateSceneing" }, //启动3D对象缩放工具


]

// 可用命令
// - fpsViewStart						启动fps浏览场景
// - fpsViewStop						停止fps浏览场景
// - lookToSelectedObject3D				看向选中目标
// - object3DMoveTool					启动3D对象移动工具
// - object3DRotationTool				启动3D对象旋转工具
// - object3DScaleTool					启动3D对象缩放工具

// 可用状态
// - mouseInView3D		鼠标在3D视图中
// - fpsViewing			fps浏览场景

// 可用按键（按键均为小写）
// - a-z
// - ctrl
// - shift
// - escape
// - alt
// - doubleclick
// - click
// - mousedown
// - mouseup
// - middleclick
// - middlemousedown
// - middlemouseup
// - rightclick
// - rightmousedown
// - rightmouseup
// - mousemove
// - mouseover
// - mouseout
// - mousewheel