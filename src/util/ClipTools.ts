import {
    Cartesian3,
    ClippingPlane,
    ClippingPlaneCollection,
    Color,
    HeightReference,
    Math,
    Plane,
    PolylineGlowMaterialProperty,
    Ray,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Viewer
} from "cesium";
import Load3Dtiles from './DataLoad';
import GeometricKit from "./kits/GeometricKit";

class ClipTools {
    // clippingPoints: number[][];
    constructor() {
    }

    public static clip = function (viewer: Viewer) {
        // GeometricKit.destroy(viewer);
        let clippingPoints: number[][] = [];
        let tempPoints: Cartesian3[] = [];
        let handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        const point_config = {
            color: Color.SKYBLUE,
            pixelSize: 6,
            outlineColor: Color.YELLOW,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: HeightReference.CLAMP_TO_GROUND,
        }

        const line_configs = {
            name: "线几何对象",
            width: 5.0,
            material: new PolylineGlowMaterialProperty({ color: Color.GOLD, }),
            depthFailMaterial: new PolylineGlowMaterialProperty({ color: Color.GOLD }),
            clampToGround: true,
        }

        handler.setInputAction((click) => {
            console.log(click);

            // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
            let ray = viewer.camera.getPickRay(click.position) || new Ray();
            // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
            let position = viewer.scene.globe.pick(ray, viewer.scene);

            //将笛卡尔坐标转换为地理坐标
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position || new Cartesian3());
            //将弧度转为度的十进制度表示
            let longitudeString = Math.toDegrees(cartographic.longitude);
            let latitudeString = Math.toDegrees(cartographic.latitude);

            let points = [longitudeString, latitudeString];
            // 将点坐标添加到数组中
            clippingPoints.push(points);

            // 画点
            GeometricKit.addPoint(position || new Cartesian3, viewer, point_config)
            tempPoints.push(position || new Cartesian3());

            //调用绘制点的接口
            if (tempPoints.length > 1) {
                GeometricKit.addLine(tempPoints, viewer, line_configs);
            } else {
                // tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
        //右键点击操作
        handler.setInputAction((click) => {
            let cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
            GeometricKit.addPoint(cartesian || new Cartesian3(), viewer, point_config);
            if (cartesian) {
                if (tempPoints.length < 3) {
                    alert('请选择3个以上的点再执行闭合操作命令');
                } else {
                    //闭合最后一条线
                    GeometricKit.addLine([tempPoints[tempPoints.length - 1], tempPoints[0]], viewer, line_configs)

                    ClipTools.clippings(clippingPoints, viewer);
                    handler.destroy();//关闭事件句柄
                }
            }
        }, ScreenSpaceEventType.RIGHT_CLICK);
    }

    static clippings = function (clippingPoints: number[][], viewer: Viewer) {
        //将第一个点添加到最后一个点，完成闭环
        clippingPoints.push(clippingPoints[0]);
        // 将点集合逆转
        let newClippingPoints = clippingPoints.reverse();
        // truf判断多边形坐标是否为顺时针，true：顺时针，false：逆时针
        // console.log(turf.booleanClockwise(turf.lineString(clippingPoints)));
        let clippingPlanes = ClipTools.createClippingPlane(newClippingPoints);
        //底图的裁切
        viewer.scene.globe.clippingPlanes = new ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: 1.0,
            edgeColor: Color.WHITE,
        });

        //3dtiles的裁切
        let tilesClip: number[][] = []
        for (let i = 0; i < clippingPoints.length; i++) {
            tilesClip.push([clippingPoints[i][0] + 0.000105, clippingPoints[i][1] - 0.00015])
        }
        Load3Dtiles.upDated3dTiles(tilesClip)
        // Load3Dtiles.upDated3dTiles(clippingPoints)
        clippingPoints.pop()
    }


    /**
    * 根据多边形数组创建裁切面
    * @param points_ 多边形数组集合
    * @returns {[]} 返回裁切面数组
    */
    static createClippingPlane = function (points_: number[][]) {
        let points: Cartesian3[] = [];
        for (let i = 0; i < points_.length - 1; i++) {
            points.push(Cartesian3.fromDegrees(points_[i][0], points_[i][1]))
        }
        let pointsLength = points.length;
        let clippingPlanes: ClippingPlane[] = []; // 存储ClippingPlane集合
        for (let i = 0; i < pointsLength; ++i) {
            let nextIndex = (i + 1) % pointsLength;
            let midpoint = Cartesian3.add(points[i], points[nextIndex], new Cartesian3());
            midpoint = Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

            let up = Cartesian3.normalize(midpoint, new Cartesian3());
            let right = Cartesian3.subtract(points[nextIndex], midpoint, new Cartesian3());
            right = Cartesian3.normalize(right, right);

            let normal = Cartesian3.cross(right, up, new Cartesian3());
            normal = Cartesian3.normalize(normal, normal);

            let originCenteredPlane = new Plane(normal, 0.0);
            let distance = Plane.getPointDistance(originCenteredPlane, midpoint);

            clippingPlanes.push(new ClippingPlane(normal, distance));
        }
        return clippingPlanes;
    }


}

export default ClipTools
