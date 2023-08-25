<template>
  <el-container class="home-container">
    <el-header class="header">
      <img class="title-img" src="../assets/dashboard/title.png" alt="">
      <el-row class="header-row">
        <el-col :span="2">

        </el-col>
        <el-col :span="4">
          <el-select v-model="schoolValue" placeholder="请选择" class="select-school" v-if="selectBtn"
                     @change="selectSchool">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>

        </el-col>

        <el-col :span="8" class="right-col">
          <el-row>
            <el-col :span="4">
              <el-popover
                  placement="bottom"
                  ref="popover-stat"
                  width="400"
                  trigger="click"
                  :visible-arrow="true"
                  :offset="0"
              >
              </el-popover>
            </el-col>

            <el-col :span="20" style="margin-top: 10px">

              <el-divider direction="vertical"></el-divider>
              <span class="now-time">{{ nowTime }}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="exit" @click="logout"
              ><i class="el-icon-switch-button"></i>
                <el-button type="text">退出</el-button></span
              ></el-col
            >
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
            text-color="#666"
            active-text-color="#409EFF"
            :router="true"
            :default-active="$route.path"
            @select="handleSelect"
        >
          <div class="admin-info">
            <el-avatar :size="60" :src="avatar"></el-avatar>
            <el-button type="text">{{ name }}</el-button>
          </div>
          <template v-for="item in menuList">
            <el-menu-item
                :index="item.path"
                v-if="item.children == ''"
                :key="item.id"
            >
              <i :class="iconsObject[item.id]"></i>
              <span slot="title">{{ item.menu_name }}</span>
            </el-menu-item>
            <el-submenu :index="item.id + ''" :key="item.id" v-else>
              <template slot="title">
                <i :class="iconsObject[item.id]"></i>
                <span>{{ item.menu_name }}</span>
                <span
                    v-if="
                    item.id == 49 && (prepareMessage != 0 || shootMessage != 0)
                  "
                ><el-badge
                    :value="prepareMessage + shootMessage"
                    :max="99"
                    class="item"
                    style="margin-left: 3px; position: relative; top: -2px"
                ></el-badge
                ></span>
              </template>
              <el-menu-item
                  :index="subItem.path"
                  v-for="subItem in item.children"
                  :key="subItem.id"
              >
                <template slot="title">
                  <span>{{ subItem.menu_name }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view :component="component" @showComponent="showComponent"></router-view>
        </keep-alive>
      </el-main>
    </el-container>

  </el-container>

</template>

<script>
import {formatDate} from "@/api/index";
import {schoolList} from "@/api/user/index";

import "@/assets/css/home.css";

export default {
  data() {
    return {
      Na: "",
      name: "",
      menuList: [],
      currMenu: [],
      appShow: [],
      iconsObject: {
        18: "el-icon-s-tools",
        26: "el-icon-s-shop",
        32: "el-icon-s-marketing",
        35: "el-icon-platform-eleme",
        38: "el-icon-s-help",
        25: "el-icon-user-solid",
        97: "el-icon-s-home",
        108: "el-icon-guide",
        104: "el-icon-video-camera-solid",
        123: "el-icon-coin",
        154: "el-icon-mobile-phone",
      },
      options: [],

      value: '',
      nowTime: formatDate(new Date()),
      timer: "",
      avatar: require("../assets/avatar.png"),
      currMonthAmount: 0,
      prepareMessage: 0,
      shootMessage: 0,
      component: 0,
      showTab: false,
      selectBtn: false,
      schoolValue: "",
      tallBtn: true,
    };
  },
  created() {
    this.getMenu();
    this.getButten();
    let avatar = sessionStorage.getItem("avatar");
    if (avatar != "" && avatar != null) {
      this.avatar = avatar;
    }
    this.currMenu = JSON.parse(sessionStorage.getItem("currMenu"));
  },
  mounted() {
    this.timer = setInterval(() => {
      this.nowTime = formatDate(new Date());
    }, 1000);
    this.$root.eventBus.$on("changeAvatar", () => {
      this.avatar = sessionStorage.getItem("avatar");
    });
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      location.reload();
    },
    //获取所有菜单
    getMenu() {
      var menuStudent = [
        {
          "id": 97,
          "name": "dashboard.manage",
          "pid": 0,
          "menu_name": "首页",
          "path": "/dashboard",
          "children": []
        },
        {
          "id": 18,
          "name": "teacher.manage",
          "pid": 0,
          "menu_name": "教师",
          "path": "",
          "children": [
            {
              "id": 19,
              "pid": 18,
              "name": "api.student.student_teacher_list",
              "menu_name": "教师列表",
              "path": "/student_teacher_list"
            },
            {
              "id": 21,
              "pid": 18,
              "name": "api.student.student_teacher_watch_list",
              "menu_name": "关注教师列表",
              "path": "/student_teacher_watch_list"
            }
          ]
        },
        {
          "id": 104,
          "name": "student.student_message",
          "pid": 0,
          "menu_name": "消息",
          "path": "",
          "children": [
            {
              "id": 154,
              "pid": 104,
              "name": "api.student.student_message",
              "menu_name": "消息",
              "path": "/student_message"
            }
          ]
        }
      ];

      var menuTeacher = [
        {
          "id": 97,
          "name": "dashboard.manage",
          "pid": 0,
          "menu_name": "首页",
          "path": "/dashboard",
          "children": []
        },
        {
          "id": 18,
          "name": "student.manage",
          "pid": 0,
          "menu_name": "学生",
          "path": "",
          "children": [
            {
              "id": 19,
              "pid": 18,
              "name": "api.teacher.student_list",
              "menu_name": "学生列表",
              "path": "/student_list"
            },
            {
              "id": 21,
              "pid": 18,
              "name": "api.teacher.watched_student",
              "menu_name": "关注我的学生列表",
              "path": "/watched_student"
            }
          ]
        },
        {
          "id": 104,
          "name": "teacher.teacher_message",
          "pid": 0,
          "menu_name": "消息",
          "path": "",
          "children": [
            {
              "id": 154,
              "pid": 104,
              "name": "api.teacher.teacher_message",
              "menu_name": "消息",
              "path": "/teacher_message"
            }
          ]
        }

      ];
      let roleId = sessionStorage.getItem("role_id");
      if (roleId == 1) {
        menuTeacher.push({
              "id": 25,
              "name": "school_teacher.manage",
              "pid": 0,
              "menu_name": "教师",
              "path": "",
              "children": [
                {
                  "id": 26,
                  "pid": 25,
                  "name": "api.teacher.school_teacher_list",
                  "menu_name": "学校教师列表",
                  "path": "/school_teacher_list"
                }
              ]
            },
            {
              "id": 123,
              "name": "school.manage",
              "pid": 0,
              "menu_name": "学校",
              "path": "",
              "children": [
                {
                  "id": 154,
                  "pid": 123,
                  "name": "api.teacher.school_list",
                  "menu_name": "学校列表",
                  "path": "/school_list"
                }
              ]
            });
      }


      let menu = roleId == 3 ? menuStudent : menuTeacher;

      this.menuList = menu;
      this.name = window.sessionStorage.getItem("name");
    },
    handleSelect(key, keyPath) {
      let menuList = this.menuList;
      this.currMenu = [];
      if (keyPath.length > 1) {
        for (var i in menuList) {
          if (menuList[i].id == keyPath[0]) {
            let menuItem = menuList[i].children;
            for (var j in menuItem) {
              if (menuItem[j].path == keyPath[1]) {
                this.currMenu[0] = menuList[i];
                this.currMenu[1] = menuItem[j];
                sessionStorage.setItem(
                    "currMenu",
                    JSON.stringify(this.currMenu)
                );
              }
            }
          }
        }
      } else {
        for (var i in menuList) {
          if (menuList[i].path == keyPath[0]) {
            this.currMenu[0] = menuList[i];
            sessionStorage.setItem("currMenu", JSON.stringify(this.currMenu));
          }
        }
      }
    },
    showComponent(data) {
      this.showTab = data
    },
    changeComponent(type) {
      this.component = type
    },
    async getButten() {
      this.roleId = window.sessionStorage.getItem("role_id");
      if (this.roleId == 1) {
        this.selectBtn = true
      }
      const res = await schoolList();
      if (res.code !== 200) {
        return this.$message.error("获取学校列表失败！");
      }

      let list = res.data.list;
      for (let i in list) {
        this.options.push({
          value: list[i].id,
          label: list[i].name,
        });
      }
      this.schoolValue = this.options[0].value
      this.selectSchool(this.schoolValue);
    },

    selectSchool(value) {
      sessionStorage.setItem("school_id", value);
    },
  },

};
</script>

<style lang="less" scoped>
.el-header {
  position: relative;
  background-color: #ffffff;
  display: flex;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.right-menu {
  float: right;
  height: 100%;
  line-height: 30px;
  display: block;
  margin-left: 70%;

  .avatar-container {
    margin-right: 10px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}

.el-breadcrumb {
  font-size: 12px;
  line-height: 1;
}

.select-school {
  float: left;
}
</style>