<template>
    <el-form :model="form" label-width="120px" v-show="panelStore.isOpenRanPanel">
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
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button type='danger' @click="cancelmit">Cancel</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive,ref } from 'vue'
  import panelStatusStore from '../../store/index.ts'

  const panelStore = panelStatusStore();

  let rainSpeed=ref(1);
  let rainSize=ref(1);
  let rainAngel=ref(1);
  
  // do not use same name with ref
  
  const onSubmit = () => {
    console.log('submit!')
  }
  const cancelmit = () => {
    panelStore.panelStatusStore = false;
  }
  </script>
  