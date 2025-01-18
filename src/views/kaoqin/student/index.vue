<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="学生姓名" prop="name">
        <!--        <el-input-->
        <!--            v-model="queryParams.id"-->
        <!--            clearable-->
        <!--            placeholder="请输入学生姓名"-->
        <!--            @keyup.enter="handleQuery"-->
        <!--        />-->
        <el-select v-model="queryParams.id" filterable
                   placeholder="请选择学生" @keyup.enter="handleQuery">
          <el-option
              v-for="stu in stuAllList"
              :key="stu.id"
              :label="stu.name"
              :value="stu.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-hasPermi="['kaoqin:student:edit']" label="所在班级" prop="classId">
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
      <el-form-item>
        <el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:student:add']"
            icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:student:edit']"-->
      <!--            :disabled="single"-->
      <!--            icon="Edit"-->
      <!--            plain-->
      <!--            type="success"-->
      <!--            @click="handleUpdate"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:student:remove']"
            :disabled="multiple"
            icon="Delete"
            plain
            type="danger"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:student:export']"
            icon="Download"
            plain
            type="warning"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:student:add']"
            icon="Upload"
            plain
            type="warning"
            @click="handleImport"
        >批量导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <strong> 备注只显示最后一次转班情况,详情请点击修改查看,或鼠标挪动到具体学生的备注上查看</strong>
        <br>
        <strong v-hasPermi="['kaoqin:student:add']" style="color: red">
          批量新增学生时请随便搜索一个学生然后点导出 ,在该模板的基础上修改,不要直接点击导出,这样会导出所有学生,不方便修改,一次只可导入一个班级。
        </strong>
      </el-col>
      <!--            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="studentList" height="500" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column v-hasPermi="['kaoqin:student:remove']" align="center" type="selection"/>
      <el-table-column align="center" label="序号" prop="id" type="index" width="70"/>
      <el-table-column align="center" label="学生姓名" prop="name"/>
      <el-table-column align="center" label="所在班级" prop="classId">
        <template #default="scope">
          <div v-for="clazz in ClazzList" :key="clazz.id">
        <span v-if="scope.row.classId===clazz.id">
              {{ clazz.name }}
        </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="备注"
                       prop="remark"
                       show-overflow-tooltip width="400"/>
      <el-table-column align="center" label="创建时间" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column v-hasPermi="['kaoqin:student:edit']" align="center" class-name="small-padding fixed-width"
                       label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['kaoqin:student:edit']" icon="Edit" link type="primary"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button v-hasPermi="['kaoqin:student:remove']" icon="Delete" link type="primary"
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

    <!-- 添加或修改学生管理对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="480px">
      <el-form ref="studentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入学生姓名"/>
        </el-form-item>
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
        <el-form-item v-if="form.remark !=undefined" label="备注信息" prop="remark">
          <span v-html="form.remark.split('。').join('。<br>')"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--    数据导入对话框-->
    <el-dialog v-model="excelOpen" append-to-body title="数据批量导入" width="400px">
      <el-upload
          ref="uploadRef"
          :action="uploadExceUrl"
          :auto-upload="false"
          :before-upload="handleBeforeUpload"
          :headers="headers"
          :limit="1"
          :on-error="handleUploadError"
          :on-success="handleUploadSuccess"
          class="upload-demo"
      >
        <template #trigger>
          <el-button type="primary">上传文件</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload">
          上传
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            上传文件仅支持 xls/xlsx格式,文件大小不得超过1M
          </div>
        </template>
      </el-upload>

    </el-dialog>
  </div>
</template>

<script name="Student" setup>
import {addStudent, delStudent, getStudent, listStudent, updateStudent} from "@/api/kaoqin/student";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {loadAllParams} from "@/api/page.js";
import {getToken} from "@/utils/auth.js";

const {proxy} = getCurrentInstance();

const studentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const names = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
// 上传文件
const uploadRef = ref({})

function submitUpload() {
  uploadRef.value.submit();
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: null,
    classId: null,
  },
  rules: {
    name: [
      {required: true, message: "学生姓名不能为空", trigger: "blur"},
      {max: 15, message: "学生姓名最多输入15个字符"}
    ],
    classId: [
      {required: true, message: "所在班级不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询学生管理列表 */
function getList() {
  loading.value = true;
  listStudent(queryParams.value).then(response => {
    studentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询所欲学生 */
const stuAllList = ref([])

function getAllStuList() {
  listStudent(loadAllParams).then(response => {
    stuAllList.value = response.rows;
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
    remark: null,
    classId: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("studentRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.classId = null
  queryParams.value.id = null
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  // single.value = selection.length != 1;
  // multiple.value = !selection.length;

  names.value = selection.map(item => item.name);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加学生管理";
  getClazzList()
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getStudent(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改学生管理";
  });
  getClazzList()
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["studentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateStudent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStudent(form.value).then(response => {
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
  const _names = row.name || names.value;
  proxy.$modal.confirm('是否确认删除姓名为"' + _names + '"的学生？').then(function () {
    return delStudent(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/student/export', {
    ...queryParams.value
  }, `student_${new Date().getTime()}.xlsx`)
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

/**数据导入对话框 **/
const excelOpen = ref(false)

function handleImport() {
  excelOpen.value = true
}

// 上传地址
const uploadExceUrl = ref(import.meta.env.VITE_APP_BASE_API + '/kaoqin/student/import')   //上传exce文件地址
// 上传请求头
const headers = ref({Authorization: 'Bearer ' + getToken()})

// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.code === 200) {
    proxy.$modal.msgSuccess("文件上传成功");
    excelOpen.value = false
    getList()
  } else {
    proxy.$modal.msgError(res.msg);
  }
  uploadRef.value.clearFiles()
  proxy.$modal.closeLoading()
}

// 上传失败
function handleUploadError() {
  proxy.$modal.msgError("上传文件失败");
  uploadRef.value.clearFiles()
  proxy.$modal.closeLoading()
}

//上传文件校验
const props = defineProps({
  modelValue: [String, Object, Array],
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 1,
  },
  // 文件类型, 例如    ["xls", "xlsx"],
  fileType: {
    type: Array,
    default: () => ["xls", "xlsx"],
  },
});

//文件上传
function handleBeforeUpload(file) {
  let isExcel = false;
  if (props.fileType.length) {
    let fileExtension = "";
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    isExcel = props.fileType.some(type => {
      if (file.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
  }
  if (!isExcel) {
    proxy.$modal.msgError(
        `文件格式不正确, 请上传${props.fileType.join("/")}格式文件!`
    );
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("正在上传文件，请稍候...");
}


getClazzList()
getList();
getAllStuList()
</script>
