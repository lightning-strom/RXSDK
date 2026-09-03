// @ts-nocheck
import { readdirSync } from 'fs-extra'
import h5 from './rollup.config.h5.ts'
import qq from './rollup.config.qq.ts'
import wegame from './rollup.config.wegame.ts'
import meituan from './rollup.config.meituan.ts'


export default async (argv) => {
  const modules = argv.modules && argv.modules.split(' ')
  const regexp = new RegExp('index\\.(.*?)\\.ts')
  const exclude = ['common']
  const mini = ['wegame', 'qq', 'meituan']
  const h5Channels = readdirSync('src')
    .map(name => regexp.test(name) && name.replace(regexp, '$1'))
    .filter(name => {
      return name &&
        !mini.includes(name) &&
        !exclude.includes(name) &&
        (!modules || modules.includes(name))
    })

  const miniMap = {
    wegame,
    qq,
    meituan,
  }

  return Promise.all(
    mini
      .filter(name => (!modules || modules.includes(name)) && miniMap[name])
      .map(name => miniMap[name](argv))
      .concat(h5Channels.map(type => h5({
        ...argv,
        type,
      })))
  )
}
