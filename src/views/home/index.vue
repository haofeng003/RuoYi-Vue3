<template>
  <div class="app-container home">

    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="班级" prop="clazzId">
        <el-select v-model="queryParams.clazzId" filterable>
          <el-option
              v-for="clazz in clazzList"
              :key="clazz.id"
              :label="clazz.name"
              :value="clazz.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期选择" prop="createTime">
        <el-date-picker v-model="queryParams.createTime"
                        clearable
                        placeholder="请选择创建时间"
                        type="date"
                        value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <!--        <div>下面饼图的数据是写死的假数据,真数据还没写</div>-->

      </el-form-item>
      <el-form-item>

      </el-form-item>
      <el-form-item>

      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-row :gutter="20">
          <el-col :span="13">
            <!--            第一个图-->
            <!--            <template>-->
            <div class="box home-user-task-stats bgc1">
              <div class="header">
                <div v-if="statusList" class="title">
                  {{ statusList.clazzName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                    parseTime(statusList.createTime, '{y}-{m}-{d}')
                  }} &nbsp;数据&nbsp;(次)
                </div>
              </div>
              <div v-if="statusList" class="body">
                <div class="stats">
                  <div class="item">
                    <div class="num color1 text-shadow1">
                      {{ statusList.counts }}
                    </div>
                    <div class="text color2">&nbsp;人数</div>
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
                <div class="stats">
                  <div class="item">
                    <div class="num color1 text-shadow1">
                      {{ statusList.shou }}
                    </div>
                    <div class="text color2">手机</div>
                  </div>
                </div>
              </div>
            </div>
            <!--            </template>-->
          </el-col>
          <el-col :span="11">
            <!--       ----------     班级违纪人数-->
            <!--            <home-sku-sale-stats/>-->
            <div class="box home-sku-sale-stats bgc2">
              <div class="header">
                <div class="title">

                  {{
                    parseTime(countList.createTime, '{y}-{m}-{d}')
                  }}
                  违纪人数详情
                </div>
              </div>
              <div class="body">
                <div class="stats">
                  <div class="item">
                    <div class="num color3 text-shadow2">
                      {{ countList.clazzName }}
                    </div>

                  </div>
                </div>
                <div class="stats">
                  <div class="item">
                    <div class="num color3 text-shadow2">
                      {{ countList.weijiCount }}(人)
                    </div>
                    <!--                    <div class="text color4">-->
                    <!--                      违纪人数-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--        <sku-sale-collect-chart/>-->
        <!--        中间的饼图-->
        <div ref="chart" style="width: 100%; height: 520px;"></div>
      </el-col>
      <el-col :span="10">
        <!--        封神榜-->
        <sku-sale-rank-chart/>
      </el-col>
    </el-row>
    <div class="contact-container">
      <img v-if="showImage" alt="Contact Image" class="contact-image" src="@/assets/images/微信.jpg"/>
      <span class="contact-span" @mouseleave="showImage = false" @mouseover="showImage = true">联系方式</span>
    </div>
    <p class="center">备案号：<a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2025139457号</a>
    </p>
  </div>
</template>

<script name="Index" setup>
import {onMounted, ref} from 'vue';
// import HomeUserTaskStats from './components/home-user-task-stats.vue';
// import HomeSkuSaleStats from './components/home-sku-sale-stats.vue';
// import SkuSaleRankChart from "@/views/home/components/sku-sale-rank-chart.vue";
import * as echarts from 'echarts';
import {getGoodsList1} from "@/api/kaoqin/classAttendance.js";

const showImage = ref(false);
const chart = ref(null);
const option = ref({
  legend: {},
  tooltip: {},
  dataset: {
    source: []
  },
  series: [
    {
      type: 'pie',
      radius: '25%',
      center: ['14%', '25%'],
      encode: {
        itemName: 'product',
        value: '上午',
        name: 'product'
      }
    },
    {
      type: 'pie',
      radius: '25%',
      center: ['37%', '25%'],
      encode: {
        itemName: 'product',
        value: '下午',
        name: 'product'
      }
    },
    {
      type: 'pie',
      radius: '27%',
      center: ['61%', '25%'],
      encode: {
        itemName: 'product',
        value: '晚上',
        name: 'product'
      }
    },
    {
      type: 'pie',
      radius: '27%',
      center: ['84%', '25%'],
      encode: {
        itemName: 'product',
        value: '十点',
        name: 'product'
      }
    }, {
      type: 'pie',
      radius: '27%',
      center: ['14%', '75%'],
      encode: {
        itemName: 'product',
        value: '上午手机',
        name: 'product'
      }
    },
    {
      type: 'pie',
      radius: '27%',
      center: ['37%', '75%'],
      encode: {
        itemName: 'product',
        value: '下午手机',
        name: 'product'
      }
    },
    {
      type: 'pie',
      radius: '27%',
      center: ['60%', '75%'],
      encode: {
        itemName: 'product',
        value: '晚上手机',
        name: 'product'
      }
    },
    {
      type: 'pie',
      radius: '27%',
      center: ['83%', '75%'],
      encode: {
        itemName: 'product',
        value: '十点手机',
        name: 'product'
      }
    }
  ]
});

