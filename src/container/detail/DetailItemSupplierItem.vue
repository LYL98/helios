<template>
  <detail-layout title="供应商品" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <h6 class="subtitle">供应商信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商名称">{{detail.title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型">{{supplierType[detail.supplier_type]}}</el-form-item>
        </el-col>
      </el-row>
      <h6 class="subtitle">商品信息</h6>
      <el-row v-if="auth.isAdmin || auth.ItemSupplierItemEdit">
        <el-col :span="12">
          <el-form-item label="搜索">
            <select-g-item v-if="isShow" size="medium" placeholder="商品编号/名称"
              v-model="selectItemId" @change="changeItem" filterable clearable></select-g-item>
            <div v-if="selectItemData.error" class="el-form-item__error">{{selectItemData.error}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" size="medium" style="margin-left: 10px; position: relative; top: -4px;" @click.native="addItem">增加商品</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column prop="title" label="商品编号/名称" width="600">
          <template slot-scope="scope">
            {{ scope.row.code }}&nbsp;/&nbsp;{{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="weight_s" label="重量">
          <template slot-scope="scope">
            {{returnWeight(scope.row.weight_s)}}
            <span v-if="!!scope.row.weight_e"> - {{ returnWeight(scope.row.weight_e) }}</span>
            斤
          </template>
        </el-table-column>
        <template v-if="detail.supplier_type === 'local_pur'">
          <el-table-column prop="is_main" label="反采供应商">
            <template slot-scope="scope">
              <el-switch :disabled="(auth.isAdmin || auth.ItemSupplierItemEdit) ? false : true" v-model="scope.row.is_main" :active-value="true" :inactive-value="false">
              </el-switch>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80" v-if="auth.isAdmin || auth.ItemSupplierItemEdit">
          <template slot-scope="scope">
            <a href="javascript:void(0);" @click="deleteItem(scope.$index)">移除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 30px 0 0 140px;">
      <template v-if="auth.isAdmin || auth.ItemSupplierItemEdit">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="editBindItems">确 定</el-button>
      </template>
      <template v-else>
        <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
      </template>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';
  import { SelectItem, SelectGItem } from '@/component';

  export default {
    name: "DetailItemSupplierItem",
    mixins: [detailMixin],
    components: {
      'select-item': SelectItem,
      'select-g-item': SelectGItem
    },
    data() {
      let initDetail = {}
      return {
        supplierType: Constant.SUPPLIER_TYPE(),
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: [],
        selectItemData: {},
        selectItemId: '',
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.detail = data;
        this.$data.selectItemId = '';
        this.$data.selectItemData = {};
        this.getDetail(data.id);
      },
      //获取详情
      async getDetail(supplierId){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supplierBindItems, {
          supplier_id: supplierId
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          this.$data.dataItem = res.data;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //选择商品
      changeItem(data){
        this.$data.selectItemData = data;
      },
      //新增商品
      addItem(){
        let { dataItem, selectItemData } = this;
        if(selectItemData.id){
          let con = dataItem.filter(item => item.id === selectItemData.id);
          if(con.length > 0){
            this.$data.selectItemData = { error: '选择商品的商品已存在' };
            this.$data.selectItemId = '';
            return;
          }
          dataItem.push({
            ...selectItemData,
            is_main: false
          });
          this.$data.selectItemId = '';
        }else{
          this.$data.selectItemData = { error: '请选择商品' };
        }
        this.$data.dataItem = dataItem;
      },
      //移除商品
      deleteItem(index){
        let { dataItem } = this;
        dataItem.remove(index);
        this.$data.dataItem = this.copyJson(dataItem);
      },
      //修改绑定商品
      editBindItems(){
        let { detail, dataItem } = this;
        let data = {
          supplier_id: detail.id,
          bind_item_ids: []
        };
        if(detail.supplier_type === 'global_pur'){
          dataItem.forEach(item => {
            data.bind_item_ids.push(item.id);
          });
        }else{
          dataItem.forEach(item => {
            data.bind_item_ids.push({
              p_item_id: item.id,
              is_main: item.is_main
            });
          });
        }
        this.supplierBindItemsEdit(data);
      },
      //供应商品
      async supplierBindItemsEdit(data){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.post(Config.api.supplierBindItemsEdit, data);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$message({message: '供应商品修改成功', type: 'success'});
          this.handleCancel();
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
