import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Question } from '../../../types/placement-test';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const questionData: Omit<Question, 'id'> = req.body;

    // Validate required fields
    if (!questionData.type || !questionData.content) {
      return res.status(400).json({ 
        message: 'Missing required fields: type and content are required' 
      });
    }

    // Validate question type
    const validTypes = ['readAloud', 'rwfib', 'rfib'];
    if (!validTypes.includes(questionData.type)) {
      return res.status(400).json({ 
        message: 'Invalid question type. Must be one of: readAloud, rwfib, rfib' 
      });
    }

    // Add question to Firebase
    const questionsRef = collection(db, 'questions');
    const docRef = await addDoc(questionsRef, {
      ...questionData,
      createdAt: new Date(),
      isActive: true
    });

    return res.status(201).json({
      message: 'Question added successfully',
      id: docRef.id
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error adding question:', error);
    return res.status(500).json({
      message: 'Failed to add question',
      error: errorMessage
    });
  }
}
