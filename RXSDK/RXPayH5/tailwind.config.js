import colors from 'tailwindcss/colors'

/**
 * 屏幕尺寸相关
 */
const SCREENS = {
  xs: 576,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560
}
const screens = {}
for (const key in SCREENS) {
  if (Object.prototype.hasOwnProperty.call(SCREENS, key)) {
    const value = SCREENS[key]
    screens[key] = `${value}px`
  }
}

/**
 * 间距相关
 */
const spacing = {}
for (let i = 1; i <= 500; i++) {
  spacing[`px-${i}`] = `${i}px`
}

/**
 * 颜色相关
 */
const colorKeys = ['primary', 'success', 'warning', 'danger', 'error', 'info']
// remove despired colors
;['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'].forEach((key) => delete colors[key])

// 元素颜色
const elementColors = {
  colors: {
    ...(() => {
      const result = {}
      colorKeys.forEach((key) => (result[key] = `var(--rx-color-${key})`))
      return result
    })(),
    // 主要渐变色
    'rx-gradient-primary': 'var(--rx-gradient-primary)',
    'rx-color-primary': 'var(--rx-color-primary)', // 主选中色
    'rx-color-secondary': 'var(--rx-color-secondary)', // 主选中色
    'rx-color-danger': 'var(--rx-color-danger)' // 报错颜色
  },
  // 字体颜色
  textColor: {
    'rx-text-primary': 'var(--rx-text-primary)', // 主字体颜色
    secondary: 'var(--rx-text-color-secondary)',
    placeholder: 'var(--rx-text-color-placeholder)',
    disabled: 'var(--rx-disabled-text-color)',
    thead: 'var(--rx-text-color-secondary)',
    primary: 'var(--rx-color-primary)'
  }
}

// 样式是否加 !important
export const important = true
export const content = ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
export const plugins = []
export const safelist = [
  'justify-start',
  'justify-center',
  'justify-end',
  'text-left',
  'text-center',
  'text-right',
  ...colorKeys.map((key) => `text-${key}`)
]
export const theme = {
  extend: {
    zIndex: {
      '-1': '-1'
    },
    spacing,
    lineHeight: spacing
  },
  colors: {
    ...colors,
    ...elementColors.colors
  },
  textColor: {
    ...colors,
    ...elementColors.colors,
    ...elementColors.textColor
  },
  screens,
  // 字体大小
  fontSize: {
    'rx-12': '12px',
    'rx-14': '14px',
    'rx-16': '16px',
    'rx-18': '18px',
    'rx-20': '20px',
    'rx-24': '24px',
    'rx-26': '26px'
  },
  // 圆角
  borderRadius: {
    'rx-none': '0px',
    'rx-2': '2px',
    'rx-4': '4px',
    'rx-6': '6px',
    'rx-8': '8px',
    'rx-10': '10px',
    'rx-20': '20px'
  }
}
