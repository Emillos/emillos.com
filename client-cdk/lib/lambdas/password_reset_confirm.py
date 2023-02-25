import boto3
import json
import os
from pprint import pprint

client = boto3.client('cognito-idp')
res = { 
  "statusCode": 200, 
  "headers": {
    "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
    "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
    "Access-Control-Allow-Headers": "Application/json",
    "Access-Control-Allow-Methods":"*"
  }, "body": {} 
}

def handler(event, context):
  pprint(event)
  client_id = os.environ["COGNITO_APP_CLIENT_ID"]
  body = json.loads(event['body'])
  email = body.get("email")
  username = body.get("username")
  code = body.get("code")
  new_password = body.get("new_password")

  params = {
    "ClientId": client_id,
    "ConfirmationCode": code,
    "Username": username,
    "Password": new_password
  }
  try:
    confirm = client.confirm_forgot_password(params).promise()
    res["body"]["message"] = "ok"
  except Exception as e: 
    print('err', e)
    res["body"]["message"] = "error"

  res["body"] = json.dumps(res["body"])
  return res
