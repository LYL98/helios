<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" :disabled="!isEdit" label-width="110px" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">营业设置</h6>
      <el-form-item label="营业时间" prop="orderTimeRange">
        <el-time-picker
            is-range
            size="medium"
            style="width: 100%;"
            v-model="detail.orderTimeRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="HH:mm:ss"
            placeholder="选择时间范围">
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
  import addEditMixin from '@/share/mixin/add.edit.mixin';
  import { Http, Config } from '@/util';

  export default {
    name: "Operating",
    mixins: [addEditMixin],
    data() {
      return{
        isEdit: false,
        detail: {
          order_start_time: '',
          order_end_time: '',
          orderTimeRange: null
        },
        rules: {
          orderTimeRange: [
            { required: true, message: '请选择营业时间', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.basicdataOrderTimeGet();
    },
    methods: {
      //取消
      handleCancel(){
        this.basicdataOrderTimeGet();
        this.$data.isEdit = false;
      },
      //获取营业
      async basicdataOrderTimeGet() {
        let res = await Http.get(Config.api.basicdataOrderTime, {
          province_code: this.province.code
        });
        if (res.code === 0) {
          let rd = res.data;
          this.$data.detail = {
            ...rd,
            orderTimeRange: [rd.order_start_time, rd.order_end_time]
          };
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //设置营业
      async addEditData() {
        let { detail } = this;
        let res = await Http.post(Config.api.basicdataOrderTime, {
          province_code: this.province.code,
          order_start_time: detail.orderTimeRange[0],
          order_end_time: detail.orderTimeRange[1]
        });
        if (res.code === 0) {
          this.$message({message: '营业时间设置成功', type: 'success'});
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
