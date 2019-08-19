<template>
  <div>
    <div class="settingItem">
      <p class="title">营业设置</p>
      <div class="content">
        <div class="item">
          <div class="name">营业时间</div>
          <div class="space"></div>
          <div class="value">{{itemData.order_start_time}} - {{itemData.order_end_time}}</div>
        </div>
      </div>
      <div class="operation">
        <el-button style="margin-left: 124px" size="small" type="primary" plain @click.native="showForm">编辑</el-button>
      </div>
    </div>

    <!--设置项编辑dialog-->
    <el-dialog title="营业设置" :visible.sync="isShow" width="580px" :before-close="handleCancel">
      <div>
        <!--营业设置-->
        <el-form  label-width="120px" style="width: 380px;" :model="itemData" :rules="rules" ref="ruleForm">
          <el-form-item label="营业时间" prop="orderTimeRange">
            <el-time-picker
              is-range
              size="small"
              v-model="itemData.orderTimeRange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="HH:mm:ss"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleFormSubmit">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import formMixin from './form.mixin';
  import { Http, Config } from '@/util';

  export default {
    name: "FormSystemSettingOperating",
    mixins: [formMixin],
    data() {
      return{
        initDetail: {},
        itemData: {
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
      //获取营业
      async basicdataOrderTimeGet() {
        let res = await Http.get(Config.api.basicdataOrderTime, {
          province_code: this.province.code
        });
        if (res.code === 0) {
          let rd = res.data;
          this.$data.itemData = {
            ...rd,
            orderTimeRange: [rd.order_start_time, rd.order_end_time]
          };
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //设置营业
      async submitData() {
        let { itemData } = this;
        let res = await Http.post(Config.api.basicdataOrderTime, {
          province_code: this.province.code,
          order_start_time: itemData.orderTimeRange[0],
          order_end_time: itemData.orderTimeRange[1]
        });
        if (res.code === 0) {
          this.basicdataOrderTimeGet();
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
  .settingItem{
    width: 526px;
    padding-right: 20px;
    >.title{
      margin-left: 20px;
      margin-top: 20px;
      font-size: 14px;
      color: #3B3D42;
      font-weight: bold;
    }
    >.content{
      >.item{
        margin-top: 20px;
        display: flex;
        font-size: 12px;
        width: 100%;
        >.name {
          width: 112px;
          flex: none;
          color: #73767D;
          text-align: right;
        }
        >.space{
          width: 12px;
          flex: none;
        }
        >.value{
          flex: 1;
          color: #3B3D42;
          text-align: left;
          >.appendix{
            padding-left: 12px;
          }
        }
      }
    }
    >.operation{
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>
