from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECTS_PATH = ROOT / "src" / "data" / "projects.json"
SKILLS_PATH = ROOT / "src" / "data" / "skills.json"
SUMMARY_LIMIT = 50


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def count_words(text: str) -> int:
    return len(re.findall(r"\b\S+\b", text))


def validate_projects() -> list[str]:
    projects = load_json(PROJECTS_PATH)
    errors: list[str] = []
    featured_count = 0
    ids: set[str] = set()
    slugs: set[str] = set()

    for project in projects:
        project_id = project["id"]

        if project_id in ids:
            errors.append(f"Duplicate project id: {project_id}")
        ids.add(project_id)

        if project["slug"] in slugs:
            errors.append(f"Duplicate project slug: {project['slug']}")
        slugs.add(project["slug"])

        if project["featured"]:
            featured_count += 1

        for language in ("en", "fr"):
            summary = project["content"][language]["summary"]
            if count_words(summary) > SUMMARY_LIMIT:
                errors.append(
                    f"{project_id} summary exceeds {SUMMARY_LIMIT} words for language {language}."
                )

        if project["featured"] and (
            not project["links"]["primary"]
            or not project["links"]["readMore"]
            or not project["cover"]["src"]
        ):
            errors.append(
                f"{project_id} is featured but missing primary/readMore/cover requirements."
            )

    if featured_count > 1:
        errors.append("More than one project is marked as featured.")

    return errors


def validate_skills() -> list[str]:
    catalog = load_json(SKILLS_PATH)
    errors: list[str] = []
    category_ids: set[str] = set()
    skill_ids: set[str] = set()
    skill_slugs: set[str] = set()

    for category in catalog["categories"]:
        category_id = category["id"]
        if category_id in category_ids:
            errors.append(f"Duplicate skill category id: {category_id}")
        category_ids.add(category_id)

        if not category["items"]:
            errors.append(f"Category {category_id} has no skills.")

        for item in category["items"]:
            if item["id"] in skill_ids:
                errors.append(f"Duplicate skill id: {item['id']}")
            skill_ids.add(item["id"])

            if item["slug"] in skill_slugs:
                errors.append(f"Duplicate skill slug: {item['slug']}")
            skill_slugs.add(item["slug"])

    return errors


def main() -> int:
    errors = [*validate_projects(), *validate_skills()]

    if errors:
        print("Content validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Content validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
