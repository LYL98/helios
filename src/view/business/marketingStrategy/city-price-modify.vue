<template>
  <el-form :model="formData" ref="ruleForm" label-width="120px" class="pr-30">
    <el-form-item
      label="商品编号/名称："
    >
      <span v-if="item.item">{{ item.item.code }} / {{ item.item.title }}</span>
      <span v-else>-</span>
    </el-form-item>
    <el-form-item
      label="今日报价："
    >
      {{ item.item && item.item.price_sale ? ('￥' + DataHandle.returnPrice(item.item.price_sale)) : '未报价' }}
    </el-form-item>
    <el-form-item
      label="浮动率："
      prop="discount"
      :rules="[{ validator: validDiscount, trigger: 'change'}]"
    >
      <el-input v-model="formData.discount" @keyup.enter.native="onSubmit">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item
      label="浮动价格："
    >
      {{ item.item && item.item.price_sale ? '￥' + DataHandle.returnPrice(item.item.price_sale * formData.discount / 100) : '-' }}
    </el-form-item>
    <el-form-item
      label="总库存："
    >
      {{ item.item && !!item.item.item_stock ? item.item.item_stock + '件' : '-' }}
    </el-form-item>
    <el-form-item
      label="已售数量："
    >
      {{ item.item && !!item.item.sale_already ? item.item.sale_already + '件' : '-' }}
    </el-form-item>
    <el-form-item
      label="生效时间："
    >
      {{ item.updated }}
    </el-form-item>

    <div class="display-flex justify-content-end">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </div>
  </el-form>

</template>

<script>
  import { Row, Col, Form, FormItem, Input, Button } from 'element-ui';
  import { Http, Config, DataHandle } from '@/util';
  export default {
    name: 'city-price-modify',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
    },
    props: {
      item: { type: Object, default: {} }
    },
    data() {
      return {
        formData: { id: '', discount: '' }
      }
    },
    created() {
      this.DataHandle = DataHandle;
      this.$data.formData = {
        id: this.$props.item.id,
        discount: DataHandle.returnDiscount(this.$props.item.discount)
      };
    },
    methods: {
      validDiscount(rules, value, callback) {
        let discount = this.$data.formData.discount;
        if (!discount) return callback(new Error('浮动率不能为空'));
        if (isNaN(discount)) return callback(new Error('浮动率必须为数字'));
        if (discount <= 0) return callback(new Error('浮动率必须大于零'));
        if (discount >= 10000) return callback(new Error('浮动率不能超过10000%'));
        if (!/^-?\d+\.?\d{0,1}$/.test(discount)) return callback(new Error('浮动率最多支持一位小数'));
        callback();
      },

      onCancel() {
        this.$emit('cancel');
      },

      onSubmit() {
        this.$refs['ruleForm'].validate().then(async volid => {
          if (!volid) return;

          let formData = {...this.$data.formData};
          formData.discount = DataHandle.handleDiscount(formData.discount);
          let entries = [formData];

          let res = await Http.post(Config.api.bussinessMarketingStrategyCityBatchEdit, { entries });
          if (res.code === 0) {
            this.$message({message: '修改成功', type: 'success'});
            this.$emit('submit');
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        });
      }
    }
  };
</script>

<style scoped>
  .pr-30 {
    padding-right: 30px;
  }
  .display-flex {
    display: flex;
  }
  .justify-content-end {
    justify-content: flex-end;
  }
</style>
