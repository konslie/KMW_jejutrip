# Design System Strategy: Precision Kineticism

 

## 1. Overview & Creative North Star

This design system is built upon the "Precision Kineticism" North Star. For the Tesla Model 3 Highland mobile guide, we are not simply building a website; we are crafting a digital cockpit. The aesthetic prioritizes high-performance clarity, using intentional whitespace to allow the vehicle's engineering to speak for itself. 

 

To move beyond the "template" look, this system utilizes **asymmetric layout structures**—where text and imagery overlap to create a sense of forward motion—and **tonal layering** instead of traditional borders. The result is a high-end editorial experience that feels as sleek and responsive as the vehicle it describes.

 

## 2. Colors: The Tonal Spectrum

The palette is rooted in high-contrast monochrome, punctuated by the surgical application of "Tesla Red."

 

*   **The Ignition Point:** Use `primary` (#b90027) only for critical interaction points or performance highlights. It should never overwhelm the screen; it is a laser, not a floodlight.

*   **The "No-Line" Rule:** To maintain a premium, seamless feel, 1px solid borders are prohibited for sectioning. Separation must be achieved through background shifts. For example, a content block in `surface_container_low` (#f3f3f3) sitting on a `surface` (#f9f9f9) background provides all the definition a modern user needs.

*   **Surface Hierarchy & Nesting:** Treat the mobile screen as a series of stacked sheets.

    *   **Base:** `surface` (#f9f9f9)

    *   **Interactive Cards:** `surface_container_lowest` (#ffffff) to provide a subtle "pop."

    *   **Section Breaks:** `surface_container` (#eeeeee) to anchor heavy data tables.

*   **The Glass & Gradient Rule:** For floating navigation or modal overlays, use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-filter: blur(20px)`. Main CTAs should use a subtle linear gradient from `primary` (#b90027) to `primary_container` (#e31937) at a 135-degree angle to add "soul" and depth.

 

## 3. Typography: The Editorial Voice

We use **Inter** across the entire system. Its neutral, technical character mimics the Highland’s interior displays.

 

*   **The Power Scale:** 

    *   **Display-LG (3.5rem):** Reserved for singular performance stats (e.g., "0–60 in 2.9s").

    *   **Headline-SM (1.5rem):** Used for section titles. Implement with a slight negative letter-spacing (-0.02em) to feel "machined."

    *   **Body-MD (0.875rem):** The workhorse for technical descriptions. Ensure a generous line-height (1.6) to maximize readability on small screens.

*   **Visual Hierarchy:** Pair `headline-sm` in `on_surface` (#1b1b1b) with a `label-sm` in `secondary` (#5f5e5e) for metadata. This contrast in weight and color creates an authoritative, technical atmosphere.

 

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "software-standard" for this brand. We use physical layering.

 

*   **The Layering Principle:** Depth is achieved by "stacking" container tiers. Place a `surface_container_lowest` card on a `surface_container_low` section. This creates a soft, natural lift that feels like high-end paper or brushed metal.

*   **Ambient Shadows:** If a floating action button or high-priority modal requires a shadow, use a large blur (30px–40px) at a very low opacity (4%–6%) using the `on_surface` color.

*   **The Ghost Border:** If accessibility requires a stroke (e.g., in a high-contrast comparison table), use the `outline_variant` (#e6bdbb) at 15% opacity. This creates a "suggestion" of a boundary without cluttering the UI.

 

## 5. Components: Engineered Elements

 

### Buttons

*   **Primary:** Filled with the `primary` to `primary_container` gradient. Use `rounded-md` (0.375rem) for a modern, slightly technical edge.

*   **Secondary (Ghost):** Use a `ghost-border` (outline-variant at 20%) with `on_surface` text. This is for secondary actions like "Download Specs."

 

### Comparison Cards (Tesla vs. IONIQ 5)

*   **The "Split-Shift" Layout:** Avoid side-by-side columns on mobile. Instead, use a vertical stack where the Tesla Model 3 Highland uses `surface_container_lowest` (pure white) and the competitor uses `surface_dim` (#dadada). 

*   **No Dividers:** Separate comparison rows using vertical whitespace (2rem) and `title-sm` labels. The lack of lines makes the data feel more "open" and less like a spreadsheet.

 

### Technical Data Tables

*   **Styling:** Use `surface_container_low` for the table header. Forgo all vertical lines. Use `body-sm` for cell data.

*   **Highlighting:** Use a `primary` (#b90027) "pip" (a small 4px circle) next to the Tesla spec to indicate a win/advantage.

 

### Chips & Tags

*   **Action Chips:** Use `secondary_container` (#e2dfde) with `on_secondary_container` text. These should be `rounded-full` (9999px) to contrast against the more architectural cards.

 

## 6. Do's and Don'ts

 

### Do

*   **Do** use extreme whitespace. If a section feels "full," double the padding.

*   **Do** use `tertiary` (#006570) for "Eco-friendly" or "Charging" callouts to distinguish them from "Performance" (Red) and "General Info" (Grey).

*   **Do** ensure all touch targets are at least 48px, even if the visual element is smaller.

 

### Don't

*   **Don't** use black (#000000). Use `on_background` (#1b1b1b) for text to prevent harsh visual vibration on OLED mobile screens.

*   **Don't** use 100% opaque borders. They create "visual noise" that contradicts the minimalist Tesla philosophy.

*   **Don't** use standard "drop shadows" with high opacity. They feel dated and "heavy."