<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.BasicDataItemInnerTagsAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEditBasicDataItemInnerTags')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <template slot-scope="scope">
              <!--门店个数-->
              <div v-if="item.key === 'percent'" >
                <span>{{returnPercent(scope.row.rise_min)}}%</span>
                <span style="padding: 0 5px;">-</span>
                <span>{{returnPercent(scope.row.rise_max)}}%</span>
              </div>
              <!--正常情况-->
              <div v-else>{{scope.row[item.key]}}</div>
            </template>
          </el-table-column>
        </template>
        <!--table-column end 操作占位-->
        <el-table-column label min-width="1"/>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.BasicDataItemInnerTagsEdit,
                command: () => handleShowAddEdit('AddEditBasicDataItemInnerTags', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataItemInnerTagsDelete,
                command: () => handleDelete(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableBasicDataItemInnerTags',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryBasicDataItemInnerTags'); //获取query组件
      this.getData(pc.query);
    },
    data() {
      return {
        dataItem: [],
        tableName: 'TableBasicDataItemInnerTags',
        tableColumn: [
          { label: '名称', key: 'title', width: '200', isShow: true },
          { label: '加价率', key: 'percent', width: '200', isShow: true },
          { label: '备注', key: 'remark', width: '200', isShow: true },
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
        let res = await Http.get(Config.api.basicdataItemInnerTagsList, query);
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
        let res = await Http.post(Config.api.basicdataItemInnerTagsDelete, {
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
</style>
<style lang="scss">
  @import './table.global.scss';
</style>
