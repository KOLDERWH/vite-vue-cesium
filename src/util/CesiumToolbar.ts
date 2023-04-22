/**
 * CesiumToolbar
 */

import {
    Math,
    Viewer
} from "cesium";
class CesiumToolbar {
    private static viewer: Viewer;
    constructor() {
    }
    static init(viewer: Viewer) {
        CesiumToolbar.viewer = viewer;
        CesiumToolbar.addNorthViewBtn();
        CesiumToolbar.addRemoveAllDSBtn();
        CesiumToolbar.addZoomIn();
        CesiumToolbar.addZoomOut();
        CesiumToolbar.show();
    }
    static getCesiumToolbar() {
        return document.getElementsByClassName('.cesium-viewer-toolbar');
    }
    static show() {
        // document.getElementsByClassName('.cesium-viewer-toolbar').show();
    }
    static hide() {
        // document.getElementsByClassName('.cesium-viewer-toolbar').hide();
    }
    static add(ele: HTMLButtonElement) {
        document.querySelector('.cesium-viewer-toolbar')?.append(ele);
    }
    static remove(ele) {
        ele.remove();
    }
    static getImgButton(imgUrl: string, title: string) {
        let button = document.createElement('button');
        button.classList.add('cesium-button')
        button.classList.add('cesium-toolbar-button')
        button.title = title;
        button.style.backgroundImage = imgUrl;
        // document.getElementsByClassName("<button type='button " style = 'background-image: url(" + imgUrl + ");' > </button>");
        return button;
    }
    static addNorthViewBtn() {
        if (document.querySelectorAll('.northViewBtn').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('../assets/img/toolbar/northArr.png', '正北方向');

        button.onclick = () => {
            CesiumToolbar.viewer.camera.setView({
                orientation: {
                    heading: 0.0,
                    pitch: -Math.PI_OVER_TWO,
                    roll: 0.0
                }
            });
        }
        button.classList.add('northViewBtn');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addRemoveAllDSBtn() {
        if (document.querySelectorAll('.removeAllDSBtn').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('src/assets/img/toolbar/remove.png', '移除所有图层');
        button.onclick = () => {
            CesiumToolbar.viewer.dataSources.removeAll(true);
            CesiumToolbar.viewer.entities.removeAll();
            CesiumToolbar.viewer.scene.primitives.removeAll();
            // CesiumToolbar.Mychart.removeAllChart();
        }
        button.classList.add('removeAllDSBtn');
        CesiumToolbar.add(button);
    }
    static addZoomIn() {
        if (document.querySelectorAll('.zoomIn').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('../src/assets/img/toolbar/zoomIn.png', '放大');
        button.onclick = () => {
            // viewer 为 Viewer 对象
            let position = CesiumToolbar.viewer.camera.position;
            let cameraHeight = CesiumToolbar.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
            // 每次放大 20 倍，参数可改  
            let moveRate = cameraHeight / 20.0;
            CesiumToolbar.viewer.camera.moveForward(moveRate);
        }
        button.classList.add('zoomIn');
        button.classList.add('zoom');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addZoomOut() {
        if (document.querySelectorAll('.zoomOut').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('@/assets/img/toolbar/zoomOut.png', '缩小');
        button.onclick = () => {
            let position = CesiumToolbar.viewer.camera.position;
            let cameraHeight = CesiumToolbar.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
            // 每次缩小 20 倍，参数可改  
            let moveRate = cameraHeight / 20.0;
            CesiumToolbar.viewer.camera.moveBackward(moveRate);
        }

        button.classList.add('zoomOut');
        button.classList.add('zoom');
        CesiumToolbar.add(button);
    }

}
export default CesiumToolbar