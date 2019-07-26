<template>
  <el-autocomplete
    v-model="title"
    :size="size"
    :clearable="clearable"
    :disabled="disabled"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholder"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script>
  import { Autocomplete, Button } from 'element-ui';
  import { Base } from '@/service';

  export default {
    name: "SearchItem",
    components: {
      'el-autocomplete': Autocomplete,
      'el-button': Button
    },
    props: {
      size: { type: String, default: '' },
      item: { type: Object, required: true },
      placeholder: { type: String, default: '输入商品名称或编号查询选择' },
      is_clear_input_on_selected: { type: Boolean, default: false }, // 用户选择后，是否清空已输入内容
      clearable: { type: Boolean, default: true },
      disabled: { type: Boolean, default: false },
      is_all: { type: Boolean, default: false},
      is_gift: { type: String | Number, default: null }, // 是否是赠品 0:不是赠品 1:是赠品 不传则为全部
      is_promotion: { type: Object, default: null }, // 是否是活动中的商品 { promotion_time_start, promotion_time_end } eg: 2018-11-29 13:57:13
    },
    model: {
      prop: 'item',
      event: 'select'
    },
    data() {
      let {title} = this.$props.item;
      return {
        itemList: [],
        title: title
      }
    },
    watch: {
      title: function(next, pre) {
        // 如果用户清空了输入值，则初始化双向绑定的对象值。
        if (!next) {
          this.$emit('select', { id: '', title: '', frame: {code: '', price: 0}, sale_unit: '件' });
        }
      },
      item: {
        deep: true,
        handler: function (next, pre) {
          this.$data.title = next.title;
        }
      }
    },
    methods: {
      querySearchAsync(queryString, cb) {

        // 如果需要筛选活动商品，但是活动的起止事件不存在，则提示缺少活动日期选择！
        if (this.$props.is_promotion && (!this.$props.is_promotion.promotion_time_start || !this.$props.is_promotion.promotion_time_end)) {
          this.$emit('misscondition'); // 缺少必备的查询条件(日期)
          return cb([]);
        }

        if (!queryString) {
          return cb([]); // 如果查询字符串不存在，则直接返回一个空的队列。
        }
        this.baseItemList({query: queryString}, items => cb(items));
      },
      handleSelect(item) {
        this.$emit('select', item)
        if (this.$props.is_clear_input_on_selected) {
          this.$data.title = '';
        }
      },

      async baseItemList({query, id}, callback) {

        let data = { condition: query, province_code: this.province.code };

        if (this.$props.is_gift !== null) {
          data.is_gift = this.$props.is_gift;
        }
        // 添加是否上下架的判断，1 表示全部，0表示只筛选上架的
        if (this.$props.is_all) {
          data.is_all = 1;
        }
        if (this.$props.is_promotion) {
          data.promotion_time_start = this.$props.is_promotion.promotion_time_start;
          data.promotion_time_end = this.$props.is_promotion.promotion_time_end;
        }

        let res = await Base.baseItemList(data);
        if (res.code === 0) {
          let rd = res.data;
          if (rd.length === 0) { // 如果查询结果为空，则提示没有结果
            this.$emit('noresult');
          } else {
            this.$emit('hasresult');
          }
          rd.map(item => item.value = item.title);
          callback(rd)
        }

      }
    }
  }
</script>

<style scoped>

</style>
