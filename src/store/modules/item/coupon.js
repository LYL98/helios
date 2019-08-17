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
  itemCouponListItem: state => state.listItem
}

// actions
const actions = {
  async itemCouponQuery({commit, dispatch, state}, {query}) {
    let res = await Item.couponQuery(query);
    if (res.code === 0) {
      commit(Types.ITEM_COUPON_SET_LIST_ITEM, { listItem: res.data });
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async itemCouponAdd({commit, dispatch, state}, {item, success, error}) {
    let res = await Item.couponAdd(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '优惠券添加成功！', type: 'success'});
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async itemCouponDistribute({commit, dispatch, state}, {item, success, error}) {
    let res = await Item.couponDistribute(item);
    if (res.code === 0) {
      this.$message({title: '提示', message: '优惠券发放成功！', type: 'success'});
      success && success();
    } else {
      this.$message({title: '提示', message: res.message, type: 'error'});
      error && error();
    }
  },
  async itemCouponAutoDis({commit, dispatch, state}, {data, success, error}) {
    let res = await Item.couponAutoDis(data);
    let message = data.auto_dis_status == 0 ? '自动发放已暂停！' : '自动发放已开始！';
    if (res.code === 0) {
      this.$message({title: '提示', message: message, type: 'success'});
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
  [Types.ITEM_COUPON_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  [Types.ITEM_COUPON_SET_LIST_ITEM](state, { listItem }) {
    state.listItem = listItem;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
