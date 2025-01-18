<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="班级名称" prop="name">
        <el-input
            v-model="queryParams.name"
            clearable
            placeholder="请输入班级名称"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级类型 " prop="clazzType">
        <el-select v-model="queryParams.clazzType" clearable placeholder="请选择班级类型 ">
          <el-option
              v-for="dict in clazz_type"
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
        <el-button
            v-hasPermi="['kaoqin:clazz:add']"
            icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <span v-hasPermi="['kaoqin:clazz:add']">创建班级前请先到用户管理界面给该班级创建一个班长,如果不确定班长是谁,可以用班级名创建用户.如: 班级:69期 用户账号 : 69,其他看情况填写</span>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:clazz:edit']"-->
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
      <!--            v-hasPermi="['kaoqin:clazz:remove']"-->
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
      <!--            v-hasPermi="['kaoqin:clazz:export']"-->
      <!--            icon="Download"-->
      <!--            plain-->
      <!--            type="warning"-->
      <!--            @click="handleExport"-->
      <!--        >导出-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
      <el-col :span="24" style="display: flex; justify-content: flex-end;">
        <strong v-hasPermi="['kaoqin:clazz:add']" style="color: red">转班是非常危险的操作,请确认好后再转班,此操作不可逆。不过,转错了你再一个个手动转回来呗
        </strong>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="clazzList" @selection-change="handleSelectionChange">
      <!--      <el-table-column align="center" type="selection" width="55"/>-->
      <el-table-column align="center" label="序号" prop="id" type="index" width="100"/>
      <el-table-column align="center" label="班级id(批量导入学生时使用)" prop="id" width="250"/>
      <el-table-column align="center" label="班级名称" prop="name"/>
      <el-table-column align="center" label="班级类型 " prop="clazzType">
        <template #default="scope">
          <dict-tag :options="clazz_type" :value="scope.row.clazzType"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级人数" prop="count"/>
      <el-table-column align="center" label="班长" prop="monitorId">
        <template #default="scope">
          <div v-for="user in userList" :key="user.userId">
        <span v-if="scope.row.monitorId===user.userId">
              {{ user.nickName }}
        </span>
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="更新人" prop="updateBy"/>-->
      <el-table-column v-hasPermi="['kaoqin:clazz:edit']" align="center" class-name="small-padding fixed-width"
                       label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['kaoqin:clazz:edit']" link type="danger"
                     @click="updateClazzs(scope.row)">⚠️转班⚠️
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-hasPermi="['kaoqin:clazz:edit']" align="center" class-name="small-padding fixed-width"
                       label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['kaoqin:clazz:edit']" link type="primary"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button v-hasPermi="['kaoqin:clazz:remove']" link type="primary"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <!-- 添加或修改班级管理对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="500px">
      <el-form ref="clazzRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" d placeholder="请输入班级名称"/>
        </el-form-item>
        <el-form-item label="班级类型 " prop="clazzType">
          <el-select v-model="form.clazzType" placeholder="请选择班级类型 ">
            <el-option
                v-for="dict in clazz_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班长 " prop="monitorId">

          <el-select v-model="form.monitorId" filterable placeholder="请选择班长">
            <span v-if="title==='修改班级管理'">
            <el-option
                v-for="user in userList2"
                :key="user.userId"
                :label="user.nickName"
                :value="user.userId"
            ></el-option>
               </span>
            <span v-else>
            <el-option
                v-for="user in userList1"
                :key="user.userId"
                :label="user.nickName"
                :value="user.userId"
            ></el-option>
          </span>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--转班弹窗   ------------------->
    <el-dialog v-model="openZhuanBan" append-to-body title="转班" width="500px">
      <el-form ref="clazzRef" :model="formClazzId" :rules="rules" label-width="100px">
        <el-form-item label="原班级名称" prop="oldClazzId">
          <!--          <el-input v-model="form.name" placeholder="请输入班级名称"/>-->
          {{ form.name }}
        </el-form-item>
        <el-form-item label="转到班级" prop="newClazzId">
          <!--          <el-input v-model="form.classId" placeholder="请输入所在班级"/>-->
          <el-select v-model="formClazzId.newClazzId" filterable placeholder="请输入所在班级">
            <el-option
                v-for="item in clazzList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFormClazz">确 定</el-button>
          <el-button @click="cancelZhuanBan">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    ------------------->
  </div>
