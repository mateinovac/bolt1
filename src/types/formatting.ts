export interface Section {
  type: 'text' | 'code' | 'hr';
  content: string;
  language?: string;
}
