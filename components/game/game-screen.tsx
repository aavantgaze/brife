"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { StatusBar } from "@/components/game/status-bar"
import { StoryCard } from "@/components/game/story-card"
import { InventorySidebar } from "@/components/game/inventory-sidebar"
import type { InventoryItem } from "@/components/game/inventory-sidebar"
import { MapButton } from "@/components/game/map-button"
import { MapModal } from "@/components/game/map-modal"

interface StoryChoice {
  text: string
  targetPageId: number
  requirements?: {
    item: string
    cost: number
  }
}

interface StoryPage {
  id: number
  content: string
  backgroundVideo: string
  audio: string
  choices: StoryChoice[]
  itemsFound?: string[]
}

const storyData: StoryPage[] = [
  {
    id: 2,
    content:
      "\u0648\u0631\u0642 \u0628\u0632\u0646\u06CC\u062F \u062A\u0627 \u0628\u0647 \u062D\u0641\u0631\u0647 \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F",
    backgroundVideo: "bg-hole-intro.mp4",
    audio: "ambience-dark-wind.mp3",
    choices: [
      { text: "\u0648\u0631\u0648\u062F \u0628\u0647 \u062D\u0641\u0631\u0647", targetPageId: 3 },
    ],
  },
  {
    id: 3,
    content:
      "\u067E\u0644\u06A9\u0627\u0646\u06CC \u067E\u06CC\u0634 \u0631\u0648 \u06AF\u0634\u0648\u062F\u0647 \u0645\u06CC\u0634\u0648\u062F \u06A9\u0647 \u0634\u0628\u06CC\u0647 \u067E\u0644\u06A9\u0627\u0646 \u0633\u0646\u06AF\u06CC \u06CC\u06A9 \u0632\u06CC\u0631\u0632\u0645\u06CC\u0646 \u0628\u0632\u0631\u06AF \u0648 \u06A9\u0647\u0646\u0647 \u0627\u0633\u062A. \u0628\u0627\u062F \u0633\u0631\u062F\u06CC \u0627\u0632 \u0639\u0645\u0642 \u067E\u0644\u06A9\u0627\u0646 \u0645\u06CC \u0648\u0632\u062F \u0648 \u0628\u0648\u06CC\u06CC \u0634\u0628\u06CC\u0647 \u0646\u0645 \u0648 \u062E\u0627\u06A9\u0633\u062A\u0631 \u0628\u0627 \u062E\u0648\u062F \u0645\u06CC \u0622\u0648\u0631\u062F. \u0647\u0631\u0686\u0647 \u067E\u0627\u06CC\u06CC\u0646 \u062A\u0631 \u0645\u06CC \u0631\u0648\u06CC\u062F \u062A\u0627\u0631\u06CC\u06A9\u06CC \u0628\u06CC\u0634\u062A\u0631 \u0645\u06CC\u0634\u0648\u062F \u0648 \u0647\u0645\u0632\u0645\u0627\u0646 \u0632\u0645\u0632\u0645\u0647 \u0647\u0627 \u0648 \u0646\u062C\u0648\u0627\u0647\u0627\u06CC \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647 \u0627\u06CC \u0628\u0647 \u06AF\u0648\u0634 \u0645\u06CC\u0631\u0633\u062F. \u0635\u062F\u0627\u06CC\u06CC \u0628\u06CC\u0646 \u06A9\u062A\u06A9\u062A \u0633\u0648\u062E\u062A\u0646 \u06CC\u06A9 \u06A9\u062A\u0627\u0628\u062E\u0627\u0646\u0647 \u06CC \u0628\u0632\u0631\u06AF \u06CC\u0627 \u0634\u0631\u0634\u0631 \u0628\u0627\u0631\u0627\u0646\u06CC \u0645\u062F\u0627\u0645 \u062F\u0631 \u0639\u0645\u0642 \u062F\u0631\u0647 \u0627\u06CC \u0628\u0627\u0633\u062A\u0627\u0646\u06CC \u0641\u0636\u0627 \u0631\u0627 \u067E\u0631 \u06A9\u0631\u062F\u0647 \u0627\u0633\u062A.",
    backgroundVideo: "bg-stairs-down.mp4",
    audio: "ambience-whispers.mp3",
    choices: [
      {
        text: "\u067E\u0627\u06CC\u06CC\u0646 \u0631\u0641\u062A\u0646 \u0627\u0632 \u067E\u0644\u0647 \u0647\u0627",
        targetPageId: 4,
      },
    ],
  },
  {
    id: 4,
    content:
      "\u06CC\u06A9 \u0642\u062F\u0645 \u062F\u06CC\u06AF\u0631 \u0633\u06CC\u0627\u0647\u06CC \u0645\u062D\u0636 \u0627\u0633\u062A.",
    backgroundVideo: "bg-pitch-black.mp4",
    audio: "ambience-silence.mp3",
    choices: [
      { text: "\u0648\u0631\u0642 \u0628\u0632\u0646\u06CC\u062F", targetPageId: 5 },
    ],
  },
  {
    id: 5,
    content:
      "\u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F. \u0646\u0627\u06AF\u0647\u0627\u0646 \u062A\u0627\u0631\u06CC\u06A9\u06CC \u0634\u0645\u0627 \u0631\u0627 \u0627\u062D\u0627\u0637\u0647 \u06A9\u0631\u062F\u0647 \u0627\u0633\u062A. \u067E\u0634\u062A \u0633\u0631 \u062E\u0628\u0631\u06CC \u0627\u0632 \u067E\u0644\u06A9\u0627\u0646\u06CC \u06A9\u0647 \u067E\u0634\u062A \u0633\u0631 \u06AF\u0630\u0627\u0634\u062A\u0647 \u0627\u06CC \u0646\u06CC\u0633\u062A \u06AF\u0648\u06CC\u06CC \u062F\u0631 \u0622\u0646\u06CC \u0645\u062D\u0648 \u0634\u062F \u067E\u0634\u062A \u0633\u0631\u062A \u062F\u06CC\u0648\u0627\u0631 \u0627\u0633\u062A. \u0631\u0648\u06CC \u0632\u0645\u06CC\u0646 \u067E\u06CC\u0634 \u067E\u0627\u06CC \u062A\u0648 \u0639\u0644\u0627\u0645\u062A\u0647\u0627\u06CC \u0634\u0628 \u0646\u0645\u0627 \u0645\u06CC \u062F\u0631\u062E\u0634\u062F \u0648 \u0686\u0647\u0627\u0631 \u062C\u0647\u062A \u062C\u063A\u0631\u0627\u0641\u06CC\u0627 \u0631\u0627 \u0646\u0634\u0627\u0646 \u0645\u06CC\u062F\u0647\u062F.",
    backgroundVideo: "bg-crossroads-dark.mp4",
    audio: "ambience-heartbeat.mp3",
    choices: [
      {
        text: "\u0627\u06AF\u0631 \u0628\u0647 \u0633\u0645\u062A \u0634\u0631\u0642 \u0645\u06CC\u0631\u0648\u06CC",
        targetPageId: 19,
      },
      {
        text: "\u0627\u06AF\u0631 \u0628\u0647 \u0633\u0645\u062A \u063A\u0631\u0628 \u0645\u06CC\u0631\u0648\u06CC",
        targetPageId: 21,
      },
      {
        text: "\u0627\u06AF\u0631 \u0628\u0647 \u0634\u0645\u0627\u0644 \u0645\u06CC\u0631\u0648\u06CC",
        targetPageId: 8,
      },
    ],
  },
  {
    id: 7,
    content:
      "\u0646\u0641\u0633 \u062E\u0648\u062F \u0631\u0627 \u062D\u0633 \u0645\u06CC\u06A9\u0646\u06CC\u062F \u06A9\u0647 \u0628\u0647 \u062F\u06CC\u0648\u0627\u0631 \u0633\u0631\u062F \u0645\u06CC\u062E\u0648\u0631\u062F... \u062F\u0645 \u0628\u0627\u0632 \u062F\u0645... \u062F\u0631 \u0633\u06CC\u0627\u0647\u06CC \u0641\u0631\u0648\u0631\u0641\u062A\u06AF\u06CC \u0648 \u0628\u0631\u0622\u0645\u062F\u06AF\u06CC \u062F\u06CC\u0648\u0627\u0631 \u0631\u0627 \u062D\u0633 \u0645\u06CC\u06A9\u0646\u06CC\u062F. \u062D\u062C\u0645\u06CC \u0631\u0627 \u062F\u0631 \u062A\u0648\u0631\u0641\u062A\u06AF\u06CC \u062F\u06CC\u0648\u0627\u0631 \u062A\u0634\u062E\u06CC\u0635 \u0645\u06CC\u062F\u0647\u06CC\u062F. \u062F\u0633\u062A \u0645\u06CC \u06A9\u0634\u06CC\u062F. \u06A9\u0628\u0631\u06CC\u062A\u06CC \u0627\u0633\u062A. \u0622\u0646 \u0631\u0627 \u0628\u0631\u062F\u0627\u0631\u06CC\u062F \u0628\u0647 \u0641\u0627\u0646\u0648\u0633 \u0628\u0631\u06AF\u0631\u062F\u06CC\u062F \u062A\u0627 \u0627\u062A\u0627\u0642 \u0631\u0627 \u0631\u0648\u0634\u0646 \u06A9\u0646\u06CC\u062F.",
    backgroundVideo: "bg-wall-niche.mp4",
    audio: "ambience-breathing.mp3",
    choices: [
      { text: "\u0634\u0631\u0642", targetPageId: 16 },
      { text: "\u062C\u0646\u0648\u0628", targetPageId: 10 },
    ],
    itemsFound: ["matches"],
  },
  {
    id: 8,
    content:
      "\u062A\u0627\u0631\u06CC\u06A9\u06CC \u0637\u0648\u0631\u06CC \u063A\u0644\u06CC\u0638 \u0627\u0633\u062A \u06A9\u0647 \u0627\u0646\u06AF\u0627\u0631 \u062F\u0631 \u0627\u0639\u0645\u0627\u0642 \u06CC\u06A9 \u0628\u0634\u06A9\u0647 \u06CC \u0642\u06CC\u0631 \u067E\u06CC\u0634 \u0645\u06CC \u0631\u0648\u06CC\u062F. \u0635\u062F\u0627\u06CC \u0642\u062F\u0645 \u0647\u0627 \u0628\u06CC\u0646 \u062F\u06CC\u0648\u0627\u0631\u0647\u0627...",
    backgroundVideo: "bg-pitch-black.mp4",
    audio: "ambience-footsteps.mp3",
    choices: [
      { text: "\u0634\u0631\u0642", targetPageId: 11 },
      { text: "\u063A\u0631\u0628", targetPageId: 10 },
      { text: "\u0634\u0645\u0627\u0644", targetPageId: 16 },
      { text: "\u062C\u0646\u0648\u0628", targetPageId: 5 },
    ],
  },
  {
    id: 9,
    content:
      "\u0627\u062A\u0641\u0627\u0642\u06CC \u0646\u0645\u06CC \u0627\u0641\u062A\u062F. \u0647\u0645\u0627\u0646 \u0633\u06A9\u0648\u062A \u0645\u062F\u0627\u0645 \u0648 \u0647\u0645\u0627\u0646 \u0635\u062F\u0627\u06CC \u062D\u0631\u06A9\u062A \u0622\u0628 \u0627\u0632 \u067E\u0634\u062A \u0622\u062C\u0631 \u0648 \u06A9\u0627\u0647\u06AF\u0644 \u0648 \u067E\u0634\u062A \u0633\u0646\u06AF\u0647\u0627\u06CC \u06A9\u0641.",
    backgroundVideo: "bg-dark-water.mp4",
    audio: "ambience-water-drops.mp3",
    choices: [
      {
        text: "\u0633\u0627\u0639\u062A \u0631\u0648\u06CC \u062F\u06CC\u0648\u0627\u0631 \u0631\u0627 \u0646\u062F\u06CC\u062F\u0647 \u0627\u06CC\u062F \u0648 \u0646\u0634\u0627\u0646\u06AF\u0631 \u0631\u0627 \u067E\u06CC\u062F\u0627 \u0646\u06A9\u0631\u062F\u0647 \u0627\u06CC\u062F",
        targetPageId: 15,
      },
      {
        text: "\u0646\u0634\u0627\u0646\u06AF\u0631 \u0631\u0627 \u067E\u06CC\u062F\u0627 \u06A9\u0631\u062F\u0647 \u0627\u06CC\u062F (\u06CC\u06A9 \u0632\u0645\u0627\u0646 \u062E\u0637 \u0628\u0632\u0646\u06CC\u062F)",
        targetPageId: 17,
        requirements: { item: "time", cost: 1 },
      },
    ],
  },
  {
    id: 10,
    content:
      "\u062F\u0631 \u0639\u0645\u0642 \u0633\u06CC\u0627\u0647\u06CC \u0633\u0631\u0645\u0627\u06CC \u062F\u06CC\u0648\u0627\u0631 \u0648 \u0633\u0646\u06AF\u0647\u0627\u06CC \u06A9\u0641 \u0631\u0627 \u062D\u0633 \u0645\u06CC\u06A9\u0646\u06CC\u062F \u062C\u0631\u06CC\u0627\u0646 \u0622\u0628 \u0627\u0632 \u067E\u0634\u062A \u062F\u06CC\u0648\u0627\u0631\u0647\u0627 \u0631\u062F \u0645\u06CC\u0634\u0648\u062F \u0647\u0646\u0648\u0632 \u0647\u0627\u0644\u0647 \u06CC \u0646\u0648\u0631\u06CC \u0630\u0631\u0647 \u0627\u06CC \u0627\u0632 \u062A\u0627\u0631\u06CC\u06A9\u06CC \u0631\u0627 \u0622\u0634\u06A9\u0627\u0631 \u0646\u06A9\u0631\u062F\u0647...",
    backgroundVideo: "bg-damp-cellar.mp4",
    audio: "ambience-damp.mp3",
    choices: [
      { text: "\u0634\u0645\u0627\u0644", targetPageId: 7 },
      { text: "\u0634\u0631\u0642", targetPageId: 8 },
      { text: "\u062C\u0646\u0648\u0628", targetPageId: 21 },
    ],
  },
  {
    id: 11,
    content:
      "\u0631\u0627\u0647\u0631\u0648\u06CC \u0628\u0627\u0631\u06CC\u06A9 \u0648 \u0633\u0631\u062F. \u062F\u0633\u062A\u200C\u0647\u0627\u06CC\u062A\u0627\u0646 \u0631\u0648\u06CC \u062F\u06CC\u0648\u0627\u0631\u0647\u0627 \u0645\u06CC\u200C\u0644\u063A\u0632\u062F. \u0635\u062F\u0627\u06CC \u0642\u0637\u0631\u0647\u200C\u0647\u0627\u06CC \u0622\u0628 \u0627\u0632 \u0633\u0642\u0641 \u0628\u0647 \u06AF\u0648\u0634 \u0645\u06CC\u200C\u0631\u0633\u062F. \u062F\u0631 \u0627\u0646\u062A\u0647\u0627\u06CC \u0631\u0627\u0647\u0631\u0648 \u062F\u0648 \u0631\u0627\u0647\u0647 \u0627\u06CC \u0627\u0633\u062A.",
    backgroundVideo: "bg-pitch-black.mp4",
    audio: "ambience-water-drops.mp3",
    choices: [
      { text: "\u063A\u0631\u0628", targetPageId: 8 },
      { text: "\u0634\u0645\u0627\u0644", targetPageId: 16 },
      { text: "\u062C\u0646\u0648\u0628", targetPageId: 19 },
    ],
  },
  {
    id: 13,
    content:
      "\u0627\u062A\u0627\u0642\u06A9 \u0631\u0648\u0634\u0646 \u0645\u06CC\u0634\u0648\u062F. \u0647\u0645\u0627\u0646 \u0627\u0633\u062A \u06A9\u0647 \u067E\u06CC\u0634\u062A\u0631 \u062D\u062F\u0633 \u0632\u062F\u06CC\u062F \u062F\u0631 \u06CC\u06A9 \u0633\u0631\u062F\u0627\u0628 \u0646\u0645\u0648\u0631 \u0648 \u0628\u06CC \u067E\u0646\u062C\u0631\u0647 \u0647\u0633\u062A\u06CC\u062F \u0631\u0648 \u0628\u0647 \u0631\u0648 \u062F\u0631\u06CC \u06A9\u0648\u062A\u0627\u0647 \u0627\u0633\u062A \u06A9\u0647 \u062F\u0633\u062A\u06AF\u06CC\u0631\u0647 \u0646\u062F\u0627\u0631\u062F. \u06A9\u0646\u0627\u0631\u0634 \u06CC\u06A9 \u0633\u0627\u0639\u062A \u062F\u06CC\u0648\u0627\u0631\u06CC \u0622\u0648\u06CC\u0632\u0627\u0646 \u0627\u0633\u062A \u0648 \u06CC\u06A9 \u062A\u0635\u0648\u06CC\u0631 \u0631\u0648\u06CC \u062F\u06CC\u0648\u0627\u0631 \u062F\u06CC\u062F\u0647 \u0645\u06CC\u0634\u0648\u062F.",
    backgroundVideo: "bg-lit-cellar.mp4",
    audio: "ambience-room-tone.mp3",
    choices: [
      {
        text: "\u0628\u0647 \u0633\u0627\u0639\u062A \u0646\u06AF\u0627\u0647 \u06A9\u0646\u06CC\u062F",
        targetPageId: 15,
      },
      {
        text: "\u0628\u0647 \u062A\u0635\u0648\u06CC\u0631 \u062F\u06CC\u0648\u0627\u0631 \u0646\u06AF\u0627\u0647 \u06A9\u0646\u06CC\u062F",
        targetPageId: 17,
      },
    ],
  },
  {
    id: 14,
    content:
      "\u0627\u062A\u0627\u0642\u06CC \u06A9\u0648\u0686\u06A9 \u0628\u0627 \u0633\u0642\u0641 \u06A9\u0648\u062A\u0627\u0647. \u06CC\u06A9 \u0645\u06CC\u0632 \u0686\u0648\u0628\u06CC \u0642\u062F\u06CC\u0645\u06CC \u062F\u0631 \u06AF\u0648\u0634\u0647 \u0627\u0633\u062A. \u0631\u0648\u06CC \u0645\u06CC\u0632 \u06CC\u06A9 \u067E\u0627\u06A9\u062A \u0646\u0627\u0645\u0647 \u0648 \u06CC\u06A9 \u06A9\u0644\u06CC\u062F \u0632\u0646\u06AF\u200C\u0632\u062F\u0647 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.",
    backgroundVideo: "bg-lit-cellar.mp4",
    audio: "ambience-room-tone.mp3",
    choices: [
      {
        text: "\u0646\u0627\u0645\u0647 \u0631\u0627 \u0628\u062E\u0648\u0627\u0646\u06CC\u062F",
        targetPageId: 18,
      },
      {
        text: "\u06A9\u0644\u06CC\u062F \u0631\u0627 \u0628\u0631\u062F\u0627\u0631\u06CC\u062F",
        targetPageId: 9,
      },
      {
        text: "\u0628\u0631\u06AF\u0631\u062F\u06CC\u062F",
        targetPageId: 13,
      },
    ],
    itemsFound: ["rusty_key"],
  },
  {
    id: 15,
    content:
      "\u0633\u0627\u0639\u062A \u0641\u0642\u0637 \u06CC\u06A9 \u0639\u0642\u0631\u0628\u0647 \u062F\u0627\u0631\u062F \u0648\u0644\u06CC \u0628\u0647 \u0646\u0638\u0631 \u0645\u06CC\u0631\u0633\u062F \u06A9\u0647 \u0627\u0632 \u06A9\u0627\u0631 \u0646\u06CC\u0641\u062A\u0627\u062F\u0647 \u0627\u0633\u062A... \u0628\u0627 \u0646\u0634\u0627\u0646\u06AF\u0631 \u0628\u0627\u0632\u06CC \u0622\u0634\u0646\u0627 \u0634\u0648\u06CC\u062F. (\u062F\u0631\u06CC\u0627\u0641\u062A \u06F2\u06F0 \u06A9\u0628\u0631\u06CC\u062A)",
    backgroundVideo: "bg-clock-face.mp4",
    audio: "sfx-clock-pendulum.mp3",
    choices: [
      { text: "\u0628\u0631\u06AF\u0634\u062A\u0646", targetPageId: 13 },
    ],
    itemsFound: ["matches_20"],
  },
  {
    id: 16,
    content:
      "\u0631\u0627\u0647\u0631\u0648\u06CC \u0637\u0648\u0644\u0627\u0646\u06CC \u0628\u0627 \u0637\u0627\u0642\u200C\u0647\u0627\u06CC \u0633\u0646\u06AF\u06CC. \u0635\u062F\u0627\u06CC \u0632\u0646\u06AF \u06A9\u0648\u0686\u06A9\u06CC \u0627\u0632 \u062F\u0648\u0631 \u0628\u0647 \u06AF\u0648\u0634 \u0645\u06CC\u200C\u0631\u0633\u062F. \u062F\u0631 \u0627\u0646\u062A\u0647\u0627\u06CC \u0631\u0627\u0647\u0631\u0648 \u062F\u0631\u06CC \u0622\u0647\u0646\u06CC \u0627\u0633\u062A \u06A9\u0647 \u0646\u06CC\u0645\u0647\u200C\u0628\u0627\u0632 \u0627\u0633\u062A.",
    backgroundVideo: "bg-stairs-down.mp4",
    audio: "ambience-whispers.mp3",
    choices: [
      {
        text: "\u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F",
        targetPageId: 14,
      },
      { text: "\u062C\u0646\u0648\u0628", targetPageId: 8 },
      { text: "\u063A\u0631\u0628", targetPageId: 7 },
    ],
  },
  {
    id: 17,
    content:
      "\u062A\u0635\u0648\u06CC\u0631\u06CC \u0631\u0648\u06CC \u062F\u06CC\u0648\u0627\u0631 \u0646\u0642\u0634 \u0634\u062F\u0647. \u0646\u0642\u0634\u0647\u200C\u0627\u06CC \u0642\u062F\u06CC\u0645\u06CC \u0627\u0632 \u0633\u0631\u062F\u0627\u0628 \u0631\u0627 \u0646\u0634\u0627\u0646 \u0645\u06CC\u200C\u062F\u0647\u062F. \u0686\u0646\u062F \u0639\u0644\u0627\u0645\u062A \u0639\u062C\u06CC\u0628 \u0631\u0648\u06CC \u0622\u0646 \u062D\u06A9 \u0634\u062F\u0647. \u0627\u06CC\u0646 \u0646\u0642\u0634\u0647 \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0628\u0647 \u062F\u0631\u062F\u062A\u0627\u0646 \u0628\u062E\u0648\u0631\u062F.",
    backgroundVideo: "bg-lit-cellar.mp4",
    audio: "ambience-room-tone.mp3",
    choices: [
      { text: "\u0628\u0631\u06AF\u0634\u062A\u0646", targetPageId: 13 },
    ],
    itemsFound: ["ancient_map"],
  },
  {
    id: 18,
    content:
      "\u06CC\u06A9 \u0646\u0627\u0645\u0647: \u0633\u0644\u0627\u0645! \u0647\u0631\u0627\u0633 \u0628\u0647 \u062F\u0644 \u0631\u0627\u0647 \u0646\u062F\u0647\u06CC\u062F... \u0633\u0647 \u0633\u06A9\u0647 \u06CC \u06CC\u06A9 \u0642\u0631\u0627\u0646\u06CC \u0628\u0631\u0627\u06CC \u0634\u0645\u0627 \u062F\u0631 \u067E\u0627\u06A9\u062A \u0642\u0631\u0627\u0631 \u062F\u0627\u062F\u0647 \u0627\u0645. \u0627\u0645\u0636\u0627 \u06A9\u0627\u0631\u0622\u06AF\u0627\u0647 \u0641\u0631\u0628\u0648\u062F.",
    backgroundVideo: "bg-reading-letter.mp4",
    audio: "sfx-paper-rustle.mp3",
    choices: [
      { text: "\u0628\u0631\u06AF\u0634\u062A\u0646", targetPageId: 14 },
    ],
    itemsFound: ["letter_farboud", "coins_3"],
  },
  {
    id: 19,
    content:
      "\u0633\u0631\u062F\u06CC \u062F\u06CC\u0648\u0627\u0631 \u0631\u0627 \u062D\u0633 \u0645\u06CC\u06A9\u0646\u06CC\u062F... \u06CC\u06A9 \u0686\u0631\u0627\u063A \u0646\u0641\u062A\u06CC \u0631\u0648\u06CC \u0632\u0645\u06CC\u0646 \u0627\u0633\u062A.",
    backgroundVideo: "bg-lantern-floor.mp4",
    audio: "ambience-room-tone.mp3",
    choices: [
      { text: "\u063A\u0631\u0628", targetPageId: 5 },
      { text: "\u0634\u0645\u0627\u0644", targetPageId: 11 },
      {
        text: "\u0627\u06AF\u0631 \u06A9\u0628\u0631\u06CC\u062A \u062F\u0627\u0631\u06CC\u062F \u0645\u06CC\u062A\u0648\u0627\u0646\u06CC\u062F \u0641\u0627\u0646\u0648\u0633 \u0631\u0627 \u0631\u0648\u0634\u0646 \u06A9\u0646\u06CC\u062F",
        targetPageId: 13,
        requirements: { item: "matches", cost: 1 },
      },
    ],
  },
  {
    id: 21,
    content:
      "\u0628\u0647 \u0633\u0645\u062A \u063A\u0631\u0628 \u062D\u0631\u06A9\u062A \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F. \u0632\u0645\u06CC\u0646 \u0632\u06CC\u0631 \u067E\u0627\u06CC\u062A\u0627\u0646 \u0645\u0631\u0637\u0648\u0628 \u0627\u0633\u062A \u0648 \u0628\u0648\u06CC \u062E\u0627\u06A9 \u0646\u0645\u0646\u0627\u06A9 \u062F\u0631 \u0647\u0648\u0627 \u067E\u06CC\u0686\u06CC\u062F\u0647. \u062F\u0633\u062A\u200C\u0647\u0627\u06CC\u062A\u0627\u0646 \u0628\u0647 \u0686\u06CC\u0632\u06CC \u0641\u0644\u0632\u06CC \u0628\u0631\u062E\u0648\u0631\u062F \u0645\u06CC\u200C\u06A9\u0646\u062F. \u06CC\u06A9 \u0644\u0648\u0644\u0647\u200C\u06CC \u0622\u0647\u0646\u06CC \u0627\u0632 \u062F\u06CC\u0648\u0627\u0631 \u0628\u06CC\u0631\u0648\u0646 \u0632\u062F\u0647 \u0627\u0633\u062A.",
    backgroundVideo: "bg-damp-cellar.mp4",
    audio: "ambience-damp.mp3",
    choices: [
      { text: "\u0634\u0631\u0642", targetPageId: 5 },
      { text: "\u0634\u0645\u0627\u0644", targetPageId: 10 },
      {
        text: "\u0644\u0648\u0644\u0647 \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F",
        targetPageId: 9,
      },
    ],
    itemsFound: ["coins_2"],
  },
]

