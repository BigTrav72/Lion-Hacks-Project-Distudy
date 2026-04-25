import React, { useState } from 'react';
import { 
  TextInput, 
  Button, 
  FileInput, 
  Stack, 
  Group, 
  Text, 
  Paper, 
  rem 
} from '@mantine/core';
import { IconUpload, IconFileCheck, IconX } from '@tabler/icons-react';

export const QuizGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text) return alert("Please enter some lecture text first.");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('text', text);
    formData.append('user_id', 'demo_user_123'); // Auth ID
    if (file) formData.append('image', file);

    try {
      const res = await fetch('http://localhost:8000/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 429) {
        throw new Error("Daily quiz limit reached!");
      }

      const data = await res.json();
      console.log("Quiz Generated:", data);
      // Logic to transition to Quiz view goes here
    } catch (err: any) {
      alert(err.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="xs" p="xl" withBorder style={{ maxWidth: 500, margin: 'auto' }}>
      <Stack>
        <Text size="lg" fw={700}>Create New Quiz</Text>
        
        <TextInput
          label="Lecture Topic or Content"
          placeholder="Paste your lecture notes here..."
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          required
        />

        {/* Mantine FileInput for Image Insertion */}
        <FileInput
          label="Add Image (Optional)"
          placeholder="Upload lecture slide or diagram"
          accept="image/png,image/jpeg"
          leftSection={<IconUpload style={{ width: rem(18), height: rem(18) }} />}
          value={file}
          onChange={setFile}
          clearable
          description="Gemini will use this to generate visual questions"
        />

        <Group justify="flex-end" mt="md">
          <Button 
            onClick={handleSubmit} 
            loading={loading}
            leftSection={!loading && <IconFileCheck size={18} />}
          >
            {loading ? 'Generating...' : 'Generate Quiz'}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};