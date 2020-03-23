<template>
  <sub-menu>
  <div class="role-list-body" style="background-color: #fff;">
    <div class="role-list">
      <!--角色列表start-->
      <div class="left">
        <div class="title">
          角色列表
          <el-button class="btn" icon="el-icon-plus" size="mini" @click.native="showAddEdit('add')" v-if="auth.isAdmin || auth.SystemRoleAdd" >新增</el-button>
        </div>
        <div class="select">
          <el-select v-model="selectRoleType" placeholder="请选择权限级别" clearable filterable style="width: 100%;" size="mini" @change="changeRoleType">
            <el-option v-for="(value, key) in roleAuthLevel" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </div>
        <div class="content" :style="`height:${viewWindowHeight - 166}px`" v-if="auth.isAdmin || auth.SystemRoleList" >
          <template v-for="(item,index) in dataItem">
            <div :class="`role-item ${detail.id === item.id && 'active'}`" @click="selectRoleItem(item, detail.id === item.id)" :key="index" v-if="selectRoleType === '' || selectRoleType === item.role_type">
              <div class="add-dot" :title="item.title">
                {{item.title}}
              </div>
              <div class="option">
                <i class="el-icon-delete" v-if="auth.isAdmin || auth.SystemRoleDelete" @click="deleteData(item)"></i>
                <i class="el-icon-edit-outline" v-if="auth.isAdmin || auth.SystemRoleEdit" @click="showAddEdit(item)"></i>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!--角色列表end-->
      <!--权限列表start-->
      <div class="right">
        <div class="title">
          权限列表
          <span style="position: relative; top: -2px; margin-left: 20px;">
            <el-radio-group v-model="defaultExpandAll" size="mini" @change="changeExpandAll">
              <el-radio-button :label="true">全部展开</el-radio-button>
              <el-radio-button :label="false">全部收起</el-radio-button>
            </el-radio-group>
          </span>
          <span class="f-r">
            <el-checkbox v-model="detail.is_super_admin" @change="changeSuperAdmin" :disabled="$myInfo.is_admin && $myInfo.opt_type === 'global' && detail.role_type === 'global' ? false : true">超级管理员</el-checkbox>
          </span>
        </div>
        <div class="content" :style="`height:${viewWindowHeight - 166}px;`">
          <div class="content-body" v-if="detail.is_super_admin"><div>超级管理员</div></div>
          <!--菜单权限start-->
          <div class="per-item-body" :style="`height:${viewWindowHeight - 186}px; padding: 10px 0; border-bottom: 1px solid #f3f4f6;`">
            <el-tree
            v-if="isShowTree"
            :data="permissionTree"
            :default-expand-all="defaultExpandAll"
            show-checkbox
            check-strictly
            class="role-tree"
            node-key="code"
            ref="tree"
            :default-checked-keys="detail.permission_codes"
            @check="treeChange"
            @node-expand="onNodeExpand"
            :props="defaultProps">
          </el-tree>
          </div>
          <!--菜单权限end-->
        </div>
        <div class="t-r">
          <el-button type="primary" style="margin: 5px 10px 0 0;" v-if="auth.isAdmin || auth.SystemRoleEdit" :disabled="!isChange" @click.native="save">保存已修改</el-button>
        </div>
      </div>
      <!--权限列表start-->
    </div>
    <add-edit :callback="myCallBack" ref="AddEditSystemRole" />
  </div>
  </sub-menu>
</template>

<script>
import mainMixin from '@/share/mixin/main.mixin';
import { Button, Checkbox, Tree, RadioGroup, RadioButton, Select, Option } from 'element-ui';
import { Config, Constant, DataHandle, Http } from '@/util';
import AddEdit from './AddEdit';

