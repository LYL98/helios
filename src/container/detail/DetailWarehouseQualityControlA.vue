<template>
  <detail-layout title="品控入库详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <div class="f-r" style="position: relative; right: -84px;">
        <el-tag size="small" :type="inventoryStatusType[detail.status]" disable-transitions>
          {{inventoryStatus[detail.status]}}
        </el-tag>
      </div>
      <h6 class="subtitle">调拨信息</h6>
      <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调出仓">{{detail.src_storehouse_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入仓">{{detail.tar_storehouse_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可售日期">{{detail.available_date}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计送达">{{detail.estimate_arrive_at}}</el-form-item>
        </el-col>
      </el-row>

      <!--已关闭-->
      <template v-if="detail.status === 'closed'">
        <h6 class="subtitle">关闭信息</h6>
        <el-form-item label="备注">{{detail.close_remark}}</el-form-item>
      </template>
      
      <!--否则-->
      <template v-else>
        <h6 class="subtitle">品控入库信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入库数量">{{detail.num_in}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产日期">{{detail.produce_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保质期">{{detail.shelf_life}}天</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存期">{{detail.stock_life}}天</el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>

    <template v-if="detail.instocks.length > 0">
      <h6 class="subtitle">品控信息</h6>
      <div style="padding: 0 30px;">
        <el-table :data="detail.instocks" :row-class-name="highlightRowClassName">
          <el-table-column label="到货数量">
            <template slot-scope="scope">{{scope.row.num_arrive}}件</template>
          </el-table-column>
          <el-table-column label="品控数量">
            <template slot-scope="scope">{{scope.row.qa_num}}件</template>
          </el-table-column>
          <el-table-column label="入库数量">
            <template slot-scope="scope">
              <span>{{scope.row.num}}件</span>
              <a v-if="scope.row.status === 'success' && (auth.isAdmin || auth.WarehouseQualityControlEditNum)" 
                style="margin-left: 10px;" href="javascript:void(0);" @click="handleShowForm('FormWarehouseQualityControlEditNum', scope.row)">修改</a>
            </template>
          </el-table-column>
          <el-table-column label="处理数量">
            <template slot-scope="scope">{{returnUnit(scope.row.un_qa_num, '件', '-')}}</template>
          </el-table-column>
          <el-table-column label="处理类型">
            <template slot-scope="scope">{{scope.row.un_qa_type ? supOptTypes[scope.row.un_qa_type] : '-'}}</template>
          </el-table-column>
          <el-table-column label="处理金额">
            <template slot-scope="scope">{{scope.row.un_qa_amount ? '￥' + returnPrice(scope.row.un_qa_amount) : '-'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <a href="javascript:void(0);" @click="handleShowDetail('DetailWarehouseQualityControlInstock', scope.row)">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseQualityControlG",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        instocks: []
      }
      return {
        inventoryStatus: Constant.PURCHASE_STATUS(),
        inventoryStatusType: Constant.PURCHASE_STATUS_TYPE,
        supOptTypes: Constant.SUP_OPT_TYPES(),
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        id: null
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.id = data.id; //外部调用，要保存
        this.supDistributeDetail();
      },
      //调拨详情
      async supDistributeDetail(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeDetail, { id: this.id });
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
