<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.WarehouseDistributeExport">
      <div class="left"></div>
      <div class="right">
        <el-button @click.native="handleExport('supDistributeExport', query)" size="mini" type="primary" plain>导出调拨单</el-button>
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
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--采购编号、调拨单号-->
              <div v-if="item.key === 'code'" class="td-item add-dot2">
                <div v-if="auth.isAdmin || auth.WarehouseDistributeDetail"
                  class="td-item link-item add-dot2" @click="handleShowDetail('DetailWarehouseDistribute', scope.row)">
                  {{scope.row.code}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.code}}
                </div>
              </div>
              <!--商品名称-->
              <div v-else-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
              <!--日期-->
              <div v-else-if="item.key === 'date'" class="td-item add-dot2">
                {{scope.row.order_date || scope.row.available_date}}
              </div>
              <!--调出仓、调入仓-->
              <div v-else-if="judgeOrs(item.key, ['src_storehouse', 'tar_storehouse'])" class="td-item add-dot2">{{scope.row[item.key].title}}</div>
              <!--状态-->
              <div class="td-item add-dot2" v-else-if="item.key === 'status'">
                <el-tag size="small" :type="distributeStatusType[scope.row.status]" disable-transitions>
                  {{distributeStatus[scope.row.status]}}
                </el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseDistributeDetail,
                  command: () => handleShowDetail('DetailWarehouseDistribute', scope.row)
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
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'TableWarehouseDistribute',
    components: {
    },
    mixins: [tableMixin],
    created() {
      //已在query组件初始化
      //let pc = this.getPageComponents('QueryWarehouseDistribute');
      //this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableWarehouseDistribute',
        tableColumn: [
          { label: '调拨单号', key: 'code', width: '3', isShow: true },
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '调出仓', key: 'src_storehouse', width: '3', isShow: true },
          { label: '调拨数量', key: 'num', width: '2', isShow: true },
          { label: '调入仓', key: 'tar_storehouse', width: '3', isShow: true },
          { label: '销售日期', key: 'date', width: '3', isShow: true },
          { label: '状态', key: 'status', width: '2', isShow: true },
          { label: '创建时间', key: 'created', width: '3', isShow: false },
          { label: '更新时间', key: 'updated', width: '3', isShow: false }
        ],
        distributeStatus: Constant.DISTRIBUTE_STATUS(),
        distributeStatusType: Constant.DISTRIBUTE_STATUS_TYPE,
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeQuery, query);
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
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
