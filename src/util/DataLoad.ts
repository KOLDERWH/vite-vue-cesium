import {
    Cartesian3,
    Cesium3DTileset,
    ClippingPlane,
    ClippingPlaneCollection,
    Color,
    GeoJsonDataSource,
    Matrix4,
    Plane,
    Viewer
} from "cesium";

class Load3Dtiles {
    public static loaded_tileset: Cesium3DTileset;

    constructor() { }
    public static loadTail = async function (url: string, viewer: Viewer,) {
        let polygon: number[][] = [];
        let clippingPlanes = Load3Dtiles.CreateClipPlane(polygon);
        try {
            Load3Dtiles.loaded_tileset = await Cesium3DTileset.fromUrl(url, {
                clippingPlanes: clippingPlanes,
            });
            viewer.scene.primitives.add(Load3Dtiles.loaded_tileset)
        } catch (error) {
            console.error(`Error creating tileset: ${error}`);
        }
    }
    public static loadGeojson = function (url: string, viewer: Viewer) {
        viewer.dataSources.add(
            GeoJsonDataSource.load(
                url,	// 这里是json文件的地址
                {
                    stroke: Color.WHITE.withAlpha(0.001),
                    fill: Color.WHITE.withAlpha(0.01),
                    strokeWidth: 1
                }
            )
        ).then(function (dataSource) {
            // console.log(dataSource);

            const entities = dataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {

                const entity = entities[i];

                entity.name = entity.properties["小区名"]._value;
                entity.polygon.extrudedHeight = 60;

                // BuildTools.addEntity(entity);
            }
        });
        // let geojson = LoadGeojson("../../Data/geojson/building0.json");
    }

    /**
      * 对点进行坐标转换
      * @param point 点坐标 数组形式
      * @param inverseTransform 转换举证
      * @returns {*} ClippingPlane 裁切面
      */
    static getOriginCoordinateSystemPoint = function (point: number[], inverseTransform: Matrix4) {
        let val = Cartesian3.fromDegrees(point[0], point[1])
        return Matrix4.multiplyByPoint(
            inverseTransform, val, new Cartesian3(0, 0, 0))
    }

    /**
     * 创建裁剪面
     * @param p1 起始点
     * @param p2 结束点
     * @param inverseTransform 矩阵
     * @returns {*} ClippingPlane裁剪面（面法向量，点到面的垂直距离）
     */
    private static createPlane = function (p1: number[], p2: number[], inverseTransform: Matrix4): ClippingPlane {
        // 将仅包含经纬度信息的p1,p2，转换为相应坐标系的cartesian3对象
        let p1C3 = Load3Dtiles.getOriginCoordinateSystemPoint(p1, inverseTransform)
        let p2C3 = Load3Dtiles.getOriginCoordinateSystemPoint(p2, inverseTransform)

        // 定义一个垂直向上的向量up
        let up = new Cartesian3(0, 0, 10)
        //  right 实际上就是由p1指向p2的向量 （这里是p2--》p1）
        let right = Cartesian3.subtract(p2C3, p1C3, new Cartesian3())
        // 计算normal， right叉乘up，得到平面法向量（垂直于两个向量），这个法向量指向right的右侧
        let normal = Cartesian3.cross(right, up, new Cartesian3())
        normal = Cartesian3.normalize(normal, normal)

        //由于已经获得了法向量和过平面的一点，因此可以直接构造Plane,并进一步构造ClippingPlane
        let planeTmp = Plane.fromPointNormal(p1C3, normal)
        return ClippingPlane.fromPlane(planeTmp)
    }


    public static upDated3dTiles = function (polygon: number[][]) {
        if (!Load3Dtiles.loaded_tileset) {
            return
        }

        Load3Dtiles.loaded_tileset.clippingPlanes = Load3Dtiles.CreateClipPlane(polygon)
    }

    static CreateClipPlane = function (polygon: number[][]): ClippingPlaneCollection {
        let transform = Matrix4.fromArray(
            [-0.945486352222663, -0.325661722897675, 0,
                0, 0.183015057697393, -0.53134349890576,
                0.827151482394008, 0, -0.269371576853799,
                0.782060437824279, 0.561979025563584, 0,
            -1720046.16850291, 4993771.33745426, 3564440.21769667, 1]);

        //转换矩阵
        let inverseTransform = Matrix4.inverseTransformation(transform, new Matrix4());
        // clippingPlane集合
        let clippingPlanes1: ClippingPlane[] = [];
        for (let i = 0; i < polygon.length - 1; i++) {
            let plane = Load3Dtiles.createPlane(polygon[i], polygon[i + 1], inverseTransform);
            clippingPlanes1.push(plane);
        }
        // 创建裁剪平面
        return new ClippingPlaneCollection({
            planes: clippingPlanes1,
            edgeWidth: 1.0,
        });
    }


}
export default Load3Dtiles