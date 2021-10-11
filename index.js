const fs = require("fs")
const aws = require("aws-sdk")
const simpleGit = require("simple-git")
const { URL } = require("url")
const AdmZip = require("adm-zip")
const { execSync } = require("child_process")
const path = require("path")
const eventHelper = require("./src/eventHelper")

module.exports.handler = async (event, context)  => {
  const body = JSON.parse(event.body)

  const validationEvent = eventHelper.validateHookEvent(body)
  if(validationEvent)
    return validationEvent

  const { repository } = body
  
  const branch = body.ref.replace('refs/heads/', '')
  const tempFile = `${context.awsRequestId}-${branch}`
  const tempDir = `/tmp/${tempFile}`

  const cloneURL = new URL(repository.clone_url)
  cloneURL.username = process.env.GIT_WEBHOOK_USERNAME
  cloneURL.password = process.env.GIT_WEBHOOK_TOKEN

  console.log("Clonning repository ", repository.html_url, " from branch ", branch)
  await simpleGit().clone(cloneURL.href, tempDir, ['--depth', '1', '--branch', branch])
  await execSync(`rm -rf ${path.join(tempDir, '.git')}`)

  console.log("Zipping folder ", tempDir, " ...")
  const zip = new AdmZip()
  const zipFolder = `${tempDir}.zip`
  zip.addLocalFolder(tempDir)
  await zip.writeZipPromise(zipFolder)

  const targetZip = `${repository.name}/${repository.name}-${branch}.zip`
  console.log(`Uploading file ${zipFolder} to s3 ${targetZip}`)
  await new aws.S3().putObject({
    Key: targetZip,
    Body: fs.readFileSync(zipFolder),
    Bucket: process.env.S3_BUCKET
  }).promise()
  console.log(`Uploaded successfully`)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "OK",
      event: body
    }),
  };
};
