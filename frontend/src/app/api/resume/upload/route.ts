import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);

    // Mock AI analysis (replace with actual AI processing)
    const mockAnalysis = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      experience: [
        {
          company: "Tech Corp",
          position: "Senior Software Engineer",
          duration: "2020-2023",
          description: "Led development of cloud-native applications"
        }
      ],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Computer Science",
          year: "2019"
        }
      ],
      skills: ["JavaScript", "React", "Node.js"],
      sentiment: "positive",
      confidence: 0.85,
      keyPhrases: ["experienced", "motivated", "team player"],
      overallScore: 85.5,
      strengths: ["Strong technical background", "Good communication skills"],
      improvements: ["Could benefit from more cloud experience"],
      recommendations: ["Consider AWS certification"],
      culturalFit: 0.9
    };

    // Create resume in database
    const resume = await prisma.resume.create({
      data: {
        title: file.name,
        content,
        fileType: file.type,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Resume processed successfully',
      data: mockAnalysis,
      resume
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 