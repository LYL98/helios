<template>
  <el-form label-position="right" label-width="100px" style="width: 620px;">
    <el-form-item label="门店标签">
      <div v-for="(item, index) in tags" :key="index">
        <div style="height: 30px;">{{item.title}}</div>
        <div>
          <el-tag disable-transitions :type="judgeTag(c) ? 'danger' : 'info'" v-for="(c, i) in item.child_tags" :key="i"
            style="margin-right: 5px;cursor:pointer;" @click.native="selectTags(item, c)">
            {{c.title}}
          </el-tag>
        </div>
      </div>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click.native="cancelTag">取消</el-button>
      <el-button @click.native="storeTagEdit" :loading="isSending" type="primary">确定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { Form, FormItem, Tag, Button } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: 'TagsEdit',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-tag': Tag,
    'el-button': Button
  },
  props: {
    item: Object,
    cancelTag: Function,
    affirmTag: Function,
  },
  data() {
    return {
      isSending: false,
      tags: [],
      selectTagIds: []
    }
  },
  created() {
    // 获取所有标签
    let data = JSON.parse(JSON.stringify(this.item)); //破坏原型链，防止修改未保存外层变化
    this.showTag(data);
  },
  methods: {
    
    showTag(data) {
      this.baseStoreTagList();
      let selectTagIds = [];
      data.tags.forEach(item => {
        selectTagIds.push(item.id);
      });
      this.$data.selectTagIds = selectTagIds;
    },

    async baseStoreTagList() {
      let res = await Http.get(Config.api.baseStoreTagList, {});
      if (res.code === 0) {
        this.$data.tags = res.data;
      } else {
       this.$message({ message: res.message, type: 'error' });
      }
    },

    judgeTag(data) {
      let d = this.selectTagIds;
      return d.some(item => item === data.id);
    },

    //标签(一个父标签只能选择一个)
    selectTags(data, item){
      let tagIds = this.selectTagIds;
      if (tagIds.length === 0) {
        tagIds.push(item.id);
      } else {
        for (let i = 0; i < tagIds.length; i++) {
          //如果点击没选择过的，删除这个父标签下目前已选择的
          let con = data.child_tags.filter(ct => tagIds[i] === ct.id && tagIds[i] !== item.id);
          if(con.length > 0){
            tagIds.remove(i);
            i = i - 1;
          }

          //如果当前已选择的，取消选择
          if (item.id === tagIds[i]) {
            tagIds.remove(i);
            break;
          }

          //加入
          if (i === tagIds.length - 1) {
            tagIds.push(item.id);
            break;
          }
        }
      }
      this.selectTagIds = tagIds;
      this.$forceUpdate(); //强制渲染
    },

    /**
     * 修改信息
     */
    async storeTagEdit() {
      let { item, tags, selectTagIds } = this;

      //去除标签没有的项
      for(let i = 0; i < selectTagIds.length; i++){
        let judge = false;
        for(let j = 0; j < tags.length; j++){
          let con = tags[j].child_tags.filter(c => c.id === selectTagIds[i]);
          if(con.length > 0){            
            judge = true;
            break;
          }
        }
        if(!judge){
          selectTagIds.remove(i);
          i = i - 1;
        }
      }

      this.isSending = true;
      let res = await Http.post(Config.api.storeTagEdit, {
        store_id: item.id,
        tag_ids: selectTagIds
      });
      this.isSending = false;
      if (res.code === 0) {
        this.affirmTag();
      } else {
       this.$message({ message: res.message, type: 'error' });
      }
    },

  }
}
</script>
<style lang="scss" scoped>

</style>
