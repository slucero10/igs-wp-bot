import dialogflow from '@google-cloud/dialogflow';
import {} from 'dotenv/config';

const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
};

const sessionClient = new dialogflow.SessionsClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials,
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
export async function sendToDialogFlow(msg, session, params) {
    let textToDialogFlow = msg;
    try {
        const sessionPath = sessionClient.projectAgentSessionPath(
            process.env.GOOGLE_PROJECT_ID,
            session
        );

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: textToDialogFlow,
                    languageCode: process.env.DF_LANGUAGE_CODE,
                },
            },
            queryParams: {
                payload: {
                    data: params,
                },
            },
        };
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        console.log("[MENSAJE RECIBIDO] INTENT EMPAREJADO: ", result.intent.displayName);
        let defaultResponses = [];
        if (result.action !== "input.unknown") {
            result.fulfillmentMessages.forEach((element) => {
                defaultResponses.push(element);
            });
        }
        if (defaultResponses.length === 0) {
            result.fulfillmentMessages.forEach((element) => {
                if (element.platform === "PLATFORM_UNSPECIFIED") {
                    defaultResponses.push(element);
                }
            });
        }
        result.fulfillmentMessages = defaultResponses;
        return result;
    } catch (e) {
        console.log(e);
    }
}
