<template>
  <detail-layout title="供应商品" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column prop="title" label="商品编号/名称" width="600">
          <template slot-scope="scope">
            {{ scope.row.code }}&nbsp;/&nbsp;{{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="gross_weight" label="毛重">
          <template slot-scope="scope">{{returnWeight(scope.row.gross_weight)}}斤</template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailHeadBalanceLog",
    mixins: [detailMixin],
    components: {
    },
    data() {
      return {
        initDetail: {},
        dataItem: []
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.detail = [];
        this.getDetail(data.id);
      },
      //获取详情
      async getDetail(supplierId){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supplierBindItems, {
          supplier_id: supplierId
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          this.$data.dataItem = res.data;
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
