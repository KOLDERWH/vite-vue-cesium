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
import { onMounted } from 'vue';
import CesiumBar from './CesiumBar.vue';
import RainPanel from './widget/RainPanel.vue';
import usecesiumStore from '../store/cesiumstore'

const cesiumstore = usecesiumStore();
// import RainPanel from '@/widget/RainPanel';
onMounted(()=>{
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMWJmNWUwZS1lMGFiLTRmNzgtYWRiNS00YWRjNmM0MjY1YWIiLCJpZCI6MTE3NDA0LCJpYXQiOjE2NzAzMzkwNjV9.JSpmO9WzmJE2nT5bg0l3iYP9VLntc8syzqhdNGQeOuw'
  const option={
      mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL, //2D地图可以在水平方向无限滚动
      timeline: true, //时间线
      geocoder: true, //地理编码
      homeButton: false,
      terrainProvider: Cesium.createWorldTerrain(),
      infoBox: false, 
      navigationHelpButton: false,
  };
  const viewer = new Cesium.Viewer('cesiumContainer', option);
  cesiumstore .viewer=viewer;

   // 显示帧速（FPS）
   viewer.scene.debugShowFramesPerSecond = true;



})

</script>  

<style scoped>
.el-container{
  height:100vh
}
.el-header,.el-main{
  padding:0
}
#cesiumContainer{
    margin: 0;
    padding: 0;
    height: 100%;
}
.rainPanel{
  position: absolute;
    background-color:#fff;
    top: 30%;
    left: 1%;
    width: 300px;
}
</style>