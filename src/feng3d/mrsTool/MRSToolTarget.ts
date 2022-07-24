import { Transform, Vector3, globalEmitter, ticker, Matrix4x4 } from 'feng3d';
import { editorData } from '../../Editor';

export class MRSToolTarget
{
    //
    private _controllerTargets: Transform[];
    private _startScaleVec: Vector3[] = [];
    private _controllerTool: Transform;
    private _startTransformDic: Map<Transform, TransformData>;

    private _position = new Vector3();
    private _rotation = new Vector3();

    get controllerTool()
    {
        return this._controllerTool;
    }

    set controllerTool(value)
    {
        this._controllerTool = value;
        if (this._controllerTool)
        {
            this._controllerTool.position = this._position;
            this._controllerTool.rotation = this._rotation;
        }
    }

    set controllerTargets(value: Transform[])
    {
        if (this._controllerTargets)
        {
            this._controllerTargets.forEach(v =>
            {
                v.off("scenetransformChanged", this.invalidateControllerImage, this);
            });
        }
        this._controllerTargets = value;
        if (this._controllerTargets)
        {
            this._controllerTargets.forEach(v =>
            {
                v.on("scenetransformChanged", this.invalidateControllerImage, this);
            });
        }
        this.invalidateControllerImage();
    }

    constructor()
    {
        globalEmitter.on("editor.isWoldCoordinateChanged", this.invalidateControllerImage, this);
        globalEmitter.on("editor.isBaryCenterChanged", this.invalidateControllerImage, this);
        //
        globalEmitter.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
    }

    private onSelectedGameObjectChange()
    {
        //筛选出 工具控制的对象
        var transforms = <Transform[]>editorData.selectedGameObjects.reduce((result, item) =>
        {
            result.push(item.transform);
            return result;
        }, []);
        if (transforms.length > 0)
        {
            this.controllerTargets = transforms;
        }
        else
        {
            this.controllerTargets = null;
        }
    }

    private invalidateControllerImage()
    {
        ticker.nextframe(this.updateControllerImage, this);
    }

