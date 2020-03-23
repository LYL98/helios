<template>
  <sub-menu>
    <query-merchant-store v-model="query" @change="changeQuery" :reset="resetQuery"/>
    <div class="container-table">
      <div class="table-top" v-if="auth.isAdmin || auth.MerchantExport || auth.MerchantAdd">
        <div class="left"></div>
        <div class="right">
          <el-button v-if="auth.isAdmin || auth.MerchantExport" @click.native="() => {merchantListExport();}" size="mini" type="primary" plain >导出商户列表</el-button>
          <el-button v-if="auth.isAdmin || auth.MerchantAdd" @click="() => addMerchantDialogVisible = true" size="mini" type="primary">新增</el-button>
        </div>
      </div>
      <!-- 头部end -->

      <!-- 列表渲染 -->
      <table-merchant-list
        :dataItemTemp="dataItem"
        :page="query.page"
        :pageSize="query.page_size"
        :deleteStore="deleteStore"
        :showDetail="showDetail"
        :affirmStoreFreeze="affirmStoreFreeze"
        :affirmStoreUnFreeze="affirmStoreUnFreeze"
        :getPageComponents="viewGetPageComponents"
        ref="TableMerchantList"
      />
    

      <!-- 分页标签 -->
      <div class="footer" v-if="dataItem.num > 0">
        <div class="table-pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50]"
            @size-change="changePageSize"
            @current-change="changePage"
            :total="dataItem.num"
            :page-size="query.page_size"
            :current-page="query.page"
          />
        </div>
      </div>
    </div>

    <el-dialog title="商户详情" width="1200px" :visible.sync="detailDialog.isShow" append-to-body>
      <detail-merchant-list :storeQuery="storeQuery" v-if="detailDialog.isShow" :merchant_id="merchant_id"/>
    </el-dialog>

    <el-dialog title="新增商户" width="808px" :close-on-click-modal="false" :visible.sync="addMerchantDialogVisible" append-to-body>
      <add-edit-merchant-list v-if="addMerchantDialogVisible" :editMerchantSuccess="addMerchantSuccess" :editMerchantCancel="addMerchantCancel"/>
    </el-dialog>
  </sub-menu>
</template>

