import { Message } from 'element-ui';

const GET_LODOP = function() {
  let LODOP = getLodop && getLodop();
  if (!LODOP) {
    Message.warning({
      dangerouslyUseHTMLString: true,
      message: '<div>缺少打印插件，请<a href="CLodop_Setup_for_Win32NT.exe" target="_self" style="color: #E6A23C; padding: 0 5px; text-decoration: underline">下载</a>并执行安装</div>',
      duration: 0,
      showClose: true,
    })
    return;
  }
  return LODOP;
};

const prefixInteger = function(num, n) {
  return (Array(n).join(0) + num).slice(-n);
};

export default {
  tempGoodsCode: function(item) {
    let LODOP = GET_LODOP();
    if (!LODOP) return;
    let qrcontent = `{"type":"item","sub_item_id":${item.item_id},"item_code":${item.item_code},"order_id":${item.id},"order_type":"${(item.order_type || 'distribute')}","batch_code":"${item.batch_code}"}`;
    console.log('qrcontent: ', qrcontent);
    LODOP.PRINT_INIT('打印商品码');
    LODOP.SET_PRINT_PAGESIZE(1, 600, 400);
    LODOP.ADD_PRINT_BARCODE(5, 69, 100, 100, 'QRCode', qrcontent);
    LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion');
    LODOP.SET_PRINT_STYLEA(0,"QRCodeErrorLevel","L"); // //L为低容错率7%，默认是M级容错率15%，最高级H级容错率是30%
    LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
    LODOP.SET_PRINT_STYLE('FontSize', 13);
    LODOP.SET_PRINT_STYLE('Bold', 1);
    LODOP.SET_PRINT_STYLE('Alignment', 2);
    LODOP.ADD_PRINT_TEXT(95, 0, 226, 20, item.item_code);
    LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
    LODOP.SET_PRINT_STYLE('FontSize', 9);
    LODOP.SET_PRINT_STYLE('Bold', 0);
    LODOP.SET_PRINT_STYLE('Alignment', 2);
    LODOP.ADD_PRINT_TEXT(115, 0, 226, 20, (item.item_title || '').slice(0, 18));
    return LODOP;
  },

  tempTrayCode: function(list) {
    let LODOP = GET_LODOP();
    if (!LODOP) return;
    LODOP.PRINT_INIT('打印托盘码');
    list.forEach(item => {
      LODOP.NewPage();
      let qrcontent = `{"type":"tray","id":${item.id}}`
      LODOP.SET_PRINT_PAGESIZE(1, 600, 400);
      LODOP.ADD_PRINT_BARCODE(5, 60, 116, 116, 'QRCode', qrcontent);
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion');
      LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
      LODOP.SET_PRINT_STYLE('FontSize', 13);
      LODOP.SET_PRINT_STYLE('Bold', 1);
      LODOP.SET_PRINT_STYLE('Alignment', 2);
      LODOP.ADD_PRINT_TEXT(115, 0, 226, 20, item.code);
    });
    return LODOP;
  },

  tempOperateLine: function(item) {
    let LODOP = GET_LODOP();
    if (!LODOP) return;
    let qrcontent = `{"type":"line","id":${item.line_id}}`;
    LODOP.PRINT_INIT('打印线路');
    // width: 793.8px; height: 1122.66px;
    LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4');
    LODOP.ADD_PRINT_BARCODE(300, 215, 400, 400, 'QRCode', qrcontent);
    LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion');
    LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
    LODOP.SET_PRINT_STYLE('FontSize', 50);
    LODOP.SET_PRINT_STYLE('Bold', 1);
    LODOP.SET_PRINT_STYLE('Alignment', 2);
    LODOP.ADD_PRINT_TEXT(680, 0, 793, 80, `${item.line_index}号线`);
    LODOP.SET_PRINT_STYLE('FontSize', 30);
    LODOP.ADD_PRINT_TEXT(770, 0, 793, 50, item.title);
    return LODOP;
  },

  tempTruckBatchPrint(list, delivery_date) {
    let LODOP = GET_LODOP();
    if (!LODOP) return;


    let stores = [];

    // 批次层 -> 遍历 线路列表
    list.forEach(batch => {

      // 线路层 -> 遍历 门店列表
      batch.items.forEach(line => {

        // 门店层 -> 遍历 门店列表 如果该门店是当前线路下的第一个门店，则额外添加线路信息，所有门店都添加商品信息到taskList
        line.stores.forEach((store, index) => {

          let taskList = [];
          if (index === 0) {
            taskList.push({
              type: 'line',
              line_index: prefixInteger(line.line_index, 2),
              line_title: line.line_title,
              line_num: line.num,
              item_code: batch.item_code,
            });
          }
          // 该门店的商品数量
          let nums = Array.from({ length: store.num });
          let task = {
            type: 'item',
            line_index: prefixInteger(line.line_index, 2),
            line_title: line.line_title,
            city_index: prefixInteger(store.city_index, 2),
            store_index: prefixInteger(store.store_index, 2),
            store_title: (store.store.title || '').slice(0, 10),
            item_code: batch.item_code,
            item_title: batch.item_title,
            nums: store.num,
            delivery_date: (delivery_date || '').slice(5, 10),
            qrcontent: `{"type":"sort","out_stock_id":${batch.id},"item_id":${batch.item_id}}`
          };

          nums.forEach((d, index) => {
            task.index = index + 1;
            taskList.push({...task});
          });

          stores.push(taskList);

        });


      });
    });

    stores.forEach((taskList, index) => {
      LODOP.PRINT_INIT('打印装车批次-配送门店');
      taskList.forEach(task => {
        if (task.type === 'line') {
          LODOP.NewPage();
          LODOP.SET_PRINT_PAGESIZE(1, 600, 400);
          LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
          LODOP.SET_PRINT_STYLE('FontSize', 18);
          LODOP.SET_PRINT_STYLE('Bold', 1);
          LODOP.SET_PRINT_STYLE('Alignment', 2);
          LODOP.ADD_PRINT_TEXT(5, 0, 226, 60, `${task.line_index}/${task.line_title}`);
          LODOP.SET_PRINT_STYLE('FontSize', 20);
          LODOP.ADD_PRINT_TEXT(75, 0, 226, 30, `${task.line_num}件`);
          LODOP.ADD_PRINT_TEXT(105, 0, 226, 30, task.item_code);
        } else {
          LODOP.NewPage();
          LODOP.SET_PRINT_PAGESIZE(1, 600, 400);
          LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
          LODOP.SET_PRINT_STYLE('FontSize', 20);
          LODOP.SET_PRINT_STYLE('Bold', 1);
          LODOP.SET_PRINT_STYLE('Alignment', 2);
          LODOP.ADD_PRINT_TEXT(5, 0, 226, 40, `${task.line_index}-${task.city_index}-${task.store_index}`);
          LODOP.SET_PRINT_STYLE('FontSize', 9);
          LODOP.SET_PRINT_STYLE('Alignment', 1);
          LODOP.ADD_PRINT_TEXT(45, 5, 130, 20, task.store_title);
          LODOP.SET_PRINT_STYLE('FontSize', 8);
          LODOP.ADD_PRINT_TEXT(70, 5, 125, 50, `${task.item_code}/${task.item_title}`);
          LODOP.ADD_PRINT_TEXT(125, 5, 125, 20, `${task.index} / ${task.nums}`);
          LODOP.SET_PRINT_STYLE('Alignment', 3);
          LODOP.ADD_PRINT_TEXT(125, 5, 125, 20, `蒲公英${task.delivery_date}`);
          LODOP.ADD_PRINT_BARCODE(45, 135, 95, 95, 'QRCode', task.qrcontent);
          LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion');
        }

      });
      LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME","打印装车批次-配送门店"+index);
      LODOP.PRINT();

    });

  },

  tempTruckBatchPreview: function(list, delivery_date) {
    let LODOP = GET_LODOP();
    if (!LODOP) return;
    LODOP.PRINT_INIT('打印装车批次');

    list.forEach(d => {
      let qrcontent = `{"type":"sort","out_stock_id":${d.id},"item_id":${d.item_id}}`;
      d.items.forEach(item => {
        LODOP.NewPage();
        LODOP.SET_PRINT_PAGESIZE(1, 600, 400);
        LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
        LODOP.SET_PRINT_STYLE('FontSize', 18);
        LODOP.SET_PRINT_STYLE('Bold', 1);
        LODOP.SET_PRINT_STYLE('Alignment', 2);
        LODOP.ADD_PRINT_TEXT(5, 0, 226, 60, `${prefixInteger(item.line_index, 2)}/${item.line_title}`);
        LODOP.SET_PRINT_STYLE('FontSize', 20);
        LODOP.ADD_PRINT_TEXT(75, 0, 226, 30, `${item.num}件`);
        LODOP.ADD_PRINT_TEXT(105, 0, 226, 30, d.item_code);
        item.stores.forEach(store => {
          let nums = Array.from({length: store.num});
          nums.forEach((n, i) => {
            LODOP.NewPage();
            LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLE('FontSize', 20);
            LODOP.SET_PRINT_STYLE('Bold', 1);
            LODOP.SET_PRINT_STYLE('Alignment', 2);
            LODOP.ADD_PRINT_TEXT(5, 0, 226, 40, `${prefixInteger(item.line_index, 2)}-${prefixInteger(store.city_index, 2)}-${prefixInteger(store.store_index, 2)}`);
            LODOP.SET_PRINT_STYLE('FontSize', 9);
            LODOP.SET_PRINT_STYLE('Alignment', 1);
            LODOP.ADD_PRINT_TEXT(45, 5, 130, 20, (store.store.title || '').slice(0, 10));
            LODOP.SET_PRINT_STYLE('FontSize', 8);
            LODOP.ADD_PRINT_TEXT(70, 5, 125, 50, `${d.item_code}/${d.item_title}`);
            LODOP.ADD_PRINT_TEXT(125, 5, 125, 20, `${i+1} / ${store.num}`);
            LODOP.SET_PRINT_STYLE('Alignment', 3);
            LODOP.ADD_PRINT_TEXT(125, 5, 125, 20, `蒲公英${(delivery_date || '').slice(5, 10)}`);
            LODOP.ADD_PRINT_BARCODE(45, 135, 95, 95, 'QRCode', qrcontent);
            LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion');
          });
        })
      })
    });
    return LODOP;
  }
}
