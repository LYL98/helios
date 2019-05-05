import { Purchase } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  listItem: {  // 采购仓管审核列表
    items: [],
    num: 0
  },
};

const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  pruchaseWarehouseListItem: state => state.listItem
}

// actions
const actions = {
  async pruchaseWarehouseQuery({commit, dispatch, state}, {query}) {
    commit(Types.PURCHASE_WAREHOUSE_SET_LIST_ITEM, { listItem: { items: [], num: 0 } });
    let res = !query.if_check_opt
      ? await Purchase.itemQuery(query)
      : await Purchase.warehouseQuery(query);
    if (res.code === 0) {
      commit(Types.PURCHASE_WAREHOUSE_SET_LIST_ITEM, { listItem: res.data });
    } else {
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  async pruchaseWarehouseApprove({commit, dispatch, state}, {id, remark, success, error}) {
    let res = await Purchase.itemFirstCheck({id, remark});
    if (res.code === 0) {
      // 如果审核通过
      dispatch('message', {title: '提示', message: '采购仓管审核成功！', type: 'success'});
      success && success();
    } else {
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },

  async pruchaseWarehouseDecline({commit, dispatch, state}, {id, remark, success, error}) {
    let res = await Purchase.itemDecline({id, remark});
    if (res.code === 0) {
      dispatch('message', {title: '提示', message: '采购仓管审核驳回！', type: 'success'});
      success && success();
    } else {
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },

}

// mutations
const mutations = {
  //初始化数据
  [Types.PURCHASE_WAREHOUSE_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  [Types.PURCHASE_WAREHOUSE_SET_LIST_ITEM](state, { listItem }) {
    state.listItem = listItem;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
