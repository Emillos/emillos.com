import boto3
import os
import json
from pprint import pprint
client = boto3.client('cognito-idp')

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
  access_token = body.get("accessToken")
  try:
    user_details = client.get_user(
      AccessToken=access_token
      )
    pprint(user_details)
    res["body"] = {"message":"ok", "data":user_details}
  except Exception as e:
    class_name = e.__class__.__name__
    print(class_name + ': ' + str(e))
    res["body"] = {"message":"error", "data":""}
  # TODO use refreshtoken... somehow

  res["body"] = json.dumps(res["body"])
  return res
