interface ParsedMessage {
  mainContent: string;
  thoughtProcess?: string;
}

export function parseMessage(text: string): ParsedMessage {
  // Trim only trailing whitespace but preserve leading whitespace
  const trimmedText = text.replace(/\s+$/, '');

  const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
  
  if (!thinkMatch) {
    return { mainContent: trimmedText };
  }

  // Remove the think tags and any extra whitespace they might create
  const mainContent = trimmedText
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\s+$/, '');

  const thoughtProcess = thinkMatch[1].trim();

  return {
    mainContent,
    thoughtProcess
  };
}
