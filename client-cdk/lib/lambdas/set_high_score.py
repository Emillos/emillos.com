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
  body = json.loads(event.get("body"))
  game = body.get("project")

  # Find highscores in dynamodb
  highscore_data = fetch_from_dynamodb(game)

  # Evaluate on guess
  evaluation = evaluate_score(body, highscore_data)

  # Fetch and return the updated highscore_data
  refetch_highscore_data = fetch_from_dynamodb(game)

  sorted_list = sorted(refetch_highscore_data, key=lambda x: int(itemgetter("score")(x)), reverse=True)

  response = {
    "statusCode": 200,
    "headers":{"Access-Control-Allow-Origin":"*"},
    "body": json.dumps({"message": sorted_list})
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
        "id": item.get("pk"),
        "name": item.get("name")
      }
      scores.append(row)
    return scores
  except Exception as e:
    print(e.response['Error']['Message'])
    return 500


def evaluate_score(body, highscore_data):
  # sort the scores to find the lowest score to evaluate against
  sorted_scores = sorted(highscore_data, key=lambda x: int(itemgetter("score")(x)))
  if (len(sorted_scores) < 5) or (int(body.get("score")) >= int(sorted_scores[0].get("score"))):
    # add new score
    table.put_item(
      Item={
        "pk": str(body.get("userId")),
        "highscore": str(body.get("score")),
        "sk": "project:{}".format(body.get("project")),
        "name": body.get("userName")
      }
    )
    # remove lowest score
    if len(sorted_scores) >= 5:
      table.delete_item(
        Key={
          "pk": str(sorted_scores[0].get("id")),
          "sk": "project:{}".format(body.get("project"))
        }
      )
  return 'ok'