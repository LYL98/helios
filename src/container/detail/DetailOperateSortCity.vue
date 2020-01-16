<template>
  <detail-layout :title="returnTitle()" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-table :data="dataItem" :row-class-name="highlightRowClassName">
      <el-table-column label="门店名称">
        <template slot-scope="scope">{{scope.row.store.title}}</template>
      </el-table-column>
      <el-table-column label="数量" width="120">
        <template slot-scope="scope">{{scope.row.num}}件</template>
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
      let initDetail = {
        line: {},
        city: {}
      }
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
        let t = (detail.line.title || '') + '/';
        t += (detail.city.title || '') + '/';
        t += (detail.store_title || '') + '分配信息';
        return t;
      },
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = [];
        this.$data.detail = data;
        this.supAllocateCityDetail(data);
      },
      //获取明细列表
      async supAllocateCityDetail(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supAllocateCityDetail, {
          parent_allocate_id: data.parent_id,
          city_code: data.city_code
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
