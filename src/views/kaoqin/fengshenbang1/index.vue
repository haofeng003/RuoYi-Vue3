<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="学生姓名" prop="studentId">
        <el-select v-model="queryParams.studentId" filterable placeholder="请选择学生" @keyup.enter="handleQuery">
          <el-option
              v-for="stu in studentList1"
              :key="stu.id"
              :label="stu.name"
              :value="stu.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-hasPermi="['kaoqin:fengshenbang1:edit']" label="所在班级" prop="clazzId">
        <el-select v-model="queryParams.clazzId" filterable
                   placeholder="请选择所在班级" @keyup.enter="handleQuery">
          <el-option
              v-for="item in ClazzList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序方式" prop="shang">
        <el-select v-model="queryParams.shang" clearable placeholder="默认按照迟到排序">
          <el-option
              v-for="dict in kaoqin"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
              <span style="color: red">
                默认按分数排序 , 有排序条件时按排序条件排序,只请过病假也算好孩子<br>
                鼠标放到名字上,可以查看具体扣分
              </span>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:fengshenbang1:add']"-->
      <!--            icon="Plus"-->
      <!--            plain-->
      <!--            type="primary"-->
      <!--            @click="handleAdd"-->
      <!--        >新增-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:fengshenbang1:edit']"-->
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
      <!--            v-hasPermi="['kaoqin:fengshenbang1:remove']"-->
      <!--            :disabled="multiple"-->
      <!--            icon="Delete"-->
      <!--            plain-->
      <!--            type="danger"-->
      <!--            @click="handleDelete"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:fengshenbang1:export']"-->
      <!--            icon="Download"-->
      <!--            plain-->
      <!--            type="warning"-->
      <!--            @click="handleExport"-->
      <!--        >导出-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="fengshenbang1List" height="500" @selection-change="handleSelectionChange">
      <!--      <el-table-column align="center" type="selection" width="55"/>-->
      <el-table-column align="center" label="序号" prop="studentId" type="index" width="70"/>
      <el-table-column align="center" label="班级名称" prop="clazzName"/>
      <el-table-column align="center" label="姓名" prop="studentName">
        <template #default="scope">
          <el-tooltip placement="right-end">
            <template #content>
              平常扣分 : {{ scope.row.jifen }}
              <br>
              其他扣分 : {{ scope.row.qita }}
            </template>
            <span>{{ scope.row.studentName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="班级id" prop="clazzId"/>-->
      <el-table-column align="center" label="迟到次数" prop="chiCount"/>
      <el-table-column align="center" label="事假次数" prop="shiCount"/>
      <el-table-column align="center" label="病假次数" prop="bingCount"/>
      <el-table-column align="center" label="早退次数" prop="zaoCount"/>
      <el-table-column align="center" label="旷课次数" prop="kuangCount"/>
      <el-table-column align="center" label="手机" prop="shouCount"/>
      <el-table-column align="center" label="总计扣分(包含其他扣分)" prop="jifen" width="170">
        <template #default="scope">
          <span v-if="scope.row.jifen + scope.row.qita===0">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="text-align: left;">{{ scope.row.studentName }}</span>
                <span style="text-align: right;">是最棒的🌸</span>
            </div>
             </span>
          <span v-else>{{ scope.row.jifen + scope.row.qita }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">-->
      <!--        <template #default="scope">-->
      <!--          <el-button v-hasPermi="['kaoqin:fengshenbang1:edit']" icon="Edit" link type="primary"-->
      <!--                     @click="handleUpdate(scope.row)">修改-->
      <!--          </el-button>-->
      <!--          <el-button v-hasPermi="['kaoqin:fengshenbang1:remove']" icon="Delete" link type="primary"-->
      <!--                     @click="handleDelete(scope.row)">删除-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
        v-show="total>0"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <!--    &lt;!&ndash; 添加或修改详细对话框 &ndash;&gt;-->
    <!--    <el-dialog v-model="open" :title="title" append-to-body width="500px">-->
    <!--      <el-form ref="fengshenbang1Ref" :model="form" :rules="rules" label-width="80px">-->
    <!--        <el-form-item label="班级名称" prop="clazzName">-->
    <!--          <el-input v-model="form.clazzName" placeholder="请输入班级名称"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="姓名" prop="studentName">-->
    <!--          <el-input v-model="form.studentName" placeholder="请输入姓名"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="班级id" prop="clazzId">-->
    <!--          <el-input v-model="form.clazzId" placeholder="请输入班级id"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="违纪类型" prop="shang">-->
    <!--          <el-select v-model="form.shang" placeholder="请选择违纪类型">-->
    <!--            <el-option-->
    <!--                v-for="dict in shang"-->
    <!--                :key="dict.value"-->
    <!--                :label="dict.label"-->
    <!--                :value="parseInt(dict.value)"-->
    <!--            ></el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="总次数" prop="count">-->
    <!--          <el-input v-model="form.count" placeholder="请输入总次数"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="迟到次数" prop="chiCount">-->
    <!--          <el-input v-model="form.chiCount" placeholder="请输入迟到次数"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="事假次数" prop="shiCount">-->
    <!--          <el-input v-model="form.shiCount" placeholder="请输入事假次数"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="病假次数" prop="bingCount">-->
    <!--          <el-input v-model="form.bingCount" placeholder="请输入病假次数"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="早退次数" prop="zaoCount">-->
    <!--          <el-input v-model="form.zaoCount" placeholder="请输入早退次数"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="旷课次数" prop="kuangCount">-->
    <!--          <el-input v-model="form.kuangCount" placeholder="请输入旷课次数"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="手机" prop="shouCount">-->
    <!--          <el-input v-model="form.shouCount" placeholder="请输入手机"/>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
    <!--          <el-button @click="cancel">取 消</el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script name="Fengshenbang1" setup>
import {
  listFengshenbang1
} from "@/api/kaoqin/fengshenbang";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {loadAllParams} from "@/api/page.js";
import {listStudent} from "@/api/kaoqin/student.js";

const {proxy} = getCurrentInstance();
const {kaoqin} = proxy.useDict('kaoqin');

const fengshenbang1List = ref([]);
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
    pageSize: 20,
    studentId: null,
    clazzId: null,
    shang: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询详细列表 */
function getList() {
  loading.value = true;
  listFengshenbang1(queryParams.value).then(response => {
    fengshenbang1List.value = response.rows;
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
    kuangCount: null,
    shouCount: null,
    qita: null
  };
  proxy.resetForm("fengshenbang1Ref");
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
// function handleSelectionChange(selection) {
//   ids.value = selection.map(item => item.studentId);
//   single.value = selection.length != 1;
//   multiple.value = !selection.length;
// }

/** 新增按钮操作 */
// function handleAdd() {
//   reset();
//   open.value = true;
//   title.value = "添加详细";
// }

/** 修改按钮操作 */
// function handleUpdate(row) {
//   reset();
//   const _studentId = row.studentId || ids.value
//   getFengshenbang(_studentId).then(response => {
//     form.value = response.data;
//     open.value = true;
//     title.value = "修改详细";
//   });
// }

/** 提交按钮 */
// function submitForm() {
//   proxy.$refs["fengshenbang1Ref"].validate(valid => {
//     if (valid) {
//       if (form.value.studentId != null) {
//         updateFengshenbang(form.value).then(response => {
//           proxy.$modal.msgSuccess("修改成功");
//           open.value = false;
//           getList();
//         });
//       } else {
//         addFengshenbang(form.value).then(response => {
//           proxy.$modal.msgSuccess("新增成功");
//           open.value = false;
//           getList();
//         });
//       }
//     }
//   });
// }

/** 删除按钮操作 */
// function handleDelete(row) {
//   const _studentIds = row.studentId || ids.value;
//   proxy.$modal.confirm('是否确认删除详细编号为"' + _studentIds + '"的数据项？').then(function () {
//     return delFengshenbang(_studentIds);
//   }).then(() => {
//     getList();
//     proxy.$modal.msgSuccess("删除成功");
//   }).catch(() => {
//   });
// }

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('kaoqin/fengshenbang1/export', {
//     ...queryParams.value
//   }, `fengshenbang1_${new Date().getTime()}.xlsx`)
// }

/** 查询班级管理列表 */
const ClazzList = ref([])

function getClazzList() {
  listClazz(loadAllParams).then(response => {
    ClazzList.value = response.rows;
  });
}

const studentList1 = ref([])

function getStudentList() {
  listStudent(loadAllParams).then(response => {
    studentList1.value = response.rows;

  });
}

getStudentList()
getClazzList()
getList();
</script>