</template>

<script name="Clazz" setup>
import {addClazz, clazzZhuanBan, delClazz, getClazz, listClazz, updateClazz} from "@/api/kaoqin/clazz";
import {loadAllParams} from "@/api/page.js";
import {listUser, listUser1, listUser2} from "@/api/system/user.js";

const {proxy} = getCurrentInstance();
const {clazz_type} = proxy.useDict('clazz_type');

const clazzList = ref([]);
const open = ref(false);
const openZhuanBan = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const formClazzId = reactive({
      oldClazzId: null,
      newClazzId: null
    }
)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    clazzType: null,
  },
  rules: {
    name: [
      {required: true, message: "班级名称不能为空", trigger: "blur"}
    ],
    clazzType: [
      {required: true, message: "班级类型 不能为空", trigger: "change"}
    ],
    monitorId: [
      {required: true, message: "班长不能为空", trigger: "change"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询班级管理列表 */
function getList() {
  loading.value = true;
  listClazz(queryParams.value).then(response => {
    clazzList.value = response.rows;
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
    name: null,
    clazzType: null,
    count: null,
    monitorId: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("clazzRef");
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
  title.value = "添加班级管理";
  getUserList1()
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getClazz(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改班级管理";
    getUserList1()
  });
  getUserList2(row)
}

/** 转班按钮操作 */
function updateClazzs(row) {
  const _id = row.id || ids.value
  getClazz(_id).then(response => {
    form.value = response.data;
    formClazzId.oldClazzId = response.data.id;
    openZhuanBan.value = true
    getUserList1()
  });
  getUserList2(row)
}

// 转班取消按钮
function cancelZhuanBan() {

  openZhuanBan.value = false;
  // formClazzId.oldClazzId = null;
}


/** 提交按钮 */
function submitFormClazz() {
  if (formClazzId.oldClazzId === formClazzId.newClazzId) {
    proxy.$modal.msgError("自己转给自己有必要吗");
    return
  }
  if (formClazzId.oldClazzId != null && formClazzId.newClazzId != null) {
    clazzZhuanBan(formClazzId).then(response => {
      proxy.$modal.msgSuccess("转班成功");
      openZhuanBan.value = false;
      getUserList1()
      getUserList()
      getList();
    });
  } else {
    proxy.$modal.msgError("数据有误,刷新试试");
  }
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["clazzRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateClazz(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getUserList1()
          getUserList()
          getList();
        });
      } else {
        addClazz(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getUserList1()
          getUserList()
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除->' + row.name + '<-!!!,与当前班级关联的班长账号、学生信息、学生考勤也会一并删除,请慎重决定').then(function () {
    return delClazz(_ids);
  }).then(() => {
    getList();
    getUserList1()
    getUserList()
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/clazz/export', {
    ...queryParams.value
  }, `clazz_${new Date().getTime()}.xlsx`)
}

/** 查询用户管理列表 */
const userList = ref([])

function getUserList() {
  listUser(loadAllParams).then(response => {
    userList.value = response.rows;
  });
}

/** 查询用户管理列表未关联班级的用户 */
const userList1 = ref([])

function getUserList1() {
  listUser1().then(response => {
    userList1.value = response.rows;
  });
}

/** 查询用户管理列表未关联班级的用户以及当前的用户 */
const userList2 = ref([])

function getUserList2(row) {
  // reset()
  const userId = row.monitorId
  listUser2(userId).then(response => {
    userList2.value = response.rows;
  });
}

getUserList1()
getUserList()
getList();
</script>
