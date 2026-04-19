"use client";

import { useEffect, useRef, useState } from "react";

export default function Timer({ taskName }: { taskName: string }) {
    const [time, setTime] = useState(0); // seconds
    const [isRunning, setIsRunning] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ⏱ Smooth ticking
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    // ⏱ Format time
    const formatTime = () => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm w-full max-w-sm">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="truncate text-sm font-medium text-gray-700">
                    {taskName}
                </h3>

                <div className="flex gap-2">
                    {!isRunning ? (
                        <button
                            onClick={() => setIsRunning(true)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:scale-105 transition"
                        >
                            ▶ Start
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsRunning(false)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:scale-105 transition"
                        >
                            ⏸ Pause
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setIsRunning(false);
                            setTime(0);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:scale-105 transition"
                    >
                        ⏹ Stop
                    </button>
                </div>
            </div>

            {/* Timer */}
            <div className="mt-4 text-3xl font-bold text-blue-600 tracking-wide transition-all duration-300">
                {formatTime()}
            </div>

            {/* Sub info */}
            <p className="text-xs text-gray-400 mt-1">
                {isRunning ? "Tracking time..." : "Paused"}
            </p>
        </div>
    );
}