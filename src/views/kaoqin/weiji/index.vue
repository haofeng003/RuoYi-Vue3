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
      <el-form-item v-hasPermi="['kaoqin:weiji:remove']" label="所在班级" prop="clazzId">
        <el-select v-model="queryParams.clazzId" filterable placeholder="请选择班级" @keyup.enter="handleQuery">
          <el-option
              v-for="c in ClazzList"
              :key="c.id"
              :label="c.name"
              :value="c.id">
          </el-option>
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
            v-hasPermi="['kaoqin:weiji:add']"
            icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <span style="color: red">班长只能修改当天的数据,如果之前的数据有错误,请联系班主任修改,但是不能删除</span>
      </el-col>
      <!--            <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:weiji:edit']"-->
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
      <!--          v-hasPermi="['kaoqin:weiji:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="Download"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['kaoqin:weiji:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="weijiList" height="500" @selection-change="handleSelectionChange">
      <!--      <el-table-column align="center" type="selection" width="55"/>-->
      <el-table-column align="center" label="序号" prop="id" type="index" width="70"/>
      <el-table-column align="center" label="学生" prop="studentId">
        <template #default="scope">

          <div v-for="stu in studentList1" :key="stu.id">
        <span v-if="scope.row.studentId===stu.id">
          <span v-if="userInfo!='banzhuren' && userInfo!='admin' && !isToday(scope.row.createTime)">
            {{ stu.name }}
          </span>
          <span v-else>
             <el-button v-hasPermi="['kaoqin:weiji:edit']" link type="primary"
                        @click="handleUpdate(scope.row)">{{ stu.name }}
                    </el-button>
          </span>
        </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扣分" prop="jifen"/>
      <el-table-column align="center" label="班级" prop="clazzId">
        <template #default="scope">
          <div v-for="c in ClazzList" :key="c.id">
        <span v-if="scope.row.clazzId===c.id">
              {{ c.name }}
        </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip width="600"/>
      <el-table-column align="center" label="创建者" prop="createBy"/>
      <el-table-column align="center" label="创建时间" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新者" prop="updateBy"/>
      <el-table-column align="center" label="更新时间" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">-->
      <!--        <template #default="scope">-->
      <!--          <el-button v-hasPermi="['kaoqin:weiji:edit']" icon="Edit" link type="primary"-->
      <!--                     @click="handleUpdate(scope.row)">修改-->
      <!--          </el-button>-->
      <!--          <el-button v-hasPermi="['kaoqin:weiji:remove']" icon="Delete" link type="primary"-->
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

    <!-- 添加或修改其他扣分对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="500px">
      <el-form ref="weijiRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生姓名" prop="studentId">
          <el-select v-model="form.studentId" filterable placeholder="请选择学生" @keyup.enter="handleQuery">
            <el-option
                v-for="stu in studentList1"
                :key="stu.id"
                :label="stu.name"
                :value="stu.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-hasPermi="['kaoqin:weiji:remove']" label="创建时间" prop="createTime">
          <el-date-picker v-model="form.createTime"
                          clearable
                          placeholder="创建日期不填默认当天"
                          type="date"
                          value-format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item v-hasPermi="['kaoqin:weiji:remove']" label="所在班级" prop="clazzId">-->
        <!--          <el-select v-model="form.clazzId" filterable-->
        <!--                     placeholder="请选择所在班级" @keyup.enter="handleQuery">-->
        <!--            <el-option-->
        <!--                v-for="item in ClazzList"-->
        <!--                :key="item.id"-->
        <!--                :label="item.name"-->
        <!--                :value="item.id">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 6 }"
                    :rows="2"
                    placeholder="请输入内容"
                    style="width: 450px"
                    type="textarea"/>
        </el-form-item>
        <el-form-item label="扣分" prop="jifen">
          <el-input-number v-model="form.jifen" :min="0"/>
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

<script name="Weiji" setup>
import {listWeiji, getWeiji, delWeiji, addWeiji, updateWeiji} from "@/api/kaoqin/weiji";
import {listStudent} from "@/api/kaoqin/student.js";
import {loadAllParams} from "@/api/page.js";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {getInfo} from "@/api/login.js";

const {proxy} = getCurrentInstance();

const weijiList = ref([]);
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
    createTime: null
  },
  rules: {
    studentId: [
      {required: true, message: "学生姓名不能为空", trigger: "blur"}
    ],
    clazzId: [
      {required: false, message: "班级不能为空", trigger: "blur"}
    ],
    remark: [
      {required: true, message: "备注不能为空", trigger: "blur"}
    ],
    jifen: [
      {required: true, message: "扣分不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询其他扣分列表 */
function getList() {
  loading.value = true;
  listWeiji(queryParams.value).then(response => {
    weijiList.value = response.rows;
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
    clazzId: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    jifen: null
  };
  proxy.resetForm("weijiRef");
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
  title.value = "添加其他扣分";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getWeiji(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改其他扣分";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["weijiRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateWeiji(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWeiji(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
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
  proxy.$modal.confirm('是否确认删除其他扣分编号为"' + _ids + '"的数据项？').then(function () {
    return delWeiji(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/weiji/export', {
    ...queryParams.value
  }, `weiji_${new Date().getTime()}.xlsx`)
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

/** 查询班级管理列表 */
const ClazzList = ref([])

function getClazzList() {
  listClazz(loadAllParams).then(response => {
    ClazzList.value = response.rows;
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

getInfo1()
getClazzList()
getStudentList()
getList();
</script>
