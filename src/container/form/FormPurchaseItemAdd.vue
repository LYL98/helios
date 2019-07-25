<template>
  <div class="purchare-add">
    <el-form style="width: 1150px;" v-if="!isShowEdit">
      <el-form-item>
        <el-row style="display: flex; align-items: center;">
          <my-query-item>
            <my-select-buyer
              size="small"
              :provinceCode="province.code"
              v-model="query.buyer_id"
              style="width: 180px;"
              @change="selectByCondition"
            ></my-select-buyer>
          </my-query-item>
          <my-query-item>
            <my-select-display-class
              v-model="query.display_class_code"
              size="small"
              style="width: 180px; margin-left: 20px;"
              @change="selectByCondition"
            ></my-select-display-class>
          </my-query-item>
          <my-query-item>
            <el-input
              style="width: 180px; margin-left: 20px;"
              v-model="query.item_condition"
              size="small"
              clearable
              placeholder="输入商品名称/编号"
              @keyup.enter.native="selectByCondition"
              @clear="selectByCondition"
              ref="item_condition"
            />
            <el-button size="small" style="margin-left: 4px;" type="primary" @click="selectByCondition" icon="el-icon-search"></el-button>
            <el-button size="small" type="primary" style="margin-left: 10px;" plain @click="clearQueryCondition">重置</el-button>
          </my-query-item>
        </el-row>
        <el-row style="display: flex; align-items: center; margin-top: 18px;" v-if="showList.length > 0">
          <my-query-item>
            <my-button-group
              buttonWidth="60"
              :options="{'全部': '', '已上架': 1, '未上架': 0}"
              size="small"
              v-model="query.is_on_sale"
              @change="selectIsOnSale"
            />
          </my-query-item>
        </el-row>
      </el-form-item>
      <el-form-item :error="error.items">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <ul class="select-list" style="wdith: 300px;">
            <li class="header">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllItems">全选
              </el-checkbox>
            </li>
            <li style="margin-top: 40px;">
              <el-checkbox-group v-model="multipleSelection" @change="handleCheckedItemsChange">
                <ul style="padding: 0 10px;">
                  <li v-for="item in showList">
                    <el-checkbox :label="item" :key="item.code">{{item.title}}</el-checkbox>
                  </li>
                </ul>
              </el-checkbox-group>
            </li>
          </ul>
          <ul class="into-out">
            <li><i class="el-icon-d-arrow-right" @click="intoEditList"></i></li>
          </ul>
          <div class="edit-list" style="width: 760px; border: 1px solid #DCDFE6; border-radius: 2px;">
            <el-table :data="editList" empty-text="筛选并添加需要采购的商品" height="100%" :row-class-name="highlightRowClassName">
              <el-table-column width="10"></el-table-column>
              <el-table-column label="编号/商品" prop="title">
                <template slot-scope="scope">
                  <ul>
                    <li>{{ scope.row.code }} / {{ scope.row.title }}</li>
                    <li>
                      <span>预计采购价: &yen;{{ returnPrice(scope.row.recommend_price) }}</span>
                      <span v-if="scope.row.frame && scope.row.frame.code">(含框: ￥{{ returnPrice(scope.row.frame.price) }}/个)</span>
                    </li>
                  </ul>
                </template>
              </el-table-column>
              <el-table-column label="昨日销量" prop="sale_num_last" width="160"></el-table-column>
              <el-table-column label="昨日销售价" prop="price_sale_last" width="180">
                <template slot-scope="scope">
                  &yen;{{ returnPrice(scope.row.price_sale_last) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <ul class="action">
                    <li><a href="javascript:void(0);" @click="handleRemoveClick(scope.row)">移除</a></li>
                  </ul>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click="() => this.$props.close()">取消</el-button>
        <el-button type="primary" :loading="sending" @click="handleShowEdit">下一步</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="submitData" style="width: 1150px;" v-if="isShowEdit" :rules="rules" ref="ruleForm">
      <el-form-item>
        <ul class="edit-list">
          <li class="header">
            <ul style="display: flex; justify-content: space-between; align-items: center;">
              <li class="title">编号/商品</li>
              <li class="sale-num-last">昨日销量</li>
              <li class="price-sale-last">昨日销售价</li>
              <li class="supplier">供应商</li>
              <li class="total-price">采购总额(元)</li>
              <li class="number">采购件数(件)</li>
              <li class="weight">重量总计(斤)</li>
              <li class="unit-price">单价(元)</li>
              <li class="operate">操作</li>
            </ul>
          </li>
          <li class="item" style="margin-top: 44px;">
            <ul
              :class="index % 2 === 0 ? 'stripe' : ''"
              v-for="(item, index) in submitData.editList"
              :key="index"
            >
              <li class="title">
                <ul style="line-height: 20px;">
                  <li>{{ item.code }} / {{ item.title }}</li>
                  <li>
                    <span>预计采购价: &yen;{{ returnPrice(item.recommend_price) }}</span>
                    <span v-if="item.frame && item.frame.code">(含框: ￥{{ returnPrice(item.frame.price) }}/个)</span>
                  </li>
                </ul>
              </li>
              <li class="sale-num-last">{{ item.sale_num_last }}</li>
              <li class="price-sale-last">&yen;{{ returnPrice(item.price_sale_last) }}</li>
              <li class="supplier">
                <el-form-item
                  :prop="'editList.' + index + '.input.supplier_id'"
                  :rules="[{ required: true, message: '请选择供应商', trigger: 'change' }]"
                >
                  <my-select-supplier
                    size="mini"
                    :provinceCode="province.code"
                    placeholder="供应商"
                    v-model="item.input.supplier_id"
                    style="width: 160px;"
                    :clearable="false"
                  />
                </el-form-item>
              </li>
              <li class="total-price">
                <el-form-item
                  :prop="'editList.' + index + '.input.total_price'"
                  :rules="[{ required: true, message: '不能为空', trigger: 'change' }, { validator: validTotalPrice, trigger: 'blur' }]"
                >
                  <el-input size="mini" style="width: 100px;" v-model="item.input.total_price"></el-input>
                </el-form-item>
              </li>
              <li class="number">
                <el-form-item
                  :prop="'editList.' + index + '.input.number'"
                  :rules="[{ required: true, message: '不能为空', trigger: 'change' }, { validator: validNumber, trigger: 'blur' }]"
                >
                  <el-input size="mini" style="width: 100px;" v-model="item.input.number" @input="changeUnitPrice(item, index)"></el-input>
                </el-form-item>
              </li>
              <li class="weight">
                <el-form-item
                  :prop="'editList.' + index + '.input.weight'"
                  :rules="item.sale_unit === '件' ? [{}] : [{ required: true, message: '不能为空', trigger: 'change' }, {validator: validWeight, trigger: 'blur'}]"
                >
                  <el-input size="mini" style="width: 100px;" v-model="item.input.weight" :disabled="item.sale_unit === '件'" @input="changeUnitPrice(item, index)">
                  </el-input>
                </el-form-item>
              </li>
              <li class="unit-price">
                <el-form-item
                  :prop="'editList.' + index + '.input.unit_price'"
                  :rules="[{ validator: validUnitPrice, trigger: ['change', 'blur'] }]"
                >
                  <el-input size="mini" style="width: 100px;" disabled :value="calculateUnitPrice(item)">
                  </el-input>
                </el-form-item>
              </li>
              <li class="operate">
                <ul class="action">
                  <li><a href="javascript:void(0);" @click="handleRemoveClick(item, index)">移除</a></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button type="primary" plain @click="isShowEdit = false;">继续添加商品</el-button>
        <el-button type="primary" :loading="sending" :disabled="submitData.editList.length <= 0" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {Row, Col, Input, Checkbox, CheckboxGroup, Table, Dialog, TableColumn, Form, FormItem, Button, Message} from 'element-ui';
  import {ButtonGroup, ToPrice, QueryItem, SelectBuyer, SelectDisplayClass} from '@/common';
  import {SelectSupplier} from '@/container';
  import {Purchase} from '@/service';
  import {DataHandle} from '@/util';

  export default {
    name: "FormPurchaseItemAdd",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-checkbox': Checkbox,
      'el-checkbox-group': CheckboxGroup,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-dialog': Dialog,
      'my-button-group': ButtonGroup,
      'my-to-price': ToPrice,
      'my-query-item': QueryItem,
      'my-select-supplier': SelectSupplier,
      'my-select-buyer': SelectBuyer,
      'my-select-display-class': SelectDisplayClass
    },
    computed: {
      ...mapGetters({
        province: 'globalProvince'
      }),
      showList: {
        // 如果筛选到的城市itemList不在右侧编辑中的列表中editList，则填充在showList中显示出来。
        get() {
          return this.$data.itemList.filter(item => !this.$data.editList.some(editItem => editItem.id === item.id));
        }
      }
    },
    props: {
      items: {type: Array, required: true}, // 需要编辑的采购商品列表
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type: Boolean, required: true}
    },
    model: {
      prop: 'items',
      event: 'change'
    },
    data() {
      return {
        auth: this.$auth,
        isShowEdit: false,  // 显示编辑区
        // 查询商品
        query: {
          province_code: '',
          buyer_id: '',
          display_class_code: '',
          is_on_sale: '',
          item_condition: ''
        },
        // 搜索完毕后，获取搜索到的商品列表itemList，
        itemList: [],
        isIndeterminate: true, // 表示不确定。 介于 已经全选 和 未选择 之间。
        checkAll: false, // 是否全选？ 如果全选，则 multipleSelection = showList; 否则向 multipleSelection 中一个一个添加
        multipleSelection: [],  // 多选列表
        editList: [], // 需要编辑的门店列表
        submitData: {
          editList: [],
          remark: ''
        },
        rules: {},
        error: {
          items: ''
        }
      }
    },
    created() {
      this.$data.query.province_code = this.province.code;
    },
    methods: {

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
      },

      validTotalPrice(rules, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'));
        }
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('必须为大于零的纯数字'));
        }
        if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
          return callback(new Error('最多只能输入两位小数'));
        }
        if (value > 1000000) {
          return callback(new Error('不能超过1000000'));
        }
        callback();
      },

      validNumber(rules, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'));
        }
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('必须为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('必须为整数'));
        }
        if (value > 100000) {
          return callback(new Error('不能超过100000'));
        }
        callback();
      },

      validWeight(rules, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'));
        }
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('必须为大于零的纯数字'));
        }
        if (!!value && !/^[0-9]+([.]\d{0,1})?$/.test(value)) {
          return callback(new Error('最多只能输入一位小数'));
        }
        if (value > 100000) {
          return callback(new Error('不能超过100000'));
        }
        callback();
      },

      validUnitPrice(rules, value, callback) {
        if (isNaN(value) || value <= 0) {
          return callback(new Error('必须为大于零的纯数字'));
        }
        if (value > 1000000) {
          return callback(new Error('不能超过1000000'));
        }
        callback();
      },
      changeUnitPrice(item, index) {
        let validateField = 'editList.' + index + '.input.unit_price';
        this.$refs['ruleForm'].validateField([validateField]);
      },
      //返回金额
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },

      handlePrice(price) {
        return DataHandle.handlePrice(price);
      },

      // 计算采购单价
      calculateUnitPrice(item) {

        let total = item.input.total_price;

        if (item.frame && item.frame.code) {
          // 如果含框，则采购总金额 需要扣掉框的价格
          total = total - DataHandle.returnPrice(item.frame.price * item.input.number);
        }
        // 如果是按件计价的 总金额 / 数量；如果是按斤计价的 总金额 / 重量
        if (item.sale_unit === '件') {

          item.input.unit_price = item.input.number && item.input.number > 0
            ? DataHandle.returnPrice(DataHandle.handlePrice(total) / item.input.number)
            : 0;

        } else {

          item.input.unit_price = item.input.weight && item.input.weight > 0
            ? DataHandle.returnPrice(DataHandle.handlePrice(total) / item.input.weight)
            : 0;

        }

        return item.input.unit_price;

      },

      /**
       * 根据查询条件，查询结果。
       * 1、如果没有输入查询条件，点击了搜索按钮，则初始化状态
       * 2、查询门店列表后，初始化已选中的门店列表，重置isIndeterminate为true
       */
      selectByCondition() {
        // 如果查询列表没有搜索参数，则初始化状态。
        if (!this.$data.query.buyer_id
          && !this.$data.query.display_class_code
          && !this.$data.query.item_condition
        ) {
          this.$data.query.is_on_sale = '';
          this.$data.itemList = [];
          this.$data.multipleSelection = [];
          this.isIndeterminate = true;

          return;
        }
        this.$data.query.is_on_sale = '';
        this.getItemList();
        this.$data.multipleSelection = [];
        this.isIndeterminate = true;
      },

      // 在搜索结果基础上，筛选上下架
      selectIsOnSale() {
        this.getItemList();
      },

      /**
       * 重置按钮响应事件
       * 1、重置查询条件
       * 2、清空查询到的门店列表
       * 3、清空已经选中的门店列表
       * 4、重置isIndeterminate为true
       *
       */
      clearQueryCondition() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.province.code,
          buyer_id: '',
          display_class_code: '',
          is_on_sale: '',
          item_condition: ''
        })
        this.$data.itemList = [];
        this.$data.multipleSelection = [];
        this.isIndeterminate = true;
        this.$refs['item_condition'].currentValue = '';
      },

      /**
       * 全选所有门店 的 响应事件
       * 1、赋值门店列表 到 选中的门店列表中
       * 2、设置isIndeterminate为false
       */
      handleCheckAllItems(val) {
        // 如果是全选，则将所有的显示出来的门店，存放在已选中列表中。
        this.$data.multipleSelection = val ? this.showList : [];
        this.isIndeterminate = false;
      },

      /**
       * 选中单个门店 的 响应事件
       * 1、组件自动将选中的门店列表 赋值给 this.$data.multipleSelection
       * 2、根据选中的数量判断 是否全选
       * 3、根据选中的数量 判断 isIndeterminate的值
       */
      handleCheckedItemsChange(value) {
        let checkedCount = value.length;
        // 是否全部选中的判断
        this.$data.checkAll = checkedCount === this.showList.length;
        // 选择个数 大于零 但小于 所有显示的门店，则表示未确认
        this.$data.isIndeterminate = checkedCount > 0 && checkedCount < this.showList.length;
      },

      /**
       * 添加到编辑列表的响应事件
       * 1、如果所选列表为空，则提醒先选择门店，并返回；
       * 2、合并编辑区列表 和 选中列表，并初始化编辑区列表的字段
       * 3、添加完成后，初始化已经选中的列表状态
       */
      intoEditList() {
        if (this.$data.multipleSelection.length === 0) {
          this.$data.error.items = '请先筛选需要采购的商品';
          return;
        }

        let multipleSelection = this.$data.multipleSelection.map(item => {
          return Object.assign({}, item, {
            input: {
              supplier_id: '',
              total_price: '',
              unit_price: '',
              number: '',
              weight: ''
            }
          })
        })

        this.$data.editList = [...this.$data.editList, ...multipleSelection];

        // 每次添加成功后，清空多选列表的数据
        this.$data.multipleSelection = [];
        this.$data.error.items = '';
      },

      /**
       * 从编辑区移除门店
       * 1、将选中的门店从右侧编辑区列表移除
       * 2、computed属性，会自动计算需要在左侧显示的门店列表
       */
      handleRemoveClick(item) {
        // 从编辑列表删除
        this.$data.editList = this.$data.editList.filter(t => t.id !== item.id);
        this.$data.submitData.editList = this.$data.editList;

      },

      // 获取采购商品列表
      async getItemList() {
        let res = await Purchase.itemList(this.$data.query);
        if (res.code === 0) {
          this.$data.itemList = res.data;
        } else {
          Message.warning(res.message);
        }
      },
      handleShowEdit() {
        if (this.$data.editList.length === 0) {
          this.$data.error.items = '请先筛选需要采购的商品';
          return;
        }
        this.$data.submitData.editList = this.$data.editList;
        this.$data.isShowEdit = true;
      },
      handleSubmit() {
        let ruleForm = this.$refs.ruleForm;
        if (ruleForm.fields.some(item => item.validateState === '')) { // 表示有项目没有被验证
          ruleForm.validate();
          this.handleSubmit();
        } else {
          if (ruleForm.fields.some(item => item.validateState === 'error')) { // 表示有项目没有通过验证

          } else {
            let entity_dicts = this.$data.submitData.editList.map(item => (
              {
                item_id: item.id,
                supplier_id: item.input.supplier_id,
                total_price: DataHandle.handlePrice(item.input.total_price),
                number: Number(item.input.number),
                weight: DataHandle.handleWeight(item.input.weight),
                province_code: this.province.code
              }
            ))
            this.$props.submit(entity_dicts);
          }
        }
      }
    }
  }
