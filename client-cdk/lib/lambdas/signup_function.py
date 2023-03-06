import boto3
import os
import json
from pprint import pprint
client = boto3.client('cognito-idp')
CLIENT_ID = os.environ["COGNITO_APP_CLIENT_ID"]

def handler(event, context):
    body = json.loads(event['body'])
    res = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
            "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
            "Access-Control-Allow-Headers": "Application/json",
            "Access-Control-Allow-Methods":'*'
        }, "body": {}
    }
    try:
        response = client.sign_up(
            ClientId=CLIENT_ID,
            Username=body.get("email"),
            Password=body.get("password"),
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': body.get("email")
                },
            ]
        )
        res["body"]["message"] = "ok"
    except client.exceptions.UsernameExistsException:
        res["body"]["message"] = "User is already exists"

    except client.exceptions.UserLambdaValidationException:
        res["body"]["message"] = "User is already exists"

    except Exception as e:
        if "message" not in res["body"]:
            if e.__class__.__name__ == "ParamValidationError":
                res["body"]["message"] = "Password must be at least 6 characters long and contain at least one number"
            else:
                res["body"]["message"] = "An error occored, try again"

    res["body"] = json.dumps(res["body"])
    return res
  