import boto3
import os
import json
from helpers.pw_compare import pw_compare
from helpers.standard_response import standard_response

client = boto3.client('cognito-idp')
CLIENT_ID = os.environ["COGNITO_APP_CLIENT_ID"]

def handler(event, context):
    body = json.loads(event['body'])
    res = standard_response()

    pw_match = pw_compare(body.get("password"), body.get("retypePassword"))
    if pw_match != True:
        res["body"]["message"] = {
            "message":pw_match,
            "type": "error"
        }
        res["body"] = json.dumps(res["body"])
        return res
    try:
        client.sign_up(
            ClientId=CLIENT_ID,
            Username=body.get("email"),
            Password=body.get("password"),
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': body.get("email")
                },
                {
                    'Name': 'custom:username',
                    'Value': body.get("username")
                },
            ]
        )
        res["body"]["message"] = {
            "message":"Check your email, and follow the instructions to activate your account",
            "type": "success"
        }
    except client.exceptions.UsernameExistsException:
        res["body"]["message"] = {
            "message":"User is already exists",
            "type": "error"
        }

    except client.exceptions.UserLambdaValidationException:
        res["body"]["message"] = {
            "message":"User is already exists",
            "type": "error"
        }

    except Exception as e:
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
  