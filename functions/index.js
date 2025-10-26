const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

// Get environment variables
const KIBANA_API_KEY = functions.config().kibana?.api_key;
const FISH_AUDIO_API_TOKEN = functions.config().fish?.api_token;

exports.converse = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log("🚀 Proxy function called:", {
      method: req.method,
      hasApiKey: !!KIBANA_API_KEY,
    });

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    if (!KIBANA_API_KEY) {
      return res.status(500).json({
        error: "Server configuration error: Kibana API key not configured",
      });
    }

    try {
      const response = await fetch(
        "https://outdrobe.kb.us-central1.gcp.cloud.es.io/api/agent_builder/converse",
        {
          method: "POST",
          headers: {
            Authorization: `Apikey ${KIBANA_API_KEY}`,
            "Content-Type": "application/json",
            "kbn-xsrf": "true",
          },
          body: JSON.stringify(req.body),
        }
      );

      console.log("✅ Kibana API response:", {
        status: response.status,
        statusText: response.statusText,
      });

      const data = await response.json();
      console.log("📋 Returning data to client");
      res.status(response.status).json(data);
    } catch (error) {
      console.error("❌ Kibana proxy error:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  });
});

// Text-to-Speech function using Fish Audio API
exports.tts = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log("🔊 TTS function called:", {
      method: req.method,
      hasApiToken: !!FISH_AUDIO_API_TOKEN,
      textLength: req.body?.text?.length || 0,
    });

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    if (!FISH_AUDIO_API_TOKEN) {
      return res.status(500).json({
        error:
          "Server configuration error: Fish Audio API token not configured",
      });
    }

    if (!req.body.text) {
      return res.status(400).json({ error: "Missing text in request body" });
    }

    try {
      const response = await fetch("https://api.fish.audio/v1/tts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FISH_AUDIO_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: req.body.text,
          model: "e686ae649ee44f219a108aacba206c1a",
          format: "mp3",
        }),
      });

      console.log("✅ Fish Audio TTS response:", {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Fish Audio TTS error:", errorText);
        return res.status(response.status).json({
          error: "TTS API error",
          details: errorText,
        });
      }

      // Forward the audio blob response
      const audioBuffer = await response.arrayBuffer();
      console.log("📋 Returning audio buffer, size:", audioBuffer.byteLength);

      res.set({
        "Content-Type": response.headers.get("content-type") || "audio/mpeg",
        "Content-Length": audioBuffer.byteLength,
      });

      res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error("❌ TTS function error:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  });
});

// Speech-to-Text function using Fish Audio API
exports.stt = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log("🎤 STT function called:", {
      method: req.method,
      hasApiToken: !!FISH_AUDIO_API_TOKEN,
      contentType: req.headers["content-type"],
    });

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    if (!FISH_AUDIO_API_TOKEN) {
      return res.status(500).json({
        error:
          "Server configuration error: Fish Audio API token not configured",
      });
    }

    try {
      // Forward the entire request body and headers to Fish Audio
      const response = await fetch("https://api.fish.audio/v1/asr", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FISH_AUDIO_API_TOKEN}`,
          "Content-Type": req.headers["content-type"],
        },
        body: req.body,
      });

      console.log("✅ Fish Audio STT response:", {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Fish Audio STT error:", errorText);
        return res.status(response.status).json({
          error: "STT API error",
          details: errorText,
        });
      }

      const data = await response.json();
      console.log("📋 Returning transcription data");
      res.status(200).json(data);
    } catch (error) {
      console.error("❌ STT function error:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  });
});
