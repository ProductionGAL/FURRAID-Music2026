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
Coming-soon mode: enabled by an empty `redirectUrl` in site-config.js. Shows only a
centered FUR:RAID 2026 × SNOWRICE STUDIO logo lockup, localized heading
(곧 공개됩니다. / Coming soon. / 近日公開。), and the existing language control at
the bottom. Logo group has a localized accessible name; source logos retain
their proportions and white artwork over the dark video.
Release content starts hidden in HTML to prevent a first-paint flash; no stream
rows, icon requests or Spotify iframe are created in this mode. Page title and
description also show a localized event-name/coming-soon title and generic notice.
Setting `redirectUrl` to an HTTPS destination enables same-tab navigation with
`location.replace`. The page remains a static GitHub Pages site.
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

## 9. Manual publication on GitHub Pages
The homepage retains its video, collaboration lockup and language menu without
a countdown or date. An empty `redirectUrl` keeps the localized cover visible.
The operator enters the destination and pushes to main; GitHub Pages deploys the
change. New visits or reloads then replace the current history entry with the
HTTPS destination. Invalid, non-HTTPS and exact self-referential addresses keep
the cover visible. The destination remains blank in source until publication.
There is no Python runtime, timed release, admin endpoint or polling request.
Earlier streaming-row and player specifications describe the original skeleton;
that view is no longer served. Their original icon assets are retained.
The initial HTML displays only a centered localized redirect status on the dark
video-fallback canvas. The cover and media start hidden. Configuration and app
scripts run synchronously in the head before styles, images or video are parsed;
a published HTTPS destination starts navigation on DOM readiness with no timer.
Only an unpublished
configuration reveals the cover after DOM readiness, preventing a cover flash.
