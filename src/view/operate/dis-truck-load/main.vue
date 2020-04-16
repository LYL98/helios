<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-storehouse v-model="query.src_storehouse_id"/>
        </div>
        <div class="right">
          <global-delivery-date v-model="query.delivery_date"/>
        </div>
      </div>
    </template>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="司机">
            <el-select-driver
              size="small"
              filterable
              :createdGetData="false"
              v-model="query.driver_id"
              @change="changeDriver"
              v-if="query.src_storehouse_id && query.delivery_date"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              v-model="query.condition"
              placeholder="商品编号/名称"
              clearable
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="container-table">
      <div @mousemove="handleTableMouseMove" class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="index" width="80" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column label="商品编号/名称" prop="creator_id">
            <template slot-scope="scope">{{scope.row.item_code}} / {{scope.row.item_title}}</template>
          </el-table-column>
          <el-table-column label="装车 / 调拨 / 应出" align="center">
            <template slot-scope="scope">
              <div :class="`td-item add-dot2 ${returnClass(scope.row)}`">
                <span class="sort-num">{{scope.row.sort_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="allocate-num">{{scope.row.plan_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="count-real">{{scope.row.allocate_num || '-'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                  {
                    title: '修改',
                    isDisplay: scope.row.status === 'init' && ($auth.isAdmin || $auth.itemSupDistributePlanModify),
                    command: () => handleModifyItem(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-bottom" v-if="list.items.length > 0">
        <div :class="`left ${returnTotalClass(list)}`">
          <span>装车&nbsp;/&nbsp;调拨&nbsp;/&nbsp;应出，共计：</span>
          <span class="sort-num">{{list.sort_num || '-'}}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="allocate-num">{{list.plan_num || '-'}}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="count-real">{{list.allocate_num || '-'}}</span>
        </div>
        <div class="right">
          <el-button v-if="auth.isAdmin || auth.OperateTruckLoadAffirm"
            @click.native="handleShowForm('FormOperateTruckLoadAffirm', {
              delivery_date: query.delivery_date,
              line_id: query.line_id,
              ...list
            })" size="mini" type="primary" :disabled="list.sorted">{{list.sorted ? '已确认' : '发车前确认'}}</el-button>
        </div>
      </div>
    </div>

    <add-edit-layout
      :is-show="dialog.visible"
      :title="`${dialog.type === 'add' ? '新增' : '修改'}调拨计划`"
      :before-close="handleCancel"
    >
      
    </add-edit-layout>
  </sub-menu>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn, Dialog, DatePicker, Tag } from 'element-ui';
  import { SelectOption, QueryItem, QuerySearchInput, TableOperate } from '@/common';
  import { SelectDriver, GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import AddEditLayout from '@/share/layout/Layout';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'distribute-plan',
    mixins: [mainMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-date-picker': DatePicker,
      'add-edit-layout': AddEditLayout,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'global-storehouse': GlobalStorehouse,
      'query-search-input': QuerySearchInput,
      'el-select-driver': SelectDriver,
      'global-delivery-date': GlobalDeliveryDate
    },
    data() {
      return {
        distribulte_plan_status: Constant.DISTRIBUTE_PLAN_STATUS(), // 调拨计划列表状态
        distribulte_plan_status_type: Constant.DISTRIBUTE_PLAN_STATUS_TYPE,
        query: {
          src_storehouse_id: '',
          delivery_date: '',
          driver_id: 148,
          condition: ''
        },
        list: {
          items: []
        },
        // 编辑调拨计划弹层
        dialog: {
          visible: false,
          type: 'add',
          item: null
        },
        // 详情弹层
        detail: {
          visible: false,
          item: {}
        },
        audit: {
          visible: false,
          item: {},
        },
      }
    },
    created() {
      documentTitle('场地 - 调拨装车 - 装车');
      this.initQuery();
    },
    methods: {
      initQuery() {
        this.$data.query.condition = '';
      },

      // 初始化
      changeDriver() {
        this.changeQuery();
      },

      changeQuery() {
        this.supDistributeDriverDetail();
      },

      resetQuery() {
        this.initQuery();
        this.supDistributeDriverDetail();
      },

      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.$data.query = this.query;
        this.supDistributeDriverDetail();
      },

      async handleDetailItem(item) {
        let res = await Http.get(Config.api.itemSupDistributePlanDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.detail = {
            visible: true,
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleModifyItem(item) {

        let res = await Http.get(Config.api.itemSupDistributePlanDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.dialog = {
            visible: true,
            type: 'modify',
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleAddDistribute(item) {
        let res = await Http.get(Config.api.itemSupDistributePlanDetail, {id: item.id});
        if (res.code === 0) {
          this.$data.distribute = {
            visible: true,
            type: 'add',
            item: res.data,
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      handleSubmit() {
        this.handleCancel();
        this.supDistributeDriverDetail();
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化调拨计划编辑弹层
        this.$data.dialog = {
          visible: false,
          type: 'add',
          item: null,
        };
        // 初始化调拨单生成弹层
        this.$data.distribute = {
          visible: false,
          type: 'add',
          item: null,
        };
        // 初始化审核弹层
        this.$data.audit = {
          visible: false,
          item: {},
        };
      },

      handleAuditItem(item) {
        this.$data.audit = {
          visible: true,
          item: item
        };
      },

      handleCloseItem(id) {
        this.$messageBox.confirm('确认关闭该调拨计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.itemSupDistributePlanClose, {
            ids: [id]
          });
          if(res.code === 0){
            this.$message({ title: '提示', message: '调拨计划关闭成功', type: 'success'});
            this.supDistributeDriverDetail();
          }else{
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      async supDistributeDriverDetail() {
        this.$loading({isShow: true, isWhole: true});
        this.query.src_storehouse_id = '';
        let res = await Http.get(Config.api.supDistributeDriverDetail, this.query);
        this.$loading({isShow: false});
        if (res.code === 0){
          this.$data.list = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      //返回提醒样式
      returnTotalClass(data){
        let sn = Number(data.sort_num); //装车
        let an = Number(data.plan_num); //分配
        let cr = Number(data.allocate_num); //应出
        if(cr > an && an === sn){
          return 'allocate-num-warn';
        }
        if(cr > an && an > sn){
          return 'allocate-num-warn sort-num-warn';
        }
        if(cr === an && an > sn){
          return 'sort-num-warn';
        }
        return '';
      },
      //返回提醒样式
      returnClass(data){
        let sn = Number(data.sort_num); //装车
        let an = Number(data.plan_num); //分配
        let cr = Number(data.allocate_num); //应出
        if(cr > an && an === sn){
          return 'allocate-num-warn stockout-warn';
        }
        if(cr > an && an > sn){
          return 'allocate-num-warn sort-num-warn stockout-warn';
        }
        if(cr === an && an > sn){
          return 'sort-num-warn';
        }
        return '';
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .menu-left-query{
    width: 280px;
    display: flex;
    align-items: center;
    >.left{
      margin-right: 10px;
    }
  }
  //缺货
  .stockout-warn{
    position: relative;
    &::after{
      position: absolute;
      content: '缺';
      background: #ff5252;
      color: #fff;
      font-size: 12px;
      padding: 0 2px;
      border-radius: 3px;
      margin-left: 10px;
      height: 16px;
      line-height: 16px;
    }
  }
  //装车数量变动
  .sort-num-warn{
    >.sort-num{
      color: #ff5252;
      font-weight: bold;
    }
  }
  //分配数量变动
  .allocate-num-warn{
    >.allocate-num{
      color: #ff5252;
      font-weight: bold;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
