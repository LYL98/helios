<template>
  <div class="container-table">
    <div class="table-top" v-if="((auth.isAdmin || auth.ItemListExport) && fromPage === 'List') || ((auth.isAdmin || auth.ItemListForSaleExport) && fromPage === 'ListForSale')">
      <div class="left"></div>
      <div class="right">
        <el-button @click.native="handleExport('itemExport', query)" size="mini" type="primary" plain>导出商品</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
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
              <!--编号名称-->
              <template v-if="item.key === 'code_title'">
                <div class="td-item add-dot">
                  <div class="link-item add-dot" @click="handleShowAddEdit('AddEditItemList', scope.row, 'detail')" v-if="auth.isAdmin || auth.ItemListDetail || auth.ItemListForSaleDetail">
                    {{scope.row.code}}/{{scope.row.title}}
                  </div>
                  <div class="add-dot" v-else>
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
              <!--科学分类-->
              <div class="td-item" v-else-if="item.key === 'system_class'">{{scope.row.system_class.title}}</div>
              <!--展示分类-->
              <div class="td-item" v-else-if="item.key === 'display_class'">{{scope.row.display_class.title || '-'}}</div>
              <!--可售数量-->
              <div class="td-item" v-else-if="item.key === 'item_stock'">{{query.is_on_sale ? scope.row.item_stock + '件' : '-'}}</div>
              <!--已售数量-->
              <div class="td-item" v-else-if="item.key === 'sale_already'">{{query.is_on_sale ? scope.row.sale_already + '件' : '-'}}</div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <my-table-operate
              :width="120"
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改销售信息',
                  isDisplay: (auth.isAdmin || auth.ItemListEdit) && scope.row.is_on_sale,
                  command: () => handleShowAddEdit('AddEditItemList', scope.row, 'edit')
                },
                {
                  title: '上架',
                  isDisplay: (auth.isAdmin || auth.ItemListForSaleOnGround) &&  !scope.row.is_on_sale,
                  command: () => handleShowAddEdit('AddEditItemList', scope.row, 'on_sale')
                },
                {
                  title: '下架',
                  isDisplay: (auth.isAdmin || auth.ItemListUnderGround) && scope.row.is_on_sale,
                  command: () => itemUnderGround(scope.row)
                },
                {
                  title: '修改商品价格标签',
                  isDisplay: (auth.isAdmin || auth.ItemListInnerTagsEdit) && scope.row.is_on_sale,
                  command: () => handleShowForm('FormItemListEditInnerTag', scope.row)
                },
                {
                  title: '操作日志',
                  isDisplay: ((auth.isAdmin || auth.ItemListEditRecord) && fromPage === 'List') ||
                    ((auth.isAdmin || auth.ItemListForSaleEditRecord) && fromPage === 'ListForSale'),
                  command: () => handleShowDetail('DetailItemListEditRecord', scope.row)
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
        <pagination :pageComponent="this" />
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
    props: {
      fromPage: { type: String, default: 'List' }, //List 在售商品， ListForSale 待售商品
    },
    data() {
      let tableColumn = [
        { label: '商品编号/名称', key: 'code_title', width: '2', isShow: true },
        { label: '商品参数', key: 'parameter', width: '2', isShow: true },
        { label: '筐', key: 'frame', width: '1', isShow: true },
        { label: '科学分类', key: 'system_class', width: '1', isShow: false }
      ];
      if(this.fromPage === 'List'){
        tableColumn = tableColumn.concat([
          { label: '科学分类', key: 'system_class', width: '1', isShow: false },
          { label: '展示分类', key: 'display_class', width: '1', isShow: true },
          { label: '可售数量', key: 'item_stock', width: '1', isShow: true },
          { label: '已售数量', key: 'sale_already', width: '1', isShow: true },
        ]);
      }
      tableColumn = tableColumn.concat([
        { label: '创建时间', key: 'created', width: '1', isShow: false },
        { label: '更新时间', key: 'updated', width: '1', isShow: false }
      ]);
      return {
        tableName: 'TableItemList',
        tableColumn: tableColumn
      }
    },
    created() {
      let pc = this.getPageComponents('QueryItemList');
      this.getData(pc.query);
    },
    methods: {
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
<style lang="scss">
  @import './table.global.scss';
</style>
