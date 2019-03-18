/**
 * 快捷键配置
 */
declare var shortcutConfig: ({
    key: string;
    command: string;
    stateCommand: string;
    when: string;
} | {
    key: string;
    command: string;
    when: string;
    stateCommand?: undefined;
} | {
    key: string;
    stateCommand: string;
    when: string;
    command?: undefined;
})[];
//# sourceMappingURL=ShortcutConfig.d.ts.map