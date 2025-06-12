"use client"

import React from 'react';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Trophy, Puzzle, Shuffle, Target, Zap, Lightbulb, ChevronLeft } from "lucide-react"
import Link from 'next/link';

interface PuzzleData {
  id: number
  word: string
  definition: string
  difficulty: "easy" | "medium" | "hard"
  hint?: string
}

type PuzzleType = "scramble" | "tiles" | "match" | "fill"

interface GameState {
  currentPuzzle: PuzzleData | null
  puzzleType: PuzzleType
  userAnswer: string
  scrambledLetters: string[]
  availableLetters: string[]
  selectedLetters: string[]
  showResult: boolean
  isCorrect: boolean
  score: number
  puzzleCount: number
  streak: number
  hintsUsed: number
}

// Mock puzzle data
const puzzleData: PuzzleData[] = [
  {
    id: 1,
    word: "SERENDIPITY",
    definition: "A pleasant surprise or fortunate accident",
    difficulty: "hard",
    hint: "Starts with 'S' and has 11 letters",
  },
  {
    id: 2,
    word: "PUZZLE",
    definition: "A game or problem designed to test ingenuity",
    difficulty: "easy",
    hint: "You're playing one right now!",
  },
  {
    id: 3,
    word: "ADVENTURE",
    definition: "An exciting or unusual experience",
    difficulty: "medium",
    hint: "Something exciting that happens to you",
  },
  {
    id: 4,
    word: "CREATIVITY",
    definition: "The ability to create or design new things",
    difficulty: "medium",
    hint: "Artists need lots of this",
  },
  {
    id: 5,
    word: "WISDOM",
    definition: "Knowledge gained through experience",
    difficulty: "easy",
    hint: "What old people are said to have",
  },
  {
    id: 6,
    word: "MAGNIFICENT",
    definition: "Extremely beautiful or impressive",
    difficulty: "hard",
    hint: "A word meaning 'amazing' or 'splendid'",
  },
  {
    id: 7,
    word: "HARMONY",
    definition: "A pleasing combination of different elements",
    difficulty: "medium",
    hint: "When things work well together",
  },
  {
    id: 8,
    word: "BRILLIANT",
    definition: "Exceptionally clever or talented",
    difficulty: "medium",
    hint: "Very smart or shining bright",
  },
]


