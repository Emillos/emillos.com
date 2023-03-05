import boto3
import os
import json

client = boto3.client('cognito-idp')

def handler(event, context):
  body = json.loads(event['body'])
  email = body.get("email")

  res = { 
    "statusCode": 200, 
    "headers": {
      "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
      "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Headers": "Application/json",
      "Access-Control-Allow-Methods":"*"
    }, "body": {} 
  }

  try:
    forgot = client.forgot_password(
      ClientId=os.environ["COGNITO_APP_CLIENT_ID"],
      Username=email
    )
    res["body"]["message"] = "ok"
  except Exception as e:
    print(e)
    res["body"]["message"] = "error"

  res["body"] = json.dumps(res["body"])
  return res
