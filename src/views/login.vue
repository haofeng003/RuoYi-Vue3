<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">考勤管理系统</h3>
      <el-form-item prop="username">
        <el-input
            v-model="loginForm.username"
            auto-complete="off"
            placeholder="账号"
            size="large"
            type="text"
        >
          <template #prefix>
            <svg-icon class="el-input__icon input-icon" icon-class="user"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            auto-complete="off"
            placeholder="密码"
            size="large"
            type="password"
            @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon class="el-input__icon input-icon" icon-class="password"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captchaEnabled" prop="code">
        <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            size="large"
            style="width: 63%"
            @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon class="el-input__icon input-icon" icon-class="validCode"/>
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" class="login-code-img" @click="getCode"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            size="large"
            style="width:100%;"
            type="primary"
            @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div v-if="register" style="float: right;">
          <router-link :to="'/register'" class="link-type">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
    <span>
      <p>
        备案号:<a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2025139457号</a>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <span class="contact-span" @mouseleave="showImage = false" @mouseover="showImage = true">联系方式</span>
        <img v-if="showImage" alt="Contact Image" class="contact-image" src="@/assets/images/微信.jpg"/>
      </p>
    </span>
    </div>
  </div>
</template>

<script setup>
import {getCodeImg} from "@/api/login";
import Cookies from "js-cookie";
import {decrypt, encrypt} from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'
import {useRoute, useRouter} from "vue-router";
import {getIpAddress} from "@/utils/ip.js";

const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();

const loginForm = ref({
  username: "",
  password: "",
  ip: "",
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
  code: [{required: true, trigger: "change", message: "请输入验证码"}]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(false);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);
const showImage = ref(false);
watch(route, (newRoute) => {
  redirect.value = newRoute.query && newRoute.query.redirect;
}, {immediate: true});

async function handleLogin() {
  // 获取用户 IP 地址
  loginForm.value.ip = await getIpAddress();
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, {expires: 30});
        Cookies.set("password", encrypt(loginForm.value.password), {expires: 30});
        Cookies.set("rememberMe", loginForm.value.rememberMe, {expires: 30});
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        router.push({path: redirect.value || "/", query: otherQueryParams});
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCode();
getCookie();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.contact-span {
  position: relative;
  display: inline-block;
}

.contact-image {
  position: absolute;
  top: -220px; /* 根据需要调整，确保图片显示在文字上方 */
  left: 56%;
  transform: translateX(-50%);
  width: 170px;
  height: 230px;
  display: block;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
