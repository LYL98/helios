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
  >
    <el-option v-if="showAll" key label="全部" value></el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="`id：${item.id}；商品：${item.item.title}`"
      :value="item.id"
      :disabled="item.disabled"
    ></el-option>
  </el-select>
</template>

<script>
import { Http, Config } from "@/util";
import selectMixin from "./select.mixin";

export default {
  name: "SelectInStock",
  mixins: [selectMixin],
  props: {
    placeholder: { type: String, default: "请选择入库单" }
  },
  methods: {
    //获取数据
    async getData() {
      let res = await Http.get(Config.api.supplierInStockList, {
        condition: this.query.condition,
        available: 1
      });
      if (res.code === 0) {
        this.$data.dataItem = res.data;
      } else {
        this.$messageBox.alert(res.message, "提示");
      }
    }
  }
};
</script>

<style scoped>
</style>
