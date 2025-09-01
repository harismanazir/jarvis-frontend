import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for audio processing
});

export async function sendTextMessage(message: string) {
  const response = await api.post("/ask", {
    message: message,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function sendAudioMessage(audioBlob: Blob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  const response = await api.post("/ask", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getAudioFile(filename: string): Promise<string> {
  const response = await api.get(`/get-audio/${filename}`, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
}
