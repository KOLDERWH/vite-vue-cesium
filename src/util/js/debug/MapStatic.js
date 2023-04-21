class MapStatic {
    constructor() {
    }

    // static flyTo(destination = { lon: 109.008, lat: 34.194, height: 700 }, orientation = { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0.0 }) {
    static flyTo(destination = { lon: 109.0078, lat: 34.18946, height: 700 }, orientation = { heading: 0, pitch: Cesium.Math.toRadians(100), roll: 0.0 }) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(destination.lon, destination.lat, destination.height),
            orientation: {
                heading: viewer.camera.heading,
                pitch: -Cesium.Math.PI_OVER_TWO + 0.9,
                // pitch: ,
                roll: 0,
                // heading: viewer.camera.heading,
                // pitch: viewer.camera.pitch,
                // range: 100
            }
        });
    }

    static mousePst(handler) {
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

    static mousefunc(handler) {
        // var clippingPoints = [];
        // let position = [];
        handler.setInputAction(function (click) {
            // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
            let ray = viewer.camera.getPickRay(click.position);
            // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
            position = viewer.scene.globe.pick(ray, viewer.scene);
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

    static drawPoint(position, config) {
        let config_ = config ? config : {};
        return viewer.entities.add({
            name: "点几何对象",
            position: position,
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        });
    }

    static drawPolygon(positions, config_) {
        if (positions.length < 2) return;
        let config = config_ ? config_ : {};
        return viewer.entities.add({
            name: "面几何对象",
            polygon: {
                hierarchy: positions,
                material: config.color ? new Cesium.Color.fromCssColorString(config.color).withAlpha(.2) : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
            },
        });
    }

    static clippings() {
        //将第一个点添加到最后一个点，完成闭环
        clippingPoints.push(clippingPoints[0]);
        // 将点集合逆转
        let newClippingPoints = clippingPoints.reverse();
        // truf判断多边形坐标是否为顺时针，true：顺时针，false：逆时针
        // console.log(turf.booleanClockwise(turf.lineString(clippingPoints)));
        let clippingPlanes1 = createClippingPlane(newClippingPoints);
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: clippingPlanes1,
            edgeWidth: 1.0,
            edgeColor: Cesium.Color.YELLOW
        });
    }

    static drawPolyline(positions, config_) {
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

    static /**
    * 根据多边形数组创建裁切面
    * @param points_ 多边形数组集合
    * @returns {[]} 返回裁切面数组
    */
        createClippingPlane(points_) {
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

    static getMousePosition(ele) {
        ele.style.display = 'block';
        //得到当前三维场景
        var scene = viewer.scene;
        //得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;

        var longitudeString = null;
        var latitudeString = null;
        var height = null;
        var cartesian = null;
        // 定义当前场景的画布元素的事件处理
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
        handler.setInputAction(function (movement) {
            //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //获取相机高度
                height = Math.ceil(viewer.camera.positionCartographic.height);

                longitudeString = longitudeString.toFixed(3);
                latitudeString = latitudeString.toFixed(3);
                ele.innerHTML = '经度:' + longitudeString + ', 纬度:' + latitudeString + ", 高程:" + height + '米';
            } else {

            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
        handler.setInputAction(function (wheelment) {
            height = Math.ceil(viewer.camera.positionCartographic.height);
            ele.innerHTML = '经度:' + longitudeString + ', 纬度:' + latitudeString + ", 高程:" + height + '米';
        }, Cesium.ScreenSpaceEventType.WHEEL);
    }
    static getMousePosition(ele) {
        ele.style.display = 'block';
        //得到当前三维场景
        var scene = viewer.scene;
        //得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;

        var longitudeString = null;
        var latitudeString = null;
        var height = null;
        var cartesian = null;
        // 定义当前场景的画布元素的事件处理
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
        handler.setInputAction(function (movement) {
            //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //获取相机高度
                height = Math.ceil(viewer.camera.positionCartographic.height);

                longitudeString = longitudeString.toFixed(3);
                latitudeString = latitudeString.toFixed(3);
                ele.innerHTML = '经度:' + longitudeString + ', 纬度:' + latitudeString + ", 高程:" + height + '米';
            } else {

            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
        handler.setInputAction(function (wheelment) {
            height = Math.ceil(viewer.camera.positionCartographic.height);
            ele.innerHTML = '经度:' + longitudeString + ', 纬度:' + latitudeString + ", 高程:" + height + '米';
        }, Cesium.ScreenSpaceEventType.WHEEL);
    }
    static removeMousePosition(ele) {
        ele.style.display = 'none';
    }
    static showCameraPosition() {
        var ele = document.querySelector('.mousePosition_div');

        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartesian3 = viewer.camera.position;
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lon = Cesium.Math.toDegrees(cartographic.longitude);
        var height = cartographic.height;

        lon = lon.toFixed(3);
        lat = lat.toFixed(3);
        height = height.toFixed(3);
        ele.innerHTML = '经度:' + lon + ', 纬度:' + lat + ", 高程:" + height + '米';
        console.log('changed');
    }
}