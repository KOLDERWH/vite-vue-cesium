/**
*
*@param{*}targetHeight目标高度
*@param{*}adapCoordi范围坐标
*@param{*}waterHeight当前水高度
*/
function drawWater(targetHeight, areaCoor, waterHeight) {
    let entity = viewer.entities.add({
        polygon: {
            height: waterHeight,
            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(areaCoor)),
            //perPositionHeight:true,
            extrudedHeight: new Cesium.CallbackProperty(function () {//此处用属性回调函数，直接设置extrudedHeight会导致闪烁。
                waterHeight += 0.005;
                if (waterHeight > targetHeight) {
                    waterHeight = targetHeight;//给个最大值
                }
                return waterHeight
            }, false),
            material: new Cesium.Color.fromBytes(97, 184, 255, 100),
        }
    });

}


