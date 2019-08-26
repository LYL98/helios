<template>
  <div class="table-body">
    <div class="table-top" v-if="(auth.isAdmin || auth.GroupBuyExport || auth.GroupBuyAuditInnerTag)">
      <el-button v-if="auth.isAdmin || auth.GroupBuyExport" @click.native="handleExport('itemExport', query)" size="mini" type="primary" plain>操作日志</el-button>
      <el-button v-if="auth.isAdmin || auth.GroupBuyAuditInnerTag" @click="handleShowDetail('DetailGroupBuyAuditInnerTag')" size="mini" type="primary">新增</el-button>
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
                <div class="link-item add-dot" @click="handleShowDetail('DetailGroupBuy', scope.row)" v-if="auth.isAdmin || auth.GroupBuyDetail">
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
                <div class="add-dot" v-else>
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
              </div>
            </template>
            <!--原价-->
            <div class="td-item add-dot2" v-else-if="item.key === 'price'">&yen;{{returnPrice(scope.row.price)}}</div>
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
                  isDisplay: (auth.isAdmin || auth.GroupBuyEdit) && page === 'buy',
                  command: () => handleShowAddEdit('AddEditGroupBuy', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: (auth.isAdmin || auth.GroupBuyOnGround) && page === 'buy',
                  command: () => handleDelete(scope.row)
                },
                {
                  title: '恢复',
                  isDisplay: (auth.isAdmin || auth.GroupBuyOnGround) && page === 'buyRecover',
                  command: () => handleRecover(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <el-button type="danger" size="mini" disabled v-if="page === 'buy'">批量删除</el-button>
        <el-button size="mini" disabled v-if="page === 'buyRecover'">批量恢复</el-button>
      </div>
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
    name: 'TableGroupBuy',
    components: {
    },
    mixins: [tableMixin],
    props: {
      page: { type: String, default: 'buy' }, //页面buy、buyRecover
    },
    created() {
      if (!this.auth.isAdmin && !this.auth.GroupBuyExport && !this.auth.GroupBuyAuditInnerTag) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
      let pc = this.getPageComponents('QueryGroupBuy');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        tableName: 'TableGroupBuy',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '360', isShow: true },
          { label: '原价', key: 'price', width: '240', isShow: true },
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
        let res = await Http.get(Config.api.groupBuyQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除数据
      async deleteData(data){
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.groupBuyDelete, {
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
      //恢复
      handleRecover(data){
        this.$messageBox.confirm(`您确认要恢复？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.groupBuyRecover, {
              id: data.id
            });
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
