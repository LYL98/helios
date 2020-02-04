<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupItemClassAdd">
      <div class="left"></div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.GroupItemClassAdd" @click="handleShowAddEdit('AddEditGroupItemClass')" size="mini" type="primary">新增</el-button>
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
        <el-table-column v-for="(item, index, key) in tableColumn" :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
          <div slot-scope="scope" class="my-td-item">
            <!--编号名称-->
            <template v-if="item.key === 'code_title'">
              <div class="td-item add-dot2">
                {{scope.row.id}}/{{scope.row.title}}
              </div>
            </template>
            <!--原价、建议团长价、建议团购价-->
            <div class="td-item add-dot2" v-else-if="item.key === 'price_origin' || item.key === 'advice_header_price' || item.key === 'advice_price_sale'">&yen;{{returnPrice(scope.row[item.key])}}</div>
            <!--正常情况-->
            <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.GroupItemClassEdit,
                  command: () => handleShowAddEdit('AddEditGroupItemClass', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: auth.isAdmin || auth.GroupItemClassDelete,
                  command: () => handleDelete(scope.row)
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
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableGroupItemClass',
    components: {
    },
    mixins: [tableMixin],
    created() {
      this.getData();
    },
    data() {
      return {
        tableName: 'TableGroupItemClass',
        tableColumn: [
          { label: '编号/名称', key: 'code_title', width: '300', isShow: true },
          { label: '排序', key: 'rank', width: '100', isShow: true },
          { label: '备注', key: 'remark', width: '240', isShow: true },
          { label: '创建时间', key: 'created', width: '120', isShow: true },
          { label: '更新时间', key: 'updated', width: '120', isShow: false },
        ]
      }
    },
    methods: {
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.groupItemClassQuery, {});
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
        let res = await Http.post(Config.api.groupItemClassDelete, {id: data.id});
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
