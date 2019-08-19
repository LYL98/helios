<template>
  <el-dialog title="退筐信息修改" :close-on-click-modal="false" :visible.sync="isShow" width="600px" append-to-body>
    <el-form :model="detail" label-position="right" label-width="100px" :rules="rules" ref="ruleForm" style="width: 520px;">
      <el-form-item label="门店">
        <el-input :value="detail.title" disabled/>
      </el-form-item>
      <el-form-item label="修改类型">
        <el-radio v-model="detail.radio" border size="small" @change="changeType" label="1">增加</el-radio>
        <el-radio v-model="detail.radio" border size="small" @change="changeType" label="2">减少</el-radio>
      </el-form-item>
      <el-form-item label="剩余筐数">
        <ul class="edit-number">
          <li>{{ frame_num }}个</li>
          <li class="edit">
            <el-form-item prop="frame_num">
              <el-input
                style="margin-left: 10px; width: 260px;"
                v-model="detail.frame_num"
              >
                <template slot="prepend">{{detail.radio === '1' ? '+' : '-'}}</template>
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="剩余金额">
        <ul class="edit-number">
          <li>{{ returnPrice(frame_amount) }}元</li>
          <li class="edit">
            <el-form-item prop="frame_amount">
              <el-input
                style="margin-left: 10px; width: 260px;"
                v-model="detail.frame_amount"
              >
                <template slot="prepend">{{detail.radio === '1' ? '+' : '-'}}</template>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="detail.remark" type="textarea" :rows="3" resize="none" placeholder="请输入备注..."/>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click.prevent="handleCancel">取消</el-button>
        <el-button type="primary" @click.prevent="handleAddEdit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import addEditMixin from './add.edit.mixin';
  import { Http, Config, Constant, DataHandle } from '@/util';

  export default {
    name: "AddEditMerchantRefund",
    mixins: [addEditMixin],
    components: {
    },
    props: {
      closeDialog: Function,
      callback: Function
    },
    data() {
      let that = this;
      let validFrameNum = (rules, value, callback) => {
        if (that.detail.radio != '1') { // 表示减

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('减少的筐数必须为大于零的纯数字'));
          }

          if (!!value && String(value).indexOf(".") > -1) {
            return callback(new Error('减少的筐数不能为小数'));
          }

          if (value > 100000) {
            return callback(new Error('减少的筐数不能大于100000'));
          }

          if (Number(value) > that.frame_num) {
            return callback(new Error('减少的筐数不能大于剩余筐数'));
          }
        } else {

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('增加的筐数必须为大于零的纯数字'));
          }

          if (!!value && String(value).indexOf(".") > -1) {
            return callback(new Error('增加的筐数不能为小数'));
          }

          if (value > 100000) {
            return callback(new Error('增加的筐数不能大于100000'));
          }

        }
        callback();
      };

      let validFrameAmount = (rules, value, callback) => {
        if (that.detail.radio != '1') { // 表示减

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('减少的金额必须为大于零的纯数字'));
          }

          if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
            return callback(new Error('减少的金额最多只能输入两位小数'));
          }

          if (value > 1000000) {
            return callback(new Error('减少的金额不能大于1000000'));
          }

          if (that.handlePrice(value) > that.frame_amount) {
            return callback(new Error('减少的金额不能大于剩余金额'));
          }

        } else {

          if (!!value && (isNaN(value) || value <= 0)) {
            return callback(new Error('增加的金额必须为大于零的纯数字'));
          }

          if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
            return callback(new Error('增加的金额最多只能输入两位小数'));
          }

          if (value > 1000000) {
            return callback(new Error('增加的金额不能大于1000000'));
          }
        }
        callback();

      };

      let initDetail = {
        radio: '1',
        frame_num: '',
        frame_amount: '',
        remark: ''
      }

      return {
        title: '',
        frame_num: 0,
        frame_amount: 0,
        initDetail: initDetail,
        detail: JSON.parse(JSON.stringify(initDetail)),
        rules: {
          frame_num: [
            { validator: validFrameNum, trigger: 'change' }
          ],
          frame_amount: [
            { validator: validFrameAmount, trigger: 'change' }
          ],
          remark: [
            { max: 200, message: '不能超过200个字符，请重新编辑', trigger: 'change' }
          ]
        }
      }
    },
    created() {
    },
    methods: {
      //显示新增修改(重写)
      showAddEdit(data){
        let d = {};
        if(data){
          d = JSON.parse(JSON.stringify({
            ...this.initDetail,
            ...data,
            frame_amount: '',
            frame_num: ''
          }));
          this.$data.frame_num = data.frame_num;
          this.$data.frame_amount = data.frame_amount;
        }else{
          d = JSON.parse(JSON.stringify(this.initDetail));
        }
        this.$data.detail = d;
        this.$data.isShow = true;
      },
      //修改类型
      changeType() {
        this.$data.detail.frame_num = '';
        this.$data.detail.frame_amount = '';
      },

      validFiled() {

        if (!this.$data.detail.frame_num && !this.$data.detail.frame_amount) {
          this.$message({ message: '退筐数量 和 退筐金额 不能同时为0。', type: 'error' });
          return false;
        }

        return true;
      },

      //提交数据
      async addEditData() {
        let {id, radio, frame_num, frame_amount, remark} = this.detail;
        frame_num = Number(frame_num) || 0; // 如果没有输入筐数，则设置默认值为0
        frame_amount = this.handlePrice(frame_amount);
        this.$loading({isShow: true});
        let res = await Http.post(Config.api.merchantRefundEdit, {
          store_id: id,
          frame_num: radio !== '1' ? -frame_num : frame_num,
          frame_amount: radio !== '1' ? -frame_amount : frame_amount,
          remark
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$message({ message: '门店退筐信息修改成功！', type: 'success' });
          this.handleCancel(); //隐藏
          //刷新数据(列表)
          let pc = this.getPageComponents('TableMerchantRefund');
          pc.getData(pc.query);
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      }
    },

  }
</script>

<style lang="scss" scoped>
  .edit-number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .edit {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
