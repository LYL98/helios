<template>
  <div>
    <div @mousemove="handleTableMouseMove">
      <el-table
        :data="dataItem"
        style="width: 100%;"
        :highlight-current-row="true"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :row-class-name="highlightRowClassName"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column label="头像" prop="created">
          <template slot-scope="scope">
            <img
              :src="!scope.row.avatar ? defaultAvatar : (tencentPath + scope.row.avatar + '_min200x200')"
              width="48"
              height="48"
              onerror="this.style.display='none'"
            />
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="realname">
        </el-table-column>
        <el-table-column label="登录手机" prop="phone">
        </el-table-column>
        <el-table-column label="是否冻结" prop="is_freeze">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.is_freeze ? 'info' : 'regular'"
              disable-transitions>{{scope.row.is_freeze ? '已冻结' : '未冻结'}}
            </el-tag>
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
                isDisplay: (auth.isAdmin || auth.MerchantMemberFreeze) && !scope.row.is_freeze,
                command: () => affirmMemberFreeze(scope.row)
              },
              {
                title: '解冻',
                isDisplay: (auth.isAdmin || auth.MerchantMemberUnFreeze) && scope.row.is_freeze,
                command: () => affirmMemberUnFreeze(scope.row)
              },
              {
                title: '重置密码',
                isDisplay: auth.isAdmin || auth.MerchantMemberUpdatePassword,
                command: () => showPassword(scope.row)
              },
              {
                title: '解除微信绑定',
                isDisplay: (auth.isAdmin || auth.MerchantMemberUnBindWechat) && scope.row.weapp_openid,
                command: () => memberUnBindWechat(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="密码重置" :close-on-click-modal="false" :visible.sync="isShowPassword" :before-close="cancelPassword" width="520px" append-to-body>
      <el-form label-position="right" label-width="100px" style="width: 420px;" :model="pwdData" :rules="rules"
               ref="ruleForm">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdData.password" :maxlength="15" type="password" placeholder="请输入新的登录密码" autofocus></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelPassword">取消</el-button>
        <el-button type="primary" @click.native="affirmPassword">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增用户" :close-on-click-modal="false" width="640px" :visible.sync="addMemberDialogVisible" append-to-body>
      <member-add-edit :editMemberCancel="editMemberCancel" :editMemberSuccess="editMemberSuccess"></member-add-edit>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {Table, TableColumn, Tag, Form, FormItem, Message, MessageBox, Button, Dialog, Input, Pagination} from 'element-ui';
  import {TableOperate} from '@/common';
  import {Config, Constant, DataHandle, Method, Http} from '@/util';
  import {Merchant} from '@/service';
  import md5 from 'md5';
  import MemberAddEdit from './MemberAddEdit';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: "MerchantAdd",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-input': Input,
      'el-pagination': Pagination,
      'member-add-edit': MemberAddEdit,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      updateCount: Number,
      merchant_id: [String, Number]
    },
    created() {
      let that = this;
      let {query} = that;
      query.merchant_id = that.merchant_id;
      that.$data.query = query;
      that.memberList();//获取用户列表
    },
    watch: {
      updateCount: 'memberList'
    },
    data() {
      return {
        addMemberDialogVisible: false,
        editItem: {},
        tencentPath: Config.tencentPath,
        defaultAvatar: Constant.IMGS.defaultAvatar,
        query: {
          merchant_id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        selectData: {},
        dataItem: [],
        isShowPassword: false,
        pwdData: {
          password: ''
        },
        rules: {
          password: [
            { required: true, message: '登录密码不能为空', trigger: 'change' },
            { min: 6, max: 15, message: '请输入6-15位的非中文字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {

      //刷新
      refresh() {
        let {query} = this;
        query.page = 1;
        this.$data.query = query;
        this.memberList();
      },
      //用户列表
      async memberList() {
        let that = this;
        let {query} = that;
        let res = await Merchant.memberList(query);
        if (res.code === 0) {
          that.$data.dataItem = res.data;
        } else {
          Message.warning(res.message);
        }
      },
      //解除微信绑定
      memberUnBindWechat(data){
        MessageBox.confirm('确认解除微信绑定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.memberUnBindWechat, {
            id: data.id
          });
          if(res.code === 0){
            this.$store.dispatch('message', {
              title: '提示',
              message: '已解除绑定',
              type: 'success'
            });
            this.memberList(); //重新取数据
          }else{
            this.$store.dispatch('message', {
              title: '提示',
              message: res.message,
              type: 'error'
            });
          }
        }).catch(() => {
          // console.log('取消');
        });
      },
      //确认冻结
      affirmMemberFreeze(data) {

        MessageBox.confirm('确认冻结用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.memberFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      //冻结
      async memberFreeze(data) {
        let res = await Merchant.memberFreeze({
          id: data.id
        });
        if (res.code === 0) {
          this.memberList();
          Message.success('用户已被冻结！');
        } else {
          Message.warning(res.message);
        }
      },
      //确认解冻
      affirmMemberUnFreeze(data) {

        MessageBox.confirm('确认解冻用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.memberUnFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });
      },
      //解冻
      async memberUnFreeze(data) {
        let that = this;
        let res = await Merchant.memberUnFreeze({
          id: data.id
        });
        if (res.code === 0) {
          that.memberList();
          Message.success('用户已经解冻！')
        } else {
          Message.warning(res.message);
        }
      },
      //重置密码
      async memberPasswordReset() {
        let that = this;
        let {selectData, pwdData} = that;
        let res = await Merchant.memberPasswordReset({
          id: selectData.id,
          password: md5(pwdData.password)
        });
        if (res.code === 0) {
          Message.success('密码已经重置！');
          that.cancelPassword();
        } else {
          Message.warning(res.message);
        }
      },
      //显示修改密码
      showPassword(data) {
        this.$data.selectData = data;
        this.$data.isShowPassword = true;
      },
      //取消改密码
      cancelPassword() {
        this.$refs['ruleForm'].resetFields();
        this.$data.pwdData.paddword = '';
        this.$data.isShowPassword = false;
      },
      //确认重置密码
      affirmPassword() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.memberPasswordReset();
          }
        });
      },
      editMemberCancel() {
        this.addMemberDialogVisible = false;
      },
      editMemberSuccess() {
        this.addMemberDialogVisible = false;
        this.refresh();
      },
      /**
       * 翻页 的 按钮事件
       * 1、设置组件中 query.page的值
       * 2、调用merchantList 重新加载商户列表信息
       */
      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.memberList();
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .el-upload__tip {
    margin-left: 20px;
  }

  .level, .label {
    padding: 12px 0 2px;
    span {
      display: inline-block;
      padding: 2px 5px;
      margin: 0 5px 10px;
      border: 1px solid #999;
      border-radius: 3px;
    }
  }
</style>
