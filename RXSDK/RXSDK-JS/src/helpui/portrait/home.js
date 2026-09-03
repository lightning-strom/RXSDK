import { wrapText, truncateText } from '../utils.js'
import { Layout, getRatioPx, getGlobalScreen } from '../../index.helpui.js'

function padArrayToMultipleOfThree(arr) {
  // 计算需要补足的元素数量
  const remainder = arr.length % 3
  const paddingCount = remainder === 0 ? 0 : 3 - remainder

  let lastRowStartIndex = Math.floor((arr.length / 3)) * 3

  if (lastRowStartIndex > arr.length - 1) {
    lastRowStartIndex -= 3
  }

  // 补足元素
  for (let i = 0; i < paddingCount; i++) {
    arr.push({
      isFill: true
    })
  }

  arr.forEach((item, i) => {
    item.hasNoLeft = (i + 1) % 3 === 1
    item.hasNoRight = (i + 1) % 3 === 0
    if (i >= lastRowStartIndex) {
      item.hasNoBottom = true
    }

    if ((i + 1) % 3 === 2) {
      item.hasNoLeft = true
      item.hasNoRight = true
      if (!item.isFill && arr[i + 1] && arr[i + 1].isFill) {
        item.hasNoRight = false
      }
    }
  })

  return arr
}

function padArrayToMultipleOfTwo(arr) {
  arr.forEach((item, i) => {
    item.hasNoLeft = (i + 1) % 2 === 1
    item.hasNoRight = true

    if (arr.length === 2 || i > 1) {
      item.hasNoBottom = true
    } else if (i > 1) {
      item.hasNoBottom = false
    }
  })

  return arr
}

