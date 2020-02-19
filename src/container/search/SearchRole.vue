<template>
  <el-autocomplete
    v-model="selectId"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入角色名称"
    @select="handleSelect"
    clearable
    :size="size"
    style="width: 100%"
    @clear="clearSelect"
  ></el-autocomplete>
</template>

<script>
import { Autocomplete, Button } from 'element-ui'
import { Http, Config } from '@/util';

export default {
  name: "SearchRole",
  components: {
    'el-autocomplete': Autocomplete,
    'el-button': Button
  },
  props: {
    value: { type: Number | String, default: '' },
    size: { type: String, default: '' },
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      selectId: this.value || '',
      itemList: []
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      let that = this;
      let itemList = that.itemList;
      if (itemList.length === 0) {
        that.roleList(items => {
          // console.log(items)
          cb(items)
        })
      } else {
        let results = queryString ? itemList.filter(this.createStateFilter(queryString)) : itemList;
        cb(results);
      }
    },
    handleSelect(item) {
      this.$emit('ev', item.id)
      this.$emit('change', item)
    },
    clearSelect() {
      this.$emit('ev', '')
      this.$emit('change', { id: '' })
    },
    createStateFilter(queryString) {
      let regex = new RegExp(queryString);
      return (state) => {
        // return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        return regex.test(state.value);
      };
    },
    async roleList(callback) {
      let res = await Http.get(Config.api.roleList, {});
      if (res.code === 0) {
        res.data.map(item => item.value = item.title);
        this.itemList = res.data;
        callback(this.itemList);
      }
    },
  },
  watch: {
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.selectId = a || '';
      }
    }
  }
}
</script>

<style scoped>

</style>
