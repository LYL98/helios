import { Purchase } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  listItem: {  // 供应商列表
    items: [],
    num: 0
  },
};

const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  pruchaseSupplierListItem: state => state.listItem
}

// actions
const actions = {
  async pruchaseSupplierQuery({commit, dispatch, state}, {query}) {
    let res = await Purchase.supplierQuery(query);
    if (res.code === 0) {
      commit(Types.PURCHASE_SUPPLIER_SET_LIST_ITEM, { listItem: res.data });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async pruchaseSupplierAdd({commit, dispatch, state}, {item, success, error}) {
    let res = await Purchase.supplierAdd(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '供应商添加成功！', type: 'success'});
      // 如果有callback 则执行callback
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async pruchaseSupplierModify({commit, dispatch, state}, {item, success, error}) {
    let res = await Purchase.supplierModify(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '供应商修改成功！', type: 'success'});
      // 如果有callback 则执行callback
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async pruchaseSupplierApprove({commit, dispatch, state}, {id}) {
    let res = await Purchase.supplierApprove({id});
    if (res.code === 0) {
      // 如果审核通过
      this.$message({title: '提示', message: '供应商审核成功！', type: 'success'});
      commit(Types.PURCHASE_SUPPLIER_SET_ITEM_APPROVE, { id: id, isApprove: true });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

  async pruchaseSupplierFreeze({commit, dispatch, state}, {id}) {
    let res = await Purchase.supplierFreeze({id});
    if (res.code === 0) {
      // 如果审核通过
      this.$message({title: '提示', message: '供应商冻结成功！', type: 'success'});
      commit(Types.PURCHASE_SUPPLIER_SET_ITEM_FREEZE, { id: id, isFreeze: true });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

  async pruchaseSupplierUnFreeze({commit, dispatch, state}, {id}) {
    let res = await Purchase.supplierUnFreeze({id});
    if (res.code === 0) {
      // 如果审核通过
      this.$message({title: '提示', message: '供应商解冻成功！', type: 'success'});
      commit(Types.PURCHASE_SUPPLIER_SET_ITEM_FREEZE, { id: id, isFreeze: false });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },

}

// mutations
const mutations = {
  //初始化数据
  [Types.PURCHASE_SUPPLIER_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  [Types.PURCHASE_SUPPLIER_SET_LIST_ITEM](state, { listItem }) {
    state.listItem = listItem;
  },
  [Types.PURCHASE_SUPPLIER_SET_ITEM_APPROVE](state, { id, isApprove }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { is_check: isApprove })
      } else {
        return item;
      }
    });
  },
  [Types.PURCHASE_SUPPLIER_SET_ITEM_FREEZE](state, { id, isFreeze }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { is_freeze: isFreeze })
      } else {
        return item;
      }
    });
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
