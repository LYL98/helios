<template>
  <div class="table-body">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupStoreOrderEditLog || auth.GroupStoreOrderAdd || auth.GroupStoreOrderDelete || auth.GroupStoreOrderRecover">
      <div class="left">
        <el-button type="danger" size="mini" :disabled="multipleSelection.length === 0" @click.native="handleDelete('multi')" v-if="(auth.isAdmin || auth.GroupStoreOrderDelete) && page === 'item'">批量删除</el-button>
        <el-button size="mini" :disabled="multipleSelection.length === 0" @click.native="handleRecover('multi')" v-if="(auth.isAdmin || auth.GroupStoreOrderRecover) && page === 'recover'">批量恢复</el-button>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.GroupStoreOrderEditLog" @click.native="handleShowDetail('DetailGroupStoreOrderEditLog')" size="mini" type="primary" plain>操作记录</el-button>
        <el-button v-if="auth.isAdmin || auth.GroupStoreOrderAdd" @click="handleShowAddEdit('AddEditGroupStoreOrder')" size="mini" type="primary">新增</el-button>
      </div>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" v-if="auth.isAdmin || auth.GroupStoreOrderDelete || auth.GroupStoreOrderRecover"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
          <div slot-scope="scope" class="my-td-item">
            <!--编号名称-->
            <template v-if="item.key === 'code_title'">
              <div class="td-item add-dot2">
                <div class="link-item add-dot" @click="handleShowDetail('DetailGroupStoreOrder', scope.row)" v-if="((auth.isAdmin || auth.GroupStoreOrderDetail) && page === 'item') || ((auth.isAdmin || auth.GroupStoreOrderRecoverDetail) && page === 'recover')">
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
                <div class="add-dot" v-else>
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
              </div>
            </template>
            <!--原价、建议团长价、建议团购价-->
            <div class="td-item add-dot2" v-else-if="item.key === 'price_origin' || item.key === 'advice_header_price' || item.key === 'advice_price_sale'">&yen;{{returnPrice(scope.row[item.key])}}</div>
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
                  isDisplay: (auth.isAdmin || auth.GroupStoreOrderEdit) && page === 'item',
                  command: () => handleShowAddEdit('AddEditGroupStoreOrder', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: (auth.isAdmin || auth.GroupStoreOrderDelete) && page === 'item',
                  command: () => handleDelete({ids: [scope.row.id]})
                },
                {
                  title: '恢复',
                  isDisplay: (auth.isAdmin || auth.GroupStoreOrderRecover) && page === 'recover',
                  command: () => handleRecover({ids: [scope.row.id]})
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
    name: 'TableGroupStoreOrder',
    components: {
    },
    mixins: [tableMixin],
    props: {
      page: { type: String, default: 'item' }, //页面item、recover
    },
    created() {
      if (!this.auth.isAdmin && !this.auth.GroupStoreOrderEditLog && !this.auth.GroupStoreOrderAdd && !this.auth.GroupStoreOrderDelete && this.auth.GroupStoreOrderRecover) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION;
      }
      let pc = this.getPageComponents('QueryGroupStoreOrder');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        tableName: 'TableGroupStoreOrder',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '360', isShow: true },
          { label: '原价', key: 'price_origin', width: '160', isShow: true },
          { label: '建议团长价', key: 'advice_header_price', width: '160', isShow: true },
          { label: '建议团购价', key: 'advice_price_sale', width: '160', isShow: true },
          { label: '创建时间', key: 'created', width: '160', isShow: true },
          { label: '更新时间', key: 'updated', width: '160', isShow: false },
        ]
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.groupItemQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除数据
      async deleteData(data){
        //批量
        if(data === 'multi'){
          let { multipleSelection } = this;
          data = { ids: [] };
          multipleSelection.map((item)=>{
            data.ids.push(item.id);
          });
        }
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.groupItemDelete, data);
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: '已删除', type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //恢复
      handleRecover(data){
        //批量
        if(data === 'multi'){
          let { multipleSelection } = this;
          data = { ids: [] };
          multipleSelection.map((item)=>{
            data.ids.push(item.id);
          });
        }
        this.$messageBox.confirm(`您确认要恢复？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupItemRecover, data);
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已恢复', type: 'success'});
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
