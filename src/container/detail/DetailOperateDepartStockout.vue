<template>
  <detail-layout title="缺货记录" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-row style="padding: 0 30px 16px; border-bottom: 1px solid #ececec;">
      <el-col :span="22">
        <span style="margin-right: 10px;">配送日期</span>
        <el-date-picker
          size="small"
          v-model="query.delivery_date"
          value-format="yyyy-MM-dd"
          @change="supDeliveryLackHistoryItem"
          style="width: 240px;"
          placeholder="配送日期"
          :clearable="false"
        />
      </el-col>
      <el-col :span="2">
        <el-button v-if="auth.isAdmin || auth.OperateDepartStockoutExport" @click.native="handleExport('supDeliveryLackHistoryItemExport', query)" size="mini" type="primary" plain>导出缺货记录</el-button>
      </el-col>
    </el-row>
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">{{scope.row.item.code}}/{{scope.row.item.title}}</template>
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
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.OperateDepartStockout,
                  command: () => handleShowDetail('DetailOperateDepartStockoutDetail', {
                    ...scope.row,
                    delivery_date: query.delivery_date,
                    item_id: scope.row.item.id
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
    name: "DetailOperateDepartStockout",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate
    },
    data() {
      let initDetail = {}
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        query: {
          province_code: this.$province.code,
          delivery_date: ''
        },
        dataItem: []
      }
    },
    methods: {
      //显示(重写mixin)
      showDetail(data){
        this.$data.detail = data;
        this.$data.query.delivery_date = data.delivery_date;
        this.supDeliveryLackHistoryItem();
      },
      //获取明细列表
      async supDeliveryLackHistoryItem(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDeliveryLackHistoryItem, this.query);
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
