Enhanced Chat Presentations — Color Schemes
v1.0 | November 25, 2026 | Author: Claude (app) | Audience: any AI


This file holds colors only. It names no presentation and no subject. Presentations refer to the roles below by name; this file maps each theme's roles to colors.
1. Theme codes
A theme has a code: a number followed by a kind letter.


* d = dark theme, l = light theme. Examples: 1d, 2l, 3l.
* Numbers are unique across both kinds, so a code is never reused.
* Dark and light themes are listed in separate maps (sections 3 and 4) because they are built differently: on a dark theme, text outside cards and inside cards can share colors; on a light theme with a colored page, they usually cannot.
* Each theme also has a display name, used on the theme toggle when two themes of the same kind are offered.
2. Roles
Every theme defines every role. Values are hex colors.


Page (the area outside cards):


* page-bg: page background.
* outline: the thin border around the whole presentation.
* page-text: primary text on the page (subject line, theme label).
* page-text-2: secondary text on the page (counters, small labels).
* page-title: titles shown on the page, outside any card.
* page-accent: accent text on the page (group labels, captions between cards).
* page-connector: lines and arrows drawn on the page between cards.


Cards (rows, boxes, slides):


* card-bg: card background. Also the background of ordinary buttons.
* card-text: primary text in cards. Also the text of ordinary buttons.
* card-text-2: secondary text in cards (field labels such as "Detail").
* card-title: titles inside cards.
* card-accent: accent inside cards (takeaways, numbers).
* card-border: card border.
* control-border: border of ordinary buttons and dots.


Insets (equation boxes) and panels (groups of cards):


* inset-bg: background of equation insets and of panels.
* inset-text: text in equation insets.
* inset-border: border of equation insets.
* panel-border: border of panels.


Selected and primary controls (the current dot, the chosen theme, a primary button):


* selected-bg, selected-text, selected-border.
3. Dark themes
1d — Navy & Gold
page-bg #142745; outline #142745; page-text #F7F4ED; page-text-2 #C9D5E5; page-title #FFFFFF; page-accent #F0CD79; page-connector #8CDDD3; card-bg #263E5C; card-text #F7F4ED; card-text-2 #C9D5E5; card-title #FFFFFF; card-accent #F0CD79; card-border #536A84; control-border #8296AE; inset-bg #0C192D; inset-text #F7F4ED; inset-border #0C192D; panel-border #0C192D; selected-bg #F0CD79; selected-text #0C192D; selected-border #F0CD79.
4. Light themes
2l — Green
A dark-green page with white cards; equation insets match the page.


page-bg #0B625B; outline #063D39; page-text #F4EFE3; page-text-2 #F4EFE3; page-title #FFFFFF; page-accent #FFE9A8; page-connector #CDEBE6; card-bg #FFFFFF; card-text #121E2E; card-text-2 #34455A; card-title #0F1B2D; card-accent #0B625B; card-border #6B6553; control-border #6B6553; inset-bg #0B625B; inset-text #FFFFFF; inset-border #063D39; panel-border #7FBFB7; selected-bg #0F1B2D; selected-text #FFFFFF; selected-border #FFFFFF.
5. Contrast requirements
* Every text role against the background it sits on: at least 4.5:1. (page-* text on page-bg and on inset-bg; card-* text on card-bg; inset-text on inset-bg; selected-text on selected-bg.)
* In light themes, card-border, control-border and panel-border: at least 3:1 against what they sit on, so cards and buttons have visible edges.
* In dark themes, card edges may rely on the card-bg / page-bg difference; card-border can be subtle.


Checked November 25, 2026 (WCAG ratios): 1d lowest text pair 7.1:1 (card-accent on card-bg). 2l lowest text pair 5.7:1 (page-connector on page-bg); borders 3.4:1 or higher.
6. Adding a theme
Add an entry with the next unused number and the right kind letter, define every role, check section 5, and add the code to the list a presentation offers (see the Integration file). Nothing in the presentation file changes.
History
* Light theme 2l went through cream (#ECE6D6), brown (#CDB28A) and peach (#F3D3AA) pages before green was selected on November 25, 2026.