<template>
  <el-container style="background-color: #f1f2f3">
    <el-main style="padding: 0 10px;height: calc(100vh - 81px)">
      <el-row :gutter="20">
        <el-col :span="4" style="height: 100%">
          <h4>用户ID:{{userId}}</h4>
          <ul v-for="(user,index) in userList" :key="index">
            <li style="background-color: #1eb7cb;">{{user}}</li>
            <hr>
          </ul>
        </el-col>

        <el-col :span="20" style="padding: 10px 10px 0;height: calc(100vh - 81px) ">
          <el-card class="box-card" style="height:90%">
            <!-- 一个用户的聊天记录 -->
            <div :style="row.userId==userId?'text-align: right':''" v-for="(row,index) in chatList" :key="index">
              <div>
                <div style="display: inline-block;">
                  <p>2020-10-10 23:23:23</p>
                  <p>用户:{{row.userId}}</p>
                </div>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              </div>
              <p id="chatContent">{{row.msg}}</p>
            </div>
          </el-card>

          <el-row style="margin-top: 10px" @keyup.enter.native="websocketsend(input)" :gutter="20">
            <el-col :span="22">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" @click="websocketsend(input)">发送</el-button>
            </el-col>
          </el-row>

        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

// import notificationKoro from "notification-koro1";
// import dayjs from "dayjs"

export default {
  name: "ChatRoom",
  data() {
    return {
      // 自己的channelId
      userId:"",
      // 输入框内容
      input: '',
      // 聊天记录
      chatList: [],
      userList:[],
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
      // const wsuri = "ws://207.148.119.26:10087/ws";
      const wsuri = "ws://localhost:10087/ws";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },

    //连接建立之后执行send方法发送数据
    websocketonopen() {
      console.log("websocketonopen","ws已经建立")
      // 发送1000的请求,注册
      this.websock.send(JSON.stringify({"protocol":"1000"}));
    },
    //连接建立失败重连
    websocketonerror() {
      this.initWebSocket();
    },
    //数据接收
    websocketonmessage(s) {
      console.log("接收消息",s.data)
      let data = s.data
      let parse = JSON.parse(data);

      if (parse.protocol === "1000") {
        // channel建立成功,返回userId
        this.userId = parse.userId
        this.userList = parse.userList
      }else if (parse.protocol === "1002"){
        // 聊天信息
        this.chatList.push(parse);
      }else{
        // 没有匹配到
        console.log("");
      }

      // this.requestPermission();
    },
    websocketsend(Data) {//数据发送
      console.log("发送的聊天信息", Data);
      let data = {
        "protocol":"1002",
        "msg":Data,
      }
      this.websock.send(JSON.stringify(data));
      this.input = "";
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
  // mounted() {
  //   const options = {
  //     dir: "rtl", // 文字从右到左
  //     body: "有10086个人评论了你的朋友圈", // body部分的文字
  //     // lang: '', // 通知语言
  //     // tag: '通知id', // 通知id，用以替换、刷新、移除的时候用
  //     // 通知图标
  //     icon:
  //         "https://upload-images.jianshu.io/upload_images/5245297-818e624b75271127.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"
  //   };
  //   this.notificationClass = new notificationKoro("标题：状态更新", options); // 初始化
  //   if (this.notificationClass.support) {
  //     // 点击弹窗的回调
  //     this.notificationClass.notificationEvent("onclick", e => {
  //       console.log("点击通知打开百度", e);
  //       window.open("https://www.baidu.com/", "_blank");
  //     });
  //     // 弹窗显示的回调
  //     this.notificationClass.notificationEvent("onshow", e => {
  //       console.log("显示", e);
  //     });
  //     this.notificationClass.notificationEvent("onerror", e => {
  //       console.log("错误", e);
  //     });
  //     this.notificationClass.notificationEvent("onclose", e => {
  //       console.log("用户关闭通知", e);
  //     });
  //     // 弹窗权限
  //     return this.requestPermission();
  //   } else {
  //     // 浏览器不支持
  //     console.log("当前浏览器版本不支持natification,建议升级你的浏览器");
  //   }
  // }
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

.box-card {
  min-height: 700px;
  overflow: auto;
  text-align: left;
}


.chatlist .chatout {
  text-align: right;
}

.chatlist .chatout img {
  float: right;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 0 0 10px;
}


.chatlist .chatout span {
  display: inline-block;
  position: relative;
  padding: 10px;
  max-width: calc(100% - 90px);
  min-height: 40px;
  line-height: 20px;
  font-size: 13px;
  word-break: break-all;
  border-radius: 4px;
  /*background-color: #ff0000;*/
  /*color: #fff;*/
}

#chatContent {
  display: inline-block;
  position: relative;
  padding: 10px;
  max-width: calc(100% - 90px);
  min-height: 13px;
  line-height: 20px;
  font-size: 13px;
  word-break: break-all;
  border-radius: 4px;
  background-color: dodgerblue;
  color: #fff;
}

.chatlist .chatout span:before {
  content: " ";
  position: absolute;
  top: 9px;
  left: 100%;
  border: 6px solid transparent;
  /*border-left-color: #ff0000;*/
}

.chatlist .chatin el-avatar {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px 0 0;
}

.chatlist .chatin span {
  display: inline-block;
  position: relative;
  padding: 10px;
  max-width: calc(100% - 90px);
  min-height: 40px;
  line-height: 20px;
  font-size: 13px;
  word-break: break-all;
  border-radius: 4px;
  text-align: left;
  background-color: #fafafa;
}

.chatlist .chatin span:before {
  content: " ";
  position: absolute;
  top: 9px;
  right: 100%;
  border: 6px solid transparent;
  border-right-color: #fafafa;
}
</style>