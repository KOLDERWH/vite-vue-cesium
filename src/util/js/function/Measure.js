/**
 * 依赖 jquery
 * CesiumToolbar
 */
class CesiumMeasure {
    constructor() {
    }
    static init() {
        CesiumToolbar.addNorthViewBtn();
        CesiumToolbar.addRemoveAllDSBtn();
        CesiumToolbar.addUntrackedBtnBtn();
        CesiumToolbar.addZoomIn();
        CesiumToolbar.addZoomOut();
        CesiumToolbar.addMeasure();
        CesiumToolbar.show();
    }
    static getCesiumToolbar() {
        return $('.cesium-viewer-toolbar');
    }
    static show() {
        $('.cesium-viewer-toolbar').show();
    }
    static hide() {
        $('.cesium-viewer-toolbar').hide();
    }
    static add(ele) {
        $('.cesium-viewer-toolbar').append(ele);
    }
    static remove(ele) {
        ele.remove();
    }
    static getImgButton(imgUrl, title) {
        var button = $("<button type='button' class='cesium-button cesium-toolbar-button' title=" + title + " style='background-image: url(" + imgUrl + ");' ></button>");
        return button;
    }
    static addNorthViewBtn() {
        if (document.querySelectorAll('.northViewBtn').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/northArr.png', '正北方向');
        button.click(function () {
            viewer.camera.setView({
                orientation: {
                    heading: 0.0,
                    pitch: -Cesium.Math.PI_OVER_TWO,
                    roll: 0.0
                }
            });
        });
        button.addClass('northViewBtn');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addRemoveAllDSBtn() {
        if (document.querySelectorAll('.removeAllDSBtn').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/remove.png', '移除所有图层');
        button.click(function () {
            viewer.dataSources.removeAll(true);
            viewer.entities.removeAll();
            viewer.scene.primitives.removeAll();
            Mychart.removeAllChart();
        });
        button.addClass('removeAllDSBtn');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addUntrackedBtnBtn() {
        if (document.querySelectorAll('.untrackedBtn').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/tracked.png', '取消最终定位');
        button.click(function () {
            viewer.trackedEntity = null;
        });
        button.addClass('untrackedBtn');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addZoomIn() {
        if (document.querySelectorAll('.zoonIn').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/zoomIn.png', '放大');
        button.click(function () {
            zoomIn()
        });
        button.addClass('zoomIn zoom');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addZoomOut() {
        if (document.querySelectorAll('.zoonOut').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/zoomOut.png', '缩小');
        button.click(function () {
            zoomOut()
        });
        button.addClass('zoonOut zoom');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }

    static addMeasure() {
        if (document.querySelectorAll('.measaure').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/', '缩小');
        button.click(function () {
            // tool.startPolyline()  // 画线
            // const measureTool = new MeasureTools(viewer);
            // measureTool.measurePolyLine();
            // measureTool.measurePolygon();
            console.log("hello");
            // measureTool.measureHeight();
            measuredisplaySetting();
        });
        button.addClass('measaure');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }

}

// 测量控制面板
// var EventModels = {
//显示设置
measuredisplaySetting = function () {
    console.log("1111");

    // $('#MeasureTools').css('display', 'block');
    // $("input[type='checkbox']", $('#displaySettingWin')).click(function () {
    //     switch ($(this).val()) {
    //         case 'toolbar':
    //             if ($(this).is(':checked')) {
    //                 CesiumToolbar.init();
    //             } else {
    //                 CesiumToolbar.hide();
    //             }
    //             break;
    //         case 'mapShadows':
    //             if ($(this).is(':checked')) {
    //                 viewer.shadows = true;
    //                 viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
    //             } else {
    //                 viewer.shadows = false;
    //                 viewer.terrainShadows = Cesium.ShadowMode.DISABLED;
    //             }
    //             break;
    //         case 'waterMap':
    //             if ($(this).is(':checked')) {
    //                 return;
    //                 var terrainProvider = Cesium.createWorldTerrain({
    //                     requestWaterMask: true,
    //                     requestVertexNormals: true
    //                 });
    //                 viewer.terrainProvider = terrainProvider;
    //             } else {
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // });
}
// }