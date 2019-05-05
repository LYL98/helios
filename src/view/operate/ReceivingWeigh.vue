<template>
  <div>
    <el-dialog title="称重" :visible="isShow" class="my-dialog" :before-close="closePage">
      <!-- 头部start -->
      <div class="form-search" style="margin-bottom: 0;padding-top: 0;">
        <div>
          <el-radio-group size="mini" v-model="veidooType" @change="changeVeidooType" style="margin-right: 15px;">
            <el-radio-button label="item">以商品展示</el-radio-button>
            <el-radio-button label="store">以客户展示</el-radio-button>
          </el-radio-group>
          <el-radio-group size="mini" v-model="isWeigh" @change="changeIsWeigh">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="true">只显示需称重商品</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 头部end -->

      <!--===============内容start====================-->
      <div class="receiving-div">
        <div class="left" :style="`height:${windowHeight - 184}px`" id="receiving-weight-body">
          <!--以客户为维度start-->
          <div class="content" v-if="veidooType === 'store'" id="receiving-weight-div">
            <a href="javascript:void(0);"
              v-for="(item, index) in storeItem" :key="index"
              :class="`add-dot ${selectStoreId === item.store_id && 'active'}`"
              @click="selectStore(item.store_id)">{{item.store_title}}</a>
          </div>
          <!--以客户为维度end-->
          <!--以商品为维度start-->
          <div class="content" v-else id="receiving-weight-div">
            <a href="javascript:void(0);"
              v-for="(item, index) in itemsItem" :key="index"
              :class="`add-dot ${selectItemId === item.item_id && 'active'}`"
              @click="selectItemList(item.item_id)" v-if="isWeigh === '' || (isWeigh && item.is_weigh)">
                <span style="font-weight: bold;">{{item.item_code}}</span>
                <span>{{item.item_title}}</span>
              </a>
          </div>
          <!--以商品为维度end-->
        </div>
        <div class="interval"></div>
        <div class="right">
          <!-- 表格start -->
          <el-table :data="dataItem" style="width: 100%" :row-class-name="highlightRowClassName" size="mini" :height="windowHeight - 184" ref="myTable">
            <!--============start===========-->
            <el-table-column label="商品" v-if="veidooType === 'store'">
              <template slot-scope="scope">
                <div class="add-dot" style="font-size: 16px;">
                  <span style="font-weight: bold;">{{scope.row.item_code}}</span>
                  <span>{{scope.row.item_title}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户" v-else>
              <template slot-scope="scope">
                <div class="add-dot" style="font-size: 16px;">{{scope.row.store_title}}</div>
              </template>
            </el-table-column>
            <!--============end===========-->
            <el-table-column label="实收/应收(件)" width="140">
              <template slot-scope="scope">
                <div class="county">
                  <span :class="`${scope.row.order_number !== scope.row.real_number && 'warn'}`">{{scope.row.real_number}}</span>
                  <span>/</span>
                  <span>{{scope.row.order_number}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实重/应重(斤)" width="140">
              <template slot-scope="scope">
                <div class="county" v-if="scope.row.is_weigh">
                  <span :class="`${isWeighWarn(scope.row) && 'warn'}`">{{scope.row.real_weight === null ? '' : returnWeight(scope.row.real_weight)}}</span>
                  <span>/</span>
                  <span>{{returnWeight(scope.row.order_weight)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="74">
              <template slot-scope="scope">
                <!--不称重 -->
                <div v-if="!scope.row.is_weigh">不称重</div>
                <!--已审核 -->
                <div v-else-if="scope.row.is_checked">已审核</div>
                <!--待收货 -->
                <div v-else-if="!scope.row.real_number">待收货</div>
                <!--称重 weigh-->
                <el-button size="mini" type="primary" v-else-if="!scope.row.is_updated" @click.native="operateReceivingWeighShowHideEdit({
                  isShow: true,
                  data: scope.row
                })">称重</el-button>
                <!--修改 update-->
                <el-button size="mini" v-else-if="scope.row.is_updated" @click.native="operateReceivingWeighShowHideEdit({
                  isShow: true,
                  data: scope.row
                })">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表格end -->
        </div>
      </div>
      <!--===============内容end====================-->

      <div class="bottom">
        <div class="left">
          <span>
            <font>实收/应收(件)：</font>
            <font :style="`${total1 !== total2 && 'color:red; font-weight: bold;'};`">{{total1}}</font>
            <font>/</font>
            <font>{{total2}}</font>
          </span>
          <span>
            <font>实重/应重(斤)：</font>
            <font :style="`${weight1 !== weight2 && 'color:red; font-weight: bold;'}`">{{returnWeight(weight1)}}</font>
            <font>/</font>
            <font>{{returnWeight(weight2)}}</font>
          </span>
        </div>
        <div class="right t-r">
          <el-button @click.native="closePage">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <my-receiving-edit-weigh :callback="myCallback" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { MessageBox, Button, RadioGroup, RadioButton, Table, TableColumn, Dialog } from 'element-ui';