<script>
  import { MessageBox, Message, Form, FormItem, Button, Input, Select, Option, Dialog, Tag, Pagination } from 'element-ui';
  import { QueryMerchantStore, TableMerchantList, AddEditMerchantList, DetailMerchantList } from '@/container';
  import { Config, Constant, DataHandle, Method, Http } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "MerchantList",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'table-merchant-list': TableMerchantList,
      'add-edit-merchant-list': AddEditMerchantList,
      'detail-merchant-list': DetailMerchantList,
      'query-merchant-store': QueryMerchantStore,
    },
    mixins: [mainMixin],
    created() {
      let that = this;
      documentTitle('业务 - 门店');
      let p = that.province;
      if (p.code) {
        that.$data.query.province_code = p.code;
        that.storeQuery();
      }
    },
    data() {
      return {
        merchant_id: '',
        province: this.$province,
        auth: this.$auth,
        tencentPath: Config.tencentPath,
        provinceList: [],//区域列表
        query: {
          is_audited: '',
          is_freeze: '',
          is_post_pay: '',
          gb_included: '',
          province_code: '',
          city_id: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        dataItem: {
          items: [],
          num: 0
        },
        isShowDetail: false,
        detailDialog: {
          isShow: false,
          item: {}
        },
        searchKeywords: {
          title: '',
          address: '',
          operator: ''
        },
        selectData: {},
        isShowTag: false,
        innerTags: [], //内标签
        outerTags: [], //外标签
        gradeList: [], //等级
        gradeTagData: {},
        addMerchantDialogVisible: false,
        groupBuyMerchantIds: []
      }
    },
    methods: {
      //刷新
      refresh() {
        let {query} = this;
        query.page = 1;
        query.is_audited = '';
        this.$data.query = query;
        this.storeQuery();
      },

      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.storeQuery();
      },

      /**
       * 翻页 的 按钮事件
       * 1、设置组件中 query.page的值
       * 2、调用merchantList 重新加载商户列表信息
       */
      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.storeQuery();
      },

      /**
       * 切换区域 的按钮事件
       * 1、设置当前的区域code
       * 2、设置page属性为1
       * 3、重新加载商户列表
       */
      selectProvince(code) {
        let {query} = this;
        query.province_code = code;
        query.page = 1;
        this.$data.query = query;
        this.storeQuery();
      },

      changeQuery() {
        window.scrollTo(0, 0);
        this.query.page = 1;
        this.storeQuery();
      },
      /**
       * 清楚筛选条件
       */
      resetQuery(){
        let { page_size } = this.$data.query;
        this.$data.query = {
          is_audited: '',
          is_freeze: '',
          is_post_pay: '',
          gb_included: '',
          province_code: this.province.code,
          city_id: '',
          condition: '',
          page: 1,
          page_size: page_size
        };
        this.storeQuery();
      },

      /**
       * 根据城市 查询商户列表
       */
      selectMerchantByCondition() {
        let { query, province } = this;
        query.province_code = province.code; // 当前区域code
        query.page = 1;
        this.$data.query = query;
        this.storeQuery();
      },

      //搜索日期
      changePicker(value){
        let { query } = this;
        if(value && value.length === 2){
          query.begin_date = value[0];
          query.end_date = value[1];
        }else{
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = query;
        this.storeQuery();
      },
      //商户列表导出
      async merchantListExport() {
        let api = Config.api.merchantExport;
        let {is_audited, is_freeze, is_post_pay, gb_included, city_id, condition, begin_date, end_date} = this.query;
        let query = {
          is_audited,
          is_freeze,
          is_post_pay,
          gb_included,
          city_id,
          condition,
          begin_date,
          end_date
        };
        if (!begin_date || !end_date) {
          query.begin_date = '';
          query.end_date = '';
        }
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.province.code,
          ...query
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },
      /**
       * 根据审核状态，筛选商户列表
       * 1、设置审核状态
       * 2、设置page属性为1
       * 3、重新加载商户列表信息
       */
      selectApprove(type) {
        let {query} = this;
        query.is_audited = type;
        query.page = 1;
        this.$data.query = query;
        this.storeQuery();
      },

      /**
       * 根据冻结状态，筛选商户列表
       * 1、设置审核状态
       * 2、设置page属性为1
       * 3、重新加载商户列表信息
       */
      selectFreeze(type) {
        let {query} = this;
        query.is_freeze = type;
        query.page = 1;
        this.$data.query = query;
        this.storeQuery();
      },

      selectPostPay(type) {
        let {query} = this;
        query.is_post_pay = type;
        query.page = 1;
        this.$data.query = query;
        this.storeQuery();
      },

      /**
       * 获取商户列表信息：
       * 1、请求API
       * 2、将获取的data数据，赋值给组件的dataItem
       */
      async storeQuery() {
        let that = this;
        let {query} = that;
        // get merchant list data
        let res = await Http.get(Config.api.storeQuery, query);
        // 如果返回结果正确，则将该数据 赋值给 dataItem；
        if (res.code === 0) {
          that.$data.dataItem = res.data;
          window.scrollTo(0, 0);
        } else { // 如果返回值不正确，则提示弹窗
          Message.warning(res.message);
        }
      },

      /**
       * 点击 【冻结】 按钮的 响应事件，该事件接受一个参数 item，以确认 运营人员目前需要冻结哪个商户？
       * 1、弹窗提醒用户是否需要冻结
       * 2、点击确认后，调用冻结处理函数 merchantFreeze(item)，并将商户的信息传递给该处理函数
       */
      affirmStoreFreeze(data) {
        MessageBox.confirm('确认冻结门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      /**
       * 冻结处理函数，接受一个商户对象 参数
       * 1、发送api请求，传递商户的id 作为api参数 进行冻结，并等待响应结果
       * 2、冻结成功，则调用 merchantList函数（获取商户列表信息），对组件中的dataItem进行重新赋值 ！！！！！！！！！ ？？？ 是否需要重新请求api ？？？
       *
       */
      async storeFreeze(data) {
        let that = this;
        let res = await Http.post(Config.api.storeFreeze, {
          id: data.id
        });
        if (res.code === 0) {
          that.storeQuery();
          Message.success('门店已经冻结！');
        } else {
          Message.warning(res.message);
        }
      },

      /**
       * 点击【解冻】按钮的 响应事件，该事件需要接受一个参数 item，以确认 运营人员目前需要解冻哪个商户？
       * 1、弹窗提醒运营人员 是否需要解冻该商户
       * 2、如果运营人员 点击【确认】按钮，则调用解冻的处理函数 merchantFreeze，并将该商户对象 作为参数 进行传递
       */
      affirmStoreUnFreeze(data) {

        MessageBox.confirm('确认解冻门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeUnFreeze(data);
        }).catch(() => {
          // console.log('取消');
        });

      },
      /**
       * 解冻处理函数，接受一个商户对象 参数
       * 1、发送api请求，传递商户的id，作为api参数 进行解冻，并等待响应结果
       * 2、解冻成功，则调用merchantList函数（获取商户列表信息），对组件中的dateItem进行重新赋值！
       */
      async storeUnFreeze(data) {
        let that = this;
        let res = await Http.post(Config.api.storeUnFreeze, {
          id: data.id
        });
        if (res.code === 0) {
          that.storeQuery();
          Message.success('门店已经解冻！');
        } else {
          Message.warning(res.message);
        }
      },
      /**
       * 获取可以添加给商户的 内标签
       * 1、请求api
       * 2、将可用的内标签，赋值给组件的 innerTags 属性
       */
      async baseMerchantInnerTagsList() {
        let that = this;
        let res = await Http.get(Config.api.baseMerchantInnerTagsList, {});
        if (res.code === 0) {
          that.$data.innerTags = res.data;
        } else {
          Message.warning(res.message);
        }
      },
      /**
       * 获取可以添加给商户的 外标签
       * 1、请求api
       * 2、将可用的外标签，赋值给组件的 outerTags 属性
       */
      async baseMerchantOuterTagsList(data) {
        let that = this;
        let res = await Http.get(Config.api.baseMerchantOuterTagsList, {});
        if (res.code === 0) {
          that.$data.outerTags = res.data;
        } else {
          Message.warning(res.message);
        }
      },
      /**
       * 判断商户的 标签 是否处于选中状态。接受两个参数：标签对象 和 标签类型
       * 1、根据标签类型，获取商户 已拥有的、该类型的 标签列表
       * 2、判断商户拥有的标签列表中，是否有该标签
       * 3、如果有；返回 true，如果没有：返回false
       */
      judgeOuterTag(data, type) {
        let {gradeTagData} = this;
        let d = type === 'inner' ? gradeTagData.inner_tags : gradeTagData.outer_tags;
        return d.some(item => item === data.title);
        // for(let i = 0; i < d.length; i++){
        //   if(d[i] === data.title){
        //     return true;
        //   }
        // }
        // return false;
      },

      /**
       * 设置商户的标签。接受两个参数：用户选择的标签对象、标签类型
       * 1、根据标签类型，获取该商户 已拥有的 该类型 的标签列表
       * 2、判断用户所选择的标签 是否在标签列表中？ 如果在，则表示取消；如果不在，则表示添加。
       * 3、将新设置的 商户标签描述对象 重新赋值给 组件的 gradeTagData
       * 4、强制组件重新渲染 UI
       */
      selectTag(data, type) {
        let that = this;
        // gradeTagData 是 商户拥有的标签描述对象。
        // 该对象的数据结构为：{ grade_code: "", inner_tags: [], outer_tags: [] }
        // 分别代表的函数已：    商户等级         已拥有的 内标签   已拥有的 外标签
        let {gradeTagData} = this;
        let d = type === 'inner' ? gradeTagData.inner_tags : gradeTagData.outer_tags;
        // console.log(data, type, d);
        if (d.length === 0) {
          d.push(data.title);
        } else {
          for (let i = 0; i < d.length; i++) {
            if (data.title === d[i]) {
              d.remove(i);
              break;
            }
            if (i === d.length - 1) {
              d.push(data.title);
              break;
            }
          }
        }
        type === 'inner' ? gradeTagData.inner_tags = d : gradeTagData.outer_tags = d;
        that.$data.gradeTagData = gradeTagData;
        that.$forceUpdate(); //强制渲染
      },

      /**
       * 获取描述等级信息的数据列表
       * 1、请求api
       * 2、将描述等级信息的数据 赋值给 组件的 gradeList
       */
      async baseMerchantGradeList(data) {
        let that = this;
        let res = await Http.get(Config.api.baseMerchantGradeList, {});
        if (res.code === 0) {
          that.$data.gradeList = res.data;
        } else {
          Message.warning(res.message);
        }
      },

      /**
       * 设置等级。接受一个参数，等级对象信息
       * 将用户选中的等级对象的 code，赋值给组件的 gradeTagData.grade_code
       */
      selectGrade(data) {
        let {gradeTagData} = this;
        gradeTagData.grade_code = data.code;
        this.$data.gradeTagData = gradeTagData;
      },

      /**
       * 响应 【修改等级、标签】的按钮事件。接受一个参数：商户对象
       * 1、加载商户等级列表信息
       * 2、加载商户内标签信息
       * 3、加载商户外标签信息
       *
       * 4、设置组件的 selectData属性 为 传递进来的参数 (即：商户对象)
       * 5、设置组件的 gradeTagData属性 为 商户对象的对应信息
       * 6、设置组件的 isShowTag属性 为 true。(即：修改等级、标签 的弹窗 为 显示状态。)
       */
      showTag(data) {
        this.baseMerchantInnerTagsList();//商户内标签
        this.baseMerchantOuterTagsList();//商户外标签
        this.baseMerchantGradeList();//商户等级列表
        this.$data.selectData = data;
        let gradeTagData = {
          grade_code: data.grade_code,
          inner_tags: data.inner_tags,
          outer_tags: data.outer_tags
        }
        this.$data.gradeTagData = gradeTagData;
        this.$data.isShowTag = true;
      },

      //确认删除门店
      deleteStore(data){

        MessageBox.confirm('确定删除门店?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeDelete(data);
        }).catch(() => {
          // console.log('取消');
        });

      },

      //删除门店
      async storeDelete(data){
        let that = this;
        let res = await Http.post(Config.api.storeDelete, {
          id: data.id
        });
        if(res.code === 0){
          Message.success('门店已删除！');
          that.storeQuery();
        }else{
          Message.warning(res.message);
        }
      },

      /**
       * 【修改等级、标签】弹窗 的【取消】 按钮事件。
       *  设置组件的isShowTag 属性为 false
       */
      cancelTag() {
        this.$data.isShowTag = false;
      },

      /**
       * 【修改等级、标签】弹窗 的【确认】 按钮事件。
       *  调用merchantGradeTagsEdit方法
       */
      affirmTag() {
        let that = this;
        that.merchantGradeTagsEdit();
      },

      showDetail(item) {
        this.detailDialog.item = item;
        this.$data.merchant_id = item.merchant_id;
        this.detailDialog.isShow = true;
      },

      cacelDetail() {
        this.detailDialog.isShow = false;
        this.detailDialog.item = {};
        this.merchantInitState();

      },

      /**
       * 修改商户的 标签和等级 信息
       * 1、获取已经修改好的 数据
       * 2、请求api。传递商户id 和 需要修改的数据值，进行修改。并等待响应结果
       * 3、如果响应正常。调用关闭 弹窗事件；并重新加载商户列表信息
       * 4、否则，提示异常信息。
       */
      async merchantGradeTagsEdit() {
        let that = this;
        let {selectData, gradeTagData} = that;
        let res = await Http.post(Config.api.merchantGradeTagsEdit, {
          id: selectData.id,
          ...gradeTagData
        });
        if (res.code === 0) {
          Message.success('等级及标签修改完成！');
          that.cancelTag();
          that.storeQuery();
        } else {
          Message.warning(res.message);
        }
      },

      // 新增用户成功
      addMerchantSuccess() {
        this.addMerchantDialogVisible = false;
        this.refresh();
      },

      // 取消新增商户
      addMerchantCancel() {
        this.addMerchantDialogVisible = false;
      },

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>