import { System } from '@/service';
import * as Types from '@/store/mutationTypes';

const initDetailData = {
    brand: {},
    brandService: {},
};

const state = JSON.parse( JSON.stringify( initDetailData ) );

const getters = {
  brand: state => state.brand,
  brandService: state => state.brandService,
};

const actions = {
  //获取品牌信息
  async systemBrand({commit, dispatch, state},{data,callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.systemBrand(data);
    this.$loading({isShow: false});
    if (res.code === 0) {
      if(data !='get')this.$message({title: '提示', message: res.message, type: 'success'});
      commit(Types.SYSTEM_BRAND, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async systemBrandService({commit, dispatch, state},{data,callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.systemBrandService(data);
    this.$loading({isShow: false});
    if (res.code === 0) {
      if(data !='get')this.$message({title: '提示', message: res.message, type: 'success'});
      commit(Types.SYSTEM_BRAND_SERVICE, res.data);
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
};

const mutations = {
  //品牌信息
  [Types.SYSTEM_BRAND](state, data){
    state.brand = data;
  },
  [Types.SYSTEM_BRAND_SERVICE](state, data){
    state.brandService = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
