<template>
  <div>
    <el-row style="padding: 20px 30px;">
      <el-col :span="12">商品编号/名称：{{item.item_code}}/{{item.item_title}}</el-col>
      <el-col :span="4">应出：{{item.plan_num ? item.plan_num + '件' : '-'}}</el-col>
      <el-col :span="4">调拨：{{item.allocate_num ? item.allocate_num + '件' : '-'}}</el-col>
      <el-col :span="4">装车：{{item.sort_num ? item.sort_num + '件' : '-'}}</el-col>
    </el-row>
    <div style="padding: 0 30px;">
      <el-table :data="item.items" :row-class-name="highlightRowClassName">
        <el-table-column label="批次" min-width="100">
          <template slot-scope="scope">{{scope.row.batch_code}}</template>
        </el-table-column>
        <el-table-column label="调拨数量" min-width="80">
          <template slot-scope="scope">{{scope.row.num ? scope.row.num + '件' : '-'}}</template>
        </el-table-column>
        <el-table-column label="调拨人" min-width="100">
          <template slot-scope="scope">{{scope.row.creator && scope.row.creator.realname}}</template>
        </el-table-column>
        <el-table-column label="调拨时间" min-width="100">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '打货',
                  isDisplay: !item.confirmed && ($auth.isAdmin || $auth.OperateDisTruckLoadEditNum),
                  command: () => handleShowEditNum(scope.row, scope.$index)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="打货" :visible.sync="editNum.visible" append-to-body :before-close="handleCancelEditNum" width="520px">
      <el-form label-position="right" label-width="110px" :model="editNum.item" ref="ruleForm" style="width: 440px;">
        <el-form-item label="调拨数量">
          <input-number size="medium" disabled :value="editNum.item.origin_num" unit="件"/>
        </el-form-item>
        <el-form-item
          label="打货数量"
          prop="opt_num"
          :rules="[
            { required: true, message: '请输入打货数量', trigger: 'change' },
            { type: 'number', max: editNum.item.origin_num, message: '打货数量不能大于调拨数量', trigger: 'change' }
          ]"
        >
          <input-number size="medium" v-model="editNum.item.opt_num" unit="件"/>
        </el-form-item>
        <el-form-item label="新调拨数量">
          <input-number size="medium" disabled :value="editNum.item.origin_num - editNum.item.opt_num" unit="件"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.native="handleCancelEditNum">取 消</el-button>
        <el-button type="primary" @click.native="handleSubmitEditNum" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Form, FormItem, Row, Col, Table, TableColumn, Dialog, Button } from "element-ui";
  import { InputNumber, SelectOption } from '@/common';
  import { Http, Config } from '@/util';

  export default {
    name: "detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-table': Table,
      'el-dialog': Dialog,
      'el-table-column': TableColumn,
      'el-button': Button,
      'my-table-operate': TableOperate,
      'input-number': InputNumber
    },
    props: {
      item: { type: Object, default: { items: [], confirmed: false } }, //confirmed 是否已发车
    },
    data() {
      return {
        loading: false,
        editNum: {
          visible: false,
          item: {},
          index: 0
        },
      }
    },
    methods: {
      /**
     * 斑马线的背景颜色样式
     */
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },

      handleShowEditNum(item, index){
        this.$data.editNum = {
          visible: true,
          item: {
            detail_id: item.id,
            origin_num: item.num
          },
          index: index
        }
      },

      handleCancelEditNum(){
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.$data.editNum = {
          visible: false,
          item: {},
          index: 0
        }
      },

      handleSubmitEditNum(){
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;
          
          this.$data.loading = true;
          let { editNum } = this;
          let num = editNum.item.origin_num - editNum.item.opt_num;
          let res = await Http.post(Config.api.supDistributeAllocatedEditNum, {
            detail_id: editNum.item.detail_id,
            num: num
          });
          this.$data.loading = false;
          if (res.code === 0) {
            this.$message({message: '打货成功', type: 'success'});
            this.item.items[editNum.index].num = num;
            this.handleCancelEditNum();
            this.$emit('editNumSuccess');
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }

        });
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
