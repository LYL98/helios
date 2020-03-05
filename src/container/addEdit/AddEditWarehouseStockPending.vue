<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="inventoryData" :rules="rules" ref="ruleForm">
        <div class="f-r" style="position: relative; right: -84px;">
          <el-tag size="small" :type="inventoryStatusType[detail.status]" disable-transitions>
            {{inventoryStatus[detail.status]}}
          </el-tag>
        </div>
        <!--采购、详情-->
        <el-row v-if="judgeOrs(pageType, ['add_pur', 'detail_pur'])">
          <h6 class="subtitle">采购信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="采购单号">{{detail.batch_code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期">{{detail.relate_order.order_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到货">{{detail.relate_order.estimate_arrive_at}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">{{detail.relate_order.num}}件</el-form-item>
          </el-col>
        </el-row>

        <!--调拨、详情-->
        <el-row v-else-if="judgeOrs(pageType, ['add_distribute', 'detail_distribute'])">
          <h6 class="subtitle">调拨信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="调拨单号">{{detail.batch_code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调出仓">{{detail.storehouse.title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨数量">{{detail.relate_order.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可售日期">{{detail.relate_order.available_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到货">{{detail.relate_order.estimate_arrive_at}}</el-form-item>
          </el-col>
        </el-row>

        <!--场地入库-->
        <el-row v-else-if="judgeOrs(pageType, ['add_allocate', 'detail_allocate', 'add_refund', 'detail_refund'])">
          <h6 class="subtitle">商品信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-row>

        <!--入库信息详情-->
        <template v-if="judgeOrs(pageType, ['detail_pur', 'detail_distribute', 'detail_allocate', 'detail_refund'])">
          <el-row>
            <h6 class="subtitle">入库信息</h6>
            <el-col :span="12">
              <el-form-item label="入库单号">{{detail.code}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到货数量">{{detail.num_arrive}}件</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合格数量">{{detail.num}}件</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产日期">{{detail.produce_date}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保质期">{{detail.shelf_life}}天</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存期">{{detail.stock_life}}天</el-form-item>
            </el-col>
          </el-row>
          <template v-if="detail.un_qa_num && detail.in_type === 'distribute'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="不合格数量">{{detail.un_qa_num}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理类型">{{supOptTypes[detail.un_qa_type]}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理金额">&yen;{{returnPrice(detail.un_qa_amount)}}</el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备注">{{detail.remark || '-'}}</el-form-item>
          </template>
          <el-row v-if="pageType !== 'detail_allocate' || pageType !== 'detail_refund'">
            <el-col :span="12">
              <el-form-item label="品控人">{{detail.creator.realname || '系统'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品控时间">{{detail.created}}</el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="入库数量" v-if="detail.num_in">{{detail.num_in}}件</el-form-item>
          <el-row v-for="(item, index) in detail.trays" :key="index">
            <el-col :span="12">
              <el-form-item label="上架">
                {{item.storehouse.title}}/{{item.warehouse.title}}/{{item.tray.code}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上架数量">{{item.num}}件</el-form-item>
            </el-col>
          </el-row>
          
          <el-row v-if="detail.ware_monitor.id">
            <el-col :span="12">
              <el-form-item label="入库人">{{detail.ware_monitor.realname || '系统'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库时间">{{detail.trays.length > 0 ? detail.trays[0].created : '-'}}</el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="judgeOrs(pageType, ['add_pur', 'add_distribute', 'add_allocate', 'add_refund'])">
          <el-form-item label="合格数量">{{detail.num}}件</el-form-item>
          <h6 class="subtitle">入库信息</h6>
          <!--全国仓-->
          <el-form-item label="提示" v-if="selectStorehouseData.province_code === 'nationwide'">全国仓确认入库后，商品直接入库到临时库</el-form-item>
          <!--否则-->
          <el-form-item label="提示" v-else>入库同时可以上架到托盘，不上架的商品将直接入库到临时库</el-form-item>
          <el-row v-for="(item, index) in inventoryData.trays" :key="index">
            <el-col :span="10">
              <el-form-item label="上架" class="is-required">
                <cascader-warehouse-tray v-if="isShow" size="medium" v-model="item.ids" :storehouseId="selectStorehouseData.id" @change="(value) => changeTray(value, index)"/>
                <div v-if="item.ids_error" class="el-form-item__error">{{item.ids_error}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="上架数量" class="is-required">
                <input-number size="medium" v-model="item.num" unit="件" @change="inputNumChange(index)"/>
                <div v-if="item.num_error" class="el-form-item__error">{{item.num_error}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <a href="javascript:void(0);" class="d-b" @click="deleteTray(index)" style="margin: 3px 0 0 10px;">删除</a>
            </el-col>
          </el-row>
          <!--不是全国仓可以上到托盘-->
          <el-row v-if="selectStorehouseData.province_code !== 'nationwide'">
            <el-col :span="12">
              <el-form-item label="">
                <el-button @click.native="addTray" size="mini" type="primary" plain>
                  {{inventoryData.trays.length > 0 ? '添加托盘' : '上架'}}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div class="bottom-btn">
        <template v-if="judgeOrs(pageType, ['add_pur', 'add_distribute', 'add_allocate', 'add_refund'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, InputPrice } from '@/common';
import { CascaderWarehouseTray } from '@/component';

export default {
  name: "AddEditWarehouseStockPending",
  mixins: [addEditMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'cascader-warehouse-tray': CascaderWarehouseTray
  },
  created() {
  },
  data(){
    let initDetail = {
      creator: {},
      storehouse: {},
      relate_order: {},
      trays: [],
      ware_monitor: {}
    }
    let initInventoryData = {
      in_stock_id: '',
      trays: [/*{
        ids: [],
        ids_error: '',
        storehouse_id: '',
        warehouse_id: '',
        tray_id: '',
        num: '',
        num_error: ''
      }*/]
    }
    return {
      inventoryStatus: Constant.INVENTORY_STATUS(),
      inventoryStatusType: Constant.INVENTORY_STATUS_TYPE,
      selectStorehouseData: {}, //页面搜索条件
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      initInventoryData: initInventoryData,
      inventoryData: this.copyJson(initInventoryData),
      supOptTypes: Constant.SUP_OPT_TYPES(),
      rules: {},
      pageTitles: {
        add_pur: '采购入库',
        add_distribute: '调拨入库',
        detail_pur: '采购入库详情',
        detail_distribute: '调拨入库详情',
        add_allocate: '场地入库', //场地入库
        detail_allocate: '入库单详情', //场地入库
        add_refund: '分配退货入库', //分配退货入库
        detail_refund: '入库单详情', //分配退货入库
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type;
      let pc = this.getPageComponents('QueryWarehouseStockPending');
      if(pc){
        this.$data.selectStorehouseData = pc.selectStorehouseData;
      }
      this.supInStockDetail(data.id);
    },
    //获取数据
    async supInStockDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supInStockDetail, { id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = rd;
        this.$data.inventoryData = {
          in_stock_id: rd.id,
          trays: []
        };
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交数据
    async addEditData(){
      let { detail, inventoryData, pageType } = this;
      let con = true, num = 0;
      for(let i = 0; i < inventoryData.trays.length; i++){
        if(!inventoryData.trays[i].num){
          inventoryData.trays[i].num_error = '不能小于1件';
          con = false;
        }else{
          num += inventoryData.trays[i].num;
        }
        if(!inventoryData.trays[i].tray_id){
          inventoryData.trays[i].ids_error = '不能为空';
          con = false;
        }
      }
      if(num > detail.num){
        this.$message({message: `合格数量只有${detail.num}件`, type: 'error'});
        con = false;
      }
      if(!con) return;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supInStockShMonitorAdd, inventoryData);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '入库成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableWarehouseStockPending');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //入库数量输入
    inputNumChange(index){
      let { inventoryData } = this;
      if(inventoryData.trays[index].num_error){
        inventoryData.trays[index].num_error = '';
        this.$data.inventoryData = inventoryData;
      }
    },
    //选择仓库
    changeTray(value, index){
      let { inventoryData } = this;
      inventoryData.trays[index].storehouse_id = value[0];
      inventoryData.trays[index].warehouse_id = value[1];
      inventoryData.trays[index].tray_id = value[2];
      inventoryData.trays[index].ids_error = '';
      this.$data.inventoryData = this.copyJson(inventoryData);
    },
    //添加仓库
    addTray(){
      this.inventoryData.trays.push({
        ids: [],
        ids_error: '',
        storehouse_id: '',
        warehouse_id: '',
        tray_id: '',
        num: '',
        num_error: ''
      });
      this.$data.inventoryData = this.copyJson(this.inventoryData);
    },
    //删除仓库
    deleteTray(index){
      this.inventoryData.trays.remove(index);
      this.$data.inventoryData = this.copyJson(this.inventoryData);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
