import boto3
import os
import json

client = boto3.client('cognito-idp')
CLIENT_ID = os.environ["COGNITO_APP_CLIENT_ID"]

def handler(event, context):
  res = { 
    "statusCode": 200, 
  	"headers": {
    "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
    "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
  	"Access-Control-Allow-Headers": "Application/json",
  	"Access-Control-Allow-Methods":"*"
  	}, "body": {} }

  body = json.loads(event['body'])
  email = body.get("email")
  password = body.get("password")
  try:
    initial_auth = client.initiate_auth(
      AuthFlow="USER_PASSWORD_AUTH",
      ClientId=CLIENT_ID, 
      AuthParameters={
          "USERNAME": email,
          "PASSWORD": password
      }
    )
    res["body"]["message"] = "ok"
  except Exception as e:
    print(e)
    res["body"]["message"] = "error"
  
  if res["body"]["message"] == "ok":
    access_token = initial_auth.get("AuthenticationResult").get("AccessToken")
    refresh_token = initial_auth.get("AuthenticationResult").get("RefreshToken")
    try:
      response = client.get_user(
        AccessToken=access_token
      )
      res["body"]["access_token"] = access_token
      res["body"]["refresh_token"] = refresh_token
      res["body"]["user_mail"] = email
    except Exception as e:
      print(e)
      res["body"]["message"] = "error"
  
  res["body"] = json.dumps(res["body"])
  
  return res