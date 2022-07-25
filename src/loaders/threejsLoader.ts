import feng3d = require('feng3d');
import { editorRS } from '../assets/EditorRS';
import { EditorData } from '../global/EditorData';
import { loadjs } from './load';

export class ThreejsLoader
{
    load(url: string, _completed?: (gameobject: feng3d.GameObject) => void)
    {
        editorRS.fs.readArrayBuffer(url, (_err, data) =>
        {
            load(data, (gameobject) =>
            {
                gameobject.name = feng3d.pathUtils.getName(url);
                feng3d.globalEmitter.emit('asset.parsed', gameobject);
            });
        });
    }
}

export const threejsLoader = new ThreejsLoader();

const usenumberfixed = true;

function load(url: string | File | ArrayBuffer, onParseComplete?: (group) => void)
{
    let skeletonComponent: feng3d.SkeletonComponent;
    prepare(() =>
    {
        //
        const loader = new window['THREE'].FBXLoader();
        if (typeof url === 'string')
        {
            loader.load(url, onLoad, onProgress, onError);
        }
        else if (url instanceof ArrayBuffer)
        {
            const scene = loader.parse(url);
            onLoad(scene);
        }
        else
        {
            const reader = new FileReader();
            reader.addEventListener('load', function (event)
            {
                const scene = loader.parse(event.target['result']);
                onLoad(scene);
            }, false);
            reader.readAsArrayBuffer(url);
        }
    });

    function onLoad(scene)
    {
        const gameobject = parse(scene);
        gameobject.transform.sx = -1;
        onParseComplete && onParseComplete(gameobject);
        console.log('onLoad');
    }
    function onProgress(event: ProgressEvent)
    {
        console.log(event);
    }
    function onError(err)
    {
        console.error(err);
    }

    function parse(object3d, parent?: feng3d.GameObject)
    {
        if (object3d.type === 'Bone')
        {
            return null;
        }

        const gameobject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: object3d.name });
        gameobject.transform.position = new feng3d.Vector3(object3d.position.x, object3d.position.y, object3d.position.z);
        gameobject.transform.orientation = new feng3d.Quaternion(object3d.quaternion.x, object3d.quaternion.y, object3d.quaternion.z, object3d.quaternion.w);
        gameobject.transform.scale = new feng3d.Vector3(object3d.scale.x, object3d.scale.y, object3d.scale.z);
        if (parent)
        { parent.addChild(gameobject); }

        switch (object3d.type)
        {
            case 'PerspectiveCamera':
                gameobject.addComponent(feng3d.Camera).lens = parsePerspectiveCamera(object3d);
                break;
            case 'SkinnedMesh':
                const skinnedModel = gameobject.addComponent(feng3d.SkinnedMeshRenderer);
                skinnedModel.geometry = parseGeometry(object3d.geometry);
                skinnedModel.material.renderParams.cullFace = feng3d.CullFace.NONE;
                console.assert(object3d.bindMode === 'attached');
                skinnedModel.skinSkeleton = parseSkinnedSkeleton(skeletonComponent, object3d.skeleton);
                if (parent)
                { skinnedModel.initMatrix = gameobject.transform.localToWorldMatrix.clone(); }
                break;
            case 'Mesh':
                const model = gameobject.addComponent(feng3d.Renderable);
                model.geometry = parseGeometry(object3d.geometry);
                model.material.renderParams.cullFace = feng3d.CullFace.NONE;
                break;
            case 'Group':
                if (object3d.skeleton)
                {
                    skeletonComponent = gameobject.addComponent(feng3d.SkeletonComponent);
                    skeletonComponent.joints = parseSkeleton(object3d.skeleton);
                }
                break;
            case 'Bone':
                // Bone 由SkeletonComponent自动生成，不用解析
                break;
            default:
                console.warn(`没有提供 ${object3d.type} 类型对象的解析`);
                break;
        }

        if (object3d.animations && object3d.animations.length > 0)
        {
            const animation = gameobject.addComponent(feng3d.Animation);
            for (let i = 0; i < object3d.animations.length; i++)
            {
                const animationClip = parseAnimations(object3d.animations[i]);
                animation.animations.push(animationClip);
                animation.animation = animation.animations[0];
            }
        }

        object3d.children.forEach((element) =>
        {
            parse(element, gameobject);
        });

        return gameobject;
    }
}

