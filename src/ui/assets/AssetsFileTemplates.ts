namespace feng3d.editor
{
    export var assetsFileTemplates: AssetsFileTemplates;

    export class AssetsFileTemplates
    {
        /**
         * 
         * @param scriptName 脚本名称（类名）
         */
        getNewScript(scriptName)
        {
            return scriptTemplate.replace("NewScript", scriptName);
        }
        /**
         * 
         * @param shadername shader名称
         */
        getNewShader(shadername: string)
        {
            return shaderTemplate.replace(new RegExp("NewShader", "g"), shadername);
        }
    }

    assetsFileTemplates = new AssetsFileTemplates();

    var scriptTemplate = `
class NewScript extends feng3d.Script
{

    /** 
     * 测试属性 
     */
    @feng3d.serialize
    @feng3d.oav()
    t_attr = new feng3d.Color4();

    /**
     * 初始化时调用
     */
    init()
    {

    }

    /**
     * 更新
     */
    update()
    {

    }

    /**
     * 销毁时调用
     */
    dispose()
    {

    }
}`;

    var shaderTemplate = `
class NewShaderUniforms
{
    /** 
     * 颜色 
     */
    @feng3d.serialize
    @feng3d.oav()
    u_color = new feng3d.Color4();
}

feng3d.shaderConfig.shaders["NewShader"] = {
    cls: NewShaderUniforms,
    vertex: \`
    
    attribute vec3 a_position;
    
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewProjection;
    
    void main(void) {
    
        vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);
        gl_Position = u_viewProjection * globalPosition;
    }\`,
    fragment: \`
    
    precision mediump float;
    
    uniform vec4 u_color;
    
    void main(void) {
        
        gl_FragColor = u_color;
    }
    \`,
};

type NewShaderMaterial = feng3d.Material & { uniforms: NewShaderUniforms; };
interface MaterialFactory
{
    create(shader: "NewShader", raw?: NewShaderMaterialRaw): NewShaderMaterial;
}

interface MaterialRawMap
{
    NewShader: NewShaderMaterialRaw
}

interface NewShaderMaterialRaw extends feng3d.MaterialBaseRaw
{
    shaderName?: "NewShader",
    uniforms?: NewShaderUniformsRaw;
}

interface NewShaderUniformsRaw
{
    __class__?: "feng3d.NewShaderUniforms",
    u_time?: number,
}`;
}