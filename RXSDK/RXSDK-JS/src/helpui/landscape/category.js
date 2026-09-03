import { Layout, getRatioPx, getGlobalScreen, __env } from '../../index.helpui.js'
import { truncateText, wrapText } from '../utils'

export default function(classes = [], questions = [], currentId, callback) {
  const paddingX = 51
  const index = classes.findIndex(item => item.id === currentId)
  const categoryList = classes.map((item, index) => {
    return `
				<view class='${item.id === currentId ? 'categoryItemActive categoryItem' : 'categoryItem'} ${index < classes.length - 1 ? 'categoryItemMargin' : ''}'>
						<image src='${item.icon_url}' class='iconImage' />
				</view>
		`
  }).join('')

  const wrapCommonTextView = (str) => {
    return wrapText(str, getRatioPx(15), getGlobalScreen().screenWidth - getRatioPx(paddingX * 2 + 24 + 22 + 24)).map(item => (`
        <text value='${item}' class='questionItemText'></text>
  	`)).join('')
  }

  let numberText = (index) => `<view class='flexCenter'><text class='commonItemNumberText' value='${index + 1}'></text></view>`

  let questionList = questions.map((item, index) => {
    return `
				<view class='questionItem'>
						<view class='questionItemBorder'></view>
						<view class='questionItemTextContainer'>
							<view class='questionItemNumber'>
								${numberText(index)}
							</view>
            	<view class='questionItemTextWrapper'>
								${wrapCommonTextView(item.title)}
							</view>
						</view>
				</view>
		`
  }).join('')

  const backBtnImg = {
    light: 'https://oss.ruixueyun.com/sdk/help-image/back.png',
    dark: 'https://oss.ruixueyun.com/sdk/help-image/back_dark.png',
    vip: 'https://oss.ruixueyun.com/sdk/help-image/back.png'
  }[getGlobalScreen().theme]

  const backGameImg = {
    light: 'https://oss.ruixueyun.com/sdk/help-image/back_icon.png',
    dark: 'https://oss.ruixueyun.com/sdk/help-image/back_icon.png',
    vip: 'https://oss.ruixueyun.com/sdk/help-image/back_icon_vip.png'
  }[getGlobalScreen().theme]

  const emptyContainer = `
		<view class='emptyContainer'>
					<image src='https://oss.ruixueyun.com/sdk/help-image/noData.png' class='noData' />
			    <text class='noDataText' value='暂无问题'></text>
		</view>
	`

  const categoryTemplate = `
<view class='container'>
	<view class='header'>
    <text class='headerTitle' value='问题目录'></text>
		<view class='btnGroup'>
			<view class='btnGroupItem' id='backBtn'>
					<image src='${backBtnImg}' class='backImg' />
			</view>
		</view>
	</view>
	<view class='paddingBlock'></view>
	<scrollview class='categoryList' id='categoryListElement' scrollX='true'>
			${categoryList}
	</scrollview>
	<view class='categoryTitleContainer'>
    <text class='categoryTitle' value='${truncateText(classes[index].name, 10)}'></text>
    <text class='categoryDesc' value='${truncateText(classes[index].description, 45)}'></text>
	</view>
	<scrollview class='questionList' id='questionListElement' scrollY='true'>
			${questions.length ? questionList : emptyContainer}
	</scrollview>

	<view class='backGame' id='backGame'>
				<image src='${backGameImg}' class='backGameIcon' />
        <text class='backGameText' value='返回游戏'></text>
	</view>
</view>
`

  function categoryStyle(screenInfo) {
    const buttonRect = __env.getMenuButtonBoundingClientRect()
    const theme = {
      containerBackgroundColor: {
        light: '#DEF8FD',
        dark: '#162831',
        vip: '#F3F2EE'
      },
      headerTitleColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      },
      categoryListBackgroundColor: {
        light: 'rgba(255, 255, 255, 0.4)',
        dark: 'rgba(42, 219, 239, 0.02)',
        vip: '#FFF8EC'
      },
      categoryItemActiveBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
      },
      categoryTitleContainerBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
      },
      categoryTitleColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#321000'
      },
      categoryDescColor: {
        light: '#6F799B',
        dark: 'rgba(255, 255, 255, 0.6)',
        vip: '#6F799B'
      },
      questionListBackgroundColor: {
        light: '#fff',
        dark: 'rgba(42, 219, 239, 0.05)',
        vip: '#fff'
      },
      questionBorderBackgroundColor: {
        light: '#EAEAEA',
        dark: 'rgba(255, 255, 255, 0.05)',
        vip: '#EAEAEA'
      },
      questionItemNumberTextColor: {
        light: '#6F799B',
        dark: '#929DC1',
        vip: '#6F799B'
      },
      questionItemTextColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      },
      btnGroupItemBackgroundColor: {
        light: '#fff',
        dark: 'rgba(255, 255, 255, 0.2)',
        vip: '#fff'
      },
      noDataColor: {
        light: '#313233',
        dark: '#fff',
        vip: '#313233'
      }
    }

    return ({
      emptyContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: getRatioPx(20)
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

      paddingBlock: {
        height: getRatioPx(12)
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

      container: {
        paddingLeft: getRatioPx(paddingX),
        paddingRight: getRatioPx(paddingX),
        paddingTop: screenInfo.platform === 'wechat' ? buttonRect.top : getRatioPx(12),
        paddingBottom: getRatioPx(12),
        width: screenInfo.screenWidth,
        height: screenInfo.screenHeight,
        backgroundColor: theme.containerBackgroundColor[screenInfo.theme],
        flexDirection: 'column'
      },

      categoryList: {
        height: getRatioPx(48),
        backgroundColor: theme.categoryListBackgroundColor[screenInfo.theme],
        flexDirection: 'row',
        borderTopLeftRadius: getRatioPx(4),
        borderTopRightRadius: getRatioPx(4)
      },

      categoryItem: {
        width: getRatioPx(48),
        height: getRatioPx(48),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },

      categoryItemMargin: {
        marginRight: getRatioPx(5)
      },

      categoryItemActive: {
        backgroundColor: theme.categoryItemActiveBackgroundColor[screenInfo.theme],
        borderTopLeftRadius: getRatioPx(4),
        borderTopRightRadius: getRatioPx(4)
      },

      iconImage: {
        width: getRatioPx(40),
        height: getRatioPx(40)
      },

      categoryTitleContainer: {
        height: getRatioPx(44),
        backgroundColor: theme.categoryTitleContainerBackgroundColor[screenInfo.theme],
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: getRatioPx(12),
        paddingLeft: getRatioPx(12)
      },

      categoryTitle: {
        color: theme.categoryTitleColor[screenInfo.theme],
        fontSize: getRatioPx(16),
        marginTop: getRatioPx(3)
      },

      categoryDesc: {
        color: theme.categoryDescColor[screenInfo.theme],
        fontSize: getRatioPx(12),
        marginLeft: getRatioPx(10),
        marginTop: getRatioPx(4)
      },

      questionList: {
        flex: 1,
        borderBottomLeftRadius: getRatioPx(4),
        borderBottomRightRadius: getRatioPx(4),
        backgroundColor: theme.questionListBackgroundColor[screenInfo.theme]
      },

      questionItem: {
        paddingBottom: getRatioPx(2)
      },

      questionBorder: {
        height: getRatioPx(1),
        backgroundColor: theme.questionBorderBackgroundColor[screenInfo.theme]
      },

      questionItemBorder: {
        height: getRatioPx(1),
        backgroundColor: theme.questionBorderBackgroundColor[screenInfo.theme],
        marginBottom: getRatioPx(7)
      },

      questionItemTextContainer: {
        flexDirection: 'row',
        paddingLeft: getRatioPx(12),
        paddingRight: getRatioPx(12)
      },

      questionItemNumber: {
        width: getRatioPx(22)
      },

      questionItemNumberText: {
        color: theme.questionItemNumberTextColor[screenInfo.theme],
        fontSize: getRatioPx(14)
      },

      questionItemText: {
        fontSize: getRatioPx(15),
        color: theme.questionItemTextColor[screenInfo.theme],
        marginBottom: getRatioPx(5)
      },

      questionItemTextWrapper: {
        marginTop: getRatioPx(7),
        marginLeft: getRatioPx(11)
      },

      header: {
        paddingTop: getRatioPx(8),
        height: getRatioPx(30),
        width: screenInfo.screenWidth - getRatioPx(100),
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        paddingLeft: getRatioPx(paddingX),
        paddingRight: getRatioPx(paddingX)
      },

      headerTitle: {
        color: theme.headerTitleColor[screenInfo.theme],
        fontSize: getRatioPx(18)
      },

      btnGroup: {
        position: 'absolute',
        right: screenInfo.screenWidth - buttonRect.left - getRatioPx(paddingX) + getRatioPx(12) + (screenInfo.platform === 'douyin' ? getRatioPx(40) : 0),
        top: 0,
        width: getRatioPx(84),
        flexDirection: 'row',
        justifyContent: 'flex-end'
      },

      btnGroupItem: {
        width: getRatioPx(30),
        height: getRatioPx(30),
        backgroundColor: theme.btnGroupItemBackgroundColor[screenInfo.theme],
        borderRadius: getRatioPx(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },

      backImg: {
        height: getRatioPx(16),
        width: getRatioPx(9)
      }
    })
  }

  function watch() {
    const backBtn = Layout.getElementById('backBtn')
    const backGameBtn = Layout.getElementById('backGame')

    backBtn.on('click', () => {
      callback('back')
    })

    backGameBtn.on('click', () => {
      callback('backGame')
    })

    const questionList = Layout.getElementsByClassName('questionItem')

    questionList.forEach((item, index) => {
      item.on('click', () => {
        callback('question', questions[index])
      })
    })

    const categoryList = Layout.getElementsByClassName('categoryItem')

    categoryList.forEach((item, index) => {
      item.on('click', () => {
        if (currentId !== classes[index].id) {
          callback('category', classes[index])
        }
      })
    })

    const categoryListElement = Layout.getElementById('categoryListElement')
    const questionListElement = Layout.getElementById('questionListElement')
    categoryListElement.scrollTo(index * 48, 0, false)

    Layout.ticker.next(() => {
      categoryListElement.horizontalScrollbar.hide()
      questionListElement.vertivalScrollbar.hide()
    })
  }

  return {
    categoryTemplate,
    categoryStyle,
    watch
  }
}
