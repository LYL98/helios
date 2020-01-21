<template>
  <detail-layout :title="layoutTitle" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">{{scope.row.item.code}}/{{scope.row.item.title}}</template>
        </el-table-column>
        <el-table-column label="应出库">
          <template slot-scope="scope">{{scope.row.count_real}}件</template>
        </el-table-column>
        <el-table-column label="实际出库">
          <template slot-scope="scope">{{scope.row.allocate_num}}件</template>
        </el-table-column>
        <el-table-column label="缺货">
          <template slot-scope="scope" v-if="scope.row.count_real - scope.row.allocate_num <= 0">-</template>
          <template slot-scope="scope" v-else>{{scope.row.count_real - scope.row.allocate_num}}件</template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateDepart",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {}
      return {
        layoutTitle: '',
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: []
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.layoutTitle = data.layoutTitle;
        this.$data.detail = data;
        this.supDeliveryItemDetail(data);
      },
      //获取明细列表
      async supDeliveryItemDetail(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryItemDetail, {
          delivery_date: data.delivery_date,
          store_id: data.store_id,
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
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
