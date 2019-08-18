<template>
  <div class="receiving-allot">
    <el-dialog title="分配到门店" :visible="isShow" width="720px" :before-close="handleCancel">
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
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="submitAllot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formMixin from './form.mixin';
import { Config, Constant, DataHandle } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "ReceivingAllot",
  mixins: [formMixin],
  components: {
  },
  created() {
    
  },
  data(){
    return {
      initDetail: {},
      dataItem: {
        store_items: []
      },
      editData: {}
    }
  },
  methods: {
    //显示form(重写)
    showForm(data){
      this.operatorOrderDistributeStores(data);
    },
    //获取分配到门店列表
    async operatorOrderDistributeStores(data, index){
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.operatorOrderDistributeStores, {
        city_item_id: data.id
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.dataItem = rd.data;
        this.$data.isShow = true;
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
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
    async submitAllot(){
      let that = this;
      let { dataItem } = that;
      if(dataItem.real_number != that.total()){
        this.$message({title: '提示', message: '数量分配有误，请重新分配', type: 'error'});
        return false;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.operatorOrderDistribute, {
        ...dataItem,
        city_item_id: dataItem.id
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
