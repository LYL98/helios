<template>
  <div>
    <el-form label-position="right" label-width="80px" style="width: 540px; margin-top: -10px;">
      <el-form-item label="当前区域">
        {{ province.title || '全部区域' }}
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker
          v-model="pickerValue"
          value-format="yyyy-MM-dd"
          type="daterange"
          :picker-options="fixDateOptions"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        />
        <div style="color: #7f1305;">注：选择查询日期</div>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: space-between;">
          <el-button @click="isShowPreview = true" plain type="primary">预览</el-button>
          <div>
            <el-button @click="handleClose">取消</el-button>
            <el-button @click="submit" type="primary">导出</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="isShowPreview"
      :before-close="handlePreviewClose"
      width="1000px"
      title="商户流水列表"
      append-to-body
    >
      <div style="padding: 0 20px;">
        <div>
          <span>当前区域：{{ province.title }}</span>
          <span style="margin-left: 20px;">日期：{{ pickerValue[0] }} 至 {{ pickerValue[1] }}</span>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <img src="@/assets/img/export_preview_balance_log.png" style="width: 800px; height: 450px"/>
        </div>
        <div style="text-align: right;">
          <el-button @click="isShowPreview = false" plain type="primary">上一步</el-button>
          <el-button @click="submit" type="primary">导出</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Form, FormItem, DatePicker, Button, Dialog } from 'element-ui';
  import { DataHandle, Config, Constant, Http } from '@/util';

  export default {
    name: "FormFinanceBalanceMerchantLogExport",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-date-picker': DatePicker,
      'el-button': Button,
      'el-dialog': Dialog
    },
    props: {
      close: { type: Function, required: true },
      province: { type: Object, default: {} }
    },
    data() {
      let d = DataHandle.returnDateStr();
      let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
      return {
        isShowPreview: false,
        pickerValue: [nowDate, nowDate],
        fixDateOptions: Constant.FIX_DATE_RANGE,
      }
    },
    methods: {
      async submit() {
        let api = Config.api.financeBalanceMerchantLogExport;
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.province.code,
          begin_date: this.pickerValue[0],
          end_date: this.pickerValue[1]
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}&begin_date=${this.pickerValue[0]}&end_date=${this.pickerValue[0]}`;
          
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },
      handleClose() {
        this.$props.close();
      },
      handlePreviewClose() {
        this.$props.close();
        this.$data.isShowPreview = false;
      }
    }
  }
</script>

<style scoped>

</style>
