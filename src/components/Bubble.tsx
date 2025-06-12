"use client"

import React from 'react';
import { Button } from "@/components/ui/button"

const playGames = [
  {
    title: "Play Bubbo Bubbo",
    url: "https://pixijs.github.io/open-games/bubbo-bubbo/",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Play Puzzling Potions",
    url: "https://pixijs.github.io/open-games/puzzling-potions/",
    color: "bg-green-500 hover:bg-green-600",
  },
]

export default function GamePage() {
  const handleGameClick = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 text-white">
      {playGames.map((game, index) => (
        <Button
          key={index}
          onClick={() => handleGameClick(game.url)}
          className={`${game.color}`}
          variant="default"
        >
          {game.title}
        </Button>
      ))}
    </div>
  )
}
