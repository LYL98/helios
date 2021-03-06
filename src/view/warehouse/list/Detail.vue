<template>
  <detail-layout title="仓库详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <h6 class="subtitle">库信息</h6>
      <el-table :data="dataItem.warehouse.id ? [dataItem.warehouse] : []" :row-class-name="highlightRowClassName">
        <el-table-column prop="title" label="库名称"/>
        <el-table-column prop="title" label="所属仓">
          <template slot-scope="scope">{{scope.row.storehouse.title}}</template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="260"/>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <a href="javascript: void(0);" @click="operate(scope.row, 'edit')" style="margin-right: 10px;" v-if="auth.isAdmin || auth.WarehouseListEdit">修改</a>
            <a href="javascript: void(0);" @click="operate(scope.row, 'delete')" v-if="auth.isAdmin || auth.WarehouseListDelete">删除</a>
          </template>
        </el-table-column>
      </el-table>

      <h6 class="subtitle" style="margin-top: 20px;">托盘信息</h6>
      <div class="tray-top">
        <div class="left">
          <el-button size="mini" type="primary" v-if="auth.isAdmin || auth.WarehouseListTrayPrint"
            @click.native="handlePrint(multipleSelection)" :disabled="multipleSelection.length > 0 ? false : true">批量打印</el-button>
          <el-button size="mini" type="primary" v-if="auth.isAdmin || auth.WarehouseListTrayPrint"
                     @click.native="handlePrintPreview(multipleSelection)" :disabled="multipleSelection.length > 0 ? false : true">打印预览</el-button>
        </div>
        <div class="right">
          <el-button @click="operate({}, 'add_tray')" size="mini" type="primary" v-if="auth.isAdmin || auth.WarehouseListTrayAdd">增加拖盘</el-button>
        </div>
      </div>
      <el-table :data="dataItem.items" :row-class-name="highlightRowClassName" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="42" v-if="auth.isAdmin || auth.WarehouseListTrayPrint"></el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" align="center"/>
        <el-table-column prop="code" label="托盘编号"/>
        <el-table-column prop="created" label="创建时间" width="260"/>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <a href="javascript: void(0);" style="margin-right: 10px;" @click="operate(scope.row, 'edit_tray')" v-if="auth.isAdmin || auth.WarehouseListTrayEdit">修改</a>
            <a href="javascript: void(0);" style="margin-right: 10px;" @click="handlePrint([scope.row])" v-if="auth.isAdmin || auth.WarehouseListTrayPrint">打印</a>
            <a href="javascript: void(0);" style="margin-right: 10px;" @click="handlePrintPreview([scope.row])" v-if="auth.isAdmin || auth.WarehouseListTrayPrint">打印预览</a>
            <a href="javascript: void(0);" @click="operate(scope.row, 'delete_tray')" v-if="auth.isAdmin || auth.WarehouseListTrayDelete">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="tray-bottom">
        <div class="left"></div>
        <div class="right">
          <pagination :pageComponent="this" />
        </div>
      </div>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant, Lodop } from '@/util';
  import Pagination from '@/share/layout/Pagination';

  export default {
    name: "Detail",
    mixins: [detailMixin],
    components: {
      'pagination': Pagination
    },
    data() {
      return {
        initDetail: {},
        query: {
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        dataItem: {
          warehouse: {},
          items: [],
          num: 0
        },
        multipleSelection: []
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.query.id = data.id;
        this.$data.query.page = 1;
        this.getDetail();
      },
      //获取详情
      async getDetail(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataWarehouseDetail, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          this.$data.dataItem = res.data;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //选择
      handleSelectionChange(val) {
        this.$data.multipleSelection = val;
      },
      //操作
      operate(data, type) {
        let pc = this.getPageComponents('Table');
        //删除库
        if(type === 'delete'){
          pc.handleDelete(data);
          return;
        }

        //修改库
        if(type === 'edit'){
          pc.handleShowAddEdit('AddEdit', data, 'edit');
          return;
        }

        data = {
          ...data,
          warehouse_id: this.dataItem.warehouse.id,
          warehouse: this.dataItem.warehouse
        };
        //新增托盘
        if(type === 'add_tray'){
          pc.handleShowAddEdit('AddEditTray', data, 'add');
          return;
        }

        //修改托盘
        if(type === 'edit_tray'){
          pc.handleShowAddEdit('AddEditTray', data, 'edit');
          return;
        }

        //删除托盘
        if(type === 'delete_tray'){
          this.$messageBox.confirm(`您确认要删除？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteData(data);
          }).catch(() => {
            //console.log('取消');
          });
        }
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        this.$data.query.page_size = pageSize;
        this.$data.query.page = 1;
        this.getDetail();
      },
      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.getDetail();
      },
      //删除数据
      async deleteData(data) {
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.basicdataWarehouseTrayDelete, {
          id: data.id
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.$message({message: '已删除', type: 'success'});
          this.getDetail();
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      handlePrint(list) {
        let temp = Lodop.tempTrayCode(list);
        temp && temp.PRINT();
      },
      handlePrintPreview(list) {
        let temp = Lodop.tempTrayCode(list);
        temp && temp.PREVIEW();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
  .tray-top, .tray-bottom{
    display: flex;
    align-items: center;
    margin: 10px 0;
    >.left{
      flex: 1;
    }
  }
</style>
