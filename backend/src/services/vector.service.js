/* Import the Pinecone library */
const { Pinecone } = require("@pinecone-database/pinecone");

/* Initialize a Pinecone client with your API key */
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

/* Create a dense index with integrated embedding */
const gptIndex = pc.Index("gpt-clone");

/* creating vectors in Pinecone */

async function createMemory({ vectors, metadata, messageId }) {
  await gptIndex.upsert([
    {
      id: messageId,
      values: vectors,
      metadata,
    },
  ]);
}

/* querying vectors from Pinecone */
async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await gptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata : undefined,
    includeMetadata: true,
  });
  return data.matches;
}

/* deleting vectors from Pinecone */

async function deleteChatMemoryByIds(ids) {
  if (!ids || ids.length === 0) return;

  try {
    await gptIndex.deleteMany(ids);
  } catch (err) {
    console.error("❌ Pinecone delete by ids failed:", err);
  }
}

module.exports = { createMemory, queryMemory, deleteChatMemoryByIds };
