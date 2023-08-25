<template>
  <el-dialog
    title="绩效"
    :visible.sync="showEditKpiForm"
    :before-close="handleCloseForm"
    :append-to-body="true"
    width="50%"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-form-item label="月份" :required="true">
        <el-input
          v-model="kpiData.month"
          clearable
          placeholder="请输入月份"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="KPI" prop="kpi">
        <el-input
          v-model="formData.kpi"
          clearable
          placeholder="请输入KPI"
        ></el-input>
      </el-form-item>
      <el-form-item label="绩效薪资" prop="achievements">
        <el-input
          v-model="formData.achievements"
          clearable
          placeholder="请输入绩效薪资"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideForm()">关 闭</el-button>
      <el-button type="primary" @click="submitKpi">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style>
.kpi-item .kpi-month .kpi-title {
  color: #4b94f8;
  background: #e6efff;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  text-align: center;
  cursor: pointer;
}

.kpi-item .kpi-month .kpi-value {
  padding-left: 0 !important;
}
</style>

<script>
import { update_admin_kpi, create_admin_kpi } from "@/api/index";

export default {
  components: {},
  data() {
    return {
      formData: {
        id: "",
        date: "",
        kpi: "",
        achievements: "",
      },
      formRules: {
        kpi: [{ required: true, message: "请输入KPI", trigger: "blur" }],
        achievements: [
          { required: true, message: "请输入绩效薪资", trigger: "blur" },
        ],
      },
      kpiData: {},
    };
  },
  props: ["showEditKpiForm", "data"],
  created() {},
  computed: {},
  watch: {
    // 监听父组件传递id
    async data(value) {
      this.kpiData = value;
      this.formData.id = value.user_id;
      this.formData.date = value.date;
      this.formData.kpi = value.kpi;
      this.formData.achievements = value.achievements;
    },
  },
  methods: {
    // 关闭当前子页面
    handleCloseForm() {
      this.hideForm();
    },
    // 通知父组件关闭当前子页面
    hideForm() {
      this.$emit("hideEditKpiForm");
    },
    hideEditKpiForm() {
      this.showEditKpiForm = false;
    },
    submitKpi() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        var res = [];
        if (this.kpiData.isEdit) {
          res = await update_admin_kpi(this.formData);
        } else {
          res = await create_admin_kpi(this.formData);
        }
        if (res.code == 200) {
          this.$message.success(res.message);
          this.hideForm();
          this.$emit("createKpiMonth");
        } else {
          return this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
