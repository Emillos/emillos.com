import boto3
import os
import json
from helpers.standard_response import standard_response
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ["USER_TABLE"])
client = boto3.client('cognito-idp')

def handler(event, context):
  body = json.loads(event['body'])
  res = standard_response()
  access_token = body.get("accessToken")

  try:
    user_details = client.get_user(
      AccessToken=access_token
    )
    dynamo_res = table.get_item(
      Key={
        "pk": user_details.get("Username"),
        "sk": "user:profile"
      }
    )
    res["body"] = {
      "message":"ok",
      "data":{
        "username": dynamo_res.get("Item").get("username"),
        "role": dynamo_res.get("Item").get("role")
      }
    }
  except Exception as e:
    class_name = e.__class__.__name__
    print(class_name + ': ' + str(e))
    res["body"] = {"message":"error", "data":""}
  # TODO use refreshtoken... somehow

  res["body"] = json.dumps(res["body"])
  return res
