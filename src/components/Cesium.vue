<template >
  <div class="common-layout">
    <el-container class>
      <el-header>
        <CesiumBar></CesiumBar>
      </el-header>
      <el-main>
        <div id="cesiumContainer"></div>
      </el-main>
    </el-container>
    <RainPanel class="rainPanel"></RainPanel>
  </div>
</template>
  

<script  lang="ts" setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";
import usecesiumStore from "../store/cesiumstore";
import CesiumToolbar from "../util/CesiumToolbar";
import CesiumBar from "./CesiumBar.vue";
import RainPanel from "./widget/RainPanel.vue";

const cesiumstore = usecesiumStore();
// import RainPanel from '@/widget/RainPanel';
onMounted(() => {
  // Cesium.Ion.defaultAccessToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMWJmNWUwZS1lMGFiLTRmNzgtYWRiNS00YWRjNmM0MjY1YWIiLCJpZCI6MTE3NDA0LCJpYXQiOjE2NzAzMzkwNjV9.JSpmO9WzmJE2nT5bg0l3iYP9VLntc8syzqhdNGQeOuw";
  const option = {
    mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL, //2D地图可以在水平方向无限滚动
    timeline: true, //时间线
    geocoder: true, //地理编码
    homeButton: false,
    // terrainProvider: Cesium.createWorldTerrain(),    // 开启这个会让模型乱跑？？？
    // infoBox: false,//右上角信息框
    navigationHelpButton: false,
  };
  const viewer = new Cesium.Viewer("cesiumContainer", option);

  viewer.scene.debugShowFramesPerSecond = true;  // 显示帧速（FPS）
  viewer.scene.globe.depthTestAgainstTerrain = true;

  viewer.cesiumWidget.creditContainer.style.display = "none"//取消版权信息

  CesiumToolbar.init(viewer);

  cesiumstore.viewer = viewer;

  // var scene = viewer.scene;
  // var handlerCli = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // handlerCli.setInputAction(function (movement) {
  //   var pick = viewer.scene.pick(movement.position);
  //   if (Cesium.defined(pick)) {
  //     console.log(pick.id.properties);
  //     for (let item of pick.id.properties.propertyNames) {
  //       console.log(item);
  //       console.log(pick.id.properties[item]._value);

  //     }
  //     // console.log(pick.id.properties.位置.value);
  //     // console.log(pick.id.properties.人数.value);
  //   }
  // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


  mousePst()
  function mousePst() {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
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

});
</script>  

<style scoped>
.el-container {
  height: 100vh;
}

.el-header,
.el-main {
  padding: 0;
}

#cesiumContainer {
  margin: 0;
  padding: 0;
  height: 100%;
}

.rainPanel {
  position: absolute;
  background-color: #fff;
  top: 30%;
  left: 1%;
  width: 300px;
}
</style>