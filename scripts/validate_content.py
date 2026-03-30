from __future__ import annotations

from pathlib import Path

from content_ops import (
    ALLOWED_PROJECT_COVER_EXTENSIONS,
    BLOG_SUMMARY_WORD_LIMIT,
    DOMAIN_COLORS_PATH,
    MARKDOWN_FILENAME_PATTERN,
    POSTS_DIR,
    PROJECT_ID_PATTERN,
    PROJECT_SUMMARY_WORD_LIMIT,
    PROJECT_WINDOWS_DIR,
    PROJECT_WINDOW_SUMMARY_WORD_LIMIT,
    PROJECTS_PATH,
    SERIES_PATH,
    SKILL_ID_PATTERN,
    SKILLS_PATH,
    VALID_LANGUAGES,
    VALID_PROJECT_STATUSES,
    VALID_PROJECT_WINDOW_HEADINGS,
    VALID_TECHNICAL_LEVELS,
    VALID_WINDOW_ACCESS,
    contains_placeholder,
    count_words,
    extract_markdown_document,
    extract_markdown_headings,
    frontmatter_boolean,
    frontmatter_keys,
    frontmatter_list,
    frontmatter_scalar,
    is_http_url,
    is_valid_iso_date,
    is_valid_slug,
    load_json,
    public_reference_to_path,
    relative_path,
    sort_projects_by_date,
)


