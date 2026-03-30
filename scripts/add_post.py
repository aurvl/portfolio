from __future__ import annotations

import argparse
from pathlib import Path

from content_ops import (
    BLOG_SUMMARY_WORD_LIMIT,
    POSTS_DIR,
    SERIES_PATH,
    VALID_LANGUAGES,
    build_blog_post_markdown,
    count_words,
    dedupe_preserve_order,
    ensure_unique_path,
    humanize_slug,
    is_valid_iso_date,
    is_valid_slug,
    load_json,
    relative_path,
    slugify,
    today_iso,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create blog post markdown skeletons that match the portfolio content conventions."
    )
    parser.add_argument("--slug", help="Stable post slug. Derived from --title-en when omitted.")
    parser.add_argument("--title-en", help="English post title.")
    parser.add_argument("--title-fr", help="French post title.")
    parser.add_argument("--summary-en", help="Short English summary.")
    parser.add_argument("--summary-fr", help="Short French summary.")
    parser.add_argument("--date", default=today_iso(), help="Publish date in YYYY-MM-DD format.")
    parser.add_argument("--series", help="Optional series slug from src/data/series.json.")
    parser.add_argument(
        "--tag",
        action="append",
        dest="shared_tags",
        help="Repeat for tags shared across both languages.",
    )
    parser.add_argument(
        "--tag-en",
        action="append",
        dest="tags_en",
        help="Repeat for English-specific tags.",
    )
    parser.add_argument(
        "--tag-fr",
        action="append",
        dest="tags_fr",
        help="Repeat for French-specific tags.",
    )
    parser.add_argument("--cover", help="Cover path under public/, or absolute /assets/... path.")
    parser.add_argument("--featured", action="store_true", help="Mark the post as featured.")
    parser.add_argument(
        "--languages",
        nargs="+",
        choices=VALID_LANGUAGES,
        default=list(VALID_LANGUAGES),
        help="Languages to scaffold. Defaults to both English and French.",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite markdown files if they exist.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the resulting paths and metadata without writing files.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    slug_source = args.slug or args.title_en or args.title_fr
    if not slug_source:
        raise SystemExit("Provide --slug or at least one title.")

    slug = args.slug or slugify(slug_source)
    if not is_valid_slug(slug):
        raise SystemExit(f"Invalid slug: {slug}")

    if not is_valid_iso_date(args.date):
        raise SystemExit(f"Invalid --date value: {args.date}")

    series_cover = None
    if args.series:
        series = load_json(SERIES_PATH)
        matching_series = next((item for item in series if item["slug"] == args.series), None)
        if not matching_series:
            raise SystemExit(f"Unknown series slug: {args.series}")
        series_cover = matching_series.get("cover")

    cover = normalize_cover_reference(
        args.cover or series_cover or "/assets/blog/images/defaultblogpostcover.png"
    )
    title_en = args.title_en or humanize_slug(slug)
    title_fr = args.title_fr or title_en
    summary_en = args.summary_en or "TODO: concise English blog-post summary."
    summary_fr = args.summary_fr or "TODO: resume concis de l'article en francais."
    shared_tags = normalize_tags(args.shared_tags)
    tags_en = dedupe_preserve_order([*shared_tags, *normalize_tags(args.tags_en)]) or ["TODO-tag"]
    tags_fr = dedupe_preserve_order([*shared_tags, *normalize_tags(args.tags_fr)]) or ["TODO-tag"]

    for language, summary in (("en", summary_en), ("fr", summary_fr)):
        if count_words(summary) > BLOG_SUMMARY_WORD_LIMIT:
            raise SystemExit(
                f"{language} summary exceeds {BLOG_SUMMARY_WORD_LIMIT} words."
            )

    languages = dedupe_preserve_order(list(args.languages))
    created_files: list[tuple[Path, str]] = []
    existing_paths = [POSTS_DIR / f"{slug}.{language}.md" for language in languages]

    for path in existing_paths:
        ensure_unique_path(path, args.force)

    for language in languages:
        title = title_en if language == "en" else title_fr
        summary = summary_en if language == "en" else summary_fr
        tags = tags_en if language == "en" else tags_fr
        output_path = POSTS_DIR / f"{slug}.{language}.md"
        created_files.append(
            (
                output_path,
                build_blog_post_markdown(
                    slug=slug,
                    language=language,
                    title=title,
                    summary=summary,
                    date_value=args.date,
                    tags=tags,
                    cover=cover,
                    featured=bool(args.featured),
                    series_slug=args.series,
                ),
            )
        )

    if args.dry_run:
        for output_path, _ in created_files:
            print(f"[dry-run] Would create {relative_path(output_path)}")
        print_follow_up_notes()
        return 0

    for output_path, content in created_files:
        output_path.write_text(content, encoding="utf-8")
        print(f"Created {relative_path(output_path)}")

    print_follow_up_notes()
    return 0


def print_follow_up_notes() -> None:
    print("Next steps:")
    print("- Replace all TODO placeholders in the new markdown files.")
    print("- Add or confirm the cover asset under public/assets/blog/images/.")
    print("- Run python scripts/validate_content.py before commit.")


def normalize_tags(values: list[str] | None) -> list[str]:
    if not values:
        return []

    normalized = [value.strip() for value in values if value and value.strip()]
    return dedupe_preserve_order(normalized)


def normalize_cover_reference(value: str) -> str:
    trimmed = value.strip()

    if trimmed.startswith("public/"):
        trimmed = trimmed[len("public") :]

    if not trimmed.startswith("/"):
        trimmed = "/" + trimmed.lstrip("/")

    return Path(trimmed).as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
