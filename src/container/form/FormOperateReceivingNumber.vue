<template>
  <div class="receiving-allot">
    <el-dialog :title="`收货：${citiesNumItem.code} ${citiesNumItem.title}`" :visible="isShow" width="720px" :before-close="handleCancel" :close-on-click-modal="false">
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
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "FormOperateReceivingNumber",
  mixins: [formMixin],
  components: {
  },
  created() {
  },
  data(){
    return {
      initDetail: {},
      subtotal1: 0, //实收
      subtotal2: 0, //应收
      citiesDataItem: [], // 县数据
      citiesNumItem: {
        city_items: []
      }, //县数量数据
      dataItem: {
        cities: []
      },
    }
  },
  methods: {
    //显示form(重写)
    showForm(res){
      let d = {};
      if(res && res.data){
        d = JSON.parse(JSON.stringify(res.data));
        this.$data.dataItem = res.dataItem;
      }
      this.$data.citiesDataItem = d;
      this.refreshData(d);
      this.$data.isShow = true;
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
    async submit(){
      let that = this;
      let { citiesNumItem } = this;
      let d = [];
      citiesNumItem.city_items.map((item)=>{
        if(item.id){
          d.push({
            id: item.id,
            real_number: item.real_number_temp
          });
        }
      });
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.orderDeliveryItemsSubmit, {
        city_items: d
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.handleCancel();
        //刷新数据
        let pc = this.getPageComponents('TableOperateReceiving');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //计算数据
    refreshData(data){
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

      this.subtotal1 = subtotal1;
      this.subtotal2 = subtotal2;

      this.citiesNumItem = data;
    }
  },
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
