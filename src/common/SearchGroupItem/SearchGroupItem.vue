<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="querySearchAsync"
    placeholder="搜索商品名称、编号"
    @select="handleSelect"
    clearable
    @clear="clear"
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
  props: {
    value: { type: Number | String, default: '' },
    provinceCode: { type: Number | String, default: '' },
    size: { type: String, default: '' },
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  computed: {
    inputValue: {
      get() {
        return this.$props.value;
      },
      set(v) {
        this.$emit('ev', v);
      }
    }
  },
  data() {
    return {
      itemList: []
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      this.groupItemList({query: queryString}, items => cb(items));
    },
    handleSelect(item) {
      // console.log('item', item);
      this.$emit('onSelectItem', item);
    },
    //清除
    clear(v) {
      this.$emit('onSelectItem', {});
    },
    async groupItemList({query, id}, callback) {
      let res = await Http.get(Config.api.groupItemList, {
        province_code: this.provinceCode || '',
        condition: query || ''
      });
      if (res.code === 0) {
        let rd = res.data;
        rd.map(item => item.value = `${item.code} ${item.title}`);
        callback(rd)
      }

    }
  }
}
</script>

<style scoped>

</style>
