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
  name: "SearchItem",
  components: {
    'el-autocomplete': Autocomplete,
    'el-button': Button
  },
  props: ['value', 'size', 'provinceCode'],
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      itemList: []
    }
  },
  computed: {
    inputValue: {
      get() {
        return this.$props.value;
      },
      set(v) {
        this.$emit('change', v);
      }
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
