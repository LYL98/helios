<template>
  <detail-layout title="123" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="detail.allocates" :row-class-name="highlightRowClassName">
        <el-table-column label="门店名称">
          <template slot-scope="scope">{{scope.row.store.title}}</template>
        </el-table-column>
        <el-table-column label="应出库">
          <template slot-scope="scope">{{scope.row.count_real}}件</template>
        </el-table-column>
        <el-table-column label="实际出库">
          <template slot-scope="scope">{{scope.row.allocate_num}}件</template>
        </el-table-column>
        <el-table-column label="缺货">
          <template slot-scope="scope">{{scope.row.count_real - scope.row.allocate_num}}件</template>
        </el-table-column>
        <el-table-column label="配送员">
          <template slot-scope="scope">{{scope.row.sorter.realname}}</template>
        </el-table-column>
        <el-table-column label="收货人姓名">
          <template slot-scope="scope">{{scope.row.sorter.realname}}</template>
        </el-table-column>
        <el-table-column label="收货时间">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.OperateDepartDetailStoreItem,
                  command: () => handleShowDetail('DetailOperateDepartStoreItem', scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import { TableOperate } from '@/common';
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateDepartStore",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate
    },
    data() {
      let initDetail = {
        allocates: [],
        creator: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: []
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        if(data){
          this.$data.detail = this.copyJson(data);
        }else{
          this.$data.detail = this.copyJson(this.initDetail);
        }
        this.supDeliveryStoreDetail(data);
      },
      //获取明细列表
      async supDeliveryStoreDetail(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryStoreDetail, {
          delivery_date: data.delivery_date,
          line_code: data.line_code,
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
