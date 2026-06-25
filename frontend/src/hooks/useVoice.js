import { useRef, useCallback } from 'react';

export const useVoice = () => {
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const isSupported = () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const startListening = useCallback((onResult, onError, language = 'en-IN') => {
    if (!isSupported()) {
      onError?.('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult?.(transcript);
    };

    recognition.onerror = (event) => {
      onError?.(event.error);
    };

    recognition.start();
    return recognition;
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const speak = useCallback((text, language = 'en', onEnd) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to get a suitable voice
    const voices = synthRef.current.getVoices();
    const targetVoice = voices.find(v =>
      language === 'ta'
        ? v.lang.includes('ta')
        : (v.lang.includes('en') && v.name.includes('Google'))
    );
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onend = onEnd;
    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
  }, []);

  const isSpeaking = () => synthRef.current.speaking;

  return {
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSpeaking,
  };
};
