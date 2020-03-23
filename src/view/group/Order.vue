<template>
  <sub-menu>
    <order-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="orderList" :show-detail="showItemDetail"></order-list>
    <el-dialog title="订单详情" width="1200px" :visible.sync="isShowDetail" :before-close="closeItemDetail">
      <order-detail :detail="itemDetail" v-if="isShowDetail"></order-detail>
      <span slot="footer">
        <el-button @click.native="closeItemDetail">关 闭</el-button>
      </span>
    </el-dialog>
  </sub-menu>
</template>

<script>
  import { Dialog, Button } from 'element-ui';
  import OrderList from './OrderList';
  import OrderDetail from './OrderDetail';
  import { Http, Config } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Order",
    mixins: [mainMixin],
    components: {
      'el-dialog': Dialog,
      'el-button': Button,
      'order-list': OrderList,
      'order-detail': OrderDetail
    },
    data() {
      return {
        isShowDetail: false,
        itemDetail: {
          order_items: []
        }
      }
    },
    created() {
      documentTitle('团购 - 订单列表');
    },
    methods: {
      async showItemDetail(id) {
        let res = await Http.get(Config.api.groupOrderDetail, { id: id });
        if (res.code === 0) {
          this.$data.itemDetail = res.data;
          this.$data.isShowDetail = true;
        }
      },
      closeItemDetail() {
        this.$data.isShowDetail = false;
      }
    }
  }
</script>

<style scoped>

</style>
