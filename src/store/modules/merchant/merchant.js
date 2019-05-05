import { Merchant } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  id: null,  // 商户id
};

const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  merchant_id: state => state.id
}

// actions
const actions = {

}

// mutations
const mutations = {
  //初始化数据
  [Types.MERCHANT_INIT_STATE](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //设置商户id
  [Types.MERCHANT_SET_ID](state, { id }){
    state.id =  id;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
