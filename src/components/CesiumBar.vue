<template>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#222223"
      text-color="#fff"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="0"> 
        <img src="../assets/img/page/logo.png" class="logo" >
      </el-menu-item>
      <div class="flex-grow" />

      <el-menu-item index="1">
        <el-icon><img src="../assets/img/page/set.png" class="setimg" ></el-icon>
        <span>&nbsp</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><img src="../assets/img/page/cloud-drizzle.png" class="setimg" ></el-icon>
        </template>
        <el-menu-item index="2-1" >降水</el-menu-item>
        <el-menu-item index="2-2">下雪</el-menu-item>
        <el-menu-item index="2-3">雾天</el-menu-item>
        <el-menu-item index="2-4">清除天气效果</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><img src="../assets/img/page/cube-white.png" class="setimg" ></el-icon>
        </template>
        <el-menu-item index="3-1">模拟飞行</el-menu-item>
        <el-menu-item index="3-2">裁切模型</el-menu-item>
        <el-menu-item index="3-3">item three</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>
          <el-icon><img src="../assets/img/page/ruler.png" class="setimg" ></el-icon>
        </template>
        <el-menu-item index="4-1">距离测量</el-menu-item>
        <el-menu-item index="4-2">面积测量</el-menu-item>
        <el-menu-item index="4-3">三角测量</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  const activeIndex = ref('1')
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  </script>
  
  <style>
  .logo{
    width:60px
  }
  .setimg{
    width:32px;
  }
  .flex-grow {
    flex-grow: 1;
  }
  </style>
  