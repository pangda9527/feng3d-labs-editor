/// <reference path="../feng3d/out/feng3d.d.ts" />
/// <reference path="../feng3d/typings/index.d.ts" />
/// <reference path="../objectview/out/objectview.d.ts" />

/// <reference path="../libs/modules/egret/egret.d.ts" />
/// <reference path="../libs/modules/eui/eui.d.ts" />
/// <reference path="../libs/modules/res/res.d.ts" />
/// <reference path="../libs/modules/tween/tween.d.ts" />
/// <reference path="../libs/exml.e.d.ts" />

/// <reference path="globals/github-electron/index.d.ts" />
/// <reference path="globals/node/index.d.ts" />

/** 快捷方式配置，该配置在resource目录下，通过index.html加载 */
declare var shortcutConfig: ({ key: string; command: string; when: string; } | { key: string; command: string; })[];