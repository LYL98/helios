<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-storehouse v-model="query.storehouse_id" @change="changeQuery" :show-nationwide="false" @initCallBack="initSelectStorehouse"/>
        </div>
        <div class="right">
          <global-delivery-date v-model="query.delivery_date" @change="changeQuery"/>
        </div>
      </div>
    </template>
    <div class="container-query">
      <el-row :gutter="32">
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
      <div class="table-top">
        <div class="left">
          <query-tabs v-model="query.print_status" @change="changeQuery" :tab-panes="{'全部': '', '未打印': 'no_have', '已打印': 'have'}"/>
        </div>
        <div class="right"></div>
      </div>
      <div @mousemove="handleTableMouseMove" class="table-conter">
        <!--全选-->
        <div class="all-select">
          <el-checkbox @change="changeAllSelect" :value="judgeAllSelect"></el-checkbox>
        </div>

        <el-table :data="list.items"
          row-class-name="stripe-row"
          class="list-table my-table-float"
          :highlight-current-row="true"
          row-key="code"
          :current-row-key="clickedRow['code']"
          default-expand-all
          :expand-row-keys="expandRowKeys"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="batches">
                <div v-for="(item, i) in props.row.batches" :key="item.id" class="batches-item">
                  <div class="select">
                    <el-checkbox :value="judgeSelect(item)" @change="(v)=>changeSelect(v, item)">批{{props.row.batches.length - i}}</el-checkbox>
                  </div>
                  <div>分配：{{returnUnit(item.allocated_num, '件', '-')}}</div>
                  <div>分配人：{{(item.creator && item.creator.realname) || '-'}}</div>
                  <div>分配时间：{{returnDateFormat(item.created, 'HH:mm:ss') || '-'}}</div>
                  <div>装车：{{returnUnit(item.sort_num, '件', '-')}}</div>
                  <div class="option">
                    <my-table-operate
                      @command-click="handleCommandClick(item)"
                      @command-visible="handleCommandVisible"
                      :list="[
                        {
                          title: '打印',
                          isDisplay: auth.isAdmin || auth.OperatePrintOrderPrint,
                          command: () => handlePrintSingle({delivery_date: query.delivery_date, ids: [item.id]})
                        },
                        {
                          title: '打印预览',
                          isDisplay: auth.isAdmin || auth.OperatePrintOrderPrint,
                          command: () => handlePrintPreview({delivery_date: query.delivery_date, ids: [item.id]})
                        },
                      ]"
                    />
                    <div class="print-sign" v-if="item.print_times">{{item.print_times}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" width="80" label="序号"></el-table-column>
          <el-table-column label="商品编号/名称" min-width="100">
            <div slot-scope="scope" class="my-td-item">
              <div class="td-item add-dot2">
                  {{scope.row.code}}/{{scope.row.title}}
                  <!--<span class="label-hint" v-if="scope.row.after">还会来货</span>-->
                </div>
            </div>
          </el-table-column>
          <el-table-column label="应出" min-width="100">
            <div slot-scope="scope" class="my-td-item">
              <div class="td-item add-dot2">{{returnUnit(scope.row.count_real, '件', '-')}}</div>
            </div>
          </el-table-column>
          <el-table-column label="分配" min-width="100">
            <div slot-scope="scope" class="my-td-item">
              <div class="td-item add-dot2">{{returnUnit(scope.row.allocated_num, '件', '-')}}</div>
            </div>
          </el-table-column>
          <el-table-column label="装车" min-width="100">
            <div slot-scope="scope" class="my-td-item">
              <div class="td-item add-dot2">{{returnUnit(scope.row.sort_num, '件', '-')}}</div>
            </div>
          </el-table-column>

          <el-table-column label="操作" width="96">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[{
                    title: '详情',
                    isDisplay: auth.isAdmin || auth.OperatePrintOrderDetail,
                    command: () => handleDetailItem(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-bottom" v-if="list.items.length > 0">
        <div class="left">
          <el-button @click="handlePrint({delivery_date: query.delivery_date, ids: returnListKeyList('id', multipleSelection)})" size="mini" type="primary"
                   :disabled="multipleSelection.length === 0 ? true : false" plain  v-if="auth.isAdmin || auth.OperatePrintOrderPrint">批量打印</el-button>
          <el-button @click="handlePrintPreview({delivery_date: query.delivery_date, ids: returnListKeyList('id', multipleSelection)})" size="mini" type="primary"
                   :disabled="multipleSelection.length === 0 ? true : false" plain  v-if="auth.isAdmin || auth.OperatePrintOrderPrint">打印预览</el-button>
        </div>
        <div class="right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50]"
            @size-change="changePageSize"
            @current-change="changePage"
            :total="list.num"
            :page-size="query.page_size"
            :current-page="query.page"
          />
        </div>
      </div>
    </div>
    <!--详情-->
    <detail-layout :is-show="detail.visible" title="详情" :before-close="handleCancel">
      <detail v-if="detail.visible" :item="detail.item"/>
    </detail-layout>
  </sub-menu>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn } from 'element-ui';
  import { SelectOption, QueryItem, QuerySearchInput, TableOperate } from '@/common';
  import { GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import { Http, Config, Constant, DataHandle, Lodop } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';
  import detailDom from './detail';
  import detailLayout from '@/share/layout/Layout';
  import queryTabs from '@/share/layout/QueryTabs';

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
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'global-storehouse': GlobalStorehouse,
      'global-delivery-date': GlobalDeliveryDate,
      'query-search-input': QuerySearchInput,
      'detail': detailDom,
      'detail-layout': detailLayout,
      'query-tabs': queryTabs
    },
    data() {
      return {
        query: {
          print_status: '',
          storehouse_id: '',
          delivery_date: '',
          condition: ''
        },
        list: {
          items: [],
          num: 0
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
      documentTitle('场地 - 配送装车 - 打单');
      this.initQuery();
    },
    computed: {
      //判断是否全选
      judgeAllSelect(){
        let { multipleSelection, list } = this;
        if(multipleSelection.length === 0) return false;
        let con = 0;
        list.items.forEach(item => {
          item.batches.forEach(o => {
            con++;
          });
        });
        if(multipleSelection.length >= con) return true;
        return false;
      },
      //默认展开行
      expandRowKeys(){
        let { list } = this;
        let keys = [];
        list.items.forEach(item => {
          if(item.batches.length > 0){
            keys.push(item.code);
          }
        });
        return keys;
      }
    },
    methods: {
      initQuery() {
        this.$data.query = {
          ...this.query,
          condition: '',
          print_status: ''
        }
      },

      //初始化
      initSelectStorehouse(data){
        if(this.query.delivery_date){
          this.changeQuery();
        }
      },

      changeQuery() {
        this.supItemQueryForPrint();
      },

      resetQuery() {
        this.initQuery();
        this.supItemQueryForPrint();
      },

      async supItemQueryForPrint() {
        let { query } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supItemQueryForPrint, query);
        this.$loading({isShow: false});
        if (res.code === 0){
          this.$data.list = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      changePage(page) {
        this.$data.query.page = page;
        this.supItemQueryForPrint();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.supItemQueryForPrint();
      },

      //判断单选是否已选择
      judgeSelect(data){
        let con = this.multipleSelection.filter(item => item.id === data.id);
        if(con.length > 0) return true;
        return false;
      },
      //全选
      changeAllSelect(v){
        let { multipleSelection, list } = this;
        multipleSelection = [];
        if(v){
          list.items.forEach(item => {
            item.batches.forEach(o => {
              multipleSelection.push(o);
            });
          });
        }
        this.$data.multipleSelection = this.copyJson(multipleSelection);
      },
      //单选
      changeSelect(v, data){
        let { multipleSelection } = this;
        if(v){
          multipleSelection.push(data);
        }else{
          for(let i = 0; i < multipleSelection.length; i++){
            if(multipleSelection[i].id === data.id){
              multipleSelection.remove(i);
              break;
            }
          }
        }
        this.$data.multipleSelection = this.copyJson(multipleSelection);
      },

      handlePrint({delivery_date, ids}) {
        this.PrintAndPreview({delivery_date, ids, type: 'print'});
      },

      async handlePrintSingle({delivery_date, ids}) {
        this.$loading({isWhole: true});
        let res = await Http.get(Config.api.supAllocateDetailPrint, {
          out_stock_ids: ids.join(),
          print_type: 'print'
        });
        this.$loading({isWhole: false});
        if(res.code === 0){
          Lodop.tempTruckSingle(res.data, delivery_date);
          this.supItemQueryForPrint();

        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },

      handlePrintPreview({delivery_date, ids}) {
        this.PrintAndPreview({delivery_date, ids, type: 'preview'});
      },

      async PrintAndPreview({delivery_date, ids, type}) {
        this.$loading({isWhole: true});
        let res = await Http.get(Config.api.supAllocateDetailPrint, {
          out_stock_ids: ids.join(),
          print_type: type
        });
        this.$loading({isWhole: false});
        if(res.code === 0){
          let temp = Lodop.tempTruckBatch(res.data, delivery_date);

          temp && type === 'print' && temp.PRINT();
          temp && type === 'preview' && temp.PREVIEW();

          this.supItemQueryForPrint();

        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },

      async handleDetailItem(item) {
        this.$loading({isShow: true, isWhole: true});
        let { query } = this;
        let res = await Http.get(Config.api.supAllocateDetail, {
          item_id: item.id,
          delivery_date: query.delivery_date
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$data.detail = {
            visible: true,
            item: {
              ...item,
              delivery_date: query.delivery_date,
              items: res.data
            }
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      // 共用弹层退出 函数
      handleCancel() {
        // 初始化详情弹层
        this.$data.detail = {
          visible: false,
          item: {
            items: []
          }
        };
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
  .all-select{
    position: absolute;
    top: 14px;
    left: 20px;
    z-index: 3;
  }
  .label-hint{
    border: 1px solid #ff5252;
    color: #ff5252;
    border-radius: 3px;
    padding: 0 2px;
    font-size: 12px;
  }
  .batches{
    margin-bottom: 20px;
  }
  .batches-item{
    display: flex;
    align-items: center;
    padding: 4px;
    &:hover{
      background: #FBFBFD;
    }
    >div{
      flex: 1;
    }
    >.select{
      flex: initial !important;
      padding-right: 20px;
    }
    >.option{
      flex: initial !important;
      position: relative;
      >.print-sign{
        font-size: 12px;
        background: #00ADE7;
        color: #fff;
        border-radius: 3px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        position: absolute;
        right: -15px;
        top: 1px;
      }
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
