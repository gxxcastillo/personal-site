import OpenAI from 'openai';

const secret = process.env.OPEN_ID_SECRET;
const projectID = process.env.OPEN_ID_PROJECT_ID;
const organizationID = process.env.ORG_ID;

const openai = new OpenAI({
  apiKey: secret,
  organization: organizationID,
  project: projectID,
});

async function testAPICall() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, world!' }],
      max_tokens: 5,
    });
    console.log('Test Response:', response.choices[0]);
  } catch (error) {
    console.error('API Error:', error);
  }
}

testAPICall();
