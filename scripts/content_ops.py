from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
PUBLIC_DIR = ROOT / "public"
PROJECTS_PATH = SRC_DIR / "data" / "projects.json"
SKILLS_PATH = SRC_DIR / "data" / "skills.json"
SERIES_PATH = SRC_DIR / "data" / "series.json"
DOMAIN_COLORS_PATH = SRC_DIR / "data" / "domain.json"
BLOG_RESOURCES_PATH = SRC_DIR / "data" / "blog-resources.json"
POSTS_DIR = SRC_DIR / "content" / "posts"
PROJECT_WINDOWS_DIR = SRC_DIR / "content" / "project-windows"

VALID_LANGUAGES = ("en", "fr")
VALID_PROJECT_STATUSES = ("completed", "in-progress", "archived")
VALID_TECHNICAL_LEVELS = (1, 2, 3)
VALID_WINDOW_ACCESS = ("public", "private")
VALID_PROJECT_WINDOW_HEADINGS = ("Overview", "Method", "Value")
ALLOWED_PROJECT_COVER_EXTENSIONS = ("png", "jpg", "jpeg", "webp")

PROJECT_SUMMARY_WORD_LIMIT = 50
BLOG_SUMMARY_WORD_LIMIT = 50
PROJECT_WINDOW_SUMMARY_WORD_LIMIT = 50

PLACEHOLDER_PATTERN = re.compile(
    r"\b(todo|tbd)\b|a completer|needs (?:domain|tool|keyword)",
    re.IGNORECASE,
)
SLUG_PATTERN = re.compile(r"^[a-z0-9-]+$")
PROJECT_ID_PATTERN = re.compile(r"^PJ(\d{3})$")
SKILL_ID_PATTERN = re.compile(r"^SK(\d{3})$")
MARKDOWN_FILENAME_PATTERN = re.compile(r"^(?P<slug>[a-z0-9-]+)\.(?P<lang>en|fr)\.md$")
FRONTMATTER_PATTERN = re.compile(r"\A---\n(.*?)\n---\n?", re.DOTALL)
WORD_PATTERN = re.compile(r"\b\S+\b")
FRONTMATTER_KEY_PATTERN = re.compile(r"(?m)^([A-Za-z][A-Za-z0-9_-]*):")
HEADING_PATTERN = re.compile(r"^(#{1,6})\s+(.+?)\s*$")


@dataclass(frozen=True)
class MarkdownDocument:
    path: Path
    frontmatter: str
    body: str


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, payload) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def today_iso() -> str:
    return date.today().isoformat()


def slugify(value: str) -> str:
    normalized = value.strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    normalized = normalized.strip("-")
    normalized = re.sub(r"-{2,}", "-", normalized)
    return normalized


def humanize_slug(slug: str) -> str:
    return " ".join(part.capitalize() for part in slug.split("-") if part)


def count_words(text: str) -> int:
    return len(WORD_PATTERN.findall(text))


def contains_placeholder(value: str) -> bool:
    return bool(PLACEHOLDER_PATTERN.search(value))


def is_valid_slug(value: str) -> bool:
    return bool(SLUG_PATTERN.fullmatch(value))


def is_valid_iso_date(value: str) -> bool:
    try:
        date.fromisoformat(value)
    except ValueError:
        return False
    return True


def is_http_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def relative_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def public_reference_to_path(reference: str) -> Path | None:
    if not reference or is_http_url(reference):
        return None
    normalized = reference.lstrip("/")
    return PUBLIC_DIR / Path(normalized)


def extract_markdown_document(path: Path) -> MarkdownDocument:
    raw = path.read_text(encoding="utf-8")
    match = FRONTMATTER_PATTERN.match(raw)

    if not match:
        raise ValueError(f"{relative_path(path)} is missing YAML frontmatter.")

    frontmatter = match.group(1)
    body = raw[match.end() :].lstrip("\n")
    return MarkdownDocument(path=path, frontmatter=frontmatter, body=body)


def frontmatter_scalar(frontmatter: str, key: str) -> str | None:
    match = re.search(rf"(?m)^{re.escape(key)}:\s*(.+?)\s*$", frontmatter)

    if not match:
        return None

    value = match.group(1).strip()

    if not value:
        return ""

    if value in {">", "|"}:
        return None

    return strip_yaml_quotes(value)


def frontmatter_list(frontmatter: str, key: str) -> list[str] | None:
    match = re.search(rf"(?m)^{re.escape(key)}:\s*(.*?)\s*$", frontmatter)

    if not match:
        return None

    inline_value = match.group(1).strip()

    if inline_value == "[]":
        return []

    if inline_value.startswith("[") and inline_value.endswith("]"):
        inner = inline_value[1:-1].strip()
        if not inner:
            return []
        return [strip_yaml_quotes(part.strip()) for part in inner.split(",")]

    items: list[str] = []
    trailing = frontmatter[match.end() :].splitlines()

    for line in trailing:
        if not line.strip():
            continue

        item_match = re.match(r"^\s*-\s*(.+?)\s*$", line)
        if item_match:
            items.append(strip_yaml_quotes(item_match.group(1).strip()))
            continue

        if line.startswith(" ") or line.startswith("\t"):
            continue

        break

    return items


def frontmatter_boolean(frontmatter: str, key: str) -> bool | None:
    value = frontmatter_scalar(frontmatter, key)

    if value is None:
        return None

    normalized = value.lower()
    if normalized == "true":
        return True
    if normalized == "false":
        return False

    return None


def frontmatter_keys(frontmatter: str) -> list[str]:
    return FRONTMATTER_KEY_PATTERN.findall(frontmatter)


