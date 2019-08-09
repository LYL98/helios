<template>
  <div class="table-body">
    <div class="table-top" v-if="page === 'global' && (auth.isAdmin || auth.ItemGlobalAdd || auth.ItemGlobalExport)">
      <el-button @click="handleExport('pItemExport', query)" size="mini" v-if="auth.isAdmin || auth.ItemGlobalExport">导出商品池</el-button>
      <el-button @click="handleShowAddEdit('AddEditItemGlobal')" size="mini" type="primary" v-if="auth.isAdmin || auth.ItemGlobalAdd">新增</el-button>
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
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <!--table-column start-->
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
          <div slot-scope="scope" class="my-td-item">
            <!--编号名称-->
            <template v-if="item.key === 'code_title'">
              <div v-if="(page === 'global' && (auth.isAdmin || auth.ItemGlobalDetail)) || (page === 'recover' && (auth.isAdmin || auth.ItemRecoverDetail))"
                class="td-item link-item add-dot2" @click="handleShowDetail('DetailItemGlobal', scope.row)">
                <span>{{scope.row.code}}</span>
                <span>/</span>
                <span>{{scope.row.title}}</span>
              </div>
              <div class="td-item add-dot2" v-else>
                <span>{{scope.row.code}}</span>
                <span>/</span>
                <span>{{scope.row.title}}</span>
              </div>
            </template>
            <!--框-->
            <div class="td-item" v-else-if="item.key === 'frame'">
              <span v-if="scope.row.frame_code">{{scope.row.frame.title}}&nbsp;(&yen;{{returnPrice(scope.row.frame.price)}})</span>
              <span v-else>-</span>
            </div>
            <!--毛重、净重-->
            <div class="td-item" v-else-if="item.key === 'gross_weight' || item.key === 'net_weight'">{{returnWeight(scope.row[item.key])}}斤</div>
            <!--科学分类-->
            <div class="td-item" v-else-if="item.key === 'system_class'">{{scope.row.system_class.title}}</div>
            <!--正常情况-->
            <div class="td-item" v-else>{{scope.row[item.key]}}</div>
          </div>
        </el-table-column>
        <!--table-column end 操作占位-->
        <el-table-column label min-width="1"/>
        <el-table-column label="操作" width="100" fixed="right" header-align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改',
                  isDisplay: page === 'global' && (auth.isAdmin || auth.ItemGlobalEdit),
                  command: () => handleShowAddEdit('AddEditItemGlobal', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: page === 'global' && (auth.isAdmin || auth.ItemGlobalDelete),
                  command: () => handleDelete(scope.row)
                },
                {
                  title: '恢复',
                  isDisplay: page === 'recover' && (auth.isAdmin || auth.ItemRecoverRecover),
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
        <!--<el-button type="danger" size="mini" disabled>批量删除</el-button>-->
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
    name: 'TableItemGlobal',
    components: {
    },
    mixins: [tableMixin],
    props: {
      page: { type: String, default: 'global' }, //页面global、recover
    },
    created() {
      if ((!this.auth.isAdmin && !this.auth.ItemGlobalAdd && !this.auth.ItemGlobalExport) || this.page === 'recover') {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
      let pc = this.getPageComponents('QueryItemGlobal');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
        tableName: 'TableItemGlobal',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '240', isShow: true },
          { label: '筐', key: 'frame', width: '160', isShow: true },
          { label: '产地', key: 'origin_place', width: '200', isShow: true },
          { label: '包装规格', key: 'package_spec', width: '160', isShow: false },
          { label: '规格', key: 'item_spec', width: '160', isShow: false },
          { label: '毛重', key: 'gross_weight', width: '120', isShow: false },
          { label: '净重', key: 'net_weight', width: '120', isShow: false },
          { label: '科学分类', key: 'system_class', width: '200', isShow: true },
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
        let res = await Http.get(Config.api.pItemQuery, query);
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
        let res = await Http.post(Config.api.pItemDelete, {
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
      //恢复数据（回收站页面用）
      handleRecover(data){
        this.$messageBox.confirm(`您确认要恢复？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.pItemRecover, {
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
