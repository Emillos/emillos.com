import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ["USER_TABLE"])

def handler(event, context):
  print(event)
  table.put_item(
    Item={
      "pk": event.get("request").get("userAttributes").get("sub"),
      "sk": "user:profile",
      "username": event.get("request").get("userAttributes").get("custom:username"),
      "role":"1"
    }
  )
  return event