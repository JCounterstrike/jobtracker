import OpenAI from "openai"

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate embeddings for a given text using OpenAI's embedding model
 * @param text - The text to generate embeddings for
 * @returns A vector (array of numbers) representing the text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // 1536 dimensions, cheaper and faster
      input: text.trim(),
    })
    return response.data[0].embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw new Error("Failed to generate embedding")
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param vecA - First vector
 * @param vecB - Second vector
 * @returns Similarity score between 0 and 1 (1 = identical)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length")
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * Convert cosine similarity (0-1) to a percentage score (0-100)
 * @param similarity - Cosine similarity value
 * @returns Percentage score
 */
export function similarityToPercentage(similarity: number): number {
  return Math.round(similarity * 100)
}

/**
 * Generate AI suggestions for tailoring a resume to a job
 * @param resumeText - The resume text
 * @param jobDescription - The job description
 * @param matchScore - The calculated match score (0-100)
 * @returns AI-generated suggestions as a string
 */
export async function generateTailoringSuggestions(resumeText: string, jobDescription: string, matchScore: number): Promise<string> {
  try {
    const prompt = `You are a professional resume advisor. Given a job description and a resume, provide specific, actionable suggestions to tailor the resume for this position.

Job Description:
${jobDescription}

Resume:
${resumeText.substring(0, 3000)} // Limit to avoid token limits

Match Score: ${matchScore}%

Provide 3-5 specific suggestions focusing on:
1. Keywords to add from the job description
2. Skills to emphasize or add
3. Experience to highlight or reframe
4. Sections to expand or modify

Format your response as a numbered list. Be concise and actionable.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model, can upgrade to gpt-4 if needed
      messages: [
        {
          role: "system",
          content: "You are an expert career coach specializing in resume optimization.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    return response.choices[0].message.content || "No suggestions available."
  } catch (error) {
    console.error("Error generating suggestions:", error)
    throw new Error("Failed to generate AI suggestions")
  }
}
