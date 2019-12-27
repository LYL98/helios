<template>
  <div class="container-table">
    <!-- 头部start -->
    <div class="table-top" v-if="auth.isAdmin || auth.SystemBannerDelete || auth.SystemBannerAdd">
      <div class="left" v-if="auth.isAdmin || auth.SystemBannerDelete">
        <el-button :disabled="multipleSelection.length > 0 ? false : true" size="mini" type="primary" plain @click.native="handleDelete('multiple')">批量删除</el-button>
      </div>
      <div class="right" v-if="auth.isAdmin || auth.SystemBannerAdd">
        <el-button @click="handleShowAddEdit('AddEditSystemBanner')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!--头部end-->
    <!-- 表格start -->
    <div class="table-conter">
      <el-table
        :data="dataItem"
        style="width: 100%"
        :loading="true"
        class="list-table my-table-float"
        :row-class-name="highlightRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="42"/>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <a href="javascript:void(0);">
              <my-image-preview><img :src="tencentPath + scope.row.image + '_min200x200'" width="84" height="63"/></my-image-preview>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序"/>
        <!--<el-table-column label="类型">-->
          <!--<template slot-scope="scope">-->
            <!--{{{'commdity': '链接到商品', 'category': '链接到品类', 'external_link': '外部链接', 'nolink': '没有链接'}[scope.row.banner_type]}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.is_usable ? 'regular' : 'info'">{{scope.row.is_usable ? '可用' : '不可用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.SystemBannerEdit,
                  command: () => handleShowAddEdit('AddEditSystemBanner', scope.row)
                },
                {
                  title: '删除',
                  isDisplay: auth.isAdmin || auth.SystemBannerDelete,
                  command: () => handleDelete(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表格end -->
  </div>
</template>

<script>
  import { ImagePreview } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableSystemBanner',
    components: {
      'my-image-preview': ImagePreview,
    },
    mixins: [tableMixin],
    created() {
      this.getData();
    },
    data() {
      return {
        dataItem: [],
        rowIdentifier: 'code'
      }
    },
    methods: {
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      //多选
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.systemBannerList, {
          province_code: this.province.code
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除数据
      async deleteData(data) {
        let ids = [];
        if(data === 'multiple'){
          (this.multipleSelection).forEach(row => {
            ids.push(row.id);
          });
        }else{
          ids = [data.id];
        }
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.systemBannerDelete, {
          ids: ids
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
<style scoped>
</style>
