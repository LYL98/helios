<template>
  <div>
    <el-row :gutter="32">
      <el-col :xl="7" :lg="7" :span="7">
        <my-query-item label="时间">
          <el-date-picker
            size="small"
            v-model="query.picker_value"
            type="daterange"
            align="left"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="fixDateOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changePicker"
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="10" :lg="10" :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            v-model="query.condition"
            placeholder="调拨计划单号"
            clearable
            @search="changeQuery"
            @reset="resetQuery"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  Row,
  Col,
  Table,
  TableColumn,
  DatePicker
} from "element-ui";
import { FormArea, QuerySearchInput, QueryItem } from "@/common";
import tableMixin from "@/share/mixin/table.mixin";
import { Http, Config, Constant, DataHandle } from "@/util";
export default {
  name: "sup-stock-record",
  mixins: [tableMixin],
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-row": Row,
    "el-col": Col,
    "el-form-area": FormArea,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-date-picker": DatePicker,
    "my-query-item": QueryItem,
    "query-search-input": QuerySearchInput
  },
  props: {
    items: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      query: {
        picker_value: null
      }
    };
  },
  created() {
    this.fixDateOptions = Constant.FIX_DATE_RANGE;
  },
  methods: {
    initQuery() {},
    resetQuery() {},
    changeQuery() {},
    changePicker(value) {
      if (value && value.length === 2) {
        this.query.begin_date = value[0];
        this.query.end_date = value[1];
      } else {
        this.query.begin_date = "";
        this.query.end_date = "";
      }
      this.$data.query = this.query;
      // this.distributePlanQuery();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "@/share/scss/table.scss";
  .mt-16 {
    margin-top: 16px;
  }
  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>
<style lang="scss">
  @import "@/share/scss/table.global.scss";
</style>
