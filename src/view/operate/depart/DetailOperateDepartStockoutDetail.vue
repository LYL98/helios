<template>
  <detail-layout :title="detail.item.code + '/' + detail.item.title" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="县域">
          <template slot-scope="scope">{{scope.row.city.id}}/{{scope.row.city.title}}</template>
        </el-table-column>
        <el-table-column label="门店">
          <template slot-scope="scope">{{scope.row.store.title}}</template>
        </el-table-column>
        <el-table-column label="应出库">
          <template slot-scope="scope">{{scope.row.count_real}}件</template>
        </el-table-column>
        <el-table-column label="实际出库">
          <template slot-scope="scope">{{returnUnit(scope.row.allocate_num, '件', '-')}}</template>
        </el-table-column>
        <el-table-column label="缺货">
          <template slot-scope="scope">
            <span v-if="scope.row.count_real - scope.row.allocate_num <= 0">-</span>
            <span v-else>{{scope.row.count_real - scope.row.allocate_num}}件</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateDepartStockout",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        item: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: []
      }
    },
    methods: {
      //显示(重写mixin)
      showDetail(data){
        this.$data.detail = data;
        this.supDeliveryLackHistoryStore(data);
      },
      //获取明细列表
      async supDeliveryLackHistoryStore(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryLackHistoryStore, {
          delivery_date: data.delivery_date,
          item_id: data.item_id
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
  @import "@/share/scss/detail.scss";
</style>
