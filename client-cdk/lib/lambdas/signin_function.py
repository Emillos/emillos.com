import boto3
import os
import json
from pprint import pprint
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
    pprint(initial_auth)
    res["body"]["message"] = "ok"

  except Exception as e:
    print(e.__class__)
    if e.__class__.__name__ == "NotAuthorizedException":
      res["body"]["message"] = {
        "message":"Email or password is incorrect, please check and try again",
        "type": "error"
      }
    else:
      res["body"]["message"] = {
        "message":"An error occored, try again",
        "type": "error"
      }
  
  if res["body"]["message"] == "ok":
    access_token = initial_auth.get("AuthenticationResult").get("AccessToken")
    refresh_token = initial_auth.get("AuthenticationResult").get("RefreshToken")
    try:
      response = client.get_user(
        AccessToken=access_token
      )
      # get userdetails from dynamo
      res["body"]["access_token"] = access_token
      res["body"]["refresh_token"] = refresh_token
      res["body"]["user_mail"] = email
    except Exception as e:
      print(e.__class__)
      res["body"]["message"] = {
        "message":"An error occored, try again",
        "type": "error"
      }

  res["body"] = json.dumps(res["body"])
  
  return res