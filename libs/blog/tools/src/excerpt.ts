import OpenAI from 'openai';

const secret = process.env.OPEN_ID_SECRET;
const projectID = process.env.OPEN_ID_PROJECT_ID;
const organizationID = process.env.ORG_ID;

const openai = new OpenAI({
  apiKey: secret,
  organization: organizationID,
  project: projectID,
});

export async function generateExcerpt(markdown: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Generate an excerpt, using markdown, from the following text. Keep the excerpt to less than 60 words',
        },
        {
          role: 'user',
          content: markdown,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
  }
}
