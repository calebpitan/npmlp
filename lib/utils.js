const path = require('path')
const fs = require('fs')
const glob = require('fast-glob')

const schemaExt = '.prisma'
const schemaPattern = '/**/*' + schemaExt

function fetchAllSchema(relativePathToSchema) {
  const pattern = path.posix.join(relativePathToSchema, schemaPattern)
  const schemas = glob(pattern, { cwd: process.cwd() })
  return schemas
}

function copyEnvironmentVariables(from, to) {
  const sourceEnvFile = path.resolve(from)
  const destEnvFile = path.resolve(to)
  const readStream = fs.createReadStream(sourceEnvFile, { autoClose: true })
  const writeStream = fs.createWriteStream(destEnvFile, { autoClose: true })
  readStream.pipe(writeStream)
}

exports.fetchAllSchema = fetchAllSchema
exports.copyEnvironmentVariables = copyEnvironmentVariables
