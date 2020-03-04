<template>
  <detail-layout :title="returnTitle()" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-table :data="dataItem" :row-class-name="highlightRowClassName">
      <el-table-column label="门店名称">
        <template slot-scope="scope">{{scope.row.store.title}}</template>
      </el-table-column>
      <el-table-column label="分配/应出" width="120">
        <template slot-scope="scope">
          <span :style="returnStyle(scope.row)">{{scope.row.num}}</span>
          <span>&nbsp;/&nbsp;</span>
          <span>{{scope.row.count_real}}</span>
        </template>
      </el-table-column>
    </el-table>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateSortCity",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {}
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: []
      }
    },
    methods: {
      //标题
      returnTitle(){
        let { detail } = this;
        let t = (detail.city_id || '') + '/';
        t += (detail.city_title || '') + '-门店详情';
        return t;
      },
      //返回提醒样式
      returnStyle(data){
        if(data.num !== data.count_real){
          return 'color: #ff5252;font-weight: bold;';
        }
        return '';
      },
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = [];
        this.$data.detail = data;
        this.supAllocateCityDetail();
      },
      //获取明细列表
      async supAllocateCityDetail(){
        let { detail } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supAllocateCityDetail, {
          item_id: detail.item_id,
          city_id: detail.city_id,
          delivery_date: detail.delivery_date
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
