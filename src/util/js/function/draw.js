function drawPolygon(positions, config_) {
    if (positions.length < 2) return;
    let config = config_ ? config_ : {};
    return viewer.entities.add({
        name: "面几何对象",
        polygon: {
            hierarchy: positions,
            material: config.color ? new Cesium.Color.fromCssColorString(config.color).withAlpha(.2) : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
        },
    });
};

drawPolyline(positions, config_) {
    let viewer = this._viewer;
    if (positions.length < 1) return;
    let config = config_ ? config_ : {};
    return viewer.entities.add({
        name: "线几何对象",
        polyline: {
            positions: positions,
            width: config.width ? config.width : 5.0,
            material: new Cesium.PolylineGlowMaterialProperty({
                color: config.color ? new Cesium.Color.fromCssColorString(config.color) : Cesium.Color.GOLD,
            }),
            depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                color: config.color ? new Cesium.Color.fromCssColorString(config.color) : Cesium.Color.GOLD,
            }),
            clampToGround: true,
        }
    });
}