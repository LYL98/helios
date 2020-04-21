<template>
  <detail-layout title="库存管理" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-row style="margin: 10px 20px;">
      <el-col :span="12">商品编号/名称：{{detail.item_code}}/{{detail.item_title}}</el-col>
      <el-col :span="4">总库存：{{detail.stock_num}}件</el-col>
    </el-row>
    <div style="margin: 0 20px;">
      <el-table :data="dataItem.items" width="100%">
        <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
        <el-table-column label="批次" prop="batch_code">
          <template slot-scope="scope">
            <span style="margin-right: 5px;">{{scope.row.batch_code}}</span>
            <span v-if="scope.row.out_type === 'dt_ac_edit'" class="is-mark">打货商品</span>
            <span v-if="scope.row.unqualified" class="is-mark">不合格商品</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="supplier_title" min-width="100"/>
        <el-table-column label="库存" min-width="60">
          <template slot-scope="scope">{{scope.row.num}}件</template>
        </el-table-column>
        <el-table-column label="仓库">
          <template slot-scope="scope">
            {{scope.row.storehouse.title}}/{{scope.row.warehouse.title}}<span v-if="scope.row.warehouse.ware_type !== 'tmp'">/{{scope.row.tray.code}}</span>
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
                isDisplay: auth.isAdmin || auth.WarehouseInventoryCheck,
                command: () => handleShowForm('FormWarehouseInventoryCheck', scope.row)
              },
              {
                title: scope.row.warehouse.ware_type === 'tmp' ? '上架' : '移库',
                isDisplay: auth.isAdmin || auth.WarehouseInventoryMoveOp,
                command: () => handleShowForm('FormWarehouseInventoryMove', scope.row)
              },
              {
                title: '变动',
                isDisplay: auth.isAdmin || auth.WarehouseInventoryVariation ,
                command: () => handleShowForm('FormWarehouseInventoryVariation', scope.row)
              },
              {
                title: '调拨',
                isDisplay: (auth.isAdmin || auth.WarehouseInventoryDistribute) && scope.row.warehouse.ware_type === 'tmp',
                command: () => handleShowForm('FormWarehouseInventoryDistribute', scope.row)
              },
              {
                title: '出库',
                isDisplay: auth.isAdmin || auth.WarehouseInventoryOutStorage,
                command: () => handleShowForm('FormWarehouseInventoryOutStorage', {...scope.row, plan_out_id: detail.plan_out_id, o_num: detail.o_num, o_num_out: detail.o_num_out})
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
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseInventory",
    mixins: [detailMixin],
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
        query.p_item_id = data.p_item.id;
        query.storehouse_id = data.storehouse_id;
        detail.item_title = data.p_item.title;
        detail.item_code = data.p_item.code;
        this.$data.query = query;
        if(data){
          this.$data.detail = this.copyJson(detail);
        }else{
          this.$data.detail = this.copyJson(this.initDetail);
        }
        this.wareTrayItemQuery();
      },
      //获取明细列表
      async wareTrayItemQuery(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.wareTrayItemQuery, this.query);
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
        this.wareTrayItemQuery();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.wareTrayItemQuery();
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
  .is-mark{
    color: #fff;
    background: #FFA349;
    font-size: 12px;
    display: inline-block;
    text-align: center;
    height: 18px;
    line-height: 18px;
    border-radius: 3px;
    position: relative;
    top: -2px;
    padding: 0 5px;
  }
  .link-item{
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      opacity: .7;
    }
  }
</style>