// onMounted(() => {
//   initChart();
// });

const initChart = async () => {
  try {
    const response = await getGoodsList1(queryParams.value);
    if (response && response.rows) {
      option.value.dataset.source = response.rows;
      console.log('Data received:', option.value.dataset.source);

      // Ensure the chart div is available before initializing ECharts
      if (chart.value) {
        const chartInstance = echarts.init(chart.value);
        chartInstance.setOption(option.value);
        console.log('Chart initialized successfully');
      } else {
        console.error('Chart container not found');
      }
    } else {
      console.error('Invalid response format or no data received');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const updateChart = (newOption) => {
  if (chart.value) {
    const chartInstance = echarts.getInstanceByDom(chart.value);
    if (chartInstance) {
      chartInstance.setOption(newOption);
    } else {
      console.error('Chart instance not found');
    }
  }
};

//-----------------------------
import {listCount, getCount, delCount, addCount, updateCount} from "@/api/kaoqin/count";
// import {parseTime} from "../../../utils/ruoyi.js";

const countList = ref([]);
const total = ref(0);


/** 查询班级违纪人数列表 */
function getCountList() {
  listCount(queryParams.value).then(response => {
    countList.value = response.rows[0];
    total.value = response.total;
  });
}


import {listStatus, getStatus, delStatus, addStatus, updateStatus} from "@/api/kaoqin/status";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {loadAllParams} from "@/api/page.js";
import {parseTime} from "@/utils/ruoyi.js";
import SkuSaleRankChart from "@/views/home/components/sku-sale-rank-chart.vue";
import HomeSkuSaleStats from "@/views/home/components/home-sku-sale-stats.vue";
import PartnerNodeCollectChart from "@/views/home/components/partner-node-collect-chart.vue";
import AbnormalEquipmentTable from "@/views/home/components/abnormal-equipment-table.vue";
import SkuSaleCollectChart from "@/views/home/components/sku-sale-collect-chart.vue";

const {proxy} = getCurrentInstance();
const showSearch = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10000,
    clazzId: null,
    createTime: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

// 表单重置
function reset() {
  form.value = {
    id: null,
    clazzName: null,
    clazzId: null,
    counts: null,
    chi: null,
    shi: null,
    bing: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("statusRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
  getCountList();
  initChart();
}

const statusList = ref();

/** 查询班级数据图列表 */
function getList() {
  listStatus(queryParams.value).then(response => {
    statusList.value = response.rows[0];
  });
}


/** 重置按钮操作 */
function resetQuery() {
  // proxy.resetForm("queryRef");
  queryParams.value.clazzId = null,
      queryParams.value.createTime = null,
      handleQuery();
}

/** 查询班级管理列表 */
const clazzList = ref([]);

function getClazzList() {
  listClazz(loadAllParams).then(response => {
    clazzList.value = response.rows;
  });
}

initChart();
getCountList()
getClazzList()
getList()
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }

  :deep(.box) {
    padding: 20px;
    border-radius: 20px;

    .title,
    .header {
      display: flex;

      .el-icon {
        cursor: pointer;
      }
    }

    .title {
      align-items: center;
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #333;

    }

    .sub-title {
      margin-left: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #999;
    }
  }

  .chart {
    position: relative;
    display: inline-block;
    width: 50%;
    height: 100%;
  }

  .sku-sale-rank {
    flex-direction: column;
    height: 60vh;
    min-height: 538px;
    background: #fff;
    border-radius: 20px;
  }
}

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


.home-sku-sale-stats {
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

.center {
  text-align: center;
  font-size: 17px;
}


.contact-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.contact-image {
  position: absolute;
  top: -230px; /* 调整图片位置，使其悬浮在上方 */
  left: 50%;
  transform: translateX(-50%);
  width: 170px;
  height: 230px;
}

.contact-span {
  position: relative;
  z-index: 1; /* 确保span在图片上方 */
}
</style>
