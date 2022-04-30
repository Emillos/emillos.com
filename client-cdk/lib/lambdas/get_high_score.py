import os
import boto3
from boto3.dynamodb.conditions import Key
import json
from operator import itemgetter

dynamodb = boto3.resource('dynamodb')
tableName = os.environ["TABLE"]
tableIndex = os.environ["TABLE_INDEX"]
table = dynamodb.Table(tableName)

def handler(event, context):
  game = event.get("queryStringParameters").get("project")

  # Find highscores in dynamodb
  highscore_data = fetch_from_dynamodb(game)

  # Sort the scores - highest first!
  sorted_highscores = sorted(highscore_data, key=lambda x: int(itemgetter("score")(x)), reverse=True)

  response = {
    "statusCode": 200,
    "headers":{"Access-Control-Allow-Origin":"*"},
    "body": json.dumps({"message": sorted_highscores})
  }

  return response

def fetch_from_dynamodb(game):
  try:
    scores = []
    response = table.query(
      IndexName=tableIndex,
      KeyConditionExpression=Key("sk").eq("project:{}".format(game)),
    )
    for item in response.get("Items"):
      row = {
        "score": item.get("highscore"),
        "name": item.get("name")
      }
      scores.append(row)
    return scores
  except Exception as e:
    print(e.response['Error']['Message'])
    return 500
