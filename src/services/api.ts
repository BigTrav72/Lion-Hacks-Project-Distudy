const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchQuiz = async (text: string) => {
  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.json();
};
