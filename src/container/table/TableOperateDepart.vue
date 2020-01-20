<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin|| auth.OperateDepartAffirm || auth.OperateDepartPrint  || auth.OperateDepartStockout">
      <div class="left">
        <el-button @click="handleShowForm('FormOperateDepartAffirm', [multipleSelection])" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false" v-if="auth.isAdmin || auth.OperateDepartAffirm">批量确认</el-button>
        <el-button @click="handleShowPrint('PrintOperateDepart', [multipleSelection])" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false" plain v-if="auth.isAdmin || auth.OperateDepartPrint">批量打印</el-button>
      </div>
      <div class="right" v-if="auth.isAdmin || auth.OperateDepartStockout">
        <el-button @click="handleShowDetail('DetailOperateDepartStockout', {})" size="mini" type="primary" plain>缺货记录</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        @selection-change="handleSelectionChange"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="selection" :selectable="returnStatus" width="42" v-if="(auth.isAdmin || auth.OperateDepartPrint || auth.OperateDepartAffirm)"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--线路-->
              <template v-if="item.key === 'line'">
                <div class="td-item add-dot">
                  <div class="link-item add-dot" @click="handleShowDetail('DetailOperateDepart', {
                    delivery_date: query.delivery_date,
                    line_code: scope.row.line.code,
                    ...scope.row
                  })" v-if="auth.isAdmin || auth.OperateDepartDetail">
                    {{scope.row.line.code}}/{{scope.row.line.title}}
                  </div>
                  <div class="add-dot" v-else>
                    {{scope.row.line.code}}/{{scope.row.line.title}}
                  </div>
                </div>
              </template>
              <!--数量-->
              <div v-else-if="judgeOrs(item.key, ['count_real', 'allocate_num'])" class="td-item add-dot2">{{scope.row[item.key] ? scope.row[item.key] + '件' : '-'}}</div>
              <!--缺货-->
              <div v-else-if="item.key === 'stockout'" class="td-item add-dot2">
                {{scope.row.count_real - scope.row.allocate_num === 0 ? '-' : (scope.row.count_real - scope.row.allocate_num) + '件'}}
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '确认',
                  isDisplay: (auth.isAdmin || auth.OperateDepartAffirm) && !scope.row.allocated_time,
                  command: () => handleShowForm('FormOperateDepartAffirm', [scope.row])
                },{
                  title: '详情',
                  isDisplay: (auth.isAdmin || auth.OperateDepartDetail) && scope.row.allocated_time,
                  command: () => handleShowDetail('DetailOperateDepart', {
                    delivery_date: query.delivery_date,
                    line_code: scope.row.line.code,
                    ...scope.row
                  })
                },{
                  title: '司机轨迹',
                  isDisplay: (auth.isAdmin || auth.OperateDepartDriverTrack) && scope.row.allocated_time,
                  command: () => handleShowDetail('DetailOperateDepartDriverTrack', scope.row)
                },{
                  title: '打印',
                  isDisplay: (auth.isAdmin || auth.OperateDepartPrint) && scope.row.allocated_time,
                  command: () => handleShowPrint('PrintOperateDepart', [scope.row])
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
  import { Http, Config, Constant } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableOperateDepart',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryOperateDepart');
      this.getData(pc.query);
    },
    data() {
      return {
        inventoryStatus: Constant.INVENTORY_STATUS(),
        inventoryStatusType: Constant.INVENTORY_STATUS_TYPE,
        tableName: 'TableOperateDepart',
        tableColumn: [
          { label: '线路', key: 'line', width: '4', isShow: true },
          { label: '应出库', key: 'count_real', width: '2', isShow: true },
          { label: '实际出库', key: 'allocate_num', width: '3', isShow: true },
          { label: '缺货', key: 'stockout', width: '3', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ],
        dataItem: []
      }
    },
    methods: {
      //返回是否可选中
      returnStatus(d){
        return true;
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supConfirmWait, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
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
