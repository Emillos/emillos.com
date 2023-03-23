# Dead man switch
This project allows users to upload documents which will be exposed to predefined email adresses if a checek-in is not fufilled

## Tools
- S3 for document storage
- Lambda for controlling upload
- Dynamodb for database
- Apigateway for rest
- Lambda reseting the cron job after each invocation
- Cloudwatch for time management

## Whats new?
- Manipulation of cloudwatch jobs
- CDK multistack

## Architecture
### Three different invokations:
- User sets a switch as active
- User checks in
- Cloudwatch activates due to schedule

#### User sets a switch as active: 
- Sets the time on the switch in dynamodb in epoch
- Check if swich epoch is lower or matches rule: 
 - If the new epoch is lower than rule - update rule with new time

#### User checks in
- Epoch on switch is updated to rule defined by user
- Check if new epoch is lower then current cloudwatch rule:
 - If yes update cloudwatch to new epoch

#### Cloudwatch activates due to schedule
- Check Dynamodb for amount of active switches with this time as trigger
- Set the switches to status=inactive and invoked=true
- Find the next switch looking at epoch and status active and update the cloudwatch
- invoke the mail flow to send the documents to the defined recievers

## Notes
### DynamoDB - create SGI with epoch as SK to be able to sort by epoch
- pk: project:switch
- sk: Epoch
- active: Bool
- invoked: Bool
- user: user_id

### S3
- When a user uploads document, a new folder (name: user_id) is created and the documents uploaded to it

