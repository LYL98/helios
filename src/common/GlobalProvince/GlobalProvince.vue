<template>
  <div class="select-province">
    <div @click="show" class="select-province-div">
      省份：{{province && province.title}}<i class="el-icon-arrow-down el-icon--right"></i>
    </div>
    <el-dialog title="选择省份" :visible="isShow" :before-close="cancel" append-to-body :show-close="false" :close-on-press-escape="false">
      <div v-if="dataItem.length > 0">
        <el-tag :type="province && province.code === item.code ? 'danger' : 'info'" v-for="(item, index) in dataItem" :key="index" style="margin-right: 15px;cursor:pointer;" @click.native="changeProvince(item)">{{item.title}}</el-tag>
      </div>
      <div style="color: #999;font-size: 18px;" v-else>无权限访问</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancel" v-if="province && province.code">取 消</el-button>
        <el-button @click.native="cancel" v-else>退出重新登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Button, Input, Dialog, Tag} from 'element-ui';
import { Http, Config, Method } from '@/util';

export default {
  name: "GlobalProvince",
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-tag': Tag
  },
  created(){
    let pageName = this.$router.history.current.name;
    if(pageName) this.baseProvinceListMy();
  },
  data() {
    return {
      province: this.$province,
      isShow: false,
      dataItem: []
    };
  },
  methods: {
    //选择全局省
    show(){
      this.$data.isShow = true;
    },
    //取消选择
    cancel(){
      let { province } = this;
      if(province && province.code){
        this.$data.isShow = false;
      }else{
        this.loginOut();
      }
    },
    //省改变
    changeProvince(data){
      Method.setLocalStorage('appleGlobalProvince', data);//缓存
      window.location.reload();
    },
    //获取所有省
    async baseProvinceListMy(){
      let { province } = this;
      let res = await Http.get(Config.api.baseProvinceListMy, {});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
        //如果只有一个省，默认选择
        if(rd.length === 1 && province.code != rd[0].code){
          this.changeProvince(rd[0]);
        }else if(rd.length === 0 || !province.code){
          this.show();
        }else{
          for(let i = 0; i < rd.length; i++){
            if(province.code === rd[i].code){
              return;
            }
          }
          this.show();
        }
      }else{
        this.$message({ message: res.message, type: 'error' });
      }
    },
    //登出
    async loginOut(){
      this.$loading({ isShow: true });
      let res = await Http.get(Config.api.signLogout, {});
      this.$loading({ isShow: false });
      if(res.code === 0){
        if(Method.isFullScreen()) Method.closeFullScreen(); //退出全屏
        this.$router.replace({ name: "Login" });
        //window.location.replace('/');
      }else{
        this.$message({ message: res.message, type: 'error' });
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .select-province{
    height: 42px;
    line-height: 42px;
    cursor: pointer;
    .select-province-div{
      i{
        position: relative;
        top: 1px;
      }
    }
  }
</style>
