<template>
  <el-autocomplete
    v-model="inputValue"
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
  props: ['value', 'size'],
  data() {
    return {
      itemList: [],
      inputValue: this.value
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
      this.$emit('onSelectRole', item)
    },
    clearSelect() {
      this.$emit('onSelectRole', { id: '' })
    },
    createStateFilter(queryString) {
      let regex = new RegExp(queryString);
      return (state) => {
        // return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        return regex.test(state.value);
      };
    },
    clear() {
      this.inputValue = '';
    },
    async roleList(callback) {
      let res = await Http.get(Config.api.roleList, {});
      if (res.code === 0) {
        res.data.map(item => item.value = item.title);
        this.itemList = res.data;
        callback(this.itemList);
      }
    },
  }
}
</script>

<style scoped>

</style>
