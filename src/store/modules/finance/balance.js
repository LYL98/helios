import { Finance } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  listItem: {  // 余额列表
    items: [],
    num: 0
  },
};

const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  financeBalanceListItem: state => state.listItem
}

const actions = {
  async financeBalanceQuery({commit, dispatch, state}, {query}) {
    let res = await Finance.balanceQuery(query);
    if (res.code === 0) {
      commit(Types.FINANCE_BALANCE_SET_LIST_ITEM, { listItem: res.data });
    } else {
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  async financeBalanceEdit({commit, dispatch, state}, {item, success, error}) {
    let res = await Finance.balanceEdit(item);
    let message = (item.amount >= 0 ? '充值' : '扣款') + '记录提交成功！等待财务审核...';
    if (res.code === 0) {
      dispatch('message', {title: '提示', message: message, type: 'success'});
      // 如果有callback 则执行callback
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
  [Types.FINANCE_BALANCE_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  [Types.FINANCE_BALANCE_SET_LIST_ITEM](state, { listItem }) {
    state.listItem = listItem;
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
