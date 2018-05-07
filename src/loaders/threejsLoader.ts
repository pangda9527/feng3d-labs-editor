namespace feng3d.editor
{
    export var threejsLoader = {
        load: load,
    };
    var usenumberfixed = true;

    function load(url: string | File, onParseComplete?: (group) => void)
    {

        var skeletonComponent: SkeletonComponent;
        prepare(() =>
        {
            //
            var loader = new window["THREE"].FBXLoader();
            if (typeof url == "string")
            {
                loader.load(url, onLoad, onProgress, onError)
            }
            else
            {
                var reader = new FileReader();
                reader.addEventListener('load', function (event)
                {
                    var scene = loader.parse(event.target["result"]);
                    onLoad(scene);
                }, false);
                reader.readAsArrayBuffer(url);
            }
        });

        function onLoad(scene)
        {
            var gameobject = parse(scene);
            gameobject.transform.sx = -1;
            onParseComplete && onParseComplete(gameobject);
            log("onLoad");
        }
        function onProgress(event: ProgressEvent)
        {
            log(event);
        }
        function onError(err)
        {
            error(err);
        }

        function parse(object3d, parent?: GameObject)
        {
            if (object3d.type == "Bone")
                return null;

            var gameobject = GameObject.create(object3d.name);
            gameobject.transform.position = new Vector3(object3d.position.x, object3d.position.y, object3d.position.z);
            gameobject.transform.orientation = new Quaternion(object3d.quaternion.x, object3d.quaternion.y, object3d.quaternion.z, object3d.quaternion.w);
            gameobject.transform.scale = new Vector3(object3d.scale.x, object3d.scale.y, object3d.scale.z);
            if (parent)
                parent.addChild(gameobject);

            switch (object3d.type)
            {
                case "PerspectiveCamera":
                    gameobject.addComponent(Camera).lens = parsePerspectiveCamera(object3d);
                    break;
                case "SkinnedMesh":
                    var skinnedMeshRenderer = gameobject.addComponent(SkinnedMeshRenderer);
                    skinnedMeshRenderer.geometry = parseGeometry(object3d.geometry);
                    skinnedMeshRenderer.material = parseMaterial(object3d.material);
                    assert(object3d.bindMode == "attached");
                    skinnedMeshRenderer.skinSkeleton = parseSkinnedSkeleton(skeletonComponent, object3d.skeleton);
                    if (parent)
                        skinnedMeshRenderer.initMatrix3d = gameobject.transform.localToWorldMatrix.clone();
                    break;
                case "Mesh":
                    var meshRenderer = gameobject.addComponent(MeshRenderer);
                    meshRenderer.geometry = parseGeometry(object3d.geometry);
                    meshRenderer.material = parseMaterial(object3d.material);
                    break;
                case "Group":
                    if (object3d.skeleton)
                    {
                        skeletonComponent = gameobject.addComponent(SkeletonComponent);
                        skeletonComponent.joints = parseSkeleton(object3d.skeleton);
                    }
                    break;
                case "Bone":
                    //Bone 由SkeletonComponent自动生成，不用解析
                    break;
                default:
                    warn(`没有提供 ${object3d.type} 类型对象的解析`);
                    break;
            }

            if (object3d.animations && object3d.animations.length > 0)
            {
                var animation = gameobject.addComponent(Animation);
                for (var i = 0; i < object3d.animations.length; i++)
                {
                    var animationClip = parseAnimations(object3d.animations[i]);
                    animation.animations.push(animationClip);
                    animation.animation = animation.animations[0];
                }

            }

            object3d.children.forEach(element =>
            {
                parse(element, gameobject);
            });

            return gameobject;
        }
    }


    function parseAnimations(animationClipData)
    {
        var matrixTemp = new window["THREE"].Matrix4();
        var quaternionTemp = new window["THREE"].Quaternion();
        var fmatrix3d = new Matrix4x4();

        //
        var animationClip = new AnimationClip();

        animationClip.name = animationClipData.name;
        animationClip.length = animationClipData.duration * 1000;
        animationClip.propertyClips = [];

        var tracks = animationClipData.tracks;
        var len = tracks.length;
        for (var i = 0; i < len; i++)
        {
            var propertyClip = parsePropertyClip(tracks[i]);
            animationClip.propertyClips.push(propertyClip);
        }

        return animationClip;

        function parsePropertyClip(keyframeTrack)
        {
            var propertyClip = new PropertyClip();

            var trackName: string = keyframeTrack.name;
            var result = /\.bones\[(\w+)\]\.(\w+)/.exec(trackName);
            propertyClip.path = <any>[
                [PropertyClipPathItemType.GameObject, result[1]],
                [PropertyClipPathItemType.Component, , "feng3d.Transform"],
            ];

            switch (result[2])
            {
                case "position":
                    propertyClip.propertyName = "position";
                    break;
                case "scale":
                    propertyClip.propertyName = "scale";
                    break;
                case "quaternion":
                    propertyClip.propertyName = "orientation";
                    break;
                default:
                    warn(`没有处理 propertyName ${result[2]}`);
                    break;
            }

            propertyClip.propertyValues = [];
            var propertyValues = propertyClip.propertyValues;
            var times: number[] = keyframeTrack.times;
            var values = usenumberfixed ? keyframeTrack.values.map((v) => { return Number(v.toFixed(6)); }) : keyframeTrack.values;

            var len = times.length;
            switch (keyframeTrack.ValueTypeName)
            {
                case "vector":
                    propertyClip.type = "Vector3";
                    for (var i = 0; i < len; i++)
                    {
                        propertyValues.push([times[i] * 1000, [values[i * 3], values[i * 3 + 1], values[i * 3 + 2]]]);
                    }
                    break;
                case "quaternion":
                    propertyClip.type = "Quaternion";
                    for (var i = 0; i < len; i++)
                    {
                        propertyValues.push([times[i] * 1000, [values[i * 4], values[i * 4 + 1], values[i * 4 + 2], values[i * 4 + 3]]]);
                    }
                    break;
                default:
                    warn(`没有提供解析 ${keyframeTrack.ValueTypeName} 类型Track数据`);
                    break;
            }

            return propertyClip;
        }
    }

    function parseSkeleton(skeleton)
    {
        var joints: SkeletonJoint[] = [];
        var skeNameDic = {};

        var len = skeleton.bones.length;
        for (var i = 0; i < len; i++)
        {
            skeNameDic[skeleton.bones[i].name] = i;
        }
        for (var i = 0; i < len; i++)
        {
            var bone = skeleton.bones[i];
            var skeletonJoint = joints[i] = new SkeletonJoint();
            //
            skeletonJoint.name = bone.name;
            skeletonJoint.matrix3D = new Matrix4x4(bone.matrixWorld.elements);

            var parentId = skeNameDic[bone.parent.name];
            if (parentId === undefined)
                parentId = -1;

            skeletonJoint.parentIndex = parentId;
        }

        return joints;
    }

    function parseSkinnedSkeleton(skeleton: SkeletonComponent, skinSkeletonData)
    {
        var skinSkeleton = new SkinSkeletonTemp();

        var joints = skeleton.joints;
        var jointsMap = {};
        for (var i = 0; i < joints.length; i++)
        {
            jointsMap[joints[i].name] = [i, joints[i].name];
        }

        var bones = skinSkeletonData.bones;
        var len = bones.length;
        skinSkeleton.numJoint = len;
        for (var i = 0; i < len; i++)
        {
            var jointsMapitem = jointsMap[bones[i].name];
            if (jointsMapitem == null && bones[i].parent)
            {
                jointsMapitem = jointsMap[bones[i].parent.name];
            }
            if (jointsMapitem)
            {
                skinSkeleton.joints[i] = jointsMapitem;
                joints[jointsMapitem[0]].matrix3D = new Matrix4x4(skinSkeletonData.boneInverses[i].elements).invert();
            } else
            {
                warn(`没有在骨架中找到 骨骼 ${bones[i].name}`);
            }
        }

        return skinSkeleton;
    }

    function parseGeometry(geometry)
    {
        var attributes = geometry.attributes;

        var geo = new CustomGeometry();

        for (var key in attributes)
        {
            if (attributes.hasOwnProperty(key))
            {
                var element = attributes[key];
                var array = usenumberfixed ? element.array.map((v) => { return Number(v.toFixed(6)); }) : element.array;
                switch (key)
                {
                    case "position":
                        geo.positions = array;
                        break;
                    case "normal":
                        geo.normals = array;
                        break;
                    case "uv":
                        geo.uvs = array;
                        break;
                    case "skinIndex":
                        geo.setVAData("a_jointindex0", array, 4);
                        break;
                    case "skinWeight":
                        geo.setVAData("a_jointweight0", array, 4);
                        break;
                    default:
                        warn("没有解析顶点数据", key);
                        break;
                }
            }
        }

        if (geometry.index)
        {
            geo.indices = geometry.index;
        }
        return geo;
    }

    function parseMaterial(geometry)
    {
        var material = materialFactory.create("standard");
        material.renderParams.cullFace = CullFace.NONE;
        return material;
    }

    function parsePerspectiveCamera(perspectiveCamera)
    {
        var perspectiveLen = new PerspectiveLens();

        perspectiveLen.near = perspectiveCamera.near;
        perspectiveLen.far = perspectiveCamera.far;
        perspectiveLen.aspectRatio = perspectiveCamera.aspect;
        perspectiveLen.fieldOfView = perspectiveCamera.fov;

        return perspectiveLen;
    }

    var prepare = (() =>
    {
        var isprepare = false;
        var prepareCallbacks = [];
        var preparing = false;
        return (callback: () => void) =>
        {
            if (isprepare)
            {
                callback();
                return;
            }
            prepareCallbacks.push(callback);
            if (preparing)
                return;

            preparing = true;
            loadjs.load({
                paths: [
                    "threejs/three.js",
                    // <!-- FBX -->
                    "threejs/libs/inflate.min.js",
                    //
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
                ].map((value) => { return editorData.getEditorAssetsPath("/" + value); }),
                bundleId: "threejs",
                success: () =>
                {
                    Number.prototype["format"] = function ()        
                    {
                        return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    };

                    // log("提供解析的 three.js 初始化完成，")
                    isprepare = true;
                    preparing = false;
                    prepareCallbacks.forEach(element =>
                    {
                        element();
                    });
                }
            });
        }
    })();
}