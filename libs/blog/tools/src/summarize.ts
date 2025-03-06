import OpenAI from 'openai';

const secret = process.env.OPEN_ID_SECRET;
const projectID = process.env.OPEN_ID_PROJECT_ID;
const organizationID = process.env.ORG_ID;

const openai = new OpenAI({
  apiKey: secret,
  organization: organizationID,
  project: projectID,
});

export async function summarize(markdown: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Summarize the following text, which is in Markdown format, in less than 80 words. Focus on the main points and structure them concisely.',
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
