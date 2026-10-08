# Streaming link page

## 1. Direction
A small, quiet pre-release link page. A full-viewport pastel video sits beneath
a dark veil, white collaboration marks and clear Korean copy; the release view
uses one vertical streaming list. FUR:RAID 2026 main theme with SNOWRICE
STUDIO, confirmed by the user; unreleased. No song title, artwork or release date
is assumed. All platform URLs remain empty until publication.
Based on the minimalist and Notion references; scoped to a skeleton per request.

## 2. Color
Canvas #f7f6f3; surface #ffffff; text #31302e; secondary #615d59;
border #dedbd5; hover #f0eeea; focus #005bab; dark button #31302e.
Video fallback #211d2d, veil rgba(20,16,31,0.55), text #ffffff and secondary
rgba(255,255,255,0.9) keep foreground copy readable over bright frames.

## 3. Typography
Korean uses Wanted Sans Variable (400-1000); English uses Zalando Sans Variable
(200-900); Japanese uses the open-license Zen Kaku Gothic New Regular/Bold as
the closest geometric sans alternative to licensed Shorai Sans. Fonts are
self-hosted in `assets/fonts/` with OFL license files and system fallbacks.
Language-menu options use their own script's typeface.
Title 32px, body and links 16px, secondary 14px, eyebrow 12px.
Body line height 1.6; heading 1.35. Heading tracking -0.04em.

## 4. Layout
Single column, maximum 480px; 24px page gutters; 48px vertical padding.
Spacing scale: 4, 8, 12, 16, 24, 32, 48px. Button radius 12px.
Rows have a minimum 80px target and wrap long names. Natural document scrolling.
The fixed background media fills the viewport at every breakpoint. Its 16:9 video
uses centered `object-fit: cover`: portrait screens fit the height and crop the
sides; wider screens crop only the excess edge without stretching the image.
The centered coming-soon lockup places both white logos around a multiplication
mark with 24px gaps on desktop. Below 520px it stacks event logo, mark and studio
logo vertically with 12px gaps so both names stay legible.
The release header keeps the same collaboration marks in a compact horizontal
lockup at every viewport width, leaving room for the streaming list on mobile.

## 5. Components
Background media: `assets/video/background.webm` is decorative, muted and looping.
An H.264 MP4 source is offered as a fallback for browsers without WebM playback.
The 1280x720 poster appears before playback and remains as the fallback image.
The video and subtle veil sit behind both the coming-soon and release views.
Coming-soon mode: enabled by `comingSoon: true` in site-config.js. Shows only a
centered FUR:RAID 2026 × SNOWRICE STUDIO logo lockup, localized heading
(곧 공개됩니다. / Coming soon. / 近日公開。), and the existing language control at
the bottom. Logo group has a localized accessible name; source logos retain
their proportions and white artwork over the dark video.
Release content starts hidden in HTML to prevent a first-paint flash; no stream
rows, icon requests or Spotify iframe are created in this mode. Page title and
description also show a localized event-name/coming-soon title and generic notice.
Setting the flag to false restores
the release view. This is a presentation switch, not access control for source files.
Stream row: list item containing official platform icon, name, status, and direction indicator.
Icon slot: 40px square, 16px gap to text; source images retain original colors and
aspect ratio with object-fit contain. LINE MUSIC uses a 72px image in the slot to
account for the official file's built-in transparent clear space. No recoloring.
Icons are decorative with empty alt text because the service name is adjacent.
Source URLs and upstream ownership are recorded in assets/icons/SOURCES.md.
Language control: quiet right-aligned globe/current-language/chevron button below
the service list. 44px minimum target, 8px gap, 12px horizontal padding, 12px radius,
14px type. Opens a 184px white menu upward with 8px gap and 8px inner padding.
Menu options have a 4px vertical gap, 8px corners and inset keyboard focus outline
so highlighted rows remain visually separate.
Options: 한국어, English, 日本語 only; checked option gets a tinted row and checkmark.
First visit follows the first supported browser language (ko/en/ja), otherwise
English. Explicit choice persists locally; blocked storage does not prevent switching.
Menu button/radio menu item semantics, visible focus, arrows/Home/End navigation,
Enter/Space selection, Escape and outside-click dismissal; focus returns on selection.
All descriptive/status/accessibility text, document language, title and metadata
follow the selected language; event, studio and platform names stay unchanged.
Japanese descriptions use normal Japanese line breaking; Korean keeps words.
Unpublished: noninteractive row, explicit “공개 예정”, no fake link or tab stop.
Published: native anchor covering the row, destination hostname, same-tab navigation.
Hover: tinted surface; focus: 2px outline with 4px offset; active: darker surface.
Header: compact collaboration lockup, eyebrow, heading, collaboration description.
No release-waiting notice or footer.
Empty list: “스트리밍 링크를 준비하고 있어요.”
Optional Spotify player: above the list, 152px tall, full width, 12px radius.
Only mount an iframe for a configured Spotify track or album URL; otherwise
the section is hidden and no Spotify resource is requested. No autoplay.

## 6. Motion
The background video plays unless the user prefers reduced motion; in that case
it stays paused on the poster or first frame. It has no controls or sound.
Language menu: 140ms ease-out opacity/translateY(4px) entry; chevron rotates 180deg
over 140ms. Reduced-motion disables both. Inspired by beui.dev select's anchored
panel, selected indicator and outside dismissal; implemented in CSS/JS without
dependencies. Other content has no animation.

## 7. Depth
White row surfaces and borders over the darkened video. The floating language menu alone
uses 0 8px 24px rgba(49,48,46,0.08) shadow to separate it from the list beneath.

## 8. Accessibility
Korean document language, semantic heading/list/link structure, visible keyboard
focus, minimum 4.5:1 body contrast. Text wraps; no fixed content heights.
Content and platform names are editable defaults, not confirmed release details.

## 9. Scheduled redirect
The Python-served homepage reuses the full-screen video, veil, collaboration
lockup and bottom language menu. A four-column countdown sits below the heading,
with white tabular numbers (40px desktop, 32px mobile), 12px unit labels and 16px
column gaps. A 14px release-time line always states Korea time. There are no
countdown cards or decorative number transitions. At 320px the numbers remain
four columns and the logo stack scales to fit above them.
Viewports below 650px tall use 24px vertical page padding to keep the bottom
language control visible without a long empty scroll tail.
The confirmed release is 2026-10-11 17:00 Asia/Seoul (08:00 UTC).
Python computes remaining seconds on every status request; the browser only
formats the returned value. Requests are serialized once per second with a
five-second network timeout. A failed request hides stale numbers and displays a
localized retry status. Returning to a visible tab refreshes immediately.
Countdown updates are not a live region, to avoid announcements every second;
connection/error state is a polite live region. A keyboard-accessible refresh
link also serves visitors without JavaScript.
The root and redirect endpoint recheck server time for every request and use
no-store responses. The destination is configured only on the Python server;
neither HTML nor the status API returns it before release. Direct access to the
externally operated destination remains outside our control, accepted by the
user. GitHub Pages continues showing the existing cover until the domain is
connected to the Python deployment.
