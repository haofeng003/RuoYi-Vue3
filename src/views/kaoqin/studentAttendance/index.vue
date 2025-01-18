<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="学生姓名" prop="studentName">
        <!--        <el-input-->
        <!--            v-model="queryParams.studentName"-->
        <!--            clearable-->
        <!--            placeholder="请输入学生姓名"-->
        <!--            @keyup.enter="handleQuery"-->
        <!--        />-->
        <el-select v-model="queryParams.studentId" filterable placeholder="请选择学生" @keyup.enter="handleQuery">
          <el-option
              v-for="stu in studentList1"
              :key="stu.id"
              :label="stu.name"
              :value="stu.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-hasPermi="['kaoqin:studentAttendance:export']" label="所在班级" prop="classId">
        <!--        <el-input-->
        <!--            v-model="queryParams.classId"-->
        <!--            clearable-->
        <!--            placeholder="请输入班级id"-->
        <!--            @keyup.enter="handleQuery"-->
        <!--        />-->
        <el-select v-model="queryParams.classId" filterable
                   placeholder="请选择所在班级" @keyup.enter="handleQuery">
          <el-option
              v-for="item in ClazzList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="违纪类型" prop="category">
        <el-select v-model="queryParams.category" clearable placeholder="请选择类型" style="width: 130px;">
          <el-option
              v-for="dict in shang"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
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
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:studentAttendance:add']"
            icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>

      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:studentAttendance:edit']"-->
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
      <!--            v-hasPermi="['kaoqin:studentAttendance:remove']"-->
      <!--            :disabled="multiple"-->
      <!--            icon="Delete"-->
      <!--            plain-->
      <!--            type="danger"-->
      <!--            @click="handleDelete"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:studentAttendance:export']"
            icon="Download"
            plain
            type="warning"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <span style="color: red">班长只能修改当天的数据,如果之前的数据有错误,请联系班主任修改</span>
      </el-col>
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table ref="studentTable" v-loading="loading" :data="studentAttendanceList" height="500"
              @selection-change="handleSelectionChange">
      <el-table-column align="center" label="序号" prop="id" type="index" width="100"/>

      <el-table-column align="center" label="学生" prop="studentName">
        <template #default="scope">
          <span v-if="userInfo!='banzhuren' && userInfo!='admin' && !isToday(scope.row.createTime)">
            {{ scope.row.studentName }}
          </span>
          <span v-else>
             <el-button v-hasPermi="['kaoqin:studentAttendance:edit']" link type="primary"
                        @click="handleUpdate(scope.row)">{{ scope.row.studentName }}
          </el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在班级" prop="classId">
        <template #default="scope">
          <div v-for="clazz in ClazzList" :key="clazz.id" placeholder="请选择班级id">
            <span v-if="clazz.id === scope.row.classId">
                  {{ clazz.name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip width="150"/>
      <el-table-column align="center" label="上午考勤" prop="shang">
        <template #default="scope">
          <dict-tag :options="shang" :value="scope.row.shang ? scope.row.shang.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下午考勤" prop="xia">
        <template #default="scope">
          <dict-tag :options="shang" :value="scope.row.xia ? scope.row.xia.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="晚上考勤" prop="wan">
        <template #default="scope">
          <dict-tag :options="shang" :value="scope.row.wan ? scope.row.wan.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="自习下课前" prop="shi">
        <template #default="scope">
          <dict-tag :options="shang" :value="scope.row.shi ? scope.row.shi.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column v-hasPermi="['kaoqin:studentAttendance:remove']" align="center"-->
      <!--                       class-name="small-padding fixed-width" label="操作">-->
      <!--        <template #default="scope">-->
      <!--          &lt;!&ndash;          <el-button v-hasPermi="['kaoqin:studentAttendance:edit']" icon="Edit" link type="primary"&ndash;&gt;-->
      <!--          &lt;!&ndash;                     @click="handleUpdate(scope.row)">修改&ndash;&gt;-->
      <!--          &lt;!&ndash;                </el-button>&ndash;&gt;-->
      <!--          <el-button v-hasPermi="['kaoqin:studentAttendance:remove']" icon="Delete" link type="primary"-->
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
        @pagination="handlePagination"
    />

    <!-- 添加或修改学生考勤详细对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="620px">
      <el-form ref="studentAttendanceRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="学生姓名" prop="studentId">
         <span v-if="title==='添加学生考勤详细'">
            <el-select v-model="form.studentId" filterable placeholder="请选择所在学生" @keyup.enter="handleQuery">
                       <el-option
                           v-for="stu in studentList"
                           :key="stu.id"
                           :label="stu.name"
                           :value="stu.id">
                       </el-option>
                     </el-select>
         </span>
          <span v-else>
              <div v-for="stu in studentList1" :key="stu.id" placeholder="请选择学生">
            <span v-if="stu.id === form.studentId">
                  {{ stu.name }}
            </span>
          </div>
          </span>
        </el-form-item>
        <el-form-item v-hasPermi="['kaoqin:studentAttendance:export']" label="创建时间" prop="createTime">
          <el-date-picker v-model="form.createTime"
                          :disabled="isEdit"
                          clearable
                          placeholder="创建时间不选默认当前时间"
                          type="date"
                          value-format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上午考勤" prop="shang">
          <el-checkbox-group v-model="form.shang">
            <el-checkbox
                v-for="dict in shang"
                :key="dict.value"
                :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="下午考勤" prop="xia">
          <el-checkbox-group v-model="form.xia">
            <el-checkbox
                v-for="dict in shang"
                :key="dict.value"
                :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="晚上考勤" prop="wan">
          <el-checkbox-group v-model="form.wan">
            <el-checkbox
                v-for="dict in shang"
                :key="dict.value"
                :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="自习下课前" prop="shi">
          <el-checkbox-group v-model="form.shi">
            <el-checkbox
                v-for="dict in shi"
                :key="dict.value"
                :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="form.remark"
              :autosize="{ minRows: 2, maxRows: 6 }"
              :rows="2"
              placeholder="特殊情况请输入备注"
              style="width: 450px"
              type="textarea"
          />
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

<script name="StudentAttendance" setup>
import {
  addStudentAttendance,
  delStudentAttendance,
  getStudentAttendance,
  listStudentAttendance,
  updateStudentAttendance
} from "@/api/kaoqin/studentAttendance";
import {listStudent, listStudent1} from "@/api/kaoqin/student.js";
import {loadAllParams} from "@/api/page.js";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {getInfo} from "@/api/login.js";

const {proxy} = getCurrentInstance();
const {shang} = proxy.useDict('shang');
const {shi} = proxy.useDict('shi');

const studentAttendanceList = ref([]);
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
    category: null,
    classId: null,
    createTime: null,
  },
  rules: {
    studentId: [
      {required: true, message: "学生姓名不能为空", trigger: "blur"}
    ],
    classId: [
      {required: true, message: "班级id不能为空", trigger: "blur"}
    ],
    remark: [
      {required: false, max: 200, message: "最大输入内容长度为200", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);
const isEdit = ref(false)

/** 查询学生考勤详细列表 */
function getList() {
  loading.value = true;
  listStudentAttendance(queryParams.value).then(response => {
    studentAttendanceList.value = response.rows;
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
    studentId: null,
    classId: null,
    category: null,
    remark: null,
    shang: [],
    xia: [],
    wan: [],
    shi: [],
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("studentAttendanceRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.classId = null,
      queryParams.value.studentId = null,
      queryParams.value.createTime = null,
      queryParams.value.category = null
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
  isEdit.value = false
  title.value = "添加学生考勤详细";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getStudentAttendance(_id).then(response => {
    form.value = response.data;
    form.value.shang = form.value.shang.split(",");
    form.value.xia = form.value.xia.split(",");
    form.value.wan = form.value.wan.split(",");
    form.value.shi = form.value.shi.split(",");
    open.value = true;
    isEdit.value = true
    title.value = "修改学生考勤详细";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["studentAttendanceRef"].validate(valid => {
    if (valid) {
      form.value.shang = form.value.shang.join(",");
      form.value.xia = form.value.xia.join(",");
      form.value.wan = form.value.wan.join(",");
      form.value.shi = form.value.shi.join(",");
      if (form.value.id != null) {
        updateStudentAttendance(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
          getStudentList1()
        }).catch(
            open.value = false
        );
      } else {
        addStudentAttendance(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
          getStudentList1()
        }).catch(
            open.value = false
        );
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除学生考勤详细编号为"' + _ids + '"的数据项？').then(function () {
    return delStudentAttendance(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/studentAttendance/export', {
    ...queryParams.value
  }, `studentAttendance_${new Date().getTime()}.xlsx`)
}

/** 查询班级管理列表 */
const ClazzList = ref([])

function getClazzList() {
  listClazz(loadAllParams).then(response => {
    ClazzList.value = response.rows;
  });
}

/** 查询学生管理列表 */
const studentList = ref([])

function getStudentList1() {
  // loading.value = true;
  listStudent1(loadAllParams).then(response => {
    studentList.value = response.rows;
    // total.value = response.total;
    // loading.value = false;
  });
}

const studentList1 = ref([])

function getStudentList() {
  // loading.value = true;
  listStudent(loadAllParams).then(response => {
    studentList1.value = response.rows;
    // total.value = response.total;
    // loading.value = false;
  });
}

/** 查询当前用户 */
const userInfo = ref([])

function getInfo1() {
  // loading.value = true;
  getInfo().then(response => {
    userInfo.value = response.roles[0];
  });
}


// 格式化日期为 YYYY-MM-DD 格式
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 判断日期是否为当天
function isToday(createTime) {
  const today = formatDate(new Date());
  const dateToCompare = formatDate(new Date(createTime));
  // 比较年、月、日
  return (
      today == dateToCompare
  );
}


// 处理分页变化
function handlePagination() {
  getList();
  nextTick(() => {
    setTimeout(() => {
      scrollToTop();
    }, 100); // 延迟100毫秒
  });
}

// 滚动到表格顶部
function scrollToTop() {
  const table = proxy.$refs.studentTable;
  if (table && table.bodyWrapper) {
    table.bodyWrapper.scrollTop = 0;
  }
}


getStudentList()
getInfo1()
getStudentList1()
getClazzList()
getList();
</script>

