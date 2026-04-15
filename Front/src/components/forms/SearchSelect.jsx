import { useEffect, useMemo, useRef, useState } from 'react'

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function SearchSelect({
  label,
  placeholder,
  value,
  onChange,
  options = [],
  error,
  helpText,
  specialOption,
}) {
  const containerRef = useRef(null)
  const inputId = useMemo(() => `search-select-${Math.random().toString(36).slice(2, 10)}`, [])
  const [isOpen, setIsOpen] = useState(false)

  const filteredOptions = useMemo(() => {
    const query = normalizeText(value)

    if (!query) {
      return options
    }

    return options.filter((option) => normalizeText(option).includes(query))
  }, [options, value])

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function selectValue(nextValue) {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div className="search-select" ref={containerRef}>
      <label className="form-label fw-semibold" htmlFor={inputId}>
        {label}
      </label>
      <div className="search-select-shell">
        <input
          id={inputId}
          className="form-control search-select-input"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-list`}
        />

        {isOpen ? (
          <div className="search-select-dropdown" id={`${inputId}-list`} role="listbox">
            <div className="search-select-summary">
              <span>{filteredOptions.length} resultat{filteredOptions.length > 1 ? 's' : ''}</span>
              {helpText ? <span>{helpText}</span> : null}
            </div>

            <div className="search-select-options">
              {filteredOptions.length ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`search-select-option ${option === value ? 'is-active' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectValue(option)}
                  >
                    <span>{option}</span>
                    {option === value ? <span className="search-select-option-check">Choisi</span> : null}
                  </button>
                ))
              ) : (
                <div className="search-select-empty">Aucun resultat ne correspond.</div>
              )}
            </div>

            {specialOption ? (
              <>
                <div className="search-select-divider" />
                <button
                  type="button"
                  className={`search-select-option search-select-option--special ${specialOption.value === value ? 'is-active' : ''}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectValue(specialOption.value)}
                >
                  <span>{specialOption.label}</span>
                  <span className="search-select-option-check">Option manuelle</span>
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
      {error ? <div className="form-text text-danger">{error}</div> : null}
    </div>
  )
}