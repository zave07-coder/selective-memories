#!/usr/bin/env python3
"""
Convert Whisper segments + raw lyrics into lyricsBlocks + lineTimes for each track.
Outputs a JSON file to be pasted into page.tsx.
"""
import json, re, os, difflib

WHISPER_DIR = "whisper_out"

# Map audio ID → raw lyrics (extracted from page.tsx manually here for clarity)
TRACKS = [
    {
        "id": "d0c6cbea-c705-48d8-bfab-254b1befe044",
        "title": "Circle Of Craze",
        "lyrics": """[Intro Riff]

[Verse]
Tasteless favourites
Priceless secrets
What do you mean
that you don't have a say

Trendy fashion
(what a) Revelation
What do you mean
that you are just so unheard

[Prechorus]
maybe
The roads aint so clear and straight
To begin with
Without
the signs to be through
Do you
think you could make it to that truth

[Chorus]
Don't fret
When you are
Lost in the maze
When your
mind drifts far away
That is your circle of craze

You bet you
aint but
You're just another inmate
You're just another facade
of your circle of craze

[Bridge: Rap]
Oh no!
I think I'm lost in the circle of craze
it's like I'm stuck in a maze
I hope there's several ways
for me to roll back the days
It like I'm stuck and lost in the circle of craze

i hope I'm not the only one
that is lost in the circle of craze
any other pitiful ones
especially excitable ones
Do you (upbeat)
think you could make it to that truth

[Prechorus]
maybe
The roads aint so clear and straight
To begin with
Without
the signs to be through
Do you
think you could make it to that truth

[Chorus]
Don't fret
When you are
Lost in the maze
When your
mind drifts far away
That is your circle of craze

You bet you
aint but
You're just another inmate
You're just another facade
of your circle of craze

[Final Chorus]
Don't fret
When you are
Lost in the maze
When your
mind drifts far away
That is your circle of craze

You bet you
aint but
You're just another inmate
You're just another facade
of your circle o craze

[Verse: Sung quietly]
Tasteless favourites
Priceless secrets
What do you mean
that you don't have a say"""
    },
    {
        "id": "cec9d85d-48d8-4f01-b5d4-63672b288f8e",
        "title": "Old Photographs",
        "lyrics": """[Verse 1]
Old photographs on my bed
Memories filling my head
What am I to say
There are so many
So many to play

[Verse 2]
You laughed at the things that I said
Those thoughts still burn in my head
What are you to say
There are so little
So little to waste

[Prechorus]
Life's a dream
Said I don't know where to keep it oh
Dreams they are calling
Said I don't know, don't know where I'm going whooa baby

[Chorus]
Old photographs
As jaded as the sun
Whatever you could think about
That lies beneath the clouds

Old photographs
As faded as the crowd
Whatever you are doing now
Remember the good times in the past

[Guitar Solo]

[Verse 3]
The crazy things that we do
The places that we used to go
What are we to say
There are so many
Things that we break

[Verse 4]
One summer we are lazy with this
The other we are crazy about that
What are we to say
There are so little
Time for a break

[Prechorus]
Life's a dream
Said I don't know where to keep it oh
Dreams they are calling
Said I don't know, don't know where I'm going whooa baby

[Chorus]
Old photographs
As jaded as the sun
Whatever you could think about
That lies beneath the clouds

Old photographs
As faded as the crowd
Whatever you are doing now
Remember the good times in the past

[Final Chorus]
Old photographs
As crazy as we are
Whenever you are feeling down
Remember these old photographs

Whenever you are feeling down
Remember our old photographs"""
    },
    {
        "id": "b3858920-e084-403d-a661-d9a2ce7e870e",
        "title": "Look At Me Now",
        "lyrics": """[Verse 1]
Oh, won't you look at me now, I'm feeling insecure
I must be losing my mind, oh I am feeling cold
What do you think of the times when I am feeling so jaded
So look at me
Just look at me

[Chorus]
Now… ah ha… I am flying inside
Now… ah ha… I am flying outside
Won't you look at me now
Won't you look at me now
Won't you look at me now
Won't you look at me now
Won't you look at me now
Yes, I can look alright now

[Verse 2]
Oh, when the daylight breaks in, I'm waking up unsure
The world keeps spinning me 'round, I'm crashing on a roll
But then I'm hearing the sound of all the people turning around
So look at me
Just look at me

[Chorus]
Now… ah ha… I am flying inside
Now… ah ha… I am flying outside
Won't you look at me now
Won't you look at me now
Won't you look at me now
Won't you look at me now
Won't you look at me now
Yes, I can look alright now

[Bridge]
I've been hiding in shadows I made
Running from echoes I never could fade
But now the silence is bursting to flame
I'm rising again
I'm rising again

[Final Chorus]
Now… ah ha… I am flying inside
Now… ah ha… I am flying outside
Won't you look at me now
Won't you look at me now
I'm not the same somehow
Won't you look at me now
Won't you look at me now
Oh I can breathe again now
Yes, I can look alright now

[Outro]
Look at me now
Look at me now
Look at me now
Yes, I can look alright now"""
    },
    {
        "id": "c60c1c62-4d09-41e9-94e8-7908c7e001b9",
        "title": "Hurt Me No More",
        "lyrics": """[Verse]
Oh when I leave my mind
Sort of just left it behind
It felt so easy
Oo im featherlight I've got a war in my mind
I'm going crazy
With the hurt inside
Selective memories sing
Of strifes that never cease to burn my paper heart
So crazy

[Chorus]
Cause I dont wanna dream
This time to regret tomorrow for today
Cause sometimes life's a bitch
Cause I dont wanna live a life that is full of hurt inside
Wont you hurt me somemore
Now wont you hurt me somemore
Now wont you hurt me
No more

[Verse]
Oh when I leave my mind
Sort of just left it behind
It felt so easy
Oo im featherlight I've got a war in my mind
I'm going crazy
With the hurt inside
Selective memories sing
Of strifes that never cease to burn my paper heart
So crazy

[Chorus]
Cause I dont wanna dream
This time to regret tomorrow for today
Cause sometimes life's a bitch
Cause I dont wanna live a life that is full of hurt inside
Wont you hurt me somemore
Now wont you hurt me somemore
Now wont you hurt me

[Final Chorus]
Cause I dont wanna dream
This time to regret tomorrow for today
Cause sometimes life's a bitch
Cause I dont wanna live a life that is full of hurt inside
Wont you hurt me somemore
Now wont you hurt me somemore
Now wont you hurt me no more"""
    },
    {
        "id": "58f8c4fb-f722-4563-893a-f88fa6d89c1c",
        "title": "Confused",
        "lyrics": """[Verse 1]
I'm....
So confused..
I'm....
Just like you..
Turn around and tell me what are we supposed to do
I'll leave a page and hook it on, that's simply just for you

[Chorus]
Love's just rising in the far away sense
Love's just keeping me so lost....
Winter's changing seasons for you ooooooh
Just don't keep me so confused

[Verse 2]
I'm...
So confused..
I.. think
I love you..
I think about you everyday and don't know what to do
Your crazy moves they drive me round; I'm simply so confused

[Chorus]
Love's just rising in the far away sense
Love's just keeping me so lost....
Winter's changing seasons for you ooooooh
Just don't keep me so confused

[Final Chorus]
Love's just rising in the far away sense
Love's just keeping me so lost....
Winter's changing seasons for you ooooooh
Just don't keep me so confused

Just don't keep me so confused

[Outro]"""
    },
    {
        "id": "d034bcf9-09f5-49cd-9479-0bfadab1675f",
        "title": "Selectivism",
        "lyrics": """[Verse]
Don't wanna find out if there's a million stars up in the sky
Just keep it in your mind
Don't wanna find out even if it's only tonight
Cause all I'm thinking of is

[Chorus]
All i want is just to see you so fine
Hold you so tight and see your sunshine laughter fly
To me being happy is what you can't perceive in
You got a choice now baby
Sometimes things aint just looking so right.
Selectivism~
Think~~

[Verse]
Sometimes politeness couldn't get you free off the line
Just keep it in your mind
Somewhere you could find a band that sings to your desire
For your soul satisfaction

[Chorus]
All i want is just to see you so fine
Hold you so tight and see your sunshine laughter fly
To me being happy is what you can't perceive in
You got a choice now baby
Sometimes things aint just looking so right.
Selectivism~
Think~~

[Final Chorus]
All i want is just to see you so fine
Hold you so tight and see your sunshine laughter fly
To me being happy is what you can't perceive in
You got a choice now baby
Sometimes things aint just looking so right.
Selectivism~
Think~~

You got a choice now baby. Selectivism~ Think."""
    },
    {
        "id": "a454d8ef-a286-43e9-8d4d-fdf2f4ed18d2",
        "title": "Day and Night",
        "lyrics": """[Verse]
Some days I'm feeling all quite right
Some days I'm getting all too bright
Today I'll just wait for the twilight

[Verse]
Some nights I'm getting all the brine
Some nights I'm hearing all the whine
Tonight I'll just wait for the line

[PreChorus]
No matter if it's day or nite in my life
You can give me all the sunshine
And when I look into your eyes
No matter whatever
Just seems to be behind

[Chorus]
All day and all night long
In my school of crazy thoughts
Just thinking of you, whoooo ooh
Sometimes I just wonder why
I just can't get you off my mind
All day and all night long
My world's spinning all along
Just turning for you, whoooo ooh
Sometimes I just can't survive
Without you so I'm missing all day all night long

[Bridge: Melodic Rap]
Some days I'm calm, but my thoughts drift to you,
Sippin' through the silence like I always do.
Some days I glow, but the shine feels untrue,
'Cause every ray of light just reminds me of you.
Some nights I fade, sink deep in my mind,
Playin' back moments we left behind.
Some nights I wait, hopin' I'll find
A trace of your voice in the quiet of time.

[PreChorus]
No matter if it's day or nite in my life
You can give me all the sunshine
And when I look into your eyes
No matter whatever
Just seems to be behind

[Chorus]
All day and all night long
In my school of crazy thoughts
Just thinking of you, whoooo ooh
Sometimes I just wonder why
I just can't get you off my mind
All day and all night long
My world's spinning all along
Just turning for you, whoooo ooh
Sometimes I just can't survive
Without you so I'm missing all day all night long

[Outro Rap]
Some days the sun cuts deep through my eyes,
And I swear I still see your face in the sky.
Some nights the stars don't even try,
Feels like they miss you, same as I.
I'm still here, lost in the dark,
Whisperin' your name to the beat of my heart.
If you ever shine again through the night,
I'll be the one still thinkin' of you, holdin' that light.

[Final Chorus]
All day and all night long
My world's spinning all along
Just turning for you, whoooo ooh
Sometimes I just can't survive
Without you so I'm missing all day all night long"""
    },
]


