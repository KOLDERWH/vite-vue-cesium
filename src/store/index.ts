import { defineStore } from 'pinia'

const panelStatusStore = defineStore('panelstore', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => {
        return {
            isOpenRanPanel: false,
            isOpenSetPanel: false,
        }
    },
})

export default panelStatusStore