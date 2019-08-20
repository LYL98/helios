<template>
  <div class="table-body">
    <div class="table-top" v-if="(auth.isAdmin || auth.ItemListExport || auth.ItemListAuditInnerTag)">
      <el-button v-if="auth.isAdmin || auth.ItemListExport" @click.native="handleExport('itemExport', query)" size="mini" type="primary" plain>导出商品</el-button>
      <el-button v-if="(auth.isAdmin || auth.ItemListAuditInnerTag) && query.is_on_sale === 1" @click="handleShowDetail('DetailItemListAuditInnerTag')" size="mini" type="primary">审核内标签</el-button>
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
              <div class="td-item add-dot">
                <div class="link-item add-dot" @click="handleShowDetail('DetailItemList', scope.row)" v-if="auth.isAdmin || auth.ItemDetail">
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
                <div class="link-item add-dot" v-else>
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
                <div class="add-dot" v-if="query.is_on_sale">
                  <span>&yen;{{returnPrice(scope.row.price_sale)}}/件</span>
                  <!--销售价 / 毛重-->
                  <span>（单价：{{returnPrice(scope.row.price_sale / (scope.row.gross_weight / 10))}}元/斤）</span>
                  <span class="is-presale" v-if="scope.row.is_presale">预</span>
                </div>
              </div>
            </template>
            <!--商品参数-->
            <div class="td-item add-dot2" v-else-if="item.key === 'parameter'">
              <span>{{scope.row.origin_place}}、</span>
              <span v-if="scope.row.item_spec">{{scope.row.item_spec}}、</span>
              <span>{{returnWeight(scope.row.gross_weight)}}斤</span>
            </div>
            <!--筐-->
            <div class="td-item" v-else-if="item.key === 'frame'">
              <span v-if="scope.row.frame_code">{{scope.row.frame.title}}&nbsp;(&yen;{{returnPrice(scope.row.frame.price)}})</span>
              <span v-else>-</span>
            </div>
            <!--毛重、净重-->
            <div class="td-item" v-else-if="item.key === 'gross_weight' || item.key === 'net_weight'">{{returnWeight(scope.row[item.key])}}斤</div>
            <!--科学分类-->
            <div class="td-item" v-else-if="item.key === 'system_class'">{{scope.row.system_class.title}}</div>
            <!--展示分类-->
            <div class="td-item" v-else-if="item.key === 'display_class'">{{scope.row.display_class.title || '-'}}</div>
            <!--库存-->
            <div class="td-item" v-else-if="item.key === 'item_stock'">{{query.is_on_sale ? scope.row.item_stock + '件' : '-'}}</div>
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
                  isDisplay: (auth.isAdmin || auth.ItemListEdit) && scope.row.is_on_sale,
                  command: () => handleShowAddEdit('AddEditItemList', { ...scope.row, type: 'edit' })
                },
                {
                  title: '上架',
                  isDisplay: (auth.isAdmin || auth.ItemListOnGround) &&  !scope.row.is_on_sale,
                  command: () => handleShowAddEdit('AddEditItemList', { ...scope.row, type: 'on_sale' })
                },
                {
                  title: '下架',
                  isDisplay: (auth.isAdmin || auth.ItemListUnderGround) && scope.row.is_on_sale,
                  command: () => itemUnderGround(scope.row)
                },
                {
                  title: '修改分类/外标签',
                  isDisplay: (auth.isAdmin || auth.ItemListTagsClassEdit) && scope.row.is_on_sale,
                  command: () => handleShowForm('FormItemListEditClassTag', scope.row)
                },
                {
                  title: '修改内标签',
                  isDisplay: (auth.isAdmin || auth.ItemListInnerTagsEdit) && scope.row.is_on_sale,
                  command: () => handleShowForm('FormItemListEditInnerTag', scope.row)
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
    name: 'TableItemList',
    components: {
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.ItemListExport && !this.auth.ItemListAuditInnerTag) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
      let pc = this.getPageComponents('QueryItemList');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        tableName: 'TableItemList',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '360', isShow: true },
          { label: '商品参数', key: 'parameter', width: '240', isShow: true },
          { label: '筐', key: 'frame', width: '160', isShow: true },
          { label: '科学分类', key: 'system_class', width: '200', isShow: true },
          { label: '展示分类', key: 'display_class', width: '200', isShow: true },
          { label: '库存', key: 'item_stock', width: '100', isShow: true },
          { label: '净重', key: 'net_weight', width: '120', isShow: false },
          { label: '包装规格', key: 'package_spec', width: '160', isShow: false },
          { label: '创建时间', key: 'created', width: '160', isShow: true },
          { label: '更新时间', key: 'updated', width: '160', isShow: false },
        ]
      }
    },
    methods: {
      //展开隐藏搜索(重写)
      onExpandChange(isExpand){
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT * 2;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT * 2;
        }
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //下架
      itemUnderGround(data) {
        this.$messageBox.confirm('您确认要下架？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({ isShow: true });
            let res = await Http.post(Config.api.itemUnderGround, {
              id: data.id
            });
            this.$loading({ isShow: false });
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已下架', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
  .is-presale{
    color: #fff;
    background: #FFA349;
    font-size: 12px;
    display: inline-block;
    text-align: center;
    height: 18px;
    line-height: 18px;
    width: 18px;
    border-radius: 18px 0 18px 18px;
    position: relative;
    top: -2px;
  }
</style>