export default {
  name: 'RoleList',
  mixins: [mainMixin],
  components: {
    'el-button': Button,
    'el-checkbox': Checkbox,
    'add-edit': AddEdit,
    'el-tree': Tree,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-select': Select,
    'el-option': Option,
  },
  created(){
    documentTitle("设置 - 角色列表");
    this.getPermissionTree();
    this.getRoleList();
  },
  //实例销毁之前调用
  beforeDestroy(){
    //清detail
    this.getRoleDetail({
      permission_codes: [],
      is_super_admin: false
    });
  },
  data(){
    return {
      auth: this.$auth,
      roleAuthLevel: Constant.ROLE_AUTH_LEVEL(),
      windowHeight: 0,
      isChange: false,
      dataItem: [],
      detail: {
        permission_codes: []
      },
      isShowTree: true,
      defaultExpandAll: true,
      permissionTree: [],
      detailTemp: {},
      defaultProps: {
        children: 'childs',
        label: 'title'
      },
      selectRoleType: '', //搜索权限级别
    }
  },
  methods: {
    //获取权限树
    async getPermissionTree(){
      let res = await Http.get(Config.api.permissionTree, {});
      if(res.code === 0){
        this.$data.permissionTree = res.data;
        this.handleFold(); //处理样式层叠
      }else{

      }
    },
    //
    onNodeExpand(data, node, nodeComponent) {
      this.handleFold();
    },
    //处理样式折叠
    handleFold(){
      this.$nextTick(()=>{
        // let dom = document.getElementsByClassName('is-leaf');
        // for(let i = 0; i < dom.length; i++){
        //   dom[i].parentNode.parentNode.style.float = 'left';
        //   dom[i].parentNode.parentNode.style.clear = 'right';
        // }

        let tree = document.querySelectorAll('[role="tree"]');
        let nodes = tree[0].children;

        for (let i = 0; i < nodes.length; i++) {
          this.traverseNode(nodes[i]);
        }

      });
    },

    traverseNode(node) {
      if (this.isLeafNode(node)) {
        return true;
      }

      //如果存在group节点，遍历子节点，
      //如果不存在，不进行遍历（用于手动展开节点的情况）
      if (node.children[1]) {
        //当前节点不是叶子节点, 拿到当前节点group下面的子节点
        let children = node.children[1].children;
        let leafNodeCount = 0;
        for (let i = 0; i < children.length; i++) {
          if (this.traverseNode(children[i])) {
            leafNodeCount ++;
          }
        }

        //如果当前节点的所有子节点都没有子节点，将当前节点的所有子节点横向排列
        if (leafNodeCount === children.length) {
          for (let i = 0; i < children.length; i++) {
            this.flatNode(children[i]);
          }
        }

        return false;
      }

    },

    flatNode(node) {
      node.style.float = 'left';
      node.style.clear = 'right';
    },

    isLeafNode(node) {
      if (node.children && node.children.length > 0) {
        //检查当前节点下的group role节点是否有子节点
        return node.children[0].getElementsByClassName('is-leaf').length > 0
      } else {
        return true;
      }
    },

    //组件回调
    myCallBack(res){
      if(!res){
        this.getRoleDetail(this.detailTemp);
      }else{
        this.getRoleDetail(res);
        this.getRoleList();
      }
    },
    //保存已修改
    async save() {
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(detail.id ? Config.api.roleEdit : Config.api.roleAdd, detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.getRoleList();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //显示新增
    showAddEdit(data){
      this.$data.detailTemp = this.detail;
      //清detail
      this.getRoleDetail({
        permission_codes: [],
        is_super_admin: false
      });
      let d = this.detail;
      if(data !== 'add'){
        d = data;
      }
      let pc = this.viewGetPageComponents('AddEditSystemRole');
      pc.showAddEdit(this.dataItem, d);
    },
    //删除数据
    deleteData(data) {
      this.$messageBox.confirm('您确认要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        (async ()=>{
          this.$loading({isShow: true});
          let res = await Http.post(Config.api.roleDelete, {id: data.id});
          this.$loading({isShow: false});
          if(res.code === 0){
            //清detail
            this.getRoleDetail({
              permission_codes: [],
              is_super_admin: false
            });
            this.getRoleList();
          }else{
            this.$message({message: res.message, type: 'error'});
          }
        })();
      }).catch(() => {
        //console.log('取消');
      });
    },
    //选择角色列表
    selectRoleItem(data, is_active){
      this.getRoleDetail(data);
      this.$data.isChange = false;
    },
    //改变是否管理员
    changeSuperAdmin(val){
      this.$data.isChange = true;
    },
    //获取角色列表
    async getRoleList(){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.roleList, {});
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
        if(!this.detail.id && rd.length > 0){
          this.$data.detail = rd[0];
        }
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //选择角色类型
    changeRoleType(){
      let { selectRoleType, dataItem } = this;
      let con = dataItem.filter(item => selectRoleType === '' || item.role_type === selectRoleType);
      if(con.length > 0){
        this.getRoleDetail(con[0]);
      }else{
        this.getRoleDetail({
          permission_codes: [],
          is_super_admin: false
        });
      }
    },
    //获取角色详情(直接保存详情)
    getRoleDetail(data){
      this.$data.detail = data;
      this.$refs.tree.setCheckedKeys(data.permission_codes); // 树型重新选择
    },
    //全部展开收起
    changeExpandAll(v){
      this.$data.isShowTree = false;
      this.$data.defaultExpandAll = v;
      setTimeout(()=>{
        this.$data.isShowTree = true;
        if (v) {
          this.handleFold(); //处理样式
        }
      }, 0);
    },
    //选择改变(父子不关联模式)（用check，防止渲染时运行）
    treeChange(data, ck) {
      let that = this, isCheck = false;
      let { permissionList, detail } = that;
      //判断是否选中
      let ccf = ck.checkedKeys.filter(item => item === data.code );
      isCheck = ccf.length > 0 ? true : false;

      //获取当前节点与子节id
      let m = (d) => {
        //如果选中
        if(isCheck){
          detail.permission_codes.push(d.code);
        }else{
          for(let i = 0; i < detail.permission_codes.length; i++){
            if(detail.permission_codes[i] === d.code){
              detail.permission_codes.remove(i);
              i--;
            }
          }
        }

        d.childs.map((item)=>{
          m(item);
        });
      }
      m(data);

      //选中, 找父节点
      if(isCheck){
        detail.permission_codes.push(...data.ancestor_node);
      }

      detail.permission_codes = DataHandle.arrayUnique(detail.permission_codes); //去重

      that.$data.detail = detail;
      that.$data.isChange = true;
      that.$refs.tree.setCheckedKeys(detail.permission_codes);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  $--color-primary: #f57e00;
  .role-list{
    display: flex;
    > div{
      flex: 1;
    }
    > .left{
      flex: initial !important;
      width: 200px;
      border: 1px solid #e5e5e5;
      > .title{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 10px;
        > .btn{
          float: right;
          margin-top: 6px;
        }
      }
      >.select{
        padding: 10px;
        border-bottom: 1px solid #e5e5e5;
      }
      > .content{
        overflow-y: auto;
        .role-item{
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          cursor: pointer;
          display: flex;
          &.active{
            background: rgb(204, 204, 204);
          }
          > div{
            flex: 1;
          }
          > .option{
            flex: initial !important;
          }
        }
      }
    }
    > .right{
      border: 1px solid #e5e5e5;
      margin-left: 10px;
      overflow: hidden;
      > .title{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 10px;
      }
      > .content{
        position: relative;
        .content-body{
          position: absolute;
          background: rgba(255, 255, 255, .9);
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          color: #ececec;
          font-size: 60px;
          display: flex;
          align-items: center;
          div{
            flex: 1;
            text-align: center;
          }
        }
        .per-item-body{
          overflow-y: auto;
          .per-item{
            font-size: 12px;
            padding: 0 20px;
            margin-bottom: 20px;
            > .root{
              font-weight: bold;
            }
            > div{

              > i{
                display: none;
              }
              &.son{
                margin-left: 20px;
                .api{
                  padding: 5px 20px 20px;
                  overflow: hidden;
                  span{
                    margin: 0 20px 2px 0;
                    padding: 2px 0;
                    float: left;
                    font{
                      i{
                        position: absolute;
                        right: -12px;
                        top: 1px;
                      }
                      position: relative;
                    }
                  }
                }
                i{
                  display: none;
                }
                .active{
                  color: $--color-primary;
                  i{
                    display: inline-block
                  }
                }
              }
              &.active{
                color: $--color-primary;
                > i{
                  display: inline-block
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<style>
.role-tree{
  margin: 20px;
}

/*第一级*/
.role-tree > .el-tree-node{
  margin-bottom: 20px;
}
.el-tree-node__content .el-checkbox{
  margin-right: 8px;
}
.role-tree > .el-tree-node > .el-tree-node__content > .el-tree-node__label{
  font-weight: bold;
  font-size: 16px;
}
.el-tree-node{
  margin-top: 10px;
  clear: both;
}
.el-tree-node__children{
  overflow: hidden;
}
</style>
