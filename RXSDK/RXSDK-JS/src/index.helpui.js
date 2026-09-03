import engineLayout from './helpui/engine.js'
import getHomeLandscapePage from './helpui/landscape/home.js'
import getCategoryLandscapePage from './helpui/landscape/category.js'
import getQuestionLandscapePage from './helpui/landscape/question.js'
import getHomePortraitPage from './helpui/portrait/home.js'
import getCategoryPortraitPage from './helpui/portrait/category.js'
import getQuestionPortraitPage from './helpui/portrait/question.js'

export const __env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan
export const sharedCanvas = __env.createCanvas()
export const sharedContext = sharedCanvas.getContext('2d')
export const Layout = engineLayout

const globalInfo = {
  init: false,
  activated: false,
  screenX: 0,
  screenY: 0,
  screenHeight: 0,
  screenWidth: 0,
  sdk: null,
  platform: 'wechat',
  nickname: '游客',
  theme: 'light',
  landscape: false,
  useService: false,
  gl: null,
  timerId: null,
  textureObject: null,
  textureId: null,
  handleClickService() {
    console.log(globalInfo.platform)
    if (globalInfo.platform === 'wechat') {
      globalInfo.sdk._openCustomerServiceConversation({
        complete(res) {
          console.log('_openCustomerServiceConversation', res)
          if (res.code !== 0) {
            __env.showModal({
              title: '错误提示',
              content: res.msg,
              confirmText: '我知道了',
              showCancel: false
            })
          }
        }
      }, globalInfo.serviceParams)
    } else if (globalInfo.platform === 'douyin') {
      globalInfo.sdk.openCustomService(globalInfo.serviceParams, {
        complete(res) {
          console.log('_openCustomerServiceConversation', res)
          if (res.code !== 0) {
            __env.showModal({
              title: '错误提示',
              content: res.msg,
              confirmText: '我知道了',
              showCancel: false
            })
          }
        }
      })
    }
  },
  handleClickBackGame: null
}

function updateViewPort() {
  Layout.updateViewPort({
    x: globalInfo.screenX,
    y: globalInfo.screenY,
    width: globalInfo.screenWidth,
    height: globalInfo.screenHeight
  })
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    globalInfo.sdk._getInfo({
      complete(res) {
        if (res.code === 0 && [2, 3].includes(res.data.r_mode)) {
          globalInfo.theme = 'vip'
          resolve(res)
        } else {
          reject(res)
        }
      }
    })
  })
}

async function drawHome() {
  try {
    if (globalInfo.openid) {
      await getUserInfo()
    }
  } catch (e) {
    console.log(e)
  }
  globalInfo.sdk.getHelpcenterMainLayout({
    complete(res) {
      console.log(res)
      if (res.code === 0) {
        const classes = res.data.classes || []
        const hot_questions = res.data.hot_questions || []
        updateViewPort()
        Layout.clear()
        const getHomePage = globalInfo.landscape ? getHomeLandscapePage : getHomePortraitPage
        const {
          homeTemplate, homeStyle, watch
        } = getHomePage(classes, hot_questions, globalInfo.nickname, (type, data) => {
          if (!globalInfo.activated) {
            return
          }
          if (type === 'backGame' && typeof globalInfo.handleClickBackGame === 'function') {
            globalInfo.handleClickBackGame()
            globalInfo.activated = false
          } else if (type === 'service') {
            globalInfo.handleClickService()
          } else if (type === 'refresh') {
            drawHome()
          } else if (type === 'more') {
            drawCategory(classes[0].id)
          } else if (type === 'category') {
            drawCategory(data.id)
          } else {
            drawQuestion(data.id)
          }
        })
        Layout.init(homeTemplate, homeStyle(globalInfo))
        Layout.layout(sharedContext)
        watch()
      }
    }
  })
}

async function drawCategory(id) {
  globalInfo.sdk.getHelpcenterMainLayout({
    complete(res) {
      if (res.code === 0) {
        globalInfo.sdk.getHelpcenterQuestionLayout({ id }, {
          complete(list_res) {
            if (list_res.code === 0) {
              const classes = res.data.classes || []
              const questions = list_res.data.questions || []
              updateViewPort()
              Layout.clear()
              const getCategoryPage = globalInfo.landscape ? getCategoryLandscapePage : getCategoryPortraitPage
              const {
                categoryTemplate, categoryStyle, watch
              } = getCategoryPage(classes, questions, id, (type, data) => {
                if (!globalInfo.activated) {
                  return
                }
                if (type === 'backGame' && typeof globalInfo.handleClickBackGame === 'function') {
                  globalInfo.handleClickBackGame()
                  globalInfo.activated = false
                } else if (type === 'back') {
                  drawHome()
                } else if (type === 'category') {
                  drawCategory(data.id)
                } else {
                  drawQuestion(data.id, id)
                }
              })
              Layout.init(categoryTemplate, categoryStyle(globalInfo))
              Layout.layout(sharedContext)
              watch()
            }
          }
        })
      }
    }
  })
}

