exports.handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "No text provided" }) };
    }

    // Node 18 以降では fetch はネイティブ
    const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        text: text
      })
    });

    const data = await slackRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: data.ok, error: data.error || null })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }
};
