import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setAppliedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [query]);

  const visiblePeople = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsFocused(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.length > 0 ? (
                visiblePeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => handleSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  No matching suggestions
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
