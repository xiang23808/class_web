<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title-container">
        <h3 class="title">教务系统</h3>
        <h5 class="title-eng">Management background</h5>
      </div>
      <!-- 登录表单区域 -->
      <div style="padding: 0 120px 30px;">
        <el-radio v-model="type" label="1">学生</el-radio>
        <el-radio v-model="type" label="2">教师</el-radio>
      </div>
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        @keyup.enter.native="login"
      >
        <el-form-item prop="email">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.email"
            placeholder="请输入邮箱"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button
            type="primary"
            @click="login"
            v-loading.fullscreen.lock="fullscreenLoading"
            style="width: 100%"
            >登录</el-button
          >
          <div>
        <button @click="loginWithLine">通过 Line 登录</button>
        </div>
          <!-- <el-button type="primary" @click="resetloginForm">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginTeacher, loginStudent } from "@/api/user/index";

export default {
  data() {
    return {
      fullscreenLoading: false,
      loginForm: {
        email: "",
        password: "",
      },
      loginFormRules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度在不少于6位数", trigger: "blur" },
        ],
      },
      time: 60,
      platform: process.env.VUE_APP_OUTPUTDIR,
      type: "1",
    };
  },
  methods: {
    //点击重置按钮
    resetloginForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields();
    },
    async getCode() {
      let that = this
      let fieldsToValidate = ["email", "password"];
      Promise.all(
        fieldsToValidate.map((field) => {
          return new Promise((resolve, reject) => {
            this.$refs.loginFormRef.validateField(field, (errorMessage) => {
              resolve(errorMessage);
            });
          });
        })
      ).then((errorMessages) => {
        let valid = errorMessages.every((errorMessage) => {
          return errorMessage == "";
        });
      });
      if(this.time<60) return;
      sendPhoneCode({ name: this.loginForm.name }).then((res) => {
        if (res.code == 200) {
          that.cacalTime();
          this.$message.success(res.message);
        }else{
          this.$message.error(res.message);
        }
      });
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);

        let res;
        if(this.type == "1"){
          res = await loginStudent(this.loginForm);
        }else {
          res = await loginTeacher(this.loginForm);
        }
        
        if (res.code == 200) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("name", res.data.user.name);
          sessionStorage.setItem("email", this.loginForm.email);
          sessionStorage.setItem("user_id", res.data.user.id);
          sessionStorage.setItem("role_id", res.data.user.role.id);
          sessionStorage.setItem("role_name", res.data.user.role.name);
          var expire_time = Math.round(new Date() / 1000) + 3600 * 24;
          sessionStorage.setItem("expire_time", expire_time);
          this.$router.push("/home");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    async loginWithLine() {
      try {
        const line_auth = 'https://access.line.me/oauth2/v2.1/authorize';
const auth_params = {
  response_type: 'code',
  client_id: 2000515887,
  redirect_uri: window.location.href,
  state: 'STATE',
  scope: 'profile openid email'
};
const params = new URLSearchParams()
for (let key in auth_params) {
  params.append(key, auth_params[key])
}
const paramsString = params.toString();
window.location.href = `${line_auth}?${paramsString}`;

      } catch (error) {
        console.error('Error initiating LINE login:', error);
      }
        },
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-image: url("../assets/login-background.png");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 380px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 7px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}

.title-container {
  position: relative;

  .title {
    font-size: 26px;
    color: #5d9ccf;
    text-align: center;
    font-weight: bold;
    margin-bottom: 0;
  }

  .title-eng {
    font-size: 16px;
    color: #5d9ccf;
    text-align: center;
    font-weight: bold;
    margin-top: 0;
  }
}

.validate_code_input {
  width: 67%;
  margin-right: 10px;
}

.btns {
  width: 450px;
  margin-bottom: 30px;
  background-color: #ecaa35;
  font-weight: Regular;
  font-size: 16px;
  border: 0px;
  color: #ffffff;
}

.login_form {
  padding: 0 40px;
  box-sizing: border-box;
}
</style>