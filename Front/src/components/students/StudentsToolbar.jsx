export default function StudentsToolbar({
  filters,
  availableSkills,
  availableTechnologies,
  onFilterChange,
  onReset,
  onCreate,
}) {
  return (
    <section className="panel toolbarPanel">
      <div className="toolbarHeader">
        <div>
          <span className="eyebrow">Recherche intelligente</span>
          <h2>Explorez les profils etudiants</h2>
        </div>
        <div className="toolbarActions">
          <button type="button" className="ghostButton" onClick={onReset}>
            Reinitialiser
          </button>
          <button type="button" className="primaryButton" onClick={onCreate}>
            Ajouter un etudiant
          </button>
        </div>
      </div>

      <div className="toolbarGrid">
        <label>
          Recherche
          <input
            value={filters.query}
            onChange={(event) => onFilterChange('query', event.target.value)}
            placeholder="Prenom, nom ou localisation"
          />
        </label>

        <label>
          Niveau
          <select
            value={filters.skillLevel}
            onChange={(event) => onFilterChange('skillLevel', event.target.value)}
          >
            <option value="all">Tous</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label>
          Competence
          <select
            value={filters.skillName}
            onChange={(event) => onFilterChange('skillName', event.target.value)}
          >
            <option value="all">Toutes</option>
            {availableSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </label>

        <label>
          Technologie projet
          <select
            value={filters.technology}
            onChange={(event) => onFilterChange('technology', event.target.value)}
          >
            <option value="all">Toutes</option>
            {availableTechnologies.map((technology) => (
              <option key={technology} value={technology}>
                {technology}
              </option>
            ))}
          </select>
        </label>

        <label>
          Trier par
          <select
            value={filters.sortBy}
            onChange={(event) => onFilterChange('sortBy', event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="name">Nom</option>
            <option value="location">Localisation</option>
          </select>
        </label>
      </div>
    </section>
  )
}
