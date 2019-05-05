<template>
  <div class="receiving-allot">
    <el-dialog :title="`收货：${citiesNumItem.code} ${citiesNumItem.title}`" :visible="isShow" width="720px" :before-close="cancel" :close-on-click-modal="false">
      <div class="city-title">
        <div v-for="(item, index) in dataItem.cities" :key="index">
          <p class="title">{{item.title}}</p>
          <p>实收/应收(件)</p>
        </div>
      </div>
      <div class="city-number">
        <div v-for="(item, index) in citiesNumItem.city_items" :key="index">
          <div v-if="item.order_number">
            <span @click="editNumber(index)" :class="`input ${item.real_number_temp != item.order_number && 'warn'}`">{{item.real_number_temp}}</span>
            <span>/</span>
            <span>{{item.order_number}}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="total f-l">实收/应收总计(件)：
          <span :style="`${subtotal1 !== subtotal2 && 'color: red;font-weight: bold;'}`">{{subtotal1}}</span>
          <span>/</span>
          <span>{{subtotal2}}</span>
        </div>
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Form, FormItem, Button, Dialog } from 'element-ui';
import { Config, Constant, DataHandle, Method } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "ReceivingNumber",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-dialog': Dialog,
  },
  computed: mapGetters({
    isShow: 'operateReceivingIsShowEditNumber',
    dataItem: 'operateReceivingDataItem',
    editNumData: 'operateReceivingEditNumData'
  }),
  created() {
    
  },
  data(){
    return {
      subtotal1: 0, //实收
      subtotal2: 0, //应收
      citiesDataItem: [], // 县数据
      citiesNumItem: {
        city_items: []
      }, //县数量数据
    }
  },
  methods: {
    //取消
    cancel(){
      this.operateReceivingShowHideEditNumber({ isShow: false });
    },
    //修改数量
    editNumber(index){
      let that = this;
      let { citiesNumItem } = that;
      let d = citiesNumItem.city_items[index];
      NumberKey.show({
        num: d.real_number_temp,
        type: 'Number',
        confirm(num){
          d.real_number = num;
          d.real_number_temp = num;
          citiesNumItem.city_items[index] = d;
          that.$data.citiesNumItem = citiesNumItem;
          that.refreshData(citiesNumItem); //计算数据
        }
      });
    },
    //确认提交
    submit(){
      let that = this;
      let { citiesNumItem } = that;
      let d = [];
      citiesNumItem.city_items.map((item)=>{
        if(item.id){
          d.push({
            id: item.id,
            real_number: item.real_number_temp
          });
        }
      });
      that.operatorReceivingDeliveryItemsSubmit({
        data: {
          city_items: d
        },
        callback: ()=>{
          let c = that.$attrs.callback;
          typeof c === 'function' && c(citiesNumItem);//回调
          that.cancel();
        }
      });
    },
    //计算数据
    refreshData(data){
      let that = this;
      let subtotal1 = 0;
      let subtotal2 = 0;
      data.city_items.map((item)=>{

        if(item.real_number === null){
          item.real_number_temp = item.order_number;
        }else{
          item.real_number_temp = item.real_number;
        }

        if(item.real_number_temp){
          subtotal1 += item.real_number_temp;
        }
        if(item.order_number){
          subtotal2 += item.order_number;
        }
      });

      that.subtotal1 = subtotal1;
      that.subtotal2 = subtotal2;

      that.citiesNumItem = data;
    },
    ...mapActions(['operateReceivingShowHideEditNumber', 'operatorReceivingDeliveryItemsSubmit'])
  },
  watch:{
    editNumData: {
      deep: true,
      handler: function (a, b) {
        let that = this;
        if(a){
          let d = JSON.parse( JSON.stringify(a));
          that.citiesDataItem = d;
          that.refreshData(d); //计算数据
        }else{
          that.citiesDataItem = {};
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .city-title{
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 15px;
    >div{
      flex: 1;
      .title{
        font-size: 18px;
      }
    }
  }
  .city-number{
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
    font-size: 18px;
    >div{
      flex: 1;
      span{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        border: 1px solid #fff;
        &.input{
          border: 1px solid #999;
          width: 64px;
          border-radius: 3px;
        }
        &.warn{
          color: red;
          border: 1px solid red;
          font-weight: bold;
        }
      }
    }
  }
  .total{
    font-size: 18px;
    margin-top: 10px;
  }
</style>
