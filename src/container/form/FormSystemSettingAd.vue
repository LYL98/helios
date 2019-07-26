<template>
  <div>
    <div class="settingItem">
      <p class="title">广告设置</p>
      <div class="content">
        <div class="item">
          <div class="name">广告语</div>
          <div class="space"></div>
          <div class="value">{{itemData.ad}}</div>
        </div>
      </div>
      <div class="operation">
        <el-button style="margin-left: 124px" size="small" type="primary" plain @click="showFrom">编辑</el-button>
      </div>
    </div>

    <!--设置项编辑dialog-->
    <el-dialog title="广告设置" :visible.sync="isShow" width="540px" :before-close="handleCancel">
      <div>
        <!--广告设置-->
        <el-form  label-width="120px" style="width: 400px;" :model="itemData" :rules="rules" ref="ruleForm">
          <el-form-item label="广告语" prop="input_ad">
            <el-input size="small" maxLength="10" v-model="itemData.input_ad" style="width: 270px" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="basicdataAdSet">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import fromMixin from './from.mixin';
  import { Http, Config } from '@/util';
  import { MessageBox, Notification } from 'element-ui';

  export default {
    name: "FormSystemSettingAd",
    mixins: [fromMixin],
    data() {
      return{
        province: this.$province,
        itemData: {
          input_ad: '',
          ad: ''
        },
        rules: {
          input_ad: [
            { required: true, message: '广告语不能为空', trigger: 'change' },
          ]
        }
      }
    },
    created() {
      this.basicdataAdGet();
    },
    methods: {
      //获取广告语
      async basicdataAdGet() {
        let res = await Http.get(Config.api.basicdataAd, {
          province_code: this.province.code
        });
        if (res.code === 0) {
          let { itemData } = this;
          itemData.ad = res.data;
          itemData.input_ad = res.data;
          this.$data.itemData = itemData;
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
      //设置广告语
      basicdataAdSet() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            (async ()=>{
              let res = await Http.post(Config.api.basicdataAd, {
                province_code: this.province.code,
                ad: this.itemData.input_ad,
              });
              if (res.code === 0) {
                this.basicdataAdGet();
                Notification.success({
                  title: '提示',
                  message: '广告语设置成功'
                });
                this.handleCancel();
              }else{
                MessageBox.alert(res.message, '提示');
              }
            })();
          } else {
            return false;
          }
        });
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
