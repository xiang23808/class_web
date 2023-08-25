<template>
  <div class="mixin-components-container" style="margin: 20px">
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

        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
                type="primary"
                size="mini"
                @click="tall(scope.row)"
            >
              聊天
            </el-button>
          </template>
        </el-table-column>
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
  studentWatchedList,
} from "@/api/user/index";

export default {
  data() {
    return {
      loading: false,
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
      },
      operateBtn: {
        watchBtn: false,
        unWatchBtn: false,
      },
      //控制对话框的显示与隐藏
      userShow: [],
      list: [],
      platform: process.env.VUE_APP_OUTPUTDIR,
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
      const res = await studentWatchedList(data);
      if (res.code !== 200) {
        return this.$message.error("获取用户信息失败！");
      }
      this.list = res.data.list;
      this.pagination.total = res.data.pagination.total_num;
      let Data = [
        {
          value: "student_id",
          label: "ID",
        },
        {
          value: "student_name",
          label: "姓名",
        },
      ];
      this.userShow = Data;
      this.loading = false;
    },

    tall(val) {
      console.log(val)
    },
  },
};
</script>
