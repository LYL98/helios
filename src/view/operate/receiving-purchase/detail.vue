<template>
  <detail-layout title="品控详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <div class="f-r" style="position: relative; right: -84px;">
        <el-tag size="small" :type="qCStatusType[detail.status]" disable-transitions>
          {{qCStatus[detail.status]}}
        </el-tag>
      </div>
      <h6 class="subtitle">采购信息</h6>
      <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购单号">{{detail.code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购日期">{{detail.order_date}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售日期">{{detail.available_date}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计送达">{{detail.estimate_arrive_at}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{detail.supplier.title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="送达仓">{{detail.storehouse.title}}</el-form-item>
        </el-col>
      </el-row>

      <!--已关闭-->
      <template v-if="detail.status === 'closed'">
        <h6 class="subtitle">关闭信息</h6>
        <el-form-item label="备注">{{detail.close_remark}}</el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关闭人">{{detail.closer.realname}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关闭时间">{{detail.closer.created}}</el-form-item>
          </el-col>
        </el-row>
      </template>
      
      <!--否则-->
      <template v-else-if="judgeOrs(detail.status, ['part_in', 'all_in'])">
        <h6 class="subtitle">品控信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合格数量">{{detail.num_in}}件</el-form-item>
          </el-col>
          <el-col :span="12" v-if="itemData.fisrt_system_class && itemData.fisrt_system_class.has_produce_date">
            <el-form-item label="生产日期">{{detail.produce_date}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保质期">{{detail.shelf_life}}天</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存期">{{detail.stock_life}}天</el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>

    <template v-if="detail.out_stocks.length > 0">
      <h6 class="subtitle">品控记录</h6>
      <div style="padding: 0 30px;">
        <el-table :data="detail.out_stocks" :row-class-name="highlightRowClassName">
          <el-table-column label="到货数量" min-width="90">
            <template slot-scope="scope">{{scope.row.num_arrive}}件</template>
          </el-table-column>
          <el-table-column label="品控抽检" min-width="90">
            <template slot-scope="scope">{{returnUnit(scope.row.qa_num, '件', '-')}}</template>
          </el-table-column>
          <el-table-column label="合格数量" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.num}}件</span>
              <a v-if="editAuth(scope.row)" style="margin-left: 10px;" href="javascript:void(0);" @click="handleShowForm('FormEditNum', scope.row)">修改</a>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="160"></el-table-column>
          <el-table-column label="品控人" min-width="100">
            <template slot-scope="scope">{{scope.row.creator.realname}}</template>
          </el-table-column>
          <el-table-column label="品控时间" width="160">
            <template slot-scope="scope">{{scope.row.created}}</template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </detail-layout>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "Detail",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        supplier: {},
        storehouse: {},
        out_stocks: []
      }
      return {
        qCStatus: Constant.Q_C_STATUS(),
        qCStatusType: Constant.Q_C_STATUS_TYPE,
        supOptTypes: Constant.SUP_OPT_TYPES(),
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        id: null,
        itemData: {}
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.id = data.id; //外部调用，要保存
        this.$data.itemData = {
          fisrt_system_class: {
            has_produce_date: false
          }
        };
        this.fromSupplierOrderDetail();
        this.supPItemDetail(data.item_code);
      },
      //预采详情
      async fromSupplierOrderDetail(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.fromSupplierOrderDetail, { id: this.id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //商品信息，用于入库 时候查看其一级科学分类，库存期，保质期
      async supPItemDetail(itemCode){
        let res = await Http.get(Config.api.supPItemDetail, {
          item_code: itemCode
        });
        if(res.code === 0){
          this.$data.itemData = res.data;
        }
      },
      //修改权限
      editAuth(data){
        let { auth } = this;
        if(data.confirmer_id === 0 && (auth.isAdmin || auth.OperateReceivingPurchaseEditNum)){
          return true;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
</style>
