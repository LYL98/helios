<template>
  <div>
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataSystemClassListAdd">
      <el-button @click="handleShowAddEdit('AddEditBasicDataSystemClass')" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataSystemClassListAdd">新增(第一层)</el-button>
    </div>
    <!-- 树型start -->
    <el-tree
      :data="dataItem"
      node-key="id"
      :style="{ overflowY: 'auto', overflowX: 'auto', height: windowHeight - offsetHeight + 'px'}"
      default-expand-all>
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span class="label">{{ node.label }}</span>
        <span class="options" @click.stop>
          <el-button
            type="text"
            size="mini"
            v-if="data.code.length >= 8 && (auth.isAdmin || auth.BasicDataSystemClassListAdd)"
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
            @click="() => handleDelete(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <!-- 树型end -->
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableBasicDataSystemClass',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.BasicDataSystemClassListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
      }
      this.getData();
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
        dataItem: [],
        rowIdentifier: 'code'
      }
    },
    methods: {
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataSystemClassListTree, {});
        this.$loading({isShow: false});
        if(res.code === 0){
          let rd = res.data;
          let fun = (dd) =>{
            dd.forEach(item => {
              item.id = item.code;
              item.label = item.title;
              if(item.childs && item.childs.length > 0){
                fun(item.childs);
              }
              item.children = item.childs;
            });
          }
          fun(rd);//递归
          this.$data.dataItem = rd;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //添加子分类
      addSystemClass(data){
        this.handleShowAddEdit('AddEditBasicDataSystemClass', {
          ...data,
          is_top_add: true
        });
      },
      //编辑子分类
      editSystemClass(data){
        this.handleShowAddEdit('AddEditBasicDataSystemClass', data);
      },
      //删除数据
      async deleteData(data) {
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.basicdataSystemClassDelete, {
          code: data.code
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: '已删除', type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
    >.label{
      margin-right: 60px;
    }
    >.options{
      display: none;
    }
  }
</style>
<style>
  .custom-tree-node:hover .options{
    display: block;
  }
</style>

