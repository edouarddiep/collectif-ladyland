#!/bin/bash

# Définir des couleurs pour un meilleur affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Création du README.md pour votre projet Angular...${NC}"

# Définir le chemin du README.md
README_FILE="README.md"

# Créer ou vider le fichier README.md
> "$README_FILE"

# Fonction pour obtenir la version d'Angular
get_angular_version() {
  local version=$(grep '"@angular/core"' package.json | sed 's/.*: "\^\?\([0-9]\+\.[0-9]\+\.[0-9]\+\).*/\1/')
  echo "$version"
}

# Fonction pour obtenir le nom du projet
get_project_name() {
  local name=$(grep '"name":' package.json | head -1 | sed 's/.*: "\(.*\)".*/\1/')
  echo "$name"
}

# Fonction pour compter les fichiers par extension
count_files_by_extension() {
  local extension=$1
  find src -name "*.$extension" -type f | wc -l
}

# Fonction pour lister les routes de l'application
extract_routes() {
  echo "## Routes de l'application"
  echo ""
  echo "Voici les principales routes de l'application :"
  echo ""
  echo "| Route | Description | Composant |"
  echo "| --- | --- | --- |"

  if [ -f "src/app/app.routes.ts" ]; then
    grep -A 2 "path:" src/app/app.routes.ts | grep -v "^\s*--" | sed 's/.*path: \(.*\),/\1/' |
    while read -r line; do
      # Extraire le chemin
      path=$(echo "$line" | sed "s/[\"']//g" | sed 's/,.*$//')

      # Chercher le composant correspondant (2 lignes après, ou dans la même ligne pour les routes simples)
      component=$(grep -A 2 "path: [\"']$path[\"']" src/app/app.routes.ts | grep -o "component:.*" | head -1 | sed 's/component: \(.*\))/\1/' | sed 's/,.*$//')

      # Si aucun composant n'est trouvé, vérifier le loadComponent
      if [ -z "$component" ]; then
        component=$(grep -A 2 "path: [\"']$path[\"']" src/app/app.routes.ts | grep -o "loadComponent:.*" | head -1 | sed "s/loadComponent: () => import('\(.*\)').*/\1/")
      fi

      # Description (pour l'instant, on utilise le titre s'il est défini)
      description=$(grep -A 3 "path: [\"']$path[\"']" src/app/app.routes.ts | grep -o "title:.*" | head -1 | sed "s/title: [\"']\(.*\)[\"'],/\1/")

      # Si la description est vide, utiliser une valeur par défaut
      if [ -z "$description" ]; then
        description="Route $path"
      fi

      echo "| \`$path\` | $description | $component |"
    done
  else
    echo "Fichier de routes non trouvé."
  fi

  echo ""
}

# Fonction pour lister les composants
list_components() {
  echo "## Composants"
  echo ""
  echo "| Nom | Type | Chemin |"
  echo "| --- | --- | --- |"

  # Trouver tous les fichiers de composants
  find src -name "*.component.ts" -type f | sort | while read -r component_file; do
    # Obtenir le nom du composant
    component_name=$(grep -o "selector:.*" "$component_file" | head -1 | sed "s/selector: [\"']\(.*\)[\"'],/\1/")

    # Si le sélecteur n'est pas trouvé, utiliser le nom du fichier
    if [ -z "$component_name" ]; then
      component_name=$(basename "$component_file" .component.ts)
    fi

    # Déterminer le type (page ou composant)
    if [[ "$component_file" == *"/pages/"* ]]; then
      component_type="Page"
    else
      component_type="Composant"
    fi

    echo "| $component_name | $component_type | $component_file |"
  done

  echo ""
}

# Fonction pour lister les services
list_services() {
  echo "## Services"
  echo ""
  echo "| Nom | Chemin |"
  echo "| --- | --- |"

  # Trouver tous les fichiers de services
  find src -name "*.service.ts" -type f | sort | while read -r service_file; do
    # Obtenir le nom du service
    service_name=$(basename "$service_file" .service.ts)
    service_name=$(echo "$service_name" | sed -r 's/(^|-)([a-z])/\U\2/g')Service

    echo "| $service_name | $service_file |"
  done

  echo ""
}

# Fonction pour lister les modèles/interfaces
list_models() {
  echo "## Modèles"
  echo ""
  echo "| Nom | Type | Chemin |"
  echo "| --- | --- | --- |"

  # Trouver tous les fichiers de modèles
  find src -name "*.model.ts" -type f | sort | while read -r model_file; do
    # Lister toutes les interfaces/classes dans le fichier
    grep -E "^export (interface|class|enum)" "$model_file" | while read -r model_line; do
      model_name=$(echo "$model_line" | sed 's/export \(interface\|class\|enum\) \([^ {]*\).*/\2/')
      model_type=$(echo "$model_line" | sed 's/export \(interface\|class\|enum\).*/\1/')

      echo "| $model_name | $model_type | $model_file |"
    done
  done

  # Chercher aussi les enums
  find src -name "*.enum.ts" -type f | sort | while read -r enum_file; do
    # Obtenir le nom de l'enum
    enum_name=$(grep -o "export enum .*" "$enum_file" | sed 's/export enum \([^ {]*\).*/\1/')

    echo "| $enum_name | enum | $enum_file |"
  done

  echo ""
}

# Écrire l'en-tête du README
project_name=$(get_project_name)
angular_version=$(get_angular_version)

cat > "$README_FILE" << EOF
# $project_name

## À propos du projet

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version $angular_version.

## Structure du projet

\`\`\`
src/
├── app/               # Composants principaux et configuration
├── assets/            # Images, polices et autres ressources statiques
├── environments/      # Configurations d'environnement
└── styles/            # Styles globaux
\`\`\`

## Statistiques du projet

- **Composants**: $(count_files_by_extension "component.ts")
- **Services**: $(count_files_by_extension "service.ts")
- **Modèles/Interfaces**: $(count_files_by_extension "model.ts")
- **Tests**: $(count_files_by_extension "spec.ts")
- **Pages**: $(find src -path "*/pages/*" -name "*.component.ts" | wc -l)

EOF

# Ajouter les sections au README
extract_routes >> "$README_FILE"
list_components >> "$README_FILE"
list_services >> "$README_FILE"
list_models >> "$README_FILE"

# Ajouter des instructions pour exécuter le projet
cat >> "$README_FILE" << EOF
## Installation

\`\`\`bash
npm install
\`\`\`

## Développement

Pour démarrer le serveur de développement :

\`\`\`bash
ng serve
\`\`\`

Naviguez vers \`http://localhost:4200/\`. L'application se rechargera automatiquement si vous modifiez l'un des fichiers source.

## Build

Pour construire le projet :

\`\`\`bash
ng build
\`\`\`

Les artefacts de construction seront stockés dans le répertoire \`dist/\`.

## Tests

Pour exécuter les tests unitaires :

\`\`\`bash
ng test
\`\`\`

## Aide supplémentaire

Pour obtenir plus d'aide sur Angular CLI, utilisez \`ng help\` ou consultez [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
EOF

echo -e "${GREEN}Le fichier README.md a été créé avec succès !${NC}"
echo -e "${BLUE}Vous pouvez maintenant le consulter et le modifier selon vos besoins.${NC}"
