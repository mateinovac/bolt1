import { LucideIcon, Pencil, Code, Image, Video, Presentation, FileText, 
  Music, Volume2, ShieldOff, FileSearch, Youtube, Sparkles,
  MessageSquare } from 'lucide-react';

export interface Feature {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

export const features: Feature[] = [
  {
    id: 1,
    title: "Generate Copy",
    icon: Pencil,
    description: "Create engaging and professional copy for any purpose"
  },
  {
    id: 2,
    title: "Generate Code",
    icon: Code,
    description: "Write clean, efficient code in multiple programming languages"
  },
  {
    id: 3,
    title: "Image Gen & Editing",
    icon: Image,
    description: "Create and edit images with advanced AI capabilities"
  },
  {
    id: 4,
    title: "Video Gen & Editing",
    icon: Video,
    description: "Generate and modify videos with AI assistance"
  },
  {
    id: 5,
    title: "PowerPoint Generation",
    icon: Presentation,
    description: "Create professional presentations automatically"
  },
  {
    id: 6,
    title: "Google Doc Generation",
    icon: FileText,
    description: "Generate comprehensive documents with AI"
  },
  {
    id: 7,
    title: "Sound & Audio Generation",
    icon: Volume2,
    description: "Create custom sound effects and audio content"
  },
  {
    id: 8,
    title: "Music Generation",
    icon: Music,
    description: "Compose unique music tracks with AI"
  },
  {
    id: 9,
    title: "Uncensored AI",
    icon: ShieldOff,
    description: "Access unrestricted AI capabilities"
  },
  {
    id: 10,
    title: "Uncensored Image Gen",
    icon: Sparkles,
    description: "Generate unrestricted images with AI"
  },
  {
    id: 11,
    title: "Document & Image Analysis",
    icon: FileSearch,
    description: "Analyze documents and images with AI"
  },
  {
    id: 12,
    title: "YouTube Video Analysis",
    icon: Youtube,
    description: "Extract insights from YouTube videos"
  },
  {
    id: 13,
    title: "Advanced Chat Capabilities",
    icon: MessageSquare,
    description: "Engage in sophisticated AI conversations"
  }
];
