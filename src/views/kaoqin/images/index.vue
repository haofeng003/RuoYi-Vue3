<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item v-hasPermi="['kaoqin:images:export']" label="班级名称" prop="clazzId">
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
      <!--      <el-form-item v-hasPermi="['kaoqin:images:export']" label="班级名称" prop="clazzId">-->
      <!--        <el-input v-model="queryParams.clazzName" clearable-->
      <!--                  placeholder="请输入班级" @keyup.enter="handleQuery">-->
      <!--        </el-input>-->
      <!--      </el-form-item>-->
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
            v-hasPermi="['kaoqin:images:add']"
            icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            v-hasPermi="['kaoqin:images:remove']"
            plain
            style="float: right"
            type="success"
        ><a href="http://47.105.41.105:5244/" target="_blank">班级照片</a>
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <span style="color:red;">
          每日图片请及时上传,上传成功的图片会在左上角打上时间水印(北京时间),作为上传图片时间真实性的唯一凭证
        </span>
      </el-col>


      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            v-hasPermi="['kaoqin:images:edit']"-->
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
      <!--            v-hasPermi="['kaoqin:images:remove']"-->
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
      <!--            v-hasPermi="['kaoqin:images:export']"-->
      <!--            icon="Download"-->
      <!--            plain-->
      <!--            type="warning"-->
      <!--            @click="handleExport"-->
      <!--        >导出-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
      <el-col :push="17" :span="1.5">
        <strong>考勤&nbsp; !&nbsp; !&nbsp; !&nbsp;&nbsp;&nbsp;&nbsp; 记录美好生活&nbsp;&nbsp;&nbsp; 😜</strong>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="imagesList" height="500" @selection-change="handleSelectionChange">
      <!--      <el-table-column align="center" type="selection" width="55"/>-->
      <el-table-column align="center" label="序号" prop="id" type="index" width="55"/>
      <el-table-column align="center" label="班级名称" prop="clazzName">
        <template #default="scope">
          <span v-if="userInfo!='banzhuren' && userInfo!='admin' && !isToday(scope.row.createTime)">
            {{ scope.row.clazzName }}
          </span>
          <span v-else>
             <el-button v-hasPermi="['kaoqin:images:edit']" link type="primary"
                        @click="handleUpdate(scope.row)">{{ scope.row.clazzName }}
          </el-button>
          </span>
        </template>

      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip width="150"/>
      <!--      <el-table-column align="center" label="班长id" prop="monitorId"/>-->
      <el-table-column align="center" label="班长姓名" prop="monitorName"/>
      <el-table-column align="center" label="上午图片" prop="imageShang" width="100">
        <template #default="scope">
          <image-preview :height="50" :src="scope.row.imageShang" :width="50"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下午图片" prop="imageXia" width="100">
        <template #default="scope">
          <image-preview :height="50" :src="scope.row.imageXia" :width="50"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="晚自习图片" prop="imageSwan" width="100">
        <template #default="scope">
          <image-preview :height="50" :src="scope.row.imageSwan" :width="50"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="晚自习下课图片" prop="imageShi" width="150">
        <template #default="scope">
          <image-preview :height="50" :src="scope.row.imageShi" :width="50"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" prop="createBy"/>
      <el-table-column align="center" label="更新人" prop="updateBy"/>
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
    </el-table>

    <pagination
        v-show="total>0"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        :total="total"
        @pagination="getList"
    />

    <!-- 添加或修改每日图片对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="900px">
      <el-form ref="imagesRef" :model="form" :rules="rules" label-width="80px">
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item v-hasPermi="['kaoqin:images:export']" label="班级名称" prop="clazzId">
              <!--          <el-input v-model="form.clazzName" placeholder="请输入班级名称"/>-->
              <span v-if="title==='添加每日图片(每个时间段最多传10张照片,支持多图片上传)'">
          <el-select v-model="form.clazzId" filterable placeholder="请选择所在班级">
            <el-option
                v-for="item in ClazzList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          </span>
              <span v-else>
            <strong>{{ form.clazzName }} </strong>
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-hasPermi="['kaoqin:images:export']" label="创建时间" prop="createTime">
           <span v-if="title==='添加每日图片(每个时间段最多传10张照片,支持多图片上传)'">
          <el-date-picker v-model="form.createTime"
                          clearable
                          placeholder="创建时间不选默认当前时间"
                          type="date"
                          value-format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
           </span>
              <span v-else>
            <strong>{{ form.createTime }} </strong>
          </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上午图片" prop="imageShang">
          <image-upload v-model="form.imageShang"/>
        </el-form-item>
        <el-form-item label="下午图片" prop="imageXia">
          <image-upload v-model="form.imageXia"/>
        </el-form-item>
        <el-form-item label="晚自习图片" prop="imageSwan">
          <image-upload v-model="form.imageSwan"/>
        </el-form-item>
        <el-form-item label="晚自习下课图片" prop="imageShi">
          <image-upload v-model="form.imageShi"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="form.remark"
              :autosize="{ minRows: 2, maxRows: 6 }"
              :rows="2"
              placeholder="特殊情况请输入备注"
              style="width: 800px"
              type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <!--      <template #footer>-->
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script name="Images" setup>
import {listImages, getImages, delImages, addImages, updateImages} from "@/api/kaoqin/images";
import {listClazz} from "@/api/kaoqin/clazz.js";
import {loadAllParams} from "@/api/page.js";
import {getInfo} from "@/api/login.js";


const {proxy} = getCurrentInstance();

const imagesList = ref([]);
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
    clazzName: null,
    clazzId: null,
    createTime: null,
  },
  rules: {
    clazzId: [
      {required: false, message: "所在班级不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询每日图片列表 */
function getList() {
  loading.value = true;
  listImages(queryParams.value).then(response => {
    imagesList.value = response.rows;
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
    clazzName: null,
    clazzId: null,
    monitorId: null,
    monitorName: null,
    imageShang: null,
    imageXia: null,
    imageSwan: null,
    imageShi: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("imagesRef");
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
  title.value = "添加每日图片(每个时间段最多传10张照片,支持多图片上传)";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getImages(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改每日图片(每个时间段最多传10张照片,支持多图片上传)";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["imagesRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateImages(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addImages(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除每日图片编号为"' + _ids + '"的数据项？').then(function () {
    return delImages(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kaoqin/images/export', {
    ...queryParams.value
  }, `images_${new Date().getTime()}.xlsx`)
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
getList();
</script>
