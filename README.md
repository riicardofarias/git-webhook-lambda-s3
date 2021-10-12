# git-webhook-lambda-s3

git-webhook-lambda-s3 provides a solution by using a [AWS API Gateway](https://aws.amazon.com/pt/api-gateway/) and [Lambda](https://aws.amazon.com/pt/lambda/) to be deployed along with Gitea or any other git server for the Webhook API call integration. This service fetch the code repo from Gitea API and automatically zip and upload the source artifact to a configurable S3 bucket, to enable the integration between the git servers to AWS CodePipeline and AWS CodeBuild.

Additionally, the Amazon Linux image used in lambda currently doesn't have Git. So this layer should be added to the lambda function to have Git available.

## Prerequisite
The following tools should be installed due to the project dependency.
* [NodeJS](https://nodejs.org/en/download/)
* [Serverless](https://www.serverless.com/)

## Setup
Here are all the environment variables that need to be defined in the AWS Lambda configuration.
* GIT_WEBHOOK_USERNAME: Git username
* GIT_WEBHOOK_TOKEN: Git personal token
* GIT_WEBHOOK_SECRET: [https://developer.github.com/webhooks/securing/]()
* S3_BUCKET: Name of your s3 bucket

## Getting Started
After fork/clone the repo, install nodejs dependencies.
```
npm install
```
```
serverless deploy --verbose
```

You can start the server on localhost using:
```
serverless offline
```

## S3 Bucket
You need add policy permission on you S3 bucket.
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "example",
            "Effect": "Allow",
            "Action": "s3:PutObject",
            "Resource": "[YOUR BUCKET/KEYS]"
        }
    ]
}
```


