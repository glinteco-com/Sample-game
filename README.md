# 🎾 English Learning Games Portal

An interactive and beautifully designed educational platform built with **Next.js 14**, **Tailwind CSS**, and **Lucide React** icons. This portal features a collection of English vocabulary games aimed at making language learning engaging, fun, and effective.

## 🚀 Features

* 🎯 Progressive vocabulary games (Word Scramble, Word Search, etc.)
* 🧙‍♂️ Fun puzzle-based games (Bubbo Bubbo, Puzzling Potions)
* 📊 Stats dashboard with difficulty levels and categories
* 🎨 Colorful UI with smooth transitions and modal support
* 📱 Responsive and accessible design

## 🧠 Games Included

### Vocabulary Learning Games

| Game             | Difficulty | Type         | Features                      |
| ---------------- | ---------- | ------------ | ----------------------------- |
| Word Puzzle Game | Hard       | Vocabulary   | Scramble, Tiles, Definitions  |
| Word Search      | Medium     | Word Finding | Grid-based, Categories, Hints |

### Mini Puzzle Games

| Game             | Difficulty | Type       | URL                                                               |
| ---------------- | ---------- | ---------- | ----------------------------------------------------------------- |
| Bubbo Bubbo      | Medium     | Bubble Pop | [Play Now](https://pixijs.github.io/open-games/bubbo-bubbo/)      |
| Puzzling Potions | Medium     | Tile Match | [Play Now](https://pixijs.github.io/open-games/puzzling-potions/) |

## 🛆 Tech Stack

* `Next.js` (App Router with `use client`)
* `Tailwind CSS` for styling
* `Lucide React` for beautiful icons
* `PixiJS` for external mini-games
* `@/components/ui` for reusable UI components

## 🖼️ Modal Integration

External games are embedded using an `<iframe>` in a modal popup to maintain UI consistency and avoid navigation disruption.

## 🧩 How to Use

1. Clone this repo:

   ```bash
   git clone https://github.com/glinteco-com/Sample-game.git
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run the dev server:

   ```bash
   npm run dev
   ```

## 👥 Credits

* Built with ❤️ by the **Glinteco Team**
* Game assets from [PixiJS Open Games](https://pixijs.io/open-games)

## 📚 License

MIT License