</script>

<style lang="scss">

  .purchare-add {
    display: flex;
    justify-content: center;

    .select-list {
      height: 600px;
      width: 300px;
      overflow: auto;
      border-radius: 2px;
      border: 1px solid #DCDFE6;
    }
    .select-list > .header {
      padding: 0px 10px;
      border-bottom: 1px solid #DCDFE6;
      position: absolute;
      background-color: #fff;
      width: 280px;
      z-index: 99;
    }

    .edit-list {
      /*width: 1150px;*/
      height: 600px;
      overflow: auto;
      border-bottom: 1px solid #DCDFE6;
    }

    .edit-list > .header {
      height: 44px;
      color: #3B3D42;
      font-weight: 500;
      position: absolute;
      background-color: #fff;
      z-index: 99;
      width: inherit;
      border-bottom: 1px solid #DCDFE6;
    }

    .edit-list > .item > ul {
      padding: 10px 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .edit-list > .item > ul.stripe {
      background-color: #FBFBFD;
    }

    .edit-list .title {
      padding: 0 10px;
      width: 240px;
    }

    .edit-list .sale-num-last {
      width: 80px;
    }

    .edit-list .price-sale-last {
      width: 90px;
    }

    .edit-list .supplier {
      width: 180px;
    }

    .edit-list .total-price {
      width: 120px;
    }

    .edit-list .number {
      width: 120px;
    }

    .edit-list .weight {
      width: 120px;
    }

    .edit-list .unit-price {
      width: 120px;
    }

    .edit-list .operate {
      width: 60px;
    }

    /*table {*/
      /*font-size: 12px;*/
    /*}*/

    /*.el-table {*/
      /*font-size: 12px;*/
    /*}*/

    /*.el-checkbox__label {*/
      /*font-size: 12px;*/
    /*}*/

    .action {
      display: flex;

      li {
        margin-right: 5px;
      }

      a {
        font-size: 12px;
        text-decoration: underline;
      }

      a:hover {
        font-weight: 900;
      }
    }

    .into-out {
      i {
        cursor: pointer;
        font-size: 30px;
        color: #999999;
      }

      i:hover {
        color: #666;
      }

    }
  }

</style>
