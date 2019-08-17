<template>
  <div>
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
                  <a href="javascript:void(0);" style="font-size: 12px;" @click="handleShowForm('FormOperateReceivingAllot', scope.row.city_items[index])">分配</a>
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
          <el-button size="mini" type="primary" v-else-if="(auth.isAdmin || auth.OperateReceivingAdd) &&  scope.row.status === 'receiving'" @click.native="handleShowForm('FormOperateReceivingNumber', scope.row)">收货</el-button>
          <!--修改 update-->
          <el-button size="mini" v-else-if="(auth.isAdmin || auth.OperateReceivingEdit) && scope.row.status === 'update'" @click.native="handleShowForm('FormOperateReceivingNumber', scope.row)">修改</el-button>
          <!--已收货没有修改权限 -->
          <span v-else>已收货</span>
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
        <el-button type="primary" @click.native="handleShowDetail('DetailOperateReceivingAudit', { query, dataItem })" v-else-if="!dataItem.is_all_line_checked">审核预览</el-button>
        <el-button @click.native="handleShowDetail('DetailOperateReceivingAudit', { query, dataItem })" v-else-if="dataItem.is_all_line_checked">已审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableOperateReceiving',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      //let pc = this.getPageComponents('QueryOperateReceiving'); //获取query组件
      //this.getData(pc.query);
    },
    computed: {
      isPad: {
        get() {
          return navigator.userAgent.indexOf('Android') > 0 || navigator.userAgent.indexOf('iPad') > 0;
        }
      }
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + 48,
        dataItem: {
          cities: []
        },
        dataList: [], //列表数据
        checkData: []
      }
    },
    methods: {
      //搜索条件展开隐藏
      onExpandChange(isExpand) {
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
        }
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.orderDeliveryItems, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.refreshData(res.data);
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //返回tabile key
      returnTableKey(d){
        return d.item_id;
      },
      //计算数据
      refreshData(data, q){
        if(q) this.$data.query = q; //赋值，minxin用
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import './table.scss';
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
