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
	"Access-Control-Allow-Methods":"*"
	}, "body": {} }

def handler(event, context):
  email = event.get("body").get("email")
  password = event.get("body").get("password")

  initial_auth = client.initiate_auth(
    AuthFlow="USER_PASSWORD_AUTH",
    ClientId=CLIENT_ID, 
    AuthParameters={
        "USERNAME": email,
        "PASSWORD": password
    }
  )
  access_token = initial_auth.get("AuthenticationResult").get("AccessToken")
  refresh_token = initial_auth.get("AuthenticationResult").get("RefreshToken")
  response = client.get_user(
    AccessToken=access_token
  )

  res["body"]["access_token"] = access_token
  res["body"]["refresh_token"] = refresh_token
  res["body"]["user_mail"] = response.get("UserAttributes")[-1].get("Value") # this should be gotten from DB

  return res