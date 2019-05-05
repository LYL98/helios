<template>
  <div>
    <el-form label-position="right" label-width="110px">
      <el-form-item label="商品数量">{{detail.distinct_item_num}}</el-form-item>
      <el-form-item label="订单数">{{detail.order_num}}</el-form-item>
      <el-form-item label="销售件数">{{detail.sale_num}}</el-form-item>
    </el-form>
    <div class="t-r">
      <el-button @click.native="cancelAllShip">取消</el-button>
      <el-button @click.native="handleAllShip" type="primary">确认发货</el-button>
    </div>
  </div>
</template>

<script>
  import {Row, Col, Button, Form, FormItem} from "element-ui";
  import {Config, DataHandle, Constant} from '@/util';
  import { Group } from '@/service';

  export default {
    name: "OrderDetail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
    },
    props: {
      query: { type: Object, required: true }
    },
    data() {
      return {
        detail: {},
      }
    },
    created() {
      this.groupOrderAllShipTotals();
    },
    methods: {
      // 一键发货
      async handleAllShip() {
        this.$store.dispatch('loading', {isShow: true, isWhole: true});
        let res = await Group.orderAllShip(this.query);
        this.$store.dispatch('loading', {isShow: false});
        if (res.code === 0) {
          this.$store.dispatch('message', {title: '提示', message: '发货成功', type: 'success'});
          this.$emit('callback', 'success');
        } else {
          this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
        }
      },
      //取消一键发货
      cancelAllShip(){
        this.$emit('callback', 'cancel');
      },
      //获取数据
      async groupOrderAllShipTotals(){
        this.$store.dispatch('loading', {isShow: true, isWhole: true});
        let res = await Group.orderAllShipTotals(this.query);
        this.$store.dispatch('loading', {isShow: false});
        if (res.code === 0) {
          this.$data.detail = res.data;
        } else {
          this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
        }
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
