"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [expandedLyrics, setExpandedLyrics] = useState<number | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tracks = [
    {
      title: "Circle Of Craze",
      url: "https://cdn1.suno.ai/d0c6cbea-c705-48d8-bfab-254b1befe044.mp3",
      cover: "https://cdn2.suno.ai/image_large_d0c6cbea-c705-48d8-bfab-254b1befe044.jpeg",
      chapter: "Track 1 · The Spiral",
      act: "ACT I — THE UNRAVELING",
      mood: "Obsession",
      accentColor: "#22d3ee",
      accent: "#22d3ee",
      story: "The mind won't stop. You replay every moment, every word, every silence — round and round until the madness feels like home.",
      lyricHighlight: "Going round and round / In this circle of craze",
      lyricTranslation: "The spiral is the only thing that feels real.",
      illustration: "spiral",
      lyricsBlocks: [
        { label: "Verse", lines: ["Tasteless favourites", "Priceless secrets", "What do you mean", "that you don't have a say", "Trendy fashion", "(what a) Revelation", "What do you mean", "that you are just so unheard"] },
        { label: "Prechorus", lines: ["maybe", "The roads aint so clear and straight", "To begin with", "Without", "the signs to be through", "Do you", "think you could make it to that truth"] },
        { label: "Chorus", lines: ["Don't fret", "When you are", "Lost in the maze", "When your", "mind drifts far away", "That is your circle of craze", "You bet you", "aint but", "You're just another inmate", "You're just another facade", "of your circle of craze"] },
        { label: "Bridge: Rap", lines: ["Oh no!", "I think I'm lost in the circle of craze", "it's like I'm stuck in a maze", "I hope there's several ways", "for me to roll back the days", "It like I'm stuck and lost in the circle of craze", "i hope I'm not the only one", "that is lost in the circle of craze", "any other pitiful ones", "especially excitable ones", "Do you (upbeat)", "think you could make it to that truth"] },
        { label: "Prechorus", lines: ["maybe", "The roads aint so clear and straight", "To begin with", "Without", "the signs to be through", "Do you", "think you could make it to that truth"] },
        { label: "Chorus", lines: ["Don't fret", "When you are", "Lost in the maze", "When your", "mind drifts far away", "That is your circle of craze", "You bet you", "aint but", "You're just another inmate", "You're just another facade", "of your circle of craze"] },
        { label: "Final Chorus", lines: ["Don't fret", "When you are", "Lost in the maze", "When your", "mind drifts far away", "That is your circle of craze", "You bet you", "aint but", "You're just another inmate", "You're just another facade", "of your circle o craze"] },
        { label: "Verse: Sung quietly", lines: ["Tasteless favourites", "Priceless secrets", "What do you mean", "that you don't have a say"] },
      ],
      lineTimes: [13.8, 13.8, 19.68, 19.68, 27.4, 27.4, 33.3, 33.3, 33.3, 39.14, 51.86, 88.72, 119.22, 127.0, 119.22, 127.0, 127.0, 188.94, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24, 236.24],
    },
    {
      title: "Old Photographs",
      url: "https://cdn1.suno.ai/cec9d85d-48d8-4f01-b5d4-63672b288f8e.mp3",
      cover: "https://cdn2.suno.ai/image_large_cec9d85d-48d8-4f01-b5d4-63672b288f8e.jpeg",
      chapter: "Track 2 · The Archive",
      act: "ACT I — THE UNRAVELING",
      mood: "Nostalgia",
      accentColor: "#fb923c",
      accent: "#fb923c",
      story: "A drawer pulled open by accident. Faces you almost forgot. The past is always more vivid than the present — frozen in frames that never age.",
      lyricHighlight: "These old photographs / Tell the stories we forgot",
      lyricTranslation: "Memory has its own light.",
      illustration: "photograph",
      lyricsBlocks: [
        { label: "Verse 1", lines: ["Old photographs on my bed", "Memories filling my head", "What am I to say", "There are so many", "So many to play"] },
        { label: "Verse 2", lines: ["You laughed at the things that I said", "Those thoughts still burn in my head", "What are you to say", "There are so little", "So little to waste"] },
        { label: "Prechorus", lines: ["Life's a dream", "Said I don't know where to keep it oh", "Dreams they are calling", "Said I don't know, don't know where I'm going whooa baby"] },
        { label: "Chorus", lines: ["Old photographs", "As jaded as the sun", "Whatever you could think about", "That lies beneath the clouds", "Old photographs", "As faded as the crowd", "Whatever you are doing now", "Remember the good times in the past"] },
        { label: "Verse 3", lines: ["The crazy things that we do", "The places that we used to go", "What are we to say", "There are so many", "Things that we break"] },
        { label: "Verse 4", lines: ["One summer we are lazy with this", "The other we are crazy about that", "What are we to say", "There are so little", "Time for a break"] },
        { label: "Prechorus", lines: ["Life's a dream", "Said I don't know where to keep it oh", "Dreams they are calling", "Said I don't know, don't know where I'm going whooa baby"] },
        { label: "Chorus", lines: ["Old photographs", "As jaded as the sun", "Whatever you could think about", "That lies beneath the clouds", "Old photographs", "As faded as the crowd", "Whatever you are doing now", "Remember the good times in the past"] },
        { label: "Final Chorus", lines: ["Old photographs", "As crazy as we are", "Whenever you are feeling down", "Remember these old photographs", "Whenever you are feeling down", "Remember our old photographs"] },
      ],
      lineTimes: [16.0, 20.0, 36.42, 36.42, 36.42, 68.6, 86.36, 111.9, 129.42, 129.42, 133.86, 135.9, 140.18, 145.58, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92, 204.92],
    },
    {
      title: "Look At Me Now",
      url: "https://cdn1.suno.ai/b3858920-e084-403d-a661-d9a2ce7e870e.mp3",
      cover: "https://cdn2.suno.ai/image_large_b3858920-e084-403d-a661-d9a2ce7e870e.jpeg",
      chapter: "Track 3 · The Rise",
      act: "ACT II — THE TURNING",
      mood: "Defiance",
      accentColor: "#34d399",
      accent: "#34d399",
      story: "You thought the fall would be the end. It was the beginning. From the wreckage came something tougher, cleaner, brighter. Look at me now.",
      lyricHighlight: "Look at me now / I'm not who I was before",
      lyricTranslation: "Survival is its own kind of art.",
      illustration: "rise",
      lyricsBlocks: [
        { label: "Verse 1", lines: ["Oh, won't you look at me now, I'm feeling insecure", "I must be losing my mind, oh I am feeling cold", "What do you think of the times when I am feeling so jaded", "So look at me", "Just look at me"] },
        { label: "Chorus", lines: ["Now… ah ha… I am flying inside", "Now… ah ha… I am flying outside", "Won't you look at me now", "Won't you look at me now", "Won't you look at me now", "Won't you look at me now", "Won't you look at me now", "Yes, I can look alright now"] },
        { label: "Verse 2", lines: ["Oh, when the daylight breaks in, I'm waking up unsure", "The world keeps spinning me 'round, I'm crashing on a roll", "But then I'm hearing the sound of all the people turning around", "So look at me", "Just look at me"] },
        { label: "Chorus", lines: ["Now… ah ha… I am flying inside", "Now… ah ha… I am flying outside", "Won't you look at me now", "Won't you look at me now", "Won't you look at me now", "Won't you look at me now", "Won't you look at me now", "Yes, I can look alright now"] },
        { label: "Bridge", lines: ["I've been hiding in shadows I made", "Running from echoes I never could fade", "But now the silence is bursting to flame", "I'm rising again", "I'm rising again"] },
        { label: "Final Chorus", lines: ["Now… ah ha… I am flying inside", "Now… ah ha… I am flying outside", "Won't you look at me now", "Won't you look at me now", "I'm not the same somehow", "Won't you look at me now", "Won't you look at me now", "Oh I can breathe again now", "Yes, I can look alright now"] },
        { label: "Outro", lines: ["Look at me now", "Look at me now", "Look at me now", "Yes, I can look alright now"] },
      ],
      lineTimes: [15.02, 74.46, 102.68, 163.0, 180.06, 180.06, 180.06, 195.9, 195.9, 195.9, 195.9, 195.9, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8, 202.8],
    },
    {
      title: "Hurt Me No More",
      url: "https://cdn1.suno.ai/c60c1c62-4d09-41e9-94e8-7908c7e001b9.mp3",
      cover: "https://cdn2.suno.ai/image_large_c60c1c62-4d09-41e9-94e8-7908c7e001b9.jpeg",
      chapter: "Track 4 · The Line",
      act: "ACT II — THE TURNING",
      mood: "Resolution",
      accentColor: "#f43f5e",
      accent: "#f43f5e",
      story: "There is a moment — quiet, certain — when enough becomes enough. Not with anger. With clarity. You close the door. You mean it this time.",
      lyricHighlight: "Hurt me no more / I've made up my mind",
      lyricTranslation: "Boundaries are not walls. They are doors you choose to keep closed.",
      illustration: "door",
      lyricsBlocks: [
        { label: "Verse", lines: ["Oh when I leave my mind", "Sort of just left it behind", "It felt so easy", "Oo im featherlight I've got a war in my mind", "I'm going crazy", "With the hurt inside", "Selective memories sing", "Of strifes that never cease to burn my paper heart", "So crazy"] },
        { label: "Chorus", lines: ["Cause I dont wanna dream", "This time to regret tomorrow for today", "Cause sometimes life's a bitch", "Cause I dont wanna live a life that is full of hurt inside", "Wont you hurt me somemore", "Now wont you hurt me somemore", "Now wont you hurt me", "No more"] },
        { label: "Verse", lines: ["Oh when I leave my mind", "Sort of just left it behind", "It felt so easy", "Oo im featherlight I've got a war in my mind", "I'm going crazy", "With the hurt inside", "Selective memories sing", "Of strifes that never cease to burn my paper heart", "So crazy"] },
        { label: "Chorus", lines: ["Cause I dont wanna dream", "This time to regret tomorrow for today", "Cause sometimes life's a bitch", "Cause I dont wanna live a life that is full of hurt inside", "Wont you hurt me somemore", "Now wont you hurt me somemore", "Now wont you hurt me"] },
        { label: "Final Chorus", lines: ["Cause I dont wanna dream", "This time to regret tomorrow for today", "Cause sometimes life's a bitch", "Cause I dont wanna live a life that is full of hurt inside", "Wont you hurt me somemore", "Now wont you hurt me somemore", "Now wont you hurt me no more"] },
      ],
      lineTimes: [89.82, 91.9, 91.9, 96.38, 100.96, 100.96, 105.7, 105.7, 113.46, 118.46, 122.5, 127.54, 132.54, 139.56, 143.18, 147.16, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4, 209.4],
    },
    {
      title: "Confused",
      url: "https://cdn1.suno.ai/58f8c4fb-f722-4563-893a-f88fa6d89c1c.mp3",
      cover: "https://cdn2.suno.ai/image_large_58f8c4fb-f722-4563-893a-f88fa6d89c1c.jpeg",
      chapter: "Track 5 · The Fog",
      act: "ACT II — THE TURNING",
      mood: "Liminal",
      accentColor: "#a78bfa",
      accent: "#a78bfa",
      story: "Between who you were and who you're becoming, there is a fog. You can't see forward. You can't go back. You exist in the in-between.",
      lyricHighlight: "I'm so confused / Don't know which way to go",
      lyricTranslation: "The fog is not a failure. It is the space where you change.",
      illustration: "fog",
      lyricsBlocks: [
        { label: "Verse 1", lines: ["I'm....", "So confused..", "I'm....", "Just like you..", "Turn around and tell me what are we supposed to do", "I'll leave a page and hook it on, that's simply just for you"] },
        { label: "Chorus", lines: ["Love's just rising in the far away sense", "Love's just keeping me so lost....", "Winter's changing seasons for you ooooooh", "Just don't keep me so confused"] },
        { label: "Verse 2", lines: ["I'm...", "So confused..", "I.. think", "I love you..", "I think about you everyday and don't know what to do", "Your crazy moves they drive me round; I'm simply so confused"] },
        { label: "Chorus", lines: ["Love's just rising in the far away sense", "Love's just keeping me so lost....", "Winter's changing seasons for you ooooooh", "Just don't keep me so confused"] },
        { label: "Final Chorus", lines: ["Love's just rising in the far away sense", "Love's just keeping me so lost....", "Winter's changing seasons for you ooooooh", "Just don't keep me so confused", "Just don't keep me so confused"] },
      ],
      lineTimes: [12.92, 12.92, 12.92, 18.68, 23.66, 27.44, 34.9, 41.2, 46.98, 52.42, 61.36, 61.36, 65.38, 65.38, 71.74, 76.7, 82.76, 89.12, 94.92, 100.5, 130.74, 136.52, 143.02, 148.5, 148.5],
    },
    {
      title: "Selectivism",
      url: "https://cdn1.suno.ai/d034bcf9-09f5-49cd-9479-0bfadab1675f.mp3",
      cover: "https://cdn2.suno.ai/image_large_d034bcf9-09f5-49cd-9479-0bfadab1675f.jpeg",
      chapter: "Track 6 · The Choice",
      act: "ACT III — THE CURATION",
      mood: "Clarity",
      accentColor: "#e2e8f0",
      accent: "#e2e8f0",
      story: "Not every memory deserves a frame. Selectivism is the art of choosing what you carry forward — and the freedom of letting the rest become dust.",
      lyricHighlight: "I choose what I remember / Leave the rest behind",
      lyricTranslation: "Memory is not a museum. It is a curation.",
      illustration: "frame",
      lyricsBlocks: [
        { label: "Verse", lines: ["Don't wanna find out if there's a million stars up in the sky", "Just keep it in your mind", "Don't wanna find out even if it's only tonight", "Cause all I'm thinking of is"] },
        { label: "Chorus", lines: ["All i want is just to see you so fine", "Hold you so tight and see your sunshine laughter fly", "To me being happy is what you can't perceive in", "You got a choice now baby", "Sometimes things aint just looking so right.", "Selectivism~", "Think~~"] },
        { label: "Verse", lines: ["Sometimes politeness couldn't get you free off the line", "Just keep it in your mind", "Somewhere you could find a band that sings to your desire", "For your soul satisfaction"] },
        { label: "Chorus", lines: ["All i want is just to see you so fine", "Hold you so tight and see your sunshine laughter fly", "To me being happy is what you can't perceive in", "You got a choice now baby", "Sometimes things aint just looking so right.", "Selectivism~", "Think~~"] },
        { label: "Final Chorus", lines: ["All i want is just to see you so fine", "Hold you so tight and see your sunshine laughter fly", "To me being happy is what you can't perceive in", "You got a choice now baby", "Sometimes things aint just looking so right.", "Selectivism~", "Think~~", "You got a choice now baby. Selectivism~ Think."] },
      ],
      lineTimes: [13.92, 22.08, 26.08, 34.06, 34.06, 44.16, 49.46, 58.4, 62.48, 68.36, 130.42, 134.94, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78, 222.78],
    },
    {
      title: "Day and Night",
      url: "https://cdn1.suno.ai/a454d8ef-a286-43e9-8d4d-fdf2f4ed18d2.mp3",
      cover: "https://cdn2.suno.ai/image_large_a454d8ef-a286-43e9-8d4d-fdf2f4ed18d2.jpeg",
      chapter: "Track 7 · The Balance",
      act: "ACT III — THE CURATION",
      mood: "Acceptance",
      accentColor: "#fcd34d",
      accent: "#fcd34d",
      story: "Two versions of yourself. The one the world sees by day — composed, forward-moving. The one only you know at night — tender, honest, still healing. Both are real. Both are you.",
      lyricHighlight: "In the day I smile / At night I feel it all",
      lyricTranslation: "You are allowed to be both.",
      illustration: "daynight",
      lyricsBlocks: [
        { label: "Verse", lines: ["Some days I'm feeling all quite right", "Some days I'm getting all too bright", "Today I'll just wait for the twilight"] },
        { label: "Verse", lines: ["Some nights I'm getting all the brine", "Some nights I'm hearing all the whine", "Tonight I'll just wait for the line"] },
        { label: "PreChorus", lines: ["No matter if it's day or nite in my life", "You can give me all the sunshine", "And when I look into your eyes", "No matter whatever", "Just seems to be behind"] },
        { label: "Chorus", lines: ["All day and all night long", "In my school of crazy thoughts", "Just thinking of you, whoooo ooh", "Sometimes I just wonder why", "I just can't get you off my mind", "All day and all night long", "My world's spinning all along", "Just turning for you, whoooo ooh", "Sometimes I just can't survive", "Without you so I'm missing all day all night long"] },
        { label: "Bridge: Melodic Rap", lines: ["Some days I'm calm, but my thoughts drift to you,", "Sippin' through the silence like I always do.", "Some days I glow, but the shine feels untrue,", "'Cause every ray of light just reminds me of you.", "Some nights I fade, sink deep in my mind,", "Playin' back moments we left behind.", "Some nights I wait, hopin' I'll find", "A trace of your voice in the quiet of time."] },
        { label: "PreChorus", lines: ["No matter if it's day or nite in my life", "You can give me all the sunshine", "And when I look into your eyes", "No matter whatever", "Just seems to be behind"] },
        { label: "Chorus", lines: ["All day and all night long", "In my school of crazy thoughts", "Just thinking of you, whoooo ooh", "Sometimes I just wonder why", "I just can't get you off my mind", "All day and all night long", "My world's spinning all along", "Just turning for you, whoooo ooh", "Sometimes I just can't survive", "Without you so I'm missing all day all night long"] },
        { label: "Outro Rap", lines: ["Some days the sun cuts deep through my eyes,", "And I swear I still see your face in the sky.", "Some nights the stars don't even try,", "Feels like they miss you, same as I.", "I'm still here, lost in the dark,", "Whisperin' your name to the beat of my heart.", "If you ever shine again through the night,", "I'll be the one still thinkin' of you, holdin' that light."] },
        { label: "Final Chorus", lines: ["All day and all night long", "My world's spinning all along", "Just turning for you, whoooo ooh", "Sometimes I just can't survive", "Without you so I'm missing all day all night long"] },
      ],
      lineTimes: [13.04, 19.52, 25.2, 36.8, 42.58, 48.6, 59.68, 65.76, 71.6, 76.22, 76.22, 82.92, 86.3, 89.1, 95.32, 99.62, 106.62, 106.62, 112.9, 119.62, 123.62, 130.02, 133.08, 135.72, 138.86, 141.68, 144.84, 147.4, 152.04, 153.58, 159.46, 164.58, 169.92, 169.92, 177.2, 180.24, 183.14, 190.24, 193.76, 201.24, 241.84, 254.98, 261.08, 265.02, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26, 270.26],
    },
  ];

  const acts = [
    { name: "ACT I", subtitle: "The Unraveling", color: "#22d3ee", chapters: [0, 1] },
    { name: "ACT II", subtitle: "The Turning", color: "#a78bfa", chapters: [2, 3, 4] },
    { name: "ACT III", subtitle: "The Curation", color: "#fcd34d", chapters: [5, 6] },
  ];

  // Auto-play on scroll
  useEffect(() => {
    const observers = chapterRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setCurrentTrack(index);
              setIsPlaying(true);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(ref);
      return observer;
    });
    return () => { observers.forEach((o) => o?.disconnect()); };
  }, []);

  // Jukebox: auto-advance
  useEffect(() => {
    if (!audioElement) return;
    const handleEnd = () => {
      const next = (currentTrack + 1) % tracks.length;
      setCurrentTrack(next);
      setTimeout(() => {
        chapterRefs.current[next]?.scrollIntoView({ behavior: "smooth" });
        setIsPlaying(true);
      }, 800);
    };
    audioElement.addEventListener("ended", handleEnd);
    return () => audioElement.removeEventListener("ended", handleEnd);
  }, [audioElement, currentTrack, tracks.length]);

  const getActForTrack = (idx: number) => acts.find((a) => a.chapters.includes(idx));
  const isFirstInAct = (idx: number) => acts.some((a) => a.chapters[0] === idx);

  // Illustration SVGs
  const illustrations: Record<string, React.ReactNode> = {
    spiral: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        {[80, 65, 50, 35, 20].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray={`${r * 0.4} ${r * 0.3}`} />
        ))}
        <circle cx="100" cy="100" r="4" fill="#22d3ee" opacity="0.6" />
      </svg>
    ),
    photograph: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        <rect x="30" y="45" width="140" height="110" rx="4" fill="none" stroke="#fb923c" strokeWidth="1" />
        <rect x="40" y="55" width="120" height="90" rx="2" fill="none" stroke="#fb923c" strokeWidth="0.5" />
        <circle cx="100" cy="95" r="20" fill="none" stroke="#fb923c" strokeWidth="0.5" />
        <line x1="30" y1="170" x2="170" y2="170" stroke="#fb923c" strokeWidth="0.5" />
      </svg>
    ),
    rise: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        <polyline points="20,160 60,120 90,135 130,80 170,40" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="170" cy="40" r="5" fill="#34d399" opacity="0.8" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1={150 + i * 8} y1={30 + i * 8} x2={170} y2={40} stroke="#34d399" strokeWidth="0.8" opacity="0.5" />
        ))}
      </svg>
    ),
    door: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        <rect x="65" y="40" width="70" height="130" rx="4" fill="none" stroke="#f43f5e" strokeWidth="1" />
        <rect x="65" y="40" width="70" height="130" rx="4" fill="#f43f5e" opacity="0.03" />
        <circle cx="125" cy="107" r="4" fill="#f43f5e" opacity="0.8" />
        <line x1="65" y1="40" x2="50" y2="55" stroke="#f43f5e" strokeWidth="0.5" />
        <line x1="135" y1="40" x2="150" y2="55" stroke="#f43f5e" strokeWidth="0.5" />
        <line x1="50" y1="55" x2="50" y2="185" stroke="#f43f5e" strokeWidth="0.5" />
        <line x1="150" y1="55" x2="150" y2="185" stroke="#f43f5e" strokeWidth="0.5" />
      </svg>
    ),
    fog: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        {[70, 90, 110, 130, 150].map((y, i) => (
          <line key={i} x1={20 + i * 5} y1={y} x2={180 - i * 5} y2={y} stroke="#a78bfa" strokeWidth="0.8" opacity={0.3 + i * 0.12} />
        ))}
        <ellipse cx="100" cy="100" rx="60" ry="40" fill="none" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="4 3" />
      </svg>
    ),
    frame: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        <rect x="35" y="35" width="130" height="130" rx="2" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="50" y="50" width="100" height="100" rx="1" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        <rect x="62" y="62" width="76" height="76" rx="1" fill="#e2e8f0" opacity="0.03" />
        <line x1="35" y1="35" x2="50" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="165" y1="35" x2="150" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="35" y1="165" x2="50" y2="150" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="165" y1="165" x2="150" y2="150" stroke="#e2e8f0" strokeWidth="0.5" />
      </svg>
    ),
    daynight: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        <circle cx="100" cy="100" r="70" fill="none" stroke="#fcd34d" strokeWidth="0.5" />
        <path d="M100 30 A70 70 0 0 1 100 170" fill="#fcd34d" opacity="0.05" />
        <path d="M100 30 A70 70 0 0 0 100 170" fill="#22d3ee" opacity="0.05" />
        <circle cx="70" cy="80" r="8" fill="#fcd34d" opacity="0.6" />
        <circle cx="130" cy="120" r="6" fill="#22d3ee" opacity="0.6" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={120 + i * 12} cy={75 - i * 8} r="1.5" fill="white" opacity={0.3 + i * 0.1} />
        ))}
      </svg>
    ),
  };

  return (
    <div className="min-h-screen" style={{ background: "#030712" }}>

      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-[150px]" style={{ background: "rgba(34,211,238,0.04)" }} />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full blur-[150px]" style={{ background: "rgba(167,139,250,0.04)" }} />
        </div>

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: "rgba(34,211,238,0.5)" }}>
            EVAZE · Debut Album
          </p>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tight mb-2"
            style={{
              background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 40%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}>
            EVAZE
          </h1>

          <div className="w-16 h-px mx-auto my-6" style={{ background: "linear-gradient(to right, transparent, rgba(226,232,240,0.4), transparent)" }} />

          <h2 className="text-3xl md:text-4xl font-light tracking-widest mb-2" style={{ color: "rgba(226,232,240,0.85)" }}>
            Selective
          </h2>
          <h2 className="text-3xl md:text-4xl font-light tracking-widest mb-10" style={{ color: "rgba(226,232,240,0.85)" }}>
            Memories
          </h2>

          <p className="text-sm text-white/30 mb-2 italic">
            &ldquo;In memory, we are all editors.&rdquo;
          </p>
          <p className="text-xs text-white/20 mb-16 tracking-wider">
            7 tracks · 3 acts · 1 story
          </p>

          {/* Act overview pills */}
          <div className="flex gap-6 justify-center mb-16 flex-wrap">
            {acts.map((act, i) => (
              <div key={i} className="text-center">
                <p className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: act.color }}>{act.name}</p>
                <p className="text-xs text-white/25">{act.subtitle}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              chapterRefs.current[0]?.scrollIntoView({ behavior: "smooth" });
              setIsPlaying(true);
            }}
            className="px-10 py-4 rounded-full text-sm uppercase tracking-widest font-medium transition-all hover:scale-105 border"
            style={{ borderColor: "rgba(34,211,238,0.25)", color: "rgba(34,211,238,0.75)", background: "rgba(34,211,238,0.04)" }}
          >
            Begin Listening
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Tracks */}
      <div className="relative">
        {tracks.map((track, index) => {
          const act = getActForTrack(index);
          const isFirst = isFirstInAct(index);

          return (
            <div key={index}>
              {/* Act divider */}
              {isFirst && act && (
                <div className="relative py-24 flex items-center justify-center overflow-hidden" style={{ background: "#030712" }}>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${act.color}08 0%, transparent 70%)` }} />
                  <div className="text-center relative z-10 px-6">
                    <div className="inline-flex items-center gap-4 mb-4">
                      <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${act.color}60)` }} />
                      <p className="text-xs uppercase tracking-[0.4em] font-medium" style={{ color: `${act.color}80` }}>{act.name}</p>
                      <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${act.color}60)` }} />
                    </div>
                    <h3 className="text-3xl font-bold tracking-wide uppercase" style={{ color: act.color }}>
                      {act.subtitle}
                    </h3>
                  </div>
                </div>
              )}

              {/* Track panel */}
              <div
                ref={(el) => { chapterRefs.current[index] = el; }}
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
                style={{ background: "#030712" }}
              >
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
                    style={{ background: `${track.accent}0d` }} />
                </div>

                <div className="container mx-auto px-6 md:px-16 py-24 relative z-10">
                  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">

                    {/* Artwork */}
                    <div className={`${index % 2 === 0 ? "order-2 md:order-1" : "order-2"} relative`}>
                      {/* Illustration overlay (behind image) */}
                      <div className="absolute -inset-8 pointer-events-none">
                        {illustrations[track.illustration]}
                      </div>

                      {/* Border glow */}
                      <div className="absolute -inset-2 rounded-2xl blur-xl opacity-20"
                        style={{ background: track.accent }} />

                      <div className="relative aspect-square rounded-2xl overflow-hidden"
                        style={{ boxShadow: `0 0 60px ${track.accent}20, 0 25px 50px rgba(0,0,0,0.9)` }}>
                        <Image
                          src={track.cover}
                          alt={track.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0"
                          style={{ background: `linear-gradient(to bottom, transparent 50%, #030712 100%)` }} />
                        {/* Colored tint */}
                        <div className="absolute inset-0"
                          style={{ background: `${track.accent}08`, mixBlendMode: "overlay" }} />
                      </div>

                      {/* Track number watermark */}
                      <div className="absolute -bottom-6 -right-4 text-9xl font-bold leading-none select-none pointer-events-none"
                        style={{ color: `${track.accent}08`, letterSpacing: "-0.05em" }}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Story side */}
                    <div className={`${index % 2 === 0 ? "order-1 md:order-2" : "order-1"}`}>
                      <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: `${track.accent}60` }}>
                        {track.chapter}
                      </p>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${track.accent}, ${track.accent}40)` }} />
                        <span className="text-sm font-medium tracking-wide" style={{ color: track.accent }}>{track.mood}</span>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight" style={{ letterSpacing: "-0.02em" }}>
                        {track.title}
                      </h2>

                      <p className="text-lg text-white/65 leading-relaxed mb-8">
                        {track.story}
                      </p>

                      {/* Pull quote */}
                      <div className="border-l-2 pl-5 mb-10" style={{ borderColor: `${track.accent}35` }}>
                        <p className="text-sm text-white/45 leading-loose italic mb-1">
                          {track.lyricHighlight.split(" / ").map((line, i) => (
                            <span key={i} className="block">{line}</span>
                          ))}
                        </p>
                        <p className="text-xs text-white/25 italic">{track.lyricTranslation}</p>
                      </div>

                      {/* Play button + track nav */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <button
                          onClick={() => {
                            setCurrentTrack(index);
                            setIsPlaying(currentTrack !== index || !isPlaying);
                          }}
                          className="flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all hover:scale-105"
                          style={{ background: `${track.accent}15`, color: track.accent, border: `1px solid ${track.accent}30` }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            {currentTrack === index && isPlaying ? (
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            ) : (
                              <path d="M8 5v14l11-7z" />
                            )}
                          </svg>
                          {currentTrack === index && isPlaying ? "Pause" : "Play"}
                        </button>

                        <button
                          onClick={() => setExpandedLyrics(expandedLyrics === index ? null : index)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm tracking-wide transition-all hover:scale-105"
                          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h10M4 18h7" />
                          </svg>
                          {expandedLyrics === index ? "Hide Lyrics" : "Lyrics"}
                        </button>

                        {/* Track dots */}
                        <div className="flex items-center gap-1.5">
                          {tracks.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setCurrentTrack(i);
                                chapterRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
                                setIsPlaying(true);
                              }}
                              className="rounded-full transition-all duration-300"
                              style={{
                                width: i === index ? "28px" : "5px",
                                height: "4px",
                                background: i === index ? track.accent : `${track.accent}30`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lyrics panel */}
                  {expandedLyrics === index && (
                    <div className="mt-12 pt-10 border-t" style={{ borderColor: `${track.accent}15` }}>
                      <div className="max-w-2xl mx-auto">
                        <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: `${track.accent}50` }}>
                          Full Lyrics
                        </p>
                        <div className="text-sm leading-loose" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {track.lyricsBlocks?.map((block, bi) => (
                            <div key={bi} className="mb-4">
                              {block.label && (
                                <p className="text-xs uppercase tracking-widest mt-6 mb-2 font-medium" style={{ color: `${track.accent}70` }}>
                                  {block.label}
                                </p>
                              )}
                              {block.lines.map((line, li) => (
                                <p key={li}>{line}</p>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Coda */}
        <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden" style={{ background: "#030712" }}>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
              style={{ background: "rgba(252,211,77,0.04)" }} />
          </div>
          <div className="text-center px-6 relative z-10 max-w-xl">
            <p className="text-xs tracking-[0.5em] uppercase mb-8" style={{ color: "rgba(252,211,77,0.35)" }}>Coda</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: "rgba(226,232,240,0.9)", letterSpacing: "-0.02em" }}>
              What you keep<br />
              <span style={{
                background: "linear-gradient(135deg, #fcd34d, #fb923c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                defines you.
              </span>
            </h2>
            <div className="w-16 h-px mx-auto my-8" style={{ background: "linear-gradient(to right, transparent, rgba(252,211,77,0.35), transparent)" }} />
            <p className="text-white/30 text-base italic mb-16">
              Selective Memories · EVAZE · 2025
            </p>
            <button
              onClick={() => {
                chapterRefs.current[0]?.scrollIntoView({ behavior: "smooth" });
                setCurrentTrack(0);
                setIsPlaying(true);
              }}
              className="px-10 py-4 rounded-full text-sm uppercase tracking-widest font-medium transition-all hover:scale-105 border"
              style={{ borderColor: "rgba(252,211,77,0.25)", color: "rgba(252,211,77,0.7)", background: "rgba(252,211,77,0.04)" }}
            >
              ↺ Play Again
            </button>
          </div>
        </div>
      </div>

      {/* Player */}
      <MusicPlayer
        tracks={tracks}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setAudioElement={setAudioElement}
      />
    </div>
  );
}
