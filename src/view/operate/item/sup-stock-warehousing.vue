<template>
  <el-form
    label-position="left"
    label-width="60px"
    :model="formData"
    ref="ruleForm"
  >
    <el-table
      :data="formData.records"
      :row-class-name="highlightRowClassName"
      highlight-current-row="highlight-current-row"
    >
      <el-table-column label="商品编号/名称" prop="p_item" min-width="300">
        <template slot-scope="scope">
          <span v-if="scope.row.p_item">
            {{ scope.row.p_item.code || "" }} / {{ scope.row.p_item.title }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="批次" prop="code" min-width="140">
        <template slot-scope="scope">
          {{ scope.row.batch_code }}
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="num" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.num > 0"> {{ scope.row.num }}件 </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_active"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-form-item
      class="mt-20"
      label="仓库"
      prop="warehouse_id"
      :rules="[{ required: true, message: '仓库不能为空' }]"
    >

      <el-select
        v-model="formData.warehouse_id"
        placeholder="请选择仓库"
        style="width: 300px"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item class="mt-30">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit"
      >确认
      </el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col, Button, Switch, Select, Option} from "element-ui";
  import {FormArea} from "@/common";
  import {Http, Config, DataHandle} from "@/util";
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: "distribute-plan-edit",
    mixins: [tableMixin],
    components: {
      "el-form": Form,
      "el-form-item": FormItem,
      "el-row": Row,
      "el-col": Col,
      'el-select': Select,
      'el-option': Option,
      "el-button": Button,
      "el-switch": Switch,
      "el-form-area": FormArea
    },
    props: {
      items: {type: Array, default: () => []},
      storehouse_id: {type: Number, default: ''},
    },
    data() {
      return {
        loading: false,
        formData: {
          warehouse_id: "",
          records: []
        },
        warehouseList: []
      };
    },
    created() {
      this.$data.formData.records = this.$props.items.map(item => {
        return {...item, is_active: true};
      });
      this.commonWarehouseList();
    },
    methods: {

      async commonWarehouseList() {
        let res = await Http.get(Config.api.baseWarehouseList, {
          storehouse_id: this.$props.storehouse_id
        });
        if (res.code === 0) {
          this.$data.warehouseList = res.data;
        } else {
          this.$messageBox.alert(res.message, '提示');
        }
      },

      onSubmit() {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;

          let formData = {...this.$data.formData};
          formData.records = formData.records.map(item => ({
            batch_code: item.batch_code,
            p_item_id: Number(item.p_item_id),
          }));
          this.$data.loading = true;
          let res = await Http.post(Config.api.operateItemSupStockInStock, formData);
          this.$data.loading = false;

          if (res.code === 0) {
            this.$message({message: '入库成功', type: 'success'});
            this.$emit('submit');
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }

        })
      },

      onCancel() {
        this.$emit("cancel");
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';

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
  @import '@/share/scss/table.global.scss';

</style>
