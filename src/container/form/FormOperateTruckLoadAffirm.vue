<template>
  <form-layout title="发车确认" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px 20px; color: #ff5252;">注：以下为缺货商品分配情况，确认后系统将自动改单</div>
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="县域" min-width="100">
          <template slot-scope="scope">{{scope.row.city.code}}/{{scope.row.city.title}}</template>
        </el-table-column>
        <el-table-column label="门店" min-width="100">
          <template slot-scope="scope">{{scope.row.store.title}}</template>
        </el-table-column>
        <el-table-column label="商品" min-width="200">
          <template slot-scope="scope">{{scope.row.item.code}}/{{scope.row.item.title}}</template>
        </el-table-column>
        <el-table-column label="应出库" width="100">
          <template slot-scope="scope">{{scope.row.count_real}}件</template>
        </el-table-column>
        <el-table-column label="实际出库" width="100">
          <template slot-scope="scope">{{returnUnit(scope.row.allocate_num, '件', '-')}}</template>
        </el-table-column>
        <el-table-column label="缺货" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.count_real - scope.row.allocate_num <= 0">-</span>
            <span v-else>{{scope.row.count_real - scope.row.allocate_num}}件</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-left: 140px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="submitData">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config } from '@/util';

export default {
  name: "FormOperateTruckLoadAffirm",
  mixins: [formMixin],
  created() {
  },
  components: {
  },
  data(){
    let initDetail = {}
    return{
      rules: {},
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      dataItem: []
    }
  },
  methods: {
    //显示form(重写)
    showForm(data){
      this.$data.detail = data;
      //已全部分拣
      if(data.sorted){
        this.supConfirmStoreLack();
      }else{
        this.$message({message: '该线路商品尚未全部分拣完成，暂不可发车确认', type: 'error'});
      }
    },
    //获取列表
    async supConfirmStoreLack(){
      let { detail } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.supConfirmStoreLack, {
        delivery_date: detail.delivery_date,
        line_id: detail.line_id,
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        if(rd.length > 0){
          this.$data.dataItem = res.data;
          this.$data.isShow = true;
        }else{
          this.supSend();
        }
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //获取发车确认
    supSend(){
      this.$messageBox.confirm(`商品正常，您确认发车？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitData();
      }).catch(() => {
        //console.log('取消');
      });
    },
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supSend, {
        line_id: detail.line_id,
        delivery_date: detail.delivery_date
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已确认', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableOperateTruckLoad');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
