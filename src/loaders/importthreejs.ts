module feng3d.editor
{
    loadjs.load({
        paths: [
            "threejs/three.js",
            // <!-- FBX -->

            "threejs/loaders/AMFLoader.js",
            "threejs/loaders/AWDLoader.js",
            "threejs/loaders/BabylonLoader.js",
            "threejs/loaders/ColladaLoader.js",
            "threejs/loaders/FBXLoader.js",
            "threejs/loaders/GLTFLoader.js",
            "threejs/loaders/KMZLoader.js",
            "threejs/loaders/MD2Loader.js",
            "threejs/loaders/OBJLoader.js",
            "threejs/loaders/MTLLoader.js",
            "threejs/loaders/PlayCanvasLoader.js",
            "threejs/loaders/PLYLoader.js",
            "threejs/loaders/STLLoader.js",
            "threejs/loaders/TGALoader.js",
            "threejs/loaders/TDSLoader.js",
            "threejs/loaders/UTF8Loader.js",
            "threejs/loaders/VRMLLoader.js",
            "threejs/loaders/VTKLoader.js",
            "threejs/loaders/ctm/lzma.js",
            "threejs/loaders/ctm/ctm.js",
            "threejs/loaders/ctm/CTMLoader.js",
        ],
        bundleId: "threejs",
        success: () =>
        {
            Number.prototype["format"] = function ()        
            {
                return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            };

            // console.log("提供解析的 three.js 初始化完成，")
        }
    });
}