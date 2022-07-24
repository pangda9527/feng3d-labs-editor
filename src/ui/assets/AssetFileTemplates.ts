
export var assetFileTemplates: AssetFileTemplates;

export class AssetFileTemplates
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

assetFileTemplates = new AssetFileTemplates();

var scriptTemplate = `
class NewScript extends Script
{

    /** 
     * 测试属性 
     */
    @serialize
    @oav()
    t_attr = new Color4();

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
    @serialize
    @oav()
    u_color = new Color4();
}

shaderConfig.shaders["NewShader"] = {
    cls: NewShaderUniforms,
    vertex: \`
    
    attribute vec3 a_position;
    
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewProjection;
    
    void main() {
    
        vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);
        gl_Position = u_viewProjection * globalPosition;
    }\`,
    fragment: \`
    
    precision mediump float;
    
    uniform vec4 u_color;
    
    void main() {
        
        gl_FragColor = u_color;
    }
    \`,
};

type NewShaderMaterial = Material & { uniforms: NewShaderUniforms; };
interface MaterialFactory
{
    create(shader: "NewShader", raw?: gPartial<NewShaderMaterial>): NewShaderMaterial;
}

interface MaterialRawMap
{
    NewShader: gPartial<NewShaderMaterial>;
}`;
