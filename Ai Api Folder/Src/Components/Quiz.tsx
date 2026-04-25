// frontend/services/quizService.ts
export const generateQuiz = async (text: string, imageFile: File | null, userId: string) => {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("user_id", userId);
  if (imageFile) formData.append("image", imageFile);

  const response = await fetch("http://localhost:8000/generate-quiz", {
    method: "POST",
    body: formData, // No 'Content-Type' header; browser sets it automatically
  });

  if (response.status === 429) {
    throw new Error("Daily quiz limit reached! Earn more points tomorrow.");
  }

  return response.json();
};