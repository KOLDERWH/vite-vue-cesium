<template>
  <el-menu class="el-menu-demo"
           mode="horizontal"
           background-color="#222223"
           text-color="#fff"
           :ellipsis="false">
    <el-menu-item index="0">
      <img src="/img/page/logo.png"
           class="logo" />
      <span id="title"> 三维降水可视化</span>
    </el-menu-item>
    <div class="flex-grow" />

    <el-menu-item index="1"
                  @click="openSetpanel">
      <el-icon><img src="/img/page/set.png"
             class="setimg" /></el-icon>
      <span>&nbsp</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><img src="/img/page/cloud-drizzle.png"
               class="setimg" /></el-icon>
      </template>
      <el-menu-item index="2-1"
                    @click="openrainpanel">降水</el-menu-item>
      <el-menu-item index="2-2"
                    @click="snoweffect">下雪</el-menu-item>
      <el-menu-item index="2-3"
                    @click="fogeffect">雾天</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><img src="/img/page/cube-white.png"
               class="setimg" /></el-icon>
      </template>
      <el-menu-item index="3-1"
                    @click="modelFly">模拟飞行</el-menu-item>
      <el-menu-item index="3-2"
                    @click="loadModel">加载3DTiles</el-menu-item>
      <el-menu-item index="3-2"
                    @click="clipModel">裁切模型</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><img src="/img/page/ruler.png"
               class="setimg" /></el-icon>
      </template>
      <el-menu-item index="4-1"
                    @click="measureDistance">距离测量</el-menu-item>
      <el-menu-item index="4-2"
                    @click="measureArea">面积测量</el-menu-item>
      <el-menu-item index="4-3"
                    @click="measureTri">三角测量</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>


<script lang="ts" setup>
import {
  Color
} from "cesium";
import panelStatusStore from "../store";
import usecesiumStore from "../store/cesiumstore";
import CesiumMeasure from "../util/CesiumMeasure";
import ClipTools from "../util/ClipTools";
import Load3Dtiles from "../util/DataLoad";
import ModelFly from "../util/ModelFly";
import { WeatherEffect } from "../util/WeatherEffect";

const cesiumStore = usecesiumStore();
const panelStore = panelStatusStore();

const openSetpanel = () => {
  panelStore.isOpenSetPanel = !panelStore.isOpenSetPanel;
}

const openrainpanel = () => {
  panelStore.isOpenRainPanel = !panelStore.isOpenRainPanel;
};
const snoweffect = () => {
  WeatherEffect.snowEffect(cesiumStore.viewer, {
    snowSize: 0.01, //雪大小 
    snowSpeed: 60.0 //雪速
  });
};
const fogeffect = () => {
  WeatherEffect.fogEffect(cesiumStore.viewer, {
    visibility: 0.2,
    color: new Color(0.8, 0.8, 0.8, 0.3)
  });
};

// 模拟功能
const modelFly = () => {
  ModelFly.startFly(cesiumStore.viewer);
};
const loadModel = () => {

  // if (!Load3Dtiles.loaded_tileset) {
  if (cesiumStore.viewer.scene.primitives.length < 2) {
    console.log("load 3dtiles");
    Load3Dtiles.loadTail("Data/scene.json", cesiumStore.viewer);
    Load3Dtiles.loadGeojson("geojson/map.geojson", cesiumStore.viewer);
    console.log(cesiumStore.viewer.scene.primitives);
  }
  ModelFly.flyTo(cesiumStore.viewer);
};
const clipModel = () => {
  ClipTools.clip(cesiumStore.viewer);
};


// 测量工具
const measureDistance = () => {
  CesiumMeasure.measurePolyLine(cesiumStore.viewer);
};
const measureArea = () => {
  CesiumMeasure.measurePolygon(cesiumStore.viewer);
};
const measureTri = () => {
  CesiumMeasure.measureHeight(cesiumStore.viewer);
};

// test
// setTimeout(() => {
//   // loadModel();
//   // modelFly()
// }, 1000);

</script>


<style>
.logo {
  width: 60px;
}

.setimg {
  width: 32px;
}

.flex-grow {
  flex-grow: 1;
}

#title {
  font-size: xx-large;
}
</style>
  