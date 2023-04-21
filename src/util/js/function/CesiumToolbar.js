/**
 * 依赖 jquery
 * CesiumToolbar
 */
class CesiumToolbar {
    constructor() {
    }
    static init() {
        CesiumToolbar.addNorthViewBtn();
        CesiumToolbar.addRemoveAllDSBtn();
        CesiumToolbar.addZoomIn();
        CesiumToolbar.addZoomOut();
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
        CesiumToolbar.add(button);
    }
    static addZoomIn() {
        if (document.querySelectorAll('.zoomIn').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/zoomIn.png', '放大');
        button.click(function () {
            // viewer 为 Viewer 对象
            let position = viewer.camera.position;
            let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
            // 每次放大 20 倍，参数可改  
            let moveRate = cameraHeight / 20.0;
            viewer.camera.moveForward(moveRate);
        });
        button.addClass('zoomIn zoom');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addZoomOut() {
        if (document.querySelectorAll('.zoomOut').length > 0) {
            return;
        }
        var button = CesiumToolbar.getImgButton('img/toolbar/zoomOut.png', '缩小');
        button.click(function () {
            let position = viewer.camera.position;
            let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
            // 每次缩小 20 倍，参数可改  
            let moveRate = cameraHeight / 20.0;
            viewer.camera.moveBackward(moveRate);
        });
        button.addClass('zoomOut zoom');
        CesiumToolbar.add(button);
    }

}