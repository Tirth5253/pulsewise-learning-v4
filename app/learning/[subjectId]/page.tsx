import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import styles from "./subject.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import BackButton from "../../components/BackButton/BackButton";
import Card from "../../components/Card/Card";
import ProgressTracker from "../../components/ProgressTracker/ProgressTracker";
import LessonsGrid from "./[lessonId]/lessionGrid";

interface Subject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  totalLessons: number;
  color: string;
}

interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  totalCards: number;
}

interface LearningData {
  subjects: Subject[];
  lessons: Lesson[];
}

async function getLearningData(): Promise<LearningData> {
  const filePath = path.join(process.cwd(), "data", "learning-data.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const data = await getLearningData();
  const subject = data.subjects.find((s) => s.id === subjectId);
  const lessons = data.lessons.filter((l) => l.subjectId === subjectId);

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className={styles.subjectPage}>
      <Sidebar
        subjects={data.subjects}
        lessons={data.lessons}
        currentSubjectId={subjectId}
      />

      <div className={styles.mainContent}>
        <BackButton href="/learning" label="Back to Learning Hub" />

        <div className={styles.subjectHeader}>
          <div className={styles.subjectIcon}>
            <img
              src={subject.image || "/placeholder.svg"}
              alt={subject.title}
            />
          </div>
          <div className={styles.subjectInfo}>
            <div className={styles.subjectCategory}>{subject.category}</div>
            <h1 className={styles.subjectTitle}>{subject.title}</h1>
            <p className={styles.subjectDescription}>{subject.description}</p>
            <ProgressTracker
              subjects={[subject]}
              lessons={lessons}
              currentSubjectId={subject.id}
            />
          </div>
        </div>

        <div className={styles.lessonsGrid}>
          <LessonsGrid lessons={lessons} subjectId={subjectId} />
        </div>
      </div>
    </div>
  );
}
