<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.MerchantInnerTagsAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEdit')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div>
      <el-table
        class="list-table my-table-float"
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column prop="title" label="名称" min-width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签项" min-width="300">
          <template slot-scope="scope">
            <el-tag type="info" disable-transitions v-for="(item, index) in scope.row.child_tags" :key="index" style="margin: 0 5px 5px 0;">{{item.title}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
          <template slot-scope="scope">
            <div>
              {{ scope.row.created }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.MerchantInnerTagsEdit,
                command: () => handleShowAddEdit('AddEdit', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.MerchantInnerTagsDelete,
                command: () => handleDelete(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'Table',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('Query'); //获取query组件
      this.getData(pc.query);
    },
    data() {
      return {
        dataItem: [],
        rowIdentifier: 'code'
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataMerchantInnerTagsList, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除数据
      async deleteData(data) {
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.basicdataMerchantInnerTagsDelete, {
          id: data.id
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
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
