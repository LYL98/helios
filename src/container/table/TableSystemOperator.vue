<template>
  <div>
    <!-- 头部end -->
    <div class="operate" v-if="auth.isAdmin || auth.SystemOperatorAdd">
      <el-button @click="handleShowAddEdit('AddEditSystemOperator')" size="mini" type="primary">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div class="statistics-table-list-container">
      <div @mousemove="handleTableMouseMove">
        <el-table
          :data="dataItem.items"
          :row-class-name="highlightRowClassName"
          style="width: 100%"
          :height="windowHeight - offsetHeight"
          :highlight-current-row="true"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
          </el-table-column>
          <el-table-column label="姓名" prop="realname" min-width="130">
            <template slot-scope="scope">
              <a
                href="javascript:void(0);"
                :class="`title ${isEllipsis(scope.row)}`"
                @click.prevent="handleShowDetail('DetailSystemOperator', scope.row)"
              >{{scope.row.realname}}</a>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="phone" min-width="120"></el-table-column>
          <el-table-column label="职务" width="140">
            <template slot-scope="scope">
              <div>{{operatorPost[scope.row.post] || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="roles" label="角色" min-width="120">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">{{formatRoles(scope.row.roles)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="data_level" label="权限级别" min-width="120">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">{{formatDataLevel(scope.row.data_level)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag disable-transitions  size="mini" type="info" v-if="scope.row.is_freeze">已冻结</el-tag>
              <el-tag disable-transitions  size="mini" type="regular" v-else>正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                @command-visible="handleCommandVisible"
                :list="[
                    {
                      title: '冻结',
                      isDisplay: (auth.isAdmin || auth.SystemOperatorFreeze) && !scope.row.is_freeze,
                      command: () => freezeData(scope.row)
                    },
                    {
                      title: '解冻',
                      isDisplay: (auth.isAdmin || auth.SystemOperatorUnFreeze) && scope.row.is_freeze,
                      command: () => freezeData(scope.row)
                    },
                    {
                      title: '修改',
                      isDisplay: auth.isAdmin || auth.SystemOperatorEdit,
                      command: () => handleShowAddEdit('AddEditSystemOperator', scope.row)
                    },
                    {
                      title: '重置密码',
                      isDisplay: auth.isAdmin || auth.SystemOperatorPasswordReset,
                      command: () => handleShowResetPwd(scope.row)
                    }
                  ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格end -->
      <div class="footer">
        <div class="table-pagination">
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
    </div>
  </div>
</template>

<script>
  import { ImagePreview } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableSystemOperator',
    components: {
      'my-image-preview': ImagePreview,
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.SystemBannerAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT
      }
      let pc = this.getPageComponents('QuerySystemOperator');
      this.getData(pc.query);
    },
    data() {
      return {
        defaultAvatar: Constant.IMGS.defaultAvatar,
        gender: Constant.USER_GENDER,
        source: Constant.USER_SOURCE,
        operatorPost: Constant.OPERATOR_POST,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION + Constant.OFFSET_OPERATE,
        rowIdentifier: 'code'
      }
    },
    methods: {
      formatRoles(roles) {
        return roles.toString();
      },

      formatDataLevel(dataLevel) {
        return DataHandle.returnDataLevel(dataLevel);
      },
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
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.operatorList, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //冻结解冻
      freezeData(data) {
        let that = this;
        that.$messageBox.confirm(`您确认要${data.is_freeze?'解冻':'冻结'}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.operatorFreezeUnFreeze(data);
        }).catch(() => {
          //console.log('取消');
        });
      },
      //冻结解冻
      async operatorFreezeUnFreeze(data){
        this.$loading({ isShow: true });
        let res = await Http.post(data.is_freeze ? Config.api.operatorUnFreeze : Config.api.operatorFreeze, {
          id: data.id
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: `已${data.is_freeze ? '解冻' : '冻结'}`, type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //显示重置密码
      handleShowResetPwd(data){
        let pc = this.getPageComponents('FormSystemOperatorResetPwd');
        pc.showForm(data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
