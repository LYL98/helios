<template>
  <detail-layout :title="fromPage === 'receiving' ? '出库' : '库存管理'" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-row style="margin: 10px 20px;">
      <el-col :span="12">商品编号/名称：{{detail.item_code}}/{{detail.item_title}}</el-col>
      <el-col :span="12">总库存：{{detail.stock_num}}件</el-col>
    </el-row>
    <div style="margin: 0 20px;">
      <el-table :data="dataItem.items" width="100%">
        <el-table-column type="index" :index="indexMethod" width="100" label="序号"></el-table-column>
        <el-table-column label="批次" prop="batch_code">
          <template slot-scope="scope">
            <span v-if="auth.isAdmin || auth.WarehouseInventoryDetailBuyDetail" class="link-item"
              @click="handleShowBuyDetail(scope.row)">{{scope.row.batch_code}}</span>
            <span v-else>{{scope.row.batch_code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="supplier_title" min-width="100"/>
        <el-table-column label="库存" min-width="60">
          <template slot-scope="scope">{{scope.row.num}}件</template>
        </el-table-column>
        <el-table-column label="仓库">
          <template slot-scope="scope">
            {{scope.row.storehouse.title}}/{{scope.row.warehouse.title}}/{{scope.row.tray.code}}
          </template>
        </el-table-column>
        <el-table-column label="商品过期时间" prop="due_date"/>
        <el-table-column label="库存过期时间" prop="stock_due_date"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
          <my-table-operate
            :list="[
              {
                title: '盘点',
                isDisplay: (auth.isAdmin || auth.WarehouseInventoryCheck) && fromPage !== 'receiving',
                command: () => handleShowForm('FormWarehouseInventoryCheck', scope.row)
              },
              {
                title: '变动',
                isDisplay: (auth.isAdmin || auth.WarehouseInventoryVariation) && fromPage !== 'receiving',
                command: () => handleShowForm('FormWarehouseInventoryVariation', scope.row)
              },
              {
                title: '调拨',
                isDisplay: (auth.isAdmin || auth.WarehouseInventoryDistribute) && fromPage !== 'receiving' && scope.row.warehouse.ware_type === 'tmp',
                command: () => handleShowForm('FormWarehouseInventoryDistribute', scope.row)
              },
              {
                title: '移库',
                isDisplay: (auth.isAdmin || auth.WarehouseInventoryMoveOp) && fromPage !== 'receiving',
                command: () => handleShowForm('FormWarehouseInventoryMove', scope.row)
              },
              {
                title: '出库',
                isDisplay: auth.isAdmin || (auth.OperateReceivingOutStorage && fromPage === 'receiving') || (auth.WarehouseInventoryOutStorage && fromPage === 'inventory'),
                command: () => handleShowForm('FormWarehouseInventoryOutStorage', {...scope.row, plan_out_id: detail.plan_out_id})
              }
            ]"
          />
        </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-div" v-if="dataItem.num > 0" style="margin: 20px;">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
    </div>
  </detail-layout>
</template>

<script>
  import { TableOperate } from '@/common';
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseInventory",
    mixins: [detailMixin],
    props: {
      fromPage: { type: String, default: 'inventory' }, //receiving 收货、inventory 库存
    },
    components: {
      'my-table-operate': TableOperate
    },
    data() {
      let initDetail = {}
      return {
        query: {
          storehouse_id: '',
          p_item_id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: {
          items: [],
          num: 0
        }
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = {
          items: [],
          num: 0
        };
        let { query, detail } = this;
        query.page = 1;
        //如果来自 场地 - 收货
        if(this.fromPage === 'receiving'){
          query.sub_item_id = data.item_id;
          detail.item_title = data.item_title;
          detail.item_code = data.item_code;
          detail.plan_out_id = data.id; //根据出库计划出库的时候，传递这个参数
        }else{
          query.p_item_id = data.p_item.id;
          query.storehouse_id = data.storehouse_id;
          detail.item_title = data.p_item.title;
          detail.item_code = data.p_item.code;
          detail.plan_out_id = ''; //根据出库计划出库的时候，传递这个参数
        }
        this.$data.query = query;
        if(data){
          this.$data.detail = this.copyJson(detail);
        }else{
          this.$data.detail = this.copyJson(this.initDetail);
        }
        this.wareTrayItemQeruy();
      },
      //获取明细列表
      async wareTrayItemQeruy(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.wareTrayItemQeruy, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          let rd = res.data;
          this.$data.dataItem = rd;
          this.$data.detail.stock_num = rd.stock_num;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        this.$data.query.page_size = pageSize;
        this.$data.query.page = 1;
        this.wareTrayItemQeruy();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.wareTrayItemQeruy();
      },

      //显示详情采购
      handleShowBuyDetail(data){
        if(data.purchase_order_type === 'global_pur'){
          this.handleShowAddEdit('AddEditSupplierGPurchase', {
            id: data.purchase_order_id
          }, 'detail');
        }else{
          this.handleShowAddEdit('AddEditSupplierLocalPurchase', {
            id: data.purchase_order_id
          }, 'detail');
        }
        
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .link-item{
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      opacity: .7;
    }
  }
</style>
