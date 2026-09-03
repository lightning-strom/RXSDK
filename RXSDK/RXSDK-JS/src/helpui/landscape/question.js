import { Layout, getRatioPx, getGlobalScreen, __env } from '../../index.helpui.js'
import { wrapText, stripHTMLTags } from "../utils";

export default function (info, resolved, callback) {
	const paddingX = 51
	const questionOptionText = wrapText(stripHTMLTags(info.title), getRatioPx(15), getRatioPx(520)).map(item => (`
        <text value='${item}' class='questionOptionText'></text>
  	`)).join('')

	const answerOptionText = wrapText(stripHTMLTags(info.answer), getRatioPx(15), getRatioPx(520)).map(item => (`
        <text value='${item}' class='answerOptionText'></text>
  	`)).join('')

	const buttons = resolved ? '' : `
		<view class='buttonContainer'>
				<view class='resolved' id='resolvedBtn'>
					<image src='https://oss.ruixueyun.com/sdk/help-image/workOut.png' class='workOutIcon' />
					<text class='workOutText' value='已解决'></text>
				</view>

				<view class='unresolved' id='unresolvedBtn'>
					<image src='https://oss.ruixueyun.com/sdk/help-image/weijiejue.png' class='unresolvedIcon' />
					<text class='unresolvedText' value='未解决'></text>
				</view>
		</view>
	`
	const backBtnImg = {
		light: 'https://oss.ruixueyun.com/sdk/help-image/back.png',
		dark: 'https://oss.ruixueyun.com/sdk/help-image/back_dark.png',
		vip: 'https://oss.ruixueyun.com/sdk/help-image/back.png',
	}[getGlobalScreen().theme]

	const homeBtnImg = {
		light: 'https://oss.ruixueyun.com/sdk/help-image/home.png',
		dark: 'https://oss.ruixueyun.com/sdk/help-image/home_dark.png',
		vip: 'https://oss.ruixueyun.com/sdk/help-image/home.png',
	}[getGlobalScreen().theme]

	const backGameImg = {
		light: 'https://oss.ruixueyun.com/sdk/help-image/back_icon.png',
		dark: 'https://oss.ruixueyun.com/sdk/help-image/back_icon.png',
		vip: 'https://oss.ruixueyun.com/sdk/help-image/back_icon_vip.png',
	}[getGlobalScreen().theme]

	const questionIcon = {
		light: 'https://oss.ruixueyun.com/sdk/help-image/q.png',
		dark: 'https://oss.ruixueyun.com/sdk/help-image/q.png',
		vip: 'https://oss.ruixueyun.com/sdk/help-image/q_vip.png',
	}[getGlobalScreen().theme]

	const answerIcon = {
		light: 'https://oss.ruixueyun.com/sdk/help-image/a.png',
		dark: 'https://oss.ruixueyun.com/sdk/help-image/a.png',
		vip: 'https://oss.ruixueyun.com/sdk/help-image/a_vip.png',
	}[getGlobalScreen().theme]

	const questionTemplate = `
<view class='container'>
	<view class="header">
    <text class='headerTitle' value='问题详情'></text>
		<view class="btnGroup">
			<view class="btnGroupItem" id="backBtn">
					<image src='${backBtnImg}' class='backImg' />
			</view>

			<view class="btnGroupItem" id="homeBtn">
					<image src='${homeBtnImg}' class='homeImg' />
			</view>
		</view>
	</view>
	<view class="paddingBlock"></view>

	<scrollview class="questionContainer" id="questionContainerElement" scrollY="true">
		<view class="questionOption">
				<image src='${questionIcon}' class='questionIcon' />
				<view class="questionOptionBox">
					${questionOptionText}
				</view>
		</view>

		<view class="flexRight">
			<view class="answerOption">
				<view class="answerOptionBox">
						${answerOptionText}
				</view>
				<image src='${answerIcon}' class='answerIcon' />
			</view>
		</view>

		${buttons}
	</scrollview>

	<view class='backGame' id="backGame">
				<image src='${backGameImg}' class='backGameIcon' />
        <text class='backGameText' value='返回游戏'></text>
	</view>
</view>
`

	function questionStyle(screenInfo) {
		const buttonRect = __env.getMenuButtonBoundingClientRect()
		const theme = {
			containerBackgroundColor: {
				light: '#DEF8FD',
				dark: '#162831',
				vip: '#F3F2EE',
			},
			headerTitleColor: {
				light: '#313233',
				dark: '#fff',
				vip: '#313233'
			},
			btnGroupItemBackgroundColor: {
				light: '#fff',
				dark: 'rgba(255, 255, 255, 0.2)',
				vip: '#fff'
			},
			questionContainerBackgroundColor: {
				light: '#fff',
				dark: 'rgba(42, 219, 239, 0.05)',
				vip: '#fff',
			},
			questionOptionTextColor: {
				light: '#313233',
				dark: '#fff',
				vip: '#313233'
			},
			questionOptionBoxBackgroundColor: {
				light: '#DEF8FD',
				dark: '#162831',
				vip: '#FFF2DB'
			},
			answerOptionTextColor: {
				light: '#313233',
				dark: '#fff',
				vip: '#313233'
			},
			answerOptionBoxBackgroundColor: {
				light: '#DEF8FD',
				dark: '#162831',
				vip: '#FFF2DB'
			}
		}

		return ({
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
				justifyContent: 'space-between'
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
			},

			homeImg: {
				height: getRatioPx(18),
				width: getRatioPx(18)
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
				height: getRatioPx(36),
			},

			backGameText: {
				color: '#313233',
				marginLeft: getRatioPx(2),
				fontSize: getRatioPx(13),
				marginTop: getRatioPx(13 / 4)
			},

			questionContainer: {
				flex: 1,
				borderRadius: getRatioPx(4),
				backgroundColor: theme.questionContainerBackgroundColor[screenInfo.theme],
				padding: getRatioPx(12)
			},

			flexRight: {
				flexDirection: 'row',
				justifyContent: 'flex-end',
				paddingTop: getRatioPx(24)
			},

			questionOption: {
				flexDirection: 'row'
			},

			questionOptionText: {
				color: theme.questionOptionTextColor[screenInfo.theme],
				fontSize: getRatioPx(14),
				lineHeight: getRatioPx(22)
			},

			questionOptionBox: {
				backgroundColor: theme.questionOptionBoxBackgroundColor[screenInfo.theme],
				borderTopRightRadius: getRatioPx(16),
				borderBottomRightRadius: getRatioPx(16),
				borderBottomLeftRadius: getRatioPx(16),
				paddingRight: getRatioPx(12),
				paddingLeft: getRatioPx(12),
				paddingTop: getRatioPx(8),
				paddingBottom: getRatioPx(8),
				marginLeft: getRatioPx(8),
				marginTop: getRatioPx(2)
			},

			questionIcon: {
				width: getRatioPx(36),
				height: getRatioPx(36)
			},

			answerOption: {
				flexDirection: 'row'
			},

			answerOptionText: {
				color: theme.answerOptionTextColor[screenInfo.theme],
				fontSize: getRatioPx(14),
				lineHeight: getRatioPx(22)
			},

			answerOptionBox: {
				backgroundColor: theme.answerOptionBoxBackgroundColor[screenInfo.theme],
				borderTopLeftRadius: getRatioPx(16),
				borderBottomRightRadius: getRatioPx(16),
				borderBottomLeftRadius: getRatioPx(16),
				paddingRight: getRatioPx(12),
				paddingLeft: getRatioPx(12),
				paddingTop: getRatioPx(8),
				paddingBottom: getRatioPx(8),
				marginRight: getRatioPx(8),
				marginTop: getRatioPx(2)
			},

			answerIcon: {
				width: getRatioPx(36),
				height: getRatioPx(36)
			},


			buttonContainer: {
				marginRight: getRatioPx(36 + 12),
				marginTop: getRatioPx(12),
				flexDirection: 'row',
				justifyContent: 'flex-end'
			},

			resolved: {
				height: getRatioPx(36),
				width: getRatioPx(104),
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				borderWidth: getRatioPx(1),
				borderRadius: getRatioPx(4),
				borderColor: '#199C91',
				marginRight: getRatioPx(12)
			},

			workOutIcon: {
				width: getRatioPx(24),
				height: getRatioPx(24)
			},

			workOutText: {
				fontSize: getRatioPx(14),
				color: '#199C91',
				lineHeight: getRatioPx(26)
			},

			unresolved: {
				height: getRatioPx(36),
				width: getRatioPx(104),
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				borderWidth: getRatioPx(1),
				borderRadius: getRatioPx(4),
				borderColor: '#E17676'
			},

			unresolvedIcon: {
				width: getRatioPx(24),
				height: getRatioPx(24)
			},

			unresolvedText: {
				fontSize: getRatioPx(14),
				color: '#E17676',
				lineHeight: getRatioPx(26)
			},
		})
	}

	function watch() {
		const backBtn = Layout.getElementById('backBtn')
		const homeBtn = Layout.getElementById('homeBtn')
		const resolvedBtn = Layout.getElementById('resolvedBtn')
		const unresolvedBtn = Layout.getElementById('unresolvedBtn')
		const backGameBtn = Layout.getElementById('backGame')

		backBtn.on('click', () => {
			callback('back')
		})

		backGameBtn.on('click', () => {
			callback('backGame')
		})

		homeBtn.on('click', () => {
			callback('home')
		})

		unresolvedBtn.on('click', () => {
			callback('unresolved')
		})

		resolvedBtn.on('click', () => {
			callback('resolved')
		})

		const questionContainerElement = Layout.getElementById("questionContainerElement")
		Layout.ticker.next(() => {
			questionContainerElement.vertivalScrollbar.hide()
		})
	}

	return {
		questionTemplate,
		questionStyle,
		watch
	}
}
