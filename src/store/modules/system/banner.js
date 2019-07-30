import { System } from '@/service';
import * as Types from '@/store/mutationTypes';

const initDetailData = {
  dataItem: [],
  dataDetail: {},
  isShowAddEdit: false,
  isShowDetail: false,
};

const state = JSON.parse( JSON.stringify( initDetailData ) );

const getters = {
  bannerDataItem: state => state.dataItem,
  bannerDataDetail: state => state.dataDetail,
  bannerIsShowAddEdit: state => state.isShowAddEdit,
  bannerIsShowDetail: state => state.isShowDetail
};

const actions = {
  //显示隐藏banner新增和修改
  systemBannerShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.SYSTEM_BANNER_IS_SHOW_ADD_EDIT, isShow);
    if(data && data.id){
      commit(Types.SYSTEM_BANNER_DETAIL, data);
    } else {
      commit(Types.SYSTEM_BANNER_DETAIL, {
        image: '',
        url: '',
        is_usable: true
      });
    }
  },
  async systemBannerList({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.systemBannerList(data);
    this.$loading({isShow: false});
    if (res.code === 0) {
      commit(Types.SYSTEM_BANNER_LIST, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async systemBannerAddEdit({commit, dispatch, state}, {data, callback}) {
    this.$loading({isShow: true, isWhole: true});
    let res = await System[data.id?'systemBannerUpdate':'systemBannerAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `Banner${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  async systemBannerDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await System.systemBannerDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
};

const mutations = {
  //运营人员列表数据
  [Types.SYSTEM_BANNER_LIST](state, data){
    state.dataItem = data;
  },
  //显示隐藏运营人员新增修改
  [Types.SYSTEM_BANNER_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
  [Types.SYSTEM_BANNER_DETAIL](state, data){
    state.dataDetail = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
