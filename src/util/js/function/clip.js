let clippingPoints = [];
let position = [];
let tempPoints = [];
let tempEntities = [];

function clip(handler) {
    handler.setInputAction(function (click) {
        // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
        let ray = viewer.camera.getPickRay(click.position);
        // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
        position = viewer.scene.globe.pick(ray, viewer.scene);
        console.log(position);
        //将笛卡尔坐标转换为地理坐标
        let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
        //将弧度转为度的十进制度表示
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);

        let points = [longitudeString, latitudeString];
        // 将点坐标添加到数组中
        clippingPoints.push(points);
        tempPoints.push(position);
        let tempLength = tempPoints.length;
        //调用绘制点的接口
        let point = drawPoint(position);
        tempEntities.push(point);
        if (tempLength > 1) {
            let pointline = drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
            tempEntities.push(pointline);
        } else {
            // tooltip.innerHTML = "请绘制下一个点，右键结束";
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //右键点击操作
    handler.setInputAction(function (click) {
        let cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

        if (cartesian) {
            let tempLength = tempPoints.length;
            if (tempLength < 3) {
                alert('请选择3个以上的点再执行闭合操作命令');
            } else {
                //闭合最后一条线
                let pointline = drawPolyline([tempPoints[tempPoints.length - 1], tempPoints[0]]);
                tempEntities.push(pointline);
                // that.drawPolygon(tempPoints);
                tempEntities.push(tempPoints);
                clippings();
                handler.destroy();//关闭事件句柄
                handler = null;
            }
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function drawPoint(position, config) {
    let config_ = config ? config : {};
    return viewer.entities.add({
        name: "point",
        position: position,
        point: {
            color: Cesium.Color.SKYBLUE,
            pixelSize: 6,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        }
    });
}

function clippings() {
    //将第一个点添加到最后一个点，完成闭环
    clippingPoints.push(clippingPoints[0]);
    // 将点集合逆转
    let newClippingPoints = clippingPoints.reverse();
    // truf判断多边形坐标是否为顺时针，true：顺时针，false：逆时针
    // console.log(turf.booleanClockwise(turf.lineString(clippingPoints)));
    let clippingPlanes = createClippingPlane(newClippingPoints);
    viewer.scene.globe.depthTestAgainstTerrain = true;
    //底图的裁切
    viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: clippingPlanes,
        edgeWidth: 1.0,
        edgeColor: Cesium.Color.white,
    });

    //3dtiles的裁切
    let tilesClip = []
    for (let i = 0; i < clippingPoints.length; i++) {
        tilesClip.push([clippingPoints[i][0] + 0.000105, clippingPoints[i][1] - 0.00015])
    }
    upDated3dTiles(tilesClip)
    clippingPoints.pop()
}

function drawPolyline(positions, config_) {
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

/**
* 根据多边形数组创建裁切面
* @param points_ 多边形数组集合
* @returns {[]} 返回裁切面数组
*/
function createClippingPlane(points_) {
    let points = [];
    for (let i = 0; i < points_.length - 1; i++) {
        points.push(Cesium.Cartesian3.fromDegrees(points_[i][0], points_[i][1]))
    }
    let pointsLength = points.length;
    let clippingPlanes = []; // 存储ClippingPlane集合
    for (let i = 0; i < pointsLength; ++i) {
        let nextIndex = (i + 1) % pointsLength;
        let midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

        let up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        let right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);

        let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);

        let originCenteredPlane = new Cesium.Plane(normal, 0.0);
        let distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

        clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
    }
    return clippingPlanes;
}

