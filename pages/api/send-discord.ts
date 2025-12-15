import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('DISCORD_WEBHOOK_URL is not set in environment variables');
    }

    // Get the latest submission
    const submissionsRef = collection(db, 'submissions');
    const q = query(submissionsRef, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No submission found' });
    }

    const submission = querySnapshot.docs[0].data();
    const submissionId = querySnapshot.docs[0].id;
    const { personalInfo } = submission;

    // Format timestamp
    const submissionTime = new Date(submission.timestamp.toDate()).toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create Discord embed
    const discordPayload = {
      embeds: [
        {
          title: '🎓 New Placement Test Submission',
          description: 'Hệ thống đã nhận được bài Placement Test của học sinh',
          color: 0xfc5d01, // #fc5d01 in decimal
          fields: [
            {
              name: '👤 Student Name',
              value: personalInfo.fullName,
              inline: true
            },
            {
              name: '🎯 Target Score',
              value: personalInfo.target,
              inline: true
            },
            {
              name: '📧 Email',
              value: personalInfo.email,
              inline: false
            },
            {
              name: '📱 Phone',
              value: personalInfo.phone,
              inline: false
            },
            {
              name: '⏰ Submission Time',
              value: submissionTime,
              inline: false
            },
            {
              name: '🔗 View Submission',
              value: `[Click here to view details](https://placementtest.pteintensive.com/submissions/${submissionId})`,
              inline: false
            }
          ],
          footer: {
            text: 'PTE Intensive Team',
            icon_url: 'https://placementtest.pteintensive.com/logo1.png'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook error:', errorText);
      throw new Error(`Discord webhook failed: ${response.status} - ${errorText}`);
    }

    console.log('Discord notification sent successfully');
    return res.status(200).json({ 
      message: 'Discord notification sent successfully'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in Discord notification handler:', error);
    return res.status(500).json({ 
      message: 'Failed to send Discord notification',
      error: errorMessage
    });
  }
}
