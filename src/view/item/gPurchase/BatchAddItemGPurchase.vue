<template>
  <div>
    <add-edit-layout :title="returnPageTitles('预采订单')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm">
        <el-form-area label="采购信息">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="供应商"
                prop="supplier_id"
                :rules="[{ required: true, message: '请选择供应商', trigger: 'change' }]"
              >
                <select-supplier size="medium" :pItemId="detail.p_item_id" v-model="detail.supplier_id" @change="changeSupplier" filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="采购日期"
                prop="order_date"
                :rules="[{ required: true, message: '请选择采购日期', trigger: 'change' }]"
              >
                <el-date-picker size="medium" v-model="detail.order_date" value-format="yyyy-MM-dd" placeholder="采购日期" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="销售日期"
                prop="available_date"
                :rules="[{ required: true, message: '请选择销售日期', trigger: 'change' }]"
              >
                <el-date-picker size="medium" v-model="detail.available_date" value-format="yyyy-MM-dd" placeholder="销售日期" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="预计到货"
                prop="estimate_arrive_at"
                :rules="[{ required: true, message: '请选择预计到货时间', trigger: 'change' }]"
              >
                <el-date-picker size="medium" type="datetime" v-model="detail.estimate_arrive_at" value-format="yyyy-MM-dd HH:mm:ss" placeholder="预计到货" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="送达仓"
                prop="storehouse_id"
                :rules="[{ required: true, message: '请选择送达仓', trigger: 'change' }]"
              >
                <select-storehouse size="medium" :provinceCode="storeProCode" v-model="detail.storehouse_id"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-area>
        <el-form-area
          v-for="(item, index) in detail.p_items"
          :key="`item-${index + 1}`"
          :label="`采购商品${index + 1}`"
        >
          <el-row :gutter="32">
            <el-col :span="20">
              <el-form-item
                label="商品"
                :prop="'p_items.' + index + '.p_item_id'"
                :rules="[ { required: true, message: '商品编号/名称不能为空', trigger: 'change' } ]"
              >
                <el-select
                  :disabled="!detail.supplier_id"
                  size="small"
                  v-model="item.p_item_id"
                  remote
                  filterable
                  :remote-method="initItemList"
                  :loading="remoting"
                  placeholder="请搜索指定采购商品"
                  style="width: 100%"
                  no-match-text="没有符合条件的商品"
                  no-data-text="没有符合条件的商品"
                >
                  <el-option
                    v-for="d in filterItemList"
                    :key="d.id"
                    :label="d.code + '/' + d.title"
                    :value="d.id"
                    @click.native="() => selectGItem(d, item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="index !== 0">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteItem(index)" style="margin-top: -8px">移除</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item
                label="采购商品金额"
                :prop="'p_items.' + index + '.amount'"
                :rules="[ { required: true, message: '采购商品金额不能为空', trigger: 'change' } ]"
              >
                <input-price size="medium" v-model="item.amount" unit="元" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="采购数量"
                :prop="'p_items.' + index + '.num'"
                :rules="[ { required: true, message: '采购数量不能为空', trigger: 'change' } ]"
              >
                <input-number size="medium" min="1" v-model="item.num" unit="件" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="采购价">
                <el-input size="small" :value="!!item.amount && !!item.num ? returnPrice(item.amount / item.num - item.frame_price) : ''" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!!item.frame_id">
              <el-form-item label="框金额">
                <el-input size="small" :value="!!item.num ? returnPrice(item.frame_price * item.num) : ''" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购总金额">
                <el-input size="small" :value="!!item.amount && !!item.num ? returnPrice(item.amount - item.frame_price * item.num) : ''" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-area>

        <el-form-item>
          <el-button size="mini" @click="handleAddItem">增加采购商品</el-button>
        </el-form-item>
      </el-form>

      <!--其它-->
      <div class="bottom-btn mt-30">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
  import { Input, Select, Option } from 'element-ui';
  import addEditMixin from '@/share/mixin/add.edit.mixin';
  import { Http, Config, Constant } from '@/util';
  import { InputNumber, InputPrice, FormArea } from '@/common';
  import { SelectSupplier, SelectGItem, LogModifiedDetail, SelectStorehouse } from '@/component';

  export default {
    name: "BatchAddItemGPurchase",
    mixins: [addEditMixin],
    components: {
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'select-supplier': SelectSupplier,
      'select-g-item': SelectGItem,
      'input-number': InputNumber,
      'input-price': InputPrice,
      'el-form-area': FormArea,
      'log-modified-detail': LogModifiedDetail,
      'select-storehouse': SelectStorehouse
    },
    props: {
      fromPage: { type: String, defalut: '' }, //来自页面 fromPage：Inventory 库存
    },
    computed: {
      storeProCode(){
        let { selectSupplierData } = this;
        if(!selectSupplierData.province_code || selectSupplierData.province_code === 'nationwide'){
          return '';
        }
        return selectSupplierData.province_code;
      },
      filterItemList() {
        return this.$data.itemList.filter(item => !this.$data.detail.p_items.some(d => d.p_item_id == item.id));
      },
    },
    created() {
    },
    data(){
      let initDetail = {
        order_date: '',
        available_date: '',
        estimate_arrive_at: '',
        supplier_id: '',
        storehouse_id: '',
        p_items: [
          {p_item_id: '', amount: '', num: '', frame_id: '', frame_price: ''}
        ],
      };
      return {
        initDetail: initDetail,
        detail: JSON.parse(JSON.stringify(initDetail)),

        selectSupplierData: {},
        remoting: false,
        itemList: []
      }
    },
    methods: {

      handleAddItem() {
        this.$data.detail.p_items = [
          ...this.$data.detail.p_items,
          {p_item_id: '', amount: '', num: '', frame_id: '', frame_price: ''}
        ]
      },

      handleDeleteItem(i) {
        this.$data.detail.p_items = this.$data.detail.p_items.filter((item, index) => index !== i);
      },

      //显示新增修改(重写) (数据，类型)
      showAddEdit(data, type){
        this.$data.pageType = 'add';
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      },

      changeSupplier(data) {
        this.$data.selectSupplierData = data;
        this.$data.detail.storehouse_id = '';
      },

      async initItemList(condition){
        this.$data.remoting = true;
        let res = await Http.get(Config.api.baseGItemList, {
          need_num: 20,
          condition: condition,
          supplier_id: this.$data.detail.supplier_id,
          sup_type: '',
          is_deleted: 0
        });
        this.$data.remoting = false;
        if(res.code === 0){
          let rd = res.data;
          this.$data.itemList = rd;
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },

      //选择商品时
      selectGItem(data, item){
        //如果有筐
        if(data.frame_id){

          item.frame_id = data.frame_id;
          item.frame_price = data.frame.price;
        } else {
          item.frame_id = '';
          item.frame_price = '';
        }
      },
      //提交数据
      async addEditData(){
        this.$loading({isShow: true});
        let detail = {...this.$data.detail};
        detail.p_items = detail.p_items.map(item => ({
          p_item_id: Number(item.p_item_id),
          num: Number(item.num),
          item_total_price: Math.round(item.amount - item.frame_price * item.num),
        }));
        let res = await Http.post(Config.api.fromSupplierOrderBatchAdd, detail);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$message({message: `预采订单新增成功`, type: 'success'});
          this.handleCancel(); //隐藏
          //刷新数据(列表)
          let pc = this.getPageComponents('TableItemGPurchase');
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
  .link-item{
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      opacity: .7;
    }
  }

  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>