def validate_projects(domain_colors: dict[str, str]) -> tuple[list[str], list[str], dict[str, str]]:
    errors: list[str] = []
    warnings: list[str] = []
    expected_window_slugs: dict[str, str] = {}

    projects = load_json(PROJECTS_PATH)
    if not isinstance(projects, list):
        return [f"{relative_path(PROJECTS_PATH)} must contain a JSON array."], warnings, {}

    ids: set[str] = set()
    slugs: set[str] = set()
    featured_count = 0

    for index, project in enumerate(projects):
        location = project_location(index, project)
        project_id = str(project.get("id", ""))
        slug = str(project.get("slug", ""))

        if not PROJECT_ID_PATTERN.fullmatch(project_id):
            errors.append(f"{location} has an invalid project id.")
        elif project_id in ids:
            errors.append(f"{location} duplicates project id {project_id}.")
        else:
            ids.add(project_id)

        if not is_valid_slug(slug):
            errors.append(f"{location} has an invalid slug.")
        elif slug in slugs:
            errors.append(f"{location} duplicates project slug {slug}.")
        else:
            slugs.add(slug)

        if project.get("status") not in VALID_PROJECT_STATUSES:
            errors.append(f"{location} has an invalid status.")

        if not is_valid_iso_date(str(project.get("date", ""))):
            errors.append(f"{location} has an invalid date.")

        if project.get("technicalLevel") not in VALID_TECHNICAL_LEVELS:
            errors.append(f"{location} has an invalid technicalLevel.")

        featured = project.get("featured")
        if not isinstance(featured, bool):
            errors.append(f"{location} must use a boolean featured flag.")
        elif featured:
            featured_count += 1

        cover = project.get("cover")
        if not isinstance(cover, dict):
            errors.append(f"{location} is missing a valid cover object.")
        else:
            cover_src = cover.get("src")
            if not isinstance(cover_src, str) or not cover_src.strip():
                errors.append(f"{location} is missing cover.src.")
            else:
                errors.extend(validate_project_cover(location, slug, cover_src))

            cover_alt = cover.get("alt")
            if not isinstance(cover_alt, dict):
                errors.append(f"{location} is missing cover.alt translations.")
            else:
                for language in VALID_LANGUAGES:
                    if not isinstance(cover_alt.get(language), str) or not cover_alt[language].strip():
                        errors.append(f"{location} is missing cover.alt.{language}.")

        links = project.get("links")
        if not isinstance(links, dict):
            errors.append(f"{location} is missing a valid links object.")
        else:
            for key in ("primary", "readMore", "github", "live"):
                value = links.get(key)
                if value is not None and (not isinstance(value, str) or not is_http_url(value)):
                    errors.append(f"{location} has an invalid links.{key} URL.")

            if featured and (
                not links.get("primary") or not links.get("readMore") or not cover.get("src")
            ):
                errors.append(
                    f"{location} is featured but missing links.primary, links.readMore, or cover.src."
                )

        taxonomy = project.get("taxonomy")
        if not isinstance(taxonomy, dict):
            errors.append(f"{location} is missing taxonomy.")
        else:
            domains = validate_string_list(
                value=taxonomy.get("domains"),
                location=f"{location} taxonomy.domains",
                errors=errors,
            )
            tools = validate_string_list(
                value=taxonomy.get("tools"),
                location=f"{location} taxonomy.tools",
                errors=errors,
            )
            keywords = taxonomy.get("keywords")
            if not isinstance(keywords, dict):
                errors.append(f"{location} is missing taxonomy.keywords.")
            else:
                for language in VALID_LANGUAGES:
                    validate_string_list(
                        value=keywords.get(language),
                        location=f"{location} taxonomy.keywords.{language}",
                        errors=errors,
                    )

            for domain in domains:
                if domain not in domain_colors:
                    warnings.append(
                        f"{location} uses domain '{domain}' with no mapping in {relative_path(DOMAIN_COLORS_PATH)}."
                    )

            if len(domains) != len(set(domains)):
                errors.append(f"{location} has duplicate domain labels.")
            if len(tools) != len(set(tools)):
                errors.append(f"{location} has duplicate tool labels.")

        content = project.get("content")
        if not isinstance(content, dict):
            errors.append(f"{location} is missing localized content.")
        else:
            for language in VALID_LANGUAGES:
                localized = content.get(language)
                if not isinstance(localized, dict):
                    errors.append(f"{location} is missing content.{language}.")
                    continue

                for field in ("title", "summary", "description"):
                    value = localized.get(field)
                    if not isinstance(value, str) or not value.strip():
                        errors.append(f"{location} is missing content.{language}.{field}.")

                summary = localized.get("summary")
                if isinstance(summary, str) and count_words(summary) > PROJECT_SUMMARY_WORD_LIMIT:
                    errors.append(
                        f"{location} content.{language}.summary exceeds {PROJECT_SUMMARY_WORD_LIMIT} words."
                    )

        window = project.get("window")
        if window is None:
            continue

        if not isinstance(window, dict):
            errors.append(f"{location} has an invalid window configuration.")
            continue

        enabled = window.get("enabled")
        if not isinstance(enabled, bool):
            errors.append(f"{location} must use a boolean window.enabled.")
            continue

        content_slug = window.get("contentSlug")
        access = window.get("access")

        if enabled:
            if not isinstance(content_slug, str) or not is_valid_slug(content_slug):
                errors.append(f"{location} has an invalid window.contentSlug.")
            elif content_slug in expected_window_slugs:
                errors.append(
                    f"{location} reuses window.contentSlug '{content_slug}' already used by "
                    f"{expected_window_slugs[content_slug]}."
                )
            else:
                expected_window_slugs[content_slug] = slug

            if access not in VALID_WINDOW_ACCESS:
                errors.append(f"{location} has an invalid window.access.")

        elif content_slug or access:
            warnings.append(f"{location} keeps window metadata even though window.enabled is false.")

        if contains_placeholder(str(project)):
            errors.append(f"{location} still contains TODO-style placeholders.")

    if featured_count > 1:
        errors.append("More than one project is marked as featured.")

    sorted_projects = sort_projects_by_date(projects)
    if [project.get("id") for project in projects] != [project.get("id") for project in sorted_projects]:
        warnings.append(
            f"{relative_path(PROJECTS_PATH)} is not sorted by date descending. "
            "Run the project scaffolder or reorder entries before committing."
        )

    return errors, warnings, expected_window_slugs


