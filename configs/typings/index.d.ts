/** 快捷方式配置，该配置在resource目录下，通过index.html加载 */
declare var shortcutConfig: {
    /** keys */
    key: string;
    command: string;
    stateCommand?: string,
    when?: string;
}[];

/** 创建3D对象配置 */
declare var createObjectConfig: { label: string; className: string; }[];