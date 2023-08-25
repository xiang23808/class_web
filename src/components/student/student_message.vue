<template>
  <div class="jwchat">
    <JwChat-index
        v-model="inputMsg"
        :taleList="taleList"
        :config="config"
        :showRightBox="false"
        scrollType="scroll"
        :winBarConfig="winBarConfig"
        @enter="bindEnter"
        @clickTalk="talkEvent"
    >
    </JwChat-index>
  </div>
</template>

<script>
import {getStudentHistoryMessage, getStudentMessageUser, wkSendTeacher, wkBindStudent} from "@/api/user/index";
import {formatDate} from "@/api/index";

const img = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fca9d4240-809b-4699-b9f7-07e0c55051bb%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1695354619&t=2e07978262140375eeb72e93664f9440";
const listData = [];
export default {
  components: {},
  data() {
    return {
      // 输入框中的文字
      inputMsg: "",
      // 会话内容
      taleList: [],
      // 工具栏配置
      tool: {
        callback: this.toolEvent,
      },
      // 组件配置
      config: {
        img: img,
        name: "教务系统",
        dept: "对话",
        callback: this.bindCover,
        historyConfig: {
          show: true,
          tip: "已经到顶啦",
          callback: this.bindLoadHistory,
        },
      },
      // 多窗口配置
      winBarConfig: {
        active: "win01", // 当前选中
        width: "160px", // 宽度大小
        listHeight: "60px", // 单个高度
        // 用户列表
        list: [],
        callback: this.bindWinBar,
      },

      ws: "",
      limitWs: 5,
      timesWs: 0,
    };
  },
  created() {
    this.getUser();
    this.initWs();
  },
  methods: {
    // 切换用户窗口，加载对应的历史记录
    async bindWinBar(play = {}) {
      const {type, data = {}} = play;
      console.log(play);
      if (type === "winBar") {
        const {id, dept, name, img} = data;
        this.config = {...this.config, id, dept, name, img};
        this.winBarConfig.active = id;
        this.taleList = [];
        const res = await getStudentHistoryMessage({teacher_id: id});
        if (res.code !== 200) {
          return this.$message.error("获取用户信息失败！");
        }
        this.taleList = res.data;
        this.taleList.forEach(function (item, index) {
          item["img"] = img;
        });
      }
      if (type === "winBtn") {
        const {target: {id} = {}} = data;
        const {list} = this.winBarConfig;
        this.winBarConfig.list = list.reduce((p, i) => {
          if (id != i.id) p.push(i);
          return p;
        }, []);
      }
    },
    // 点击聊天框列中的用户和昵称触发事件
    talkEvent(play) {
      console.log(play);
    },
    // 输入框点击就发送或者回车触发的事件
    bindEnter(e) {
      console.log(e);
      const msg = this.inputMsg;
      if (!msg) return;
      let name = sessionStorage.getItem("name");
      const msgObj = {
        date: formatDate(new Date()),
        text: {text: msg},
        mine: true,
        name: name,
        img: img,
      };
      if (this.winBarConfig.active == 0) {
        return this.$message.error("不允许给系统发信息");
      }
      this.sendMsg(msg)
      this.taleList.push(msgObj);
      

    },
    /**
     * @description:
     * @param {*} type 当前点击的按钮
     * @param {*} plyload 附加文件或者需要处理的数据
     * @return {*}
     */
    toolEvent(type, plyload) {
      console.log("tools", type, plyload);
    },
    bindCover(event) {
      console.log("header", event);
    },
    rightClick(type) {
      console.log("rigth", type);
    },
    async getUser() {
      const res = await getStudentMessageUser();
      if (res.code !== 200) {
        return this.$message.error("获取用户信息失败！");
      }

      this.winBarConfig.list = res.data;
      this.winBarConfig.list.forEach(function (item, index) {
        item["img"] = img;
      });
    },
    initWs() {
      console.log(process.env.VUE_APP_WS_URL)
      this.ws = new WebSocket(process.env.VUE_APP_WS_URL);
      this.listenWs();
    },
    reconnectWs() {
      if (this.limitWs > 0) {
        this.limitWs--;
        this.timesWs++;
        console.log(`第${this.timesWs}次重新连接`);
        setTimeout(() => {
          this.initWs();
        }, 2000);
      } else {
        console.log("服务器连接超时");
      }
    },
    listenWs() {
      this.ws.onopen = () => {
        console.log("已连接服务器");
      };
      this.ws.onmessage = async (e) => {
        var data = eval("(" + e.data + ")");
        var type = data.type || "";
        console.log(e.data);
        switch (type) {
          case "init":
            sessionStorage.setItem("client_id", data.client_id);
            let roleId = sessionStorage.getItem("role_id");
            let res;
              res = await wkBindStudent({
                client_id: data.client_id,
              });
            console.log(res);
            break;
          case "@heart@":
            break;
          case "talk":
          if (this.winBarConfig.active == data.from_id) {
              const msgObj = {
                date: formatDate(new Date()),
                text: {text: data.message},
                mine: false,
                name: data.from_name,
                img: img,
              };
              this.taleList.push(msgObj);
            }
            break;
          default:

        }
      };
      this.ws.onclose = () => {
        console.log("服务器已断开");
        this.reconnectWs();
      };
    },
    async sendMsg(msg) {
      await wkSendTeacher({user_id: this.winBarConfig.active, message: msg});
    },
  },

  mounted() {
  },

};
</script>

<style>
.jwchat {
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>