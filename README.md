# Intro
This repo is my playground.
I'm generally testing out services provided by AWS.

You can check it out here [emillos.com](http://emillos.com/)

# IaC (Infrastructure as code)
Using AWS-CDK V.2 to manage the application 

# Containers
This project was initially deployed to Elastic Beanstalk, however to reduce cost, it has now been moved to a S3 as a static website.
Even though they are now longer used, the Docker and NGINX files are still kept, should anyone be courious to see examples.

# CI/CD
Using aws code pipeline

# Database
Using DynamoDB with a single-table design.
By using a Global secondary index on the "sortkey" I can the query the exact row im looking for.

# Server
Using Lambda functions to handle client requests through Api Gateway, is by far the cheepest way for a project of this size.