import { Section } from '../types/formatting';

// Helper to check if a line is a heading
function isHeading(line: string): boolean {
  return /^#{1,6}\s/.test(line);
}

// Helper to check if a line is a list item
function isListItem(line: string): boolean {
  return /^[-*+]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim());
}

// Helper to check if a line is a blockquote
function isBlockquote(line: string): boolean {
  return line.trim().startsWith('>');
}

export function parseText(text: string): Section[] {
  const sections: Section[] = [];
  let currentText = '';
  let inCodeBlock = false;
  let currentLanguage = '';
  let currentCode = '';
  let inList = false;
  let listContent = '';

  // Split text into lines while preserving empty lines
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    // Handle horizontal rule
    if (line.trim() === '---') {
      if (currentText.trim()) {
        sections.push({ type: 'text', content: currentText.trim() });
        currentText = '';
      }
      if (listContent.trim()) {
        sections.push({ type: 'text', content: listContent.trim() });
        listContent = '';
        inList = false;
      }
      sections.push({ type: 'hr', content: '' });
      continue;
    }
    
    // Handle code block start/end
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        if (currentText.trim()) {
          sections.push({ type: 'text', content: currentText.trim() });
          currentText = '';
        }
        if (listContent.trim()) {
          sections.push({ type: 'text', content: listContent.trim() });
          listContent = '';
          inList = false;
        }
        inCodeBlock = true;
        currentLanguage = line.slice(3).trim();
        currentCode = '';
      } else {
        // End of code block
        sections.push({
          type: 'code',
          content: currentCode.trim(),
          language: currentLanguage
        });
        inCodeBlock = false;
        currentCode = '';
        currentLanguage = '';
      }
      continue;
    }

    // Accumulate content based on whether we're in a code block
    if (inCodeBlock) {
      currentCode += line + '\n';
    } else {
      // Check if current line is a list item
      if (isListItem(line)) {
        if (!inList) {
          // If we were accumulating regular text, add it as a section
          if (currentText.trim()) {
            sections.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          inList = true;
        }
        listContent += line + '\n';
      } else if (line.trim() === '' && !isListItem(nextLine)) {
        // End of list
        if (listContent.trim()) {
          sections.push({ type: 'text', content: listContent.trim() });
          listContent = '';
          inList = false;
        }
        if (currentText.trim()) {
          sections.push({ type: 'text', content: currentText.trim() });
          currentText = '';
        }
      } else {
        // Regular text or other formatting
        if (inList) {
          if (line.trim() === '') {
            listContent += line + '\n';
          } else {
            sections.push({ type: 'text', content: listContent.trim() });
            listContent = '';
            inList = false;
            currentText = line + '\n';
          }
        } else {
          currentText += line + '\n';
        }
      }
    }
  }

  // Add any remaining text
  if (currentText.trim()) {
    sections.push({ type: 'text', content: currentText.trim() });
  }
  if (listContent.trim()) {
    sections.push({ type: 'text', content: listContent.trim() });
  }

  return sections;
}
