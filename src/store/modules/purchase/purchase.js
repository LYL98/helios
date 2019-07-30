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
  pruchaseItemListItem: state => state.listItem
}

// actions
const actions = {
  async pruchaseItemQuery({commit, dispatch, state}, {query}) {
    let res = await Purchase.itemQuery(query);
    if (res.code === 0) {
      commit(Types.PURCHASE_ITEM_SET_LIST_ITEM, { listItem: res.data });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async pruchaseItemAdd({commit, dispatch, state}, {entity_dicts, success, error}) {
    let res = await Purchase.itemAdd({entity_dicts});
    if (res.code === 0) {
      this.$message({title: '提示', message: '采购商品添加成功！', type: 'success'});
      // 如果有callback 则执行callback
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async pruchaseItemModify({commit, dispatch, state}, {item, success, error}) {
    let res = await Purchase.itemModify(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '采购商品修改成功！', type: 'success'});
      // 如果有callback 则执行callback
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async pruchaseItemHighAuthor({commit, dispatch, state}, {item, success, error}) {
    let res = await Purchase.itemHighAuthor(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '采购商品修改成功！', type: 'success'});
      // 如果有callback 则执行callback
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async pruchaseItemFirstCheck({commit, dispatch, state}, {id, remark, success, error}) {
    let res = await Purchase.itemFirstCheck({id, remark});
    if (res.code === 0) {
      // 如果审核通过
      this.$message({title: '提示', message: '采购商品一审成功！', type: 'success'});
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async pruchaseItemSecondCheck({commit, dispatch, state}, {id, remark, success, error}) {
    let res = await Purchase.itemSecondCheck({id, remark});
    if (res.code === 0) {
      // 如果审核通过
      this.$message({title: '提示', message: '采购商品二审成功！', type: 'success'});
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },

  async pruchaseItemDecline({commit, dispatch, state}, {id, remark, success, error}) {
    let res = await Purchase.itemDecline({id, remark});
    if (res.code === 0) {
      this.$message({title: '提示', message: '采购商品审核驳回！', type: 'success'});
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },

}

// mutations
const mutations = {
  //初始化数据
  [Types.PURCHASE_ITEM_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  [Types.PURCHASE_ITEM_SET_LIST_ITEM](state, { listItem }) {
    state.listItem = listItem;
  },
  [Types.PURCHASE_ITEM_SET_ITEM_FIRST_CHECKED](state, { id }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { status: 'first_checked' })
      } else {
        return item;
      }
    });
  },
  [Types.PURCHASE_ITEM_SET_ITEM_SECOND_CHECKED](state, { id }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { status: 'second_checked' })
      } else {
        return item;
      }
    });
  },
  [Types.PURCHASE_ITEM_SET_ITEM_DECLINED](state, { id }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { status: 'declined' })
      } else {
        return item;
      }
    });
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
