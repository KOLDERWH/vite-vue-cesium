import {
    CallbackProperty,
    Cartesian3,
    Color,
    PolygonHierarchy,
    PostProcessStage,
    Viewer
} from "cesium";
import GeometricKit from './kits/GeometricKit';

interface options {
    snowSize?: number;
    snowSpeed?: number;
    rainSize?: number;
    tiltAngle?: number;
    rainSpeed?: number;
    color?: Color;
    visibility?: number;
}

class WeatherEffect {
    static stageCollections: PostProcessStage[] = []
    constructor() { }
    public static snowEffect = function (viewer: Viewer, options: options) {
        let snowStage = new PostProcessStage({
            name: 'weather_snow',
            fragmentShader: WeatherEffect.snow(),
            uniforms: {
                snowSize: () => {
                    return options.snowSize;
                },
                snowSpeed: () => {
                    return options.snowSpeed;
                }
            }
        });

        viewer.scene.postProcessStages.add(snowStage);
        WeatherEffect.stageCollections.push(snowStage)
    }

    public static rainEffect(viewer: Viewer, options: options) {
        let rainStage = new PostProcessStage({
            name: 'weather_rain',
            fragmentShader: WeatherEffect.rain(),
            uniforms: {
                tiltAngle: () => {
                    return options.tiltAngle;
                },
                rainSize: () => {
                    return options.rainSize;
                },
                rainSpeed: () => {
                    return options.rainSpeed;
                }
            }
        });

        viewer.scene.postProcessStages.add(rainStage);
        WeatherEffect.stageCollections.push(rainStage);
    }

    public static fogEffect(viewer: Viewer, options: options) {
        let fogStage = new PostProcessStage({
            name: 'weather_fog',
            fragmentShader: WeatherEffect.fog(),
            uniforms: {
                visibility: () => {
                    return options.visibility;
                },
                fogColor: () => {
                    return options.color;
                }
            }
        });

        viewer.scene.postProcessStages.add(fogStage);
        WeatherEffect.stageCollections.push(fogStage)
    }


    public static destroy(viewer: Viewer) {
        if (!WeatherEffect.stageCollections.length)
            return;
        for (let stageItem of WeatherEffect.stageCollections) {
            viewer.scene.postProcessStages.remove(stageItem);
        }
    }


    static snow() {
        return "uniform sampler2D colorTexture;\n\
            in vec2 v_textureCoordinates;\n\
            uniform float snowSpeed;\n\
            uniform float snowSize;\n\
            out vec4 FragColor;\n\
            float snow(vec2 uv,float scale)\n\
            {\n\
                float time=czm_frameNumber/snowSpeed;\n\
                float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
                uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
                uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
                p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
                k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);\n\
                return k*w;\n\
            }\n\
            void main(void){\n\
                vec2 resolution=czm_viewport.zw;\n\
                vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                vec3 finalColor=vec3(0);\n\
                //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));\n\
                float c=0.;\n\
                c+=snow(uv,30.)*.0;\n\
                c+=snow(uv,20.)*.0;\n\
                c+=snow(uv,15.)*.0;\n\
                c+=snow(uv,10.);\n\
                c+=snow(uv,8.);\n\
                c+=snow(uv,6.);\n\
                c+=snow(uv,5.);\n\
                finalColor=(vec3(c));\n\
                FragColor=mix(texture(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);\n\
                }\n\
                ";
    }

    static rain() {
        return "uniform sampler2D colorTexture;\n\
                in vec2 v_textureCoordinates;\n\
                uniform float tiltAngle;\n\
                uniform float rainSize;\n\
                out vec4 FragColor;\n\
                uniform float rainSpeed;\n\
                float hash(float x) {\n\
                    return fract(sin(x * 133.3) * 13.13);\n\
                }\n\
                void main(void) {\n\
                    float time = czm_frameNumber / rainSpeed;\n\
                    vec2 resolution = czm_viewport.zw;\n\
                    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);\n\
                    vec3 c = vec3(.6, .7, .8);\n\
                    float a = tiltAngle;\n\
                    float si = sin(a), co = cos(a);\n\
                    uv *= mat2(co, -si, si, co);\n\
                    uv *= length(uv + vec2(0, 4.9)) * rainSize + 1.;\n\
                    float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);\n\
                    float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;\n\
                    c *= v * b;\n\
                    FragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c, 1), .6);\n\
                }\n\
                ";
    }

    static fog() {
        return "uniform sampler2D colorTexture;\n\
         uniform sampler2D depthTexture;\n\
         uniform float visibility;\n\
         uniform vec4 fogColor;\n\
         in vec2 v_textureCoordinates; \n\
         out vec4 FragColor; \n\
         void main(void) \n\
         { \n\
            vec4 origcolor = texture(colorTexture, v_textureCoordinates); \n\
            float depth = czm_readDepth(depthTexture, v_textureCoordinates); \n\
            vec4 depthcolor = texture(depthTexture, v_textureCoordinates); \n\
            float f = visibility * (depthcolor.r - 0.3) / 0.2; \n\
            if (f < 0.0) f = 0.0; \n\
            else if (f > 1.0) f = 1.0; \n\
            FragColor = mix(origcolor, fogColor, f); \n\
         }\n";
    }
}
/**
*
*@param{*}targetHeight目标高度
*@param{*}adapCoordi范围坐标
*@param{*}waterHeight当前水高度
*/
function drawWater(targetHeight: number, areaCoor: number[], waterHeight: number, viewer: Viewer) {
    GeometricKit.destroy(viewer);
    let isRain = true;
    let entity = viewer.entities.add({
        polygon: {
            height: waterHeight,
            hierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(areaCoor)),
            //perPositionHeight:true,
            extrudedHeight: new CallbackProperty(function () {//此处用属性回调函数，直接设置extrudedHeight会导致闪烁。
                waterHeight += 0.005;
                if (waterHeight > targetHeight) {
                    waterHeight = targetHeight;//给个最大值
                    if (isRain) {
                        isRain = false;
                        setTimeout(() => {
                            WeatherEffect.destroy(viewer);
                        }, 1500);
                    }


                }
                return waterHeight
            }, false),
            material: Color.fromBytes(97, 184, 255, 100),
        }
    });
    GeometricKit.addEntity(entity)

}

export { WeatherEffect, drawWater };

