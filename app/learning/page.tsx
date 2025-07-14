import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import styles from "./learning.module.css"
import Card from "../components/Card/Card"
import ProgressTracker from "../components/ProgressTracker/ProgressTracker"

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

interface LearningData {
  subjects: Subject[]
  lessons: Lesson[]
}

async function getLearningData(): Promise<LearningData> {
  const filePath = path.join(process.cwd(), "data", "learning-data.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function LearningPage() {
  const data = await getLearningData()

  return (
    <div className={styles.learningPage}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Learning Hub</h1>
        <p className={styles.heroDescription}>
          Master design and development skills with our interactive learning platform. Track your progress and learn at
          your own pace.
        </p>
      </div>

      <div className={styles.subjectsGrid}>
        {data.subjects.map((subject, index) => (
          <Link key={subject.id} href={`/learning/${subject.id}`} className={styles.subjectLink}>
            <Card className={`${styles.subjectCard} ${styles[subject.color]}`}>
              <div className={styles.subjectIcon}>
                <img src={subject.image || "/placeholder.svg"} alt={subject.title} />
              </div>
              <div className={styles.subjectCategory}>{subject.category}</div>
              <h3 className={styles.subjectTitle}>{subject.title}</h3>
              <p className={styles.subjectDescription}>{subject.description}</p>
              <div className={styles.subjectMeta} data-subject-id={subject.id}>
                <ProgressTracker
                  subjects={[subject]}
                  lessons={data.lessons.filter((l) => l.subjectId === subject.id)}
                  variant="card"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
