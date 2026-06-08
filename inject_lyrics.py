#!/usr/bin/env python3
"""
Inject lyricsBlocks and lineTimes into page.tsx, replacing the raw `lyrics` field.
Also patches the expandedLyrics UI to render blocks instead of raw string.
"""
import json, re

with open("lyrics_data.json") as f:
    data = {d["title"]: d for d in json.load(f)}

with open("app/page.tsx") as f:
    src = f.read()

def blocks_ts(blocks):
    lines = ["["]
    for b in blocks:
        escaped_lines = [l.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") for l in b["lines"]]
        lines_str = ", ".join(f'"{l.replace(chr(34), chr(92)+chr(34))}"' for l in escaped_lines)
        lines.append(f'        {{ label: "{b["label"]}", lines: [{lines_str}] }},')
    lines.append("      ]")
    return "\n".join(lines)

def times_ts(times):
    return "[" + ", ".join(str(t) for t in times) + "]"

# For each track title, find and replace the `lyrics: `...`` field
for title, d in data.items():
    blocks_str = blocks_ts(d["lyricsBlocks"])
    times_str = times_ts(d["lineTimes"])

    replacement = f"lyricsBlocks: {blocks_str},\n      lineTimes: {times_str},"

    # Match `lyrics: `...`` (backtick template literal, possibly multiline)
    # Strategy: find the track by title, then replace its lyrics field
    pattern = r'(title:\s*"' + re.escape(title) + r'".*?)(      lyrics:\s*`[^`]*`)(,)'
    m = re.search(pattern, src, re.DOTALL)
    if m:
        src = src[:m.start(2)] + "      " + replacement + src[m.end(3):]
        print(f"✓ Replaced lyrics for: {title}")
    else:
        print(f"✗ Could not find lyrics for: {title}")

# Update the expandedLyrics UI to render lyricsBlocks instead of raw lyrics string
old_lyrics_ui = """                        <div className="text-sm leading-loose" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {track.lyrics.split('\\n').map((line, li) => {
                            const isSection = /^\\[.+\\]$/.test(line.trim());
                            if (isSection) {
                              return (
                                <p key={li} className="text-xs uppercase tracking-widest mt-6 mb-2 font-medium" style={{ color: `${track.accent}70` }}>
                                  {line.replace(/[\\[\\]]/g, '')}
                                </p>
                              );
                            }
                            if (line.trim() === '') return <div key={li} className="h-2" />;
                            return <p key={li}>{line}</p>;
                          })}
                        </div>"""

new_lyrics_ui = """                        <div className="text-sm leading-loose" style={{ color: "rgba(255,255,255,0.55)" }}>
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
                        </div>"""

if old_lyrics_ui in src:
    src = src.replace(old_lyrics_ui, new_lyrics_ui)
    print("✓ Updated expandedLyrics UI")
else:
    print("✗ Could not find expandedLyrics UI pattern — may need manual update")

# Update Track interface usage: add lyricsBlocks/lineTimes to MusicPlayer call
# The MusicPlayer already supports these, tracks just needed the data

with open("app/page.tsx", "w") as f:
    f.write(src)

print("\nDone. page.tsx updated.")
