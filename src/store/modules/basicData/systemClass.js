import { BasicData } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  dataItem: [],
  detail: {},
  isShowAddEdit: false
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  basicDataSystemClassListDataItem: state => state.dataItem,
  basicDataSystemClassIsShowAddEdit: state => state.isShowAddEdit,
  basicDataSystemClassDetail: state => state.detail
}

// actions
const actions = {
  //显示隐藏科学分类新增修改
  basicDataSystemClassShowHideAddEdit({commit}, {isShow, data}){
    commit(Types.BASIC_DATA_SYSTEM_CLASS_IS_SHOW_ADD_EDIT, isShow);
    if(data){
      commit(Types.BASIC_DATA_SYSTEM_CLASS_DETAIL, {...data, id: true}); //假id，为了判断新增或修改
    }else{
      commit(Types.BASIC_DATA_SYSTEM_CLASS_DETAIL, {});
    }
  },
  //获取科学分类列表(树型)
  async basicdataSystemClassListTree({commit, dispatch}, data){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData.basicdataSystemClassListTree(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      let rd = res.data;
      let fun = (dd) =>{
        dd.forEach(item => {
          item.id = item.code;
          item.label = item.title;
          if(item.childs && item.childs.length > 0){
            fun(item.childs);
          }
          item.children = item.childs;
        });
      }
      fun(rd);//递归
      commit(Types.BASIC_DATA_SYSTEM_CLASS_SAVE_DATA_ITEM, rd);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取科学分类删除
  async basicDataSystemClassDelete({dispatch}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData.basicdataSystemClassDelete(data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: '科学分类已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改科学分类
  async basicDataSystemClassAddEdit({dispatch}, {data, callback}){
    dispatch('loading', {isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataSystemClassEdit':'basicdataSystemClassAdd'](data);
    dispatch('loading', {isShow: false});
    if(res.code === 0){
      dispatch('message', {title: '提示', message: `科学分类${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      dispatch('message', {title: '提示', message: res.message, type: 'error'});
    }
  },
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_SYSTEM_CLASS_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //科学分类列表数据
  [Types.BASIC_DATA_SYSTEM_CLASS_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //科学分类详情
  [Types.BASIC_DATA_SYSTEM_CLASS_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏科学分类新增修改
  [Types.BASIC_DATA_SYSTEM_CLASS_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}