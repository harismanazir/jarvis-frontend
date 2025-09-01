import Webcam from "react-webcam";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

export function WebcamStream() {
  const webcamRef = useRef<Webcam>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const toggleCamera = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return (
    <div className="webcam-container" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="bg-card border border-border rounded-xl shadow-sm h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">Live Camera</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCamera}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Camera Settings"
              data-testid="camera-settings"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Camera Feed Area */}
        <div className="relative h-full bg-muted flex items-center justify-center">
          {isEnabled ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover rounded-b-xl"
              data-testid="webcam-stream"
            />
          ) : (
            <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <p className="text-sm text-gray-400">Camera is disabled</p>
                <p className="text-xs text-gray-500 mt-1">Click settings to enable</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
