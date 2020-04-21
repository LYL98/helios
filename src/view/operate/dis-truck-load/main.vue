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
            <select-driver
              size="small"
              v-model="query.driver_id"
              @initCallBack="initDriver"
              @change="changeQuery"
              v-if="query.src_storehouse_id && query.delivery_date"
              :deliveryDate="query.delivery_date"
              :srcStorehouseId="query.src_storehouse_id"
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
                <span class="allocate-num">{{scope.row.allocate_num || '-'}}</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="plan-num">{{scope.row.plan_num || '-'}}</span>
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
                    title: '详情',
                    isDisplay: $auth.isAdmin || $auth.OperateDisTruckLoadDetail,
                    command: () => handleDetailItem(scope.row)
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
          <span class="allocate-num">{{list.allocate_num || '-'}}</span>
          <span>&nbsp;/&nbsp;</span>
          <span class="plan-num">{{list.plan_num || '-'}}</span>
        </div>
        <div class="right">
          <template v-if="auth.isAdmin || auth.OperateDisTruckLoadAffirm">
            <el-button v-if="list.p_distribute && list.p_distribute.status === 'deliveried'" size="mini" type="primary" disabled>已确认</el-button>
            <el-button v-else @click.native="handleAffirm" size="mini" type="primary">发车前确认</el-button>
          </template>
        </div>
      </div>
    </div>
    <!--发车确认-->
    <add-edit-layout :is-show="affirm.visible" title="发车前确认" :before-close="handleCancel">
      <affirm v-if="affirm.visible" :list="affirm.list" :loading="affirm.loading" @submit="submitAffirm" @cancel="handleCancel"/>
    </add-edit-layout>
    <!--详情-->
    <add-edit-layout :is-show="detail.visible" title="详情" :before-close="handleCancel">
      <detail v-if="detail.visible" :item="detail.item" @editNumSuccess="changeQuery"/>
    </add-edit-layout>
  </sub-menu>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn } from 'element-ui';
  import { SelectOption, QueryItem, QuerySearchInput, TableOperate } from '@/common';
  import { GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import selectDriver from './select-driver';
  import detailDom from './detail';
  import affirmDom from './affirm';
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
      'add-edit-layout': AddEditLayout,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'global-storehouse': GlobalStorehouse,
      'global-delivery-date': GlobalDeliveryDate,
      'query-search-input': QuerySearchInput,
      'select-driver': selectDriver,
      'detail': detailDom,
      'affirm': affirmDom
    },
    data() {
      return {
        query: {
          src_storehouse_id: '',
          delivery_date: '',
          driver_id: '',
          condition: ''
        },
        list: {
          items: [],
          p_distribute: {}, //status === deliveried 表示已经发车
          sorted: false, //是否已分配
        },
        // 发车确认
        affirm: {
          visible: false,
          list: [],
          loading: false
        },
        // 详情弹层
        detail: {
          visible: false,
          item: {
            items: []
          }
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

      //初始化
      initDriver(data){
        if(data.length > 0){
          let con = data.filter(item => item.id === this.query.driver_id);
          con.length > 0 ? this.$data.query.driver_id = con[0].id : this.$data.query.driver_id = data[0].id;
        }else{
          this.$data.query.driver_id = '';
        }
        this.changeQuery();
      },

      changeQuery() {
        this.supDistributeDriverDetail();
      },

      resetQuery() {
        this.initQuery();
        this.supDistributeDriverDetail();
      },

      async handleDetailItem(item) {
        this.$loading({isShow: true, isWhole: true});
        let { list } = this;
        let res = await Http.get(Config.api.supDistributeDriverItemDetail, {
          p_distribute_id: list.p_distribute.id,
          item_code: item.item_code
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$data.detail = {
            visible: true,
            item: {
              ...item,
              items: res.data,
              confirmed: list.p_distribute.status === 'deliveried' //是否已发车
            }
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      async handleAffirm() {
        let { list } = this;
        //已全部分拣
        if(list.sorted){
          this.$loading({isShow: true, isWhole: true});
          let res = await Http.get(Config.api.supDistributeDeliveryLackItem, {
            p_distribute_id: list.p_distribute.id
          });
          this.$loading({isShow: false});
          if(res.code === 0){
            let rd = res.data;
            if(rd.length > 0){
              this.$data.affirm = {
                visible: true,
                list: rd
              }
            }else{
              this.handleAffirmSend();
            }
          }else{
            this.$message({message: res.message, type: 'error'});
          }
        }else{
          this.$message({message: '该司机商品尚未全部分拣完成，暂不可发车确认', type: 'error'});
        }
      },

      //发车确认
      handleAffirmSend(){
        this.$messageBox.confirm(`商品正常，您确认发车？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitAffirm();
        }).catch(() => {
          //console.log('取消');
        });
      },

      async submitAffirm(){
        let { list, affirm } = this;
        this.$data.affirm = Object.assign({loading: true}, affirm);
        let res = await Http.post(Config.api.supDistributeDelivery, {
          p_distribute_id: list.p_distribute.id
        });
        this.$data.affirm = Object.assign({loading: false}, affirm);
        if (res.code === 0){
          this.$message({title: '提示', message: '已发车', type: 'success'});
          this.changeQuery();
          this.handleCancel();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化确认弹层
        this.$data.affirm = {
          visible: false,
          list: [],
          loading: false
        };
        // 初始化详情弹层
        this.$data.detail = {
          visible: false,
          item: {
            items: []
          }
        };
      },

      async supDistributeDriverDetail() {
        let { query } = this;
        if(!query.driver_id){
          this.$data.list = {
            items: [],
            p_distribute: {}, //status === deliveried 表示已经发车
            sorted: false, //是否已分配
          }
          return;
        }
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeDriverDetail, query);
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
        let an = Number(data.allocate_num); //调拨
        let pn = Number(data.plan_num); //应出
        if(pn > an && an === sn){
          return 'allocate-num-warn';
        }
        if(pn > an && an > sn){
          return 'allocate-num-warn sort-num-warn';
        }
        if(pn === an && an > sn){
          return 'sort-num-warn';
        }
        return '';
      },
      //返回提醒样式
      returnClass(data){
        let sn = Number(data.sort_num); //装车
        let an = Number(data.allocate_num); //调拨
        let pn = Number(data.plan_num); //应出
        if(pn > an && an === sn){
          return 'allocate-num-warn stockout-warn';
        }
        if(pn > an && an > sn){
          return 'allocate-num-warn sort-num-warn stockout-warn';
        }
        if(pn === an && an > sn){
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
