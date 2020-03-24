<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupActivityEditLog || auth.GroupActivityAdd">
      <div class="left"></div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.GroupActivityEditLog" @click.native="handleShowDetail('DetailGroupActivityEditLog')" size="mini" type="primary" plain>操作记录</el-button>
        <el-button v-if="auth.isAdmin || auth.GroupActivityAdd" @click="handleShowAddEdit('AddEditGroupActivity')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
          <div slot-scope="scope" class="my-td-item">
            <!--编号名称-->
            <template v-if="item.key === 'tid_title'">
              <div class="td-item add-dot2">
                <div class="link-item" @click="handleShowDetail('DetailGroupActivity', scope.row)" v-if="auth.isAdmin || auth.GroupActivityDetail">
                  {{scope.row.tid}}/{{scope.row.title}}
                </div>
                <div v-else>
                  {{scope.row.tid}}/{{scope.row.title}}
                </div>
              </div>
            </template>
            <!--团购状态-->
            <div class="td-item add-dot2" v-else-if="item.key === 'progress_status'">
              <el-tag size="small" :type="statusTagType[scope.row.progress_status]" disable-transitions>
                {{ progressStatus[scope.row.progress_status] }}
              </el-tag>
            </div>
            <!--上架状态-->
            <div class="td-item add-dot2" v-else-if="item.key === 'status'">
              <el-tag size="small" :type="scope.row.status === 'activated' ? 'regular' : 'info'" disable-transitions>
                {{ activityStatus[scope.row.status] }}
              </el-tag>
            </div>
            <!--正常情况-->
            <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改',
                  isDisplay: (auth.isAdmin || auth.GroupActivityEdit) && judgeOrs(scope.row.progress_status, ['pre', 'ing']),
                  command: () => handleShowAddEdit('AddEditGroupActivity', {...scope.row, type: 'edit'})
                },
                {
                  title: '上架',
                  isDisplay: (auth.isAdmin || auth.GroupActivityActive) && scope.row.status === 'deactivated' && judgeOrs(scope.row.progress_status, ['pre', 'ing']),
                  command: () => handleActive(scope.row)
                },
                {
                  title: '下架',
                  isDisplay: (auth.isAdmin || auth.GroupActivityDeactive) && scope.row.status === 'activated' && judgeOrs(scope.row.progress_status, ['pre', 'ing']),
                  command: () => handleDeactive(scope.row)
                },
                {
                  title: '作废',
                  isDisplay: (auth.isAdmin || auth.GroupActivityNullify) && scope.row.progress_status === 'pre',
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
        <pagination :pageComponent='this'/>
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'TableGroupActivity',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryGroupActivity');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableGroupActivity',
        tableColumn: [
          { label: '团购编号/名称', key: 'tid_title', width: '240', isShow: true },
          { label: '开始时间', key: 'start_time', width: '120', isShow: true },
          { label: '结束时间', key: 'end_time', width: '120', isShow: true },
          { label: '商品数量', key: 'sku_num', width: '80', isShow: true },
          { label: '团购状态', key: 'progress_status', width: '100', isShow: true },
          { label: '上架状态', key: 'status', width: '100', isShow: true },
          { label: '发货时间', key: 'delivery_date', width: '120', isShow: true },
          { label: '创建时间', key: 'created', width: '120', isShow: false },
          { label: '更新时间', key: 'updated', width: '120', isShow: false },
        ],
        activityStatus: Constant.GROUP_ACTIVITY_STATUS,
        progressStatus: Constant.GROUP_ACTIVITY_PROGRESS_STATUS,
        statusTagType: Constant.GROUP_ACTIVITY_PROGRESS_STATUS_TYPE,
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
      handleActive(data){
        this.$messageBox.confirm(`您确认上架？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupActivityActive,  { id: data.id });
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
      //下架
      handleDeactive(data){
        this.$messageBox.confirm(`您确认下架？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupActivityDeactive, { id: data.id });
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
            let res = await Http.post(Config.api.groupActivityNullify, { id: data.id });
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
  @import '@/share/scss/table.scss';
</style>