def validate_project_cover(location: str, slug: str, cover_src: str) -> list[str]:
    errors: list[str] = []
    cover_path = public_reference_to_path(cover_src)

    if not cover_src.startswith("/assets/projects/images/"):
        errors.append(f"{location} cover.src should live under /assets/projects/images/.")

    if cover_path is not None:
        if not cover_path.exists():
            errors.append(f"{location} references missing asset {cover_src}.")
        else:
            suffix = cover_path.suffix.lower().lstrip(".")
            if suffix not in ALLOWED_PROJECT_COVER_EXTENSIONS:
                errors.append(f"{location} uses an unsupported cover extension in {cover_src}.")

    expected_prefix = f"{slug}-cover."
    if not Path(cover_src).name.startswith(expected_prefix):
        errors.append(f"{location} cover filename should start with {expected_prefix}.")

    return errors


def validate_series() -> tuple[list[str], list[str], set[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    slugs: set[str] = set()

    series_entries = load_json(SERIES_PATH)
    if not isinstance(series_entries, list):
        return [f"{relative_path(SERIES_PATH)} must contain a JSON array."], warnings, slugs

    for index, entry in enumerate(series_entries):
        location = f"{relative_path(SERIES_PATH)}[{index}]"
        slug = entry.get("slug")
        if not isinstance(slug, str) or not is_valid_slug(slug):
            errors.append(f"{location} has an invalid series slug.")
            continue

        if slug in slugs:
            errors.append(f"{location} duplicates series slug {slug}.")
        else:
            slugs.add(slug)

        featured = entry.get("featured")
        if not isinstance(featured, bool):
            errors.append(f"{location} must use a boolean featured flag.")

        cover = entry.get("cover")
        if not isinstance(cover, str) or not cover.strip():
            errors.append(f"{location} is missing cover.")
        else:
            cover_path = public_reference_to_path(cover)
            if cover_path is not None and not cover_path.exists():
                errors.append(f"{location} references missing asset {cover}.")

        for field in ("title", "description"):
            localized = entry.get(field)
            if not isinstance(localized, dict):
                errors.append(f"{location} is missing {field}.")
                continue

            for language in VALID_LANGUAGES:
                value = localized.get(language)
                if not isinstance(value, str) or not value.strip():
                    errors.append(f"{location} is missing {field}.{language}.")

        if contains_placeholder(str(entry)):
            errors.append(f"{location} still contains TODO-style placeholders.")

    return errors, warnings, slugs


def validate_skills() -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    catalog = load_json(SKILLS_PATH)
    if not isinstance(catalog, dict) or not isinstance(catalog.get("categories"), list):
        return [f"{relative_path(SKILLS_PATH)} must contain a categories array."], warnings

    category_ids: set[str] = set()
    skill_ids: set[str] = set()
    skill_slugs: set[str] = set()

    for category_index, category in enumerate(catalog["categories"]):
        category_location = f"{relative_path(SKILLS_PATH)} category[{category_index}]"
        category_id = category.get("id")

        if not isinstance(category_id, str) or not category_id.strip():
            errors.append(f"{category_location} is missing id.")
        elif category_id in category_ids:
            errors.append(f"{category_location} duplicates category id {category_id}.")
        else:
            category_ids.add(category_id)

        for field in ("label", "description"):
            localized = category.get(field)
            if not isinstance(localized, dict):
                errors.append(f"{category_location} is missing {field}.")
                continue

            for language in VALID_LANGUAGES:
                value = localized.get(language)
                if not isinstance(value, str) or not value.strip():
                    errors.append(f"{category_location} is missing {field}.{language}.")

        items = category.get("items")
        if not isinstance(items, list) or not items:
            errors.append(f"{category_location} has no skills.")
            continue

        for item_index, item in enumerate(items):
            item_location = f"{category_location} item[{item_index}]"
            skill_id = item.get("id")
            skill_slug = item.get("slug")

            if not isinstance(skill_id, str) or not SKILL_ID_PATTERN.fullmatch(skill_id):
                errors.append(f"{item_location} has an invalid skill id.")
            elif skill_id in skill_ids:
                errors.append(f"{item_location} duplicates skill id {skill_id}.")
            else:
                skill_ids.add(skill_id)

            if not isinstance(skill_slug, str) or not is_valid_slug(skill_slug):
                errors.append(f"{item_location} has an invalid skill slug.")
            elif skill_slug in skill_slugs:
                errors.append(f"{item_location} duplicates skill slug {skill_slug}.")
            else:
                skill_slugs.add(skill_slug)

            icon = item.get("icon")
            if not isinstance(icon, dict):
                errors.append(f"{item_location} is missing icon.")
            else:
                icon_src = icon.get("src")
                icon_key = icon.get("key")
                if not icon_src and not icon_key:
                    errors.append(f"{item_location} needs icon.src or icon.key.")
                if icon_src:
                    if not isinstance(icon_src, str):
                        errors.append(f"{item_location} has an invalid icon.src.")
                    elif not is_http_url(icon_src):
                        local_icon = public_reference_to_path(icon_src)
                        if local_icon is None or not local_icon.exists():
                            errors.append(f"{item_location} references missing icon asset {icon_src}.")

                alt = icon.get("alt")
                if not isinstance(alt, dict):
                    errors.append(f"{item_location} is missing icon.alt.")
                else:
                    for language in VALID_LANGUAGES:
                        value = alt.get(language)
                        if not isinstance(value, str) or not value.strip():
                            errors.append(f"{item_location} is missing icon.alt.{language}.")

            content = item.get("content")
            if not isinstance(content, dict):
                errors.append(f"{item_location} is missing content.")
            else:
                for field in ("label", "description"):
                    localized = content.get(field)
                    if not isinstance(localized, dict):
                        errors.append(f"{item_location} is missing content.{field}.")
                        continue
                    for language in VALID_LANGUAGES:
                        value = localized.get(language)
                        if not isinstance(value, str) or not value.strip():
                            errors.append(f"{item_location} is missing content.{field}.{language}.")

            validate_string_list(
                value=item.get("tags"),
                location=f"{item_location} tags",
                errors=errors,
            )

            if contains_placeholder(str(item)):
                errors.append(f"{item_location} still contains TODO-style placeholders.")

    return errors, warnings


def validate_posts(series_slugs: set[str]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    posts_by_slug: dict[str, set[str]] = {}
    seen_slug_language: set[tuple[str, str]] = set()
    allowed_keys = {"slug", "seriesSlug", "lang", "title", "summary", "date", "tags", "cover", "featured"}
    required_keys = {"slug", "lang", "title", "summary", "date", "tags", "cover", "featured"}

    for path in sorted(POSTS_DIR.glob("*.md")):
        filename_match = MARKDOWN_FILENAME_PATTERN.fullmatch(path.name)
        if not filename_match:
            errors.append(
                f"{relative_path(path)} must follow the <slug>.<lang>.md naming pattern."
            )
            continue

        file_slug = filename_match.group("slug")
        file_language = filename_match.group("lang")
        location = relative_path(path)

        try:
            document = extract_markdown_document(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue

        keys = set(frontmatter_keys(document.frontmatter))
        missing_keys = sorted(required_keys - keys)
        unexpected_keys = sorted(keys - allowed_keys)

        if missing_keys:
            errors.append(f"{location} is missing frontmatter keys: {', '.join(missing_keys)}.")
        if unexpected_keys:
            errors.append(
                f"{location} has unsupported frontmatter keys: {', '.join(unexpected_keys)}."
            )

        slug = frontmatter_scalar(document.frontmatter, "slug")
        language = frontmatter_scalar(document.frontmatter, "lang")
        title = frontmatter_scalar(document.frontmatter, "title")
        summary = frontmatter_scalar(document.frontmatter, "summary")
        date_value = frontmatter_scalar(document.frontmatter, "date")
        cover = frontmatter_scalar(document.frontmatter, "cover")
        tags = frontmatter_list(document.frontmatter, "tags")
        featured = frontmatter_boolean(document.frontmatter, "featured")
        series_slug = frontmatter_scalar(document.frontmatter, "seriesSlug")

        if slug != file_slug:
            errors.append(f"{location} slug frontmatter does not match the filename.")
        if language != file_language:
            errors.append(f"{location} lang frontmatter does not match the filename.")
        if slug and not is_valid_slug(slug):
            errors.append(f"{location} has an invalid slug.")
        if language not in VALID_LANGUAGES:
            errors.append(f"{location} has an invalid lang value.")
        if not title:
            errors.append(f"{location} is missing title.")
        if not summary:
            errors.append(f"{location} is missing summary.")
        elif count_words(summary) > BLOG_SUMMARY_WORD_LIMIT:
            errors.append(
                f"{location} summary exceeds {BLOG_SUMMARY_WORD_LIMIT} words."
            )
        if not date_value or not is_valid_iso_date(date_value):
            errors.append(f"{location} has an invalid date.")
        if not isinstance(tags, list) or not tags:
            errors.append(f"{location} must define at least one tag.")
        elif len(tags) != len(set(tags)):
            errors.append(f"{location} contains duplicate tags.")
        if not cover:
            errors.append(f"{location} is missing cover.")
        else:
            cover_path = public_reference_to_path(cover)
            if cover_path is not None and not cover_path.exists():
                errors.append(f"{location} references missing cover asset {cover}.")
        if featured is None:
            errors.append(f"{location} must set featured to true or false.")
        if series_slug and series_slug not in series_slugs:
            errors.append(f"{location} references unknown series slug {series_slug}.")

        heading_levels = extract_markdown_headings(document.body)
        if not any(level == 1 for level, _ in heading_levels):
            errors.append(f"{location} must contain at least one H1 heading.")

        if contains_placeholder(document.frontmatter) or contains_placeholder(document.body):
            errors.append(f"{location} still contains TODO-style placeholders.")

        slug_language = (file_slug, file_language)
        if slug_language in seen_slug_language:
            errors.append(f"{location} duplicates the {file_slug}.{file_language} post variant.")
        else:
            seen_slug_language.add(slug_language)

        posts_by_slug.setdefault(file_slug, set()).add(file_language)

    for slug, languages in sorted(posts_by_slug.items()):
        if languages != set(VALID_LANGUAGES):
            warnings.append(
                f"src/content/posts/{slug}.<lang>.md is not fully bilingual yet "
                f"(found: {', '.join(sorted(languages))})."
            )

    return errors, warnings


def validate_project_windows(expected_window_slugs: dict[str, str]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    files_by_slug: dict[str, set[str]] = {}
    allowed_keys = {"slug", "lang", "title", "summary"}
    required_keys = {"slug", "lang", "title", "summary"}

    for path in sorted(PROJECT_WINDOWS_DIR.glob("*.md")):
        filename_match = MARKDOWN_FILENAME_PATTERN.fullmatch(path.name)
        if not filename_match:
            errors.append(
                f"{relative_path(path)} must follow the <slug>.<lang>.md naming pattern."
            )
            continue

        file_slug = filename_match.group("slug")
        file_language = filename_match.group("lang")
        location = relative_path(path)

        try:
            document = extract_markdown_document(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue

        keys = set(frontmatter_keys(document.frontmatter))
        missing_keys = sorted(required_keys - keys)
        unexpected_keys = sorted(keys - allowed_keys)

        if missing_keys:
            errors.append(f"{location} is missing frontmatter keys: {', '.join(missing_keys)}.")
        if unexpected_keys:
            errors.append(
                f"{location} has unsupported frontmatter keys: {', '.join(unexpected_keys)}."
            )

        slug = frontmatter_scalar(document.frontmatter, "slug")
        language = frontmatter_scalar(document.frontmatter, "lang")
        title = frontmatter_scalar(document.frontmatter, "title")
        summary = frontmatter_scalar(document.frontmatter, "summary")

        if slug != file_slug:
            errors.append(f"{location} slug frontmatter does not match the filename.")
        if language != file_language:
            errors.append(f"{location} lang frontmatter does not match the filename.")
        if not title:
            errors.append(f"{location} is missing title.")
        if not summary:
            errors.append(f"{location} is missing summary.")
        elif count_words(summary) > PROJECT_WINDOW_SUMMARY_WORD_LIMIT:
            errors.append(
                f"{location} summary exceeds {PROJECT_WINDOW_SUMMARY_WORD_LIMIT} words."
            )

        headings = extract_markdown_headings(document.body)
        h1_headings = [text for level, text in headings if level == 1]
        if h1_headings != list(VALID_PROJECT_WINDOW_HEADINGS):
            errors.append(
                f"{location} must use H1 sections exactly in this order: "
                f"{', '.join(VALID_PROJECT_WINDOW_HEADINGS)}."
            )

        if any(text.lower() == "links" for _, text in headings):
            errors.append(f"{location} must not define a dedicated Links section.")

        if contains_placeholder(document.frontmatter) or contains_placeholder(document.body):
            errors.append(f"{location} still contains TODO-style placeholders.")

        files_by_slug.setdefault(file_slug, set()).add(file_language)

        if file_slug not in expected_window_slugs:
            errors.append(
                f"{location} is not referenced by any enabled project window in {relative_path(PROJECTS_PATH)}."
            )

    for content_slug, project_slug in sorted(expected_window_slugs.items()):
        languages = files_by_slug.get(content_slug, set())
        if languages != set(VALID_LANGUAGES):
            errors.append(
                f"Project window content '{content_slug}' for project '{project_slug}' "
                f"must exist in both en and fr."
            )

    return errors, warnings


def validate_string_list(*, value, location: str, errors: list[str]) -> list[str]:
    if not isinstance(value, list) or not value:
        errors.append(f"{location} must contain at least one value.")
        return []

    normalized: list[str] = []
    for item in value:
        if not isinstance(item, str) or not item.strip():
            errors.append(f"{location} contains an empty value.")
            continue
        normalized.append(item.strip())

    return normalized


def project_location(index: int, project: dict) -> str:
    project_id = project.get("id") or f"index {index}"
    project_slug = project.get("slug") or "unknown-slug"
    return f"{relative_path(PROJECTS_PATH)} {project_id} ({project_slug})"


def run_validation() -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    domain_colors = load_json(DOMAIN_COLORS_PATH)
    if not isinstance(domain_colors, dict):
        errors.append(f"{relative_path(DOMAIN_COLORS_PATH)} must contain a JSON object.")
        domain_colors = {}

    project_errors, project_warnings, expected_window_slugs = validate_projects(domain_colors)
    errors.extend(project_errors)
    warnings.extend(project_warnings)

    series_errors, series_warnings, series_slugs = validate_series()
    errors.extend(series_errors)
    warnings.extend(series_warnings)

    skill_errors, skill_warnings = validate_skills()
    errors.extend(skill_errors)
    warnings.extend(skill_warnings)

    post_errors, post_warnings = validate_posts(series_slugs)
    errors.extend(post_errors)
    warnings.extend(post_warnings)

    window_errors, window_warnings = validate_project_windows(expected_window_slugs)
    errors.extend(window_errors)
    warnings.extend(window_warnings)

    return errors, warnings


def main() -> int:
    try:
        errors, warnings = run_validation()
    except Exception as exc:  # pragma: no cover - defensive failure path
        print("Content validation crashed:")
        print(f"- {exc}")
        return 1

    if errors:
        print("Content validation failed:")
        for error in errors:
            print(f"- {error}")
        if warnings:
            print("Warnings:")
            for warning in warnings:
                print(f"- {warning}")
        return 1

    print("Content validation passed.")
    if warnings:
        print("Warnings:")
        for warning in warnings:
            print(f"- {warning}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
