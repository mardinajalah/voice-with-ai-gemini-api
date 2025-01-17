import { useState, useEffect } from "react";

export default function VoiceChat() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      fetchResponse(text);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }, [listening]);

  const fetchResponse = async (text) => {
    try {
      const res = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await res.json();
      setResponse(data.response || "Maaf, tidak ada balasan.");
      speakResponse(data.response || "Maaf, tidak ada balasan.");
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Terjadi kesalahan, coba lagi nanti.");
    }
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"; // Ensure speech synthesis uses Indonesian

    // Get all available voices
    const voices = synth.getVoices();

    // Find a natural-sounding voice (e.g., 'Google UK English Male' or others)
    const naturalVoice = voices.find((voice) => voice.name.includes("Google")) || voices[0];
    utterance.voice = naturalVoice;

    synth.speak(utterance);
  };

  const handleStartListening = () => {
    setListening(true);
  };

  const handleStopListening = () => {
    setListening(false);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-6 w-11/12 md:w-1/2'>
        <h1 className='text-2xl font-bold text-gray-800 text-center mb-4'>Gemini Voice Chat</h1>

        {/* Start/Stop Listening Button */}
        <div className='flex justify-center mb-6'>
          <button onClick={listening ? handleStopListening : handleStartListening} className={`px-4 py-2 rounded-md text-white font-medium ${listening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}>
            {listening ? "Stop Listening" : "Start Listening"}
          </button>
        </div>

        {/* User Input */}
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-700'>Your Input:</h3>
          <p className='text-gray-600 p-2 bg-gray-100 rounded-md'>{transcript}</p>
        </div>

        {/* Gemini Response */}
        <div>
          <h3 className='text-lg font-semibold text-gray-700'>Gemini Response:</h3>
          <p className='text-gray-600 p-2 bg-gray-100 rounded-md'>{response}</p>
        </div>
      </div>
    </div>
  );
}
