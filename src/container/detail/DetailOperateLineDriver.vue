<template>
  <detail-layout title="待分配司机" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 16px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="姓名">
          <template slot-scope="scope">{{scope.row.deliver.realname}}</template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">{{scope.row.deliver.phone}}</template>
        </el-table-column>
        <el-table-column label="签到线路">
          <template slot-scope="scope">{{scope.row.line.title}}</template>
        </el-table-column>
        <el-table-column label="签到时间">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateLineDriver",
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
      showDetail(){
        this.$data.dataItem = [];
        this.operateLineDriverList();
      },
      //获取待分配司机列表
      async operateLineDriverList(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.operateLineDriverList, {});
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
