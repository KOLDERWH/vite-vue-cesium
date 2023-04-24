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
    <SetPanel class="setPanel"></SetPanel>
  </div>
</template>
  

<script  lang="ts" setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";
import usecesiumStore from "../store/cesiumstore";
import CesiumToolbar from "../util/CesiumToolbar";
import CesiumBar from "./CesiumBar.vue";
import RainPanel from "./widget/RainPanel.vue";
import SetPanel from "./widget/SetPanel.vue";

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

window.onload = function () {
  var menu = document.querySelector('.rainPanel') as HTMLElement;
  var isDragging = false;
  var dragX, dragY;

  menu.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragX = e.clientX - menu.offsetLeft;
    dragY = e.clientY - menu.offsetTop;
  });

  menu.addEventListener('mousemove', function (e) {
    if (isDragging) {
      menu.style.left = (e.clientX - dragX) + 'px';
      menu.style.top = (e.clientY - dragY) + 'px';
    }
  });

  menu.addEventListener('mouseup', function (e) {
    isDragging = false;
  });
}





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
  left: 3%;
  width: 300px;
  border-radius: 10px;
}

.setPanel {

  position: absolute;
  background-color: #fff;
  top: 30%;
  left: 3%;
  width: 300px;
  border-radius: 10px;
}
</style>