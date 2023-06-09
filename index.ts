import * as core from '@actions/core'
import { existsSync, mkdirSync, openSync, writeFileSync } from 'fs';
import { BuildType, generateFormula } from './formula';

const getRequiredInput = (name: string) => core.getInput(name, { required: true })
const getBuildType = (): BuildType => {
  const t = getRequiredInput('build-type')
  
  for (let b in BuildType) {
    if (t === BuildType[b]) {
      return BuildType[b]
    }
  }

  throw new Error(`build type must be one of ${JSON.stringify(BuildType)}`)
}

const run = async() => {
  // get inputs
  const commandName = getRequiredInput('command-name')
  const formula = generateFormula({
    version: core.getInput('version'),
    tag: core.getInput('tag'),
    sha256: core.getInput('sha256'),
    description: getRequiredInput('description'),
    formulaName: getRequiredInput('formula-name'),
    commandName,
    url: getRequiredInput('url'),
    homepage: getRequiredInput('homepage'),
    licenseName: getRequiredInput('license-name'),
    buildType: getBuildType(),
    main: getRequiredInput('main'),
    ldflags: core.getInput('ldflags')
  })
  core.info('formula content generated')
  // output to file
  const ffileName = `Formula/${commandName}.rb`
  if (!existsSync('Formula')) {
    mkdirSync('Formula', { recursive: true })
  }
  writeFileSync(ffileName, formula)
  core.info(`formula file wrote to ${ffileName}`)
}

const main = async() => {
  try {
    await run()
  } catch (e) {
    core.setFailed(e as Error)
  }
}

main()
