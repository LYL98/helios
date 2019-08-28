<template>
  <div class="table-body">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupActivityEditLog || auth.GroupActivityAdd">
      <el-button v-if="auth.isAdmin || auth.GroupActivityEditLog" @click.native="handleShowDetail('DetailGroupActivityEditLog')" size="mini" type="primary" plain>操作记录</el-button>
      <el-button v-if="auth.isAdmin || auth.GroupActivityAdd" @click="handleShowAddEdit('AddEditGroupActivity')" size="mini" type="primary">新增</el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :height="windowHeight - offsetHeight"
        class="list-table"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
          <div slot-scope="scope" class="my-td-item">
            <!--编号名称-->
            <template v-if="item.key === 'code_title'">
              <div class="td-item add-dot2">
                <div class="link-item add-dot" @click="handleShowDetail('DetailGroupActivity', scope.row)" v-if="auth.isAdmin || auth.GroupActivityDetail">
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
                <div class="add-dot" v-else>
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
              </div>
            </template>
            <!--团购状态-->
            <div class="td-item add-dot2" v-else-if="item.key === 'status'">
              12
            </div>
            <!--上架状态-->
            <div class="td-item add-dot2" v-else-if="item.key === 'status'">
              12
            </div>
            <!--正常情况-->
            <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
          </div>
        </el-table-column>
        <!--table-column end 操作占位-->
        <el-table-column label min-width="1"/>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.GroupActivityEdit,
                  command: () => handleShowAddEdit('AddEditGroupActivity', {...scope.row, type: 'edit'})
                },
                {
                  title: '上架',
                  isDisplay: auth.isAdmin || auth.GroupActivityPutaway,
                  command: () => handlePutaway(scope.row)
                },
                {
                  title: '作废',
                  isDisplay: auth.isAdmin || auth.GroupActivityNullify,
                  command: () => handleNullify(scope.row)
                },
                {
                  title: '复制',
                  isDisplay: auth.isAdmin || auth.GroupActivityCopy,
                  command: () => handleShowAddEdit('AddEditGroupActivity', {...scope.row, type: 'copy'})
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableGroupActivity',
    components: {
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.GroupActivityEditLog && !this.auth.GroupActivityAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
      let pc = this.getPageComponents('QueryGroupActivity');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        tableName: 'TableGroupActivity',
        tableColumn: [
          { label: '团购编号/名称', key: 'code_title', width: '360', isShow: true },
          { label: '开始时间', key: 'begin_date', width: '160', isShow: true },
          { label: '结束时间', key: 'end_time', width: '160', isShow: true },
          { label: '商品数量', key: 'num', width: '120', isShow: true },
          { label: '团购状态', key: 'status', width: '160', isShow: true },
          { label: '上架状态', key: 'status', width: '160', isShow: true },
          { label: '发货时间', key: 'status', width: '160', isShow: true },
          { label: '创建时间', key: 'created', width: '160', isShow: true },
          { label: '更新时间', key: 'updated', width: '160', isShow: false },
        ],
        groupActivityStatus: Constant.GROUP_ACTIVITY_STATUS,
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.groupActivityQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //上架
      handlePutaway(data){
        this.$messageBox.confirm(`您确认上架？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupActivityPutaway, data);
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已上架', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      },
      //作废
      handleNullify(data){
        this.$messageBox.confirm(`您确认作废？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupActivityNullify, data);
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已作废', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
</style>