export default function(classes = [], hot_questions = [], nickname, callback) {
  const wrapCategoryTitleTextView = (str) => {
    const _str = truncateText(str, 7)
    return wrapText(_str, getRatioPx(14)).map(item => (`
        <text value='${item}' class='questionCategoryText'></text>
  	`)).join('')
  }

  const wrapCategoryDescTextView = (str) => {
    const _str = truncateText(str, 8)
    return wrapText(_str, getRatioPx(12)).map(item => (`
        <text value='${item}' class='questionCategoryTextDesc'></text>
  	`)).join('')
  }

  const wrapCommonTextView = (str) => {
    return wrapText(str, getRatioPx(15), getGlobalScreen().screenWidth - getRatioPx(12 + 12 + 24 + 22 + 11)).map(item => (`
        <text value='${item}' class='commonItemText'></text>
  	`)).join('')
  }

  let questionDirectoryItem = (item) => {
    return `
				<image src='${item.icon_url}' class='questionDirectoryIcon' />
				<view class='questionDirectoryTitle'>
						${wrapCategoryTitleTextView(item.name)}
				</view>
				<view class='questionDirectoryDesc'>
						${wrapCategoryDescTextView(item.description)}
				</view>
		`
  }

  let questionDirectoryList = () => {
    if (classes.length === 1) {
      return `
				<view class='questionDirectoryItem questionDirectoryItemOne'>
					 ${questionDirectoryItem(classes[0])}
				</view>
		`
    } else if (classes.length === 2 || classes.length === 4) {
      return padArrayToMultipleOfTwo(classes).map((item, index) => {
        return `
				<view class='questionDirectoryItem questionDirectoryItemTow'>
					 ${questionDirectoryItem(item)}
					 ${item.hasNoBottom ? '' : '<view class="bottomLine"></view>'}
					 ${item.hasNoLeft ? '' : '<view class="leftLine"></view>'}
					 ${item.hasNoRight ? '' : '<view class="rightLine"></view>'}
				</view>
		`
      }).join('')
    } else {
      return padArrayToMultipleOfThree(classes).map((item, index) => {
        return `
				<view class='questionDirectoryItem'>
					 ${item.isFill ? '' : questionDirectoryItem(item)}
					 ${item.isFill || item.hasNoBottom ? '' : '<view class="bottomLine"></view>'}
					 ${item.isFill || item.hasNoLeft ? '' : '<view class="leftLine"></view>'}
					 ${item.isFill || item.hasNoRight ? '' : '<view class="rightLine"></view>'}
				</view>
		`
      }).join('')
    }
  }

  let hotImage = (index) => `<image src='https://oss.ruixueyun.com/sdk/help-image/hot_${index + 1}.png' class='hotImg' />`
  let numberText = (index) => `<view class='flexCenter'><text class='commonItemNumberText' value='${index + 1}'></text></view>`

  let commonList = hot_questions.map((item, index) => {
    return `
				<view class='commonItem'>
						<view class='commonItemTextContainer'>
							<view class='commonItemNumber'>
								${index <= 2 ? hotImage(index) : numberText(index)}
							</view>
            	<view class='commonItemTextWrapper'>
								${wrapCommonTextView(item.title)}
							</view>
						</view>
						${index === hot_questions.length - 1 ? '<view class="commonItemBorder commonItemBorderNoLine"></view>' : '<view class="commonItemBorder"></view>'}
				</view>
		`
  }).join('')

  const refreshImg = {
    light: 'refresh',
    dark: 'refresh_dark',
    vip: 'refresh_vip'
  }[getGlobalScreen().theme]

  const serviceBtn = {
    light: 'https://oss.ruixueyun.com/sdk/help-image/robot.png',
    dark: 'https://oss.ruixueyun.com/sdk/help-image/robot.png',
    vip: 'https://oss.ruixueyun.com/sdk/help-image/robot_vip.png'
  }[getGlobalScreen().theme]

  const serviceText = {
    light: '客服中心',
    dark: '客服中心',
    vip: '联系专属管家'
  }[getGlobalScreen().theme]

  const moreArrow = {
    light: 'https://oss.ruixueyun.com/sdk/help-image/arrow.png',
    dark: 'https://oss.ruixueyun.com/sdk/help-image/arrow.png',
    vip: 'https://oss.ruixueyun.com/sdk/help-image/arrow_vip.png'
  }[getGlobalScreen().theme]

  const serviceBtnContainer = {
    light: 'serviceBtnContainer',
    dark: 'serviceBtnContainer',
    vip: 'serviceBtnVipContainer'
  }[getGlobalScreen().theme]

  const footerContainer = `
			<view class='footerContainer'>
				<view class='backBtn' id='backGame'><text class='backBtnText' value='返回游戏'></text></view>
				${
    getGlobalScreen().useService ?
      `<view class='${serviceBtnContainer}' id='serviceBtn'><image src='${serviceBtn}' class='robotIcon' /><text class='robotText' value='${serviceText}'></text></view>`
      : ''
  }
			</view>
	`

  const homeTemplate = `
<view class='root'>
	<view class='headerContainer'>
			<view class='header'>
				<text class='headerTitle' value='客服中心'></text>
			</view>

			<view class='userInfoContainer'>
				<view class='userInfo'>
						<view class='avatar'>
								<image src='https://oss.ruixueyun.com/sdk/help-image/avatar.png' class='avatarImg' />
						</view>
						<text class='nickname' value='${truncateText(nickname, 15)}'></text>
						<image src='https://oss.ruixueyun.com/sdk/help-image/${refreshImg}.png' class='refreshImg' id='refreshBtn' />
				</view>
			</view>
	</view>
	<view class='container' id='main'>
			<scrollview class='scrollview' id='scrollviewElement' scrollY='true'>
				<view class='questionDirectory'>
					 <view class='categoryTitle'>
							<text class='title' value='问题目录'></text>
					 </view>
					 <view class='titleBottomLine'></view>
					 <view class='questionDirectoryList' id='scrollDirectory'>
									${questionDirectoryList()}
					 </view>
				</view>

				<view class='commonContainer'>
						<view class='commonContainerHeader'>
								<view class='commonTitle'>
									<view class='commonBlock'></view>
									<text class='title' value='常见问题'></text>
								</view>
								<view class='moreContainer' id='moreBtn'>
									<view>
										<view class='commonBlock'></view>
										<text class='moreText' value='更多'></text>
									</view>
									<image src='${moreArrow}' class='moreArrow' />
								</view>
						</view>
						<view class='commonList'>
								${commonList}
						</view>
				</view>
			</scrollview>
			${footerContainer}
	</view>
</view>
`

  function homeStyle(screenInfo) {
    const theme = {
      titleColor: {
        light: '#626466',
        dark: 'rgba(255, 255, 255, 0.8)',
        vip: '#626466'
      },
      headerTitleColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      },
      rootBackgroundColor: {
        light: '#DEF8FD',
        dark: '#162831',
        vip: '#F3F2EE'
      },
      nicknameColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      },
      commonListBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: 'rgba(255, 255, 255, 0.96)'
      },
      commonBorderBackgroundColor: {
        light: '#EAEAEA',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#EAEAEA'
      },
      commonItemNumberTextColor: {
        light: '#6F799B',
        dark: '#929DC1',
        vip: '#6F799B'
      },
      commonItemTextColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      },
      questionDirectoryListBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: 'rgba(255, 255, 255, 0.96)'
      },
      titleBottomLineBorderColor: {
        light: '#EAEAEA',
        dark: 'rgba(255, 255, 255, 0.05)',
        vip: '#EAEAEA'
      },
      questionCategoryTextColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#321000'
      },
      questionCategoryTextDescColor: {
        light: '#6F799B',
        dark: '#6F799B',
        vip: '#6F799B'
      },
      lineBorderColor: {
        light: '#EAEAEA',
        dark: 'rgba(255, 255, 255, 0.05)',
        vip: '#EAEAEA'
      },
      headerContainerBackgroundImage: {
        light: 'url(https://oss.ruixueyun.com/sdk/help-image/mask_light_1.png)',
        dark: 'url(https://oss.ruixueyun.com/sdk/help-image/mask_dark_1.png)',
        vip: 'url(https://oss.ruixueyun.com/sdk/help-image/mask_vip_1.png)'
      },
      userInfoBackgroundColor: {
        light: 'rgba(248, 251, 253, 0.7)',
        dark: 'rgba(42, 239, 226, 0.05)',
        vip: 'rgba(248, 251, 253, 0.7)'
      },
      backBtnText: {
        light: '#25AFA3',
        dark: '#25AFA3',
        vip: '#C87B1C'
      },
      backBtnBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
      },
      moreTextColor: {
        light: '#21AA9F',
        dark: '#21AA9F',
        vip: '#C87B1C'
      }
    }

    return ({
      root: {
        width: screenInfo.screenWidth,
        height: screenInfo.screenHeight,
        backgroundColor: theme.rootBackgroundColor[screenInfo.theme]
      },

      title: {
        fontSize: getRatioPx(16),
        color: theme.titleColor[screenInfo.theme],
        fontWeight: 'bold'
      },

      flexCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },

      scrollview: {
        height: screenInfo.screenHeight - getRatioPx(164 + 12 + 23 + 44)
      },

      headerContainer: {
        width: screenInfo.screenWidth,
        height: getRatioPx(164),
        backgroundImage: theme.headerContainerBackgroundImage[screenInfo.theme],
        paddingTop: getRatioPx(36)
      },

      header: {
        paddingTop: getRatioPx(8),
        marginBottom: getRatioPx(10),
        height: getRatioPx(30),
        width: screenInfo.screenWidth,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },

      headerTitle: {
        color: theme.headerTitleColor[screenInfo.theme],
        fontSize: getRatioPx(18),
        marginTop: getRatioPx(10)
      },

      logoContainer: {
        marginTop: getRatioPx(55),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },

      logoImg: {
        width: getRatioPx(97),
        height: getRatioPx(22)
      },

      container: {
        paddingLeft: getRatioPx(12),
        paddingRight: getRatioPx(12),
        paddingBottom: getRatioPx(23),
        width: screenInfo.screenWidth,
        height: screenInfo.screenHeight
      },

      mainContainer: {
        width: getRatioPx(375),
        marginRight: getRatioPx(12)
      },

      mainTop: {
        height: getRatioPx(52),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: getRatioPx(12),
        position: 'relative',
        borderTopLeftRadius: getRatioPx(4),
        borderTopRightRadius: getRatioPx(4)
      },

      mainTopBackgroundImg: {
        height: getRatioPx(52),
        width: getRatioPx(375),
        position: 'absolute',
        top: 0,
        left: 0
      },

      userInfoContainer: {
        height: getRatioPx(56),
        paddingTop: getRatioPx(20),
        paddingLeft: getRatioPx(12),
        paddingRight: getRatioPx(12)
      },

      userInfo: {
        height: getRatioPx(56),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.userInfoBackgroundColor[screenInfo.theme],
        borderRadius: getRatioPx(6),
        paddingLeft: getRatioPx(12),
        paddingRight: getRatioPx(12)
      },

      avatar: {
        width: getRatioPx(42),
        height: getRatioPx(42),
        borderRadius: getRatioPx(21),
        backgroundColor: '#fff',
        padding: getRatioPx(2),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      },

      avatarImg: {
        width: getRatioPx(40),
        height: getRatioPx(40),
        borderRadius: getRatioPx(20)
      },

      refreshImg: {
        width: getRatioPx(16),
        height: getRatioPx(16)
      },

      nickname: {
        color: theme.nicknameColor[screenInfo.theme],
        marginTop: getRatioPx(2),
        marginLeft: getRatioPx(8),
        marginRight: getRatioPx(8),
        fontSize: getRatioPx(16)
      },

      commonContainer: {},

      commonContainerHeader: {
        height: getRatioPx(40),
        paddingTop: getRatioPx(16),
        paddingBottom: getRatioPx(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      },

      moreContainer: {
        flexDirection: 'row',
        alignItems: 'center'
      },

      commonBlock: {
        height: getRatioPx(2.2)
      },

      moreText: {
        fontSize: getRatioPx(12),
        color: theme.moreTextColor[screenInfo.theme]
      },

      moreArrow: {
        width: getRatioPx(6.86),
        height: getRatioPx(12),
        marginTop: screenInfo.platform === 'douyin' ? getRatioPx(2) : getRatioPx(1)
      },

      commonList: {
        borderRadius: getRatioPx(4),
        backgroundColor: theme.commonListBackgroundColor[screenInfo.theme]
      },

      commonItem: {
        paddingTop: getRatioPx(8)
      },

      commonItemBorder: {
        height: getRatioPx(1),
        backgroundColor: theme.commonBorderBackgroundColor[screenInfo.theme],
        marginTop: getRatioPx(7)
      },

      commonItemBorderNoLine: {
        backgroundColor: 'transparent'
      },

      commonItemTextContainer: {
        flexDirection: 'row',
        paddingLeft: getRatioPx(12),
        paddingRight: getRatioPx(12)
      },

      commonItemNumber: {
        width: getRatioPx(22)
      },

      commonItemNumberText: {
        color: theme.commonItemNumberTextColor[screenInfo.theme],
        fontSize: getRatioPx(14),
        marginTop: getRatioPx(6.5)
      },

      hotImg: {
        width: getRatioPx(22),
        height: getRatioPx(22)
      },

      commonItemText: {
        fontSize: getRatioPx(15),
        color: theme.commonItemTextColor[screenInfo.theme],
        marginBottom: getRatioPx(5)
      },

      commonItemTextWrapper: {
        marginTop: getRatioPx(7),
        marginLeft: getRatioPx(11)
      },

      questionDirectory: {
        padding: 0
      },

      categoryTitle: {
        height: getRatioPx(30),
        paddingBottom: getRatioPx(5),
        paddingTop: getRatioPx(5),
        paddingLeft: 0
      },

      questionDirectoryList: {
        padding: 0,
        borderRadius: getRatioPx(4),
        backgroundColor: theme.questionDirectoryListBackgroundColor[screenInfo.theme],
        flexDirection: 'row',
        flexWrap: 'wrap'
      },

      questionDirectoryItem: {
        height: getRatioPx(126),
        width: Math.floor(getRatioPx((375 - 12 * 2) / 3)),
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      },

      questionDirectoryItemOne: {
        height: getRatioPx(150),
        width: Math.floor(getRatioPx(375 - 12 * 2)),
        paddingBottom: getRatioPx(20),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      },

      questionDirectoryItemTow: {
        height: getRatioPx(126),
        width: Math.floor(getRatioPx((375 - 12 * 2) / 2)),
        paddingBottom: getRatioPx(20),
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      },

      questionDirectoryIcon: {
        paddingTop: getRatioPx(4),
        width: getRatioPx(60),
        height: getRatioPx(60)
      },

      questionDirectoryTitle: {
        paddingTop: getRatioPx(4),
        paddingBottom: getRatioPx(4)
      },

      titleBottomLine: {
        borderWidth: getRatioPx(0.25),
        borderColor: theme.titleBottomLineBorderColor[screenInfo.theme],
        width: getRatioPx(375)
      },

      questionDirectoryDesc: {
        paddingTop: getRatioPx(4),
        paddingBottom: getRatioPx(4)
      },

      questionCategoryText: {
        fontSize: getRatioPx(14),
        color: theme.questionCategoryTextColor[screenInfo.theme]
      },

      questionCategoryTextDesc: {
        fontSize: getRatioPx(12),
        color: theme.questionCategoryTextDescColor[screenInfo.theme]
      },

      topLine: {
        borderWidth: getRatioPx(0.25),
        borderColor: theme.lineBorderColor[screenInfo.theme],
        position: 'absolute',
        top: 0,
        left: 0,
        height: 0,
        width: getRatioPx(375 / 3)
      },

      bottomLine: {
        borderWidth: getRatioPx(0.25),
        borderColor: theme.lineBorderColor[screenInfo.theme],
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 0,
        width: '100%'
      },

      rightLine: {
        borderWidth: getRatioPx(0.25),
        borderColor: theme.lineBorderColor[screenInfo.theme],
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: getRatioPx(255 / 2)
      },

      leftLine: {
        borderWidth: getRatioPx(0.25),
        borderColor: theme.lineBorderColor[screenInfo.theme],
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: getRatioPx(255 / 2)
      },

      footerContainer: {
        marginTop: getRatioPx(12),
        flexDirection: 'row',
        alignItems: 'center',
        height: getRatioPx(44)
      },

      serviceBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#18998F',
        borderRadius: getRatioPx(4),
        height: getRatioPx(44),
        marginLeft: getRatioPx(10),
        width: getRatioPx(252)
      },

      serviceBtnVipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://oss.ruixueyun.com/sdk/help-image/vip_service.png)',
        borderRadius: getRatioPx(4),
        height: getRatioPx(44),
        marginLeft: getRatioPx(10),
        width: getRatioPx(252)
      },

      robotIcon: {
        height: getRatioPx(30),
        width: getRatioPx(34),
        marginRight: getRatioPx(8)
      },

      robotText: {
        color: '#fff',
        fontSize: getRatioPx(16)
      },

      backBtn: {
        flex: 1,
        backgroundColor: theme.backBtnBackgroundColor[screenInfo.theme],
        height: getRatioPx(44),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getRatioPx(4)
      },

      backBtnText: {
        color: theme.backBtnText[screenInfo.theme],
        fontSize: getRatioPx(16)
      }
    })
  }

  function watch() {
    const list = Layout.getElementsByClassName('questionDirectoryItem')
    const moreBtn = Layout.getElementById('moreBtn')
    const serviceBtn = Layout.getElementById('serviceBtn')
    const backGameBtn = Layout.getElementById('backGame')
    const refreshBtn = Layout.getElementById('refreshBtn')
    const commonList = Layout.getElementsByClassName('commonItem')
    const scrollviewElement = Layout.getElementById('scrollviewElement')
    Layout.ticker.next(() => {
      scrollviewElement.vertivalScrollbar.hide()
    })

    list.forEach((item, index) => {
      item.on('click', () => {
        callback('category', classes[index])
      })
    })


    commonList.forEach((item, index) => {
      item.on('click', () => {
        callback('question', hot_questions[index])
      })
    })

    moreBtn.on('click', () => {
      callback('more')
    })

    backGameBtn.on('click', () => {
      callback('backGame')
    })

    serviceBtn.on('click', () => {
      callback('service')
    })

    refreshBtn.on('click', () => {
      callback('refresh')
    })
  }

  return {
    homeTemplate,
    homeStyle,
    watch
  }
}
