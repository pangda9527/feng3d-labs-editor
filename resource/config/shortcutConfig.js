//	key					[必须]	快捷键；用“+”连接多个按键，“!”表示没按下某键；例如 “a+!b”表示按下“a”与没按下“b”时触发。
//	command				[可选]	要执行的command的id；使用“,”连接触发多个命令；例如 “commandA,commandB”表示满足触发条件后依次执行commandA与commandB命令。
//	stateCommand		[可选]	要执行的状态命令id；使用“,”连接触发多个状态命令，没带“!”表示激活该状态，否则表示使其处于非激活状态；例如 “stateA,!stateB”表示满足触发条件后激活状态“stateA，使“stateB处于非激活状态。
//	when				[可选]	快捷键激活的条件；使用“+”连接多个状态，没带“!”表示需要处于激活状态，否则需要处于非激活状态； 例如 “stateA+!stateB”表示stateA处于激活状态且stateB处于非激活状态时会判断按键是否满足条件。

var shortcutConfig = [ //
	{ key: "rightmousedown", command: "fpsViewStart", stateCommand: "fpsViewing", when: "mouseInView3D" },
	{ key: "rightmouseup", command: "fpsViewStop", stateCommand: "!fpsViewing", when: "fpsViewing" },
	{ key: "f", command: "lookToSelectedObject3D", when: "" },
	{ key: "w", command: "object3DMoveTool", when: "!fpsViewing" },
	{ key: "e", command: "object3DRotationTool", when: "!fpsViewing" },
	{ key: "r", command: "object3DScaleTool", when: "!fpsViewing" },
	{ key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "" },
	{ key: "mousemove", command: "mouseRotateScene", when: "mouseRotateSceneing" },
	{ key: "mouseup", stateCommand: "!mouseRotateSceneing", when: "mouseRotateSceneing" },
	{ key: "middlemousedown", command: "dragSceneStart", stateCommand: "dragSceneing", when: "mouseInView3D" },
	{ key: "mousemove", command: "dragScene", when: "dragSceneing" },
	{ key: "middlemouseup", stateCommand: "!dragSceneing", when: "dragSceneing" },
	{ key: "del+!ctrl", command: "deleteSeletedObject3D", when: "" },


]

// 可用命令
// - fpsViewStart						启动fps浏览场景
// - fpsViewStop						停止fps浏览场景
// - lookToSelectedObject3D				看向选中目标
// - object3DMoveTool					启动3D对象移动工具
// - object3DRotationTool				启动3D对象旋转工具
// - object3DScaleTool					启动3D对象缩放工具
// - mouseRotateSceneStart				启动场景旋转
// - mouseRotateScene					旋转场景
// - dragSceneStart						启动拖拽场景
// - dragScene							拖拽场景

// 可用状态
// - mouseInView3D						鼠标在3D视图中
// - fpsViewing							fps浏览场景中
// - mouseRotateSceneing				旋转场景中
// - dragSceneing						拖拽场景中

// 可用按键（按键均为小写）
// - a-z

// - ctrl
// - shift
// - escape
// - alt
// - del

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