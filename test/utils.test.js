const path = require('path')
const fs = require('fs')
const chai = require('chai')
const loader = require('../lib/utils')

const sandbox = path.posix.join('test', 'sandbox')
const pathToSchema = path.posix.join(sandbox, 'prisma')
const envFile = '.env'

describe('Utility functions', () => {
  describe('#fetchAllSchema', () => {
    it('should load all prisma schema files', () => {
      return loader.fetchAllSchema(pathToSchema).then(files => {
        chai.assert.isArray(files, 'files should be an array of prisma schema files')
      })
    })

    it('should contain an array of string paths', () => {
      return loader.fetchAllSchema(pathToSchema).then(files => {
        chai.assert.isAtLeast(files.length, 1, 'should at least match one schema file')

        files.forEach(file => {
          chai.assert.isString(file, 'files should be a string path')
          chai.assert.isTrue(
            file.endsWith('.prisma'),
            'files should have a prisma schema extension'
          )
        })
      })
    })
  })

  describe('#copyEnvironmentVariables', () => {
    it('should copy a source environment variable from a source point to sandbox', () => {
      const from = path.resolve(process.cwd(), envFile)
      const to = path.resolve(path.dirname(from), sandbox, envFile)
      loader.copyEnvironmentVariables(from, to)
      chai.assert.isTrue(
        fs.existsSync(to),
        'The environment variable file should be copied to the specified sandbox'
      )
      fs.unlinkSync(to)
      chai.assert.isFalse(
        fs.existsSync(to),
        'remove environment variable file from sandbox after test passes'
      )
    })
  })
})
