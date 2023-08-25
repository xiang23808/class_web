<template>
  <el-dialog
      title="添加"
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
      <el-form-item label="学校" prop="name">
        <el-input
            type="text"
            v-model="addForm.name"
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
  createSchool,
} from "@/api/user/index";

export default {
  data() {
    return {
      disableBtn: {
        addBtn: false,
      },
      // 表单
      addForm: {
        name: "",
      },
      // 添加数据规则
      addFormRules: {
        name: [
          {required: true, message: "请填写学校名称", trigger: "blur"},
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
        const res = await createSchool(this.addForm);
        this.disableBtn.addBtn = false;
        if (res.code == 200) {
          this.$message.success(res.message);
          this.hideForm();
          this.$emit("getUsersList");
        } else {
          return this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
  