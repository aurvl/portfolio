---
slug: "phillips-curve-europe-policy"
lang: "en"
title: "Phillips Curve Analysis and Policy Guidance for Europe 2024"
summary: "Compact econometric exercise using inflation and unemployment data to revisit the Phillips Curve and discuss policy interpretation."
---

# Overview

## Project focus
This project revisits the Phillips Curve through a compact European comparison built around inflation and unemployment indicators.
The repository is positioned as a pedagogical econometric exercise rather than as a full macroeconomic forecasting system.

That framing matters.
The Phillips Curve is frequently invoked in policy debates, but its empirical shape depends heavily on period, country context, and specification choices.

## Why the project is useful
The value of the repository lies in the way it operationalizes a theoretical relationship with a deliberately simple setup.
Instead of hiding behind complexity, it exposes the assumptions directly and makes the interpretation easier to follow.

This makes the project relevant as a methodological artifact.
It shows how a macroeconomic hypothesis can be turned into code, estimated, and discussed in a constrained but readable format.

- [v] The project translates a major macroeconomic concept into an explicit empirical workflow.
- [v] Its simplicity makes the modeling assumptions visible.
- [!] The repository should be read as a compact analytical prototype, not as an institutional forecasting tool.

# Method

## Data and assumptions
The implementation works on a small set of European country observations, with values hard-coded in the notebook or script.
A natural unemployment benchmark close to `5%` is used to define an unemployment gap for interpretation.

This choice is intentionally simplified.
It keeps the model compact, while also making it clear that the results depend strongly on the assumed equilibrium level.

## Estimation logic
The repository uses a straightforward regression-style relationship between inflation and unemployment.
Slope and intercept are derived in a way that resembles an `OLS` exercise, with the aim of quantifying the direction and steepness of the Phillips trade-off.

The project then extends the quantitative result into policy-oriented commentary for `2024`.
That extension is useful because it shows how even a small empirical model can feed a structured macroeconomic interpretation.

## Limits of the setup
The analytical limits are visible and should remain explicit.
A five-country sample, fixed assumptions on the natural rate, and a simplified specification cannot capture the full instability of inflation dynamics.

That said, the repository remains coherent within its own perimeter.
Its purpose is to formalize a stylized relationship and discuss what such a relationship can and cannot support.

- [v] The method makes its assumptions explicit rather than burying them in a black-box implementation.
- [v] The project links estimation to macroeconomic interpretation in a readable way.
- [!] The data foundation is too limited for strong policy prescriptions.
- [!] Structural breaks, expectations, and supply shocks are outside the modeled scope.

# Value

## What the project demonstrates
The project demonstrates the ability to build an empirical note around a canonical economic mechanism.
It shows familiarity with simple regression logic, macroeconomic interpretation, and the careful translation of theory into a measurable setup.

It also highlights an important analytical quality.
The repository accepts that a compact model can still be useful when its assumptions are transparent and its claims remain proportionate.

## Professional significance
The project contributes a policy-oriented econometric case study with a clear conceptual anchor.
It shows the capacity to formalize an economic relationship, estimate it, and derive bounded interpretation from a small empirical base.

The overall result brings out a useful combination of quantitative reasoning and domain framing.
That is often what differentiates a notebook exercise from a more serious analytical note.

## Limits and positioning
The project is best positioned as a concise analytical prototype.
Its strongest contribution lies in clarity of setup and interpretation, not in breadth of data or modeling sophistication.

- [v] The project highlights coherent macroeconomic reasoning under explicit assumptions.
- [v] It shows how policy commentary can be tied back to a coded empirical mechanism.
- [!] Its main value is conceptual and methodological, not exhaustive econometric coverage.
