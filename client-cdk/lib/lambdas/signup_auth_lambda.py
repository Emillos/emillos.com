import boto3
import os
client = boto3.client('cognito-idp')

def handler(event, context):
  print(event)
  res = {
    "statusCode": 302,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "*",
        "Access-Control-Allow-Credentials": True,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Location": "https://{}/signin".format(os.environ["DOMAIN"]), # DOMAIN should come cognito setup in cdk
    },
    "body": "{'status':'ok'}"
  }

  confirmation_code = event.get("queryStringParameters").get("code")
  user_name = event.get("queryStringParameters").get("userName")
  client_id = event.get("queryStringParameters").get("clientId")

  try:
    client.confirm_sign_up(
      ClientId=client_id,
      Username=user_name,
      ConfirmationCode=confirmation_code
    )
    res["headers"]["Location"] = 'https://{}/signin?confirmed=true'.format(os.environ["DOMAIN"])
  except Exception as e: 
    print(e)
    res["headers"]["Location"] = 'https://{}/signin?confirmed=false'.format(os.environ["DOMAIN"])
  return res
