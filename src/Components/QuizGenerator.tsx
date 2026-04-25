'use client';

import React, { useState } from 'react';
import { 
  TextInput, 
  Button, 
  FileInput, 
  Stack, 
  Group, 
  Text, 
  Paper, 
  rem,
  Alert
} from '@mantine/core';
import { IconUpload, IconFileCheck, IconAlertCircle } from '@tabler/icons-react';

export const QuizGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text) return setError("Please enter some lecture text first.");
    
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('user_id', 'demo_user_123'); 
    if (file) formData.append('image', file);

    try {
      // Points to FastAPI via the rewrite in next.config.mjs
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 429) {
        throw new Error("Daily quiz limit reached!");
      }

      if (!res.ok) throw new Error("Server error occurred");

      const data = await res.json();
      console.log("Quiz Generated Successfully:", data);
      alert("Quiz Generated! Check console for data.");
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="md" p="xl" withBorder style={{ maxWidth: 500, margin: '40px auto' }}>
      <Stack gap="md">
        <Text size="xl" fw={700} ta="center">Distudy AI Quiz</Text>
        
        {error && (
          <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />}>
            {error}
          </Alert>
        )}

        <TextInput
          label="Lecture Topic or Content"
          placeholder="Paste lecture notes or a summary..."
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)}
          required
        />

        <FileInput
          label="Add Image (Optional)"
          placeholder="Upload lecture slide"
          accept="image/png,image/jpeg"
          leftSection={<IconUpload style={{ width: rem(18), height: rem(18) }} />}
          value={file}
          onChange={setFile}
          clearable
          description="Gemini will analyze the image for questions"
        />

        <Group justify="flex-end" mt="md">
          <Button 
            onClick={handleSubmit} 
            loading={loading}
            fullWidth
            leftSection={!loading && <IconFileCheck size={18} />}
          >
            {loading ? 'Analyzing with Gemini...' : 'Generate Quiz'}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};