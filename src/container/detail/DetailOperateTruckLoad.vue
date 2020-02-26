<template>
  <detail-layout :title="`${detail.item_code}/${detail.item_title} 详情`" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="门店名称">
          <template slot-scope="scope">{{scope.row.store.city_code}}/{{scope.row.store.title}}</template>
        </el-table-column>
        <el-table-column label="分配/应出">
          <template slot-scope="scope">
            <span :style="returnStyle(scope.row)">{{scope.row.allocated_num || '-'}}</span>
            <span>&nbsp;/&nbsp;</span>
            <span>{{scope.row.count_real || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.OperateTruckLoadDetailEditNum,
                  command: () => handleShowForm('FormOperateTruckLoadEditNum', {
                    ...scope.row,
                    delivery_date: detail.delivery_date,
                    item_id: detail.item_id
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
    name: "DetailOperateTruckLoad",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate
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
      //返回提醒样式
      returnStyle(data){
        if(data.allocated_num !== data.count_real){
          return 'color: #ff5252;font-weight: bold;';
        }
        return '';
      },
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.detail = data;
        this.supDeliveryItemStoreDetail();
      },
      //获取明细列表
      async supDeliveryItemStoreDetail(){
        let { detail } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryItemStoreDetail, {
          delivery_date: detail.delivery_date,
          line_code: detail.line_code,
          item_id: detail.item_id
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
