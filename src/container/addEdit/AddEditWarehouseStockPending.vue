<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="inventoryData" :rules="rules" ref="ruleForm">
        <!--采购、详情-->
        <el-row v-if="judgeOrs(pageType, ['add_pur', 'detail_pur'])">
          <h6 class="subtitle">采购信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="采购单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期">{{detail.relate_order.order_date || detail.relate_order.purchase_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="待入库数量">{{detail.un_qa_num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可入库数量">
              <span style="color: #ff5252;">{{detail.un_qa_num - detail.num_in}}件</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!--调拨、详情-->
        <el-row v-else-if="judgeOrs(pageType, ['add_distribute', 'detail_distribute'])">
          <h6 class="subtitle">调拨信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调出仓">{{detail.relate_order.src_storehouse.title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可售日期">{{detail.relate_order.available_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="待入库数量">{{detail.un_qa_num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可入库数量">
              <span style="color: #ff5252;">{{detail.un_qa_num - detail.num_in}}件</span>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="judgeOrs(pageType, ['detail_pur', 'detail_distribute'])">
          <h6 class="subtitle">品控信息</h6>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库数量">{{detail.relate_order.num_in}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产日期">{{detail.relate_order.produce_date}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保质期">{{detail.relate_order.shelf_life}}天</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存期">{{detail.relate_order.stock_life}}天</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品控人">{{detail.relate_order.realname}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品控时间">{{detail.relate_order.created}}</el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="judgeOrs(pageType, ['add_pur', 'add_distribute'])">
          <h6 class="subtitle">入库信息</h6>
          <el-row v-for="(item, index) in inventoryData.trays" :key="index">
            <el-col :span="10">
              <el-form-item label="入库">
                <cascader-warehouse-tray v-if="isShow" size="medium" v-model="item.ids" :storehouseId="storehouseId" @change="(value) => changeTray(value, index)"/>
                <div v-if="item.ids_error" class="el-form-item__error">{{item.ids_error}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="入库数量">
                <input-number size="medium" v-model="item.num" unit="件" @change="inputNumChange(index)"/>
                <div v-if="item.num_error" class="el-form-item__error">{{item.num_error}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="2" v-if="inventoryData.trays.length > 1">
              <a href="javascript:void(0);" class="d-b" @click="deleteTray(index)" style="margin: 3px 0 0 10px;">删除</a>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="">
                <el-button @click.native="addTray" size="mini" type="primary" plain>添加仓库</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div class="bottom-btn">
        <template v-if="judgeOrs(pageType, ['add_pur', 'add_distribute'])">
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
      relate_order: {
        src_storehouse: {},
      }
    }
    let initInventoryData = {
      province_code: this.$province.code,
      in_type: '',
      relate_order_id: '',
      trays: [{
        ids: [],
        ids_error: '',
        storehouse_id: '',
        warehouse_id: '',
        tray_id: '',
        num: '',
        num_error: ''
      }]
    }
    return {
      storehouseId: '', //页面搜索条件
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      initInventoryData: initInventoryData,
      inventoryData: this.copyJson(initInventoryData),
      rules: {},
      pageTitles: {
        add_pur: '采购入库',
        add_distribute: '调拨入库',
        detail_pur: '采购入库详情',
        detail_distribute: '调拨入库详情',
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type;
      this.$data.detail = data;
      this.$data.inventoryData = this.copyJson({
        ...this.initInventoryData,
        in_type: data.order_type || 'distribute', //'global_pur', 'local_pur', 'distribute'
        relate_order_id: data.id,
      });
      let pc = this.getPageComponents('QueryWarehouseStockPending');
      if(pc){
        this.$data.storehouseId = pc.query.storehouse_id;
      }
      this.$data.isShow = true;
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
      if(num > detail.un_qa_num - detail.num_in){
        this.$message({message: `可入库数量只有${detail.un_qa_num - detail.num_in}件`, type: 'error'});
        con = false;
      }
      if(!con) return;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supInStockShMonitorAdd, inventoryData);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${pageType === 'add_pur' ? '统采' : '调拨'}入库成功`, type: 'success'});
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
