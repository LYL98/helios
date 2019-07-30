import { BasicData } from '@/service';
import * as Types from '@/store/mutationTypes';
import { stat } from 'fs';

// initial state
const initDetaliData = {
  dataItem: [],
  details: {},
  tagIcons:[],
  isShowAddEdit: false
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  basicDataItemTagsListDataItem: state => state.dataItem,
  basicDataItemTagsIsShowAddEdit: state => state.isShowAddEdit,
  basicDataItemTagsDetail: state => state.details,
  basicdataItemTagsIcons: state => state.tagIcons
}

// actions
const actions = {
  //显示隐藏商品标签新增修改
  basicDataItemTagsShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.BASIC_DATA_ITEM_TAGS_IS_SHOW_ADD_EDIT, isShow);
    dispatch('basicdataItemTagsIcons',{})

    if(data && data.id){
      dispatch('basicdataItemTagsDetail', {id: data.id});//获取详情
      // commit(Types.BASIC_DATA_ITEM_TAGS_DETAIL, data);
    }else{
      commit(Types.BASIC_DATA_ITEM_TAGS_DETAIL, {});
    }
  },
  //获取商品标签列表
  async basicDataItemTagsList({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataItemTagsList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_ITEM_TAGS_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取商品标签删除
  async basicDataItemTagsDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataItemTagsDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品标签已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改商品标签
  async basicDataItemTagsAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData[data.id?'basicdataItemTagsEdit':'basicdataItemTagsAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `商品标签${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取icons
  async basicdataItemTagsIcons({commit, dispatch, state}, data ) {
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataItemTagsIcons(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_ITEM_TAGS_ICONS, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取详情
  async basicdataItemTagsDetail({commit, dispatch, state}, data) {
    this.$loading({isShow: true, isWhole: true});
    let res = await BasicData.basicdataItemTagsDetail(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.BASIC_DATA_ITEM_TAGS_DETAIL, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  }
}

// mutations
const mutations = {
  //初始化数据
  [Types.BASIC_DATA_ITEM_TAGS_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //商品标签列表数据
  [Types.BASIC_DATA_ITEM_TAGS_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //商品标签详情
  [Types.BASIC_DATA_ITEM_TAGS_DETAIL](state, data){
    state.details = data;
  },
  //显示隐藏商品标签新增修改
  [Types.BASIC_DATA_ITEM_TAGS_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
  //tagIcons
  [Types.BASIC_DATA_ITEM_TAGS_ICONS](state, data){
    state.tagIcons = data;
  },
  
}

export default {
  state,
  getters,
  actions,
  mutations
}