import {
    Cartographic,
    Math,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Viewer,
    defined
} from "cesium";

function buildInfo(viewer: Viewer) {
    // console.log("info");
    viewer.screenSpaceEventHandler.setInputAction(function onMouseClick(click) {
        //自己需要写逻辑的地方
        var pickedFeature = viewer.scene.pick(click.position);
        if (defined(pickedFeature)) {
            // console.log(pickedFeature);
            // console.log(pickedFeature.primitive);
            console.log(pickedFeature.content);
            console.log(pickedFeature.content._tile.boundingSphere.center);
        }

    }, ScreenSpaceEventType.LEFT_CLICK);
}

function mousePst(viewer: Viewer) {
    let handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (event) {
        let cartesian = viewer.scene.pickPosition(event.position);
        let cartographic = Cartographic.fromCartesian(cartesian);
        let lng = Math.toDegrees(cartographic.longitude);//经度
        let lat = Math.toDegrees(cartographic.latitude);//纬度
        let alt = cartographic.height;//高度
        let coordinate = {
            "longitude": Number(lng.toFixed(6)),
            "latitude": Number(lat.toFixed(6)),
            "altitude": Number(alt.toFixed(2)) + 3 * window.Math.floor((window.Math.random() * 10) + 1)
        };
        console.log(coordinate);
    }, ScreenSpaceEventType.LEFT_CLICK);
}
