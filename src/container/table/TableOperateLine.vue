<template>
  <div>
    <div class="table-top" v-if="auth.isAdmin || auth.OperateLineAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEditOperateLine')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table
        class="list-table my-table-float"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>
        <el-table-column prop="title" label="线路编号 / 名称" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }} / {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属省份" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{scope.row.province && scope.row.province.title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="包含县域" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)" v-for="(item, index) in scope.row.citys" :key="index">
              {{item.title}}{{'（' + item.item_num + '件）'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="配送员" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
            <span v-for="(item, index) in scope.row.distributors" :key="index">
              {{item.realname}}{{index === scope.row.distributors.length-1 ? '' : ', '}}
            </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="item_num" label="线路总件数" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.item_num }}
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="created" label="创建时间" width="100"/>-->
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.OperateLineEdit,
                command: () => handleShowAddEdit('AddEditOperateLine', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.OperateLineDelete,
                command: () => handleDelete(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent="this" />
      </div>
    </div>
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'FrameList',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryOperateLine'); //获取query组件
      this.getData(pc.query);
    },
    data() {
      return {
        rowIdentifier: 'code'
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.operateLineList, query);
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
        let res = await Http.post(Config.api.basicdataZoneDelete, {
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
<style scoped>
</style>
