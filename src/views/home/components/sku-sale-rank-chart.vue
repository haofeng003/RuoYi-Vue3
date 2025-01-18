<template>
  <div class="box bgc3 sku-sale-rank">
    <!-- TODO: 分辨大怎么展示问UI -->
    <div class="header">
      <div class="title">
        <div style="writing-mode: vertical-rl; text-orientation: upright;">
          封&nbsp;神&nbsp;榜
        </div>
        <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
          <el-form-item label="班级" prop="clazzId">
            <el-select v-model="queryParams.clazzId" clearable placeholder="请选择班级" style="width: 130px;">
              <el-option
                  v-for="c in ClazzList"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="违纪类型" prop="shang">
            <el-select v-model="queryParams.shang" clearable placeholder="请选择类型" style="width: 130px;">
              <el-option
                  v-for="dict in shang"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item style="display: grid; justify-content: end;">
            <h3><strong>默认搜索的是迟到人员数据</strong></h3>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


      </div>
    </div>
    <div class="body">
      <el-scrollbar ref="scrollbarRef" always height="520px" @scroll="scroll">
        <div ref="innerRef">
          <!--          <p v-for="item in 20" :key="item" class="scrollbar-demo-item">-->
          <!--          -------------------->
          <el-row v-for="(item, index) in fengshenbangList" :key="index" class="scrollbar-demo-item">
            <el-col :span="5">
              <div :class="'top top' + (index + 1)">
                {{ index + 1 }}
              </div>
            </el-col>
            <el-col :span="6">
              <div :title="item.studentName" class="sku-name">
                {{ item.studentName }}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="count">{{ item.clazzName }}</div>
            </el-col>
            <el-col :span="6">
              <div class="count">{{ item.count }}次</div>
            </el-col>
          </el-row>
          <!--          ------------------------>
          <!--          </p>-->
        </div>
      </el-scrollbar>

      <!--      <el-slider-->
      <!--          v-model="value"-->
      <!--          :format-tooltip="formatTooltip"-->
      <!--          :max="max"-->
      <!--          @input="inputSlider"-->
      <!--      />-->
      <!--          ------------------------>

    </div>
  </div>
</template>
<script setup>

//-------------
import {
  listFengshenbang,
  getFengshenbang,
  delFengshenbang,
  addFengshenbang,
  updateFengshenbang
} from "@/api/kaoqin/fengshenbang";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {loadAllParams} from "@/api/page.js";

const {proxy} = getCurrentInstance();
const {shang} = proxy.useDict('shang');

const fengshenbangList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 100000,
    clazzId: null,
    shang: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询封神榜图列表 */
function getList() {
  loading.value = true;
  listFengshenbang(queryParams.value).then(response => {
    fengshenbangList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    studentId: null,
    clazzName: null,
    studentName: null,
    clazzId: null,
    shang: null,
    count: null,
    chiCount: null,
    shiCount: null,
    bingCount: null,
    zaoCount: null,
    kuangCount: null
  };
  proxy.resetForm("fengshenbangRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.studentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加封神榜图";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _studentId = row.studentId || ids.value
  getFengshenbang(_studentId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改封神榜图";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fengshenbangRef"].validate(valid => {
    if (valid) {
      if (form.value.studentId != null) {
        updateFengshenbang(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFengshenbang(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _studentIds = row.studentId || ids.value;
  proxy.$modal.confirm('是否确认删除封神榜图编号为"' + _studentIds + '"的数据项？').then(function () {
    return delFengshenbang(_studentIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/fengshenbang/export', {
    ...queryParams.value
  }, `fengshenbang_${new Date().getTime()}.xlsx`)
}

/** 查询班级管理列表 */
const ClazzList = ref([])

function getClazzList() {
  listClazz(loadAllParams).then(response => {
    ClazzList.value = response.rows;
  });
}

getList();
getClazzList()
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';

.sku-sale-rank {
  display: flex;
  flex-direction: column;
  height: 60vh;
  min-height: 538px;
  background: #FFFFFF;
  border-radius: 20px;

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;

    .top {
      display: inline-block;
      width: 16px;
      height: 20px;
      margin-left: 10px;
      background: url('@/assets/user-task-stats/top.png');
      text-align: center;
      font-size: 12px;
      font-weight: normal;
      color: #E9B499;
      line-height: 14px;
    }

    .top1 {
      width: 21px;
      height: 20px;
      background: url('@/assets/user-task-stats/top1.png');
      color: #8E5900;
    }

    .top2 {
      width: 21px;
      height: 20px;
      background: url('@/assets/user-task-stats/top2.png');
      color: #494949;
    }

    .top3 {
      width: 21px;
      height: 20px;
      background: url('@/assets/user-task-stats/top3.png');
      color: #CF6D3D;
    }

    .sku-name {
      height: 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .count {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #737589;
      line-height: 20px;
      text-align: right;
    }
  }
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.el-slider {
  margin-top: 20px;
}
</style>
