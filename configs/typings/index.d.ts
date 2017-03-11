/// <reference path="../../objectview/out/objectview.d.ts" />

/**
 * 快捷键配置
 */
declare var shortcutConfig: {
    key: string;
    command?: string;
    stateCommand?: string;
    when?: string;
}[];

/**
 * 层级界面创建3D对象列表数据
 */
declare var createObjectConfig: { label: string; className: string; }[];

declare var createObject3DComponentConfig: { label: string; className: string; }[];

/**
 * ObjectView总配置数据
 */
declare var objectViewConfig: feng3d.ObjectViewConfig;