import { Item } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  listItem: {
    items: [],
    num: 0
  },
};

const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  itemScopePromotionListItem: state => state.listItem
}

// actions
const actions = {
  async itemScopePromotionQuery({commit, dispatch, state}, {query}) {
    let res = await Item.scopePromotionQuery(query);
    if (res.code === 0) {
      commit(Types.ITEM_SCOPE_PROMOTION_SET_LIST_ITEM, { listItem: res.data });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async itemScopePromotionAdd({commit, dispatch, state}, {item, success, error}) {
    let res = await Item.scopePromotionAdd(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '促销活动添加成功！', type: 'success'});
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async itemScopePromotionStart({commit, dispatch, state}, {promotion_id, callback}) {
    let res = await Item.promotionStart({promotion_id});
    if (res.code === 0) {
      this.$message({title: '提示', message: '活动已经上架！', type: 'success'});
      callback && callback();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async itemScopePromotionHalt({commit, dispatch, state}, {promotion_id, callback}) {
    let res = await Item.promotionHalt({promotion_id});
    if (res.code === 0) {
      this.$message({title: '提示', message: '活动已经下架！', type: 'success'});
      callback && callback();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.ITEM_SCOPE_PROMOTION_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  [Types.ITEM_SCOPE_PROMOTION_SET_LIST_ITEM](state, { listItem }) {
    state.listItem = listItem;
  },
  [Types.ITEM_SCOPE_PROMOTION_SET_ITEM_START](state, { id }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { status: 'st_activated' })
      } else {
        return item;
      }
    });
  },
  [Types.ITEM_SCOPE_PROMOTION_SET_ITEM_HALT](state, { id }) {
    state.listItem.items = state.listItem.items.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { is_halt: true })
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
