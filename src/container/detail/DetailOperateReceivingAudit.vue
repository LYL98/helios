<template>
  <!--确认审核start-->
  <el-dialog title="审核预览" :visible="isShow" width="720px" :before-close="cancelAudit">
    <div v-if="checkData.length > 0">
      <div style="margin-bottom: 10px; color: red;">注：以下为异常的商品</div>
      <el-table :data="checkData" :row-class-name="highlightRowClassName" style="width: 100%" size="mini">
        <el-table-column label="商品">
          <template slot-scope="scope">
            <span style="font-weight:bold;">{{scope.row.item_code}}</span>
            <span>{{scope.row.item_title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户" prop="store_title">
        </el-table-column>
        <el-table-column label="实收/应收(件)" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.real_number}}</span>
            <span>/</span>
            <span>{{scope.row.order_number}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else style="font-size: 30px; margin-left: 60px; color: #999;">
      无异常商品
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">关 闭</el-button>
      <el-button v-if="(auth.isAdmin || auth.OperateReceivingAudit) && !dataItem.is_all_line_checked" type="primary" @click.native="submitAudit">审核通过</el-button>
    </span>
  </el-dialog>
  <!--确认审核end-->
</template>

<script>
import detailMixin from './detail.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';

export default {
  name: "DetailOperateReceivingAudit",
  mixins: [detailMixin],
  components: {
  },
  created() {
  },
  data(){
    return {
      initDetail: {},
      query: {},
      dataItem: {
        items: [],
        num: 0
      }
    }
  },
  methods: {
    //显示新增修改(重写mixin)
    showDetail(data){
      if(data){
        this.deliveryPreCheck();
      }
    },
    //获取审核详情
    async deliveryPreCheck(){
      let { query, dataItem } = this;
      let cityCodes = [];
      dataItem.cities.map((item)=>{
        cityCodes.push(item.code);
      });

      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.deliveryPreCheck, {
        opt_date: query.opt_date,
        city_codes: cityCodes.join()
      });
      if(res.code === 0){
        let rd = res.data;
        //分段式渲染（20条）
        let page = 1, pageSize = 20, num = rd.length, dataList = [];
        let funTemp = (data) => {
          dataList = data;
          this.$data.checkData = Object.freeze(data);
          this.$nextTick(()=>{
            setTimeout(()=>{
              if(num / pageSize > page){
                dataList = dataList.concat(rd.slice(page * pageSize, page * pageSize + pageSize)); //拼接数据
                funTemp(dataList);
                page++;
              }
            }, 0);
          });
        }

        funTemp(rd.slice(0, pageSize));
        this.$data.isShowAudit = true;

      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
    //提交审核
    async submitAudit(){
      let { query, dataItem } = this;
      let cityCodes = [];

      dataItem.cities.map((item)=>{
        cityCodes.push(item.code);
      });

      this.$loading({isShow: true});
      let res = await Http.post(Config.api.orderDeliveryCheck, {
        opt_date: query.opt_date,
        city_codes: cityCodes
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.handleCancel();
        //刷新数据
        let pc = this.getPageComponents('TableOperateReceiving');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
