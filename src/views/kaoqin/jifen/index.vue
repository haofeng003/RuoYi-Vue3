<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <!--      <el-form-item>-->
      <!--        <el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>-->
      <!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
      <!--      </el-form-item>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
              <span style="color: red">
                这个页面的数字会跟
                <strong> 考勤管理--扣分详情 </strong>
                页面(就是这个目录上面的那个目录)的违纪次数做乘法,这里的数字会直接影响学生的总计扣分
              </span>
      </el-col>
      <!--            <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:jifen:add']"-->
      <!--            icon="Plus"-->
      <!--            plain-->
      <!--            type="primary"-->
      <!--            @click="handleAdd"-->
      <!--        >新增-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:jifen:edit']"-->
      <!--            :disabled="single"-->
      <!--            icon="Edit"-->
      <!--            plain-->
      <!--            type="success"-->
      <!--            @click="handleUpdate"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="Delete"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['kaoqin:jifen:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="Download"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['kaoqin:jifen:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="jifenList" @selection-change="handleSelectionChange">
      <!--      <el-table-column align="center" type="selection" width="55"/>-->
      <!--      <el-table-column align="center" label="id" prop="id"/>-->
      <el-table-column align="center" label="迟到记分" prop="chidao"/>
      <el-table-column align="center" label="事假记分" prop="shijai"/>
      <el-table-column align="center" label="病假记分" prop="bingjia"/>
      <el-table-column align="center" label="早退记分" prop="zaotui"/>
      <el-table-column align="center" label="旷课记分" prop="kuangke"/>
      <el-table-column align="center" label="手机记分" prop="shouji"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['kaoqin:jifen:edit']" icon="Edit" link type="primary"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <!--          <el-button v-hasPermi="['kaoqin:jifen:remove']" icon="Delete" link type="primary"-->
          <!--                     @click="handleDelete(scope.row)">删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination-->
    <!--        v-show="total>0"-->
    <!--        v-model:limit="queryParams.pageSize"-->
    <!--        v-model:page="queryParams.pageNum"-->
    <!--        :total="total"-->
    <!--        @pagination="getList"-->
    <!--    />-->

    <!-- 添加或修改记分规则对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="500px">
      <el-form ref="jifenRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="迟到记分" prop="chidao">
          <el-input-number v-model="form.chidao" :min="0"/>
        </el-form-item>
        <el-form-item label="事假记分" prop="shijai">
          <el-input-number v-model="form.shijai" :min="0"/>
        </el-form-item>
        <el-form-item label="病假记分" prop="bingjia">
          <el-input-number v-model="form.bingjia" :min="0"/>
        </el-form-item>
        <el-form-item label="早退记分" prop="zaotui">
          <el-input-number v-model="form.zaotui" :min="0"/>
        </el-form-item>
        <el-form-item label="旷课记分" prop="kuangke">
          <el-input-number v-model="form.kuangke" :min="0"/>
        </el-form-item>
        <el-form-item label="手机记分" prop="shouji">
          <el-input-number v-model="form.shouji" :min="0"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script name="Jifen" setup>
import {listJifen, getJifen, delJifen, addJifen, updateJifen} from "@/api/kaoqin/jifen";

const {proxy} = getCurrentInstance();

const jifenList = ref([]);
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
    pageSize: 10,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询记分规则列表 */
function getList() {
  loading.value = true;
  listJifen(queryParams.value).then(response => {
    jifenList.value = response.rows;
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
    id: null,
    chidao: null,
    shijai: null,
    bingjia: null,
    zaotui: null,
    kuangke: null,
    shouji: null
  };
  proxy.resetForm("jifenRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加记分规则";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getJifen(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改记分规则";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["jifenRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateJifen(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addJifen(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除记分规则编号为"' + _ids + '"的数据项？').then(function () {
    return delJifen(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/jifen/export', {
    ...queryParams.value
  }, `jifen_${new Date().getTime()}.xlsx`)
}

getList();
</script>
