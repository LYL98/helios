<template>
  <detail-layout title="分配详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <div class="f-r" style="position: relative; right: -84px;">
        <el-tag size="small" :type="sortStatusType[detail.sort_status]" disable-transitions>{{sortStatus[detail.sort_status]}}</el-tag>
      </div>
      <el-row>
        <h6 class="subtitle">商品信息</h6>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配方式">{{allotOptTypes[detail.opt_type]}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入场数">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入场时间">{{detail.created}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配人">{{detail.creator && detail.creator.realname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h6 class="subtitle">线路信息</h6>
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
    <div class="bottom-btn">
      <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
      <el-button size="medium" type="primary" @click.native="handleShowAddEdit('AddEditOperateSort', detail, 'edit')">修改分配方式</el-button>
    </div>
  </detail-layout>
</template>

<script>
  import { TableOperate } from '@/common';
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateSort",
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
        sortStatus: Constant.SORT_STATUS(),
        sortStatusType: Constant.SORT_STATUS_TYPE,
        allotOptTypes: Constant.ALLOT_OPT_TYPES(),
        initDetail: initDetail,
        detail: this.copyJson(initDetail)
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.supAllocateDetail(data.id);
      },
      //获取明细列表
      async supAllocateDetail(id){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supAllocateDetail, { out_stock_id: id }); // id:6测试
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
