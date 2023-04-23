import { defineStore } from 'pinia'

const usecesiumStore = defineStore('cesiumstore', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => {
        return {
            viewer: Object.create(null),
        }
    },
})

export default usecesiumStore