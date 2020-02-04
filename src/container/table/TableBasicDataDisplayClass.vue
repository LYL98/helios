<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.BasicDataDisplayClassListAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEditBasicDataDisplayClass')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table :data="dataItem"
                :row-class-name="highlightRowClassName"
                class="list-table my-table-float"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
                :highlight-current-row="true"
                :row-key="rowIdentifier"
                :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20"/>
        <el-table-column prop="code" label="编号" min-width="150">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" min-width="150">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{ scope.row.remark || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{ scope.row.created }}</div>
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
                isDisplay: auth.isAdmin || auth.BasicDataDisplayClassListUpdate,
                command: () => handleShowAddEdit('AddEditBasicDataDisplayClass', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataDisplayClassListDelete,
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
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableBasicDataDisplayClass',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.BasicDataDisplayClassListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT
      }
      let pc = this.getPageComponents('QueryBasicDataDisplayClass'); //获取query组件
      this.getData(pc.query);
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
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataDisplayClassList, query);
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
        let res = await Http.post(Config.api.basicdataDisplayClassDelete, {
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
  @import './table.scss';
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