def strip_yaml_quotes(value: str) -> str:
    trimmed = value.strip()
    if len(trimmed) >= 2 and trimmed[0] == trimmed[-1] and trimmed[0] in {'"', "'"}:
        return trimmed[1:-1]
    return trimmed


def render_yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def render_yaml_list(key: str, values: list[str]) -> str:
    if not values:
        return f"{key}: []"
    lines = [f"{key}:"]
    lines.extend(f"  - {render_yaml_string(value)}" for value in values)
    return "\n".join(lines)


def render_frontmatter(lines: list[str]) -> str:
    return "---\n" + "\n".join(lines) + "\n---\n"


def next_project_id(projects: list[dict]) -> str:
    highest = 0
    for project in projects:
        match = PROJECT_ID_PATTERN.fullmatch(str(project.get("id", "")))
        if match:
            highest = max(highest, int(match.group(1)))
    return f"PJ{highest + 1:03d}"


def project_window_heading_map(language: str) -> dict[str, list[str]]:
    if language == "fr":
        return {
            "overview": [
                "## Contexte et objectif",
                "TODO: expliquer le probleme, le perimetre et l'interet du projet.",
            ],
            "method": [
                "## Workflow",
                "TODO: decrire les donnees, les choix techniques, les contraintes et la methode.",
            ],
            "value": [
                "## Ce que le projet demontre",
                "TODO: expliquer la valeur portfolio, les competences et les resultats.",
            ],
        }

    return {
        "overview": [
            "## Context and objective",
            "TODO: explain the problem, scope, and why the project matters.",
        ],
        "method": [
            "## Workflow",
            "TODO: describe the data, technical choices, constraints, and method.",
        ],
        "value": [
            "## What the project demonstrates",
            "TODO: explain the portfolio value, skills, and outputs.",
        ],
    }


def build_project_window_markdown(
    *,
    slug: str,
    language: str,
    title: str,
    summary: str,
) -> str:
    content = project_window_heading_map(language)
    lines = [
        f"slug: {render_yaml_string(slug)}",
        f"lang: {render_yaml_string(language)}",
        f"title: {render_yaml_string(title)}",
        f"summary: {render_yaml_string(summary)}",
    ]
    body_lines = [
        "",
        "# Overview",
        "",
        *content["overview"],
        "",
        "# Method",
        "",
        *content["method"],
        "",
        "# Value",
        "",
        *content["value"],
        "",
    ]
    return render_frontmatter(lines) + "\n".join(body_lines)


def blog_post_heading_map(language: str) -> list[str]:
    if language == "fr":
        return [
            "# Introduction",
            "",
            "TODO: poser le sujet, l'objectif de l'article, et le contexte utile.",
            "",
            "## Idee cle",
            "",
            "TODO: expliquer l'idee centrale de facon concrete.",
            "",
            "## Exemple ou intuition",
            "",
            "TODO: ajouter un exemple, une analogie, ou un mini workflow.",
            "",
            "## Pourquoi c'est utile",
            "",
            "TODO: relier l'article a une utilisation pratique ou a la suite de la serie.",
            "",
        ]

    return [
        "# Introduction",
        "",
        "TODO: introduce the topic, article objective, and useful context.",
        "",
        "## Key idea",
        "",
        "TODO: explain the core idea in a concrete way.",
        "",
        "## Example or intuition",
        "",
        "TODO: add an example, analogy, or compact workflow.",
        "",
        "## Why it matters",
        "",
        "TODO: connect the article to a practical use case or the rest of the series.",
        "",
    ]


def build_blog_post_markdown(
    *,
    slug: str,
    language: str,
    title: str,
    summary: str,
    date_value: str,
    tags: list[str],
    cover: str,
    featured: bool,
    series_slug: str | None,
) -> str:
    lines = [f"slug: {render_yaml_string(slug)}"]

    if series_slug:
        lines.append(f"seriesSlug: {render_yaml_string(series_slug)}")

    lines.extend(
        [
            f"lang: {render_yaml_string(language)}",
            f"title: {render_yaml_string(title)}",
            f"summary: {render_yaml_string(summary)}",
            f"date: {render_yaml_string(date_value)}",
            render_yaml_list("tags", tags),
            f"cover: {render_yaml_string(cover)}",
            f"featured: {'true' if featured else 'false'}",
        ]
    )

    return render_frontmatter(lines) + "\n".join(blog_post_heading_map(language))


def sort_projects_by_date(projects: list[dict]) -> list[dict]:
    return sorted(
        projects,
        key=lambda project: (
            str(project.get("date", "")),
            str(project.get("id", "")),
        ),
        reverse=True,
    )


def ensure_unique_path(path: Path, force: bool) -> None:
    if path.exists() and not force:
        raise FileExistsError(
            f"{relative_path(path)} already exists. Use --force to overwrite it."
        )


def extract_markdown_headings(body: str) -> list[tuple[int, str]]:
    headings: list[tuple[int, str]] = []
    is_inside_code_fence = False

    for raw_line in body.splitlines():
        stripped = raw_line.strip()

        if stripped.startswith("```"):
            is_inside_code_fence = not is_inside_code_fence
            continue

        if is_inside_code_fence:
            continue

        match = HEADING_PATTERN.match(stripped)
        if not match:
            continue

        text = match.group(2).replace("`", "").strip()
        if not text:
            continue

        headings.append((len(match.group(1)), text))

    return headings


def dedupe_preserve_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    unique_values: list[str] = []

    for value in values:
        if value in seen:
            continue
        seen.add(value)
        unique_values.append(value)

    return unique_values
