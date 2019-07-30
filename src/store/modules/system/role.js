import { System } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initState = {
  dataItem: [],
  detail: {
    permission_ids: [],
    is_super_admin: false
  },
  isShowAddEdit: false,
  permissionList: []
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initState ) );

// getters
const getters = {
  systemRoleListDataItem: state => state.dataItem,
  systemRoleListPermissionList:  state => state.permissionList,
  systemRoleDetail: state => state.detail,
  systemRoleShowAddEdit: state => state.isShowAddEdit
}

// actions
const actions = {
  //获取rolwList列表
  async systemRoleListQuery({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.roleList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      let rd = res.data;
      commit(Types.SYSTEM_ROLE_LIST_SAVE_DATA_ITEM, rd);
      if(!state.detail.id && rd.length > 0){
        commit(Types.SYSTEM_ROLE_LIST_SAVE_DETAIL, rd[0]);
      }
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取权限列表
  async systemRoleListPermissionList({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.permissionTree(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.SYSTEM_ROLE_LIST_SAVE_PERMISSION_LIST, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //更新角色详情
  systemRoleListChangeDetail({commit, dispatch, state}, data){
    commit(Types.SYSTEM_ROLE_LIST_SAVE_DETAIL, data);
  },
  //显示新增修改
  systemRoleShowHideAddEidt({commit, dispatch, state}, data){
    commit(Types.SYSTEM_ROLE_LIST_IS_SHOW_ADD_EDIT, data);
  },
  //新增或修改角色
  async systemRoleListAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System[data.id ? 'roleEdit' : 'roleAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `角色${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //删除角色
  async systemRoleListDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.roleDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  }
}

// mutations
const mutations = {
  //初始化数据
  [Types.SYSTEM_ROLE_LIST_INIT_STATE_DATA](state, data){
    state = JSON.parse( JSON.stringify( initState ) );
  },
  //更新roleList列表数据
  [Types.SYSTEM_ROLE_LIST_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //更新permissionList列表数据
  [Types.SYSTEM_ROLE_LIST_SAVE_PERMISSION_LIST](state, data){
    state.permissionList = data;
  },
  //显示角色新增编辑
  [Types.SYSTEM_ROLE_LIST_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
  //更新角色详情
  [Types.SYSTEM_ROLE_LIST_SAVE_DETAIL](state, data){
    state.detail = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}