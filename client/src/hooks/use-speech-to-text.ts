import { useEffect } from "react";

export function useSpeechToText(onTranscript: Function) {
  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      // const transcript = Array.from(e.results)
      //   .map((r: any) => r[0].transcript)
      //   .join("");
      // onTranscript(transcript);
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          const statement = result[0].transcript.trim();
          onTranscript(statement); // Handle each complete sentence/phrase
        }
      }
    };
    recognition.start();
    return () => recognition.stop();
  }, []);
}
