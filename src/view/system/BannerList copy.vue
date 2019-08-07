<template>
  <div>
    <table-system-banner :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="TableSystemBanner"/>
    <add-edit-system-banner :getPageComponents="getPageComponents" :windowHeight="windowHeight" ref="AddEditSystemBanner"/>
  </div>
</template>

<script>
  import { Config, Constant } from '@/util';
  import { AddEditSystemBanner, TableSystemBanner } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "BannerList",
    mixins: [viewMixin],
    components: {
      'table-system-banner': TableSystemBanner,
      'add-edit-system-banner': AddEditSystemBanner,
    },
    computed: mapGetters({
      dataItem: 'bannerDataItem'
    }),
    data: function () {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
        tencentPath: Config.tencentPath,
        multipleSelection: [],
      }
    },
    created: function () {
      documentTitle("设置 - Banner管理");
      this.systemBannerList({
        data: { province_code: this.province.code }
      });
    },
    methods: {
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      //多选
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      deleteBanner(id) {
        let that = this;
        MessageBox.confirm('您确认要删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          if(id === 'multiple'){
            (that.multipleSelection).forEach(row => {
              ids.push(row.id);
            });
          }else{
            ids = [id];
          }
          that.systemBannerDelete({
            data: {
              ids: ids
            },
            callback: function (data) {
              that.myCallBack()
            }
          });
        }).catch(() => {
          console.log('取消');
        });
      },
      //组件回调
      myCallBack(res){
        this.systemBannerList({
          data: { province_code: this.province.code }
        });
      },
      ...mapActions(['systemBannerList', 'systemBannerShowHideAddEdit', 'systemBannerDelete', 'systemBannerAddEdit'])
    }
  }
</script>

<style scoped>

</style>
