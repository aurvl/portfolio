import json
from pathlib import Path
from loguru import logger

def fill_and_append_json(lang='en'):
    data_dir = Path(__file__).resolve().parent
    filename = 'projects.json' if lang == 'en' else 'projects_fr.json'
    file_path = data_dir / filename

    # Charger les projets existants (s'il existe déjà un fichier)
    if file_path.exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            projects = json.load(f)
    else:
        projects = []

    # Collecter les infos du nouveau projet
    logger.info(f"Adding new project to {file_path}")
    project = {}

    pic_input = input("Picture filename (e.g., project1.jpg) or path (e.g., assets/img/project1.jpg): ").strip()
    if not pic_input:
        raise ValueError("Picture filename/path cannot be empty")
    if pic_input.startswith("assets/") or "/" in pic_input or "\\" in pic_input:
        # Keep user-provided relative path
        project['pic'] = pic_input.replace("\\", "/")
    else:
        project['pic'] = "assets/img/" + pic_input

    project['n'] = input("Project number: ")
    project['link1'] = input("Project link: ")
    project['link2'] = input("Repo link: ")
    project['title'] = input("Project title: ")
    project['monh'] = input("Month (e.g., Jan): ")
    project['year'] = input("Year (e.g., 2024): ")
    project['date'] = input("Date (yyyy-mm-dd): ")
    project['tools'] = [input(f"Tool {i+1}: ") for i in range(4)]
    project['description'] = input("Project description: ")

    # Ajouter au début
    projects.insert(0, project)

    # Sauvegarder
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4, ensure_ascii=False)

    logger.success(f"Project added successfully to {file_path}!")

# Usage
lang_choice = input("Which language? (en/fr): ").strip().lower()
if lang_choice not in {"en", "fr"}:
    raise ValueError("Invalid language. Please choose 'en' or 'fr'.")
fill_and_append_json(lang_choice)