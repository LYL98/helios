import { Item } from '@/service';
import * as Types from '@/store/mutationTypes';

// initial state
const initDetaliData = {
  dataItem: {
    items: []
  },
  detail: {
    images: [],
    sale_unit: '件',
    is_weigh: true,
    markup_rate_temp: 10,
    tags: [],
    city_prices: []
  },
  isShowAddEdit: false,
  isShowDetail: false,
  isShowEditTags: false,
  isShowEditCode: false
};

// shape: [{ id, quantity }]
const state = JSON.parse( JSON.stringify( initDetaliData ) );

// getters
const getters = {
  itemItemListDataItem: state => state.dataItem,
  itemItemIsShowAddEdit: state => state.isShowAddEdit,
  itemItemDetail: state => state.detail,
  itemItemIsShowDetail: state => state.isShowDetail,
  itemItemIsShowEditTags: state => state.isShowEditTags,
  itemItemIsShowEditCode: state => state.isShowEditCode
}

// actions
const actions = {
  //显示隐藏商品新增修改
  itemItemShowHideAddEdit({commit, dispatch, state}, {isShow, data}){
    commit(Types.ITEM_ITEM_IS_SHOW_ADD_EDIT, isShow);
    if(data && data.id){
      dispatch('itemItemDetail', {id: data.id});//获取详情
    }else{
      commit(Types.ITEM_ITEM_DETAIL, {
        images: [],
        sale_unit: '件',
        is_weigh: true,
        markup_rate_temp: 10,
        tags: [],
        content: '',
        city_prices: []
      });
    }
  },
  //显示隐藏商品详情
  itemItemShowHideDetail({commit, dispatch, state}, {isShow, data}){
    commit(Types.ITEM_ITEM_IS_SHOW_DETAIL, isShow);
    if(data && data.id){
      dispatch('itemItemDetail', {id: data.id});//获取详情
    }else{
      commit(Types.ITEM_ITEM_DETAIL, {
        images: [],
        sale_unit: '件',
        is_weigh: true,
        markup_rate_temp: 10,
        tags: [],
        city_prices: []
      });
    }
  },
  //显示隐藏修改商品标签
  itemItemShowHideEditTags({commit, dispatch, state}, {isShow, data}){
    commit(Types.ITEM_ITEM_IS_SHOW_EDIT_TAGS, isShow);
    if(data && data.id){
      dispatch('itemItemDetail', {id: data.id});//获取详情
    }else{
      commit(Types.ITEM_ITEM_DETAIL, {
        images: [],
        sale_unit: '件',
        is_weigh: true,
        markup_rate_temp: 10,
        tags: []
      });
    }
  },
  itemItemShowHideEditCode({commit, dispatch, state}, {isShow, data}){
    commit(Types.ITEM_ITEM_IS_SHOW_EDIT_CODE, isShow);
    if(data && data.id){
      dispatch('itemItemDetail', {id: data.id});//获取详情
    }else{
      commit(Types.ITEM_ITEM_DETAIL, {
        images: [],
        sale_unit: '件',
        is_weigh: true,
        markup_rate_temp: 10,
        tags: [],
        code: ''
      });
    }
  },
  //获取商品详情
  async itemItemDetail({commit, dispatch, state}, data){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemDetail(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      commit(Types.ITEM_ITEM_DETAIL, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取商品列表
  async itemItemList({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemList(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      typeof callback === 'function' && callback(res.data.items);
      commit(Types.ITEM_ITEM_SAVE_DATA_ITEM, res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //获取商品删除
  async itemItemDelete({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemDelete(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品已删除', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //新增修改商品
  async itemItemAddEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item[data.id?'itemEdit':'itemAdd'](data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: `商品${data.id ? '修改' : '新增'}成功`, type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //商品上架
  async itemItemOnGround({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemOnGround(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品上架成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //商品下架
  async itemItemUnderGround({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemUnderGround(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品下架成功', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //商品审核
  async itemItemStatusApprove({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemStatusApprove(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品已审核', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //商品标签修改
  async itemItemTagsEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemTagsEdit(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品标签已修改', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  },
  //商品标签修改
  async itemCodeEdit({commit, dispatch, state}, {data, callback}){
    this.$loading({isShow: true, isWhole: true});
    let res = await Item.itemCodeEdit(data);
    this.$loading({isShow: false});
    if(res.code === 0){
      this.$message({title: '提示', message: '商品编号已修改', type: 'success'});
      typeof callback === 'function' && callback(res.data);
    }else{
      this.$message({title: '提示', message: res.message, type: 'error'});
    }
  }
}

// mutations
const mutations = {
  //初始化数据
  [Types.ITEM_ITEM_INIT_STATE_DATA](state){
    state = JSON.parse( JSON.stringify( initDetaliData ) );
  },
  //商品列表数据
  [Types.ITEM_ITEM_SAVE_DATA_ITEM](state, data){
    state.dataItem = data;
  },
  //商品详情
  [Types.ITEM_ITEM_DETAIL](state, data){
    state.detail = data;
  },
  //显示隐藏商品新增修改
  [Types.ITEM_ITEM_IS_SHOW_ADD_EDIT](state, data){
    state.isShowAddEdit = data;
  },
  //显示隐藏商品详情
  [Types.ITEM_ITEM_IS_SHOW_DETAIL](state, data){
    state.isShowDetail = data;
  },
  //显示隐藏编辑商品标签
  [Types.ITEM_ITEM_IS_SHOW_EDIT_TAGS](state, data){
    state.isShowEditTags = data;
  },
  //显示隐藏修改商品编号
  [Types.ITEM_ITEM_IS_SHOW_EDIT_CODE](state, data){
    state.isShowEditCode = data;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
