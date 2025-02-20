// Simulates a delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockUploadImage(file: File): Promise<string> {
  await delay(1500); // Simulate network delay
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Return the base64 data URL as the "uploaded" image URL
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
