import boto3
import os
client = boto3.client('cognito-idp')
CLIENT_ID = os.environ["COGNITO_APP_CLIENT_ID"]

res = {
    "statusCode": 200, 
    "headers": {
        "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
        "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Headers": "Application/json",
        "Access-Control-Allow-Methods":'*'
    }, "body": {} 
}

def handler(event, context):
  response = client.sign_up(
      ClientId=CLIENT_ID,
      Username=event.get("body").get("email"),
      Password=event.get("body").get("password"),
      UserAttributes=[
          {
              'Name': 'email',
              'Value': event.get("body").get("email")
          },
      ]
  )
  res["body"] = response
  return res
  