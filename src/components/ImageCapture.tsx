import { useState, useCallback, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageCaptureProps {
  onImageCapture: (base64: string) => void;
  isProcessing: boolean;
}

export function ImageCapture({ onImageCapture, isProcessing }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      onImageCapture(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageCapture]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    onImageCapture(dataUrl.split(",")[1]);
    stopCamera();
  }, [onImageCapture]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="space-y-4">
      {!cameraActive && !preview && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-32 flex-col gap-2 border-2 border-dashed border-slate-300 hover:border-accent hover:bg-accent/5 rounded-xl transition-all"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload className="h-8 w-8 text-secondary" />
            <span className="text-sm text-slate-600 font-medium">Upload Image</span>
            <span className="text-xs text-slate-500">JPG, PNG</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex-col gap-2 border-2 border-dashed border-slate-300 hover:border-accent hover:bg-accent/5 rounded-xl transition-all"
            onClick={startCamera}
            disabled={isProcessing}
          >
            <Camera className="h-8 w-8 text-secondary" />
            <span className="text-sm text-slate-600 font-medium">Take Photo</span>
            <span className="text-xs text-slate-500">Use Camera</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {cameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 pointer-events-none border-4 border-secondary/30" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <Button onClick={capturePhoto} className="bg-secondary hover:bg-secondary/90 shadow-lg">
              <Camera className="h-5 w-5 mr-2" />
              Capture
            </Button>
            <Button variant="outline" onClick={stopCamera} className="bg-white/90 backdrop-blur-sm border border-slate-200">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {preview && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group">
          <img src={preview} alt="Captured" className="w-full max-h-96 object-contain" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-3 right-3 h-9 w-9 shadow-lg"
            onClick={clearPreview}
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
