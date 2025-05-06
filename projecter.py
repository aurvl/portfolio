import json
import os
from loguru import logger

def fill_and_append_json(lang='en'):
    filename = 'projects.json' if lang == 'en' else 'projects_fr.json'

    # Charger les projets existants (s'il existe déjà un fichier)
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            projects = json.load(f)
    else:
        projects = []

    # Collecter les infos du nouveau projet
    logger.info(f"Adding new project to {filename}")
    project = {}
    project['pic'] = input("Picture filename (e.g., project1.jpg): ")
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
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4, ensure_ascii=False)

    logger.success(f"Project added successfully to {filename}!")

# Usage
lang_choice = input("Which language? (en/fr): ").strip()
fill_and_append_json(lang_choice)