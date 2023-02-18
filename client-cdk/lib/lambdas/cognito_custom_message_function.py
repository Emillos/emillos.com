import os
BASE_API = os.environ["BASE_API"]
def handler(event, context):
  code = event.get("request").get("codeParameter")
  user_name = event.get("userName")
  region = event.get("region")
  client_id = event.get("callerContext").get("clientId")
  email = event.get("request").get("userAttributes").get("email")
  if event.get("triggerSource") == "CustomMessage_SignUp":
    target = "signupauth"
    link = '{}{}?code={}&userName={}&clientId={}&region={}&email={}'.format(BASE_API, target, code, user_name, client_id, region, email)

    event["response"]["emailSubject"] = 'Almost there! Confirm your account!'
    event["response"]["emailMessage"] = """
        <h1 style='text-align: center;'>
        You're almost ready!
        </h1>
        <div>
          Click the confirmation link below to confirm your account.
          <a href={}>Click here!</a>
        </div>
        """.format(link)
  
  if event.get("triggerSource") == 'CustomMessage_ForgotPassword':
    target = "pwresetconfirm"
    link = '{}{}?code={}&userName={}&clientId={}&region={}&email={}'.format(BASE_API, target, code, user_name, client_id, region, email)
    event["response"]["emailSubject"] = 'Reset password!'
    event["response"]["emailMessage"] = """
        <p style='text-align: center;'>
        </p>
        <div>
          <h2>Click this link to reset the password for your account.</h2>
          <a href={}>Click here!</a>
          <hr />
          <h3>If you did not request a password reset  - you can disregard this email</h3>
        </div>      
        """.format(link)
  
  return event
  