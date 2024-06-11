
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient({ region: "us-east-1" });


export const handler = (event, context, callback) => {
    console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(async record => {

        console.log(record.eventName);
        console.log(`DynamoDB Record: ${JSON.stringify(record.dynamodb)}`);

        // //set variables from dynamodb 
        let oldImageObj;
        oldImageObj = record.dynamodb.OldImage
        console.log(oldImageObj)

        let senderEmail;
        senderEmail = oldImageObj.user_id["S"]

        let message;
        message = oldImageObj.message["S"]

        message = "This is your reminder for : " + message
        let ttl 
        ttl = oldImageObj.ttl["N"]


        const source = "email"; //email address

        //Create sendEmail params
        const command = new SendEmailCommand({

            Destination: {
                /* required */
                ToAddresses: [
                    senderEmail
                ],
            },
            Message: {
                /* required */
                Body: {
                    /* required */

                    Html: {
                        Charset: "UTF-8",
                        Data: message
                    },

                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "THIS IS YOUR REMINDER",
                },
            },
            Source: source 
        });

        try {
    
            let response = await ses.send(command);
            // process data.
            console.log("await for response from ses ")
            console.log(JSON.stringify(response))

            return response;
        }
        catch (error) {
            // error handling.
            console.log(JSON.stringify(error))
        }
        finally {
            //todo.
        }

    });
    callback(null, "message");
};




  







