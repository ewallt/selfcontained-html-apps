Enhanced Chat Presentations — Presentation Patterns
All nine patterns | v3.0 | November 26, 2026 | Author: Claude (app), combining its own four patterns with ChatGPT's five | Audience: any AI


This file says how content is presented: layout, interaction and checks. It contains no subject matter and no colors. Colors come from the Color Schemes file, by role name. Which content goes with which pattern, and any facts specific to one pairing, come from the Integration file.


Patterns:


* Built and tested by Claude: Slide Deck (3), Two-Phase Split (4), Equation Chain (5), Layered Reveal (6).
* From ChatGPT's Enhanced Chat Presentations v1.1, adapted to this set's colors and rules, not yet built here: Interactive Accordion (7), Interactive Concept Map (8), Step-by-Step Explorer (9), Styled Response (10), Vertical Scroller (11).


All nine are interchangeable ("isomorphic"): the same content can be shown through any of them with nothing added and nothing changed. Flashcards are outside this file because they need content of their own (questions).
1. Content contract (all patterns)
* Input is structured content (XML or similar) made of units, in order. Discover fields from the source rather than requiring fixed names. Fields used: unit number or identifier, title, takeaway, explanation, formal expression (equation, usually LaTeX), detail, note, foundation or reference, and any relationships the source states.
* An objective unit states the overall goal (for example a unit numbered 0 or titled "objective"). Some patterns treat it specially. If there is none, leave that element out; do not write one.
* Notes stored apart from their units (for example an editorial-notes section keyed by unit number) are shown with their unit.
* Every substantive field must be reachable. Short labels are navigation, never replacements for full text.
* Never add facts, questions, reasons, groupings, relationships or connecting prose. Text the view supplies (button labels, counters, field labels) is navigation and must be neutral or taken from the source. Where a pattern needs structure the content does not state (a division, concept nodes and links, lenses), it must come from the Integration file; if it is not there, do not offer that pattern.
* Render LaTeX with KaTeX or equivalent; if rendering fails, show the raw expression.
* Never write presentation state back into the content.
2. Shared interface (all patterns)
2.1 Delivery and size
* An interactive widget inside the chat reply. No separate site or download unless asked. Keep prose before and after the widget brief.
* Phone first: the chat column may be about 360 px wide; desktop must also work. No horizontal scrolling of the page; one wide equation may scroll inside its own inset.
* If the delivery surface cannot do an interaction a pattern needs, say so and use an honest fallback. Never show inert controls as if they work.
* No animation required. Saving position in local storage is optional and must fail silently.
2.2 Themes
* The Integration file says which theme codes to offer (for example 1d and 2l). The first is shown initially.
* Header row: the content's title (as the subject line) and a "Theme:" toggle with one button per offered theme. If only one theme of each kind is offered, the buttons read "Dark" and "Light"; otherwise they show the theme names.
* Every color is taken from a role in the Color Schemes file. Do not use any color that is not a role value.
2.3 Which element uses which role
* Whole widget: page-bg, with a 1 px outline border.
* Text directly on the page (subject line, theme label, counters, headings shown outside a card): page-text, page-text-2, page-title.
* Labels and captions on the page (group labels, captions between cards): page-accent. Lines and arrows between cards or nodes: page-connector.
* Cards, rows, boxes, slides, panels' items, map nodes: card-bg with a card-border border; text card-text; field labels card-text-2; titles card-title; takeaways and unit numbers card-accent.
* Takeaways are underlined, in the accent of wherever they sit (card-accent in a card, page-accent on the page).
* Equation insets: inset-bg, inset-text, inset-border. Panels that group cards: inset-bg with panel-border.
* Ordinary buttons and dots: card-bg background, card-text text, control-border border.
* Selected and primary controls (current dot or step, chosen theme, selected node, primary button): selected-bg, selected-text, selected-border.
2.4 Host button styling
The chat host may restyle buttons. Set every button's background, text and border colors in a way the host cannot override (for example !important). Round dots must also fix width, height, minimum width, padding and border radius the same way, or they render as rectangles and lose the current-position highlight.
2.5 Unit dots
Where a pattern has dots or a numbered progress indicator: one round dot per unit, labeled with the source's own numbering, all on one line (no wrapping), shrinking evenly to fit, 30 px at most. The current dot uses the selected roles.
2.6 Subject line
Leave room at the right end of the header row; the chat host may place an expand icon over it.
2.7 Field labels
Inside a unit, fields appear in this order where present: takeaway, explanation, equation (in an inset), detail ("Detail"), note ("Note:"), foundation or reference ("Foundation:"). Fields the unit lacks are left out.
3. Slide Deck
Intent: one unit at a time, full size, for reading or narration.


Structure:


* Header row (2.2).
* Slide card showing one unit: a small "Step n" label, title, then its fields (2.7).
* Below the slide: dots (2.5); then Back, an "n of N" counter, Next.


