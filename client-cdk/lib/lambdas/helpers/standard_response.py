def standard_response():
  res = { 
    "statusCode": 200, 
    "headers": {
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Credentials" : True,
      "Access-Control-Allow-Headers": "Application/json",
      "Access-Control-Allow-Methods":"*"
    }, 
    "body": {} 
  }
  return res