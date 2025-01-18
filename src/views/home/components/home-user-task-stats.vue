<template>
  <div class="box home-user-task-stats bgc1">
    <div class="header">

      <div v-if="statusList" class="title">
        {{ statusList.clazzName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
          parseTime(statusList.createTime, '{y}-{m}-{d}')
        }} 数据
      </div>
    </div>
    <div v-if="statusList" class="body">
      <div class="stats">
        <div class="item">
          <div class="num color1 text-shadow1">
            {{ statusList.count }}
          </div>
          <div class="text color2">总人数（个）</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <div class="num color1 text-shadow1">
            {{ statusList.chi }}
          </div>
          <div class="text color2">迟到</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <div class="num color1 text-shadow1">
            {{ statusList.shi }}
          </div>
          <div class="text color2">事假</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <div class="num color1 text-shadow1">
            {{ statusList.bing }}
          </div>
          <div class="text color2">病假</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <div class="num color1 text-shadow1">
            {{ statusList.zao }}
          </div>
          <div class="text color2">早退</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <div class="num color1 text-shadow1">
            {{ statusList.kuang }}
          </div>
          <div class="text color2">旷课</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

// 定义变量

import {listStatus} from "@/api/kaoqin/status.js";
import {parseTime} from "../../../utils/ruoyi.js";


const statusList = ref();
const data = reactive({
  form: {},
  queryParams: {
    clazzId: null,
    createTime: null,
  },
  rules: {}
});
const {queryParams} = toRefs(data);

/** 查询班级数据图列表 */
function getList() {
  listStatus(queryParams.value).then(response => {
    statusList.value = response.rows[0];
    console.log(1111, statusList)
  });
}

getList()
</script>
<style lang="scss" scoped>
// TODO: 首页、人效统计、对账统计样式抽出组件
.home-user-task-stats {
  display: flex;
  flex-direction: column;
  height: calc((100vh - 120px) * 0.2);
  min-height: 166px;
  background: #E9F3FF;
  border-radius: 20px;

  .body {
    flex: 1;
    display: flex;

    .stats {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .item {
        display: inline-flex; // 关键点
        flex-direction: column;

        .num {
          height: 50px;
          font-size: 36px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          line-height: 50px;
          text-shadow: 2px 4px 7px rgba(85, 132, 255, 0.5);
        }

        .text {
          height: 17px;
          margin-top: 3px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #91a7dc;
          line-height: 17px;
        }

        .color1 {
          color: #072074;
        }

        .color2 {
          color: #91a7dc;
        }

        .color3 {
          color: #ff5757;
        }

        .color4 {
          color: #de9690;
        }

        .text-shadow1 {
          text-shadow: 2px 4px 7px rgba(85, 132, 255, 0.5);
        }

        .text-shadow2 {
          text-shadow: 2px 4px 7px rgba(255, 99, 85, 0.5);
        }
      }
    }
  }
}

//.bgc1 {
//  background: #E9F3FF;
//  background-image: url('@/assets/images/circle.png'), url('@/assets/images/task.png');
//  background-repeat: no-repeat, no-repeat;
//  background-position: 0 0, calc(100% - 12px) 100%;
//
//}
//
//.bgc2 {
//  background: #FBEFE8 url('@/assets/images/sale.png') no-repeat calc(100% - 12px) 100%;
//}
</style>