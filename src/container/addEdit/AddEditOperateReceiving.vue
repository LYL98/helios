<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="inventoryData" :rules="rules" ref="ruleForm">
        <!--采购、详情-->
        <el-row v-if="judgeOrs(pageType, ['add_purchase', 'detail_purchase'])">
          <h6 class="subtitle">采购信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="采购单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期">{{detail.order_date || detail.purchase_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可收货数量">{{detail.num - detail.num_in}}件</el-form-item>
          </el-col>
        </el-row>

        <!--调拨、详情-->
        <el-row v-else-if="judgeOrs(pageType, ['add_allot', 'detail_allot'])">
          <h6 class="subtitle">调拨信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调出仓">{{detail.src_storehouse.title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可售日期">{{detail.available_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可收货数量">{{detail.num - detail.num_in}}件</el-form-item>
          </el-col>
        </el-row>

        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_allot'])">
          <h6 class="subtitle">品控信息</h6>
          <el-row>
            <el-col :span="12">
              <el-form-item label="到货数量" prop="num_arrive">
                <input-number size="medium" :min="1" v-model="inventoryData.num_arrive" unit="件"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品控数量" prop="qa_num">
                <input-number size="medium" :min="1" v-model="inventoryData.qa_num" unit="件"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合格数量" prop="num">
                <input-number size="medium" :min="pageType === 'add_allot' ? 0 : 1" v-model="inventoryData.num" unit="件"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="itemData.fisrt_system_class.has_produce_date">
              <el-form-item label="生产日期" prop="produce_date">
                <el-date-picker
                  size="medium"
                  style="width: 100%;"
                  placeholder="生产日期"
                  v-model="inventoryData.produce_date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :disabled="inventoryData.produce_date_disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保质期" prop="shelf_life">
                <input-number size="medium" :disabled="lifeDesabled" v-model="inventoryData.shelf_life" unit="天"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存期" prop="stock_life">
                <input-number size="medium" :disabled="lifeDesabled" v-model="inventoryData.stock_life" unit="天"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!--调拨，不合格商品处理-->
          <template v-if="pageType === 'add_allot' && isShowNo">
            <h6 class="subtitle">不合格商品处理</h6>
            <el-row>
              <el-col :span="12">
                <el-form-item label="处理数量" prop="un_qa_num">
                  <input-number size="medium" :value="inventoryData.un_qa_num" unit="件"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理类型" prop="un_qa_type">
                  <select-option
                    size="medium"
                    placeholder="请选择处理类型"
                    v-model="inventoryData.un_qa_type"
                    :options="supOptTypes"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理金额" prop="un_qa_amount">
                  <input-price size="medium" v-model="inventoryData.un_qa_amount" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="inventoryData.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="品控标准">
                <div v-if="itemData.system_class.qa_standard" v-html="itemData.system_class.qa_standard" class="qa-standard"></div>
                <div v-else class="qa-standard">暂无品控标准</div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div class="bottom-btn">
        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_allot'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit" data-status="part_in">部分收货</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit" data-status="all_in">全部收货</el-button>
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
  name: "AddEditOperateReceiving",
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
      src_storehouse: {}
    }
    /*
      """
    :desc: 场地的收货
    :url: /m/sup_accept/add
    :method: POST
    :param:
        - produce_date: 商品生产日期
        - order_type: local_pur/distribute
        - relate_order_id:
        - province_code:
        - status: part_in/all_in
        - num:
        - num_arrive: 到货数量
        - remark:
        - qa_num: 品控数量
        - shelf_life: 保质期
        - stock_life: 库存期
        - un_qa_num: 不合格处理数量
        - un_qa_type: 不合格商品处理类型 damage/damage_sale/sale_offline
        - un_qa_amount:
    :return:
    """
    */
    let initInventoryData = {
      province_code: this.$province.code,
      produce_date: '',
      produce_date_disabled: false,
      order_type: '',
      status: '',
      relate_order_id: '',
      num_arrive: '',
      num: '',
      qa_num: null,
      shelf_life: null,
      stock_life: null,
      un_qa_num: 0,
      un_qa_type: '',
      un_qa_amount: 0,
      remark: '',
    }
    //收货数量校验
    const validNumArrive = (rules, value, callback)=>{
      let { detail } = this;
      if (Number(value) > detail.num - detail.num_in) {
        return callback(new Error('不能大于可收货数量'));
      }
      callback();
    }
    //品控抽样、合格数量校验
    const validNum = (rules, value, callback)=>{
      let { inventoryData } = this;
      if (Number(value) > inventoryData.num_arrive) {
        return callback(new Error('不能大于收货数量'));
      }
      callback();
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      initInventoryData: initInventoryData,
      inventoryData: this.copyJson(initInventoryData),
      itemData: {
        fisrt_system_class: {
          has_produce_date: false
        },
        system_class: {
          qa_standard: ''
        }
      },
      rules: {
        produce_date: [
          { required: true, message: '请选择采购日期', trigger: 'change' }
        ],
        num_arrive: [
          { required: true, message: '请输入到货数量', trigger: 'change' },
          { validator: validNumArrive, trigger: 'blur' }
        ],
        qa_num: [
          { required: true, message: '请选择品控数量', trigger: 'change' },
          { validator: validNum, trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入合格数量', trigger: 'change' },
          { validator: validNum, trigger: 'blur' }
        ],
        un_qa_type: { required: true, message: '请选择处理类型', trigger: 'change' },
        un_qa_amount: { required: true, message: '请输入处理金额', trigger: 'change' },
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
      },
      pageTitles: {
        add_purchase: '品控',
        add_allot: '品控',
        detail_purchase: '品控详情',
        detail_allot: '品控详情',
      }
    }
  },
  computed: {
    //处理类型
    supOptTypes(){
      let d = Constant.SUP_OPT_TYPES('value_key');
      delete d['退货']; //删除退货
      return d;
    },
    //库存期、保质期禁用
    lifeDesabled(){
      let { itemData, detail } = this;
      if(detail.status !== 'success') return true;
      if(itemData.fisrt_system_class.has_produce_date) return true;
      return false;
    },
    //是否显示不合格处理
    isShowNo(){
      let { inventoryData, detail } = this;
      //收货数量小于或等于可收货数量 && 收货数量大于合格数量
      if(typeof inventoryData.num_arrive === 'number' && typeof inventoryData.num === 'number' &&
        inventoryData.num_arrive <= detail.num - detail.num_in &&
        inventoryData.num_arrive > inventoryData.num){
          inventoryData.un_qa_num = inventoryData.num_arrive - inventoryData.num;
          inventoryData.un_qa_type = '';
          inventoryData.un_qa_amount = '';
          this.$data.inventoryData = inventoryData;
        return true;
      }
      inventoryData.un_qa_num = 0;
      inventoryData.un_qa_type = '';
      inventoryData.un_qa_amount = 0;
      this.$data.inventoryData = inventoryData;
      return false;
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type;
      this.$data.detail = data;
      let orderType = data.order_type || 'distribute'; //'global_pur', 'local_pur', 'distribute'
      this.$data.inventoryData = this.copyJson({
        ...this.initInventoryData,
        relate_order_id: data.id,
        produce_date: data.produce_date || '',
        produce_date_disabled: data.produce_date ? true : false,
        shelf_life: data.shelf_life || null,
        stock_life: data.stock_life || null,
        order_type: orderType
      });
      this.supPItemDetail();
      this.$data.isShow = true;
    },
    //商品信息，用于入库 时候查看其一级科学分类，库存期，保质期
    async supPItemDetail(){
      let { inventoryData, detail } = this;
      let res = await Http.get(Config.api.supPItemDetail, {
        item_code: this.detail.item_code
      });
      if(res.code === 0){
        let rd = res.data;
        this.$data.itemData = rd;
        //待入库
        if(this.judgeOrs(detail.status, ['success', 'part_in', 'all_in'])){
          inventoryData.shelf_life = rd.shelf_life;
          inventoryData.stock_life = rd.stock_life;
          this.$data.inventoryData = inventoryData;
        }
      }
    },
    //提交数据
    async addEditData(e){
      let { inventoryData } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supAcceptAdd, {...inventoryData, status: e.currentTarget.dataset.status});
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '收货成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableOperateReceiving');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
  .qa-standard{
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    border-radius: 5px;
    padding: 5px 10px;
  }
</style>
