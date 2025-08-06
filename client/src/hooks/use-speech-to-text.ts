import { useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export function useSpeechWithAudio(
  onTranscript: (text: string, audio: Blob) => void
) {
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    const startNewRecording = async () => {
      // Stop any existing stream
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          recorderRef.current!.getBlob();
          recorderRef.current = null;
        });
      }

      // Get audio stream if not already available
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const recorder = new RecordRTC(streamRef.current, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
      });

      recorderRef.current = recorder;
      recorder.startRecording();
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    // ✅ Start recording when speech is detected
    recognition.onspeechstart = () => {
      if (!recorderRef.current) {
        startNewRecording();
      }
    };

    recognition.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();

          // Stop recording and send transcript + audio
          if (recorderRef.current) {
            recorderRef.current.stopRecording(() => {
              const audioBlob = recorderRef.current!.getBlob();
              onTranscript(text, audioBlob);
              // socket.emit("transcript", text);
              socket.emit("audio-file", { blob: audioBlob });

              recorderRef.current = null;

              // Immediately start a new recording for next speaker
              startNewRecording();
            });
          }
        } else if (i === e.resultIndex && !recorderRef.current) {
          // Start recording on first detected speech
          startNewRecording();
        }
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {});
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
}
