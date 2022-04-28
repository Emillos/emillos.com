import os
import boto3
from boto3.dynamodb.conditions import Key
import json
from operator import itemgetter
from pprint import pprint
dynamodb = boto3.resource('dynamodb')
tableName = os.environ["TABLE"]
tableIndex = os.environ["TABLE_INDEX"]
table = dynamodb.Table(tableName)

def handler(event, context):
	body = json.loads(event.get("body"))
	game = body.get("project")
	# get name from body

	# Find highscores in dynamodb
	highscore_data = fetch_from_dynamodb(game)

	# Evaluate on guess
	evaluation = evaluate_score(body, highscore_data)
	
	# Fetch and return the updated highscore_data 
	refetch_highscore_data = fetch_from_dynamodb(game)
	
	response = {
		"statusCode": 200,
		"body": json.dumps({"message": refetch_highscore_data})
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
	sorted_scores = sorted(highscore_data, key=itemgetter('score'), reverse=True)
	if int(body.get("score")) >= int(sorted_scores[-1].get("score")):
		# add new score
		table.put_item(
			Item={
				"pk": str(body.get("userId")),
				"highscore": str(body.get("score")),
				"sk": "project:{}".format(body.get("project")),
				"name": "test"
			}
		)
		# remove lowest score
		if len(sorted_scores) >= 5:
			table.delete_item(
				Key={
					"pk": str(sorted_scores[-1].get("id")),
					"sk": "project:{}".format(body.get("project"))
				}
			)
	return 'ok'