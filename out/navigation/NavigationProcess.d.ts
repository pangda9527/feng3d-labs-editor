export declare class NavigationProcess {
    private data;
    constructor(geometry: {
        positions: number[];
        indices: number[];
    });
    checkMaxSlope(maxSlope: number): void;
    checkAgentRadius(agentRadius: number): void;
    checkAgentHeight(agentHeight: number): void;
    getGeometry(): {
        positions: number[];
        indices: number[];
    };
    private debugShowLines1;
    private debugShowLines;
    /**
     * 获取所有独立边
     */
    private getAllSingleLine;
}
//# sourceMappingURL=NavigationProcess.d.ts.map