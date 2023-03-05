import boto3
import json
import os

client = boto3.client('cognito-idp')

def handler(event, context):
  res = { 
    "statusCode": 200, 
    "headers": {
      "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
      "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Headers": "Application/json",
      "Access-Control-Allow-Methods":"*"
    }, "body": {} 
  }

  client_id = os.environ["COGNITO_APP_CLIENT_ID"]
  body = json.loads(event['body'])
  email = body.get("email")
  code = body.get("code")
  password = body.get("password")

  try:
    confirm = client.confirm_forgot_password(
      ClientId=client_id,
      ConfirmationCode=code,
      Username=email,
      Password=password
    )
    res["body"]["message"] = "ok"
  except Exception as e: 
    print('err', e)
    res["body"]["message"] = "error"

  res["body"] = json.dumps(res["body"])
  return res
