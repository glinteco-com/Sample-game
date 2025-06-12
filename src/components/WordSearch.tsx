"use client"

import React from 'react';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RotateCcw, Trophy, Search, Eye, Clock, Target, ChevronLeft } from "lucide-react"
import Link from 'next/link';

interface WordData {
  word: string
  definition: string
  difficulty: "easy" | "medium" | "hard"
  category: string
}

interface FoundWord {
  word: string
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  direction: string
}

interface GridCell {
  letter: string
  isSelected: boolean
  isFound: boolean
  isHighlighted: boolean
  wordIndex?: number
}

interface GameState {
  grid: GridCell[][]
  words: WordData[]
  foundWords: FoundWord[]
  selectedCells: { row: number; col: number }[]
  isSelecting: boolean
  score: number
  timeElapsed: number
  hintsUsed: number
  currentSelection: string
}

// Word categories for themed puzzles
const wordCategories = {
  animals: [
    { word: "ELEPHANT", definition: "Large mammal with a trunk", difficulty: "easy" as const, category: "Animals" },
    { word: "BUTTERFLY", definition: "Colorful flying insect", difficulty: "medium" as const, category: "Animals" },
    {
      word: "PENGUIN",
      definition: "Black and white bird that can't fly",
      difficulty: "easy" as const,
      category: "Animals",
    },
    { word: "DOLPHIN", definition: "Intelligent marine mammal", difficulty: "medium" as const, category: "Animals" },
    { word: "TIGER", definition: "Large striped cat", difficulty: "easy" as const, category: "Animals" },
  ],
  nature: [
    { word: "MOUNTAIN", definition: "Very high hill", difficulty: "easy" as const, category: "Nature" },
    { word: "RAINBOW", definition: "Colorful arc in the sky", difficulty: "medium" as const, category: "Nature" },
    { word: "FOREST", definition: "Large area with many trees", difficulty: "easy" as const, category: "Nature" },
    { word: "OCEAN", definition: "Large body of salt water", difficulty: "easy" as const, category: "Nature" },
    { word: "THUNDER", definition: "Loud sound during storms", difficulty: "medium" as const, category: "Nature" },
  ],
  emotions: [
    {
      word: "HAPPINESS",
      definition: "Feeling of joy and contentment",
      difficulty: "medium" as const,
      category: "Emotions",
    },
    { word: "COURAGE", definition: "Bravery in facing danger", difficulty: "medium" as const, category: "Emotions" },
    { word: "LOVE", definition: "Deep affection for someone", difficulty: "easy" as const, category: "Emotions" },
    { word: "PEACE", definition: "State of calm and quiet", difficulty: "easy" as const, category: "Emotions" },
    { word: "WONDER", definition: "Feeling of amazement", difficulty: "easy" as const, category: "Emotions" },
  ],
}

const GRID_SIZE = 12
const directions = [ 
  [0, 1],  // sang phải (horizontal)
  [1, 0],  // xuống dưới (vertical)
  [1, 1], // chéo xuống phải (diagonal down-left)
];

