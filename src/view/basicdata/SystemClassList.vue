<template>
  <div class="system-class-list">
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataSystemClassListAdd">
      <el-button @click="basicDataSystemClassShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataSystemClassListAdd">新增(第一层)</el-button>
    </div>
    <!-- 树型start -->
    <el-tree
      :data="dataItem"
      node-key="id"
      :style="{ overflowY: 'auto', overflowX: 'auto', height: windowHeight - offsetHeight + 'px'}"
      default-expand-all>
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            v-if="auth.isAdmin || auth.BasicDataSystemClassListAdd"
            @click="() => addSystemClass(data)">
            添加子分类
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="auth.isAdmin || auth.BasicDataSystemClassListUpdate"
            @click="() => editSystemClass(data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="auth.isAdmin || auth.BasicDataSystemClassListDelete"
            @click="() => deleteSystemClass(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <!-- 树型end -->
    <my-system-class-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Tree, Button, MessageBox } from 'element-ui';
import { Config, Constant } from '@/util';
import SystemClassAddEdit from './SystemClassAddEdit';

export default {
  name: 'SystemClassList',
  components: {
    'el-tree': Tree,
    'el-button': Button,
    'my-system-class-add-edit': SystemClassAddEdit
  },
  created(){
    documentTitle("信息 - 科学分类列表");
    this.basicdataSystemClassListTree();

    if (!this.auth.isAdmin && !this.auth.BasicDataSystemClassListAdd) {
      this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
    }
  },
  computed: mapGetters({
    dataItem: 'basicDataSystemClassListDataItem',
    auth: 'globalAuth',
    windowHeight: 'windowHeight'
  }),
  data() {
    return {
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE
    }
  },
  methods: {
    //组件回调
    myCallBack(res){
      this.basicdataSystemClassListTree();
    },
    //添加子分类
    addSystemClass(data){
      this.basicDataSystemClassShowHideAddEdit({
        isShow: true,
        data: {
          ...data,
          is_top_add: true
        }
      });
    },
    //编辑子分类
    editSystemClass(data){
      this.basicDataSystemClassShowHideAddEdit({
        isShow: true,
        data: data
      });
    },
    //删除
    deleteSystemClass(data) {
      let that = this;
      MessageBox.confirm(`您确认要删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         that.basicDataSystemClassDelete({
            data: {
              code: data.code
            },
            callback: ()=>{
              that.basicdataSystemClassListTree();
            }
          });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    ...mapActions(['basicdataSystemClassListTree', 'basicDataSystemClassDelete', 'basicDataSystemClassShowHideAddEdit'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .div-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 10;
    background: white
  }
</style>
