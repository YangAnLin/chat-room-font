<template>
  <el-container style="background-color: #f1f2f3">
    <el-main style="padding: 0 10px">
      <el-row :gutter="20">
        <el-col :span="4" style="height: 100%">
          <ul>
            <li style="background-color: #1eb7cb;">在线玩家1</li>
            <li style="background-color: #f1f2f3;">在线玩家2</li>
            <li style="background-color: #1eb7cb;">在线玩家1</li>
            <li style="background-color: #f1f2f3;">在线玩家2</li>
            <li style="background-color: #1eb7cb;">在线玩家1</li>
            <li style="background-color: #f1f2f3;">在线玩家2</li>
            2 conversations
          </ul>
        </el-col>

        <el-col :span="20" style="padding: 10px 10px 0 ">
            <el-card class="box-card" >
              <div v-for="(o,index) in chatList" :key="index">
                <div>
                  <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                </div>
                {{ o }}
              </div>
            </el-card>
            <el-row style="margin-top: 10px">
              <el-col :span="20">
                <el-input v-model="input" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="websocketsend(input)">发送</el-button>
              </el-col>
            </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import notificationKoro from "notification-koro1";

export default {
  name: "ChatRoom",
  data() {
    return {
      input: '',
      chatList: ["12", "23"],
      notificationClass: null,
      showNatification: null
    }
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() { //初始化weosocket
      const wsuri = "ws://207.148.119.26:10087/ws";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      let actions = {"test": "有人上线了"};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      const redata = e.data;
      console.log("接收到的数据:", redata);
      this.chatList.push("接收到的数据:"+redata);
      this.requestPermission();
    },
    websocketsend(Data) {//数据发送
      this.websock.send("我发送的消息:"+Data);
      this.chatList.push("我发送的消息:"+Data)
    },
    websocketclose(e) {  //关闭
      console.log('断开连接', e);
    },
    requestPermission() {
      const userSelectFn = msg => {
        if (msg === "already granted" || msg === "granted") {
          // 随时可以调用通知
          this.notificationClass.userAgreed();
        } else if (msg === "close") {
          // 请求权限通知被关闭
        } else if (msg === "denied" || msg === "already denied") {
          // 请求权限当前被拒绝 || 曾经被拒绝
        }
      };
      return this.notificationClass.initNotification(userSelectFn);
    }
  },
  mounted() {
    const options = {
      dir: "rtl", // 文字从右到左
      body: "有10086个人评论了你的朋友圈", // body部分的文字
      // lang: '', // 通知语言
      // tag: '通知id', // 通知id，用以替换、刷新、移除的时候用
      // 通知图标
      icon:
          "https://upload-images.jianshu.io/upload_images/5245297-818e624b75271127.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"
    };
    this.notificationClass = new notificationKoro("标题：状态更新", options); // 初始化
    if (this.notificationClass.support) {
      // 点击弹窗的回调
      this.notificationClass.notificationEvent("onclick", e => {
        console.log("点击通知打开百度", e);
        window.open("https://www.baidu.com/", "_blank");
      });
      // 弹窗显示的回调
      this.notificationClass.notificationEvent("onshow", e => {
        console.log("显示", e);
      });
      this.notificationClass.notificationEvent("onerror", e => {
        console.log("错误", e);
      });
      this.notificationClass.notificationEvent("onclose", e => {
        console.log("用户关闭通知", e);
      });
      // 弹窗权限
      return this.requestPermission();
    } else {
      // 浏览器不支持
      console.log("当前浏览器版本不支持natification,建议升级你的浏览器");
    }
  }
}
</script>

<style scoped>

ul {
  margin: 0;
  padding: 0;
  height: 100%;
}

li {
  width: auto;
  height: 30px;
  background-color: #1eb7cb;
  list-style-type: none;
}

.box-card{
  min-height: 700px;
  max-height: 500px;
  overflow: auto;
  text-align: left;
}
</style>