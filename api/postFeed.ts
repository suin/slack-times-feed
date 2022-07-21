import type { VercelRequest, VercelResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";

const feedChannel = process.env["FEED_CHANNEL"]!;
const web = new WebClient(process.env["TOKEN"]!);

export default async (request: VercelRequest, response: VercelResponse) => {
  const { body } = request;
  if (body.type === "url_verification") {
    return urlVerification(request, response);
  }
  if (body.type === "event_callback") {
    return handleEvent(request, response);
  }
  response.status(200).end();
};

const urlVerification = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  console.log(request.body);
  await web.chat.postMessage({
    channel: feedChannel,
    text: `Test message`,
  });
  response.status(200).send({ challenge: request.body.challenge });
};

const handleEvent = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  const { body } = request;
  const { event } = body;
  if (event.type !== "message") {
    console.log("event.type is not message");
    console.dir(event, { depth: Infinity });
    response.end();
    return;
  }
  if (!isFeedableMessage(event)) {
    console.log(`event.subtype is ${event.subtype}`);
    console.dir(event, { depth: Infinity });
    response.end();
    return;
  }
  if (event.channel === feedChannel) {
    console.log(`event.channel is feed channel ${event.channel}`);
    response.end();
    return;
  }
  if (textStartsWithOnion(event)) {
    console.log("text starts with onion🧅");
    console.dir(event, { depth: Infinity });
    response.end();
    return;
  }
  console.log("feeding a message");
  console.dir(event, { depth: Infinity });
  const { permalink } = await web.chat.getPermalink({
    channel: event.channel,
    message_ts: event.ts,
  });
  console.log({ permalink });
  await web.chat.postMessage({
    channel: feedChannel,
    text: `<${permalink}|source>`,
    unfurl_links: true,
  });
  response.status(200).send("OK");
};

const isFeedableMessage = ({ subtype }: any): boolean => {
  if (typeof subtype !== "string") {
    return true;
  }
  if (subtype === "file_share") {
    return true;
  }
  return false;
};

const textStartsWithOnion = ({ text }: any): boolean => {
  if (typeof text !== "string") {
    return false;
  }
  return text.startsWith(":onion:");
};
