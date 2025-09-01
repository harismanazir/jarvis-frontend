import { WebcamStream } from "@/components/webcam-stream";
import { ChatBox } from "@/components/chat-box";
import { AudioRecorder } from "@/components/audio-recorder";
import { VoicePlayer } from "@/components/voice-player";
import { useState } from "react";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface AudioResponse {
  url: string;
  isPlaying: boolean;
}

export function JarvisUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioResponse, setAudioResponse] = useState<AudioResponse | null>(null);

  const addMessage = (text: string, isUser: boolean = true) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearChat = () => {
    setMessages([]);
    setAudioResponse(null);
  };

  const handleApiResponse = (response: any) => {
    if (response.response) {
      addMessage(response.response, false);
    }
    if (response.audio_url) {
      setAudioResponse({
        url: `http://localhost:8000${response.audio_url}`,
        isPlaying: false
      });
    }
  };

  return (
    <main className="pt-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Webcam Stream */}
          <WebcamStream />

          {/* Chat Interface Column */}
          <div className="chat-container flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
            
            {/* Chat Box */}
            <ChatBox 
              messages={messages}
              isLoading={isLoading}
              onSendMessage={addMessage}
              onClearChat={clearChat}
              onApiResponse={handleApiResponse}
              setIsLoading={setIsLoading}
            />

            {/* Audio Recorder */}
            <AudioRecorder 
              onApiResponse={handleApiResponse}
              setIsLoading={setIsLoading}
            />

            {/* Voice Player */}
            {audioResponse && (
              <VoicePlayer 
                audioResponse={audioResponse}
                setAudioResponse={setAudioResponse}
              />
            )}

          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <div>
                <h3 className="font-medium text-foreground">Jarvis is thinking...</h3>
                <p className="text-sm text-muted-foreground">Analyzing your request</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
