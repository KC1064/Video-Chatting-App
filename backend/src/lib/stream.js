const streamChat = require("stream-chat");

const apiKey = process.env.STREAM_API_KEY;
const secretKey = process.env.STREAM_SECRET_KEY;

if (!apiKey || !secretKey) {
  console.error("Stream Credentials are missing");
}

const streamClient = streamChat.StreamChat.getInstance(apiKey, secretKey);

const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    console.log("User created in Stream.");
    return userData;
  } catch (error) {
    console.error(error);
  }
};

module.exports = upsertStreamUser;
