<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="inventoryData" :rules="rules" ref="ruleForm">
        <el-row>
          <h6 class="subtitle">调拨信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调出仓">{{detail.src_storehouse_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售日期">{{detail.available_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计送达">{{detail.estimate_arrive_at}}</el-form-item>
          </el-col>
        </el-row>

        <h6 class="subtitle">品控信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="到货数量" prop="num_arrive">
              <input-number size="medium" :min="0" v-model="inventoryData.num_arrive" unit="件"/>
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
            <el-form-item label="合格数量" prop="qualified_num">
              <input-number size="medium" :min="0" v-model="inventoryData.qualified_num" unit="件"/>
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
          </el-row>
        </template>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="inventoryData.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
        </el-form-item>
        <el-form-item label="品控标准">
          <div v-if="itemData.system_class.qa_standard" v-html="itemData.system_class.qa_standard" class="qa-standard"></div>
          <div v-else class="qa-standard">暂无品控标准</div>
        </el-form-item>
        <el-form-item label="商品详情">
          <div style="margin-bottom: 16px;">
            <image-preview>
              <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in itemData.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
            </image-preview>
          </div>
          <el-row>
            <el-col :span="5">
              <el-form-item label="产地" label-width="60px">{{itemData.origin_place}}</el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="规格" label-width="60px">{{itemData.item_spec || '-'}}</el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="重量" label-width="60px">
                <span v-if="!!itemData.weight_s">{{returnWeight(itemData.weight_s)}}
                  <span v-if="!!itemData.weight_e"> - {{returnWeight(itemData.weight_e)}}</span> 斤
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="筐" label-width="60px">
                <template v-if="itemData.frame_id">含筐</template>
                <template v-else>-</template>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="包装规格" label-width="80px">{{itemData.package_spec}}</el-form-item>
            </el-col>
          </el-row>
          <div class="my-content-div" v-html="itemData.content"></div>
        </el-form-item>
      </el-form>

      <div class="bottom-btn">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">收 货</el-button>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, InputPrice, SelectOption, ImagePreview } from '@/common';

export default {
  name: "AddEdit",
  mixins: [addEditMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'select-option': SelectOption,
    'image-preview': ImagePreview,
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
      order_type: distribute
      accept_type:
        * all_accept: 全部收货
       * after_no: 后面不会来货了
       * after_have:后面会来货
    */
    let initInventoryData = {
      province_code: this.$province.code,
      produce_date: '',
      produce_date_disabled: false,
      order_type: 'distribute',
      accept_type: '',
      relate_order_id: '',
      num_arrive: '',
      num: '',
      shelf_life: null,
      stock_life: null,
      un_qa_num: 0,
      un_qa_type: '',
      remark: '',
    }

    //到货数量校验
    const validNumArrive = (rules, value, callback)=>{
      let { detail } = this;
      if(Number(value) > detail.num - detail.num_arrive) {
        return callback(new Error('不能大于调拨数量'));
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
      id: null,
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
        },
        images: [],
        content: ''
      },
      rules: {
        produce_date: [
          { required: true, message: '请选择采购日期', trigger: 'change' }
        ],
        num_arrive: [
          { required: true, message: '请输入到货数量', trigger: 'change' },
          { validator: validNumArrive, trigger: 'blur' }
        ],
        qualified_num: [
          { required: true, message: '请输入合格数量', trigger: 'change' },
          { validator: validNum, trigger: 'blur' }
        ],
        un_qa_type: { required: true, message: '请选择处理类型', trigger: 'change' },
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
      },
      pageTitles: {
        add: '品控',
        detail: '品控详情'
      },
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
      let { inventoryData, detail } = this;
      //到货数量小于或等于可到货数量 && 到货数量大于合格数量
      if(typeof inventoryData.num_arrive === 'number' && typeof inventoryData.qualified_num === 'number' &&
        inventoryData.num_arrive <= detail.num && inventoryData.num_arrive > inventoryData.qualified_num){
          inventoryData.un_qa_num = inventoryData.num_arrive - inventoryData.qualified_num;
          inventoryData.un_qa_type = '';
          this.$data.inventoryData = inventoryData;
        return true;
      }
      inventoryData.un_qa_num = 0;
      inventoryData.un_qa_type = '';
      this.$data.inventoryData = inventoryData;
      return false;
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.isShowNo = false;
      this.$data.pageType = type;
      this.$data.id = data.id;
      this.supAcceptDistDetail();
    },
    //调拨详情
    async supAcceptDistDetail(){
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.supAcceptDistDetail, { id: this.id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = rd;
        this.$data.inventoryData = this.copyJson({
          ...this.initInventoryData,
          relate_order_id: rd.id,
          produce_date: rd.produce_date || '',
          produce_date_disabled: rd.produce_date ? true : false,
          shelf_life: rd.shelf_life,
          stock_life: rd.stock_life
        });
        this.$data.isShow = true;
        this.supPItemDetail();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
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
    //提交数据
    async addEditData(){
      let { inventoryData } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supAcceptDistributeAdd, inventoryData);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '收货成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('Table');
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
  @import "@/share/scss/add.edit.scss";
</style>
<style lang="scss">
  .qa-standard{
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    border-radius: 5px;
    padding: 5px 10px;
    max-height: 400px;
    overflow-y: auto;
    img{
      width: 100% !important;
    }
  }
  .my-content-div{
    height: 400px;
    border: 1px solid #ececec;
    padding: 0 10px;
    background: #F5F7FA;
    overflow-y: auto;
    img{
      width: 100% !important;
    }
    .ql-video{
      display: none;
    }
  }
</style>
