<template>
  <el-select v-model="editValue" filterable placeholder="请选择" :disabled="disabled" :size="size" :clearable="clearable"
             style="width:100%;">
    <el-option v-if="showAll" key="" value="" label="全部"/>
    <el-option v-if="nationwide" key="nationwide" value="nationwide" label="全国"/>
    <el-option v-for="item in dataItem" :key="item.code" :label="item.title" :value="item.code"/>
  </el-select>
</template>

<script>
  import {Select, Option, MessageBox} from 'element-ui';
  import {Http, Config} from '@/util';

  export default {
    name: "SelectProvince",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    props: {
      value: {type: [String, Number], default: ''},
      disabled: {type: Boolean, default: false},
      clearable: {type: Boolean, default: false},
      showAll: {type: Boolean, default: false},
      size: {type: String, default: ''},
      nationwide: {type: Boolean, default: false}, //是否显示全国
      isAuth: {type: Boolean, default: false}, //是否要求权限
      autoselect: { type: Boolean, default: true},  // 在只有一个省份的情况下，是否自动选择
    },
    model: {
      prop: 'value',
      event: 'change'
    },

    watch: {
      value: {
        deep: true,
        immediate: true,
        handler: function (next, prev) {
          this.handleSync();
        }
      }
    },

    data() {
      return {
        dataItem: []
      }
    },
    computed: {
      editValue: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    created() {
      this.baseProvinceList();
    },
    methods: {

      handleSync() {
        let value = this.$props.value;

        if (!value) {
          this.$emit('sync', {code: '', title: ''});
          return;
        }

        if (value === 'nationwide') {
          this.$emit('sync', {code: 'nationwide', title: '中国'});
          return;
        }

        let province = this.$data.dataItem.find(item => item.code === value);
        province && this.$emit('sync', {code: province.code, title: province.title});
      },

      //获取所有区域
      async baseProvinceList() {
        let res = await Http.get(this.isAuth ? Config.api.baseProvinceListMy : Config.api.baseProvinceList, {});
        if (res.code === 0) {
          let rd = res.data;
          this.$data.dataItem = rd;
          //如果只有一个区域，默认选择，页面不显示
          if (rd.length === 1) {
            if (!this.$props.autoselect) {
              this.handleSync(this.$props.value);
              return
            }
            this.editValue = rd[0].code;
            // that.changeProvince(rd[0].code, true);
            return;
          }

          this.handleSync(this.$props.value);
        } else {
          MessageBox.alert(res.message, '提示');
        }
      }

    }

  }
</script>

<style scoped>

</style>
