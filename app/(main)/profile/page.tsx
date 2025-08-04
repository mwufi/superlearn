"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { User, Trophy, Clock, TrendingUp, Award, BookOpen, Target, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface Skill {
  name: string
  level: number
  progress: number
  color: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  earned: boolean
  date?: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "achievements">("overview")

  const stats = {
    totalLearningTime: "42 hours",
    coursesCompleted: 8,
    currentStreak: 15,
    topicsExplored: 124
  }

  const skills: Skill[] = [
    { name: "Web Development", level: 3, progress: 65, color: "bg-blue-500" },
    { name: "Mathematics", level: 2, progress: 40, color: "bg-green-500" },
    { name: "Data Science", level: 1, progress: 85, color: "bg-purple-500" },
    { name: "Digital Marketing", level: 2, progress: 30, color: "bg-amber-500" },
  ]

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: <Trophy className="h-6 w-6" />,
      earned: true,
      date: "2024-01-15"
    },
    {
      id: "2",
      title: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: <Calendar className="h-6 w-6" />,
      earned: true,
      date: "2024-01-20"
    },
    {
      id: "3",
      title: "Knowledge Seeker",
      description: "Explore 100 different topics",
      icon: <Target className="h-6 w-6" />,
      earned: true,
      date: "2024-01-25"
    },
    {
      id: "4",
      title: "Expert Level",
      description: "Reach level 5 in any skill",
      icon: <Award className="h-6 w-6" />,
      earned: false
    }
  ]

  return (
    <MainLayout>
      <div className="flex flex-col h-full p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Learning Profile</h1>
                <p className="text-muted-foreground">Track your progress and achievements</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "overview" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "skills" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "achievements" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                }`}
              >
                Achievements
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-lg border border-border">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.totalLearningTime}</p>
                  <p className="text-sm text-muted-foreground">Total Learning</p>
                </div>
                <div className="p-6 rounded-lg border border-border">
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Courses Done</p>
                </div>
                <div className="p-6 rounded-lg border border-border">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.currentStreak} days</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div className="p-6 rounded-lg border border-border">
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.topicsExplored}</p>
                  <p className="text-sm text-muted-foreground">Topics Explored</p>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed "Introduction to React"</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Started "Advanced JavaScript Patterns"</span>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Earned "Quick Learner" achievement</span>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <span className="text-sm text-muted-foreground">Level {skill.level}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress to Level {skill.level + 1}</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${skill.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-lg border ${
                    achievement.earned 
                      ? "border-primary bg-primary/5" 
                      : "border-border opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      achievement.earned ? "bg-primary/10 text-primary" : "bg-muted"
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-muted-foreground">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}