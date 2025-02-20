const documentPhrases = [
  "Here's your Google Document",
  "I've prepared the document for you",
  "Your document is ready",
  "Here's the document you requested",
  "I've got your document ready",
  "Your Google Doc is available here",
  "Here's the document link for you",
  "I've created a document for you",
  "Your requested document is ready",
  "Here's access to your document"
];

export const getRandomDocumentPhrase = (): string => {
  const randomIndex = Math.floor(Math.random() * documentPhrases.length);
  return documentPhrases[randomIndex];
};
