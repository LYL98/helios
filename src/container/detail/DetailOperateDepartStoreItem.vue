<template>
  <detail-layout title="123" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="detail.allocates" :row-class-name="highlightRowClassName">
        <el-table-column label="线路">
          <template slot-scope="scope">{{scope.row.line.title}}</template>
        </el-table-column>
        <el-table-column label="县域">
          <template slot-scope="scope">{{scope.row.city.title}}</template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">{{scope.row.num}}</template>
        </el-table-column>
        <el-table-column label="分拣员">
          <template slot-scope="scope">{{scope.row.sorter.realname}}</template>
        </el-table-column>
        <el-table-column label="分拣时间">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看门店',
                  isDisplay: auth.isAdmin || auth.OperateSortDetailCity,
                  command: () => handleShowDetail('DetailOperateSortCity', scope.row)
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
    name: "DetailOperateDepart",
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
        detail: this.copyJson(initDetail)
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
        this.supDeliveryItemDetail(data);
      },
      //获取明细列表
      async supDeliveryItemDetail(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryItemDetail, {
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