Behavior:


* Starts at the first unit.
* Back and Next move one unit and stop at the ends. A dot jumps to its unit.
* The slide keeps a fixed minimum height (the tallest unit's), so controls do not move between slides. Re-measure after fonts and the math renderer load.


Acceptance: every unit reachable by Next and by its dot; dot, counter and slide agree; all fields of each unit on its slide.


Compare: the Step-by-Step Explorer (9) is the fuller version, with a Restart button and an optional overview diagram.
4. Two-Phase Split
Intent: show an argument that divides into two phases (for example building an object, then proving its properties), so the reader sees the halves before the details.


When to use: only when the Integration file gives a division for this content (the first unit of phase 2, and a label for each phase). If it gives none, do not offer this pattern. Do not infer a division inside the presentation.


Structure:


* Header row (2.2).
* Goal card at the top, centered: the objective unit's title as a small label, its takeaway, its equation, and a "Goal details" toggle that shows its remaining fields. Omit if there is no objective unit.
* Phase 1 panel and Phase 2 panel, stacked. Each has a label "Phase n · " followed by the label from the Integration file, and one row per unit, in source order.
* Collapsed row: unit number, title, and the equation at inline size below the title, right-aligned; an open/closed indicator.
* Expanded row: takeaway, explanation, detail, note, foundation.
* Bridge between the panels: a downward arrow labeled with the title of the first phase-2 unit.
* Footer: "Expand all" / "Collapse all" and an "n of N open" counter.


Behavior: all rows start collapsed. Tapping a row toggles only that row. Expand all opens every row; when all are open the button reads Collapse all.


Acceptance: every non-objective unit appears exactly once, in the phase the Integration file assigns; the objective appears only in the goal card, with all its fields reachable; counter and button label agree.
5. Equation Chain
Intent: the argument as a vertical sequence of equations, read like a derivation, with each takeaway as the link to the next.


When to use: when most units have an equation. A unit without one shows its title in the equation box.


Structure:


* Header row (2.2).
* One box per unit, in source order: a small label "n · title", an open/closed indicator, and the equation at display size.
* Between consecutive boxes: a short vertical page-connector line with the takeaway of the unit below it as its caption. The first box has no incoming link; its takeaway appears when it is opened.
* Opened box: explanation, detail, note, foundation (and, for the first box, its takeaway).
* Footer: "Expand all" / "Collapse all" and an "n of N open" counter.


Behavior: all boxes start collapsed, so the chain reads as equations and takeaways only. Tapping a box toggles it.


Acceptance: every unit once, in order; each link caption is the takeaway of the following unit; opened boxes show every remaining field.
6. Layered Reveal
Intent: one unit at a time, with the reader revealing its fields one by one; for self-paced study and recall.


Layers: the fields a unit has, in the order of 2.7. A field the unit lacks is not a layer. m is the number of layers that unit has. The unit's number and title are always shown; they are navigation.


Structure, top to bottom:


* Header row (2.2).
* Dots (2.5).
* Back, an "n of N" counter, Next.
* Unit heading on the page: "Step n" (page-text-2) and the title (page-title).
* Reveal controls: "Reveal next" (primary, selected roles), "Reveal all" / "Hide all" (one toggling button), and a "k of m shown" counter.
* Layer card: the revealed layers in order, with the equation in an inset. Hidden while no layer is shown.


The controls sit above the layer card so nothing the reader presses moves as layers are added.


Behavior:


* Starts at the first unit with nothing revealed.
* Reveal next adds the next layer; when all are shown it does nothing.
* Reveal all shows every layer; then the same button reads Hide all and hides them all.
* Each unit remembers how many layers were shown; returning to it restores that.
* Back, Next and dots as in the Slide Deck.


Acceptance: revealing all layers of each unit shows every field exactly once in the fixed order; counter, button label and card agree; state is kept per unit.
7. Interactive Accordion
From ChatGPT v1.1, section 3.


Intent: a compact overview with independent access to the full detail of any unit.


Structure:


* Header row (2.2).
* One expandable card per unit, in source order. Nested sections only if the source has real substructure.
* Collapsed header: title, takeaway (underlined), and an open/closed indicator.
* Expanded card: explanation, equation, detail, note, foundation.
* Footer: "Reveal next" (opens the next unopened card in source order), "Reset" (collapses all), and an "n of N open" counter.


Behavior: all cards start collapsed. Tapping a header toggles only that card (single-open only if the user asks for it). Reveal next and Reset as above.


Acceptance: every unit visible when collapsed; any unit can be opened directly; toggling, Reveal next and Reset work; all content reachable without horizontal overflow.


Compare: the Two-Phase Split (4) uses the same rows but groups them into phases; the Accordion shows one flat list with the takeaway in the collapsed header.
8. Interactive Concept Map
From ChatGPT v1.1, section 4.


Intent: explore the subject through its concepts and their relationships, with the source's explanation of each one a tap away.


When to use: only when the source states relationships between units or concepts, or the Integration file supplies the nodes and links for this content. If neither, do not offer this pattern. Do not infer relationships inside the presentation. Sequence alone (unit 3 follows unit 2) is not a relationship for this purpose; that is what the ordered patterns show.


Structure:


* Header row (2.2).
* A central node for the subject (the objective unit, if any) and a small number of selectable nodes around it, with page-connector lines for the given links. Labels wrap; the whole map fits the width. If there are too many nodes, split into submaps.
* A details card below the map for the selected node: its title and fields (2.7).


Behavior:


* The first node is selected at start, and its details card is filled before any interaction (no blank panel).
* Tapping a node selects it (selected roles) and updates the details card without leaving the map.
* Lenses (alternative arrangements of the same nodes) only if the Integration file supplies them. The first lens is the default; changing content resets to it and clears the selection.


Acceptance: every node selectable; every link comes from the source or the Integration file; all substantive material reachable through nodes and the details card; no blank first state, clipping or horizontal scroll.
9. Step-by-Step Explorer
From ChatGPT v1.1, section 5.


Intent: an ordered exposition revealed one unit at a time, with progress always visible.


Structure:


* Header row (2.2), with a numbered progress indicator (2.5) fixed below it.
* Step card: "Step n" label, title, then its fields (2.7).
* Optional overview diagram: a compact row or column of the unit titles, with the current one highlighted (selected roles). Use only when the units form a real progression; it shows titles only, no added wording.
* Controls: Back, "Reveal next", Restart, and an "n of N" counter.


Behavior:


* Starts at the first unit (the objective unit, if any). If there is no objective unit, start at unit 1; do not write an introduction. (ChatGPT v1.1 allows deriving an orientation from existing material; in this set, the step shows only the source's own fields.)
* Reveal next advances one step; Back returns one; Restart returns to the first step. A progress dot jumps to its step.
* Back is disabled at the first step and Reveal next at the last. Progress, diagram and card always agree.
* The card keeps a stable width and grows in height as needed.


Acceptance: every unit reachable; controls, progress and diagram agree; Restart restores the start; the last step is the source's last unit; no horizontal scroll.
10. Styled Response
From ChatGPT v1.1, section 6.


Intent: the whole exposition laid out at once, with no interaction needed.


Structure:


* Header row (2.2). The theme toggle is the only control.
* An introduction card only if the source has an objective unit (it is that unit).
* One card per unit, stacked in source order: title, then its fields (2.7).
* A summary or diagram only if the source provides one.


Behavior: everything is visible; the widget grows with its content and the reader scrolls the chat as usual. No reveal, collapse or inner scroll area.


Acceptance: the whole exposition readable top to bottom; all substantive material visible; notation legible; no horizontal overflow.
11. Vertical Scroller
From ChatGPT v1.1, section 7.


Intent: the Styled Response's cards inside a fixed rectangle, so a long exposition takes a constant amount of chat space.


Structure:


* Header row (2.2), fixed at the top of the rectangle.
* A scroll area of fixed height (about 460 px by default, less on short screens) holding the same cards as the Styled Response.
* A fixed footer with a short hint: "Scroll inside the panel".


Behavior:


* The rectangle's size never changes while reading. Scrolling (touch, wheel, keyboard) moves only the cards; header and footer stay in place.
* No pagination, horizontal swiping, collapsing or step controls in place of scrolling.
* Do not trap the reader: when the scroll area reaches its top or bottom, the chat scrolls normally.


Acceptance: the rectangle does not grow; first and last cards reachable; header always visible; content fits the width; inner scrolling works on phone and desktop. If the surface cannot scroll inside a fixed area, say so and offer the Styled Response instead.
12. Verification (all patterns)
Before delivering:


1. Against the content: unit count and order; every field reachable; notes on the right units; each displayed equation equals its source expression; no text that is neither source text nor a neutral label; any division, node, link or lens comes from the source or the Integration file.
2. Controls: every button, dot, row, node and the theme toggle; correct starting state; Reset or Restart where present.
3. Each offered theme, at about 360 px width and at desktop width, with a simulated host button override; no horizontal page scroll; dots round and on one line. For the Vertical Scroller, check that the rectangle stays fixed (inner scroll, not page scroll).
4. Say what could not be tested on the real delivery surface.


Success criterion: another AI, given this file, the Color Schemes file, the Integration file and an unrelated content file, can build any of the nine patterns without adding or changing content.
Sources
Sections 7–11 adapt ChatGPT's "Enhanced Chat Presentations — Content-Independent Design Pattern Specification" v1.1. Changes made here: colors by role from the Color Schemes file instead of inline values; the theme toggle is required, not optional; concept-map links and lenses, and any orientation text, must come from the source or the Integration file rather than being inferred; field order and labels shared with the other patterns. ChatGPT's file is unchanged.