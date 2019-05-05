<template>
  <div class="role-list-body" style="background-color: #fff;">
    <div class="role-list">
      <!--角色列表start-->
      <div class="left">
        <div class="title">
          角色列表
          <el-button class="btn" icon="el-icon-plus" size="mini" @click.native="showAddEdit" v-if="auth.isAdmin || auth.SystemRoleAdd" >新增</el-button>
        </div>
        <div class="content" :style="`height:${windowHeight - 116}px`" v-if="auth.isAdmin || auth.SystemRoleList" >
          <div v-for="(item,index) in dataItem" :class="`role-item ${detail.id === item.id && 'active'}`" @click="selectRoleItem(item, detail.id === item.id)" :key="index">
            <div class="add-dot" :title="item.title">
              {{item.title}}
            </div>
            <div class="option">
              <i class="el-icon-delete" v-if="auth.isAdmin || auth.SystemRoleDelete" @click="deleteData(item)"></i>
              <i class="el-icon-edit-outline" v-if="auth.isAdmin || auth.SystemRoleEdit" @click="showAddEdit"></i>
            </div>
          </div>
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
            <el-checkbox v-model="detail.is_super_admin" @change="changeSuperAdmin">超级管理员</el-checkbox>
          </span>
        </div>
        <div class="content" :style="`height:${windowHeight - 166}px;`">
          <div class="content-body" v-if="detail.is_super_admin"><div>超级管理员</div></div>
          <!--菜单权限start-->
          <div class="per-item-body" :style="`height:${windowHeight - 186}px; padding: 10px 0; border-bottom: 1px solid #f3f4f6;`">
            <el-tree
            v-if="isShowTree"
            :data="permissionList"
            :default-expand-all="defaultExpandAll"
            show-checkbox
            check-strictly
            class="role-tree"
            node-key="id"
            ref="tree"
            :default-checked-keys="detail.permission_ids"
            @check="treeChange"
            @node-expand="onNodeExpand"
            :props="defaultProps">
          </el-tree>
          </div>
          <!--菜单权限end-->
        </div>
        <div class="t-r">
          <el-button type="primary" style="margin: 10px 10px 0 0;" v-if="auth.isAdmin || auth.SystemRoleEdit" :disabled="!isChange" @click.native="save">保存已修改</el-button>
        </div>
      </div>
      <!--权限列表start-->
    </div>
    <my-add-edit-role :callback="myCallBack" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Button, Checkbox, MessageBox,Tree, RadioGroup, RadioButton } from 'element-ui';
import { Config, Constant, DataHandle } from '@/util';
import RoleAddEdit from './RoleAddEdit';

export default {
  name: 'RoleList',
  components: {
    'el-button': Button,
    'el-checkbox': Checkbox,
    'my-add-edit-role': RoleAddEdit,
    'el-tree': Tree,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
  created(){
    let that = this;
    documentTitle("设置 - 角色列表");
    that.systemRoleListPermissionList({
      callback: ()=>{
        that.handleFold(); //处理样式层叠
      }
    });
    that.systemRoleListQuery();
  },
  //实例销毁之前调用
  beforeDestroy(){
    //清detail
    this.systemRoleListChangeDetail({
      permission_ids: [],
      is_super_admin: false
    });
  },
  computed: mapGetters({
    windowHeight: 'windowHeight',
    dataItem: 'systemRoleListDataItem',
    permissionList: 'systemRoleListPermissionList',
    roleDetail: 'systemRoleDetail',
    auth: 'globalAuth',
  }),
  data(){
    return {
      isChange: false,
      detail: {
        permission_ids: []
      },
      isShowTree: true,
      defaultExpandAll: true,
      detailTemp: {},
      defaultProps: {
        children: 'childs',
        label: 'title'
      },
    }
  },
  methods: {
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
      let that = this;
      let { detail } = that;
      if(!res){
        that.systemRoleListChangeDetail(that.detailTemp);
      }else{
        that.systemRoleListChangeDetail(res);
        that.systemRoleListQuery();
      }
    },
    //保存已修改
    save() {
      this.systemRoleListAddEdit({
        data: this.detail,
        callback: this.systemRoleListQuery
      });
    },
    //显示新增
    showAddEdit(){
      let that = this;
      that.$data.detailTemp = that.detail;
      //清detail
      that.systemRoleListChangeDetail({
        permission_ids: [],
        is_super_admin: false
      });
      that.systemRoleShowHideAddEidt(true);
    },
    //删除数据
    deleteData(data) {
      let that = this;
      MessageBox.confirm('您确认要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.systemRoleListDelete({
          data: {
            id: data.id
          },
          callback: ()=>{
            //清detail
            that.systemRoleListChangeDetail({
              permission_ids: [],
              is_super_admin: false
            });
            that.systemRoleListQuery();
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    //选择角色列表
    selectRoleItem(data, is_active){
      this.systemRoleListChangeDetail(data);
      this.$data.isChange = false;
    },
    //改变是否管理员
    changeSuperAdmin(val){
      this.$data.isChange = true;
    },
    ...mapActions([
      'systemRoleListPermissionList',
      'systemRoleListQuery',
      'systemRoleListChangeDetail',
      'systemRoleListAddEdit',
      'systemRoleListDelete',
      'systemRoleShowHideAddEidt'
    ]),
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
      let ccf = ck.checkedKeys.filter(item => item === data.id );
      isCheck = ccf.length > 0 ? true : false;

      //获取当前节点与子节id
      let m = (d) => {
        //如果选中
        if(isCheck){
          detail.permission_ids.push(d.id);
        }else{
          for(let i = 0; i < detail.permission_ids.length; i++){
            if(detail.permission_ids[i] === d.id){
              detail.permission_ids.remove(i);
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
        detail.permission_ids.push(...data.ancestor_node);
      }

      detail.permission_ids = DataHandle.arrayUnique(detail.permission_ids); //去重

      that.$data.detail = detail;
      that.$data.isChange = true;
      that.$refs.tree.setCheckedKeys(detail.permission_ids);
    },
  },
  watch:{
    //监听roleDetail变化
    roleDetail(a, b) {
      let res = JSON.parse( JSON.stringify(a) );
      this.$data.detail =  res;
      this.$refs.tree.setCheckedKeys(res.permission_ids); // 树型重新选择
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
