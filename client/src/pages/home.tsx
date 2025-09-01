import { Navbar } from "@/components/navbar";
import { JarvisUI } from "@/components/jarvis-ui";

export default function Home() {
  return (
    <div className="font-sans antialiased transition-colors duration-300">
      <Navbar />
      <JarvisUI />
    </div>
  );
}
