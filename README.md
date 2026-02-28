# Boy Kibble

Content and research hub for the protein-bowl food trend.

## What Is This?

Boy Kibble is a content and research project about the way people actually eat when nobody is watching: bulk-prepped bowls, repetitive high-protein meals, and the quiet infrastructure of the protein craze.

## Stack

- Static HTML/CSS/JS
- Instrument Serif + Inter typography
- Hash-based routing (SPA)
- Deployed to S3/Vercel

## Content System

Three recurring formats:
1. **Kibble of the Week** — photo + macros + commentary on a real bowl
2. **Kibble Field Note** — 600-900 word observational essay
3. **Kibble Data Point** — micro insight with supporting data

Content lives in `/content/` as Markdown + JSON.

## Structure

```
site/           # Static site files
content/        # Markdown + JSON content
  recipes/      # Kibble of the Week entries
  notes/        # Field Note essays
  data-points/  # Data Point insights
pipeline/       # Content templates and scripts
  scripts/      # TikTok/Reel scripts
  assets/       # Photos and media
  posts/        # Caption drafts
```

## Built By

[Greenbaum Labs](https://greenbaumlabs.com)
