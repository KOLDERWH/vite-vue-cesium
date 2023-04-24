<template>
  <el-form label-width="auto"
           class="layout"
           v-show="panelStore.isOpenRainPanel">
    <el-form-item label="雨速度">
      <el-col :span="20">
        <el-input v-model="rainSpeed"
                  maxlength="4">
          <template #append>°</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="雨角度">
      <el-col :span="20">
        <el-input v-model="rainSize"
                  maxlength="4">
          <template #append>°</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="雨大小"
                  maxlength="4">
      <el-col :span="20">
        <el-input v-model="rainAngel">
          <template #append>°</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="
                  下雨时间">
      <el-input-number v-model="hour"
                       :min="1"
                       :max="10"
                       controls-position="right" />
      <i>小时</i>
      <el-input-number v-model="min"
                       class="mx-4"
                       :min="0"
                       :max="60"
                       controls-position="right" />
      <i>分钟</i>
    </el-form-item>
    <el-form-item label="排水量">
      <el-col :span="18">
        <el-input v-model="displacement">
          <template #append>立方米/天</template>
        </el-input>
      </el-col>
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

const hour = ref(1)
const min = ref(10)
let rainSize = ref(0.6);
let rainAngel = ref(-6);
let rainSpeed = ref(120);
let displacement = ref(100);


const onSubmit = () => {
  WeatherEffect.rainEffect(cesiumStore.viewer, {
    tiltAngle: rainAngel.value, //倾斜角度
    rainSize: rainSize.value, //雨大小
    rainSpeed: rainSpeed.value //雨速
  });

  //水淹范围
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

  let startLevel = 3;
  let addLevel = Number(hour) + Number(min);

  drawWater(addLevel + startLevel, polygonArr, startLevel, cesiumStore.viewer);
}
const cancelmit = () => {
  panelStore.isOpenRainPanel = false;
}
</script>
