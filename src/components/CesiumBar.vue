<template>
  <el-menu :default-active="activeIndex"
           class="el-menu-demo"
           mode="horizontal"
           background-color="#222223"
           text-color="#fff"
           :ellipsis="false"
           @select="handleSelect">
    <el-menu-item index="0">
      <img src="../assets/img/page/logo.png"
           class="logo" />
    </el-menu-item>
    <div class="flex-grow" />

    <el-menu-item index="1">
      <el-icon><img src="../assets/img/page/set.png"
             class="setimg" /></el-icon>
      <span>&nbsp</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><img src="../assets/img/page/cloud-drizzle.png"
               class="setimg" /></el-icon>
      </template>
      <el-menu-item index="2-1"
                    @click="openrainpanel">降水</el-menu-item>
      <el-menu-item index="2-2"
                    @click="snoweffect">下雪</el-menu-item>
      <el-menu-item index="2-3"
                    @click="frogeffect">雾天</el-menu-item>
      <el-menu-item index="2-4"
                    @click="cleanWeathereffect">清除天气效果</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><img src="../assets/img/page/cube-white.png"
               class="setimg" /></el-icon>
      </template>
      <el-menu-item index="3-1"
                    @click="modelFly">模拟飞行</el-menu-item>
      <el-menu-item index="3-2"
                    @click="loadModel">加载模型</el-menu-item>
      <el-menu-item index="3-3"
                    @click="clipModel">裁切模型</el-menu-item>
      <el-menu-item index="3-4"
                    @click="cleanClip">清除裁切</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><img src="../assets/img/page/ruler.png"
               class="setimg" /></el-icon>
      </template>
      <el-menu-item index="4-1"
                    @click="measureDistance">距离测量</el-menu-item>
      <el-menu-item index="4-2"
                    @click="measureArea">面积测量</el-menu-item>
      <el-menu-item index="4-3"
                    @click="measureTri">三角测量</el-menu-item>
      <el-menu-item index="4-4"
                    @click="cleanMeasure">清除测量</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>


<script lang="ts" setup>
import {
  Cartesian3,
  Math
} from "cesium";
import { ref } from "vue";
import usecesiumStore from "../store/cesiumstore";
import CesiumMeasure from "../util/CesiumMeasure";
import ClipTools from "../util/ClipTools";
import Load3Dtiles from "../util/DataLoad";
import ModelFly from "../util/ModelFly";

const cesiumStore = usecesiumStore();

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};

const openrainpanel = () => { };
const snoweffect = () => { };
const frogeffect = () => { };
const cleanWeathereffect = () => { };

// 模拟功能
const modelFly = () => {
  ModelFly.startFly(cesiumStore.viewer);
};
const loadModel = () => {
  Load3Dtiles.loadTail("src/assets/Data/scene.json", cesiumStore.viewer);
  flyTo()
};
const clipModel = () => {
  ClipTools.clip(cesiumStore.viewer);
};
const cleanClip = () => { };

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
const cleanMeasure = () => {
  CesiumMeasure.destroy(cesiumStore.viewer);
}

// 定位到目标地点
function flyTo(
  destination = { lon: 109.0078, lat: 34.18946, height: 700 },
  // orientation = { heading: 0, pitch: Math.toRadians(100), roll: 0.0 }
) {
  cesiumStore.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(
      destination.lon,
      destination.lat,
      destination.height
    ),
    orientation: {
      // heading: cesiumStore.viewer.camera.heading,
      heading: 0,
      pitch: -Math.PI_OVER_TWO + 0.9,
      // pitch: Math.toRadians(100),
      roll: 0,
    },
  });
}


// test
setTimeout(() => {
  loadModel()
}, 1000);
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
</style>
  