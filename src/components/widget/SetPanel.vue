<template>
    <el-form label-width="auto"
             class="layout"
             v-show="panelStore.isOpenSetPanel">
        <el-form-item label="雨速度">
            <el-col>
                <el-switch v-model="value"
                           :span="6"
                           active-text="Open"
                           inactive-text="Close" />
                <el-switch v-model="value"
                           active-text="Open"
                           inactive-text="Close" />
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

const panelStore = panelStatusStore();

const value = ref(true)

const onSubmit = () => {

}

const cancelmit = () => {
    panelStore.isOpenSetPanel = false;
}

</script>
  