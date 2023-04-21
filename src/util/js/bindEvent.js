$(document).ready(
    function () {
        let isRain;
        let measureTool;

        $("#rainSmlt").click(function () {

            isRain = new RainEffect(viewer, {
                tiltAngle: -.6, //倾斜角度
                rainSize: 0.6, //雨大小
                rainSpeed: 120.0 //雨速
            });

            let points = [
                [109.00792, 34.191703],
                [109.008373, 34.191672],
                [109.008521, 34.195425],
                [109.007553, 34.195436],
            ]
            let polygonArr = [];
            for (let i = 0; i < points.length; i++) {
                polygonArr.push(points[i][0]);
                polygonArr.push(points[i][1]);
                polygonArr.push(0);
            }
            new Promise((ref) => {
                drawWater(477, polygonArr, 475);
            }).then(setTimeout(() => {
                isRain.destroy();
                console.log(a);
            }, 16000))



        });
        $("#Snow").click(function () {
            // viewer.scene.skyAtmosphere.brightnessShift = -0.33;//大气圈亮度
            // //viewer.scene.fog.density = 0.001;
            // viewer.scene.fog.minimumBrightness = 0.8;//0.8
            isRain = new SnowEffect(viewer, {
                snowSize: 0.01, //雪大小 ，默认可不写
                snowSpeed: 60.0 //雪速，默认可不写
            });

        });
        $("#Snowadd").click(function () {
            tileset.customShader = `
                vec3 snowColor = vec3(1.0, 1.0, 1.0); \
                float snowThreshold = 0.5; \
                out vec4 FragColor;
                void main() \
                { \
                    czm_materialInput materialInput = czm_getMaterial(czm_material); \
                    vec3 normal = normalize(materialInput.normalEC); \
                    float cosineAngle = dot(normal, vec3(0.0, 0.0, 1.0)); \
                    if (cosineAngle < snowThreshold) \
                    { \
                        FragColor.rgb = snowColor; \
                    } \
                    else \
                    { \
                        FragColor.rgb = materialInput.diffuse.rgb; \
                    } \
                    FragColor.a = materialInput.alpha; \
                } \
            `
        });
        $("#Fog").click(function () {
            isRain = new FogEffect(viewer, {
                visibility: 0.2,
                color: new Cesium.Color(0.8, 0.8, 0.8, 0.3)
            });
        });
        $("#Resotore").click(function () {
            if (isRain != undefined) {
                console.log("erease weather effect");
                isRain.destroy();
            }
        });
        // 模拟
        $("#flySmlt").click(function () {
            flySt();
        });
        $("#clip").click(function () {
            clip(new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas))
            // buildInfo
        });
        $("#buildInfo").click(function () {
            buildInfo()
        });
        //测量工具
        $("#distanceMeasure").click(function () {
            if (measureTool == undefined) {
                console.log("new");
                measureTool = new MeasureTools(viewer);
            }
            measureTool.measurePolyLine();
        });
        $("#areaMeassure").click(function () {
            if (measureTool == undefined) {
                console.log("new");
                measureTool = new MeasureTools(viewer);
            }
            measureTool.measurePolygon();
        });
        $("#deltaMeasure").click(function () {
            if (measureTool == undefined) {
                console.log("new");
                measureTool = new MeasureTools(viewer);
            }
            measureTool.measureHeight();
        });
        $("#clearMeasure").click(function () {
            try {
                measureTool.destroy();
                console.log("destory");
            } catch (err) { }
        });

        //显示设置
        $('#displaySettingA').click(function () {
            EventModels.displaySetting();
        });

        $('.close').click(function () {
            $(this.parentNode.parentNode).css('display', 'none');
        });
    }
);

// 控制面板
var EventModels = {
    //显示设置
    displaySetting: function () {
        $('#displaySettingWin').css('display', 'block');
        $("input[type='checkbox']", $('#displaySettingWin')).click(function () {
            switch ($(this).val()) {
                case 'toolbar':
                    if ($(this).is(':checked')) {
                        CesiumToolbar.init();
                    } else {
                        CesiumToolbar.hide();
                    }
                    break;
                case 'mapShadows':
                    if ($(this).is(':checked')) {
                        viewer.shadows = true;
                        viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
                    } else {
                        viewer.shadows = false;
                        viewer.terrainShadows = Cesium.ShadowMode.DISABLED;
                    }
                    break;
                case 'VRButton':
                    if ($(this).is(':checked')) {
                        $('.cesium-viewer-vrContainer').css('display', 'block');
                    } else {
                        $('.cesium-viewer-vrContainer').css('display', 'none');
                    }
                    break;
                case 'mousePosition':
                    var ele = document.querySelector('.mousePosition_div');
                    if ($(this).is(':checked')) {
                        var position = MapStatic.getMousePosition(ele);
                    } else {
                        var position = MapStatic.removeMousePosition(ele);
                    }
                    break;
                case 'time-controls':
                    if ($(this).is(':checked')) {
                        $('.cesium-viewer-animationContainer').css('display', 'block');
                        $('.cesium-viewer-timelineContainer').css('display', 'block');
                    } else {
                        $('.cesium-viewer-animationContainer').css('display', 'none');
                        $('.cesium-viewer-timelineContainer').css('display', 'none');
                    }
                    break;
                case 'fullscreen-controls':
                    if ($(this).is(':checked')) {
                        $('.cesium-viewer-fullscreenContainer').css('display', 'block');
                    } else {
                        $('.cesium-viewer-fullscreenContainer').css('display', 'none');
                    }
                    break;
                default:
                    break;
            }
        });
    },

    raniset: function () {

    },
}
