function LoadTail(url, polygon) {
    clippingPlanes = CreateClipPlane(polygon)
    tileset = new Cesium.Cesium3DTileset({
        url,
        clippingPlanes: clippingPlanes,
        unionClippingRegions: true,

    });
    viewer.scene.primitives.add(tileset);

    // 开启深度检测
    // viewer.scene.globe.depthTestAgainstTerrain = true;

    return tileset.readyPromise
        .then(function () {
            let boundingSphere = tileset.boundingSphere;//外包球
            let radius = boundingSphere.radius; //外包球半径

            return tileset;
        })
}
function LoadGeojson(url) {
    let geojson = viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(
            url	// 这里是json文件的地址
        )
    );
    // let geojson = Cesium.LoadGeojson("../../Data/geojson/building0.json");
    console.log("geojson" + geojson);
}


/**
  * 对点进行坐标转换
  * @param point 点坐标 数组形式
  * @param inverseTransform 转换举证
  * @returns {*} ClippingPlane 裁切面
  */
function getOriginCoordinateSystemPoint(point, inverseTransform) {
    let val = Cesium.Cartesian3.fromDegrees(point[0], point[1])
    return Cesium.Matrix4.multiplyByPoint(
        inverseTransform, val, new Cesium.Cartesian3(0, 0, 0))
}
/**
 * 创建裁剪面
 * @param p1 起始点
 * @param p2 结束点
 * @param inverseTransform 矩阵
 * @returns {*} ClippingPlane裁剪面（面法向量，点到面的垂直距离）
 */
function createPlane(p1, p2, inverseTransform) {
    // 将仅包含经纬度信息的p1,p2，转换为相应坐标系的cartesian3对象
    let p1C3 = getOriginCoordinateSystemPoint(p1, inverseTransform)
    let p2C3 = getOriginCoordinateSystemPoint(p2, inverseTransform)

    // 定义一个垂直向上的向量up
    let up = new Cesium.Cartesian3(0, 0, 10)
    //  right 实际上就是由p1指向p2的向量 （这里是p2--》p1）
    let right = Cesium.Cartesian3.subtract(p2C3, p1C3, new Cesium.Cartesian3())
    // 计算normal， right叉乘up，得到平面法向量（垂直于两个向量），这个法向量指向right的右侧
    let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
    normal = Cesium.Cartesian3.normalize(normal, normal)

    //由于已经获得了法向量和过平面的一点，因此可以直接构造Plane,并进一步构造ClippingPlane
    let planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal)
    return Cesium.ClippingPlane.fromPlane(planeTmp)
}


function upDated3dTiles(polygon) {
    tileset.clippingPlanes = CreateClipPlane(polygon)

}

function CreateClipPlane(polygon) {
    let transform = Cesium.Matrix4.fromArray(
        [-0.945486352222663, -0.325661722897675, 0,
            0, 0.183015057697393, -0.53134349890576,
            0.827151482394008, 0, -0.269371576853799,
            0.782060437824279, 0.561979025563584, 0,
        -1720046.16850291, 4993771.33745426, 3564440.21769667, 1]);

    //转换矩阵
    let inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
    // clippingPlane集合
    let clippingPlanes1 = [];
    for (let i = 0; i < polygon.length - 1; i++) {
        let plane = createPlane(polygon[i], polygon[i + 1], inverseTransform);
        clippingPlanes1.push(plane);
    }
    // 创建裁剪平面
    return new Cesium.ClippingPlaneCollection({
        planes: clippingPlanes1,
        edgeWidth: 1.0,
    });
}