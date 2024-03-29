import boto3
import os
import json
from boto3.dynamodb.conditions import Key
from helpers.standard_response import standard_response

client = boto3.client('cognito-idp')
CLIENT_ID = os.environ["COGNITO_APP_CLIENT_ID"]
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ["USER_TABLE"])

def handler(event, context):
  res = standard_response()
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
    access_token = initial_auth.get("AuthenticationResult").get("AccessToken")
    refresh_token = initial_auth.get("AuthenticationResult").get("RefreshToken")
    response = client.get_user(
      AccessToken=access_token
    )
    res["body"]["access_token"] = access_token
    res["body"]["refresh_token"] = refresh_token

    dynamo_res = table.get_item(
      Key={
        "pk": response.get("Username"), 
        "sk": "user:profile"
      }
    )

    res["body"]["username"] = dynamo_res.get("Item").get("username")
    res["body"]["role"] = dynamo_res.get("Item").get("role")
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

  res["body"] = json.dumps(res["body"])
  
  return res