# Nutrition module spec

**Purpose:** Daily food log with macros. Targets vs. actuals, no shame.

## User stories

- Log a food in ≤10 seconds (name + calories at minimum).
- Optionally fetch macros automatically via barcode (OpenFoodFacts).
- See today's macro totals against my targets in plain numbers + progress bars.
- Navigate to other days (prev / today / next / pick).

## Schema

```ts
nutrition_entries {
  id, name, calories, protein, carbs, fat,
  servingSize (text), barcode (text), loggedAt, createdAt, updatedAt
}
```

Macros stored as `double precision`. Targets live in `src/lib/constants.ts`.

## Server actions

- `createNutritionEntry`, `updateNutritionEntry`, `deleteNutritionEntry`.
- `lookupFood(barcode)` — fetches per-100g macros from OpenFoodFacts.

## UI

- **Top of page**: DateNavigator (prev / today / next + date picker).
- **Macro summary**: four progress bars (calories, protein, carbs, fat) with `current / target` labels. No red, no alarms — bars cap at 100% width visually.
- **Entries list**: foods logged for the selected day, ordered by time.
- **Add dialog**: optional barcode + Lookup button (autofills macros), or manual entry. All macros editable after lookup.

## Dashboard widget

```
Nutrition
─────────
1,847 / 2,400 kcal
P 120 · C 210 · F 64g
```

Empty (nothing logged today): "Nothing logged today."

## Acceptance criteria

- [ ] Add a food manually with name + calories — succeeds.
- [ ] Barcode lookup populates name + macros — succeeds for a known product, returns a clean error for unknown.
- [ ] Date navigator changes the visible day without losing scroll.
- [ ] Macro summary reflects accurate sums for the selected day.
- [ ] ≥3 Vitest tests on schema pass.
- [ ] `pnpm typecheck` & `pnpm lint` pass.
