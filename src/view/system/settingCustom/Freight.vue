<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" :disabled="!isEdit" label-width="110px" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">运费设置</h6>
      <el-form-item label="运费" prop="delivery_price">
        <input-price size="medium" v-model="detail.delivery_price" placeholder="请输入运费"/>
      </el-form-item>
      <el-form-item label="活动" prop="discount_delivery_line">
        <span>全场满</span>
        <input-price size="medium" v-model="detail.discount_delivery_line" unit="元" style="width: 140px; margin: 0 10px;"/>
        <span>免运费</span>
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
  import { InputPrice } from '@/common';

  export default {
    name: "Freight",
    mixins: [addEditMixin],
    components: {
      'input-price': InputPrice
    },
    props: {
      provinceCode: { type: String, default: '' }, //省code
    },
    data() {
      return{
        isEdit: false,
        detail: {
          ad: ''
        },
        rules: {
          delivery_price: [
            { required: true, message: '运费不能为空', trigger: 'change' }
          ],
          discount_delivery_line: [
            { required: true, message: '满减金额不能为空', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.basicdataDeliveryInfoGet();
    },
    methods: {
      //取消
      handleCancel(){
        this.basicdataDeliveryInfoGet();
        this.$data.isEdit = false;
      },
      //获取运费
      async basicdataDeliveryInfoGet() {
        let { detail } = this;
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.basicdataDeliveryInfo, {
          province_code: this.provinceCode
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
        let res = await Http.post(Config.api.basicdataDeliveryInfo, {
          province_code: this.provinceCode,
          ...this.detail
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$message({message: '运费设置成功', type: 'success'});
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
