<template>
  <div>
    <el-dialog title="分配" :visible="isShow" :before-close="cancel" width="480px">
      <el-form label-position="right" label-width="100px" style="width: 400px;" :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="">
          <el-radio v-model="allocateType" label="service" :disabled="!judgeAuth" border size="mini">分配给客服</el-radio>
          <el-radio v-model="allocateType" label="my" :disabled="!judgeAuth" border size="mini">分配给自己</el-radio>
        </el-form-item>
        <el-form-item label="客服" prop="operator_id" v-if="allocateType === 'service'">
          <select-operator
            v-model="editData.operator_id"
            size="medium"
            placeholder="请选择客服"
            post="service"
            clearable
            filterable
            :filterableData="filterableData"
            :needNum="500"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button @click.native="cancel">取 消</el-button>
          <el-button type="primary" @click.native="submit">确 认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config } from '@/util';
import { SelectOperator } from '@/component';

export default {
  name: "Allocate",
  mixins: [formMixin],
  components: {
    'select-operator': SelectOperator,
  },
  created() {
    this.initEditDate();
  },
  data(){
    return{
      isShow: false,
      allocateType: 'service',
      detail: {},
      editData: {
        ids: [],
        operator_id: ''
      },
      rules: {
        operator_id: [
          { required: true, message: '请选择客服', trigger: 'change' }
        ]
      },
      provinceCodes: []
    }
  },
  computed: {
    judgeAuth() {
      return this.$auth.isAdmin || this.$auth.OrderAfterSaleAllocateToService;
    }
  },
  methods: {
    initEditDate() {
      this.editData = {
        ids: [],
        operator_id: ''
      }
    },

    filterableData(dataItem){
      let datas = [];
      let { provinceCodes, $myInfo } = this;
      //如果选择了多个区域的单
      if(provinceCodes.length > 1){
        datas = dataItem.filter(item => item.opt_type === 'global');
      }else{
        datas = dataItem.filter(item => item.opt_type === 'global' || item.province_code === provinceCodes[0]);
      }
      return datas;
    },

    //取消
    cancel(){
      let that = this;
      this.$data.provinceCodes = [];
      that.initEditDate();
      that.$refs['ruleForm'].resetFields();
      that.orderShowHideAllocateClose();
    },
    //提交结果
    submit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.aftersaleAllocateToOperator();
        }
      });
    },
    //提交
    async aftersaleAllocateToOperator(){
      let { editData, allocateType } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.post(Config.api.aftersaleAllocateToOperator, {
        operator_id: allocateType === 'my' ? this.$myInfo.id : editData.operator_id,
        ids: editData.ids
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.cancel();
        this.$message({title: '提示', message: '分配成功', type: 'success'});
        this.$attrs.callback();//回调
        this.$refs['ruleForm'].resetFields();
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //关闭显示
    orderShowHideAllocateClose(ids, datas){
      if(ids){
        let { provinceCodes, judgeAuth } = this;
        for(let i = 0; i < datas.length; i++){
          let con = provinceCodes.filter(item => item === datas[i].province_code);
          if(con.length === 0){
            provinceCodes.push(datas[i].province_code);
          }
        }
        this.$data.provinceCodes = provinceCodes;
        this.$data.allocateType = judgeAuth ? 'service' : 'my';
        this.$data.editData.ids = ids;
        this.$data.isShow = true;
      }else{
        this.$data.isShow = false;
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
