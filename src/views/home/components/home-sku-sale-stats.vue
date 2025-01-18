<template>

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
          <div class="text color4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班级名称</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <div class="num color3 text-shadow2">
            {{ countList.weijiCount }}
          </div>
          <div class="text color4">
            违纪人数
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {listCount, getCount, delCount, addCount, updateCount} from "@/api/kaoqin/count";
import {parseTime} from "../../../utils/ruoyi.js";

const {proxy} = getCurrentInstance();
const countList = ref([]);
const loading = ref(true);
const total = ref(0);


const data = reactive({
  form: {},
  queryParamsCount: {
    pageNum: 1,
    pageSize: 10,
    createTime: null,
    clazzId: null,
  },
  rules: {}
});

const {queryParamsCount, form, rules} = toRefs(data);

/** 查询班级违纪人数列表 */
function getCountList() {
  listCount(queryParamsCount.value).then(response => {
    countList.value = response.rows[0];
    total.value = response.total;
  });
}

// // 取消按钮
// function cancel() {
//   open.value = false;
//   reset();
// }

// 表单重置
function reset() {
  form.value = {
    createTime: null,
    clazzId: null,
    count: null
  };
  proxy.resetForm("countRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getCountList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  form.value = {
    createTime: null,
    clazzId: null,
    count: null
  };
  handleQuery();
}

// // 多选框选中数据
// function handleSelectionChange(selection) {
//   ids.value = selection.map(item => item.clazzName);
//   single.value = selection.length != 1;
//   multiple.value = !selection.length;
// }

// /** 新增按钮操作 */
// function handleAdd() {
//   reset();
//   open.value = true;
//   title.value = "添加班级违纪人数";
// }

// /** 修改按钮操作 */
// function handleUpdate(row) {
//   reset();
//   const _clazzName = row.clazzName || ids.value
//   getCount(_clazzName).then(response => {
//     form.value = response.data;
//     open.value = true;
//     title.value = "修改班级违纪人数";
//   });
// }

// /** 提交按钮 */
// function submitForm() {
//   proxy.$refs["countRef"].validate(valid => {
//     if (valid) {
//       if (form.value.clazzName != null) {
//         updateCount(form.value).then(response => {
//           proxy.$modal.msgSuccess("修改成功");
//           open.value = false;
//           getList();
//         });
//       } else {
//         addCount(form.value).then(response => {
//           proxy.$modal.msgSuccess("新增成功");
//           open.value = false;
//           getList();
//         });
//       }
//     }
//   });
// }

// /** 删除按钮操作 */
// function handleDelete(row) {
//   const _clazzNames = row.clazzName || ids.value;
//   proxy.$modal.confirm('是否确认删除班级违纪人数编号为"' + _clazzNames + '"的数据项？').then(function () {
//     return delCount(_clazzNames);
//   }).then(() => {
//     getList();
//     proxy.$modal.msgSuccess("删除成功");
//   }).catch(() => {
//   });
// }

// /** 导出按钮操作 */
// function handleExport() {
//   proxy.download('kaoqin/count/export', {
//     ...queryParams.value
//   }, `count_${new Date().getTime()}.xlsx`)
// }

getCountList();
</script>
<style lang="scss" scoped>
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

// .bgc1 {
//   background: #E9F3FF;
//   background-image: url('~@/assets/home/circle.png'), url('~@/assets/home/task.png');
//   background-repeat: no-repeat, no-repeat;
//   background-position: 0 0, calc(100% - 12px) 100%;
// }

// .bgc2 {
//   background: #FBEFE8 url('~@/assets/home/sale.png') no-repeat calc(100% - 12px) 100%;
// }
</style>
