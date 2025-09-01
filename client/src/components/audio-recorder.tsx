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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
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
        await handleAudioSubmit(audioBlob);
        
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

  const handleAudioSubmit = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const response = await sendAudioMessage(audioBlob);
      onApiResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to send audio to Jarvis API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 bg-card border border-border rounded-xl shadow-sm p-4">
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
          {/* Start Recording Button */}
          {!isRecording && !isProcessing && (
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

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio Visualization */}
      <div className="px-4 pb-4 pt-2">
        <div className="h-12 bg-muted/50 rounded-lg flex items-center justify-center">
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
              {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Ready to record'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
