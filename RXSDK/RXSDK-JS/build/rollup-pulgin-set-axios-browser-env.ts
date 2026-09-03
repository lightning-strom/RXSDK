import fs from 'fs-extra'
import colors from 'colors'

const path = 'node_modules/axios/lib/utils.js'
const utilsContent = fs.readFileSync(path, { encoding: 'utf-8' })

export default function setAxiosBrowserEnv (bool = false) {
  return {
    name: 'set-axios-browser-env', // this name will show up in warnings and errors
    buildStart: () => {
      console.log(colors.yellow(`start set axios browser env to ${bool}.`))
      fs.writeFileSync(path, utilsContent.replace(/(function isStandardBrowserEnv)\(\) \{(?:[\S\s]*?)(\/\*\*)/g, `$1 () { return ${bool} }\n$2`))
    },
    buildEnd: () => {
      console.log(colors.yellow('restore axios browser env.'))
      fs.writeFileSync(path, utilsContent)
    },
  }
}
