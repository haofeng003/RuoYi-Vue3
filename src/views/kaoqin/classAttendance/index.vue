<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item v-hasPermi="['kaoqin:classAttendance:edit']" label="所在班级" prop="classId">
        <el-select v-model="queryParams.classId" filterable>
          <el-option
              v-for="clazz in ClazzList"
              :key="clazz.id"
              :label="clazz.name"
              :value="clazz.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-hasPermi="['kaoqin:classAttendance:edit']" label="负责人" prop="userId">
        <el-select v-model="queryParams.userId" filterable>
          <el-option v-for="user in userList"
                     :key="user.userId"
                     :label="user.nickName"
                     :value="user.userId"
          ></el-option>
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
            v-hasPermi="['kaoqin:classAttendance:remove']"
            icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <span v-hasPermi="['kaoqin:classAttendance:add']">-->
      <!--          该页面数据每天4:00会自动创建,无需手动创建,如果当天数据没有自动生成在自动创建-->
      <!--        </span>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:classAttendance:edit']"-->
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
      <!--            v-hasPermi="['kaoqin:classAttendance:remove']"-->
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
      <!--            v-hasPermi="['kaoqin:classAttendance:export']"-->
      <!--            icon="Download"-->
      <!--            plain-->
      <!--            type="warning"-->
      <!--            @click="handleExport"-->
      <!--        >导出-->
      <!--        </el-button>-->
      <!--            </el-col>-->
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="classAttendanceList" height="500" @selection-change="handleSelectionChange">
      <!--      <el-table-column align="center" type="selection" width="55"/>-->
      <el-table-column align="center" label="序号" prop="id" type="index" width="100"/>
      <!--      <el-table-column align="center" label="照片" prop="image" width="100"/>-->
      <el-table-column align="center" label="班级" prop="classId">
        <template #default="scope">
          <div v-for="clazz in ClazzList" :key="clazz.id" placeholder="请选择班级id">
            <span v-if="clazz.id === scope.row.classId">
              {{ clazz.name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人" prop="userId">
        <template #default="scope">
          <div v-for="user in userList" :key="user.id" placeholder="请选择班级id">
            <span v-if="user.userId === scope.row.userId">
                  {{ user.nickName }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级人数" prop="count"/>
      <el-table-column align="center" label="上午考勤" prop="shang">
        <template #default="scope">
          <span>
            {{ scope.row.shang }} %
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下午考勤" prop="xia">
        <template #default="scope">
          <span>

            {{ scope.row.xia }} %
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="晚上考勤" prop="wan">
        <template #default="scope">
          <span>

            {{ scope.row.wan }} %
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="自习下课前" prop="shi">
        <template #default="scope">
          <span>

            {{ scope.row.shi }} %
          </span>
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
      <!--      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">-->
      <!--        <template #default="scope">-->
      <!--          <el-button v-hasPermi="['kaoqin:classAttendance:edit']" icon="Edit" link type="primary"-->
      <!--                     @click="handleUpdate(scope.row)">修改-->
      <!--          </el-button>-->
      <!--          <el-button v-hasPermi="['kaoqin:classAttendance:remove']" icon="Delete" link type="primary"-->
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

    <!-- 添加或修改班级考勤详细对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="500px">
      <el-form ref="classAttendanceRef" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <el-form-item label="所在班级" prop="classId">
        <!--          <el-input v-model="form.classId" placeholder="请输入所在班级"/>-->
        <el-select v-model="form.classId" filterable placeholder="请输入所在班级">
          <el-option
              v-for="item in ClazzList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script name="ClassAttendance" setup>

import {
  addClassAttendance,
  delClassAttendance,
  getClassAttendance,
  listClassAttendance,
  updateClassAttendance
} from "@/api/kaoqin/classAttendance";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {loadAllParams} from "@/api/page.js";
import {listUser} from "@/api/system/user.js";


const {proxy} = getCurrentInstance();

const classAttendanceList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const imageOpen = ref(false)


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classId: null,
    createTime: null,
    userId: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询班级考勤详细列表 */
function getList() {
  loading.value = true;
  listClassAttendance(queryParams.value).then(response => {
    classAttendanceList.value = response.rows;
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
    classId: null,
    userId: null,
    shang: null,
    xia: null,
    wan: null,
    shi: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("classAttendanceRef");
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
  title.value = "添加班级考勤详细";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getClassAttendance(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改班级考勤详细";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classAttendanceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateClassAttendance(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClassAttendance(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除班级考勤详细编号为"' + _ids + '"的数据项？').then(function () {
    return delClassAttendance(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleImage() {
  imageOpen.value = true
}

/** 查询班级管理列表 */
const ClazzList = ref([])

function getClazzList() {
  // loading.value = true;
  listClazz(loadAllParams).then(response => {
    ClazzList.value = response.rows;
    // total.value = response.total;
    // loading.value = false;
  });
}

/** 查询班级管理列表 */
const userList = ref([])

function getUserList() {
  // loading.value = true;
  listUser(loadAllParams).then(response => {
    userList.value = response.rows.filter(user => ![1, 2].includes(user.userId));
  });
}

getUserList()
getClazzList()
getList();
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
