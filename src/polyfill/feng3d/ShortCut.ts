namespace feng3d
{
    /**
     * (快捷键)状态列表
     */
    export var shortCutStates = {
        disableScroll: "禁止滚动"
    };

    /**
     * (快捷键)状态列表
     */
    export type ShortCutStates = typeof shortCutStates;

    export interface ShortCut
    {
        activityState<K extends keyof ShortCutStates>(state: K): void;

        deactivityState<K extends keyof ShortCutStates>(state: K): void;

        getState<K extends keyof ShortCutStates>(state: K): boolean
    }
}