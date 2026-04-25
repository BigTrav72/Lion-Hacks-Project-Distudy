// src/components/QuizView.tsx
import { Radio, Stack, Text, Button, Paper } from '@mantine/core';

export function QuizView({ data }: { data: any }) {
  return (
    <Stack>
      <Text size="xl" fw={700}>{data.quiz_title}</Text>
      {data.questions.map((q: any, index: number) => (
        <Paper key={index} p="md" withBorder>
          <Text fw={500} mb="xs">{q.question}</Text>
          <Radio.Group name={`question-${index}`}>
            <Stack mt="xs">
              {q.options.map((opt: string) => (
                <Radio key={opt} value={opt} label={opt} />
              ))}
            </Stack>
          </Radio.Group>
        </Paper>
      ))}
      <Button color="green">Submit for Points</Button>
    </Stack>
  );
}