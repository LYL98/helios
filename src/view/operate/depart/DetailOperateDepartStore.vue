<template>
  <detail-layout :title="layoutTitle" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="门店名称">
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
        <el-table-column label="配送员">
          <template slot-scope="scope">{{scope.row.deliver.realname}}</template>
        </el-table-column>
        <el-table-column label="收货人签名">
          <template slot-scope="scope">{{scope.row.receive_img}}</template>
        </el-table-column>
        <el-table-column label="收货时间">
          <template slot-scope="scope">{{scope.row.receive_time}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.OperateDepartDetail,
                  command: () => handleShowDetail('DetailOperateDepartStoreItem', {
                    ...scope.row,
                    delivery_date: detail.delivery_date,
                    store_id: scope.row.store.id,
                    layoutTitle: layoutTitle + '/' + scope.row.store.title
                  })
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
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateDepartStore",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate
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
        this.supDeliveryStoreDetail(data);
      },
      //获取明细列表
      async supDeliveryStoreDetail(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryStoreDetail, {
          delivery_date: data.delivery_date,
          city_id: data.city.id,
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
