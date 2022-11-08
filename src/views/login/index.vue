<template>
  <div class="login-container">
    <!-- <div id="particles-js">
      <vue-particles
        v-if="refreshParticles"
        color="#dedede"
        :particle-opacity="0.7"
        :particles-number="80"
        shape-type="circle"
        :particle-size="4"
        lines-color="#dedede"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="push"
      />
    </div> -->
    <div class="logo-new">
      <img src="../../assets/logo/newLogo.png">
    </div>
    <div class="version">V2.3</div>
    <div class="login-weaper animated bounceInDown">
      <!-- <div class="login-left">
        <div class="login-time" v-text="currentTime" />
        <img src="../../assets/logo/logo.png" alt="" class="img" />
        <p class="title" v-text="sysInfo.sys_app_name" />
      </div> -->
      <div class="login-border">
        <div class="login-main">
          <div class="login-title">用户登录</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <i class="el-icon-user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                size="mini"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip
              v-model="capsTooltip"
              content="Caps lock is On"
              placement="right"
              manual
            >
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  ref="password"
                  v-model="loginForm.password"
                  size="mini"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="
                      passwordType === 'password' ? 'eye' : 'eye-open'
                    "
                  />
                </span>
              </el-form-item>
            </el-tooltip>
            <el-form-item prop="code" style="width: 55%; float: left">
              <span class="svg-container">
                <svg-icon icon-class="validCode" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.code"
                size="mini"
                placeholder="验证码"
                name="username"
                type="text"
                tabindex="3"
                maxlength="5"
                autocomplete="off"
                style="width: 75%"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <div
              class="login-code"
              style="
                cursor: pointer;

                height: 48px;
                float: right;
                background-color: #f0f1f5;
                margin-right: 70px;
              "
            >
              <img
                style="
                  height: 48px;
                  width: 120px;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
                "
                :src="codeUrl"
                @click="getCode"
              >
            </div>

            <div class="login-button">
              <el-button
                :loading="loading"
                type="primary"
                style="width: 100%; padding: 12px 20px; margin-bottom: 30px"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      title="鉴权失败，请输入授权码"
      style="text-align: center;"
      :visible.sync="dialogTableVisible"
    >
      <div class="authentication">
        <el-input
          v-model="authCode"
          style="border: #000000 1px solid ;margin: 20px auto; width: 400px;"
          placeholder="请输入授权码"
          maxlength="40"
        />
      </div>
      <div>
        <div style="color: red; padding: 10px 0;">{{ msg }}</div>
        <el-button
          plain
          style="padding: 10px 20px;"
          @click="authCodeSave"
        >确定</el-button>
        <el-button
          plain
          style="padding: 10px 20px;"
          @click="dialogTableVisible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import moment from 'moment'
