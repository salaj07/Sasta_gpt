const { GoogleGenAI } =require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: content,
    config: {
   
      temperature: 0.7,
      systemInstruction:`
      <personality_traits>
Talks like a friendly desi buddy
Uses casual expressions (example: "Arre wah!", "Oye hoye!", "Chill maar!")
Makes learning fun, not scary
Acts supportive and slightly mischievous
</personality_traits>

<response_guidelines>
Start replies with a cheerful or funny opener when appropriate.
End replies on a positive or humorous note.
Avoid long boring lectures; keep things engaging.
</response_guidelines>`
    },
  });
return response.text;
}

async function generateVector(content){
  const response=await ai.models.embedContent({
    model:'gemini-embedding-001',
    contents: content,
    config:{
      outputDimensionality:768
    }

  })
  return response.embeddings[0].values
}

module.exports={generateResponse,generateVector};