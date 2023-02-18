import boto3
import os
from pprint import pprint

client = boto3.client('cognito-idp')
res = { 
  "statusCode": 200, 
  "headers": {
    "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
    "Access-Control-Allow-Credentials" : True, # Required for cookies, authorization headers with HTTPS
    "Access-Control-Allow-Headers": "Application/json",
    "Access-Control-Allow-Methods":"*"
  }, "body": {"status": True, "message": "ok"} 
}

def handler(event, context):
  pprint(event)
  email = event.get("body").get("email")
  client_id = os.environ["COGNITO_APP_CLIENT_ID"]
  print(email)
  print(client_id)
  
  forgot = client.forgot_password(
    ClientId=client_id,
    Username=email
  )
  print('forgot', forgot)

  return "res"