export default function WordSearch() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    words: [],
    foundWords: [],
    selectedCells: [],
    isSelecting: false,
    score: 0,
    timeElapsed: 0,
    hintsUsed: 0,
    currentSelection: "",
  })
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof wordCategories>("animals")
  const [gameComplete, setGameComplete] = useState(false)
  const [showDefinitions, setShowDefinitions] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameComplete])

  const createEmptyGrid = (): GridCell[][] => {
    return Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({
            letter: "",
            isSelected: false,
            isFound: false,
            isHighlighted: false,
          })),
      )
  }

  const canPlaceWord = (grid: GridCell[][], word: string, row: number, col: number, direction: number[]): boolean => {
    const [dRow, dCol] = direction

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow
      const newCol = col + i * dCol

      if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
        return false
      }

      if (grid[newRow][newCol].letter !== "" && grid[newRow][newCol].letter !== word[i]) {
        return false
      }
    }

    return true
  }

  const placeWord = (grid: GridCell[][], word: string, row: number, col: number, direction: number[]): void => {
    const [dRow, dCol] = direction

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow
      const newCol = col + i * dCol
      grid[newRow][newCol].letter = word[i]
    }
  }

  const fillEmptyCells = (grid: GridCell[][]): void => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].letter === "") {
          grid[row][col].letter = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
  }

  const generateGrid = (words: WordData[]): GridCell[][] => {
    const grid = createEmptyGrid()
    const placedWords: FoundWord[] = []

    // Try to place each word
    words.forEach((wordData) => {
      const word = wordData.word
      let placed = false
      let attempts = 0

      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const row = Math.floor(Math.random() * GRID_SIZE)
        const col = Math.floor(Math.random() * GRID_SIZE)

        if (canPlaceWord(grid, word, row, col, direction)) {
          placeWord(grid, word, row, col, direction)

          const [dRow, dCol] = direction
          placedWords.push({
            word,
            startRow: row,
            startCol: col,
            endRow: row + (word.length - 1) * dRow,
            endCol: col + (word.length - 1) * dCol,
            direction: `${dRow},${dCol}`,
          })

          placed = true
        }
        attempts++
      }
    })

    fillEmptyCells(grid)
    return grid
  }

  const startGame = () => {
    const categoryWords = wordCategories[selectedCategory]
    const selectedWords = categoryWords.slice(0, 5) // Use 5 words per game

    const grid = generateGrid(selectedWords)

    setGameState({
      grid,
      words: selectedWords,
      foundWords: [],
      selectedCells: [],
      isSelecting: false,
      score: 0,
      timeElapsed: 0,
      hintsUsed: 0,
      currentSelection: "",
    })

    setGameStarted(true)
    setGameComplete(false)
    setShowDefinitions(false)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameComplete(false)
    setShowDefinitions(false)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCellsInLine = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const cells: { row: number; col: number }[] = []
    const deltaRow = endRow - startRow
    const deltaCol = endCol - startCol
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol))

    if (steps === 0) return [{ row: startRow, col: startCol }]

    const stepRow = deltaRow / steps
    const stepCol = deltaCol / steps

    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: Math.round(startRow + i * stepRow),
        col: Math.round(startCol + i * stepCol),
      })
    }

    return cells
  }

  const handleCellMouseDown = (row: number, col: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedCells: [{ row, col }],
      isSelecting: true,
      currentSelection: prev.grid[row][col].letter,
    }))

    // Clear previous highlights
    setGameState((prev) => ({
      ...prev,
      grid: prev.grid.map((gridRow) => gridRow.map((cell) => ({ ...cell, isHighlighted: false }))),
    }))
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!gameState.isSelecting || gameState.selectedCells.length === 0) return

    const startCell = gameState.selectedCells[0]
    const cells = getCellsInLine(startCell.row, startCell.col, row, col)

    // Check if it's a valid straight line (horizontal, vertical, or diagonal)
    const deltaRow = row - startCell.row
    const deltaCol = col - startCell.col
    const isValidLine = deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol)

    if (isValidLine) {
      const selection = cells.map((cell) => gameState.grid[cell.row][cell.col].letter).join("")

      setGameState((prev) => ({
        ...prev,
        selectedCells: cells,
        currentSelection: selection,
        grid: prev.grid.map((gridRow, r) =>
          gridRow.map((cell, c) => ({
            ...cell,
            isHighlighted: cells.some((selectedCell) => selectedCell.row === r && selectedCell.col === c),
          })),
        ),
      }))
    }
  }

  const handleCellMouseUp = () => {
    if (!gameState.isSelecting) return

    // Check if the selection matches any word
    const selection = gameState.currentSelection
    const reverseSelection = selection.split("").reverse().join("")

    const matchedWord = gameState.words.find(
      (wordData) => wordData.word === selection || wordData.word === reverseSelection,
    )

    if (matchedWord && !gameState.foundWords.some((found) => found.word === matchedWord.word)) {
      const startCell = gameState.selectedCells[0]
      const endCell = gameState.selectedCells[gameState.selectedCells.length - 1]

      const newFoundWord: FoundWord = {
        word: matchedWord.word,
        startRow: startCell.row,
        startCol: startCell.col,
        endRow: endCell.row,
        endCol: endCell.col,
        direction: `${endCell.row - startCell.row},${endCell.col - startCell.col}`,
      }

      setGameState((prev) => ({
        ...prev,
        foundWords: [...prev.foundWords, newFoundWord],
        score: prev.score + (matchedWord.difficulty === "hard" ? 3 : matchedWord.difficulty === "medium" ? 2 : 1),
        grid: prev.grid.map((gridRow, r) =>
          gridRow.map((cell, c) => ({
            ...cell,
            isFound:
              prev.selectedCells.some((selectedCell) => selectedCell.row === r && selectedCell.col === c) ||
              cell.isFound,
            isHighlighted: false,
          })),
        ),
      }))

      // Check if game is complete
      if (gameState.foundWords.length + 1 === gameState.words.length) {
        setGameComplete(true)
      }
    } else {
      // Clear highlights if no match
      setGameState((prev) => ({
        ...prev,
        grid: prev.grid.map((gridRow) => gridRow.map((cell) => ({ ...cell, isHighlighted: false }))),
      }))
    }

    setGameState((prev) => ({
      ...prev,
      selectedCells: [],
      isSelecting: false,
      currentSelection: "",
    }))
  }

  const findWordPlacement = (
    grid: GridCell[][],
    word: string
  ): FoundWord | null => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        for (const [dRow, dCol] of directions) {
          let i = 0
          while (
            i < word.length &&
            r + i * dRow >= 0 &&
            r + i * dRow < GRID_SIZE &&
            c + i * dCol >= 0 &&
            c + i * dCol < GRID_SIZE &&
            grid[r + i * dRow][c + i * dCol].letter === word[i]
          ) {
            i++
          }
          if (i === word.length) {
            return {
              word,
              startRow: r,
              startCol: c,
              endRow: r + (word.length - 1) * dRow,
              endCol: c + (word.length - 1) * dCol,
              direction: `${dRow},${dCol}`,
            }
          }
        }
      }
    }
    return null
  }

  const useHint = () => {
    if (gameState.hintsUsed >= 3) return

    const unfound = gameState.words.filter(
      (w) => !gameState.foundWords.some((f) => f.word === w.word)
    )
    if (!unfound.length) return

    const randomWord = unfound[Math.floor(Math.random() * unfound.length)].word

    const placement = findWordPlacement(gameState.grid, randomWord)
    if (!placement) return

    const [dRow, dCol] = placement.direction.split(',').map(Number)
    const randomIndex = Math.floor(Math.random() * randomWord.length)
    const hintRow = placement.startRow + randomIndex * dRow
    const hintCol = placement.startCol + randomIndex * dCol

    const newGrid = gameState.grid.map((row, r) =>
      row.map((cell, c) => ({
        ...cell,
        isHighlighted: r === hintRow && c === hintCol,
      })),
    )

    setGameState((prev) => ({
      ...prev,
      grid: newGrid,
      hintsUsed: prev.hintsUsed + 1,
    }))
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
      <div className="min-h-screen bg-gradient-to-br w-full from-blue-50 to-green-100 flex items-center justify-center p-4">
        <Link href="/" className="absolute top-4 left-4">
          <Button
            className='bg-gradient-to-r from-blue-100 to-green-200 text-black hover:opacity-70 border-0'
            size="sm"
          >
            <ChevronLeft className='w-5 h-5' />
            Back
          </Button>
        </Link>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-tl from-teal-200 to-emerald-400 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Word Search Puzzle</CardTitle>
            <CardDescription>Find hidden words in the letter grid!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gameComplete && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Puzzle Complete!</span>
                </div>
                <p className="text-lg">Score: {gameState.score} points</p>
                <p className="text-sm text-muted-foreground">Time: {formatTime(gameState.timeElapsed)}</p>
                <p className="text-sm text-muted-foreground">Hints used: {gameState.hintsUsed}/3</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Choose Category</label>
              <div className="grid gap-2">
                {Object.entries(wordCategories).map(([key, words]) => (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "mintGreen" : "secondary"}
                    onClick={() => setSelectedCategory(key as keyof typeof wordCategories)}
                    className="justify-start"
                  >
                    <span className="capitalize">{key}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {words.length} words
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={startGame} className="w-full" size="default" variant={"mintGreen"}>
              {gameComplete ? "Play Again" : "Start Word Search"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-blue-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button className='bg-gradient-to-r from-blue-100 to-green-200 text-black hover:opacity-70 border-0' size="default" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
            <Badge variant="secondary" className="capitalize">
              {selectedCategory}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(gameState.timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="font-medium">{gameState.score} pts</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={(gameState.foundWords.length / gameState.words.length) * 100} className="mb-6" />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Word Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Word Grid
                </CardTitle>
                <CardDescription>
                  Click and drag to select words. Found: {gameState.foundWords.length}/{gameState.words.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1 max-w-lg mx-auto">
                  {gameState.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 text-sm font-bold border rounded transition-colors
                          ${
                            cell.isFound
                              ? "bg-green-200 border-green-400 text-green-800"
                              : cell.isHighlighted
                                ? "bg-blue-200 border-blue-400 text-blue-800"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                          }
                        `}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                        disabled={gameComplete}
                      >
                        {cell.letter}
                      </button>
                    )),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Word List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Words to Find
                  <Button
                    variant="secondary"
                    size="default"
                    onClick={useHint}
                    disabled={gameState.hintsUsed >= 3 || gameComplete}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Hint ({gameState.hintsUsed}/3)
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gameState.words.map((word, index) => {
                  const isFound = gameState.foundWords.some((found) => found.word === word.word)
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isFound ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${isFound ? "line-through text-green-600" : ""}`}>
                          {word.word}
                        </span>
                        <div className="flex items-center gap-2">
                          {isFound && <CheckCircle className="w-4 h-4 text-green-500" />}
                          <Badge className={getDifficultyColor(word.difficulty)}>
                            {word.difficulty}
                          </Badge>
                        </div>
                      </div>
                      {(showDefinitions || isFound) && (
                        <p className="text-sm text-muted-foreground">{word.definition}</p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {gameComplete && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-700 mb-2">Congratulations!</h3>
                    <p className="text-sm text-green-600">
                      You found all words in {formatTime(gameState.timeElapsed)}!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
