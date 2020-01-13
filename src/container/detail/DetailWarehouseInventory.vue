<template>
  <detail-layout title="库存管理" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-row style="margin: 10px 20px;">
      <el-col :span="12">商品编号/名称：{{detail.p_item.title}}</el-col>
      <el-col :span="12">总库存：{{detail.stock_num}}件</el-col>
    </el-row>
    <div style="margin: 0 20px;">
      <el-table :data="dataItem.items" width="100%">
        <el-table-column type="index" :index="indexMethod" width="100" label="序号"></el-table-column>
        <el-table-column label="批次" prop="batch_code"/>
        <el-table-column label="供应商" prop="supplier_title" min-width="100"/>
        <el-table-column label="库存" min-width="60">
          <template slot-scope="scope">{{scope.row.num}}件</template>
        </el-table-column>
        <el-table-column label="仓库" prop="warehouse_title"/>
        <el-table-column label="过期时间" prop="due_date"/>
        <el-table-column label="操作" width="100">
          <template>
          <my-table-operate
            :list="[
              {
                title: '盘点',
                isDisplay: auth.isAdmin || auth.xxxx,
                command: () => xxxx()
              },
              {
                title: '变动',
                isDisplay: auth.isAdmin || auth.xxxx,
                command: () => xxxx()
              },
              {
                title: '调拨',
                isDisplay: auth.isAdmin || auth.xxxx,
                command: () => xxxx()
              },
              {
                title: '移库',
                isDisplay: auth.isAdmin || auth.xxxx,
                command: () => xxxx()
              },
              {
                title: '出库',
                isDisplay: auth.isAdmin || auth.xxxx,
                command: () => xxxx()
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
    components: {
      'my-table-operate': TableOperate
    },
    data() {
      let initDetail = {
        p_item: {}
      }
      return {
        query: {
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
        this.$data.query.page = 1;
        this.$data.query.p_item_id = data.p_item.id;
        if(data){
          this.$data.detail = this.copyJson(data);
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
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .amount{
    >.up{
      color: #F8931D;
      &::before{
        content: '+';
      }
    }
    >.down{
        color: #76C627;
        &::before{
          content: '-';
        }
    }
  }
</style>
