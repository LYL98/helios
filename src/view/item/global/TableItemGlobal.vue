<template>
  <div class="container-table">
    <div class="table-top" v-if="page === 'global' && (auth.isAdmin || auth.ItemGlobalAdd || auth.ItemGlobalExport)">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleExport('pItemExport', query)" size="mini" v-if="auth.isAdmin || auth.ItemGlobalExport" type="primary" plain>导出商品池</el-button>
        <el-button @click="handleShowAddEdit('AddEditItemGlobal', null, 'add')" size="mini" type="primary" v-if="auth.isAdmin || auth.ItemGlobalAdd">新增</el-button>
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
        <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--编号名称-->
              <template v-if="item.key === 'code_title'">
                <div v-if="(page === 'global' && (auth.isAdmin || auth.ItemGlobalDetail)) || (page === 'recover' && (auth.isAdmin || auth.ItemRecoverDetail))"
                  class="td-item link-item add-dot2" @click="handleShowAddEdit('AddEditItemGlobal', scope.row, 'detail')">
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
                <div class="td-item add-dot2" v-else>
                  {{scope.row.code}}/{{scope.row.title}}
                </div>
              </template>
              <!--商品参数-->
              <div class="td-item add-dot2" v-else-if="item.key === 'parameter'">
                <span>{{scope.row.origin_place}}</span>
                <span v-if="scope.row.item_spec">、{{scope.row.item_spec}}</span>
                <span v-if="!!scope.row.gross_weight">、{{returnWeight(scope.row.gross_weight)}}斤
                  <!-- <span v-if="!!scope.row.weight_e"> - {{returnWeight(scope.row.weight_e)}}</span> 斤 -->
                </span>
              </div>
              <!--筐-->
              <div class="td-item" v-else-if="item.key === 'frame'">
                <span v-if="scope.row.frame_id">{{scope.row.frame.title}}&nbsp;(&yen;{{returnPrice(scope.row.frame.price)}})</span>
                <span v-else>-</span>
              </div>
              <!--净重-->
              <div class="td-item" v-else-if="item.key === 'net_weight'">{{returnWeight(scope.row.net_weight)}}斤</div>
              <!--科学分类-->
              <div class="td-item" v-else-if="item.key === 'system_class'">{{scope.row.system_class.title}}</div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              width="100"
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改',
                  isDisplay: page === 'global' && (auth.isAdmin || auth.ItemGlobalEdit),
                  command: () => handleShowAddEdit('AddEditItemGlobal', scope.row, 'edit')
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
                },
                {
                  title: '供应商',
                  isDisplay: page === 'global' && (auth.isAdmin || auth.ItemGlobalSupplierType),
                  command: () => handleShowForm('FormItemGlobalSupplierType', scope.row)
                },
                {
                  title: '操作日志',
                  isDisplay: page === 'global' && (auth.isAdmin || auth.ItemGlobalEditRecord),
                  command: () => handleShowDetail('DetailItemGlobalEditRecord', scope.row)
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
    name: 'TableItemGlobal',
    components: {
    },
    mixins: [tableMixin],
    props: {
      page: { type: String, default: 'global' }, //页面global、recover
    },
    created() {
      let pc = this.getPageComponents('QueryItemGlobal');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableItemGlobal',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '2', isShow: true },
          { label: '商品参数', key: 'parameter', width: '2', isShow: true },
          { label: '筐', key: 'frame', width: '1', isShow: true },
          { label: '包装规格', key: 'package_spec', width: '1', isShow: false },
          { label: '净重', key: 'net_weight', width: '1', isShow: false },
          { label: '科学分类', key: 'system_class', width: '1', isShow: false },
          { label: '创建时间', key: 'created', width: '1', isShow: false },
          { label: '更新时间', key: 'updated', width: '1', isShow: false },
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
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