    private updateControllerImage()
    {
        if (!this._controllerTargets || this._controllerTargets.length == 0)
            return;

        var transform = this._controllerTargets[this._controllerTargets.length - 1];
        var position = new Vector3();
        if (editorData.isBaryCenter)
        {
            position.copy(transform.worldPosition);
        } else
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                position.add(this._controllerTargets[i].worldPosition);
            }
            position.scaleNumber(1 / this._controllerTargets.length);
        }
        var rotation = new Vector3();
        if (!editorData.isWoldCoordinate)
        {
            rotation = this._controllerTargets[0].rotation;
        }
        this._position = position;
        this._rotation = rotation;
        if (this._controllerTool)
        {
            this._controllerTool.position = position;
            this._controllerTool.rotation = rotation;
        }
    }

    /**
     * 开始移动
     */
    startTranslation()
    {
        this._startTransformDic = new Map<Transform, TransformData>();
        var objects = this._controllerTargets.concat();
        objects.push(this._controllerTool);
        for (var i = 0; i < objects.length; i++)
        {
            var transform = objects[i];
            this._startTransformDic.set(transform, this.getTransformData(transform));
        }
    }

    translation(addPos: Vector3)
    {
        if (!this._controllerTargets)
            return;
        var objects = this._controllerTargets.concat();
        objects.push(this._controllerTool);
        for (var i = 0; i < objects.length; i++)
        {
            var gameobject = objects[i];
            var transform = this._startTransformDic.get(gameobject);
            var localMove = addPos.clone();
            if (gameobject.parent)
                localMove = gameobject.parent.worldToLocalMatrix.transformVector3(localMove);
            gameobject.position = transform.position.addTo(localMove);
        }
    }

    stopTranslation()
    {
        this._startTransformDic = null;
    }

    startRotate()
    {
        this._startTransformDic = new Map<Transform, TransformData>();
        var objects = this._controllerTargets.concat();
        objects.push(this._controllerTool);
        for (var i = 0; i < objects.length; i++)
        {
            var transform = objects[i];
            this._startTransformDic.set(transform, this.getTransformData(transform));
        }
    }

    /**
     * 绕指定轴旋转
     * @param angle 旋转角度
     * @param normal 旋转轴
     */
    rotate1(angle: number, normal: Vector3)
    {
        var objects = this._controllerTargets.concat();
        objects.push(this._controllerTool);
        var localnormal: Vector3;
        var gameobject = objects[0];
        if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
        {
            if (gameobject.parent)
                localnormal = gameobject.parent.worldToLocalMatrix.transformVector3(normal);
        }
        for (var i = 0; i < objects.length; i++)
        {
            gameobject = objects[i];
            var tempTransform = this._startTransformDic.get(gameobject);
            if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
            {
                gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
            } else
            {
                localnormal = normal.clone();
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.transformVector3(localnormal);
                if (editorData.isBaryCenter)
                {
                    gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                } else
                {
                    var localPivotPoint = this._position;
                    if (gameobject.parent)
                        localPivotPoint = gameobject.parent.worldToLocalMatrix.transformPoint3(localPivotPoint);
                    gameobject.position = Matrix4x4.fromPosition(tempTransform.position.x, tempTransform.position.y, tempTransform.position.z).appendRotation(localnormal, angle, localPivotPoint).getPosition();
                    gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                }
            }
        }
    }

    /**
     * 按指定角旋转
     * @param angle1 第一方向旋转角度
     * @param normal1 第一方向旋转轴
     * @param angle2 第二方向旋转角度
     * @param normal2 第二方向旋转轴
     */
    rotate2(angle1: number, normal1: Vector3, angle2: number, normal2: Vector3)
    {
        var objects = this._controllerTargets.concat();
        objects.push(this._controllerTool);
        var gameobject = objects[0];
        if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
        {
            if (gameobject.parent)
            {
                normal1 = gameobject.parent.worldToLocalMatrix.transformVector3(normal1);
                normal2 = gameobject.parent.worldToLocalMatrix.transformVector3(normal2);
            }
        }
        for (var i = 0; i < objects.length; i++)
        {
            gameobject = objects[i];
            var tempsceneTransform = this._startTransformDic.get(gameobject);
            var tempPosition = tempsceneTransform.position.clone();
            var tempRotation = tempsceneTransform.rotation.clone();
            if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
            {
                tempRotation = this.rotateRotation(tempRotation, normal2, angle2);
                gameobject.rotation = this.rotateRotation(tempRotation, normal1, angle1);
            } else
            {
                var localnormal1 = normal1.clone();
                var localnormal2 = normal2.clone();
                if (gameobject.parent)
                {
                    localnormal1 = gameobject.parent.worldToLocalMatrix.transformVector3(localnormal1);
                    localnormal2 = gameobject.parent.worldToLocalMatrix.transformVector3(localnormal2);
                }
                if (editorData.isBaryCenter)
                {
                    tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                    gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                } else
                {
                    var localPivotPoint = this._position;
                    if (gameobject.parent)
                        localPivotPoint = gameobject.parent.worldToLocalMatrix.transformPoint3(localPivotPoint);
                    //
                    tempPosition = Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).getPosition();
                    gameobject.position = Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).getPosition();

                    tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                    gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                }
            }
        }
    }

    stopRote()
    {
        this._startTransformDic = null;
    }

    startScale()
    {
        for (var i = 0; i < this._controllerTargets.length; i++)
        {
            this._startScaleVec[i] = this._controllerTargets[i].scale.clone();
        }
    }

    doScale(scale: Vector3)
    {
        console.assert(!!scale.length);
        for (var i = 0; i < this._controllerTargets.length; i++)
        {
            var result = this._startScaleVec[i].multiplyTo(scale);
            this._controllerTargets[i].sx = result.x;
            this._controllerTargets[i].sy = result.y;
            this._controllerTargets[i].sz = result.z;
        }
    }

    stopScale()
    {
        this._startScaleVec.length = 0;
    }

    private getTransformData(transform: Transform)
    {
        return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
    }

    private rotateRotation(rotation: Vector3, axis: Vector3, angle)
    {
        var rotationmatrix = new Matrix4x4();
        rotationmatrix.fromRotation(rotation.x, rotation.y, rotation.z);
        rotationmatrix.appendRotation(axis, angle);
        var newrotation = rotationmatrix.toTRS()[1];
        var v = Math.round((newrotation.x - rotation.x) / 180);
        if (v % 2 != 0)
        {
            newrotation.x += 180;
            newrotation.y = 180 - newrotation.y;
            newrotation.z += 180;
        }

        function toround(a: number, b: number, c: number = 360)
        {
            return Math.round((b - a) / c) * c + a;
        }

        newrotation.x = toround(newrotation.x, rotation.x);
        newrotation.y = toround(newrotation.y, rotation.y);
        newrotation.z = toround(newrotation.z, rotation.z);
        return newrotation;
    }
}

interface TransformData
{
    position: Vector3, rotation: Vector3, scale: Vector3
}
