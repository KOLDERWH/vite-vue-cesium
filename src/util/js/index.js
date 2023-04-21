Cesium.Ion.defaultAccessToken = cesium_CONFIG.defaultAccessToken;
var viewer
function earthInit() {
    var opetion = {
        mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL, //2D地图可以在水平方向无限滚动
        vrButton: true, //VR
        // terrainExaggeration: 1, //地形高程比例
        // shadows: false, //确定阴影是否由太阳投下
        // terrainShadows: Cesium.ShadowMode.DISABLED, //确定地形是否投射或接收来自太阳的阴影
        timeline: true, //时间线
        // navigationHelpButton: false, //使用帮助
        geocoder: true, //地理编码
        homeButton: false,
        // scene3DOnly: true,
        terrainProvider: Cesium.createWorldTerrain(),
        infoBox: false,
        navigationHelpButton: false,
    }
    viewer = new Cesium.Viewer('cesiumContainer', opetion);

    // viewer.scene.globe.depthTestAgainstTerrain = true;

    // 插件
    // viewer.extend(Cesium.viewerCesiumNavigationMixin);

    // 显示帧速（FPS）
    viewer.scene.debugShowFramesPerSecond = true;

    CesiumToolbar.init();

    MapStatic.mousePst(new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas))

    var homeview = window.setTimeout(function () {
        MapStatic.flyTo()
    }, 3000);

    // LoadTail('http://localhost:9003/model/tTW2KJ3i3/tileset.json', clippolygon)

    // LoadTail('http://localhost:9003/model/tTW2KJ3i3/tileset.json', [])
    LoadTail('/Data/3dtiles/scene.json', [])
    // LoadTail('/Data/geojson/building1.json', [])

    // LoadGeojson("/Data/geojson/building.json",)

}