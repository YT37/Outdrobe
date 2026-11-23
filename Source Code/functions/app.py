import json
import logging
import os
from typing import Any, Dict, Optional

import requests
from flask import Flask, Response, jsonify, request
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(
    app,
    origins=["http://localhost:3000", "https://outdrobe.tech"],
    supports_credentials=True,
)

# Environment variables
KIBANA_API_KEY = os.getenv("KIBANA_API_KEY")
FISH_API_KEY = os.getenv("FISH_API_KEY")

# Configuration
SERVER_URL = "http://35.243.226.83:8080"


def log_request_info(endpoint: str, method: str, **kwargs) -> None:
    logger.info(f"🚀 {endpoint} function called: method={method}, {kwargs}")


def handle_error(error: Exception, endpoint: str) -> tuple[Dict[str, Any], int]:
    logger.error(f"❌ {endpoint} error: {error}")
    return {"error": "Internal server error", "details": str(error)}, 500


@app.route("/converse", methods=["POST", "OPTIONS"])
def converse():
    if request.method == "OPTIONS":
        return "", 200

    log_request_info("Proxy", "POST", hasApiKey=bool(KIBANA_API_KEY))

    if not KIBANA_API_KEY:
        return (
            jsonify(
                {"error": "Server configuration error: Kibana API key not configured"}
            ),
            500,
        )

    try:
        response = requests.post(
            "https://outdrobe.kb.us-central1.gcp.cloud.es.io/api/agent_builder/converse",
            headers={
                "Authorization": f"Apikey {KIBANA_API_KEY}",
                "Content-Type": "application/json",
                "kbn-xsrf": "true",
            },
            json=request.get_json(),
            timeout=30,
        )

        logger.info(
            f"✅ Kibana API response: status={response.status_code}, statusText={response.reason}"
        )

        # Return the response
        logger.info("📋 Returning data to client")
        return response.json(), response.status_code

    except Exception as error:
        return jsonify(handle_error(error, "Kibana proxy")[0]), 500


@app.route("/tts", methods=["POST", "OPTIONS"])
def tts():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    text_length = len(data.get("text", "")) if data else 0

    log_request_info(
        "TTS", "POST", hasApiToken=bool(FISH_API_KEY), textLength=text_length
    )

    if not FISH_API_KEY:
        return (
            jsonify(
                {
                    "error": "Server configuration error: Fish Audio API token not configured"
                }
            ),
            500,
        )

    if not data or not data.get("text"):
        return jsonify({"error": "Missing text in request body"}), 400

    try:
        response = requests.post(
            "https://api.fish.audio/v1/tts",
            headers={
                "Authorization": f"Bearer {FISH_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "text": data["text"],
                "model": "e686ae649ee44f219a108aacba206c1a",
                "format": "mp3",
            },
            timeout=30,
        )

        logger.info(
            f"✅ Fish Audio TTS response: status={response.status_code}, "
            f"contentType={response.headers.get('content-type')}"
        )

        if not response.ok:
            logger.error(f"❌ Fish Audio TTS error: {response.text}")
            return (
                jsonify({"error": "TTS API error", "details": response.text}),
                response.status_code,
            )

        # Return the audio response
        logger.info(f"📋 Returning audio buffer, size: {len(response.content)}")

        return Response(
            response.content,
            mimetype=response.headers.get("content-type", "audio/mpeg"),
            headers={"Content-Length": str(len(response.content))},
        )

    except Exception as error:
        return jsonify(handle_error(error, "TTS function")[0]), 500


@app.route("/stt", methods=["POST", "OPTIONS"])
def stt():
    if request.method == "OPTIONS":
        return "", 200

    log_request_info(
        "STT",
        "POST",
        hasApiToken=bool(FISH_API_KEY),
        contentType=request.headers.get("content-type"),
    )

    if not FISH_API_KEY:
        return (
            jsonify(
                {
                    "error": "Server configuration error: Fish Audio API token not configured"
                }
            ),
            500,
        )

    try:
        response = requests.post(
            "https://api.fish.audio/v1/asr",
            headers={
                "Authorization": f"Bearer {FISH_API_KEY}",
                "Content-Type": request.headers.get("content-type"),
            },
            data=request.get_data(),
            timeout=30,
        )

        logger.info(f"✅ Fish Audio STT response: status={response.status_code}")

        if not response.ok:
            logger.error(f"❌ Fish Audio STT error: {response.text}")
            return (
                jsonify({"error": "STT API error", "details": response.text}),
                response.status_code,
            )

        logger.info("📋 Returning transcription data")
        return response.json(), 200

    except Exception as error:
        return jsonify(handle_error(error, "STT function")[0]), 500


@app.route("/classify", methods=["POST", "OPTIONS"])
def classify():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    body_size = len(json.dumps(data)) if data else 0

    log_request_info(
        "Classification",
        "POST",
        contentType=request.headers.get("content-type"),
        bodySize=body_size,
    )

    if not data or not data.get("image"):
        return jsonify({"error": "Missing image data in request body"}), 400

    try:
        logger.info("📡 Forwarding request to classification API...")

        # Forward to classification API
        response = requests.post(
            f"{SERVER_URL}/classify",
            headers={"Content-Type": "application/json"},
            json={"image": data["image"]},
            timeout=60,
        )

        logger.info(
            f"✅ Classification API response: status={response.status_code}, "
            f"statusText={response.reason}, ok={response.ok}"
        )

        if not response.ok:
            error_text = response.text
            logger.error(f"❌ Classification API error: {error_text}")
            return (
                jsonify(
                    {
                        "error": "Classification API error",
                        "details": f"{response.status_code} {response.reason}",
                        "message": error_text,
                    }
                ),
                response.status_code,
            )

        result = response.json()
        logger.info(
            f"🎯 Classification result: type={result.get('type')}, "
            f"color={result.get('color')}, "
            f"caption={result.get('caption', '')[:50]}..."
        )

        return result, 200

    except Exception as error:
        return jsonify(handle_error(error, "Classification function")[0]), 500


@app.route("/health", methods=["GET"])
def health():
    return (
        jsonify(
            {
                "status": "healthy",
                "service": "outdrobe-functions",
                "endpoints": [
                    "/converse",
                    "/tts",
                    "/stt",
                    "/classify",
                ],
            }
        ),
        200,
    )


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return (
        jsonify(
            {
                "error": "Endpoint not found",
                "available_endpoints": [
                    "/converse",
                    "/tts",
                    "/stt",
                    "/classify",
                    "/health",
                ],
            }
        ),
        404,
    )


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({"error": "Internal server error", "details": str(error)}), 500


if __name__ == "__main__":
    # Get port from environment variable or default to 8080
    port = int(os.getenv("PORT", 8080))

    logger.info(f"🚀 Starting Outdrobe Flask Functions server on port {port}")
    logger.info(f"📍 Available endpoints:")
    logger.info(f"  - POST /converse - Kibana API proxy")
    logger.info(f"  - POST /tts - Text-to-Speech")
    logger.info(f"  - POST /stt - Speech-to-Text")
    logger.info(f"  - POST /classify - Image classification")
    logger.info(f"  - GET /health - Server health check")

    # Run the Flask app
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_ENV") == "development")
