<template>
  <el-dialog :title="`${detail.id?'修改':'新增'}团购`" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
    <el-form class="custom-form" label-position="right" label-width="90px" :model="detail" :rules="rules" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="团购名称" prop="title">
            <el-input size="small" v-model="detail.title" :maxLength="20" placeholder="请输入团购名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="团购时间" prop="date">
             <el-date-picker
              size="small"
              style="width: 100%;"
              :disabled="false"
              v-model="detail.picker_value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="changePicker"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发货时间" prop="date">
            <el-date-picker
               size="small"
              :clearable="false"
              style="width: 100%;"
              placeholder="发货日期"
              :disabled="false"
              v-model="detail.delivery_date"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="立即上架">
            <el-checkbox v-model="detail.checked" size="small"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--搜索-->
    <div>

    </div>
    <!--表格-->
    
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { QuillEditor, UploadImg } from '@/common';

export default {
  name: "AddEditGroupActivity",
  mixins: [addEditMixin],
  components: {
    
  },
  data(){
    //价格
    let validPriceSale = (rules, value, callback) => {
      if (Number(value) > 1000000) {
        callback('金额不能超过1000000')
      }else {
        callback();
      }
    };
    //建议团购价
    let validAdvicePriceSale = (rules, value, callback) => {
      if (Number(value) < Number(this.detail.advice_header_price)) {
        callback('建议团购价不能小于建议团长价')
      }else {
        callback();
      }
    };
    let initDetail = {
      picker_value: null
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        title: [
          { required: true, message: '商品名称不能为空', trigger: 'change' },
        ],
        price_origin: [
          { required: true, message: '请输入原价', trigger: 'change' },
          { pattern: Verification.testStrs.isPrice, message: '请输入正确的价格', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
        ],
        advice_header_price: [
          { required: true, message: '请输入建议团长价', trigger: 'change' },
          { pattern: Verification.testStrs.isPrice, message: '请输入正确的价格', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
        ],
        advice_price_sale: [
          { required: true, message: '请输入建议团购价', trigger: 'change' },
          { pattern: Verification.testStrs.isPrice, message: '请输入正确的价格', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
          { validator: validAdvicePriceSale, trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        this.groupActivityDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async groupActivityDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupActivityDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = {
          ...rd,
          cover_images: this.handleToArray(rd.cover_image),
          share_images: this.handleToArray(rd.share_image),
          price_origin: this.returnPrice(rd.price_origin),
          advice_header_price: this.returnPrice(rd.advice_header_price),
          advice_price_sale: this.returnPrice(rd.advice_price_sale),
        };
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //改变日期
    changePicker(value){
      if(value && value.length === 2){
        this.$data.error.items = '';
        this.$data.editItem.start_time = value[0];
        this.$data.editItem.end_time = value[1];
      }else{
        this.$data.editItem.pickerValue = null;
        this.$data.editItem.start_time = '';
        this.$data.editItem.end_time = '';
      }
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'groupActivityEdit' : 'groupActivityAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableGroupActivity');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
