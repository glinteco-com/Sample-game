'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Shuffle, Target, Zap, Star, Trophy, Users, X } from "lucide-react"
import Image from "next/image"

const games = [
  {
    id: "word-puzzle",
    title: "Word Puzzle Game",
    description: "Solve word scrambles, letter tiles, and definition matching puzzles",
    icon: Shuffle,
    difficulty: "Hard",
    players: "Single Player",
    color: "from-purple-500 to-pink-500",
    features: ["Word Scramble", "Letter Tiles", "Definition Match"],
    href: "./english-puzzle-game",
  },
  {
    id: "word-search",
    title: "Word Search Puzzle",
    description: "Find hidden words in letter grids with themed vocabulary",
    icon: Search,
    difficulty: "Medium",
    players: "Single Player",
    color: "from-blue-500 to-green-500",
    features: ["12x12 Grid", "Multiple Categories", "Hint System"],
    href: "./word-search-game",
  },
]

const playGames = [
  {
    id: "bubbo-bubbo",
    title: "Bubbo Bubbo",
    title_btn: "Test Your Skills in Bubbo Bubbo",
    description: "Aim, shoot, and pop colorful bubbles in this fun, space-themed puzzle game. Match 3+ bubbles to clear the board. Easy to play, perfect for all ages!",
    players: "Single Player",
    difficulty: "Medium",
    color: "bg-gradient-to-tl from-blue-400 to-teal-500 hover:opacity-90 transition-opacity border-0 text-white",
    features: ["Easy aim-and-shoot mechanics", "Bright, colorful graphics", "Space-themed design", "Fun music track", "Pause and score tracking"],
    url: "https://pixijs.github.io/open-games/bubbo-bubbo/",
    image: "/images/cannon-ball.png",
  },
  {
    id: "puzzling-potions",
    title: "Puzzling Potions",
    title_btn: "Discover the Magic of Puzzling Potions",
    description: "Match magical elements in this fast-paced potion puzzle before time runs out. Fun, colorful, and full of enchantment!",
    players: "Single Player",
    difficulty: "Medium",
    color: "bg-gradient-to-tr from-teal-500 to-blue-500 hover:opacity-90 transition-opacity border-0 text-white",
    features: ["60-second time challenge", "Colorful graphics and fun animations", "Easy to play, hard to master", "Fast-paced tile swapping"],
    url: "https://pixijs.github.io/open-games/puzzling-potions/",
    image: "/images/puzzling-potions.png",
  },
]

const stats = [
  { label: "Total Games", value: "2", icon: Target },
  { label: "Difficulty Levels", value: "2", icon: Zap },
  { label: "Categories", value: "9+", icon: BookOpen },
  { label: "Learning Focus", value: "Vocabulary", icon: Star },
]

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [gameUrl, setGameUrl] = useState("")

  const openModalWithGame = (url: string) => {
    setGameUrl(url)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setGameUrl("")
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-100 via-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">

        {/* Modal Popup */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            {/* Close Button */}
            <div className="relative inset-0 w-full max-w-4xl h-[95vh] p-10 flex items-center justify-center bg-gradient-to-br from-teal-100 via-indigo-50 to-purple-100 rounded-xl">
              <Button
                onClick={closeModal}
                className="absolute top-2 right-2 z-50 bg-white text-black shadow-md px-2 py-1 h-8 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Modal Box */}
              <div className="bg-white w-full h-full relative rounded-xl overflow-hidden shadow-lg border-0">
                <iframe
                  src={gameUrl}
                  className="w-full h-full border-0"
                  title="Game Window"
                ></iframe>
              </div>
            </div>
          </div>

        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">English Learning Games</h1>
              <p className="text-lg text-gray-600">
                Interactive puzzle games to improve your vocabulary and language skills
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {games.map((game) => (
            <Card
              key={game.id}
              className="justify-between group bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden"
            >
              <div>
                <div className={`h-2 bg-gradient-to-r ${game.color}`} />

                <CardHeader className="pb-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${game.color} rounded-lg flex items-center justify-center`}
                      >
                        <game.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {game.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{game.description}</CardDescription>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{game.players}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {game.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <Link href={game.href} className="block">
                    <Button
                      className={`w-full border-0 bg-gradient-to-r ${game.color} hover:opacity-90 transition-opacity`}
                      size="default"
                    >
                      Play Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Extra Games */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Are you looking for something fun?</h2>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">We&apos;ve got you covered!</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {playGames.map((game, index) => (
              <Card
                key={game.id}
                className="text-start group bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden"
              >
                <div>
                    <div className={`h-2 bg-gradient-to-r ${game.color}`} />

                    <CardHeader className="pb-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`flex items-center justify-center`}
                        >
                          <Image
                            src={game.image!}
                            alt={game.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {game.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {game.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">{game.description}</CardDescription>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{game.players}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {game.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <Button
                          key={index}
                          onClick={() => openModalWithGame(game.url)}
                          className={`w-full border-0 bg-gradient-to-r ${game.color} hover:opacity-90 transition-opacity`}
                        >
                          {game.title_btn}
                        </Button>
                      </div>
                    </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-white backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800 mb-2">Why Choose Our Learning Games?</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Designed to make English learning fun, interactive, and effective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Progressive Learning</h3>
                  <p className="text-sm text-gray-600">
                    Start with easy puzzles and advance to more challenging levels as your skills improve.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Focused Practice</h3>
                  <p className="text-sm text-gray-600">
                    Each game targets specific language skills like vocabulary, spelling, and comprehension.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Instant Feedback</h3>
                  <p className="text-sm text-gray-600">
                    Get immediate feedback on your answers with hints and explanations to help you learn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">Choose a game above to start your English learning journey! 🎮📚</p>
          <p className="text-base text-[#16c131] font-medium">Made by the Glinteco Team</p>
        </div>
      </div>
    </div>
  )
}