function getPage(id: number): StoryPage {
  return (
    storyData.find((p) => p.id === id) ?? {
      id: -1,
      content:
        "\u0627\u06CC\u0646 \u0645\u0633\u06CC\u0631 \u0647\u0646\u0648\u0632 \u06A9\u0634\u0641 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A... \u0628\u0631\u06AF\u0631\u062F\u06CC\u062F.",
      backgroundVideo: "bg-pitch-black.mp4",
      audio: "ambience-silence.mp3",
      choices: [
        { text: "\u0628\u0627\u0632\u06AF\u0634\u062A", targetPageId: 5 },
      ],
    }
  )
}

// Map locations with a pageId for fast-travel
const initialMapLocations = [
  { id: "entrance", name: "\u0648\u0631\u0648\u062F\u06CC", row: 0, col: 2, discovered: true, type: "building" as const, pageId: 2 },
  { id: "stairs", name: "\u067E\u0644\u06A9\u0627\u0646", row: 1, col: 2, discovered: false, type: "alley" as const, pageId: 3 },
  { id: "crossroads", name: "\u0686\u0647\u0627\u0631\u0631\u0627\u0647", row: 2, col: 2, discovered: false, type: "alley" as const, pageId: 5 },
  { id: "east_room", name: "\u0627\u062A\u0627\u0642 \u0634\u0631\u0642", row: 2, col: 4, discovered: false, type: "building" as const, pageId: 19 },
  { id: "west_passage", name: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u063A\u0631\u0628", row: 2, col: 0, discovered: false, type: "alley" as const, pageId: 21 },
  { id: "north_hall", name: "\u0633\u0627\u0644\u0646 \u0634\u0645\u0627\u0644\u06CC", row: 1, col: 1, discovered: false, type: "alley" as const, pageId: 8 },
  { id: "niche", name: "\u062A\u0627\u0642\u0686\u0647", row: 0, col: 0, discovered: false, type: "building" as const, pageId: 7 },
  { id: "cellar", name: "\u0633\u0631\u062F\u0627\u0628", row: 3, col: 2, discovered: false, type: "building" as const, pageId: 13 },
  { id: "water_room", name: "\u0627\u062A\u0627\u0642 \u0622\u0628", row: 3, col: 0, discovered: false, type: "bridge" as const, pageId: 9 },
  { id: "damp_cellar", name: "\u0632\u06CC\u0631\u0632\u0645\u06CC\u0646", row: 1, col: 0, discovered: false, type: "building" as const, pageId: 10 },
  { id: "corridor", name: "\u0631\u0627\u0647\u0631\u0648", row: 1, col: 3, discovered: false, type: "alley" as const, pageId: 11 },
  { id: "iron_door", name: "\u062F\u0631 \u0622\u0647\u0646\u06CC", row: 0, col: 1, discovered: false, type: "building" as const, pageId: 16 },
]

// Which pages discover which map locations
const pageDiscoverMap: Record<number, string[]> = {
  2: ["entrance"],
  3: ["stairs"],
  5: ["crossroads"],
  7: ["niche"],
  8: ["north_hall"],
  9: ["water_room"],
  10: ["damp_cellar"],
  11: ["corridor"],
  13: ["cellar"],
  16: ["iron_door"],
  19: ["east_room"],
  21: ["west_passage"],
}

// Which map location matches which page (for "current" highlight)
const pageToLocationId: Record<number, string> = {
  2: "entrance",
  3: "stairs",
  4: "stairs",
  5: "crossroads",
  7: "niche",
  8: "north_hall",
  9: "water_room",
  10: "damp_cellar",
  11: "corridor",
  13: "cellar",
  14: "cellar",
  15: "cellar",
  16: "iron_door",
  17: "cellar",
  18: "cellar",
  19: "east_room",
  21: "west_passage",
}

export default function GameScreen() {
  const [currentPageId, setCurrentPageId] = useState(2)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [coins, setCoins] = useState(0)
  const [matches, setMatches] = useState(0)
  const [time, setTime] = useState(5)
  const [mapOpen, setMapOpen] = useState(false)
  const [discoveredLocIds, setDiscoveredLocIds] = useState<Set<string>>(
    new Set(["entrance"])
  )
  const processedPages = useRef<Set<number>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevAudioRef = useRef<string>("")

  const page = getPage(currentPageId)

  // Process items when arriving at a new page
  useEffect(() => {
    if (processedPages.current.has(currentPageId)) return
    processedPages.current.add(currentPageId)

    if (!page.itemsFound) return

    for (const item of page.itemsFound) {
      const coinMatch = item.match(/^coins_(\d+)$/)
      if (coinMatch) {
        setCoins((prev) => prev + parseInt(coinMatch[1], 10))
        continue
      }

      const matchMatch = item.match(/^matches_(\d+)$/)
      if (matchMatch) {
        setMatches((prev) => prev + parseInt(matchMatch[1], 10))
        continue
      }

      if (item === "matches") {
        setMatches((prev) => prev + 1)
        continue
      }

      setInventory((prev) => {
        if (prev.some((i) => i.id === item)) return prev
        return [
          ...prev,
          {
            id: item,
            name: item
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            icon: item.includes("letter")
              ? "file"
              : item.includes("key")
                ? "key"
                : item.includes("map")
                  ? "file"
                  : "package",
            count: 1,
            description: item.replace(/_/g, " "),
          },
        ]
      })
    }
  }, [currentPageId, page.itemsFound])

  // Discover map locations
  useEffect(() => {
    const toDiscover = pageDiscoverMap[currentPageId]
    if (toDiscover) {
      setDiscoveredLocIds((prev) => {
        const next = new Set(prev)
        let changed = false
        for (const id of toDiscover) {
          if (!next.has(id)) {
            next.add(id)
            changed = true
          }
        }
        return changed ? next : prev
      })
    }
  }, [currentPageId])

  // Audio player: change track when page changes
  useEffect(() => {
    if (page.audio && page.audio !== prevAudioRef.current) {
      prevAudioRef.current = page.audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = `/audio/${page.audio}`
        audioRef.current.load()
        audioRef.current.play().catch(() => {
          /* autoplay may be blocked */
        })
      }
    }
  }, [page.audio])

  const isChoiceDisabled = useCallback(
    (choice: StoryChoice): boolean => {
      if (!choice.requirements) return false
      const { item, cost } = choice.requirements
      if (item === "coins") return coins < cost
      if (item === "matches") return matches < cost
      if (item === "time") return time < cost
      return false
    },
    [coins, matches, time]
  )

  const handleChoice = useCallback(
    (index: number) => {
      const choice = page.choices[index]
      if (!choice || isChoiceDisabled(choice)) return

      if (choice.requirements) {
        const { item, cost } = choice.requirements
        if (item === "coins") setCoins((prev) => prev - cost)
        if (item === "matches") setMatches((prev) => prev - cost)
        if (item === "time") setTime((prev) => prev - cost)
      }

      setCurrentPageId(choice.targetPageId)
    },
    [page.choices, isChoiceDisabled]
  )

  // Fast-travel from map
  const handleMapTravel = useCallback(
    (locationId: string) => {
      const loc = initialMapLocations.find((l) => l.id === locationId)
      if (loc && discoveredLocIds.has(locationId)) {
        setCurrentPageId(loc.pageId)
        setMapOpen(false)
      }
    },
    [discoveredLocIds]
  )

  const cardChoices = page.choices.map((choice, index) => ({
    id: String(index),
    text: choice.text,
    disabled: isChoiceDisabled(choice),
    requirementLabel: choice.requirements
      ? `(${choice.requirements.item === "matches" ? "\u06A9\u0628\u0631\u06CC\u062A" : choice.requirements.item === "coins" ? "\u0633\u06A9\u0647" : "\u0632\u0645\u0627\u0646"}: ${choice.requirements.cost})`
      : undefined,
  }))

  const displayInventory: InventoryItem[] = [
    ...(matches > 0
      ? [
          {
            id: "matches",
            name: "\u06A9\u0628\u0631\u06CC\u062A",
            icon: "flame",
            count: matches,
            description: "\u06A9\u0628\u0631\u06CC\u062A\u200C\u0647\u0627\u06CC \u06CC\u0627\u0641\u062A \u0634\u062F\u0647",
          },
        ]
      : []),
    ...(coins > 0
      ? [
          {
            id: "coins",
            name: "\u0633\u06A9\u0647",
            icon: "coins",
            count: coins,
            description: "\u0633\u06A9\u0647\u200C\u0647\u0627\u06CC \u06CC\u0627\u0641\u062A \u0634\u062F\u0647",
          },
        ]
      : []),
    ...inventory,
  ]

  // Current location for map highlight
  const currentLocId = pageToLocationId[currentPageId] ?? "entrance"

  // Build map locations with discovered + current states
  const mapLocations = initialMapLocations.map((loc) => ({
    ...loc,
    discovered: discoveredLocIds.has(loc.id),
    current: loc.id === currentLocId,
  }))

  return (
    <>
      {/* Hidden audio player */}
      <audio ref={audioRef} loop preload="none" className="hidden" />

      <StatusBar coins={coins} matches={matches} time={time} />

      <div className="flex items-center justify-start pl-6 md:pl-16 pr-24 pt-[52px] min-h-screen">
        <StoryCard
          text={page.content}
          choices={cardChoices}
          onChoiceSelect={(choiceId) => handleChoice(parseInt(choiceId, 10))}
          rtl
        />
      </div>

      <InventorySidebar items={displayInventory} />

      <MapButton onClick={() => setMapOpen(true)} />

      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        locations={mapLocations}
        onLocationSelect={handleMapTravel}
      />
    </>
  )
}
