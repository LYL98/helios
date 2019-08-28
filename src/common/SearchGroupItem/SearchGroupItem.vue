<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="querySearchAsync"
    placeholder="搜索商品名称、编号"
    @select="handleSelect"
    clearable
    :size="size"
    style="width: 360px"
  ></el-autocomplete>
</template>

<script>
import { Autocomplete } from 'element-ui';
import { Config, Http } from '@/util';

export default {
  name: "SearchGroupItem",
  components: {
    'el-autocomplete': Autocomplete
  },
  props: ['value', 'size'],
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
      let res = await Http.get(Config.api.baseItemList, {
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
