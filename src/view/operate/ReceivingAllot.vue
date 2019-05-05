<template>
  <div class="receiving-allot">
    <el-dialog title="分配到门店" :visible="isShow" width="720px" :before-close="cancelAllot">
      <div style="margin-bottom: 20px;">
        <div style="margin-bottom: 10px;">
        【{{dataItem.city_title}}】
        【{{dataItem.item_code}}&nbsp;{{dataItem.item_title}}】
        </div>
        <span>总下单件数：{{dataItem.order_number}} 件</span>
        <span style="margin-left: 20px;">实收件数：{{dataItem.real_number}} 件</span>
        <span style="margin-left: 20px;" :style="total() !== dataItem.real_number && 'color: #ff5252; font-weight: bold;'">已分配数量：{{total()}} 件</span>
      </div>
      <div class="stores-div">
        <div class="item" v-for="(item, index) in dataItem.store_items" :key="index">
          <div class="title">{{item.store_title}}</div>
          <div class="number">
            <span class="real-number" @click="editNumber(index)">{{item.real_number}}</span>
            <span class="interval">/</span>
            <span class="order-number">{{item.order_number}}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAllot">取 消</el-button>
        <el-button type="primary" @click.native="submitAllot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Form, FormItem, Button, Dialog } from 'element-ui';
import { Config, Constant, DataHandle, Method } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "ReceivingAllot",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-dialog': Dialog,
  },
  computed: mapGetters({
    receivingStoresItem: 'operateReceivingStoresItem',
    isShow: 'operateReceivingIsShowAllot'
  }),
  created() {
    
  },
  data(){
    return {
      dataItem: {
        store_items: []
      },
      editData: {}
    }
  },
  methods: {
    //取消
    cancelAllot(){
      this.operateReceivingShowHideAllot({ isShow: false });
    },
    //总数量
    total(){
      let { dataItem } = this;
      let sum = 0;
      for(let i = 0; i < dataItem.store_items.length; i++){
        sum += dataItem.store_items[i].real_number;
      }
      return sum;
    },
    //修改数量
    editNumber(index){
      let that = this;
      let { dataItem } = that;
      let d = dataItem.store_items[index];
      NumberKey.show({
        num: d.real_number,
        type: 'Number',
        confirm(num){
          d.real_number = num;
          dataItem.store_items[index] = d;
          that.$data.dataItem = dataItem;
        }
      });
    },
    //确认提交
    submitAllot(){
      let that = this;
      let { dataItem } = that;
      if(dataItem.real_number != that.total()){
        that.message({title: '提示', message: '数量分配有误，请重新分配', type: 'error'});
        return false;
      }
      that.operatorReceivingOrderDistribute({
        data: {
          ...dataItem,
          city_item_id: dataItem.id
        },
        callback: (res)=>{
          that.cancelAllot();
        }
      });
    },
    ...mapActions(['operateReceivingShowHideAllot', 'operatorReceivingOrderDistribute', 'message'])
  },
  watch:{
    receivingStoresItem: {
      deep: true,
      handler: function (a, b) {
        this.dataItem = JSON.parse( JSON.stringify( a ) );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .stores-div{
    border-top: 1px solid #f3f4f6;
    font-size: 16px;
    .item{
      display: flex;
      border-bottom: 1px solid #f3f4f6;
      align-items: center;
      .title{
        flex: 1;
        padding: 10px 0;
      }
      .number{
        flex: initial;
        padding: 10px 0;
        >span{
          display: inline-block;
        }
        .real-number{
          border: 1px solid #999;
          border-radius: 3px;
          width: 58px;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
        .interval{
          margin: 0 2px;
        }
      }
    }
  }
</style>
