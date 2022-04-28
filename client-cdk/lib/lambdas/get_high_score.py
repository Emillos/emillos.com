import os
import boto3
from boto3.dynamodb.conditions import Key
import json

dynamodb = boto3.resource('dynamodb')
tableName = os.environ["TABLE"]
tableIndex = os.environ["TABLE_INDEX"]
table = dynamodb.Table(tableName)

def handler(event, context):
	game = event.get("queryStringParameters").get("project")

	# find highscores in dynamodb
	highscore_data = fetch_from_dynamodb(game)
		
	response = {
		"statusCode": 200,
		"body": json.dumps({"message": highscore_data})
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
