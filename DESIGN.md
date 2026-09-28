# Streaming link page

## 1. Direction
A small, quiet pre-release link page. Warm paper background, clear Korean copy,
and one vertical list. FUR:RAID 2026 main theme in collaboration with SNOWRICE
STUDIO, confirmed by the user; unreleased. No song title, artwork or release date
is assumed. All platform URLs remain empty until publication.
Based on the minimalist and Notion references; scoped to a skeleton per request.

## 2. Color
Canvas #f7f6f3; surface #ffffff; text #31302e; secondary #615d59;
border #dedbd5; hover #f0eeea; focus #005bab; dark button #31302e.

## 3. Typography
Native system sans with Apple SD Gothic Neo and Malgun Gothic for Korean.
Title 32px, body and links 16px, secondary 14px, eyebrow 12px.
Body line height 1.6; heading 1.35. Heading tracking -0.04em.

## 4. Layout
Single column, maximum 480px; 24px page gutters; 48px vertical padding.
Spacing scale: 4, 8, 12, 16, 24, 32, 48px. Button radius 12px.
Rows have a minimum 80px target and wrap long names. Natural document scrolling.

## 5. Components
Coming-soon mode: enabled by `comingSoon: true` in site-config.js. Shows only a
centered localized heading (곧 공개됩니다. / Coming soon. / 近日公開。) and the
existing language control at the bottom. Uses existing canvas/type/spacing tokens.
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
Header: eyebrow, heading, collaboration description. No release-waiting notice or footer.
Empty list: “스트리밍 링크를 준비하고 있어요.”
Optional Spotify player: above the list, 152px tall, full width, 12px radius.
Only mount an iframe for a configured Spotify track or album URL; otherwise
the section is hidden and no Spotify resource is requested. No autoplay.

## 6. Motion
Language menu: 140ms ease-out opacity/translateY(4px) entry; chevron rotates 180deg
over 140ms. Reduced-motion disables both. Inspired by beui.dev select's anchored
panel, selected indicator and outside dismissal; implemented in CSS/JS without
dependencies. Other content has no animation.

## 7. Depth
White row surfaces and borders on warm paper. The floating language menu alone
uses 0 8px 24px rgba(49,48,46,0.08) shadow to separate it from the list beneath.

## 8. Accessibility
Korean document language, semantic heading/list/link structure, visible keyboard
focus, minimum 4.5:1 body contrast. Text wraps; no fixed content heights.
Content and platform names are editable defaults, not confirmed release details.
