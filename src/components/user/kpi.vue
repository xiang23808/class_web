<template>
  <el-dialog
    title="绩效"
    :visible.sync="showKpiForm"
    :before-close="handleCloseForm"
    width="80%"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="用户登录名" :required="true">
            <el-input
              v-model="userData.name"
              clearable
              placeholder="请输入用户名"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <template v-for="(row, key) in kpiData">
          <el-form-item
            :label="key == 'row_1' ? 'KPI评分' : ''"
            :required="true"
            class="kpi-item"
            :key="key"
          >
            <el-col :span="4" v-for="(kpi, index) in row" :key="index">
              <el-row :gutter="10" class="kpi-month">
                <el-col
                  :span="6"
                  class="kpi-title"
                  @click.native="showEditKpi(kpi)"
                  >{{ kpi.month }}月</el-col
                >
                <el-col :span="18" class="kpi-value">
                  <el-input
                    clearable
                    v-model="kpiData[key][index].kpi"
                    placeholder="请输入KPI"
                    :disabled="true"
                  ></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
        </template>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="考勤" :required="true">
            <el-dropdown
              split-button
              type="primary"
              trigger="click"
              @click="selectLate"
            >
              本月迟到
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in checkInLate"
                  :key="index"
                  >{{ item.time }}<el-divider direction="vertical"></el-divider
                  >{{ item.exception_time }}分钟</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template>
      <kpi-edit-form
        :data="operateData"
        :showEditKpiForm="showEditKpiForm"
        @hideEditKpiForm="hideEditKpiForm"
        @createKpiMonth="createKpiMonth"
      ></kpi-edit-form>
    </template>

    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideForm()">关 闭</el-button>
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
import { get_admin_all_kpi, formatDate, get_check_in_data } from "@/api/index";
import kpiEditForm from "./kpiEdit.vue";

export default {
  components: { kpiEditForm },
  data() {
    return {
      userData: {},
      formData: {},
      formRules: {},
      kpiData: {
        row_1: [],
        row_2: [],
        row_3: [],
        row_4: [],
      },
      originalKpiData: [],
      checkInLate: [],
      operateData: {},
      showEditKpiForm: false,
    };
  },
  props: ["showKpiForm", "data"],
  created() {},
  computed: {},
  watch: {
    // 监听父组件传递id
    async data(value) {
      this.userData = value;
      this.createKpiMonth();
      this.get_check_in_data();
    },
  },
  methods: {
    // 关闭当前子页面
    handleCloseForm() {
      this.hideForm();
    },
    // 通知父组件关闭当前子页面
    hideForm() {
      this.$emit("hideKpiForm");
    },
    hideEditKpiForm() {
      this.showEditKpiForm = false;
    },
    createKpiMonth() {
      this.kpiData = {
        row_1: [],
        row_2: [],
        row_3: [],
        row_4: [],
      };
      let date = new Date();
      let year = date.getFullYear();
      for (var i = 0; i < 12; i++) {
        var day = year + "-" + parseInt(i + 1) + "-01";
        day = formatDate(day).split(" ")[0];
        var month = parseInt(i) + 1;
        var kpi = {
          date: day,
          kpi: "",
          month: month,
          achievements: "",
        };
        if (i < 3) {
          this.kpiData.row_1.push(kpi);
        } else if (i > 2 && i < 6) {
          this.kpiData.row_2.push(kpi);
        } else if (i > 5 && i < 9) {
          this.kpiData.row_3.push(kpi);
        } else {
          this.kpiData.row_4.push(kpi);
        }
      }
      this.get_person_kpi();
    },
    async get_person_kpi() {
      let res = await get_admin_all_kpi({ id: this.userData.id });
      let data = res.data;
      this.originalKpiData = data;
      for (var i in data) {
        let month = data[i].date.split("-")[1];
        let kpi = data[i].kpi;
        let key = "";
        if (month % 3 == 0) {
          key = (parseInt(month) % 3) + 2;
        } else {
          key = (month % 3) - 1;
        }
        if (month < 4) {
          this.kpiData.row_1[key].kpi = kpi;
          this.kpiData.row_1[key].achievements = data[i].achievements;
        } else if (month > 3 && month < 7) {
          this.kpiData.row_2[key].kpi = kpi;
          this.kpiData.row_2[key].achievements = data[i].achievements;
        } else if (month > 6 && month < 10) {
          this.kpiData.row_3[key].kpi = kpi;
          this.kpiData.row_3[key].achievements = data[i].achievements;
        } else {
          this.kpiData.row_4[key].kpi = kpi;
          this.kpiData.row_4[key].achievements = data[i].achievements;
        }
      }
    },
    async get_check_in_data() {
      let res = await get_check_in_data({ id: this.userData.id });
      var checkInLate = res.data;
      for (var i in checkInLate) {
        var date = checkInLate[i].exception_date;
        date = date.split("-");
        checkInLate[i].time = date[1] + "/" + date[2];
      }
      this.checkInLate = checkInLate;
    },
    selectLate() {},
    showEditKpi(kpi) {
      this.operateData = kpi;
      this.operateData.user_id = this.userData.id;
      var kpiList = this.originalKpiData;
      this.operateData.isEdit = false;
      for (var i in kpiList) {
        if (this.operateData.date == kpiList[i].date) {
          this.operateData.isEdit = true;
        }
      }
      this.showEditKpiForm = true;
    },
  },
};
</script>