function parseAnimations(animationClipData: { name: string; duration: number; tracks: any; })
{
    //
    const animationClip = new feng3d.AnimationClip();

    animationClip.name = animationClipData.name;
    animationClip.length = animationClipData.duration * 1000;
    animationClip.propertyClips = [];

    const tracks = animationClipData.tracks;
    const len = tracks.length;
    for (let i = 0; i < len; i++)
    {
        const propertyClip = parsePropertyClip(tracks[i]);
        animationClip.propertyClips.push(propertyClip);
    }

    return animationClip;

    function parsePropertyClip(keyframeTrack)
    {
        const propertyClip = new feng3d.PropertyClip();

        const trackName: string = keyframeTrack.name;
        const result = (/\.bones\[(\w+)\]\.(\w+)/).exec(trackName);
        propertyClip.path = <any>[
            [feng3d.PropertyClipPathItemType.GameObject, result[1]],
            // eslint-disable-next-line no-sparse-arrays
            [feng3d.PropertyClipPathItemType.Component, , 'feng3d.Transform'],
        ];

        switch (result[2])
        {
            case 'position':
                propertyClip.propertyName = 'position';
                break;
            case 'scale':
                propertyClip.propertyName = 'scale';
                break;
            case 'quaternion':
                propertyClip.propertyName = 'orientation';
                break;
            default:
                console.warn(`没有处理 propertyName ${result[2]}`);
                break;
        }

        propertyClip.propertyValues = [];
        const propertyValues = propertyClip.propertyValues;
        const times: number[] = keyframeTrack.times;
        let values: number[] = Array.from(keyframeTrack.values);
        if (usenumberfixed)
        {
            values = values.map((v: number) => Number(v.toFixed(6)));
        }

        const len = times.length;
        switch (keyframeTrack.ValueTypeName)
        {
            case 'vector':
                propertyClip.type = 'Vector3';
                for (let i = 0; i < len; i++)
                {
                    propertyValues.push([times[i] * 1000, [values[i * 3], values[i * 3 + 1], values[i * 3 + 2]]]);
                }
                break;
            case 'quaternion':
                propertyClip.type = 'Quaternion';
                for (let i = 0; i < len; i++)
                {
                    propertyValues.push([times[i] * 1000, [values[i * 4], values[i * 4 + 1], values[i * 4 + 2], values[i * 4 + 3]]]);
                }
                break;
            default:
                console.warn(`没有提供解析 ${keyframeTrack.ValueTypeName} 类型Track数据`);
                break;
        }

        return propertyClip;
    }
}

function parseSkeleton(skeleton)
{
    const joints: feng3d.SkeletonJoint[] = [];
    const skeNameDic = {};

    const len = skeleton.bones.length;
    for (let i = 0; i < len; i++)
    {
        skeNameDic[skeleton.bones[i].name] = i;
    }
    for (let i = 0; i < len; i++)
    {
        const bone = skeleton.bones[i];
        const skeletonJoint = joints[i] = new feng3d.SkeletonJoint();
        //
        skeletonJoint.name = bone.name;
        skeletonJoint.matrix = new feng3d.Matrix4x4(bone.matrixWorld.elements);

        let parentId = skeNameDic[bone.parent.name];
        if (parentId === undefined)
        { parentId = -1; }

        skeletonJoint.parentIndex = parentId;
    }

    return joints;
}

