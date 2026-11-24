---
slug: "twitter-activity-french-deputies"
lang: "en"
title: "Trends in Twitter Activity of French Deputies"
summary: "Political data analysis project combining tweet activity, retweet dynamics, party-level aggregation, and statistical scaling behavior."
---

# Overview

## Study focus
This project analyzes the Twitter activity of French deputies by combining tweet-level information with party and deputy metadata.
The repository is positioned as a political data analysis workflow rather than as a social-media scraping demo.

The subject is analytically relevant because political communication on social platforms mixes visibility, amplification, temporal rhythm, and partisan structure.
A useful study therefore needs both descriptive and relational perspectives.

## Why the project matters
The interest of the repository lies in the way it turns raw social-media traces into structured political indicators.
It does not reduce activity to total volume alone, but also examines retweet share, monthly dynamics, party distributions, and lexical patterns.

This gives the project a broader analytical scope.
It becomes a study of digital political behavior rather than a simple count of messages posted by public figures.

- [v] I combined behavioral, temporal, and partisan dimensions in the same workflow.
- [v] I treated social-media data as a structured political object, not only as a visualization source.
- [!] Some raw Excel sources are not in the public repository, which limits full reproducibility from scratch.

# Method

## Data consolidation
The repository merges tweet and retweet information with deputy-level attributes.
This integration step is essential because the political meaning of activity depends on who posts, under which party label, and with what level of amplification.

The final dataset supports monthly analysis, party comparisons, and word-level explorations.
That creates a richer basis for interpretation than isolated timeline charts.

## Analytical outputs
The project studies monthly activity patterns by party and compares the share of retweets in total communication.
This is a relevant distinction because original posting and relay behavior do not play the same role in political visibility.

The repository also includes word clouds and descriptive graphics.
While word clouds are not a formal linguistic model, they remain useful here as a fast lexical signal when framed as exploratory output.

## Statistical structure
One of the more interesting components is a log-log relationship of the form `ln(n) = -1.36 + 2.19 ln(t)`.
This indicates an attempt to characterize scaling behavior in the activity distribution rather than remaining at a purely visual level.

That choice adds substance to the project.
It shows that the repository is not limited to plotting counts, but also explores whether a structural regularity can be expressed statistically.

- [v] I joined metadata and activity traces into a coherent analytical dataset.
- [v] I distinguished between original activity and retweet amplification.
- [v] I added a log-log specification as a quantitative layer beyond descriptive plotting.
- [!] Missing raw inputs reduce end-to-end reproducibility for a third party.

# Value

## What I wanted to show
I wanted to analyze political communication data at several levels at once: source merging, temporal aggregation, text exploration and simple statistical formalization. For me, the platform is a space of visibility and circulation, not a simple message counter.

## What I take from it
- [v] I linked volume, timing, retweets and vocabulary in a single reading.
- [v] I combined descriptive outputs with a short but useful quantitative formalization.
- [!] My empirical value is tied to source data that are not embedded in the public repository.
