/**
 * @file 修复微信小游戏类型定义与 Node 类型冲突
 */
import fs from 'fs-extra'
import colors from 'colors'

const path = 'node_modules/minigame-api-typings/types/wx/index.d.ts'
const utilsContent = fs.readFileSync(path, { encoding: 'utf-8' })

function fix () {
  console.log(colors.yellow(`start fix minigame-api-typings error.`))
  fs.writeFileSync(
    path,
    utilsContent
      .replace(/declare const console:.*?\n/, '')
      .replace(/declare let exports:.*?\n/, '')
      .replace(/declare function require\((?:[\S\s]*?): any\n/, '')
      .replace(/declare let module: {(?:[\S\s]*?)}\n/, ''),
  )
}

fix()
