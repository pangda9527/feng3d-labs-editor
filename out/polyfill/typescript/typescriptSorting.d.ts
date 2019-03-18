declare namespace ts {
    interface SortingResult {
        sortedFileNames: string[];
        circularReferences: string[];
    }
    function reorderSourceFiles(program: Program): SortingResult;
}
//# sourceMappingURL=typescriptSorting.d.ts.map