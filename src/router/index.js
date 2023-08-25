import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login",
      meta: {
        title: "教务系统",
      },
    },
    {
      path: "/login",
      name: "login",
      component: (resolve) => require(["../components/login"], resolve),
      meta: {
        title: "教务系统",
      },
    },
    {
      path: "/home",
      name: "home",
      component: (resolve) => require(["../components/home"], resolve),
      redirect: "/dashboard",
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: (resolve) => require(["../components/dashboard"], resolve),
          meta: {
            title: "首页看板",
          },
        },
        {
          path: "/student_teacher_list",
          name: "student_teacher_list",
          component: (resolve) => require(["../components/student/teacher_list"], resolve),
          meta: {
            title: "教师列表",
          },
        },
        {
          path: "/student_teacher_watch_list",
          name: "student_teacher_watch_list",
          component: (resolve) => require(["../components/student/teacher_watch_list"], resolve),
          meta: {
            title: "关注教师列表",
          },
        },

        {
          path: "/student_list",
          name: "student_list",
          component: (resolve) => require(["../components/teacher/student_list"], resolve),
          meta: {
            title: "学生列表",
          },
        },
        {
          path: "/watched_student",
          name: "watched_student",
          component: (resolve) => require(["../components/teacher/student_watched_list"], resolve),
          meta: {
            title: "关注我的学生列表",
          },
        },
        {
          path: "/school_teacher_list",
          name: "school_teacher_list",
          component: (resolve) => require(["../components/teacher/school_teacher_list"], resolve),
          meta: {
            title: "学校教师列表",
          },
        },
        {
          path: "/school_list",
          name: "school_list",
          component: (resolve) => require(["../components/teacher/school_list"], resolve),
          meta: {
            title: "学校列表",
          },
        },
    {
      path: "/teacher_message",
      name: "teacher_message",
      component: (resolve) => require(["../components/teacher/teacher_message.vue"], resolve),
      meta: {
        title: "消息",
      },
    },
    {
      path: "/student_message",
      name: "student_message",
      component: (resolve) => require(["../components/student/student_message.vue"], resolve),
      meta: {
        title: "消息",
      },
    },
      ],
    },
  ],
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
// to 将要访问的路径
// from代表从哪个路径跳转而来
// next 是一个函数，表示放行
// next() 放行    next('/login') 强制跳转

export default router;
