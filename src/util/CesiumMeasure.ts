/**
 * 测量线段
 */
import {
    CallbackProperty,
    Cartesian2,
    Cartesian3,
    Cartographic,
    ClassificationType,
    Color,
    EllipsoidGeodesic,
    Entity,
    LabelStyle,
    Math,
    NearFarScalar,
    ScreenSpaceEventType,
    VerticalOrigin,
    Viewer
} from "cesium";


class MeasureTools {
    private viewer: Viewer;
    private entityCollection: Entity[] = [];
    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.entityCollection = [];

    }

    getCollection = function () {
        return this.entityCollection;
    };

    /**
     * 清除
     */
    destroy = function () {
        for (let i = 0; i < this.entityCollection.length; i++) {
            this.viewer.entities.remove(this.entityCollection[i]);
        }
        this.entityCollection = [];
    };

    /**
     * 测距
     */
    measurePolyLine = function () {

        let positions: Cartesian3[] = [];
        let labelEntity = null; // 标签实体

        // 注册鼠标左击事件
        this.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
            let cartesian = this.viewer.scene.pickPosition(clickEvent.position); // 坐标

            // 存储第一个点
            if (positions.length == 0) {
                positions.push(cartesian.clone());

                this.addPoint(cartesian);

                // 注册鼠标移动事件
                this.viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
                    let movePosition = this.viewer.scene.pickPosition(moveEvent.endPosition); // 鼠标移动的点
                    if (positions.length == 2) {
                        positions.pop();
                        positions.push(movePosition);

                        // 绘制label
                        if (labelEntity) {
                            this.viewer.entities.remove(labelEntity);
                            this.entityCollection.splice(this.entityCollection.indexOf(labelEntity), 1);
                        }

                        // 计算中点
                        let centerPoint = Cartesian3.midpoint(positions[0], positions[1], new Cartesian3());
                        // 计算距离
                        let lengthText = "距离：" + this.getLengthText(positions[0], positions[1]);

                        labelEntity = this.addLabel(centerPoint, lengthText);
                        this.entityCollection.push(labelEntity);

                    } else {
                        positions.push(movePosition);

                        // 绘制线
                        this.addLine(positions);
                    }
                }, ScreenSpaceEventType.MOUSE_MOVE);
            } else {
                // 存储第二个点
                positions.pop();
                positions.push(cartesian);
                this.addPoint(cartesian);
                this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
    };

    /**
     * 测面积
     */
    measurePolygon = function () {

        let positions: Cartesian3[] = [];
        let clickStatus = false;
        let labelEntity = null;

        this.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {

            clickStatus = true;
            // 贴合3dtiles模型
            let cartesian = this.viewer.scene.pickPosition(clickEvent.position);

            // 不贴合3dtiles
            // let cartesian = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(clickEvent.position), this.viewer.scene);

            if (positions.length == 0) {
                positions.push(cartesian.clone()); //鼠标左击 添加第1个点
                this.addPoint(cartesian);

                this.viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
                    // let movePosition = this.viewer.scene.pickPosition(moveEvent.endPosition);
                    let movePosition = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(moveEvent.endPosition), this.viewer.scene);

                    if (positions.length == 1) {
                        positions.push(movePosition);
                        this.addLine(positions);
                    } else {
                        if (clickStatus) {
                            positions.push(movePosition);
                        } else {
                            positions.pop();
                            positions.push(movePosition);
                        }
                    }
                    if (positions.length >= 3) {
                        // 绘制label
                        if (labelEntity) {
                            this.viewer.entities.remove(labelEntity);
                            this.entityCollection.splice(this.entityCollection.indexOf(labelEntity), 1);
                        }

                        let text = "面积：" + this.getArea(positions);
                        let centerPoint = this.getCenterOfGravityPoint(positions);
                        labelEntity = this.addLabel(centerPoint, text);

                        this.entityCollection.push(labelEntity);
                    }


                    clickStatus = false;
                }, ScreenSpaceEventType.MOUSE_MOVE);


            } else if (positions.length == 2) {
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第2个点

                this.addPoint(cartesian);

                // addPolyGon(positions);

                // 右击结束
                this.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {

                    let clickPosition = this.viewer.scene.pickPosition(clickEvent.position);
                    // let clickPosition = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(clickEvent.position), this.viewer.scene);

                    positions.pop();
                    positions.push(clickPosition);
                    positions.push(positions[0]); // 闭合
                    this.addPoint(clickPosition);
                    this.addPolyGon(positions);

                    this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                    this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                    this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);

                }, ScreenSpaceEventType.RIGHT_CLICK);

            } else if (positions.length >= 3) {
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第3个点
                this.addPoint(cartesian);
            }

        }, ScreenSpaceEventType.LEFT_CLICK);
    };

    /**
     * 测高
     */
    measureHeight = function () {
        let positions: Cartesian3[] = [];
        let labelEntity_1 = null; // 标签实体
        let labelEntity_2 = null; // 标签实体
        let labelEntity_3 = null; // 标签实体

        // 注册鼠标左击事件
        this.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
            let cartesian = this.viewer.scene.pickPosition(clickEvent.position); // 坐标

            // 存储第一个点
            if (positions.length == 0) {
                positions.push(cartesian.clone());
                this.this.addPoint(cartesian);

                // 注册鼠标移动事件
                this.viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
                    let movePosition = this.viewer.scene.pickPosition(moveEvent.endPosition); // 鼠标移动的点
                    if (positions.length >= 2) {
                        positions.pop();
                        positions.pop();
                        positions.pop();

                        let cartographic = Cartographic.fromCartesian(movePosition);
                        let height = Cartographic.fromCartesian(positions[0]).height;

                        let verticalPoint = Cartesian3.fromDegrees(Math.toDegrees(cartographic.longitude), Math.toDegrees(cartographic.latitude), height);
                        positions.push(verticalPoint);
                        positions.push(movePosition);
                        positions.push(positions[0]);

                        // 绘制label
                        if (labelEntity_1) {
                            this.viewer.entities.remove(labelEntity_1);
                            this.entityCollection.splice(this.entityCollection.indexOf(labelEntity_1), 1);
                            this.viewer.entities.remove(labelEntity_2);
                            this.entityCollection.splice(this.entityCollection.indexOf(labelEntity_2), 1);
                            this.viewer.entities.remove(labelEntity_3);
                            this.entityCollection.splice(this.entityCollection.indexOf(labelEntity_3), 1);
                        }

                        // 计算中点
                        let centerPoint_1 = Cartesian3.midpoint(positions[0], positions[1], new Cartesian3());
                        // 计算距离
                        let lengthText_1 = "水平距离：" + this.getLengthText(positions[0], positions[1]);

                        labelEntity_1 = this.addLabel(centerPoint_1, lengthText_1);
                        this.entityCollection.push(labelEntity_1);

                        // 计算中点
                        let centerPoint_2 = Cartesian3.midpoint(positions[1], positions[2], new Cartesian3());
                        // 计算距离
                        let lengthText_2 = "垂直距离：" + this.getLengthText(positions[1], positions[2]);

                        labelEntity_2 = this.addLabel(centerPoint_2, lengthText_2);
                        this.entityCollection.push(labelEntity_2);

                        // 计算中点
                        let centerPoint_3 = Cartesian3.midpoint(positions[2], positions[3], new Cartesian3());
                        // 计算距离
                        let lengthText_3 = "直线距离：" + this.getLengthText(positions[2], positions[3]);

                        labelEntity_3 = this.addLabel(centerPoint_3, lengthText_3);
                        this.entityCollection.push(labelEntity_3);

                    } else {
                        let verticalPoint = new Cartesian3(movePosition.x, movePosition.y, positions[0].z);
                        positions.push(verticalPoint);
                        positions.push(movePosition);
                        positions.push(positions[0]);
                        // 绘制线
                        this.addLine(positions);
                    }
                }, ScreenSpaceEventType.MOUSE_MOVE);
            } else {
                // 存储第二个点
                positions.pop();
                positions.pop();
                positions.pop();
                let cartographic = Cartographic.fromCartesian(cartesian);
                let height = Cartographic.fromCartesian(positions[0]).height;

                let verticalPoint = Cartesian3.fromDegrees(Math.toDegrees(cartographic.longitude), Math.toDegrees(cartographic.latitude), height);
                positions.push(verticalPoint);
                positions.push(cartesian);
                positions.push(positions[0]);
                this.addPoint(cartesian);
                this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
    };

    /**
     * 添加点
     * @param position
     */
    addPoint = function (position) {
        // console.log(position);
        // position = [position.x, position.y, (Number)((position.z) + 100000)];
        console.log(position);
        this.entityCollection.push(this.viewer.entities.add(new Entity({
            position: position,
            point: {
                color: Color.GREEN,
                pixelSize: 10,
                scaleByDistance: new NearFarScalar(500, 1.0, 2000, 0.0),
                translucencyByDistance: new NearFarScalar(500, 1.0, 2000, 0.0)
            }
        })));
    };

    /**
     * 添加线
     * @param positions
     */
    addLine = function (positions) {
        let dynamicPositions = new CallbackProperty(function () {
            return positions;
        }, false);
        this.entityCollection.push(this.viewer.entities.add(new Entity({
            polyline: {
                positions: dynamicPositions,
                width: 4,
                material: Color.RED
            }
        })));
    };

    /**
     * 添加面
     * @param positions
     */
    addPolyGon = function (positions) {
        // let dynamicPositions = new CallbackProperty(function () {
        //     return positions;
        // }, false);
        this.entityCollection.push(this.viewer.entities.add(new Entity({
            polygon: {
                hierarchy: positions,
                material: Color.RED.withAlpha(0.6),
                classificationType: ClassificationType.BOTH // 贴地表和贴模型,如果设置了，这不能使用挤出高度
            }
        })));
    };

    /**
     * 添加标签
     * @param position
     * @param text
     */
    addLabel = function (centerPoint, text) {
        return this.viewer.entities.add(new Entity({
            position: centerPoint,
            label: {
                text: text,
                font: '12pt sans-serif',
                style: LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
                fillColor: Color.YELLOW,
                showBackground: true,//指定标签后面背景的可见性
                backgroundColor: new Color(0.165, 0.165, 0.165, 0.8), // 背景颜色
                verticalOrigin: VerticalOrigin.BASELINE,
                backgroundPadding: new Cartesian2(6, 6),//指定以像素为单位的水平和垂直背景填充padding
                pixelOffset: new Cartesian2(0, -25)
            }
        }));
    };

    /**
     * 计算两点距离
     * @param firstPoint
     * @param secondPoint
     */
    getLengthText = function (firstPoint, secondPoint) {
        // 计算距离
        let length = Cartesian3.distance(firstPoint, secondPoint);
        let len_result: string;
        if (length > 1000) {
            len_result = (length / 1000).toFixed(2) + " 公里";
        } else {
            len_result = length.toFixed(2) + " 米";
        }
        return len_result;
    };

    //计算多边形面积
    getArea = function (points) {
        2

        let radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
        let degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

        /*角度*/
        function Angle(p1, p2, p3) {
            let bearing21 = Bearing(p2, p1);
            let bearing23 = Bearing(p2, p3);
            let angle = bearing21 - bearing23;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        }

        /*方向*/
        function Bearing(from, to) {
            from = Cartographic.fromCartesian(from);
            to = Cartographic.fromCartesian(to);

            let lat1 = from.latitude;
            let lon1 = from.longitude;
            let lat2 = to.latitude;
            let lon2 = to.longitude;
            let angle = -window.Math.atan2(window.Math.sin(lon1 - lon2) * window.Math.cos(lat2), window.Math.cos(lat1) * window.Math.sin(lat2) - window.Math.sin(lat1) * window.Math.cos(lat2) * window.Math.cos(lon1 - lon2));
            if (angle < 0) {
                angle += Math.PI * 2.0;
            }
            angle = angle * degreesPerRadian;//角度
            return angle;
        }

        function distance(point1, point2) {
            let point1cartographic = Cartographic.fromCartesian(point1);
            let point2cartographic = Cartographic.fromCartesian(point2);
            /**根据经纬度计算出距离**/
            let geodesic = new EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            let s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = window.Math.sqrt(window.Math.pow(s, 2) + window.Math.pow(point2cartographic.height - point1cartographic.height, 2));
            return s;
        }

        let res = 0;
        //拆分三角曲面

        for (let i = 0; i < points.length - 2; i++) {
            let j = (i + 1) % points.length;
            let k = (i + 2) % points.length;
            debugger
            let totalAngle = Angle(points[i], points[j], points[k]);


            let dis_temp1 = distance(points[j], points[0]);
            let dis_temp2 = distance(points[k], points[0]);
            res += dis_temp1 * dis_temp2 * window.Math.sin(totalAngle) / 2;
            // console.log(res);
        }
        let res_result: string;
        if (res < 1000000) {
            res_result = window.Math.abs(res).toFixed(4) + " 平方米";
        } else {
            let temp = Number(res / 1000000.0).toFixed(4);
            res_result = window.Math.abs(Number(temp)) + " 平方公里";
        }

        return res_result;

    };

    /**
     * 计算多边形的中心（简单的处理）
     * @param mPoints
     * @returns {*[]}
     */
    getCenterOfGravityPoint = function (mPoints) {
        let centerPoint = mPoints[0];
        for (let i = 1; i < mPoints.length; i++) {
            centerPoint = Cartesian3.midpoint(centerPoint, mPoints[i], new Cartesian3());
        }
        return centerPoint;
    }

}
export default MeasureTools

