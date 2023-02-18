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
  }, "body": {"status": True, "message": "ok"} 
}

def handler(event, context):
  pprint(event)
  client_id = os.environ["COGNITO_APP_CLIENT_ID"]
  email = event.get("body").get("data").get("email")
  username = event.get("body").get("data").get("username")
  code = event.get("body").get("data").get("code")
  new_password = event.get("body").get("data").get("new_password")

  params = {
    "ClientId": client_id,
    "ConfirmationCode": code,
    "Username": username,
    "Password": new_password
  }
  try:
    confirm = client.confirm_forgot_password(params).promise()
    print('cognito response', confirm)
  except Exception as e: 
    print('err', e)
    if e.code == "ExpiredCodeException":
      res["body"]["message"] = 'Reset expiried, try reset again'
    
    if e.code == "LimitExceededException":
      res["body"]["message"] = e.get("message")
    
    res["body"]["status"] = False
    res["body"] = json.dumps(res["body"])
  print(res)
  return res
