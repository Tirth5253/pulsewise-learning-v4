import { promises as fs } from "fs"
import path from "path"
import LessonClient from "./LessonClient"

interface Subject {
  id: string
  title: string
  description: string
  image: string
  category: string
  totalLessons: number
  color: string
}

interface Lesson {
  id: string
  subjectId: string
  title: string
  description: string
  order: number
  totalCards: number
}

interface Card {
  id: string
  lessonId: string
  question: string
  answer: string
  image: string
  order: number
}

interface LearningData {
  subjects: Subject[]
  lessons: Lesson[]
  cards: Card[]
}

async function getLearningData(): Promise<LearningData> {
  const filePath = path.join(process.cwd(), "data", "learning-data.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ subjectId: string; lessonId: string }>
}) {
  const { subjectId, lessonId } = await params
  const data = await getLearningData()
  const subject = data.subjects.find((s) => s.id === subjectId)
  const lesson = data.lessons.find((l) => l.id === lessonId)
  const cards = data.cards.filter((c) => c.lessonId === lessonId).sort((a, b) => a.order - b.order)

  if (!subject || !lesson) {
    return <div>Lesson not found</div>
  }

  const cardData = cards.map((card) => ({
    id: card.id,
    title: card.question,
    description: card.answer,
    image: card.image,
  }))

  return (
    <LessonClient
      subjects={data.subjects}
      lessons={data.lessons}
      lesson={lesson}
      cards={cardData}
      subjectId={subjectId}
      lessonId={lessonId}
    />
  )
}
