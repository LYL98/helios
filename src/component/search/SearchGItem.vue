<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入商品名称或商品编号"
    @select="handleSelect"
    clearable
    :size="size"
    style="width: 360px"
  ></el-autocomplete>
</template>

<script>
import { Autocomplete, Button } from 'element-ui'
import { Http, Config } from '@/util';

export default {
  name: "SearchGItem",
  components: {
    'el-autocomplete': Autocomplete
  },
  props: {
    supplierId: { type: Number | String, default: '' },
    value: { type: Number | String, default: '' },
    size: { type: String, default: 'medium' }
  },
  // watch: {
  //   inputValue: function (after, before) {
  //     // 把变化后的值发送到父组件
  //     this.$emit('input', after)
  //   }
  // },
  data() {
    return {
      itemList: [],
      inputValue: this.value
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      this.baseGItemList({query: queryString}, items => cb(items));
    },
    handleSelect(item) {
      this.$emit('onSelectItem', item)
    },
    clear() {
      this.inputValue = '';
    },
    async baseGItemList({query, id}, callback) {
      let res = await Http.get(Config.api.baseGItemList, {
        supplier_id: this.supplierId,
        condition: query
      });
      if (res.code === 0) {
        let rd = res.data;
        rd.map(item => item.value = item.title);
        callback(rd)
      }

    }
  }
}
</script>

<style scoped>

</style>