export default function PuzzleGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzle: null,
    puzzleType: "scramble",
    userAnswer: "",
    scrambledLetters: [],
    availableLetters: [],
    selectedLetters: [],
    showResult: false,
    isCorrect: false,
    score: 0,
    puzzleCount: 0,
    streak: 0,
    hintsUsed: 0,
  })
  const [gameStarted, setGameStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const puzzleTypes: { type: PuzzleType; name: string; icon: any; description: string }[] = [
    { type: "scramble", name: "Word Scramble", icon: Shuffle, description: "Unscramble the letters" },
    { type: "tiles", name: "Letter Tiles", icon: Target, description: "Build words with tiles" },
    { type: "match", name: "Definition Match", icon: Puzzle, description: "Match words to definitions" },
  ]

  const getRandomPuzzle = (): PuzzleData => {
    return puzzleData[Math.floor(Math.random() * puzzleData.length)]
  }

  const getRandomPuzzleType = (): PuzzleType => {
    const types: PuzzleType[] = ["scramble", "tiles", "match"]
    return types[Math.floor(Math.random() * types.length)]
  }

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startGame = () => {
    setGameStarted(true)
    setGameState((prev) => ({
      ...prev,
      score: 0,
      puzzleCount: 0,
      streak: 0,
      hintsUsed: 0,
    }))
    loadNextPuzzle()
  }

  const loadNextPuzzle = () => {
    const puzzle = getRandomPuzzle()
    const type = getRandomPuzzleType()
    const letters = puzzle.word.split("")

    setGameState((prev) => ({
      ...prev,
      currentPuzzle: puzzle,
      puzzleType: type,
      userAnswer: "",
      scrambledLetters: shuffleArray(letters),
      availableLetters: shuffleArray(letters),
      selectedLetters: [],
      showResult: false,
      isCorrect: false,
    }))
    setShowHint(false)
  }

  const handleLetterClick = (letter: string, index: number, isSelected = false) => {
    if (gameState.showResult) return

    if (isSelected) {
      // Remove from selected, add back to available
      setGameState((prev) => ({
        ...prev,
        selectedLetters: prev.selectedLetters.filter((_, i) => i !== index),
        availableLetters: [...prev.availableLetters, letter],
        userAnswer: prev.selectedLetters.filter((_, i) => i !== index).join(""),
      }))
    } else {
      // Add to selected, remove from available
      const newAvailable = [...gameState.availableLetters]
      newAvailable.splice(index, 1)
      const newSelected = [...gameState.selectedLetters, letter]

      setGameState((prev) => ({
        ...prev,
        selectedLetters: newSelected,
        availableLetters: newAvailable,
        userAnswer: newSelected.join(""),
      }))
    }
  }

  const handleScrambleClick = (letter: string, index: number) => {
    const newAnswer = gameState.userAnswer + letter
    const newScrambled = [...gameState.scrambledLetters]
    newScrambled.splice(index, 1)

    setGameState((prev) => ({
      ...prev,
      userAnswer: newAnswer,
      scrambledLetters: newScrambled,
    }))
  }

  const clearAnswer = () => {
    if (gameState.puzzleType === "scramble") {
      setGameState((prev) => ({
        ...prev,
        userAnswer: "",
        scrambledLetters: shuffleArray(prev.currentPuzzle?.word.split("") || []),
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        userAnswer: "",
        selectedLetters: [],
        availableLetters: shuffleArray(prev.currentPuzzle?.word.split("") || []),
      }))
    }
  }

  const submitAnswer = () => {
    if (!gameState.currentPuzzle || !gameState.userAnswer) return

    const correct = gameState.userAnswer.toUpperCase() === gameState.currentPuzzle.word.toUpperCase()

    setGameState((prev) => ({
      ...prev,
      showResult: true,
      isCorrect: correct,
      score: correct ? prev.score + 1 : prev.score,
      streak: correct ? prev.streak + 1 : 0,
      puzzleCount: prev.puzzleCount + 1,
    }))
  }

  const nextPuzzle = () => {
    if (gameState.puzzleCount >= 10) {
      setGameStarted(false)
      return
    }
    loadNextPuzzle()
  }

  const useHint = () => {
    setShowHint(true)
    setGameState((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameState({
      currentPuzzle: null,
      puzzleType: "scramble",
      userAnswer: "",
      scrambledLetters: [],
      availableLetters: [],
      selectedLetters: [],
      showResult: false,
      isCorrect: false,
      score: 0,
      puzzleCount: 0,
      streak: 0,
      hintsUsed: 0,
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  if (!gameStarted) {
    return (
      
      <div className="min-h-screen bg-gradient-to-tl w-full from-purple-300 via-slate-50 to-pink-200 flex items-center justify-center p-4">
        <Link href="/" className="absolute top-4 left-4">
          <Button
            className='bg-gradient-to-br from-red-200 to-purple-300 text-white hover:opacity-50 border-0 shadow-sm'
            size="sm"
          >
            <ChevronLeft className='w-5 h-5' />
            Back
          </Button>
        </Link>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-pink-300 to-fuchsia-500 rounded-full flex items-center justify-center">
              <Puzzle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">English Puzzle Game</CardTitle>
            <CardDescription>Solve word puzzles and learn new vocabulary!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gameState.puzzleCount > 0 && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Puzzle Complete!</span>
                </div>
                <p className="text-lg">Final Score: {gameState.score}/10</p>
                <p className="text-sm text-muted-foreground">Hints used: {gameState.hintsUsed}</p>
                <p className="text-sm text-muted-foreground">
                  {gameState.score >= 8 ? "Puzzle Master!" : gameState.score >= 6 ? "Great job!" : "Keep practicing!"}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">Puzzle Types:</h3>
              {puzzleTypes.map((type) => (
                <div key={type.type} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <type.icon className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={startGame} className="w-full bg-gradient-to-br from-red-200 to-purple-300 text-white hover:opacity-50 border-0 shadow-sm" size="default">
              {gameState.puzzleCount > 0 ? "Play Again" : "Start Puzzle Game"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!gameState.currentPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br w-full from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading puzzle...</p>
        </div>
      </div>
    )
  }

  const currentPuzzleType = puzzleTypes.find((t) => t.type === gameState.puzzleType)

  return (
    <div className="min-h-screen bg-gradient-to-tl w-full from-violet-100 to-pink-200 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button className='bg-gradient-to-br from-indigo-400 to-violet-500 text-white hover:opacity-50 border-0 shadow-sm' size="default" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
            <Badge className='bg-gradient-to-br from-purple-400 to-pink-400 text-white'>Puzzle {gameState.puzzleCount + 1}/10</Badge>
          </div>
          <div className="flex items-center gap-4">
            {gameState.streak > 0 && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{gameState.streak} streak</span>
              </div>
            )}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-lg font-bold">
                {gameState.score}/{gameState.puzzleCount}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={(gameState.puzzleCount / 10) * 100} className="mb-6" />

        {/* Puzzle Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentPuzzleType && <currentPuzzleType.icon className="w-5 h-5" />}
                <CardTitle className="text-xl">{currentPuzzleType?.name}</CardTitle>
              </div>
              <Badge className={getDifficultyColor(gameState.currentPuzzle.difficulty)}>
                {gameState.currentPuzzle.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-base">{gameState.currentPuzzle.definition}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Hint */}
            {showHint && gameState.currentPuzzle.hint && (
              <div className="mb-4 p-3 bg-gradient-to-tr from-yellow-100 to-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium">Hint:</span>
                </div>
                <p className="text-yellow-600 mt-1">{gameState.currentPuzzle.hint}</p>
              </div>
            )}

            {/* Answer Display */}
            <div className="mb-6">
              <div className="text-center">
                <div className="text-lg font-mono bg-gray-100 p-4 rounded-lg min-h-[60px] flex items-center justify-center border-2 border-dashed">
                  {gameState.userAnswer || "Your answer will appear here..."}
                </div>
              </div>
            </div>

            {/* Puzzle Interface */}
            {gameState.puzzleType === "scramble" && (
              <div className="space-y-4">
                <p className="font-medium text-center">Click the letters to spell the word:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameState.scrambledLetters.map((letter, index) => (
                    <Button
                      key={`${letter}-${index}`}
                      variant="secondary"
                      size="default"
                      className="w-12 h-12 text-lg font-bold"
                      onClick={() => handleScrambleClick(letter, index)}
                      disabled={gameState.showResult}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {gameState.puzzleType === "tiles" && (
              <div className="space-y-4">
                <p className="font-medium text-center">Drag letters to build the word:</p>

                {/* Selected Letters */}
                <div className="min-h-[60px] border-2 border-dashed border-purple-300 rounded-lg p-2">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {gameState.selectedLetters.map((letter, index) => (
                      <Button
                        key={`selected-${index}`}
                        variant="secondary"
                        size="default"
                        className="w-10 h-10 text-lg font-bold bg-fuchsia-500 hover:bg-fuchsia-600"
                        onClick={() => handleLetterClick(letter, index, true)}
                        disabled={gameState.showResult}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Available Letters */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameState.availableLetters.map((letter, index) => (
                    <Button
                      key={`available-${index}`}
                      variant="secondary"
                      size="default"
                      className="w-10 h-10 text-lg font-bold"
                      onClick={() => handleLetterClick(letter, index)}
                      disabled={gameState.showResult}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {gameState.puzzleType === "match" && (
              <div className="space-y-4">
                <p className="font-medium text-center">Spell the word that matches the definition:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameState.availableLetters.map((letter, index) => (
                    <Button
                      key={`match-${index}`}
                      variant="secondary"
                      size="default"
                      className="w-12 h-12 text-lg font-bold"
                      onClick={() => handleLetterClick(letter, index)}
                      disabled={gameState.showResult}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {gameState.showResult && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div
                className={`text-center p-4 rounded-lg ${
                  gameState.isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {gameState.isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  <span className="font-semibold">{gameState.isCorrect ? "Puzzle Solved!" : "Not quite right"}</span>
                </div>
                <p className="text-lg font-mono">{gameState.currentPuzzle.word}</p>
                <p className="text-sm mt-2">{gameState.currentPuzzle.definition}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!gameState.showResult ? (
            <>
              <Button variant="default" onClick={useHint} disabled={showHint} className="flex-shrink-0 bg-gradient-to-bl from-fuchsia-400 to-pink-500">
                <Lightbulb className="w-4 h-4 mr-2" />
                Hint
              </Button>
              <Button variant="playfulPink" onClick={clearAnswer} className="flex-shrink-0 bg-gradient-to-b from-indigo-400 to-violet-500">
                Clear
              </Button>
              <Button onClick={submitAnswer} disabled={!gameState.userAnswer} className="flex-1 bg-gradient-to-t from-indigo-400 to-violet-500" size="default">
                Submit Answer
              </Button>
            </>
          ) : (
            <Button onClick={nextPuzzle} className="flex-1" size="default">
              {gameState.puzzleCount >= 9 ? "Finish Game" : "Next Puzzle"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
