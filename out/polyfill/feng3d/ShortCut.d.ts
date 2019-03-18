declare namespace feng3d {
    /**
     * (快捷键)状态列表
     */
    var shortCutStates: {
        disableScroll: string;
    };
    /**
     * (快捷键)状态列表
     */
    type ShortCutStates = typeof shortCutStates;
    interface ShortCut {
        activityState<K extends keyof ShortCutStates>(state: K): void;
        deactivityState<K extends keyof ShortCutStates>(state: K): void;
        getState<K extends keyof ShortCutStates>(state: K): boolean;
    }
}
//# sourceMappingURL=ShortCut.d.ts.map