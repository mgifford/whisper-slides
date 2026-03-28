# Using Whisper Slides at Events, Camps, and Meet-Ups

This guide covers everything you need to know to set up live captioning at an
in-person event — a conference, unconference, Drupal camp, hackathon, or local
meet-up. It draws on hard-won lessons from the
[MidCamp live-captioning project](https://github.com/MidCamp/live-captioning),
which has successfully deployed browser-based captions at community events.

---

## Why Bother?

Live captions make your event accessible to:

- Attendees who are Deaf or hard of hearing.
- Non-native speakers who follow text more easily than audio.
- Anyone in a noisy room or seated far from the speaker.
- Remote viewers watching a livestream.

> **Important**: This tool is a low-cost complement to professional captioning
> services, not a replacement. For events where attendees rely on captions as
> their primary means of following content, consider hiring a CART
> (Communication Access Realtime Translation) provider. When budget is limited,
> live captioning software like this is far better than nothing and has been a
> genuine game-changer for attendees who would otherwise skip events entirely.

---

## Choosing a Captioning Method

| Method | Setup | Works offline? | Internet required? | Best for |
|--------|-------|----------------|--------------------|----------|
| **Web Speech API** | None — open Chrome/Edge | No | Yes (sends audio to Google) | Quick setup, any HTTPS site |
| **Whisper.cpp (local)** | Build binary + model | Yes | No | High accuracy, privacy-first |

For most events, the **Web Speech API** is the simplest starting point. It
requires only a Chrome or Edge browser and an internet connection. See
[README.md](README.md) for Whisper.cpp local setup instructions.

---

## Room Setup

The diagram below shows a typical accessible room layout. Use the labels to
understand the recommended placement of each component.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  [G] Presentation screen                             │
│                                                      │
│  [F] Presenter's laptop ───────────────────────────► │
│                                                      │
│  [A] Microphone (near speaker) ──────────────────┐  │
│                                           cable   │  │
│  [B] Captioning laptop ◄──────────────────────────┘  │
│         │ HDMI                                        │
│         ▼                                            │
│  [C] Caption monitor / TV                            │
│                                                      │
│  [D] Reserved seating ◄── audience members who       │
│      (tape off, or add signs)   benefit most         │
│                                                      │
│  [E] Volunteer (manages B + C)                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### A. Microphone for the Presenter

- Use an **external microphone** placed close to the speaker — the better the
  audio input, the better the caption output.
- Connect the microphone to the **captioning laptop** (B), not the
  presenter's laptop.
- A cable of 15 ft (5 m) or longer lets you reach the captioning station
  without restricting the presenter's movement.
- Make sure the captioning laptop is set to use the external microphone in
  your operating system audio settings.
- **Multiple speakers**: Captioning works best with a strong, focused signal.
  Background noise degrades accuracy. The tool does not identify which speaker
  said what — all speech is combined into one stream.
- *Optional*: Split the room's audio signal and route a feed directly to
  the captioning laptop.

### B. Captioning Laptop

- Dedicated machine running the captioning software (this project).
- **Wired internet** is strongly preferred. Wi-Fi works but can introduce lag
  or drop the connection at the worst moment.
- Requires: audio input jack or USB audio adapter, HDMI output, Chrome or
  Edge browser (for Web Speech API), or a local Whisper.cpp build.
- Keep the screen saver and sleep mode disabled so the browser stays active.

### C. Caption Display Monitor or TV

- Connect via HDMI to the captioning laptop.
- **Placement**: near the main presentation screen so the audience can glance
  between slides and captions without turning their head far.
- Should be in the **direct line of sight** of the reserved seating section.
- Size matters: the larger the room, the larger the monitor needs to be.
  Increase the browser font size (`Ctrl +` / `Cmd +`) until the text is
  readable from the reserved section.
- Position it so it does **not** distract the presenter.

### D. Reserved Seating Section

- Mark off an area with tape on the floor, reserved chair signs, or a
  "Captions here" indicator near the caption monitor.
- Audience members who rely on captions should have the best sight line to
  the caption display.
- Announce the reserved section at the start of the event and during
  housekeeping notes.

### E. Caption Volunteer

A dedicated volunteer manages the captioning station during the event. Their
responsibilities include:

- Starting and stopping caption sessions as talks begin and end.
- Monitoring the caption display for signs of timeout or errors.
- Reconnecting or refreshing the browser if captions stop.
- Adjusting microphone placement or volume as needed.
- Helping audience members find the reserved section.
- Deciding whether to start a new session or continue an existing one
  when a new speaker begins.

### F. Presenter's Laptop

- Separate from the captioning station — do **not** run captions and slides
  from the same machine unless you have tested this and confirmed there is
  no audio conflict.
- Any videos shown by the presenter should have their own embedded captions.

### G. Presentation Screen

- Displays the presenter's slides.
- Not connected to the captioning system.

### H. Room Audio

- Ensure all speakers have a microphone (lapel, handheld, or podium).
- Test the room audio before the event starts — every time.
- Confirm the physical space is accessible (step-free entry, accessible
  seating, hearing loop if available).

---

## Step-by-Step: Starting Captions at an Event

### Before the Event

1. **Test the full setup** the day before or at least one hour before doors
   open. Test the microphone, cable run, HDMI connection, browser
   permissions, and caption display in the actual room.
2. **Pre-authorize microphone access** in Chrome/Edge settings so the browser
   does not prompt mid-session:
   - Open `chrome://settings/content/microphone` (or
     `edge://settings/content/microphone`).
   - Add the presentation URL to the **Allow** list.
   - On macOS, also grant microphone permission to Chrome/Edge in
     **System Settings › Privacy & Security › Microphone**.
3. **Set text size** on the caption display so it is readable from the back
   of the reserved section.
4. **Brief the volunteer** on reconnection steps and session management.

### During Each Session

1. Open the presentation in Chrome or Edge on the captioning laptop.
2. Click the **captions** button in the toolbar.
3. Choose **Start Web Speech Captions** (or start the Whisper.cpp process
   with `npm run dev:whisper`).
4. Allow microphone access when the browser prompts.
5. The volunteer monitors captions — if they stop or time out:
   - Click the captions button and choose **Stop / Restart**, or
   - Refresh the browser (captions resume automatically).

### Between Sessions

- Start a fresh caption session for each new talk so transcripts stay
  organized by session.
- Save or export the transcript before refreshing the browser if you want
  to keep a record.

---

## Known Issues

### Caption Timeout

The Web Speech API may pause or time out after a period of silence or if the
audio signal is weak. The volunteer should watch for this and click
**Restart Captions** or refresh the browser.

### Text Running Off Screen

If a speaker talks for a long time without a natural pause, the caption text
may overflow the visible area. The caption area auto-scrolls in this project,
but if it does not:
- Refresh the browser.
- Increase the browser window size or move to full-screen mode.

### Browser Microphone Permissions

Chrome and Edge remember microphone permissions per origin. If the browser
keeps asking for permission:
- Hosting the presentation on HTTPS (e.g., GitHub Pages) removes repeated
  permission prompts.
- Add the site to the browser's **Allow** list as described above.

### Incognito / Private Mode

In incognito mode the browser does not save microphone permissions. The
volunteer will be prompted every session. Avoid incognito mode for event use.

---

## After the Event: Transcripts

A transcript of every captioning session is valuable beyond the event itself:

- **Accessibility**: Attendees who missed a talk can read the transcript.
- **Video captions**: Import the transcript as an SRT or WebVTT file into
  your video editor or YouTube to add captions to recorded talks.
- **Search and SEO**: Published transcripts make event content discoverable.
- **Speaker notes**: Speakers can review what was said and correct the record.

For Whisper.cpp sessions, the transcript is saved to
`whisper-demo/transcript.json`. For Web Speech API sessions, text is
displayed in the browser but not yet auto-saved — copy the caption text
manually or add browser automation to capture it.

---

## Privacy

### Web Speech API (Chrome/Edge)

When you use the Web Speech API, audio is sent to Google's servers
(Chrome) or Microsoft's servers (Edge) for transcription. Google states
that they do not collect personal data through the Web Speech API unless
you explicitly opt in to data logging.

Key points:
- No audio files are stored by this project.
- Google/Microsoft capture the domain of the website, the browser's
  default language, and the language settings of the page.
- Cookies are not sent with the speech API requests.
- If privacy is a concern, use the **Whisper.cpp local** option — all
  audio is processed on-device and never leaves the room.

### Whisper.cpp (Local)

All audio is processed locally. Nothing is sent to an external server.
This is the preferred option for events where speakers discuss sensitive
topics or where attendees have privacy expectations.

---

## Comparison with Professional CART Services

| | Live captions (this project) | CART / stenography |
|---|---|---|
| **Cost** | Free (hardware + volunteer time only) | $100–$200/hour per session |
| **Accuracy** | Good–excellent (depends on audio quality) | Near-perfect (trained human) |
| **Speaker differentiation** | No | Yes |
| **Real-time editing** | No | Yes |
| **Works offline** | Whisper.cpp only | Yes (stenographer on-site) |
| **Certified for legal/medical** | No | Yes |

Use this project when budget does not allow CART, or as a supplement to
CART when multiple rooms run simultaneously. Both options can coexist:
use a stenographer in the main hall and browser captions in breakout rooms.

---

## Resources

- [MidCamp Live Captioning project](https://github.com/MidCamp/live-captioning) —
  the original browser-based captioning tool used at Drupal camps.
- [Web Speech API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [WCAG 2.2 — Captions (Prerecorded) 1.2.2](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded)
- [WCAG 2.2 — Captions (Live) 1.2.4](https://www.w3.org/WAI/WCAG22/Understanding/captions-live)
- [W3C — Making Events Accessible](https://www.w3.org/WAI/teach-advocate/accessible-presentations/)
- [Global Accessibility Awareness Day (GAAD)](https://accessibility.day/)
