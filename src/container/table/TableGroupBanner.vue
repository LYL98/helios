<template>
  <div class="table-body">
    <div class="table-top" v-if="auth.isAdmin || auth.GroupBannerAdd">
      <div class="left"></div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.GroupBannerAdd" @click="handleShowAddEdit('AddEditGroupBanner')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table :data="dataItem"
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
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--图片-->
              <template v-if="item.key === 'image'">
                <image-preview><img :src="tencentPath + scope.row.image + '_min200x200'" width="84" height="63"/></image-preview>
              </template>
              <!--状态-->
              <template v-else-if="item.key === 'status'">
                <el-tag size="mini" :type="scope.row.is_usable ? 'success' : 'info'">{{scope.row.is_usable ? '可用' : '不可用'}}</el-tag>
              </template>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <!--table-column end 操作占位-->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.GroupBannerEdit,
                  command: () => handleShowAddEdit('AddEditGroupBanner', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: auth.isAdmin || auth.GroupBannerDelete,
                  command: () => handleDelete(scope.row)
                },
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
  import { ImagePreview } from '@/common';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableGroupBanner',
    components: {
      'image-preview': ImagePreview
    },
    mixins: [tableMixin],
    created() {
      if(!this.auth.isAdmin && !this.auth.GroupBannerAdd){
          this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
        }
      let pc = this.getPageComponents('QueryGroupBanner');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
        tableName: 'TableGroupBanner',
        tableColumn: [
          { label: '图片', key: 'image', width: '100', isShow: true },
          { label: 'url', key: 'url', width: '150', isShow: true },
          { label: '排序', key: 'rank', width: '100', isShow: true },
          { label: '状态', key: 'status', width: '100', isShow: true },
          { label: '创建时间', key: 'created', width: '160', isShow: true },
          { label: '更新时间', key: 'updated', width: '160', isShow: false },
        ],
        dataItem: []
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.groupBannerList, query);
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
        let res = await Http.post(Config.api.groupBannerDelete, { id: data.id });
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
