'use strict'

const spawn = require('child_process').spawn
const commandExists = require('command-exists').sync
const path = require('path')
const utils = require('./utils')

const prismaCmd = 'prisma'
const isWin32 = process.platform === 'win32'
const CommandType = {
  INTROSPECT: 'introspect',
  GENERATE: 'generate',
}

function createCommand(...args) {
  if (commandExists(prismaCmd)) {
    return { command: prismaCmd, args }
  }

  const command = 'node'
  const script = require.resolve('@prisma/cli/build')
  return { command, args: [script, ...args] }
}

function introspect(...args) {
  const opt = createCommand('introspect')
  const child = spawn(opt.command, [...opt.args, ...args], { cwd: path.join(__dirname, '..') })
  return child
}

function generate(...args) {
  const opt = createCommand('generate')
  const child = spawn(opt.command, [...opt.args, ...args], { cwd: path.join(__dirname, '..') })
  return child
}

function generateEach(schemaPath) {
  utils.fetchAllSchema(schemaPath).then(files => {
    files.forEach(file => {
      const child = generate('--schema=' + file)
      child.stdout.pipe(process.stdout)
    })
  })
}

generateEach('test/sandbox')
