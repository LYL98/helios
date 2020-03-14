<template>
  <el-autocomplete
    popper-class="my-autocomplete"
    v-model="inputValue"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    @select="handleSelect">
    <template slot-scope="{ item }">
      <div class="name">{{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import { Autocomplete } from 'element-ui'

export default {
  name: 'Autocomplete',
  data () {
    return {
      restaurants: [],
      storageKey: this.recordsKey,
      inputValue: this.value,
      capacity: 20
    }
  },
  props: {
    recordsKey: String,
    value: String
  },
  watch: {
    inputValue: function (after, before) {
      // 把变化后的值发送到父组件
      this.$emit('input', after)
    }
  },
  computed: {

  },
  methods: {
    querySearch (queryString, cb) {
      let history = this.getLocalStorage()
      if (history && history.records) {
        this.restaurants = history.records
      }
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
    },
    getLocalStorage () {
      let { storageKey } = this
      if (!storageKey) {
        return
      }
      let resData = localStorage.getItem(storageKey)
      let data = {records: []}
      resData && (data = JSON.parse(resData))
      return data
    },
    record () {
      let { inputValue, storageKey, capacity } = this
      if (!storageKey || !inputValue || inputValue === '') {
        return
      }
      let history = this.getLocalStorage(storageKey)
      if (history && history.records) {
        if (history.records.length > capacity) {
          history.records.shift()
        }
        let hasRecord = false
        history.records.filter((item) => {
          if (item.value === inputValue) {
            hasRecord = true
          }
        })
        if (!hasRecord) {
          history.records.push({value: inputValue.toString()})
        }
      }
      localStorage.setItem(storageKey, JSON.stringify(history))
    }
  },
  mounted () {
  },
  components: {
    'el-autocomplete': Autocomplete
  }
}
</script>

<style lang="scss" scoped>
.my-autocomplete{
  li{
    line-height: normal;
    padding: 7px;
    .name{
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
