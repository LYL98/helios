<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.OperateSortPrint">
      <div class="left">
        <el-button @click="handleShowPrint('PrintOperateSort', multipleSelection)" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false" plain>批量打印</el-button>
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        row-key="code"
        :current-row-key="clickedRow['code']"
        default-expand-all
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-for="item in props.row.out_stocks" :key="item.id" class="out-stock-item">
              <div class="select"></div>
              <div>入场：30件</div>
              <div>入场时间：10:10:10</div>
              <div>分配人：-</div>
              <div>分配时间：10:10:10</div>
              <div>装车：30件</div>
              <div class="option">
                <a href="javascript:void(0);">分配</a>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.code}}/{{scope.row.title}}</div>
              <!--数量-->
              <div v-else-if="item.key === 'num'" class="td-item add-dot2">
                <template v-if="scope.row.allocated_time">{{returnUnit(scope.row.allocated_num, '件', '-')}}</template>
                <template v-else>{{returnUnit(scope.row.num, '件', '-')}}</template>
              </div>
              <!--分拣数量-->
              <div v-else-if="item.key === 'sort_num'" class="td-item add-dot2">{{returnUnit(scope.row.sort_num, '件', '-')}}</div>
              <!--日期-->
              <div v-else-if="item.key === 'allocated_time'" class="td-item add-dot2">
                {{scope.row.allocated_time || '-'}}
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
                  title: '分配',
                  isDisplay: (auth.isAdmin || auth.OperateSortAdd) && !scope.row.allocated_time,
                  command: () => handleShowAddEdit('AddEditOperateSort', scope.row, 'add')
                },{
                  title: '详情',
                  isDisplay: (auth.isAdmin || auth.OperateSortDetail) && scope.row.allocated_time,
                  command: () => handleShowDetail('DetailOperateSort', scope.row)
                },{
                  title: '打印',
                  isDisplay: (auth.isAdmin || auth.OperateSortPrint) && returnStatus(scope.row),
                  command: () => handleShowPrint('PrintOperateSort', [scope.row])
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
    name: 'TableOperateSort',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryOperateSort');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableOperateSort',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '应出', key: 'num', width: '2', isShow: true },
          { label: '入场', key: 'created', width: '3', isShow: true },
          { label: '分配', key: 'allocated_time', width: '3', isShow: true },
          { label: '装车', key: 'sort_num', width: '2', isShow: true },
        ],
      }
    },
    methods: {
      //返回是否可选中
      returnStatus(d){
        return d.allocated_time && d.allocated_num ? true : false;
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supOutAllocateQuery, query);
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
  .out-stock-item{
    display: flex;
    align-items: center;
    padding: 6px 0;
    >div{
      flex: 1;
    }
    >.option{
      flex: initial !important;
      width: 120px;
      font-size: 12px;
    }
  }
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
