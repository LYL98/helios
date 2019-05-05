<template>
  <div class="operate-receiving">
    <!-- 头部start -->
    <div class="query">
      <my-collapse-query @expandChange="onExpandChange">
        <template slot="header">
          <el-row >
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '日期'">
                <el-date-picker
                  v-model="query.opt_date"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :editable="false"
                  placeholder="请选择日期"
                  class="query-item-date"
                  @change="operatorReceivingDeliveryItems(query)"
                ></el-date-picker>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '线路'">
                <my-select-line-query
                  :provinceCode="province.code"
                  size="small"
                  :isUseToQuery="true"
                  :clearable="false"
                  v-model="query.line_code"
                  @change="operatorReceivingDeliveryItems(query)"
                />
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '收货状态'">
                <!--<el-radio-group v-model="query.is_receiving" size="mini" style="position: relative; top: -1px;" @change="refreshData(receivingDataItem)">-->
                  <!--<el-radio-button label="">全部</el-radio-button>-->
                  <!--<el-radio-button :label="false">未收货</el-radio-button>-->
                  <!--<el-radio-button :label="true">已收货</el-radio-button>-->
                <!--</el-radio-group>-->
                <my-button-group
                  :options="{'全部': '', '未收货': false, '已收货': true}"
                  v-model="query.is_receiving"
                  @change="refreshData(receivingDataItem)"
                  size="small"
                />
              </my-query-item>
            </el-col>
          </el-row>
        </template>
        <template slot="expand">
          <el-row style="margin-top: 16px">
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '缺货状态'">
                <!--<el-radio-group v-model="query.is_stockout" size="mini" style="position: relative; top: -1px;" @change="refreshData(receivingDataItem)">-->
                  <!--<el-radio-button label="">全部</el-radio-button>-->
                  <!--<el-radio-button :label="true">缺货商品</el-radio-button>-->
                <!--</el-radio-group>-->

                <my-button-group
                  :options="{'全部': '', '缺货商品': true}"
                  v-model="query.is_stockout"
                  @change="refreshData(receivingDataItem)"
                  size="small"
                />
              </my-query-item>
            </el-col>
          </el-row>
        </template>
      </my-collapse-query>
    </div>
    <!-- 头部end -->
    <!-- 表格start -->
    <el-table :data="dataList" stripe style="width: 100%; margin-top: 16px;" size="mini" :height="windowHeight - offsetHeight" ref="myTable" :row-key="returnTableKey">
      <el-table-column prop="name" label="商品" width="160">
        <template slot-scope="scope">
          <div style="font-size: 13px;">
            <span>{{scope.row.code}}</span>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="小计" width="110">
        <el-table-column prop="name" label="实收/应收(件)" width="110">
          <template slot-scope="scope">
            <div class="county">
              <span :style="`${scope.row.subtotal1!=scope.row.subtotal2 && 'color:red;font-weight: bold;'}`">{{scope.row.subtotal1}}</span>
              <span>/</span>
              <span>{{scope.row.subtotal2}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="item.title" v-for="(item, index) in dataItem.cities" :key="index" width="110">
        <el-table-column prop="name" label="实收/应收(件)" width="110">
          <template slot-scope="scope">
            <div v-if="scope.row.city_items[index] && scope.row.city_items[index].order_number">
              <div class="county">
                <span :class="{
                  'warn': scope.row.city_items[index].real_number !==null && scope.row.city_items[index].order_number !== scope.row.city_items[index].real_number}">
                    {{scope.row.city_items[index].real_number}}
                  </span>
                <span>/</span>
                <span>{{scope.row.city_items[index].order_number}}</span>
                <span class="f-r allot-btn" v-if="(auth.isAdmin || auth.OperateReceivingAllot) && !dataItem.is_all_line_checked && scope.row.city_items[index].is_show_allot">
                  <a href="javascript:void(0);" style="font-size: 12px;" @click="operateReceivingShowHideAllot({
                    isShow: true,
                    data: scope.row,
                    index: index
                  })">分配</a>
                </span>
              </div>
            </div>
            <div v-else>&nbsp;</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <!--已审核 checked -->
          <span v-if="scope.row.status === 'checked'" style="font-size: 12px;">已审核</span>
          <!--收货 receiving-->
          <el-button size="mini" type="primary" v-else-if="(auth.isAdmin || auth.OperateReceivingAdd) &&  scope.row.status === 'receiving'" @click.native="operateReceivingShowHideEditNumber({
            isShow: true,
            data: scope.row
          })">收货</el-button>
          <!--修改 update-->
          <el-button size="mini" v-else-if="(auth.isAdmin || auth.OperateReceivingEdit) && scope.row.status === 'update'" @click.native="operateReceivingShowHideEditNumber({
            isShow: true,
            data: scope.row
          })">修改</el-button>
          <!--已收货没有修改权限 -->
          <span v-else>已收货</span>
          <!--称重 receiving-->
          <el-button size="mini" @click.native="goWeigh(scope.row)" v-if="(auth.isAdmin || auth.OperateReceivingWeight) && scope.row.is_show_weigh">称重</el-button>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="1"/>
    </el-table>
    <!-- 表格end -->

    <div class="bottom">
      <div class="left">
        <span>实收/应收总计（件）：</span>
        <span :style="`${dataItem.total1 != dataItem.total2 && 'color:red;font-weight: bold;'}`">{{dataItem.total1}}</span>
        <span>/</span>
        <span>{{dataItem.total2}}</span>
      </div>
      <div class="right t-r">
        <span v-if="dataItem.dataListLength === 0"></span>
        <el-button type="primary" @click.native="showAudit" v-else-if="!dataItem.is_all_line_checked">审核预览</el-button>
        <el-button @click.native="showAudit" v-else-if="dataItem.is_all_line_checked">已审核</el-button>
      </div>
    </div>
    <my-receiving-allot />
    <my-receiving-number :callback="myCallback" />
    <my-receiving-weigh />

    <!--确认审核start-->
    <el-dialog title="审核预览" :visible="isShowAudit" width="720px" :before-close="cancelAudit">
      <div v-if="checkData.length > 0">
        <div style="margin-bottom: 10px; color: red;">注：以下为异常的商品</div>
        <el-table :data="checkData" :row-class-name="highlightRowClassName" style="width: 100%" size="mini">
          <el-table-column label="商品">
            <template slot-scope="scope">
              <span style="font-weight:bold;">{{scope.row.item_code}}</span>
              <span>{{scope.row.item_title}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户" prop="store_title">
          </el-table-column>
          <el-table-column label="实收/应收(件)" width="110">
            <template slot-scope="scope">
              <span>{{scope.row.real_number}}</span>
              <span>/</span>
              <span>{{scope.row.order_number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="实重/应重(斤)" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.is_weigh">
                <span>{{returnWeight(scope.row.real_weight)}}</span>
                <span>/</span>
                <span>{{returnWeight(scope.row.order_weight)}}</span>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else style="font-size: 30px; margin-left: 60px; color: #999;">
        无异常商品
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAudit">关 闭</el-button>
        <el-button v-if="(auth.isAdmin || auth.OperateReceivingAudit) && !dataItem.is_all_line_checked" type="primary" @click.native="submitAudit">审核通过</el-button>
      </span>
    </el-dialog>
    <!--确认审核end-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Row, Col, DatePicker, MessageBox, Button, Table, TableColumn, RadioGroup, RadioButton, Dialog } from 'element-ui';
import { QueryItem, CollapseQuery, ButtonGroup, SelectLineQuery } from '@/common';
import { Operate } from '@/service';
import { DataHandle, Constant } from '@/util';
import ReceivingAllot from './ReceivingAllot';
import ReceivingNumber from './ReceivingNumber';
import ReceivingWeigh from './ReceivingWeigh';

export default {
  name: "Receiving",
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-date-picker': DatePicker,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-dialog': Dialog,
    'my-select-line-query': SelectLineQuery,
    'my-receiving-allot': ReceivingAllot,
    'my-receiving-number': ReceivingNumber,
    'my-receiving-weigh': ReceivingWeigh,
    'my-query-item': QueryItem,
    'my-button-group': ButtonGroup,
    'my-collapse-query': CollapseQuery
  },
  computed: {
    ...mapGetters({
      auth: 'globalAuth',
      windowHeight: 'windowHeight',
      province: 'globalProvince',
      receivingDataItem: 'operateReceivingDataItem'
    }),
    isPad: {
      get() {
        return navigator.userAgent.indexOf('Android') > 0 || navigator.userAgent.indexOf('iPad') > 0;
      }
    }
  },
  created() {
    documentTitle('配送 - 收货');
  },
  data(){
    let d = DataHandle.returnDateStr();
    let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
    return {
      isShowAudit: false,
      query: {
        opt_date: nowDate,
        line_code: '',
        is_receiving: '',
        is_stockout: ''
      },
      isExpand: false,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + 48,
      dataItem: {
        cities: []
      },
      dataList: [], //列表数据
      checkData: []
    }
  },
  methods: {
    onExpandChange(isExpand) {
      if (isExpand) {
        this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
      } else {
        this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
      }
      this.isExpand = isExpand;
    },

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'stripe-row';
      } else if (rowIndex % 2 != 0) {
        return 'default-row'
      }
      return '';
    },
    //返回tabile key
    returnTableKey(d){
      return d.item_id;
    },
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //回调
    myCallback(data){
      let that = this;
      let { auth } = that;
      that.operatorReceivingDeliveryItems(that.query);
      //如果编辑的是称重商品
      if(data.is_weigh && (auth.isAdmin || auth.OperateReceivingWeight) ){
        MessageBox.confirm('收货成功，是否去称重？', '商品：' + data.code + ' ' + data.title, {
          confirmButtonText: '去称重',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.goWeigh(data);
        })
        .catch(() => {
          //console.log('取消');
        });
      }
    },
    //计算数据
    refreshData(data){
      let that = this;
      let total1 = '',
          total2 = '',
          isAllLineChecked = true, //整条线路是否已审核
          dataTemp = {
            cities: data.cities
          };
      let itemsTemp = []; //保存items

      data.items.map((item)=>{
        let t1 = '', //空代表未收货
            t2 = '', //空代表未收货
            isAllChecked = true, //是否全部审核
            isAllUpdated = true; //是否全部已修改

        item.city_items.map((ci, i)=>{
          if(ci.id && !ci.is_checked){
            isAllChecked = false;
          }
          if(ci.id && !ci.is_updated){
            isAllUpdated = false;
          }
          if(ci.real_number || ci.real_number === 0){
            t1 = Number(t1) + ci.real_number;
          }
          if(ci.order_number){
            t2 = Number(t2) + ci.order_number;
          }
          //判断是否显示【分配到门店】
          if(ci.id){
            ci.is_show_allot = ci.real_number !== null && ci.real_number > 0 && ci.order_number !== ci.real_number ? true : false;
          }
        });

        //判断sku，设置状态（status：checked已审核、receiving收货、update修改.）
        let status = 'receiving';
        if(isAllChecked){
          status = 'checked';
        }else if(isAllUpdated){
          status = 'update';
        }

        //是否显示称重按钮
        item.is_show_weigh = false;
        if(item.is_weigh && (status === 'update' || status === 'checked')){
          item.is_show_weigh = true;
        }

        //是否缺货
        item.is_stockout = false;
        if(t1 !== '' && t1 !== t2){
          item.is_stockout = true;
        }

        item.status = status;
        item.subtotal1 = t1;
        item.subtotal2 = t2;

        //整条线路是否已审核
        if(item.status !== 'checked'){
          isAllLineChecked = false;
        }

        //加入数据列表
        let fun = () => {
          total1 = Number(total1) + t1;
          total2 = Number(total2) + t2;
          itemsTemp.push(item);
        }

        //筛选条件
        let { query } = that;
        if(
          //判断是否收货条件
          (query.is_receiving === '' ||
          (query.is_receiving === true && item.status === 'update') ||
          (query.is_receiving === false && item.status === 'receiving'))
          //且
          &&
          //判断是否缺货
          (query.is_stockout === '' || (query.is_stockout === true && item.is_stockout))
        ){
          fun();
        }

      });

      dataTemp.total1 = total1;
      dataTemp.total2 = total2;
      dataTemp.is_all_line_checked = isAllLineChecked;
      dataTemp.dataListLength = itemsTemp.length;

      that.$data.dataItem = Object.freeze(dataTemp); //保存一般数据 //加 Object.freeze 不对list里的object做getter、setter绑定

      //分段式渲染（20条）
      let page = 1, pageSize = 20, num = itemsTemp.length, dataList = [];
      let funTemp = (data) => {
        dataList = data;
        that.$data.dataList = Object.freeze(data);
        that.$nextTick(()=>{
          setTimeout(()=>{
            if(num / pageSize > page){
              dataList = dataList.concat(itemsTemp.slice(page * pageSize, page * pageSize + pageSize)); //拼接数据
              funTemp(dataList);
              page++;
            }
          }, 0);
        });
      }

      funTemp(itemsTemp.slice(0, pageSize));
    },
    //去称重
    goWeigh(data){
      let that = this;
      let { query, dataItem } = that;
      let cityCodes = [];

      dataItem.cities.map((item)=>{
        cityCodes.push(item.code);
      });

      this.operateReceivingShowWeigh({
        isShow: true,
        data: {
          item_id: data.id,
          city_codes: cityCodes,
          opt_date: query.opt_date
        }
      });
    },
    //显示审核
    showAudit(){
      this.deliveryPreCheck();
    },
    //取消审核
    cancelAudit(){
      this.$data.isShowAudit = false;
    },
    //获取审核详情
    async deliveryPreCheck(){
      let that = this;
      let { query, dataItem } = that;
      let cityCodes = [];
      dataItem.cities.map((item)=>{
        cityCodes.push(item.code);
      });

      that.loading({isShow: true, isWhole: true});
      let res = await Operate.deliveryPreCheck({
        opt_date: query.opt_date,
        city_codes: cityCodes.join()
      });
      if(res.code === 0){
        let rd = res.data;
        //分段式渲染（20条）
        let page = 1, pageSize = 20, num = rd.length, dataList = [];
        let funTemp = (data) => {
          dataList = data;
          that.$data.checkData = Object.freeze(data);
          that.$nextTick(()=>{
            setTimeout(()=>{
              if(num / pageSize > page){
                dataList = dataList.concat(rd.slice(page * pageSize, page * pageSize + pageSize)); //拼接数据
                funTemp(dataList);
                page++;
              }
            }, 0);
          });
        }

        funTemp(rd.slice(0, pageSize));
        that.$data.isShowAudit = true;

      }else{
        that.message({title: '提示', message: res.message, type: 'error'});
      }
      that.loading({isShow: false});
    },
    //提交审核
    submitAudit(){
      let that = this;
      let { query, dataItem } = that;
      let cityCodes = [];

      dataItem.cities.map((item)=>{
        cityCodes.push(item.code);
      });

      that.operatorReceivingCheck({
        data: {
          opt_date: query.opt_date,
          city_codes: cityCodes
        },
        callback: ()=>{
          that.cancelAudit();
          that.operatorReceivingDeliveryItems(query);
        }
      });
    },
    ...mapActions([ 'operateReceivingShowHideAllot', 'operateReceivingShowHideEditNumber', 'operatorReceivingDeliveryItems', 'operatorReceivingCheck', 'operateReceivingShowWeigh','message', 'loading'])
  },
  watch:{
    receivingDataItem: {
      deep: true,
      handler: function (a, b) {
        this.refreshData(a); //计算数据
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .operate-receiving {
    .is-group {
      tr {
        th {
          background-color: #fff;
        }
      }
    }
    .county{
      text-align: center;
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
      height: 48px;
      line-height: 58px;
      overflow: hidden;
      padding: 0 10px;
      .left{
        font-size: 18px;
        flex: 1;
      }
    }
  }


</style>
