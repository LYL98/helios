<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" :disabled="!isEdit" label-width="110px" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">订单确认设置</h6>
      <el-form-item label="截单时间" prop="confirm_time">
        <el-time-picker
          style="width: 100%"
          placeholder="截单时间"
          size="medium"
          v-model="detail.confirm_time"
          value-format="HH:mm:ss">
        </el-time-picker>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <template v-if="isEdit">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </template>
      <template v-else>
        <el-button size="medium" @click.native="isEdit = true">修 改</el-button>
      </template>
    </div>
  </div>
</template>

<script>
  import addEditMixin from '@/container/addEdit/add.edit.mixin';
  import { Http, Config } from '@/util';

  export default {
    name: "OrderAffirm",
    mixins: [addEditMixin],
    data() {
      return{
        isEdit: false,
        detail: {
          confirm_time: ''
        },
        rules: {
          confirm_time: [
            { required: true, message: '请选择截单时间', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.basicdataConfirmTime();
    },
    methods: {
      //取消
      handleCancel(){
        this.basicdataConfirmTime();
        this.$data.isEdit = false;
      },
      //获取广告语
      async basicdataConfirmTime() {
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.basicdataConfirmTime, {
          province_code: this.$province.code
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$data.detail = res.data;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //设置广告语
      async addEditData() {
        this.$loading({isShow: true});
        let res = await Http.post(Config.api.basicdataConfirmTime, {
          province_code: this.$province.code,
          ...this.detail
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$message({message: '截单时间设置成功', type: 'success'});
          this.handleCancel();
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
