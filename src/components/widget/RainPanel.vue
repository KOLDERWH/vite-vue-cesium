<template>
  <el-form label-width="120px"
           v-show="panelStore.isOpenRainPanel">
    <el-form-item label="雨速度">
      <el-input v-model="rainSpeed" />
    </el-form-item>
    <el-form-item label="雨角度">
      <el-input v-model="rainSize" />
    </el-form-item>
    <el-form-item label="雨大小">
      <el-input v-model="rainAngel" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 @click="onSubmit">Create</el-button>
      <el-button type='danger'
                 @click="cancelmit">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import panelStatusStore from '../../store';
import usecesiumStore from "../../store/cesiumstore";
import { WeatherEffect, drawWater } from "../../util/WeatherEffect";

const panelStore = panelStatusStore();
const cesiumStore = usecesiumStore();

let rainSize = ref(0.6);
let rainAngel = ref(-6);
let rainSpeed = ref(120);


// do not use same name with ref

const onSubmit = () => {
  WeatherEffect.rainEffect(cesiumStore.viewer, {
    tiltAngle: rainAngel.value, //倾斜角度
    rainSize: rainSize.value, //雨大小
    rainSpeed: rainSpeed.value //雨速
  });


  let points = [
    [109.00792, 34.191703],
    [109.008373, 34.191672],
    [109.008521, 34.195425],
    [109.007553, 34.195436],
  ]
  let polygonArr: number[] = [];
  for (let i = 0; i < points.length; i++) {
    polygonArr.push(points[i][0]);
    polygonArr.push(points[i][1]);
    polygonArr.push(0);
  }

  drawWater(4, polygonArr, 3, cesiumStore.viewer);
}
const cancelmit = () => {
  panelStore.isOpenRainPanel = false;
}
</script>
  