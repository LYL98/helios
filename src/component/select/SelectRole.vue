<template>
  <el-select
    v-model="selectId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width:100%;"
    @change="handleChange"
    :filter-method="searchMethod"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.title"
      :value="item.id"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>

<script>
import { Http, Config } from '@/util';
import selectMixin from './select.mixin';

export default {
  name: "SelectRole",
  mixins: [selectMixin],
  props: {
    placeholder: { type: String, default: '请选择角色' }
  },
  data() {
    return {
      query: {
        need_num: 100
      }
    }
  },
  methods: {
    //获取数据
    async getData(){
      let res = await Http.get(Config.api.roleList, this.query);
      if(res.code === 0){
        this.$data.dataItem = res.data;
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
  },
}
</script>

<style scoped>

</style>
