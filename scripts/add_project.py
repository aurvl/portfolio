from __future__ import annotations

import argparse
from pathlib import Path

from content_ops import (
    ALLOWED_PROJECT_COVER_EXTENSIONS,
    PROJECT_SUMMARY_WORD_LIMIT,
    DOMAIN_COLORS_PATH,
    PROJECTS_PATH,
    PROJECT_WINDOWS_DIR,
    VALID_PROJECT_STATUSES,
    VALID_TECHNICAL_LEVELS,
    VALID_WINDOW_ACCESS,
    build_project_window_markdown,
    count_words,
    dedupe_preserve_order,
    dump_json,
    ensure_unique_path,
    humanize_slug,
    is_http_url,
    is_valid_iso_date,
    is_valid_slug,
    load_json,
    next_project_id,
    relative_path,
    slugify,
    sort_projects_by_date,
    today_iso,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a new project entry plus bilingual project-window markdown files."
    )
    parser.add_argument("--slug", help="Stable project slug. Derived from --title-en when omitted.")
    parser.add_argument("--title-en", help="English project title.")
    parser.add_argument("--title-fr", help="French project title.")
    parser.add_argument("--summary-en", help="Short English summary for cards and metadata.")
    parser.add_argument("--summary-fr", help="Short French summary for cards and metadata.")
    parser.add_argument("--description-en", help="Long English project description.")
    parser.add_argument("--description-fr", help="Long French project description.")
    parser.add_argument("--date", default=today_iso(), help="Project date in YYYY-MM-DD format.")
    parser.add_argument(
        "--status",
        default="in-progress",
        choices=VALID_PROJECT_STATUSES,
        help="Project lifecycle status.",
    )
    parser.add_argument(
        "--technical-level",
        type=int,
        default=2,
        choices=VALID_TECHNICAL_LEVELS,
        help="Technical level shown in the UI.",
    )
    parser.add_argument(
        "--access",
        default="public",
        choices=VALID_WINDOW_ACCESS,
        help="Project-window access mode.",
    )
    parser.add_argument("--featured", action="store_true", help="Mark the project as featured.")
    parser.add_argument(
        "--cover-ext",
        default="png",
        choices=ALLOWED_PROJECT_COVER_EXTENSIONS,
        help="Extension used for the future project cover asset.",
    )
    parser.add_argument("--cover-alt-en", help="English alt text for the project cover.")
    parser.add_argument("--cover-alt-fr", help="French alt text for the project cover.")
    parser.add_argument("--primary", help="Primary project link.")
    parser.add_argument("--read-more", help="Read-more link.")
    parser.add_argument("--github", help="Repository link.")
    parser.add_argument("--live", help="Live demo link.")
    parser.add_argument("--domain", action="append", dest="domains", help="Repeat for each domain.")
    parser.add_argument("--tool", action="append", dest="tools", help="Repeat for each tool.")
    parser.add_argument(
        "--keyword-en",
        action="append",
        dest="keywords_en",
        help="Repeat for each English keyword.",
    )
    parser.add_argument(
        "--keyword-fr",
        action="append",
        dest="keywords_fr",
        help="Repeat for each French keyword.",
    )
    parser.add_argument(
        "--window-content-slug",
        help="Override the markdown content slug when it differs from the project slug.",
    )
    parser.add_argument(
        "--no-window",
        action="store_true",
        help="Skip markdown creation and omit the window block from projects.json.",
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

    projects = load_json(PROJECTS_PATH)
    if any(project["slug"] == slug for project in projects):
        raise SystemExit(f"Project slug already exists: {slug}")

    if args.featured:
        existing_featured = next((project for project in projects if project.get("featured")), None)
        if existing_featured:
            raise SystemExit(
                "Another featured project already exists: "
                f"{existing_featured['id']} / {existing_featured['slug']}"
            )

    for label, url in (
        ("primary", args.primary),
        ("readMore", args.read_more),
        ("github", args.github),
        ("live", args.live),
    ):
        if url and not is_http_url(url):
            raise SystemExit(f"Invalid {label} URL: {url}")

    title_en = args.title_en or humanize_slug(slug)
    title_fr = args.title_fr or title_en
    summary_en = args.summary_en or "TODO: concise English project summary."
    summary_fr = args.summary_fr or "TODO: resume concis du projet en francais."
    description_en = args.description_en or "TODO: detailed English project description."
    description_fr = args.description_fr or "TODO: description detaillee du projet en francais."
    domains = normalize_values(args.domains) or ["TODO-domain"]
    tools = normalize_values(args.tools) or ["TODO-tool"]
    keywords_en = normalize_values(args.keywords_en) or ["TODO-keyword"]
    keywords_fr = normalize_values(args.keywords_fr) or ["TODO-mot-cle"]
    content_slug = args.window_content_slug or slug
    cover_src = f"/assets/projects/images/{slug}-cover.{args.cover_ext}"
    cover_alt_en = args.cover_alt_en or f"{title_en} project cover"
    cover_alt_fr = args.cover_alt_fr or f"Visuel du projet {title_fr}"
    project_id = next_project_id(projects)

    for language, summary in (("en", summary_en), ("fr", summary_fr)):
        if count_words(summary) > PROJECT_SUMMARY_WORD_LIMIT:
            raise SystemExit(
                f"{language} summary exceeds {PROJECT_SUMMARY_WORD_LIMIT} words."
            )

    if not args.no_window and any(
        project.get("window", {}).get("contentSlug") == content_slug for project in projects
    ):
        raise SystemExit(f"Project window content slug already exists: {content_slug}")

    project_entry = {
        "id": project_id,
        "slug": slug,
        "status": args.status,
        "date": args.date,
        "featured": bool(args.featured),
        "technicalLevel": args.technical_level,
        "cover": {
            "src": cover_src,
            "alt": {
                "en": cover_alt_en,
                "fr": cover_alt_fr,
            },
        },
        "links": {
            "primary": args.primary,
            "readMore": args.read_more,
            "github": args.github,
            "live": args.live,
        },
        "taxonomy": {
            "domains": domains,
            "tools": tools,
            "keywords": {
                "en": keywords_en,
                "fr": keywords_fr,
            },
        },
        "content": {
            "en": {
                "title": title_en,
                "summary": summary_en,
                "description": description_en,
            },
            "fr": {
                "title": title_fr,
                "summary": summary_fr,
                "description": description_fr,
            },
        },
    }

    created_files: list[tuple[Path, str]] = []

    if not args.no_window:
        project_entry["window"] = {
            "enabled": True,
            "contentSlug": content_slug,
            "access": args.access,
        }
        for language, title, summary in (
            ("en", title_en, summary_en),
            ("fr", title_fr, summary_fr),
        ):
            output_path = PROJECT_WINDOWS_DIR / f"{content_slug}.{language}.md"
            ensure_unique_path(output_path, args.force)
            created_files.append(
                (
                    output_path,
                    build_project_window_markdown(
                        slug=content_slug,
                        language=language,
                        title=title,
                        summary=summary,
                    ),
                )
            )

    updated_projects = sort_projects_by_date([*projects, project_entry])

    if args.dry_run:
        print(f"[dry-run] Would update {relative_path(PROJECTS_PATH)} with {project_id} / {slug}")
        for path, _ in created_files:
            print(f"[dry-run] Would create {relative_path(path)}")
        print_follow_up_notes(domains)
        return 0

    dump_json(PROJECTS_PATH, updated_projects)

    for path, content in created_files:
        path.write_text(content, encoding="utf-8")

    print(f"Updated {relative_path(PROJECTS_PATH)} with {project_id} / {slug}")
    for path, _ in created_files:
        print(f"Created {relative_path(path)}")
    print_follow_up_notes(domains)
    return 0


def print_follow_up_notes(domains: list[str]) -> None:
    domain_colors = load_json(DOMAIN_COLORS_PATH)
    missing_domains = [domain for domain in domains if domain not in domain_colors]

    print("Next steps:")
    print("- Add the project cover file under public/assets/projects/images/.")
    print("- Replace all TODO placeholders in projects.json and markdown.")
    print("- Run python scripts/validate_content.py before commit.")

    if missing_domains:
        print(
            "- Add domain color mappings in "
            f"{relative_path(DOMAIN_COLORS_PATH)} for: {', '.join(missing_domains)}"
        )


def normalize_values(values: list[str] | None) -> list[str]:
    if not values:
        return []

    normalized = [value.strip() for value in values if value and value.strip()]
    return dedupe_preserve_order(normalized)


if __name__ == "__main__":
    raise SystemExit(main())