import { Config, Constant, DataHandle } from '@/util';
import { Operate } from '@/service';
import { NumberKey } from '@/common';
import ReceivingEditWeigh from './ReceivingEditWeigh';

export default {
  name: "ReceivingWeigh",
  components: {
    'el-button': Button,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-dialog': Dialog,
    'my-receiving-edit-weigh': ReceivingEditWeigh
  },
  computed: mapGetters({
    auth: 'globalAuth',
    windowHeight: 'windowHeight',
    optData: 'operateReceivingOptData',
    isShow: 'operateReceivingIsShowWeigh',
    storeItem: 'operateReceivingWeighStoreItem',
    itemsItem: 'operateReceivingWeighItemsItem',
    weighDataItem: 'operateReceivingWeighDataItem'
  }),
  data(){
    return {
      weightScope: Constant.WEIGHT_SCOPE,//重量浮动范围
      total1: 0,
      total2: 0,
      weight1: 0,
      weight2: 0,
      veidooType: 'item',
      isWeigh: true,
      selectStoreId: 0,
      selectItemId: 0,
      dataItem: [],
    }
  },
  methods: {

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'stripe-row';
      } else if (rowIndex % 2 != 0) {
        return 'default-row'
      }
      return '';
    },
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },
    //重量是否异常
    isWeighWarn(data){
      let that = this;
      if(data.real_weight === null){
        return false;
      }
      if(data.real_weight > data.order_weight * (1 + that.weightScope)){
        return true;
      }
      if(data.real_weight < data.order_weight * (1 - that.weightScope)){
        return true;
      }
      return false;
    },
    //关闭称重页
    closePage(){
      this.$data.veidooType = 'item'; //默认
      this.$data.isWeigh = true; //默认
      this.$data.dataItem = []; //默认
      this.operateReceivingShowWeigh({
        isShow: false
      });
    },

    //回调
    myCallback(){
      this.getData();
    },

    //滚动到可视区
    scrollToView(){
      setTimeout(()=>{
        let db = document.getElementById('receiving-weight-body');
        let d = document.getElementById('receiving-weight-div');
        let h = d.style.height; //div高度
        let sh = db.scrollHeight; //滚动条高度
        let ch = d.children; //子节点
        let len = ch.length; //子节点数量
        let index = ''; //当前选择项
        for(let i = 0; i < ch.length; i++){
          if(ch[i].className.indexOf('active') >= 0){
            index = i;
            break;
          }
        }
        if(index !== '') db.scrollTo(0, index * 42);
      }, 0);
    },
    
    //切换维度
    changeVeidooType(){
      let { veidooType } = this;
      this.getData();//获取数据
      if(veidooType === 'item'){
        this.scrollToView(); //滚动到可视区
      }
    },
    //切换是否称重
    changeIsWeigh(){
      let { weighDataItem } = this;
      this.refreshData(weighDataItem);
      this.scrollToView();
    },
    //选择商户
    selectStore(id){
      this.$data.selectStoreId = id;
      this.getData(); //获取数据
    },
    //选择商品
    selectItemList(id){
      this.$data.selectItemId = id;
      this.getData(); //获取数据
    },
    //获取数据
    getData(){
      let that = this;
      let { veidooType, optData, selectStoreId, selectItemId } = that;
      let query = veidooType === 'store' ? {
        city_codes: optData.city_codes,
        opt_date: optData.opt_date,
        store_id: selectStoreId
      } : {
        city_codes: optData.city_codes,
        opt_date: optData.opt_date,
        item_id: selectItemId
      };

      that.operatorReceivingWeighStoreItems(query);
    },

    //提交称重数据
    async orderDeliveryWeightData(selectStoreId, selectItemId, realWeight, callback){
      let that = this;
      that.loading({isShow: true, isWhole: true});
      let { query } = that;
      let res = await Operate.orderDeliveryWeightData({
        ...query,
        store_id: selectStoreId,
        item_code: selectItemId,
        real_weight: realWeight
      });
      if(res.code === 0){
        typeof callback === 'function' && callback();
      }else{
        that.message({title: '提示', message: res.message, type: 'error'});
      }
      that.loading({isShow: false});
    },
    //计算数据
    refreshData(data){
      let that = this;
      let total1 = 0, 
          total2 = 0,
          weigh1 = 0,
          weigh2 = 0,
          isAllLineChecked = true, //整条线路是否已审核
          dataTemp = [];

      data.map((item)=>{
        //加入数据列表
        let fun = () => {
          total1 += item.real_number;
          total2 += item.order_number;
          weigh1 += item.real_weight;
          weigh2 += item.order_weight;
          dataTemp.push(item);
        }

        //筛选条件
        let { isWeigh } = that;
        if(isWeigh === '' || (isWeigh === true && item.is_weigh)){
          fun();
        }

      });

      that.$data.total1 = total1;
      that.$data.total2 = total2;
      that.$data.weight1 = weigh1;
      that.$data.weight2 = weigh2;
      that.$data.dataItem = dataTemp;
    },
    ...mapActions(['operateReceivingShowWeigh', 'operatorReceivingWeighStoreItems', 'operateReceivingWeighShowHideEdit', 'message', 'loading'])
    
  },
  watch:{
    //监听数据列表
    weighDataItem: {
      deep: true,
      handler: function (a, b) {
        let d = JSON.parse( JSON.stringify(a));
        this.refreshData(d); //计算数据
      }
    },
    //监听客户列表
    storeItem: {
      deep: true,
      handler: function (a, b) {
        if(a.length > 0){
          this.selectStoreId = a[0].store_id;
        }
      }
    },
    //监听商品列表
    itemsItem: {
      deep: true,
      handler: function (a, b) {
        if(a.length > 0){
          this.selectItemId = this.optData.item_id;
          this.scrollToView(); //滚动到可视区
          this.getData(); //获取数据
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .receiving-div{
    display: flex;
    .left{
      width: 220px;
      flex: initial;
      overflow-y: auto;
      .content{
        a{
          display: block;
          color: #333;
          padding: 0 10px;
          height: 42px;
          line-height: 42px;
          &.active{
            background-color: #ccc;
          }
        }
      }
    }
    .interval{
      flex: initial;
      width: 10px;
    }
    .right{
      flex: 1;
      overflow: hidden;
    }
  }

  .county{
    font-size: 16px;
    >span{
      &.warn{
        color: red;
        font-weight: bold;
      }
    }
  }

  .bottom{
    display: flex;
    display: -webkit-box; display: -webkit-flex;
    height: 48px;
    line-height: 48px;
    overflow: hidden;
    .left{
      font-size: 16px;
      flex: 1;
      span{
        margin-right: 20px;
      }
    }
  }
  
</style>
