import boto3
import os
import json
from helpers.standard_response import standard_response
client = boto3.client('cognito-idp')

def handler(event, context):
  body = json.loads(event['body'])
  email = body.get("email")
  res = standard_response()

  try:
    client.forgot_password(
      ClientId=os.environ["COGNITO_APP_CLIENT_ID"],
      Username=email
    )
    res["body"]["message"] = {
      "message":"Success: An email has been sent with further instructions",
      "type": "success"
    }
  except Exception as e:
    print(e)
    res["body"]["message"] = "error"

  res["body"] = json.dumps(res["body"])
  return res
