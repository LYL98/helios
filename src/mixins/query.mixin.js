/**
 *
 * model:
 *    query[Object]：查询对象
 *
 * 参数：
 *    reset[Function]：重置函数
 *
 * 状态：
 *    editQuery[computed]：实时读取query参数的值，在editQuery修改时，向父组件传递修改后的值
 *
 * 事件：
 *    changeQuery[methods]：改变editQuery，向父组件传递change事件
 *    resetQuery[methods]：向父组件传递reset事件
 */
import { DataHandle, Constant } from '@/util';

export default {
  props: {
    // 查询对象
    query: { type: Object, required: true },
    reset: { type: Function, required: true }
  },
  model: {
    prop: 'query',
    event: 'change'
  },
  computed: {
    editQuery: {
      get() {
        /**
         * 修复输入条件，不点击查询按钮，直接点击重置后，无法还原查询条件的问题。
         */
        // return Object.assign({}, this.$props.query);
        return this.$props.query;
      },
      set(v) {
        // 当editQuery改变时，触发change事件，修改父组件的query对象。
        this.$emit('change', v);
      }
    }
  },
  data() {
    return {
      isExpand: false,
      /*最近30天（以当天作为结尾，往前30天）
         本周
         上周
         本月（以本月作为选择）
         上月（以当前所在月的上一个月作为选择）
         本年
         上一年*/
      fixDateOptions: Constant.FIX_DATE_RANGE,
    }
  },
  methods: {
    // 搜索按钮处理
    changeQuery() {
      // 更新editQuery
      this.editQuery = Object.assign(this.editQuery, { page: 1 });
    },
    // 重置按钮处理
    resetQuery() {
      this.$props.reset();
    },
    onExpandChange(isExpand) {
      this.isExpand = isExpand;
      this.$emit('expandChange', this.isExpand)
    }
  }
}
