/*
   storage maintenance.

   directory: <APPDATA_PATH>/master-diff

   - file: meta.json

     - latest: <timestamp :: Number> or 'init'
     - version: '0.0.1'

   - file: master-<timestamp>.json

   - file: master-init.json

     same as other master data, except that this one
     does not have a corresponding diff.
     since master data itself has timestamp, no info is lost
     (the filename is just for making it easier to read for human)

   - file: diff-<timestamp>.json

     the timestamp is timestamp of the rhs,
     in other words, it's the timestamp that
     the recorded difference got detected.

     - lhsTime: <timestamp>
     - rhsTime: <timestamp>
     - results: <diff result>

   INVARIANT:

   - 'master-<timestamp>.json' and 'diff-<timestamp>.json' should both exist.

 */
import {
  ensureDirSync,
  readJsonSync,
  writeJsonSync,
} from 'fs-extra'
import { join } from 'path-extra'

const getStoragePath = () => {
  const {APPDATA_PATH} = window
  const path = join(APPDATA_PATH,'master-diff')
  ensureDirSync(path)
  return path
}

const updateMeta = oldMeta => {
  if (oldMeta.version === '0.0.1')
    return oldMeta
  throw new Error(`failed to update meta.json`)
}

const readAndUpdateMeta = () => {
  try {
    const path = getStoragePath()
    const metaPath = join(path, 'meta.json')
    return updateMeta(readJsonSync(metaPath))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading meta.json', err)
    }
    return null
  }
}

const readLatestRecord = () => {
  const meta = readAndUpdateMeta()
  if (meta == null)
    return null
  // assuming the storage is always in sync,
  // there is no need of defensive try...catch blocks.
  const path = getStoragePath()
  const masterFilePath = join(path,`master-${meta.latest}.json`)
  const masterData = readJsonSync(masterFilePath)

  let diffData = null
  if (meta.latest !== 'init') {
    const diffFilePath = join(path,`diff-${meta.latest}.json`)
    diffData = readJsonSync(diffFilePath)
  }

  return {masterData, diffData}
}

const writeRecord = (master, diff, isInit = false) => {
  const path = getStoragePath()
  const metaPath = join(path, 'meta.json')
  const which = isInit ? 'init' : master.time
  const masterFilePath = join(path, `master-${which}.json`)
  writeJsonSync(masterFilePath, master)
  if (!isInit) {
    const diffFilePath = join(path, `diff-${which}.json`)
    writeJsonSync(diffFilePath, diff)
  }
  writeJsonSync(metaPath, {latest: which, version: '0.0.1'})
}

export {
  readLatestRecord,
  writeRecord,
}
