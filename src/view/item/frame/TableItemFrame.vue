<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.ItemFrameAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEditItemFrame')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20"/>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="title" label="名称" min-width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="筐重量" min-width="100">
          <template slot-scope="scope">
            {{ returnWeight(scope.row.weight) }}
          </template>
        </el-table-column>
        <el-table-column label="筐价格" min-width="100">
          <template slot-scope="scope">
            <div>
              {{ scope.row.price == 0 ? '' : '￥' }}{{scope.row.price == 0 ? '-' : returnPrice(scope.row.price)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="160">
          <template slot-scope="scope">
            <div>{{ scope.row.remark || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
          <template slot-scope="scope">
            <div>{{ scope.row.created }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.ItemFrameEdit,
                command: () => handleShowAddEdit('AddEditItemFrame', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.ItemFrameDelete,
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
    name: 'TableItemFrame',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      this.getData();
    },
    data() {
      return {
        dataItem: []
      }
    },
    methods: {
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataFrameList, {});
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
        let res = await Http.post(Config.api.basicdataFrameDelete, {
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
