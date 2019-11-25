<template>
  <div class="table-body">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupBannerAdd">
      <div class="left"></div>
      <div class="right" v-if="page === 'item'">
        <el-button v-if="auth.isAdmin || auth.GroupBannerAdd" @click="handleShowAddEdit('AddEditGroupBanner')" size="mini" type="primary">新增</el-button>
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
        <el-table-column type="selection" width="30" v-if="auth.isAdmin || auth.GroupBannerDelete || auth.GroupBannerRecover"></el-table-column>
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--编号名称-->
              <template v-if="item.key === 'code_title'">
                <div class="td-item add-dot2">
                  <div class="link-item" @click="handleShowDetail('DetailGroupBanner', scope.row)" v-if="((auth.isAdmin || auth.GroupBannerDetail) && page === 'item') || ((auth.isAdmin || auth.GroupBannerRecoverDetail) && page === 'recover')">
                    {{scope.row.code}}/{{scope.row.title}}
                  </div>
                  <div v-else>
                    {{scope.row.code}}/{{scope.row.title}}
                  </div>
                </div>
              </template>
              <!--商品分类-->
              <div class="td-item add-dot2" v-else-if="item.key === 'category'">{{scope.row.category.title || '-'}}</div>
              <!--市场价、建议团长价、建议团购价-->
              <div class="td-item add-dot2" v-else-if="item.key === 'price_origin' || item.key === 'advice_header_price' || item.key === 'advice_price_sale'">&yen;{{returnPrice(scope.row[item.key])}}</div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
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
                  isDisplay: (auth.isAdmin || auth.GroupBannerEdit) && page === 'item',
                  command: () => handleShowAddEdit('AddEditGroupBanner', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: (auth.isAdmin || auth.GroupBannerDelete) && page === 'item',
                  command: () => handleDelete({ids: [scope.row.id]})
                },
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
    name: 'TableGroupBanner',
    components: {
    },
    mixins: [tableMixin],
    props: {
      page: { type: String, default: 'item' }, //页面item、recover
    },
    created() {
      if(!this.auth.isAdmin && !this.auth.GroupBannerAdd){
          this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION;
        }
      let pc = this.getPageComponents('QueryGroupBanner');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        tableName: 'TableGroupBanner',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '360', isShow: true },
          { label: '商品分类', key: 'category', width: '180', isShow: true },
          { label: '市场价', key: 'price_origin', width: '100', isShow: true },
          { label: '建议团长价', key: 'advice_header_price', width: '100', isShow: true },
          { label: '建议团购价', key: 'advice_price_sale', width: '100', isShow: true },
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
</style>