import axios from 'axios'
import { getOutBoundIP } from '@/api/box/sys-box'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  components: { },
  data() {
    return {
      authCode: '',
      msg: '',
      dialogTableVisible: false,
      codeUrl: '',
      cookiePassword: '',
      refreshParticles: true,
      loginForm: {
        // username: 'apeManWalking',
        username: '',
        // password: 'AW@123',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      currentTime: null,
      sysInfo: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    // window.addEventListener('storage', this.afterQRScan)
    this.getCurrentTime()
    this.getSystemSetting()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    window.addEventListener('resize', () => {
      this.refreshParticles = false
      this.$nextTick(() => (this.refreshParticles = true))
    })
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', () => {})
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: { // 授权码
    async authCodeSave() {
      if (this.authCode === '') {
        this.msg = '授权码不能为空'
        return
      }
      const ip = await getOutBoundIP()
      const url = ip.data
      if (ip.code === 200) {
        const res = await axios.post(`http://${url}:8880/api/v1/empower`, {
          key: this.authCode
        })
        if (res.data.msg === '授权码鉴权成功') {
          Message({
            message: res.data.msg,
            type: 'success'
          })
          this.dialogTableVisible = false
        } else {
          this.msg = res.data.msg
          this.authCode = ''
          // this.dialogTableVisible = false
        }
        // console.log(res)
        // this.msg = res.data.msg
        // this.$message.error(res.data.msg)
      }
    },
    getSystemSetting() {
      this.$store.dispatch('system/settingDetail').then(ret => {
        this.sysInfo = ret
        document.title = ret.sys_app_name
      })
    },
    getCurrentTime() {
      this.timer = setInterval(_ => {
        this.currentTime = moment().format('YYYY-MM-DD HH时mm分ss秒')
      }, 1000)
    },
    getCode() {
      getCodeImg().then(res => {
        if (res !== undefined) {
          this.codeUrl = res.data
          this.loginForm.uuid = res.id
        }
      })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        this.showDialog = true
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(res => {
              if (res.code === 6400) {
                this.dialogTableVisible = true
                // this.$message.error(res.data.msg)
                Message({
                  message: res.msg,
                  type: 'error'
                })
                this.msg = res.data.msg
              } else {
                this.$router
                  .push({ path: this.redirect || '/', query: this.otherQuery })
                  .catch(() => {})
              }
              // this.dialogTableVisible = true
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #fff;
$cursor: #000;
.logo-new {
  position: absolute;
  top: 46px;
  left: 60px;
  img {
    width: 247px;
    height: 70px;
  }
}
.version {
  color: #fff;
  position: absolute;
  font-size: 18px !important;
  top: 50px;
  left: 317px;
}
>>> .login-border[data-v-37dfd6fc] {
  // position: absolute;
  // top: 306px;
  // left: 867px;
  margin-left: 867px;
  margin-top: 306px;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.login-button {
  ::v-deep .el-button {
    background-color: #a388ff !important;
    width: 360px !important;
  }
}
.login-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url('../../assets/loginreset.png') no-repeat;
  background-color: #304175;
  position: relative;
  background-size: cover;
  height: 100vh;
  background-position: 50%;
}

#particles-js {
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}

.login-weaper {
  //margin:auto;
  margin-left: 643px;
  width: 1000px;
  -webkit-box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: rgba(64, 158, 255, 0);
  color: #fff;
  float: left;
  width: 50%;
  position: relative;
  min-height: 500px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  .login-time {
    position: absolute;
    left: 25px;
    top: 25px;
    width: 100%;
    color: #fff;
    opacity: 0.9;
    font-size: 18px;
    overflow: hidden;
    font-weight: 500;
  }
}

.login-left .img {
  width: 415px;
  height: 150px;
  border-radius: 3px;
}

.login-left .title {
  text-align: center;
  color: #000000;
  letter-spacing: 2px;
  font-size: 20px;
  font-weight: 600;
}

.login-border {
  position: absolute;
  top: 306px;
  left: 1300px;
  max-height: 468px;
  max-width: 450px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  // display: flex;
  border-left: none;
  // border-top-right-radius: 5px;
  border-radius: 8px;
  color: #fff;
  background-color: #ffffff;
  width: 50%;
  float: left;
  // position: absolute;
  // top: 306px;
  // left: 867px;
}

.login-main {
  // margin: 0 auto;
  // width: 65%;
  margin-left: 32px;
  width: 450px;
  height: 468px;
}

.login-title {
  color: #333;
  margin-left: 32px;
  margin-top: 60px;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 24px;
  // text-align: center;
  // letter-spacing: 4px;
  // width: 95px;
  // height: 24px;
  // overflow-wrap: break-word;
  // color: rgba(64, 69, 84, 1);
  // font-size: 24px;
  // font-weight: 400;
  // text-align: center;
  // white-space: nowrap;
  // line-height: 24px;
  // margin: 60px 0 0 33px;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  ::v-deep .el-input {
    display: inline-block;
    height: 32px;
    width: 200px;
    border-radius: 8px;
    background-color: transparent !important;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 30px;
      caret-color: #333;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
    width: 400px;
    border-radius: 5px;
    color: #454545;
  }
}
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
    .login-weaper {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      box-shadow: none;
    }
    .login-main {
      width: 80%;
    }
    .login-left {
      display: none !important;
    }
    .login-border {
      width: 100%;
    }
  }
}
</style>
