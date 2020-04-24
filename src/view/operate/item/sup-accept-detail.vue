<template>
  <div>
    <!--  采购品控详情  -->
    <el-form label-position="right" label-width="120px" size="mini" v-if="item.out_type === 'pur'">
      <el-form-area label-position="left" label="采购信息" style="position: relative">
        <el-tag
          style="position: absolute; right: 0; top: 0;"
          size="small"
          :type="!!item.confirmer_id ? 'info' : 'primary'"
          disable-transitions
        >
          {{ !!item.confirmer_id ? '已确认' : '待确认' }}
        </el-tag>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="商品编号/名称：">
              {{ item.item_code }} / {{ item.item_title }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="采购单号：">
              {{ item.batch_code }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="采购日期：">
              {{ item.relate_order && item.relate_order.order_date || '-' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="预计到货：">
              {{ item.relate_order && item.relate_order.estimate_arrive_at || '-' }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="供应商：">
              {{ item.supplier_title }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="采购数量：">
              {{ item.num }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="送达仓：">
              {{ item.relate_order && item.relate_order.storehouse && item.relate_order.storehouse.title || '-' }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>
      <el-form-area label-position="left" label="品控信息">
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="到货数量：">
              {{ item.num_arrive }}件
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="品控数量：">
              {{ item.qa_num }}件
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="合格数量：">
              {{ item.num_arrive - item.un_qa_num }}件
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="保质期：">
              {{ item.shelf_life }}天
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="库存期：">
              {{ item.stock_life }}天
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="备注：">
              {{ item.remark }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="品控人：">
              {{ item.creator && item.creator.realname || '-'}}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="品控时间：">
              {{ item.created }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32" v-if="!!item.confirmer_id">
          <el-col :sm="12" :span="10">
            <el-form-item label="确认人：">
              {{ item.confirmer && item.confirmer.realname || '-'}}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="确认时间：">
              {{ item.confirm_time }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>
    </el-form>

    <!--  调拨详情  -->
    <el-form label-position="right" label-width="120px" size="mini" v-if="item.out_type === 'distribute'">
      <el-form-area label-position="left" label="调拨信息" style="position: relative">
        <el-tag
          style="position: absolute; right: 0; top: 0;"
          size="small"
          :type="!!item.confirmer_id ? 'info' : 'primary'"
          disable-transitions
        >
          {{ !!item.confirmer_id ? '已确认' : '待确认' }}
        </el-tag>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="调拨单号：">
              {{ item.batch_code }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="商品编号/名称：">
              {{ item.item_code }} / {{ item.item_title }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="供应商：">
              {{ item.supplier_title }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="调出仓：">
              {{ item.relate_order && item.relate_order.src_storehouse && item.relate_order.src_storehouse.title || '-'
              }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="调拨数量：">
              {{ item.num }}件
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="调入仓：">
              {{ item.relate_order && item.relate_order.tar_storehouse && item.relate_order.tar_storehouse.title || '-'
              }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="可售日期：">
              {{ item.relate_order && item.relate_order.available_date || '-' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="预计到货：">
              {{ item.relate_order && item.relate_order.estimate_arrive_at || '-' }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>
      <el-form-area label-position="left" label="品控信息">
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="到货数量：">
              {{ item.num_arrive }}件
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="品控数量：">
              {{ item.qa_num }}件
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="合格数量：">
              {{ item.num_arrive - item.un_qa_num }}件
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="保质期：">
              {{ item.shelf_life }}天
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="库存期：">
              {{ item.stock_life }}天
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>
      <el-form-area label-position="left" label="不合格商品处理">
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="不合格数量：">
              {{ item.un_qa_num}}件
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="处理类型：">
              {{ accept_type_staus[item.un_qa_type] }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="备注：">
              {{ item.remark}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="12" :span="10">
            <el-form-item label="品控人：">
              {{ item.creator && item.creator.realname || '-'}}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="品控时间：">
              {{ item.created }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32" v-if="!!item.confirmer_id">
          <el-col :sm="12" :span="10">
            <el-form-item label="确认人：">
              {{ item.confirmer && item.confirmer.realname || '-'}}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="10">
            <el-form-item label="确认时间：">
              {{ item.confirm_time }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>

    </el-form>
  </div>
</template>

<script>
  import {Form, FormItem, Row, Col, Tag} from "element-ui";
  import {FormArea} from '@/common';
  import {Constant} from '@/util';

  export default {
    name: "sup-accept-detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-tag': Tag,
      'el-form-area': FormArea,
    },
    props: {
      item: {type: Object, default: () => ({})},
    },
    data() {
      return {
        accept_type_staus: Constant.SUP_OPT_TYPES()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>
