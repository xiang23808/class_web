<template>
  <el-dialog
      title="注册管理员"
      :visible.sync="showAddForm"
      :before-close="handleCloseForm"
      width="50%"
  >
    <!-- 内容主体区域 -->
    <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
    >
    <el-form-item label="姓名" prop="name">
        <el-input
            type="text"
            v-model="addForm.name"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
            type="text"
            v-model="addForm.email"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            type="password"
            v-model="addForm.password"
            show-password
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="学校名" prop="school_name">
        <el-input
            type="text"
            v-model="addForm.school_name"
            clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button @click="hideForm()">取 消</el-button>
        <el-button type="primary" @click="addTest" :disabled="disableBtn.addBtn"
        >确 定</el-button
        >
      </span>
  </el-dialog>
</template>

<script>
import {
  regTeacher,
} from "@/api/user/index";

export default {
  data() {
    return {
      disableBtn: {
        addBtn: false,
      },
      // 表单
      addForm: {},
      // 添加数据规则
      addFormRules: {
        name: [
          {required: true, message: "请填写姓名", trigger: "blur"},
        ],
        email: [
          {required: true, message: "请填写邮箱", trigger: "blur"},
        ],
        password: [
          {required: true, message: "请填写密码", trigger: "blur"},
        ],
        school_name: [
          {required: true, message: "请填写学校名", trigger: "blur"},
        ],
      },
    };
  },
  props: ["showAddForm"],
  methods: {
    handleCloseForm() {
      this.hideForm();
    },
    hideForm() {
      this.$emit("hideAddForm");
    },
    addTest() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        this.disableBtn.addBtn = true;
        const res = await regTeacher(this.addForm);
        this.disableBtn.addBtn = false;
        if (res.code == 200) {
          this.$message.success(res.message);
          this.hideForm();
        } else {
          return this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
  