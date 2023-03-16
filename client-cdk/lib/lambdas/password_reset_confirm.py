import boto3
import json
import os
from helpers.pw_compare import pw_compare
from helpers.standard_response import standard_response
client = boto3.client('cognito-idp')

def handler(event, context):
  body = json.loads(event['body'])
  res = standard_response()
  client_id = os.environ["COGNITO_APP_CLIENT_ID"]
  email = body.get("email")
  code = body.get("code")
  password = body.get("password")
  pw_match = pw_compare(body.get("password"), body.get("retypePassword"))

  if pw_match != True:
    res["body"]["message"] = {
      "message":pw_match,
      "type": "error"
    }
    res["body"] = json.dumps(res["body"])
    return res
  try:
    client.confirm_forgot_password(
      ClientId=client_id,
      ConfirmationCode=code,
      Username=email,
      Password=password
    )
    res["body"]["message"] = {
        "message":"Your password has successfully been reset, please close this window and return to signin",
        "type": "success"
    }
  except Exception as e: 
    print('err', e)
    if "message" not in res["body"]:
      if e.__class__.__name__ == "ParamValidationError":
        res["body"]["message"] = {
          "message":"Password must be at least 6 characters long and contain at least one number",
          "type": "error"
      }
      else:
        res["body"]["message"] = {
          "message":"An error occored, try again",
          "type": "error"
        }

  res["body"] = json.dumps(res["body"])
  return res
