function mousePst() {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (event) {
        let cartesian = viewer.scene.pickPosition(event.position);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度
        let alt = cartographic.height;//高度
        let coordinate = {
            "longitude": Number(lng.toFixed(6)),
            "latitude": Number(lat.toFixed(6)),
            "altitude": Number(alt.toFixed(2)) + 3 * Math.floor((Math.random() * 10) + 1)
        };
        console.log(coordinate);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}