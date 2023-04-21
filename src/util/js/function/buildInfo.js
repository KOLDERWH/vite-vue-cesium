function buildInfo() {
    // console.log("info");
    viewer.screenSpaceEventHandler.setInputAction(function onMouseClick(click) {
        //自己需要写逻辑的地方
        var pickedFeature = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedFeature)) {
            // console.log(pickedFeature);
            // console.log(pickedFeature.primitive);
            console.log(pickedFeature.content);
            console.log(pickedFeature.content._tile.boundingSphere.center);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}