async function drawQuestion(id, from_id, resolved = false) {
  globalInfo.sdk.getHelpcenterMainLayout({
    complete(res) {
      if (res.code === 0) {
        globalInfo.sdk.getHelpcenterInfoLayout({ id }, {
          complete(option_res) {
            if (option_res.code === 0) {
              const info = option_res.data.info
              updateViewPort()
              Layout.clear()
              const getQuestionPage = globalInfo.landscape ? getQuestionLandscapePage : getQuestionPortraitPage
              const {
                questionTemplate, questionStyle, watch
              } = getQuestionPage(info, resolved, (type) => {
                if (!globalInfo.activated) {
                  return
                }
                if (type === 'backGame' && typeof globalInfo.handleClickBackGame === 'function') {
                  globalInfo.handleClickBackGame()
                  globalInfo.activated = false
                } else if (type === 'resolved' || type === 'unresolved') {
                  globalInfo.sdk.helpcenterResolution({
                    id, status: type === 'resolved'
                  }, {
                    complete(resolutionRes) {
                      console.log(resolutionRes)
                      drawQuestion(id, from_id, true)
                    }
                  })
                } else if (type === 'back') {
                  if (from_id) {
                    drawCategory(from_id)
                  } else {
                    drawHome()
                  }
                } else {
                  drawHome()
                }
              })
              Layout.init(questionTemplate, questionStyle(globalInfo))
              Layout.layout(sharedContext)
              watch()
            }
          }
        })
      }
    }
  })
}

function hookUI() {
  if (!globalInfo.textureObject) {
    // 创建纹理
    globalInfo.textureObject = globalInfo.gl.createTexture();
    globalInfo.gl.bindTexture(globalInfo.gl.TEXTURE_2D, globalInfo.textureObject);
    // 设置纹理参数
    globalInfo.gl.texParameteri(globalInfo.gl.TEXTURE_2D, globalInfo.gl.TEXTURE_WRAP_S, globalInfo.gl.CLAMP_TO_EDGE);
    globalInfo.gl.texParameteri(globalInfo.gl.TEXTURE_2D, globalInfo.gl.TEXTURE_WRAP_T, globalInfo.gl.CLAMP_TO_EDGE);
    globalInfo.gl.texParameteri(globalInfo.gl.TEXTURE_2D, globalInfo.gl.TEXTURE_MIN_FILTER, globalInfo.gl.NEAREST);
    globalInfo.gl.texParameteri(globalInfo.gl.TEXTURE_2D, globalInfo.gl.TEXTURE_MAG_FILTER, globalInfo.gl.NEAREST);
  } else {
    globalInfo.gl.bindTexture(globalInfo.gl.TEXTURE_2D, globalInfo.textureObject);
  }
  // 将 2D Canvas 作为纹理加载
  globalInfo.gl.texImage2D(globalInfo.gl.TEXTURE_2D, 0, globalInfo.gl.RGBA, globalInfo.gl.RGBA, globalInfo.gl.UNSIGNED_BYTE, sharedCanvas);

  // 清除颜色缓冲区
  globalInfo.gl.clearColor(0, 0, 0, 1);
  globalInfo.gl.clear(globalInfo.gl.COLOR_BUFFER_BIT);

  // 绘制三角形
  globalInfo.gl.drawArrays(globalInfo.gl.TRIANGLES, 0, 6);

  globalInfo.timerId = requestAnimationFrame(hookUI);
}

function stopLastRendererLoop() {
  if (typeof globalInfo.timerId != null) {
    cancelAnimationFrame(globalInfo.timerId);
  }
}

function startHookUI() {
  stopLastRendererLoop();
  hookUI();
}

function stopHookUI() {
  stopLastRendererLoop();
  globalInfo.gl.deleteTexture(globalInfo.textureObject);
  globalInfo.textureObject = null;
}

export function init({
                       sdk,
                       gl,
                       platform,
                       theme,
                       nickname,
                       openid,
                       landscape,
                       useService,
                       screenWidth,
                       screenHeight,
                       pixelRatio,
                       serviceParams,
                       handleClickService,
                       handleClickBackGame
                     }) {
  let systemInfo = {}
  switch (platform) {
    case 'wechat':
      systemInfo = __env.getWindowInfo()
      break
    case 'douyin':
      systemInfo = __env.getSystemInfoSync()
  }
  const {
    screenWidth: __screenWidth,
    screenHeight: __screenHeight,
    pixelRatio: __pixelRatio
  } = systemInfo

  if (!globalInfo.init) {
    const dpr = (pixelRatio || __pixelRatio) || 1
    sharedCanvas.width = (screenWidth || __screenWidth) * dpr
    sharedCanvas.height = (screenHeight || __screenHeight) * dpr
    sharedContext.imageSmoothingEnabled = true
    sharedContext.scale(dpr, dpr)
  }
  globalInfo.init = true
  globalInfo.activated = true
  globalInfo.screenWidth = (screenWidth || __screenWidth)
  globalInfo.screenHeight = (screenHeight || __screenHeight)
  globalInfo.sdk = sdk
  globalInfo.platform = platform
  globalInfo.nickname = nickname || '游客'
  globalInfo.useService = useService || false
  console.info('globalInfo', globalInfo)
  if (openid) {
    globalInfo.openid = openid
  }
  if (landscape) {
    globalInfo.landscape = landscape
  } else {
    try {
      globalInfo.landscape = __env.getSystemSetting().deviceOrientation === 'landscape'
    } catch (e) {
      globalInfo.landscape = globalInfo.screenWidth > globalInfo.screenHeight
    }
  }
  if (theme) {
    globalInfo.theme = theme
  }
  if (handleClickService) {
    globalInfo.handleClickService = handleClickService
  }
  if (handleClickBackGame) {
    globalInfo.handleClickBackGame = handleClickBackGame
  }
  if (serviceParams) {
    globalInfo.serviceParams = serviceParams
  }

  if (gl) {
    globalInfo.gl = gl
    startHookUI();
  }
  updateViewPort()
  drawHome()
}

export function getRatioPx(px) {
  return px * (globalInfo.screenWidth / (globalInfo.landscape ? 812 : 375))
}

export function getGlobalScreen() {
  return globalInfo
}
