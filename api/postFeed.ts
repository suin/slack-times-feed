import type { VercelRequest, VercelResponse } from "@vercel/node";
// import { WebClient } from "@slack/web-api";

export default async (request: VercelRequest, response: VercelResponse) => {
  console.log(request.body);
  const { body } = request;

  if (body.type === "url_verification") {
    return urlVerification(request, response);
  }

  if (body.type === "event_callback") {
    return handleEvent(request, response);
  }
  response.status(200).end();
};

// const postMessage = async () => {
//   const web = new WebClient("");
//   const permalink = "";
//   await web.chat.postMessage({
//     channel: "suin_test",
//     text: `<${permalink}|\u{200B}>`,
//     unfurl_links: true,
//   });
// };

const urlVerification = (request: VercelRequest, response: VercelResponse) => {
  response.status(200).send({ challenge: request.body.challenge });
};

const handleEvent = (request: VercelRequest, response: VercelResponse) => {
  const { body } = request;
  const { event } = body;
  if (event.type !== "message") {
    console.log("event.type is not message");
    response.end();
    return;
  }
  if (typeof event.subtype === "string") {
    console.log(`event.subtype is ${event.subtype}`);
    response.end();
    return;
  }
  console.log("event handled", event);
  response.status(200).send("OK");
};
