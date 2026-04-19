"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTimeEntry, updateTimeEntry } from "@/lib/hooks/use-tasks"
import type { TaskWithRelations } from "@/lib/types"
import { Clock, Play, Square, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeTrackerProps {
  tasks: TaskWithRelations[]
  activeTaskId: string | null
  onStartTimer: (taskId: string) => void
  onStopTimer: () => void
}

export function TimeTracker({ tasks, activeTaskId, onStartTimer, onStopTimer }: TimeTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)

  const activeTask = currentTaskId
    ? tasks.find(t => t.id === currentTaskId)
    : null

  // ✅ Timer logic (pure frontend)
  useEffect(() => {
    if (!isRunning || isPaused) return

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isPaused])

  const handleStart = async (taskId: string) => {
    const now = new Date()

    setStartTime(now)
    setElapsedTime(0)
    setIsRunning(true)
    setIsPaused(false)
    setCurrentTaskId(taskId)

    // optional DB save
    await createTimeEntry({
      task_id: taskId,
      start_time: now.toISOString()
    })

    onStartTimer(taskId)
  }

  const handleStop = async () => {
    if (!startTime || !currentTaskId) return

    const endTime = new Date()
    const durationMinutes = Math.round(elapsedTime / 60)

    await updateTimeEntry("temp-id", {
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes
    })

    setIsRunning(false)
    setElapsedTime(0)
    setIsPaused(false)
    setCurrentTaskId(null)

    onStopTimer()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="rounded-2xl shadow-sm border bg-white/80 backdrop-blur">

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Time Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {activeTask ? (
          <div className="p-4 rounded-xl border bg-blue-50">

            <div className="flex justify-between items-center">

              <p className="truncate font-medium">
                {activeTask.title}
              </p>

              <div className="flex gap-2">

                <Button
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? "Resume" : "Pause"}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleStop}
                >
                  Stop
                </Button>

              </div>
            </div>

            <div
              className={cn(
                "text-3xl mt-4 font-bold text-blue-600",
                !isPaused && "animate-pulse"
              )}
            >
              {formatTime(elapsedTime)}
            </div>

          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">
              Start a task to track time
            </p>
          </div>
        )}

        {/* Start buttons */}
        <div className="space-y-2">
          {tasks.map(task => (
            <Button
              key={task.id}
              onClick={() => handleStart(task.id)}
              disabled={isRunning}
              className="w-full justify-start"
            >
              <Play className="h-4 w-4 mr-2" />
              {task.title}
            </Button>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}