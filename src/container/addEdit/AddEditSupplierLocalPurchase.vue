<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <div class="f-r">
          <!--<el-tag size="small" :type="localPurchaseStatusType[detail.status]" disable-transitions>
            {{localPurchaseStatus[detail.status]}}
          </el-tag>-->
          <el-tag size="small" type="info" disable-transitions>全部入库</el-tag>
        </div>
        <h6 class="subtitle">采购信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地采单号">{{detail.code}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品编号/名称">{{detail.item.code}}/{{detail.item.title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供货商">{{detail.supplier.title}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购价">&yen;{{returnPrice(detail.price_buy)}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">{{detail.num}}件</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购日期">{{detail.order_date}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <h6 class="subtitle">关联入库单</h6>
      <div style="padding: 0 30px;">
        <el-table :data="detail.instocks" :row-class-name="highlightRowClassName">
          <el-table-column prop="code" label="入库单号"></el-table-column>
          <el-table-column prop="ware_title" label="库仓"></el-table-column>
          <el-table-column prop="num" label="入库数量">
            <template slot-scope="scope">{{scope.row.num}}件</template>
          </el-table-column>
          <el-table-column prop="created" label="入库时间"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">{{scope.row.id}}已入库</template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin-left: 140px; margin-top: 50px;">
        <template>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant } from '@/util';

export default {
  name: "AddEditSupplierLocalPurchase",
  mixins: [addEditMixin],
  components: {
  },
  created() {
  },
  data(){
    let initDetail = {
      supplier: {},
      item: {},
      instocks: []
    }
    return {
      localPurchaseStatus: Constant.LOCAL_PURCHASE_STATUS(),
      localPurchaseStatusType: Constant.LOCAL_PURCHASE_STATUS_TYPE,
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
      },
      pageTitles: {
        detail: '地采订单详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.supplierLocalPurchaseDetail(data.id);
        this.$data.pageType = type;
      }
    },
    //获取详情
    async supplierLocalPurchaseDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supplierLocalPurchaseDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
