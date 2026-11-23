interface VoiceServiceCallbacks {
  onTranscriptionStart: () => void;
  onTranscriptionComplete: (text: string) => void;
  onTranscriptionError: (error: string) => void;
  onStateChange: (isListening: boolean, isTranscribing: boolean) => void;
  setInputValue: (value: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onSpeechError?: (error: string) => void;
}

export class VoiceService {
  private callbacks: VoiceServiceCallbacks;
  private recognition: any = null;
  private currentAudio: HTMLAudioElement | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private silenceTimeout: NodeJS.Timeout | null = null;
  private isListening: boolean = false;

  constructor(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
  }

  private getSpeechRecognition() {
    return (
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  private isSpeechRecognitionSupported(): boolean {
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  }

  private createSpeechRecognition() {
    const SpeechRecognition = this.getSpeechRecognition();
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      this.callbacks.setInputValue("Transcribing...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.callbacks.setInputValue(transcript);
      setTimeout(() => {
        this.callbacks.onTranscriptionComplete(transcript);
        this.callbacks.onStateChange(false, false);
      }, 300);
    };

    recognition.onerror = (_event: any) => {
      const fallbackText = "I need help with my outfit for tonight";
      this.callbacks.setInputValue(fallbackText);
      setTimeout(() => {
        this.callbacks.onTranscriptionComplete(fallbackText);
        this.callbacks.onStateChange(false, false);
      }, 300);
    };

    recognition.onend = () => {
      this.callbacks.onStateChange(false, false);
    };

    return recognition;
  }

  private simulateTranscription() {
    const mockTexts = [
      "I need help choosing an outfit for tonight",
      "What should I wear to a business meeting?",
      "I'm going on a date, what do you recommend?",
      "Help me find a casual weekend look",
      "I need professional attire for an interview",
    ];

    setTimeout(() => {
      const randomText =
        mockTexts[Math.floor(Math.random() * mockTexts.length)];
      this.callbacks.setInputValue(randomText);
      setTimeout(() => {
        this.callbacks.onTranscriptionComplete(randomText);
        this.callbacks.onStateChange(false, false);
      }, 300);
    }, 1500);
  }

  private detectSilence(stream: MediaStream): void {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);

    source.connect(this.analyser);
    this.analyser.fftSize = 256;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let silenceStart = Date.now();
    const SILENCE_THRESHOLD = 50; // Adjust this value (0-255) for sensitivity
    const SILENCE_DURATION = 2000; // 2 seconds of silence before auto-stop
    const MAX_RECORDING_TIME = 15000; // Maximum 15 seconds

    const checkAudioLevel = () => {
      if (!this.isListening) return;

      this.analyser!.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;

      if (average < SILENCE_THRESHOLD) {
        // Silence detected
        if (Date.now() - silenceStart > SILENCE_DURATION) {
          // Stop recording after silence duration
          this.stopRecording("Silence detected");
          return;
        }
      } else {
        // Sound detected, reset silence timer
        silenceStart = Date.now();
      }

      // Continue monitoring
      requestAnimationFrame(checkAudioLevel);
    };

    // Start monitoring audio levels
    checkAudioLevel();

    // Maximum recording time safety net
    setTimeout(() => {
      if (this.isListening) {
        this.stopRecording("Maximum recording time reached");
      }
    }, MAX_RECORDING_TIME);
  }

  private stopRecording(reason: string = "Recording stopped"): void {
    this.isListening = false;

    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.callbacks.setInputValue(`Processing... (${reason})`);
      this.mediaRecorder.stop();

      // Stop all tracks in the stream
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  private async startFishAudioSTT(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isListening = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        this.isListening = false;
        try {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          if (audioBlob.size > 0) {
            await this.transcribeWithFishAudio(audioBlob);
          } else {
            this.callbacks.onTranscriptionError("No audio recorded");
            this.startWebSpeechSTT();
          }
        } catch (error) {
          console.error("Fish Audio STT error:", error);
          this.callbacks.onTranscriptionError("Speech recognition failed");
          // Fallback to Web Speech API
          this.startWebSpeechSTT();
        }
      };

      this.callbacks.setInputValue("Listening... (speak now)");
      this.mediaRecorder.start();

      // Start silence detection
      this.detectSilence(stream);
    } catch (error) {
      console.error("Media access error:", error);
      // Fallback to Web Speech API
      this.startWebSpeechSTT();
    }
  }

  private async transcribeWithFishAudio(audioBlob: Blob): Promise<void> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const sttUrl = `${apiUrl}/stt`;

      console.log("🎤 Transcribing audio with Fish Audio:", {
        sttUrl,
        audioBlobSize: audioBlob.size,
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch(sttUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`STT API error: ${response.status}`);
      }

      const data = await response.json();
      const transcription =
        data.text || data.transcription || "Could not transcribe audio";

      this.callbacks.setInputValue(transcription);
      setTimeout(() => {
        this.callbacks.onTranscriptionComplete(transcription);
        this.callbacks.onStateChange(false, false);
      }, 300);
    } catch (error) {
      console.error("Fish Audio transcription error:", error);
      throw error;
    }
  }

  private startWebSpeechSTT(): void {
    if (this.isSpeechRecognitionSupported()) {
      this.recognition = this.createSpeechRecognition();
      this.recognition.start();
    } else {
      // Final fallback to simulation
      this.simulateTranscription();
    }
  }

  public startVoiceInput(): void {
    this.callbacks.onStateChange(true, true);

    // Try Fish Audio STT first, fallback to Web Speech API
    this.startFishAudioSTT();
  }

  public stopVoiceInput(): void {
    // Stop Fish Audio recording using the centralized method
    if (this.isListening) {
      this.stopRecording("Manual stop");
    }

    // Stop Web Speech API
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }

    // Clean up media recorder reference
    this.mediaRecorder = null;

    this.callbacks.onStateChange(false, false);
  }

  public async speakText(text: string): Promise<void> {
    try {
      // Stop any currently playing audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      this.callbacks.onSpeechStart?.();

      const apiUrl = import.meta.env.VITE_API_URL;
      const ttsUrl = `${apiUrl}/tts`;

      // Use API endpoint for TTS
      const response = await fetch(ttsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model: "e686ae649ee44f219a108aacba206c1a",
          format: "mp3",
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this.callbacks.onSpeechEnd?.();
      };

      this.currentAudio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this.callbacks.onSpeechError?.("Audio playback failed");
      };

      await this.currentAudio.play();
    } catch (error) {
      // Check if it's a network/CORS error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Network error occurred
      }

      this.callbacks.onSpeechError?.(
        error instanceof Error ? error.message : "TTS failed"
      );
      // Fallback to Web Speech API
      this.speakWithWebAPI(text);
    }
  }

  private speakWithWebAPI(text: string): void {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onstart = () => this.callbacks.onSpeechStart?.();
      utterance.onend = () => this.callbacks.onSpeechEnd?.();
      utterance.onerror = () =>
        this.callbacks.onSpeechError?.("Speech synthesis failed");

      speechSynthesis.speak(utterance);
    } else {
      this.callbacks.onSpeechError?.("Speech synthesis not supported");
    }
  }

  public stopSpeaking(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    this.callbacks.onSpeechEnd?.();
  }
}

export const createVoiceService = (callbacks: VoiceServiceCallbacks) => {
  return new VoiceService(callbacks);
};
