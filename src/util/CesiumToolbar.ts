/**
 * CesiumToolbar
 */

import {
    Math,
    Viewer
} from "cesium";
import GeometricKit from './kits/GeometricKit';
class CesiumToolbar {
    constructor() {
    }
    static init(viewer: Viewer) {
        CesiumToolbar.addNorthViewBtn(viewer);
        CesiumToolbar.addRemoveAllDSBtn(viewer);
        CesiumToolbar.addZoomIn(viewer);
        CesiumToolbar.addZoomOut(viewer);
        // CesiumToolbar.show(viewer);
    }
    static getCesiumToolbar() {
        return document.getElementsByClassName('.cesium-viewer-toolbar');
    }
    static show(viewer: Viewer) {
        // document.getElementsByClassName('.cesium-viewer-toolbar').show();
    }
    static hide() {
        // document.getElementsByClassName('.cesium-viewer-toolbar').hide();
    }
    static add(ele: HTMLButtonElement) {
        document.querySelector('.cesium-viewer-toolbar')?.append(ele);
    }
    static remove(ele: HTMLElement) {
        ele.remove();
    }
    static getImgButton(imgUrl: string, title: string) {
        let button = document.createElement('button');
        button.classList.add('cesium-button')
        button.classList.add('cesium-toolbar-button')
        button.title = title;
        button.style.backgroundImage = `url(${imgUrl})`;
        // document.getElementsByClassName("<button type='button " style = 'background-image: url(" + imgUrl + ");' > </button>");
        return button;
    }
    static addNorthViewBtn(viewer: Viewer) {
        if (document.querySelectorAll('.northViewBtn').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('/img/toolbar/northArr.png', '正北方向');

        button.onclick = () => {
            viewer.camera.setView({
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
    static addRemoveAllDSBtn(viewer: Viewer) {
        if (document.querySelectorAll('.removeAllDSBtn').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('/img/toolbar/remove.png', '移除所有图层');
        button.onclick = () => {
            GeometricKit.destroyAll(viewer)
            // viewer.dataSources.removeAll(true);
            // viewer.entities.removeAll();
            // viewer.scene.primitives.removeAll();
            // CesiumToolbar.Mychart.removeAllChart();
        }
        button.classList.add('removeAllDSBtn');
        CesiumToolbar.add(button);
    }
    static addZoomIn(viewer: Viewer) {
        if (document.querySelectorAll('.zoomIn').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('/img/toolbar/zoomIn.png', '放大');
        button.onclick = () => {
            // viewer 为 Viewer 对象
            let position = viewer.camera.position;
            let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
            // 每次放大 20 倍，参数可改  
            let moveRate = cameraHeight / 20.0;
            viewer.camera.moveForward(moveRate);
        }
        button.classList.add('zoomIn');
        button.classList.add('zoom');
        //button.css('transform','rotate(-45deg)');
        CesiumToolbar.add(button);
    }
    static addZoomOut(viewer: Viewer) {
        if (document.querySelectorAll('.zoomOut').length > 0) {
            return;
        }
        let button = CesiumToolbar.getImgButton('/img/toolbar/zoomOut.png', '缩小');
        button.onclick = () => {
            let position = viewer.camera.position;
            let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
            // 每次缩小 20 倍，参数可改  
            let moveRate = cameraHeight / 20.0;
            viewer.camera.moveBackward(moveRate);
        }

        button.classList.add('zoomOut');
        button.classList.add('zoom');
        CesiumToolbar.add(button);
    }

}


export default CesiumToolbar