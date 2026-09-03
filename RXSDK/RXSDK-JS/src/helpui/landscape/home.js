import { wrapText, truncateText } from '../utils.js'
import { Layout, getRatioPx, getGlobalScreen, __env } from '../../index.helpui.js'

function padArrayToMultipleOfThree(arr) {
  // 计算需要补足的元素数量
  const remainder = arr.length % 3
  const paddingCount = remainder === 0 ? 0 : 3 - remainder

  // 补足元素
  for (let i = 0; i < paddingCount; i++) {
    arr.push({
      isFill: true
    })
  }

  arr.forEach((item, i) => {
    item.hasNoLeft = (i + 1) % 3 === 1
    item.hasNoRight = (i + 1) % 3 === 0

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
  })

  return arr
}

export default function(classes = [], hot_questions = [], nickname, callback) {
  const paddingX = 51
  const wrapCategoryTitleTextView = (str) => {
    const _str = truncateText(str, 7)
    return wrapText(_str, getRatioPx(14)).map(item => (`
        <text value='${item}' class='questionCategoryText'></text>
  	`)).join('')
  }

  const wrapCategoryDescTextView = (str) => {
    const _str = truncateText(str, 9)
    return wrapText(_str, getRatioPx(12)).map(item => (`
        <text value='${item}' class='questionCategoryTextDesc'></text>
  	`)).join('')
  }

  const wrapCommonTextView = (str) => {
    return wrapText(str, getRatioPx(15), getGlobalScreen().screenWidth - getRatioPx(375 + 12 + paddingX * 2 + 24 + 22 + 11)).map(item => (`
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
						<view class='commonItemBorder'></view>
				</view>
		`
  }).join('')

  const headerContainerBackgroundImage = {
    light: 'https://oss.ruixueyun.com/sdk/help-image/mask_light_2.png',
    dark: 'https://oss.ruixueyun.com/sdk/help-image/mask_dark_2.png',
    vip: 'https://oss.ruixueyun.com/sdk/help-image/mask_vip_2.png'
  }[getGlobalScreen().theme]

  const refreshImg = {
    light: 'refresh',
    dark: 'refresh_dark',
    vip: 'refresh_vip'
  }[getGlobalScreen().theme]

  const backGameImg = {
    light: 'https://oss.ruixueyun.com/sdk/help-image/back_icon.png',
    dark: 'https://oss.ruixueyun.com/sdk/help-image/back_icon.png',
    vip: 'https://oss.ruixueyun.com/sdk/help-image/back_icon_vip.png'
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
    light: 'serviceContainer',
    dark: 'serviceContainer',
    vip: 'serviceVipContainer'
  }[getGlobalScreen().theme]

  const emptyContainer1 = `
		<view class='emptyContainer1'>
					<image src='https://oss.ruixueyun.com/sdk/help-image/noData.png' class='noData' />
			    <text class='noDataText' value='暂无问题目录'></text>
		</view>
	`

  const emptyContainer2 = `
		<view class='emptyContainer2'>
					<image src='https://oss.ruixueyun.com/sdk/help-image/noData.png' class='noData' />
			    <text class='noDataText' value='暂无常见目录'></text>
		</view>
	`

  const homeTemplate = `
<view class='container' id='main'>
    <view class='mainContainer'>
        <view class='mainTop'>
						<image src='${headerContainerBackgroundImage}' class='mainTopBackgroundImg' />
        		<view class='avatar'>
							<image src='https://oss.ruixueyun.com/sdk/help-image/avatar.png' class='avatarImg' />
							<view class='refresh' id='refreshBtn'>
								<image src='https://oss.ruixueyun.com/sdk/help-image/${refreshImg}.png' class='refreshImg' />
							</view>
						</view>
						<view class='nicknameContainer'>
            	<text class='nickname' value='${truncateText(nickname, 15)}'></text>
						</view>
        </view>

        <view class='mainBottom'>
          <view class='questionDirectory'>
          	<view class='categoryTitle'>
            	<text class='title' value='问题目录'></text>
						</view>
            <view class='titleBottomLine'></view>

            <scrollview class='questionDirectoryList' id='scrollDirectory' scrollY='true'>
               ${classes.length ? questionDirectoryList() : emptyContainer1}
            </scrollview>
          </view>
        </view>
    </view>

    <view class='rightAside'>
				<view class='rightAsideHeader'>
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
        		<view class='commonBorder'></view>
        </view>
        <scrollview class='commonList' id='scrollCommon' scrollY='true'>
             ${hot_questions.length ? commonList : emptyContainer2}
				</scrollview>
				${
    getGlobalScreen().useService ?
      `<view class='${serviceBtnContainer}' id='serviceBtn'><image src='${serviceBtn}' class='serviceIcon' /><text class='serviceText' value='${serviceText}'></text></view>`
      : ''
  }
    </view>

		<view class='backGame' id='backGame'>
				<image src='${backGameImg}' class='backGameIcon' />
        <text class='backGameText' value='返回游戏'></text>
		</view>
</view>
`

  function homeStyle(screenInfo) {
    const buttonRect = __env.getMenuButtonBoundingClientRect()

    const theme = {
      titleColor: {
        light: '#626466',
        dark: 'rgba(255, 255, 255, 0.8)',
        vip: '#626466'
      },
      containerBackgroundColor: {
        light: '#DEF8FD',
        dark: '#162831',
        vip: '#F3F2EE'
      },
      nicknameColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      },
      rightAsideHeaderBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
      },
      moreArrowBackgroundColor: {
        light: 'transparent',
        dark: 'transparent',
        vip: '#fff'
      },
      commonListBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
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
      categoryTitleBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
      },
      questionDirectoryListBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
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
        dark: 'rgba(255, 255, 255, 0.7)',
        vip: '#6F799B'
      },
      lineBorderColor: {
        light: '#EAEAEA',
        dark: 'rgba(255, 255, 255, 0.05)',
        vip: '#EAEAEA'
      },
      moreTextColor: {
        light: '#21AA9F',
        dark: '#21AA9F',
        vip: '#C87B1C'
      },
      noDataColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      }
    }

    return ({
      emptyContainer1: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: getRatioPx(20),
        width: getRatioPx(375)
      },

      emptyContainer2: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: getRatioPx(30)
      },

      noData: {
        width: getRatioPx(200),
        height: getRatioPx(140)
      },

      noDataText: {
        fontSize: getRatioPx(12),
        lineHeight: getRatioPx(16),
        paddingBottom: getRatioPx(10),
        color: theme.noDataColor[screenInfo.theme]
      },

      title: {
        fontSize: getRatioPx(14),
        color: theme.titleColor[screenInfo.theme]
      },

      flexCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },

      container: {
        paddingLeft: getRatioPx(paddingX),
        paddingRight: getRatioPx(paddingX),
        paddingTop: getRatioPx(12),
        paddingBottom: getRatioPx(12),
        width: screenInfo.screenWidth,
        height: screenInfo.screenHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.containerBackgroundColor[screenInfo.theme]
      },

      backGame: {
        position: 'absolute',
        top: getRatioPx(6),
        left: getRatioPx(paddingX - 6),
        width: getRatioPx(112),
        height: getRatioPx(44),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getRatioPx(4),
        backgroundColor: '#fff'
      },

      backGameIcon: {
        width: getRatioPx(36),
        height: getRatioPx(36)
      },

      backGameText: {
        color: '#313233',
        marginLeft: getRatioPx(2),
        fontSize: getRatioPx(13),
        marginTop: getRatioPx(13 / 4)
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

      avatar: {
        width: getRatioPx(32),
        height: getRatioPx(32),
        borderRadius: getRatioPx(16),
        backgroundColor: '#fff',
        padding: getRatioPx(2),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      },

      avatarImg: {
        width: getRatioPx(30),
        height: getRatioPx(30),
        borderRadius: getRatioPx(15)
      },

      refresh: {
        width: getRatioPx(14),
        height: getRatioPx(14),
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderRadius: getRatioPx(7)
      },

      refreshImg: {
        width: getRatioPx(14),
        height: getRatioPx(14)
      },

      nicknameContainer: {
        fontSize: getRatioPx(16),
        color: '#626466'
      },

      nickname: {
        color: theme.nicknameColor[screenInfo.theme],
        marginLeft: getRatioPx(8),
        fontSize: getRatioPx(12),
        marginTop: getRatioPx(6)
      },

      rightAside: {
        flex: 1,
        borderRadius: getRatioPx(4)
      },

      rightAsideHeader: {
        borderTopLeftRadius: getRatioPx(4),
        borderTopRightRadius: getRatioPx(4),
        backgroundColor: theme.rightAsideHeaderBackgroundColor[screenInfo.theme],
        height: getRatioPx(40),
        padding: getRatioPx(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      },

      moreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: screenInfo.screenWidth - buttonRect.left - getRatioPx(paddingX * 2) + getRatioPx(12 * 2 + 6.86 + 9.14) + (screenInfo.platform === 'douyin' ? getRatioPx(40) : 0)
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
        paddingLeft: getRatioPx(9.14),
        marginTop: screenInfo.platform === 'douyin' ? getRatioPx(2) : getRatioPx(1)
      },

      commonList: {
        backgroundColor: theme.commonListBackgroundColor[screenInfo.theme],
        height: screenInfo.screenHeight - (screenInfo.useService ? getRatioPx(24 + 40 + 44 + 12) : getRatioPx(24 + 40)),
        borderBottomLeftRadius: getRatioPx(4),
        borderBottomRightRadius: getRatioPx(4)
      },

      commonItem: {
        paddingTop: getRatioPx(8)
      },

      commonBorder: {
        height: getRatioPx(1),
        width: getGlobalScreen().screenWidth - getRatioPx(375 + 12 + paddingX * 2),
        backgroundColor: theme.commonBorderBackgroundColor[screenInfo.theme],
        position: 'absolute',
        bottom: 0,
        left: 0
      },

      commonItemBorder: {
        height: getRatioPx(1),
        backgroundColor: theme.commonBorderBackgroundColor[screenInfo.theme],
        marginTop: getRatioPx(7)
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

      serviceContainer: {
        height: getRatioPx(44),
        marginTop: getRatioPx(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#18998F',
        borderRadius: getRatioPx(4)
      },

      serviceVipContainer: {
        height: getRatioPx(44),
        marginTop: getRatioPx(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://oss.ruixueyun.com/sdk/help-image/vip_service.png)',
        borderRadius: getRatioPx(4)
      },

      serviceIcon: {
        width: getRatioPx(34),
        height: getRatioPx(30),
        marginRight: getRatioPx(8)
      },

      serviceText: {
        color: '#fff',
        fontSize: getRatioPx(16),
        marginTop: getRatioPx(2)
      },

      mainBottom: {},

      questionDirectory: {
        padding: 0
      },

      categoryTitle: {
        height: getRatioPx(40),
        padding: getRatioPx(16),
        backgroundColor: theme.categoryTitleBackgroundColor[screenInfo.theme]
      },

      questionDirectoryList: {
        height: screenInfo.screenHeight - getRatioPx(116),
        padding: 0,
        borderBottomLeftRadius: getRatioPx(4),
        borderBottomRightRadius: getRatioPx(4),
        backgroundColor: theme.questionDirectoryListBackgroundColor[screenInfo.theme],
        flexDirection: 'row',
        flexWrap: 'wrap'
      },

      questionDirectoryItem: {
        height: getRatioPx(255 / 2),
        width: Math.floor(getRatioPx(375 / 3)),
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      },

      questionDirectoryItemOne: {
        height: getRatioPx(150),
        width: Math.floor(getRatioPx(375)),
        paddingBottom: getRatioPx(20),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      },

      questionDirectoryItemTow: {
        height: getRatioPx(126),
        width: Math.floor(getRatioPx((375) / 2)),
        paddingBottom: getRatioPx(20),
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      },

      questionDirectoryIcon: {
        width: getRatioPx(60),
        height: getRatioPx(60)
      },

      questionDirectoryTitle: {
        paddingTop: getRatioPx(10),
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
      }
    })
  }

  function watch() {
    const list = Layout.getElementsByClassName('questionDirectoryItem')
    const moreBtn = Layout.getElementById('moreBtn')
    const serviceBtn = Layout.getElementById('serviceBtn')
    const backGameBtn = Layout.getElementById('backGame')
    const refreshBtn = Layout.getElementById('refreshBtn')
    const scrollDirectory = Layout.getElementById('scrollDirectory')
    const scrollCommon = Layout.getElementById('scrollCommon')

    Layout.ticker.next(() => {
      scrollDirectory.vertivalScrollbar.hide()
      scrollCommon.vertivalScrollbar.hide()
    })

    list.forEach((item, index) => {
      item.on('click', () => {
        callback('category', classes[index])
      })
    })

    const commonList = Layout.getElementsByClassName('commonItem')

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