function parseSkinnedSkeleton(skeleton: feng3d.SkeletonComponent, skinSkeletonData)
{
    const skinSkeleton = new feng3d.SkinSkeletonTemp();

    const joints = skeleton.joints;
    const jointsMap = {};
    for (let i = 0; i < joints.length; i++)
    {
        jointsMap[joints[i].name] = [i, joints[i].name];
    }

    const bones = skinSkeletonData.bones;
    const len = bones.length;
    skinSkeleton.numJoint = len;
    for (let i = 0; i < len; i++)
    {
        let jointsMapitem = jointsMap[bones[i].name];
        if (!jointsMapitem && bones[i].parent)
        {
            jointsMapitem = jointsMap[bones[i].parent.name];
        }
        if (jointsMapitem)
        {
            skinSkeleton.joints[i] = jointsMapitem;
            joints[jointsMapitem[0]].matrix = new feng3d.Matrix4x4(skinSkeletonData.boneInverses[i].elements).invert();
        }
        else
        {
            console.warn(`没有在骨架中找到 骨骼 ${bones[i].name}`);
        }
    }

    return skinSkeleton;
}

function parseGeometry(geometry)
{
    const attributes = geometry.attributes;

    const geo = new feng3d.CustomGeometry();

    for (const key in attributes)
    {
        if (attributes.hasOwnProperty(key))
        {
            const element = attributes[key];
            let array: number[] = Array.from(element.array);
            if (usenumberfixed)
            {
                array = array.map((v: number) => Number(v.toFixed(6)));
            }
            switch (key)
            {
                case 'position':
                    geo.positions = array;
                    break;
                case 'normal':
                    geo.normals = array;
                    break;
                case 'uv':
                    geo.uvs = array;
                    break;
                case 'skinIndex':
                    geo.skinIndices = array;
                    break;
                case 'skinWeight':
                    geo.skinWeights = array;
                    break;
                default:
                    console.warn('没有解析顶点数据', key);
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

function parsePerspectiveCamera(perspectiveCamera)
{
    const perspectiveLen = new feng3d.PerspectiveLens();

    perspectiveLen.near = perspectiveCamera.near;
    perspectiveLen.far = perspectiveCamera.far;
    perspectiveLen.aspect = perspectiveCamera.aspect;
    perspectiveLen.fov = perspectiveCamera.fov;

    return perspectiveLen;
}

const prepare = (() =>
{
    let isprepare = false;
    const prepareCallbacks = [];
    let preparing = false;

    return (callback: () => void) =>
    {
        if (isprepare)
        {
            callback();

            return;
        }
        prepareCallbacks.push(callback);
        if (preparing)
        { return; }

        preparing = true;
        loadjs.load({
            paths: [
                'threejs/three.js',
                // <!-- FBX -->
                'threejs/libs/inflate.min.js',
                //
                'threejs/loaders/AMFLoader.js',
                'threejs/loaders/AWDLoader.js',
                'threejs/loaders/BabylonLoader.js',
                'threejs/loaders/ColladaLoader.js',
                'threejs/loaders/FBXLoader.js',
                'threejs/loaders/GLTFLoader.js',
                'threejs/loaders/KMZLoader.js',
                'threejs/loaders/MD2Loader.js',
                'threejs/loaders/OBJLoader.js',
                'threejs/loaders/MTLLoader.js',
                'threejs/loaders/PlayCanvasLoader.js',
                'threejs/loaders/PLYLoader.js',
                'threejs/loaders/STLLoader.js',
                'threejs/loaders/TGALoader.js',
                'threejs/loaders/TDSLoader.js',
                'threejs/loaders/UTF8Loader.js',
                'threejs/loaders/VRMLLoader.js',
                'threejs/loaders/VTKLoader.js',
                'threejs/loaders/ctm/lzma.js',
                'threejs/loaders/ctm/ctm.js',
                'threejs/loaders/ctm/CTMLoader.js',
            ].map((value) => EditorData.editorData.getEditorAssetPath(value)),
            bundleId: 'threejs',
            success: () =>
            {
                // eslint-disable-next-line no-extend-native
                Number.prototype['format'] = function ()
                {
                    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                };

                // log("提供解析的 three.js 初始化完成，")
                isprepare = true;
                preparing = false;
                prepareCallbacks.forEach((element) =>
                {
                    element();
                });
            }
        });
    };
})();
