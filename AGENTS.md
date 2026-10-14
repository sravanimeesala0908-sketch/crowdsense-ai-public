<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## CrowdSense architecture
- Keep the deterministic estimation rules in `src/lib/crowd.ts` shared by results and hourly outlooks, so every view uses one explainable calculation.
- Keep predictions and recent history in React session state only; this demo intentionally needs no backend or persistent personal data.
- Define visual roles and responsive presentation in `src/styles.css` and reuse the shared CrowdSense shell for consistent navigation.
- Put the full estimation method on `/about` and keep the dashboard at `/` so presentation details have their own accessible page.
