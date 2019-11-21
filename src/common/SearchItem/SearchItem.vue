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
import { Base } from '@/service';

export default {
  name: "SearchItem",
  components: {
    'el-autocomplete': Autocomplete,
    'el-button': Button
  },
  props: ['value', 'size', 'provinceCode'],
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
      this.baseItemList({query: queryString}, items => cb(items));
    },
    handleSelect(item) {
      // console.log('item', item);
      this.$emit('onSelectItem', item)
    },
    clear() {
      this.inputValue = '';
    },
    async baseItemList({query, id}, callback) {
      let res = await Base.baseItemList({
        condition: query,
        province_code: this.$props.provinceCode || '',
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
