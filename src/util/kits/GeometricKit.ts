import {
    CallbackProperty,
    Cartesian2,
    Cartesian3,
    ClassificationType,
    Color,
    Entity,
    LabelStyle,
    NearFarScalar,
    VerticalOrigin,
    Viewer
} from "cesium";

class GeometricKit {

    private static entityManageCollection: Entity[] = [];

    public static addEntity(addEntity: Entity) {
        GeometricKit.entityManageCollection.push(addEntity);
    }

    /**
     * 清除所有
     */
    public static destroy = function (viewer: Viewer) {
        for (let i = 0; i < GeometricKit.entityManageCollection.length; i++) {
            viewer.entities.removeById(GeometricKit.entityManageCollection[i].id)
        }
        GeometricKit.entityManageCollection = [];
    };

    public static destroyAll = function (viewer: Viewer) {

        for (let i = 0; i < GeometricKit.entityManageCollection.length; i++) {
            viewer.entities.removeById(GeometricKit.entityManageCollection[i].id)
        }
        GeometricKit.entityManageCollection = [];
        viewer.scene.postProcessStages.removeAll();
        //删除3dtiles
        viewer.scene.primitives.removeAll();
        // viewer.dataSources.removeAll(true);
        console.log(viewer.dataSources);


    };


    /**
 * 添加点返回点实体
 * @param position
 */
    public static addPoint = function (position: Cartesian3, viewer: Viewer, option?): Entity {
        let config: Object = Object.create(null);
        if (option) {
            config = option;
        } else {
            config = {
                color: Color.GREEN,
                pixelSize: 10,
                scaleByDistance: new NearFarScalar(500, 1.0, 2000, 0.0),
                translucencyByDistance: new NearFarScalar(500, 1.0, 2000, 0.0)
            }

        }

        const tempPoint = new Entity({
            position: position,
            point: config
        });
        viewer.entities.add(tempPoint)
        GeometricKit.addEntity(tempPoint)
        return tempPoint
    };

    /**
     * 添加线并返回线实体
     * @param position
     */
    static addLine = function (positions: Cartesian3[], viewer: Viewer, option?): Entity {
        let config: Object = Object.create(null);
        let dynamicPositions = new CallbackProperty(function () {
            return positions;
        }, false);
        if (option) {
            config = option;
        } else {

            config = {
                name: "直线",
                width: 4,
                material: Color.RED
            }
        }
        console.log(config);

        let tempLineEn = new Entity({
            polyline: {
                positions: dynamicPositions,
                ...config
            },
        });
        viewer.entities.add(tempLineEn);
        GeometricKit.addEntity(tempLineEn)

        return tempLineEn
    };

    /**
 * 添加面
 * @param positions
 */
    static addPolyGon = function (positions: Cartesian3[], viewer: Viewer): Entity {
        // let dynamicPositions = new CallbackProperty(function () {
        //     return positions;
        // }, false);
        let tempPolygonEnti = new Entity({
            polygon: {
                hierarchy: positions,
                material: Color.RED.withAlpha(0.6),
                classificationType: ClassificationType.BOTH // 贴地表和贴模型,如果设置了，这不能使用挤出高度
            }
        });
        viewer.entities.add(tempPolygonEnti)
        // MeasureTools.entityManageCollection.push(tempPolygonEnti)
        GeometricKit.addEntity(tempPolygonEnti)
        // this.entityCollection.push();
        return tempPolygonEnti
    };

    /**
* 添加标签
* @param position
* @param text
*/
    static addLabel = function (centerPoint: Cartesian3, text: string, viewer: Viewer): Entity {
        let tempLabelEnti = new Entity({
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
        })

        viewer.entities.add(tempLabelEnti);
        // MeasureTools.entityManageCollection.push(tempLabelEnti)
        GeometricKit.addEntity(tempLabelEnti)
        return tempLabelEnti
    };
}

export default GeometricKit