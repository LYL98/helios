<template>
  <detail-layout :title="layoutTitle" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <el-row>
        <h6 class="subtitle">线路信息</h6>
        <el-col :span="12">
          <el-form-item label="应出库">{{detail.count_real}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际出库">{{returnUnit(detail.allocate_num, '件', '-')}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认人">{{returnUnit(detail.assign_confirmer.realname, '', '-')}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认时间">{{returnUnit(detail.assign_confirm_time, '', '-')}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机">{{returnUnit(detail.deliver.realname, '', '-')}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机发车时间">{{returnUnit(detail.delivery_time, '', '-')}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h6 class="subtitle">县域信息</h6>
    <div style="padding: 0 30px;">
      <el-table :data="detail.cities" :row-class-name="highlightRowClassName">
        <el-table-column label="县域">
          <template slot-scope="scope">{{scope.row.city.title}}</template>
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
        <el-table-column label="接驳人">
          <template slot-scope="scope">{{scope.row.hand_over.realname}}</template>
        </el-table-column>
        <el-table-column label="接驳时间">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看门店',
                  isDisplay: auth.isAdmin || auth.OperateDepartDetailStore,
                  command: () => handleShowDetail('DetailOperateDepartStore', {
                    ...scope.row,
                    delivery_date: detail.delivery_date,
                    layoutTitle: layoutTitle + '/' + scope.row.city.title
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
        assign_confirmer: {},
        cities: [],
        deliver: {},
        creator: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        layoutTitle: ''
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.layoutTitle = `${data.line_code}/${data.line.title}`;
        this.supDeliveryCityDetail(data);
      },
      //获取明细列表
      async supDeliveryCityDetail(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryCityDetail, {
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
