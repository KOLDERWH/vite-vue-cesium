import {
    Cartesian3,
    ClippingPlane,
    ClippingPlaneCollection,
    Color,
    Entity,
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


// let clippingPoints = [];
// let position = [];
// let this.tempPoints = [];
// let tempEntities = [];



class ClipTools {
    private static viewer: Viewer;
    clippingPoints: number[][];
    position: Cartesian3;
    tempPoints: [];
    tempEntities: Entity[];
    constructor() {
    }

    public static clip = function (viewer: Viewer) {
        this.clippingPoints = [];
        this.tempPoints = [];
        this.tempEntities = [];
        this.viewer = viewer;
        let handler = new ScreenSpaceEventHandler(ClipTools.viewer.scene.canvas);
        handler.setInputAction((click) => {
            // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
            let ray = this.viewer.camera.getPickRay(click.position) || new Ray();
            // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
            this.position = this.viewer.scene.globe.pick(ray, ClipTools.viewer.scene);

            //将笛卡尔坐标转换为地理坐标
            let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(this.position);
            //将弧度转为度的十进制度表示
            let longitudeString = Math.toDegrees(cartographic.longitude);
            let latitudeString = Math.toDegrees(cartographic.latitude);

            let points = [longitudeString, latitudeString];
            // 将点坐标添加到数组中
            this.clippingPoints.push(points);
            this.tempPoints.push(this.position);
            let tempLength = this.tempPoints.length;
            //调用绘制点的接口
            let point = this.drawPoint(this.position);
            this.tempEntities.push(point);
            if (tempLength > 1) {
                let pointline = this.drawPolyline([this.tempPoints[this.tempPoints.length - 2], this.tempPoints[this.tempPoints.length - 1]]);
                this.tempEntities.push(pointline);
            } else {
                // tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
        //右键点击操作
        handler.setInputAction((click) => {
            let cartesian = ClipTools.viewer.camera.pickEllipsoid(click.position, ClipTools.viewer.scene.globe.ellipsoid);

            if (cartesian) {
                let tempLength = this.tempPoints.length;
                if (tempLength < 3) {
                    alert('请选择3个以上的点再执行闭合操作命令');
                } else {
                    //闭合最后一条线
                    let pointline = this.drawPolyline([this.tempPoints[this.tempPoints.length - 1], this.tempPoints[0]]);
                    this.tempEntities.push(pointline);
                    // that.drawPolygon(this.tempPoints);
                    this.tempEntities.push(this.tempPoints);
                    this.clippings(this.clippingPoints);
                    handler.destroy();//关闭事件句柄
                    // handler = null;
                }
            }
        }, ScreenSpaceEventType.RIGHT_CLICK);
    }

    private static drawPoint = function (position, config) {
        let config_ = config ? config : {};
        return ClipTools.viewer.entities.add({
            name: "point",
            position: position,
            point: {
                color: Color.SKYBLUE,
                pixelSize: 6,
                outlineColor: Color.YELLOW,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: HeightReference.CLAMP_TO_GROUND,
            }
        });
    }

    private static clippings = function (clippingPoints) {
        //将第一个点添加到最后一个点，完成闭环
        this.clippingPoints.push(clippingPoints[0]);
        // 将点集合逆转
        let newClippingPoints = this.clippingPoints.reverse();
        // truf判断多边形坐标是否为顺时针，true：顺时针，false：逆时针
        // console.log(turf.booleanClockwise(turf.lineString(clippingPoints)));
        let clippingPlanes = this.createClippingPlane(newClippingPoints);
        ClipTools.viewer.scene.globe.depthTestAgainstTerrain = true;
        //底图的裁切
        ClipTools.viewer.scene.globe.clippingPlanes = new ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: 1.0,
            edgeColor: Color.WHITE,
        });

        //3dtiles的裁切
        let tilesClip: Cartesian3[] = []
        for (let i = 0; i < this.clippingPoints.length; i++) {
            tilesClip.push(new Cartesian3(clippingPoints[i][0] + 0.000105, clippingPoints[i][1] - 0.00015))
        }
        Load3Dtiles.upDated3dTiles(tilesClip)
        this.clippingPoints.pop()
    }

    private static drawPolyline = function (positions, config_) {
        if (positions.length < 1) return;
        let config = config_ ? config_ : {};
        return ClipTools.viewer.entities.add({
            name: "线几何对象",
            polyline: {
                positions: positions,
                width: config.width ? config.width : 5.0,
                material: new PolylineGlowMaterialProperty({
                    color: config.color ? Color.fromCssColorString(config.color) : Color.GOLD,
                }),
                depthFailMaterial: new PolylineGlowMaterialProperty({
                    color: config.color ? Color.fromCssColorString(config.color) : Color.GOLD,
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
    private static createClippingPlane = function (points_) {
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
