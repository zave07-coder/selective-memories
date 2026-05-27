"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface LyricBlock {
  label: string;
  lines: string[];
}

interface Track {
  title: string;
  url: string;
  cover: string;
  chapter: string;
  mood: string;
  accent: string;
  lyricsBlocks?: LyricBlock[];
  lineTimes?: number[];
}

interface Props {
  tracks: Track[];
  currentTrack: number;
  setCurrentTrack: (n: number) => void;
  isPlaying: boolean;
  setIsPlaying: (b: boolean) => void;
  setAudioElement: (el: HTMLAudioElement | null) => void;
}

export default function MusicPlayer({
  tracks,
  currentTrack,
  setCurrentTrack,
  isPlaying,
  setIsPlaying,
  setAudioElement,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentLyricIdx, setCurrentLyricIdx] = useState(-1);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const track = tracks[currentTrack];

  // Flatten lyrics for display
  const flatLines: { text: string; isLabel: boolean }[] = [];
  if (track.lyricsBlocks) {
    track.lyricsBlocks.forEach((block) => {
      if (block.label) flatLines.push({ text: block.label, isLabel: true });
      block.lines.forEach((l) => flatLines.push({ text: l, isLabel: false }));
    });
  }
  const lyricLines = flatLines.filter((l) => !l.isLabel).map((l) => l.text);

  // Wake lock
  const acquireWakeLock = useCallback(async () => {
    if ("wakeLock" in navigator && !wakeLockRef.current) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {}
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, []);

  // Init audio
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;
    setAudioElement(audio);

    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => {
      const next = (currentTrack + 1) % tracks.length;
      setCurrentTrack(next);
    });

    return () => {
      audio.pause();
      audio.src = "";
      releaseWakeLock();
    };
  }, []); // eslint-disable-line

  // Track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.url;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setCurrentLyricIdx(-1);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
      acquireWakeLock();
    }
  }, [currentTrack]); // eslint-disable-line

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
      acquireWakeLock();
    } else {
      audio.pause();
      releaseWakeLock();
    }
  }, [isPlaying]); // eslint-disable-line

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Lyrics sync
  useEffect(() => {
    if (!track.lineTimes || track.lineTimes.length === 0) return;
    let idx = -1;
    for (let i = 0; i < track.lineTimes.length; i++) {
      if (currentTime >= track.lineTimes[i]) idx = i;
    }
    if (idx !== currentLyricIdx) {
      setCurrentLyricIdx(idx);
      if (idx >= 0 && lyricsContainerRef.current) {
        const el = lyricsContainerRef.current.querySelector(`[data-lyric="${idx}"]`) as HTMLElement;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, track.lineTimes, currentLyricIdx, lyricLines.length]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const currentLyricText = lyricLines[currentLyricIdx] ?? "";

  return (
    <>
      {/* Lyrics overlay */}
      {showLyrics && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#030712f5", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image src={track.cover} alt={track.title} width={40} height={40} className="object-cover w-full h-full" unoptimized />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{track.title}</p>
                <p className="text-xs" style={{ color: track.accent }}>{track.chapter}</p>
              </div>
            </div>
            <button onClick={() => setShowLyrics(false)} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={lyricsContainerRef} className="flex-1 overflow-y-auto px-8 py-12 max-w-2xl mx-auto w-full">
            {track.lyricsBlocks ? (
              flatLines.map((item, i) => {
                if (item.isLabel) {
                  return (
                    <p key={i} className="text-xs uppercase tracking-widest text-white/20 mt-8 mb-3 first:mt-0">
                      {item.text}
                    </p>
                  );
                }
                const lineIdx = flatLines.slice(0, i).filter((x) => !x.isLabel).length;
                const isActive = lineIdx === currentLyricIdx;
                const isPast = lineIdx < currentLyricIdx;
                return (
                  <p
                    key={i}
                    data-lyric={lineIdx}
                    className="text-xl leading-loose transition-all duration-500 cursor-pointer"
                    style={{
                      color: isActive ? "white" : isPast ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.45)",
                      transform: isActive ? "scale(1.03)" : "scale(1)",
                      transformOrigin: "left center",
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onClick={() => {
                      if (track.lineTimes?.[lineIdx] !== undefined && audioRef.current) {
                        audioRef.current.currentTime = track.lineTimes[lineIdx];
                        if (!isPlaying) setIsPlaying(true);
                      }
                    }}
                  >
                    {item.text}
                  </p>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/30 text-sm italic">Lyrics coming soon.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating player bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3"
        style={{ background: "linear-gradient(to top, #030712 0%, #030712ee 80%, transparent 100%)" }}
      >
        <div className="max-w-3xl mx-auto rounded-2xl px-4 py-3"
          style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 -4px 40px rgba(0,0,0,0.5)" }}>

          {/* Progress bar */}
          <div className="mb-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={seek}
              className="w-full h-1 rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${track.accent} ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.12) ${(currentTime / (duration || 1)) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/25 mt-1">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cover */}
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
              style={{ boxShadow: `0 0 16px ${track.accent}40` }}>
              <Image src={track.cover} alt={track.title} width={40} height={40} className="object-cover w-full h-full" unoptimized />
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{track.title}</p>
              <p className="text-xs truncate" style={{ color: `${track.accent}99` }}>{track.chapter} · EVAZE</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Prev */}
              <button
                onClick={() => setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length)}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold transition-all hover:scale-105"
                style={{ background: track.accent }}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => setCurrentTrack((currentTrack + 1) % tracks.length)}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" />
                </svg>
              </button>

              {/* Lyrics */}
              {track.lyricsBlocks && (
                <button
                  onClick={() => setShowLyrics(!showLyrics)}
                  className="p-2 transition-colors hidden sm:block"
                  style={{ color: showLyrics ? track.accent : "rgba(255,255,255,0.4)" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </button>
              )}

              {/* Volume — hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                  type="range" min={0} max={1} step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 cursor-pointer"
                  style={{ background: `linear-gradient(to right, rgba(255,255,255,0.5) ${volume * 100}%, rgba(255,255,255,0.12) ${volume * 100}%)` }}
                />
              </div>
            </div>
          </div>

          {/* Mini lyrics ticker */}
          {!showLyrics && currentLyricText && track.lyricsBlocks && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <p className="text-xs text-center truncate" style={{ color: `${track.accent}90` }}>
                {currentLyricText}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
