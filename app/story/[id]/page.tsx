import { Metadata } from 'next';
import { getStoryById, stories } from '@/lib/content';
import HomePage from '@/app/page';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = getStoryById(id);

  if (!story) {
    return {
      title: 'রাত জাগা — Sunday Suspense Audio Player',
    };
  }

  return {
    title: `${story.title} (${story.author}) — রাত জাগা | Sunday Suspense`,
    description: `Sunday Suspense-এর "${story.title}" গল্পটি শুনুন Sunday Suspense রেডিওতে। লেখকঃ ${story.author}। সময়ঃ ${story.durationFormatted}`,
    openGraph: {
      title: `রাত জাগা — ${story.title}`,
      description: `Sunday Suspense - ${story.author} (${story.genreBn})`,
      images: [
        {
          url: story.thumbnail,
          width: 640,
          height: 360,
          alt: story.title,
        },
      ],
    },
  };
}

export default function StoryPage() {
  return <HomePage />;
}
