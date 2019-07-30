import { Item } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initialData = {
  groupBuyList: {
    items: [],
    num: 0
  },
  groupBuyItemList: {
    items: [],
    num: 0
  },
  groupBuyStoreList: {
    items: [],
    num: 0
  },
  groupBuyMemberList: {
    items: [],
    num: 0
  },
  groupBuyDetail: {}
};

const state = JSON.parse( JSON.stringify( initialData ) );

// getters
const getters = {
  groupBuyListData: state => state.groupBuyList,
  groupBuyStoreListData: state => state.groupBuyStoreList,
  groupBuyMemberListData: state => state.groupBuyMemberList
};

// actions
const actions = {
  initialize({commit, dispatch, state}) {
    commit(Types.GROUP_BUY_INIT_STATE, state);
  },

  //新增团购活动
  async groupBuyAdd({commit, dispatch, state}, {item, success, error}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyAdd(item);
    this.$loading({isShow: false});
    if (res.code === 0) {
      this.$message({title: '提示', message: '新增团购活动成功', type: 'success'});
      typeof success === 'function' && success()
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      typeof error === 'function' && error()
    }
  },

  //编辑团购活动
  async groupBuyEdit({commit, dispatch, state}, {item, success, error}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyEdit(item);
    this.$loading({isShow: false});
    if (res.code === 0) {
      this.$message({title: '提示', message: '编辑团购活动成功', type: 'success'});
      typeof success === 'function' && success()
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      typeof error === 'function' && error()
    }
  },

  async groupBuyDetail({commit, dispatch, state}, {query, success, error}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyDetail(query);
    this.$loading({isShow: false});
    if (res.code === 0) {
      typeof success === 'function' && success(res.data)
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      typeof error === 'function' && error()
    }
  },

  async groupBuyStoreDetail({commit, dispatch, state}, {query, success, error}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyStoreDetail(query);
    this.$loading({isShow: false});
    if (res.code === 0) {
      // commit(Types.GROUP_BUY_STORE_LIST, { groupBuyDetail: res.data });
      typeof success === 'function' && success(res.data)
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      typeof error === 'function' && error()
    }
  },

  async groupBuyStoreMemberList({commit, dispatch, state}, {query, success, error}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyStoreMemberList(query);
    this.$loading({isShow: false});
    if (res.code === 0) {
      commit(Types.GROUP_BUY_STORE_MEMBER_LIST, { groupBuyMemberList: res.data });
      typeof success === 'function' && success(res.data)
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      typeof error === 'function' && error()
    }
  },

  // 团购门店列表
  async groupBuyStoreList({commit, dispatch, state}, {query, success, error}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyStoreList(query);
    this.$loading({isShow: false});
    if (res.code === 0) {
      commit(Types.GROUP_BUY_STORE_LIST, { groupBuyStoreList: res.data });
      typeof success === 'function' && success(res.data)
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      typeof error === 'function' && error()
    }
  },

  // 团购列表
  async groupBuyQuery({commit, dispatch, state}, {query}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyQuery(query);
    this.$loading({isShow: false});
    if (res.code === 0) {
      commit(Types.GROUP_BUY_LIST, { groupBuyList: res.data });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

  //团购商品查询
  async groupBuyItemList({commit, dispatch, state}, {query}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyItemList(query);
    this.$loading({isShow: false});
    if (res.code === 0) {
      commit(Types.GROUP_BUY_ITEM_LIST, { groupBuyItemList: res.data });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //生效团购活动
  async groupBuyActive({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyActive(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '团购上架成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //结束团购活动
  async groupBuyCancel({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyCancel(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '团购下架成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //删除团购活动
  async groupBuyDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.groupBuyDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '团购已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

};

// mutations
const mutations = {
  //初始化数据
  [Types.GROUP_BUY_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initialData ) );
  },
  [Types.GROUP_BUY_LIST](state, { groupBuyList }) {
    state.groupBuyList = groupBuyList;
  },
  [Types.GROUP_BUY_ITEM_LIST](state, { groupBuyItemList }) {
    state.groupBuyItemList = groupBuyItemList;
  },
  [Types.GROUP_BUY_DETAIL](state, { groupBuyDetail }) {
    state.groupBuyDetail = groupBuyDetail;
  },
  [Types.GROUP_BUY_STORE_LIST](state, { groupBuyStoreList }) {
    state.groupBuyStoreList = groupBuyStoreList;
  },
  [Types.GROUP_BUY_STORE_MEMBER_LIST](state, { groupBuyMemberList }) {
    state.groupBuyMemberList = groupBuyMemberList;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