def normalize(s):
    """Lowercase, strip punctuation for fuzzy matching."""
    return re.sub(r'[^\w\s]', '', s.lower()).strip()


def parse_lyrics(raw):
    """Parse raw lyrics string into lyricsBlocks."""
    blocks = []
    current_label = ""
    current_lines = []

    for line in raw.strip().split('\n'):
        line = line.rstrip()
        m = re.match(r'^\[(.+)\]$', line)
        if m:
            if current_lines or current_label:
                blocks.append({"label": current_label, "lines": current_lines})
            current_label = m.group(1)
            current_lines = []
        elif line == "":
            # blank line inside a section = separator, skip
            pass
        else:
            current_lines.append(line)

    if current_lines or current_label:
        blocks.append({"label": current_label, "lines": current_lines})

    # Remove blocks with no lines (e.g. [Guitar Solo], [Outro] alone)
    return [b for b in blocks if b["lines"]]


def assign_times(lyric_lines, segments):
    """
    For each lyric line, find the Whisper segment whose text best matches,
    then return its start time. Walk segments sequentially to avoid backtracking.
    """
    seg_texts = [normalize(s["text"]) for s in segments]
    seg_starts = [s["start"] for s in segments]
    times = []
    seg_ptr = 0

    for line in lyric_lines:
        norm_line = normalize(line)
        if not norm_line:
            times.append(None)
            continue

        best_score = -1
        best_idx = seg_ptr

        # Search forward up to 15 segments from current pointer
        window_end = min(len(segments), seg_ptr + 15)
        for i in range(seg_ptr, window_end):
            score = difflib.SequenceMatcher(None, norm_line, seg_texts[i]).ratio()
            if score > best_score:
                best_score = score
                best_idx = i

        times.append(round(seg_starts[best_idx], 2))
        # Advance pointer only if we found a decent match
        if best_score > 0.3:
            seg_ptr = best_idx

    return times


results = []
for track in TRACKS:
    path = os.path.join(WHISPER_DIR, f"{track['id']}.json")
    with open(path) as f:
        whisper = json.load(f)

    segments = whisper["segments"]
    blocks = parse_lyrics(track["lyrics"])

    # Flatten lyric lines (non-label)
    all_lines = []
    for b in blocks:
        all_lines.extend(b["lines"])

    times = assign_times(all_lines, segments)

    # Rebuild lineTimes aligned to all_lines (skip Nones → use previous or 0)
    line_times = []
    last = 0.0
    for t in times:
        if t is not None:
            last = t
        line_times.append(last)

    results.append({
        "id": track["id"],
        "title": track["title"],
        "lyricsBlocks": blocks,
        "lineTimes": line_times,
    })
    print(f"✓ {track['title']}: {len(blocks)} blocks, {len(all_lines)} lines, {len(line_times)} times")

with open("lyrics_data.json", "w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nWrote lyrics_data.json")
