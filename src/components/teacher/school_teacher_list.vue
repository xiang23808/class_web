<template>
  <div class="mixin-components-container" style="margin: 20px">

    <el-row :gutter="20">
      <el-col :span="4" :offset="0">
        <div class="grid-content bg-purple">
          <el-button
              type="primary"
              @click="showAddForm = true"
              v-if="operateBtn.addBtn"
          >
            邀请教师
          </el-button>
        </div>
      </el-col>
    </el-row>

    <el-card class="box-card" style="margin-top: 20px" v-loading="loading">
      <el-table :data="list" style="width: 100%" stripe fit>
        <el-table-column
            :prop="v.value"
            :label="v.label"
            show-overflow-tooltip
            align="center"
            v-for="(v, i) in userShow"
            :key="i.value"
        ></el-table-column>

      </el-table>

      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pagination.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          style="margin-top: 20px; text-align: center"
      >
      </el-pagination>
      <!-- 内容主体区域 -->
    </el-card>
    <template>
      <add-form
          :showAddForm="showAddForm"
          @getUsersList="getUsersList"
          @hideAddForm="hideAddForm"
      ></add-form>
    </template>
  </div>
</template>
<style>
.con {
  width: 100%;
  height: 60px;
}

.button {
  width: 600px;
  height: 50px;
  float: left;
}
</style>

<script>
import {
  schoolTeacherList,
} from "@/api/user/index";
import addForm from "./add_teacher.vue";

export default {
  components: {
    addForm,
  },
  data() {
    return {
      loading: false,
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
      },
      operateBtn: {
        addBtn: true,
      },
      //控制对话框的显示与隐藏
      userShow: [],
      list: [],
      platform: process.env.VUE_APP_OUTPUTDIR,
      showAddForm: false,

    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pagination.page_size = newSize;
      this.getUsersList();
    },
    // 监听页码值事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pagination.page = newPage;
      this.getUsersList();
    },
    // 监听添加用户表单关闭
    adduserClose() {
      this.$refs.addformRef.resetFields();
    },
    // 用户列表
    async getUsersList() {
      this.loading = true;
      let data = this.pagination;
      data.school_id = window.sessionStorage.getItem("school_id");
      const res = await schoolTeacherList(data);
      if (res.code !== 200) {
        return this.$message.error("获取用户信息失败！");
      }
      this.list = res.data.list;
      this.pagination.total = res.data.pagination.total_num;
      let Data = [
        {
          value: "id",
          label: "ID",
        },
        {
          value: "name",
          label: "姓名",
        },
        {
          value: "email",
          label: "邮箱",
        },
      ];
      this.userShow = Data;
      this.loading = false;
    },

    tall() {

    },
    hideAddForm() {
      this.showAddForm = false;
    },
  },
};
</script>
