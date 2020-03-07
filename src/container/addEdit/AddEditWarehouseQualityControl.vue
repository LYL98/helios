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
            <el-form-item label="采购日期">{{detail.order_date}}</el-form-item>
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

        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_distribute'])">
          <h6 class="subtitle">品控信息</h6>
          <el-row>
            <el-col :span="12">
              <el-form-item label="到货数量" prop="num_arrive">
                <input-number size="medium" :min="1" v-model="inventoryData.num_arrive" unit="件"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品控抽检">
                <input-number
                  size="medium"
                  disabled
                  :value="!!inventoryData.num_arrive ? Math.floor(inventoryData.num_arrive * ((itemData.system_class && itemData.system_class.qa_rate) || 0) / 1000) : ''"
                  unit="件"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合格数量" prop="num">
                <input-number size="medium" :min="pageType === 'add_distribute' ? 0 : 1" v-model="inventoryData.num" unit="件"/>
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
          <template v-if="isShowNo">
            <h6 class="subtitle">不合格商品处理</h6>
            <el-row>
              <el-col :span="12">
                <el-form-item label="处理数量">
                  <input-number size="medium" disabled :value="inventoryData.un_qa_num" unit="件"/>
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
              <el-col :span="12" v-if="judgeOrs(inventoryData.un_qa_type, ['damage_sale', 'sale_offline'])">
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
        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_distribute'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">收 货</el-button>
        </template>
        <template v-else>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>

    <!--品控确认-->
    <el-dialog title="品控确认" :visible="isShowAffirm" width="540px" :before-close="showHideAffirm">
      <div class="t-c">
        <div>采购数量：{{detail.num}}件，已收货：{{detail.num_in}}件</div>
        <div style="margin: 6px 0 20px; color: #ff5252;">本次收货数量：{{inventoryData.num}}件，请确认</div>
        <el-radio v-model="inventoryData.accept_type" label="after_no" border>后面不会来货了</el-radio>
        <el-radio v-model="inventoryData.accept_type" label="after_have" border>后面会来货</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="showHideAffirm">取 消</el-button>
        <el-button type="primary" @click.native="supInStockAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, InputPrice, SelectOption } from '@/common';

export default {
  name: "AddEditWarehouseQualityControl",
  mixins: [addEditMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'select-option': SelectOption
  },
  props: {
    fromPage: { type: String, default: 'QualityControl' }, //仓库品控 QualityControl，场地品控 Receiving
  },
  created() {
  },
  data(){
    let initDetail = {
      src_storehouse: {}
    }
    /*
      - province_code:
      - produce_date: 商品生产日期, 根据商品所属的1级分配字段 has_produce_date 来传递，has_produce_date 则让用户手动填写，否则传递当前日期
      - relate_order_id:
      - num_arrive: 到货数量
      - num: 收货数量

      - shelf_life: 保质期
      - stock_life: 库存期
      - un_qa_num: 不合格处理数量
      - un_qa_type: 不合格商品处理类型 damage/damage_sale/sale_offline
      - remark:
      - un_qa_amount:
      in_type: 两种枚举类型:pur, distribute。其中 pur 表示采购，distribute表示调拨
      accept_type:
        * all_accept: 全部收货
       * after_no: 后面不会来货了
       * after_have:后面会来货
    */
    let initInventoryData = {
      province_code: this.$province.code,
      produce_date: '',
      produce_date_disabled: false,
      in_type: '',
      accept_type: '',
      relate_order_id: '',
      num_arrive: '',
      num: '',
      shelf_life: null,
      stock_life: null,
      un_qa_num: 0,
      un_qa_type: '',
      un_qa_amount: 0,
      remark: '',
    }

    //到货数量校验
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
        return callback(new Error('不能大于到货数量'));
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
          qa_rate: 0,
          has_produce_date: false
        },
        system_class: {
          qa_rate: 0,
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
        num: [
          { required: true, message: '请选择采购日期', trigger: 'change' },
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
        add_distribute: '品控',
        detail_purchase: '品控详情',
        detail_distribute: '品控详情',
      },
      isShowAffirm: false
    }
  },
  computed: {
    //处理类型
    supOptTypes(){
      let d = Constant.SUP_OPT_TYPES('value_key');
      delete d['退货入库']; //删除退货入库
      delete d['退货给供应商']; //删除退货给供应商
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
      let { inventoryData, detail, pageType } = this;
      //到货数量小于或等于可到货数量 && 到货数量大于合格数量
      if(pageType === 'add_distribute' &&
        typeof inventoryData.num_arrive === 'number' && typeof inventoryData.num === 'number' &&
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
      this.$data.isShowNo = false;
      this.$data.pageType = type;
      this.$data.detail = data;
      let inTypes = {
        add_purchase: 'pur',
        add_distribute: 'distribute',
        detail_purchase: 'pur',
        detail_distribute: 'distribute',
      }
      this.$data.inventoryData = this.copyJson({
        ...this.initInventoryData,
        relate_order_id: data.id,
        produce_date: data.produce_date || '',
        produce_date_disabled: data.produce_date ? true : false,
        shelf_life: data.shelf_life,
        stock_life: data.stock_life,
        in_type: inTypes[type]
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
        if(detail.status === 'success'){
          inventoryData.shelf_life = rd.shelf_life;
          inventoryData.stock_life = rd.stock_life;
          this.$data.inventoryData = inventoryData;
        }
      }
    },
    //显示或隐藏确认
    showHideAffirm(){
      this.$data.isShowAffirm = !this.isShowAffirm;
    },
    //提交数据
    addEditData(){
      let { detail, inventoryData } = this;
      if(detail.num !== inventoryData.num + detail.num_in){
        this.$data.inventoryData.accept_type = 'after_have'; //后面会来货
        this.showHideAffirm();
      }else{
        this.$messageBox.confirm(`采购数量:${detail.num}件、实际收货:${detail.num}件,确认收货后该采购单将 采购完成`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$data.inventoryData.accept_type = 'all_accept'; //全部收货
          this.supInStockAdd();
        }).catch(() => {
          //console.log('取消');
        });
      }
    },
    //发送收货请求
    async supInStockAdd(){
      this.$data.isShowAffirm = false; //隐藏确认提示
      let { inventoryData, fromPage } = this;
      this.$loading({isShow: true});
      let apis = {
        QualityControl: Config.api.supInStockAdd,
        Receiving: Config.api.supAcceptAdd
      }
      let res = await Http.post(apis[fromPage], {
        ...inventoryData,
        order_type: inventoryData.in_type, //仓库用: in_type，场地用：order_type
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '收货成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableWarehouseQualityControl');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
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
