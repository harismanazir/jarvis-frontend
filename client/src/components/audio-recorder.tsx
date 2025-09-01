import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendAudioMessage } from "@/lib/api";

interface AudioRecorderProps {
  onApiResponse: (response: any) => void;
  setIsLoading: (loading: boolean) => void;
}

export function AudioRecorder({ onApiResponse, setIsLoading }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Create URL for recorded audio playback and store blob
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setRecordedBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleSendAudio = async () => {
    if (!recordedBlob) return;
    
    setIsSending(true);
    setIsLoading(true);
    try {
      const response = await sendAudioMessage(recordedBlob);
      onApiResponse(response);
      
      // Clear the recorded audio after sending
      setRecordedAudio(null);
      setRecordedBlob(null);
      setIsPlayingRecorded(false);
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to send audio to Jarvis API",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudioRef.current && recordedAudio) {
      recordedAudioRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const pauseRecordedAudio = () => {
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      setIsPlayingRecorded(false);
    }
  };

  const toggleRecordedPlayback = () => {
    if (isPlayingRecorded) {
      pauseRecordedAudio();
    } else {
      playRecordedAudio();
    }
  };

  const startNewRecording = () => {
    // Clear existing recording
    setRecordedAudio(null);
    setRecordedBlob(null);
    setIsPlayingRecorded(false);
    // Start new recording
    startRecording();
  };

  return (
    <div className="mt-4 bg-card border border-border rounded-xl shadow-sm p-3">
      {recordedAudio && (
        <audio 
          ref={recordedAudioRef}
          src={recordedAudio}
          onEnded={() => setIsPlayingRecorded(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            </svg>
            <span className="text-sm font-medium text-foreground">Voice Input</span>
          </div>
          
          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-recording"></div>
              <span className="text-xs text-red-500 font-medium">Recording...</span>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        <div className="flex items-center space-x-2">
          {/* Record Button */}
          {!isRecording && !recordedAudio && (
            <Button
              onClick={startRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background"
              data-testid="start-recording"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium">Record</span>
            </Button>
          )}

          {/* Record New Button */}
          {recordedAudio && !isRecording && (
            <Button
              onClick={startNewRecording}
              variant="outline"
              className="flex items-center space-x-2 px-3 py-2 text-sm transition-colors"
              data-testid="record-new"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium">New</span>
            </Button>
          )}

          {/* Stop Recording Button */}
          {isRecording && (
            <Button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-background"
              data-testid="stop-recording"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium">Stop</span>
            </Button>
          )}

          {/* Play Button */}
          {recordedAudio && !isRecording && (
            <Button
              onClick={toggleRecordedPlayback}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
              data-testid="play-recorded"
            >
              {isPlayingRecorded ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
              )}
              <span className="text-sm font-medium">{isPlayingRecorded ? 'Pause' : 'Play'}</span>
            </Button>
          )}

          {/* Send Button */}
          {recordedAudio && !isRecording && (
            <Button
              onClick={handleSendAudio}
              disabled={isSending}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="send-audio"
            >
              {isSending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              )}
              <span className="text-sm font-medium">Send</span>
            </Button>
          )}
        </div>
      </div>

      {/* Audio Visualization */}
      <div className="px-3 pb-3 pt-2">
        <div className="h-8 bg-muted/50 rounded-lg flex items-center justify-center">
          <div className="flex items-end space-x-1">
            <div className={`w-1 h-2 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/30'}`}></div>
            <div className={`w-1 h-4 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/50'}`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-1 h-3 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/40'}`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`w-1 h-6 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/60'}`} style={{ animationDelay: '0.3s' }}></div>
            <div className={`w-1 h-2 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/30'}`} style={{ animationDelay: '0.4s' }}></div>
            <div className={`w-1 h-4 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/50'}`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`w-1 h-5 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/55'}`} style={{ animationDelay: '0.6s' }}></div>
            <div className={`w-1 h-3 rounded-full transition-colors ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/40'}`} style={{ animationDelay: '0.7s' }}></div>
            <span className="text-xs text-muted-foreground ml-3">
              {isRecording ? 'Recording...' : recordedAudio ? 'Recording ready - Play or Send' : 'Ready to record'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
