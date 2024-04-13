// ChampionList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChampionList = ({ champions, patchVersion }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate(); // Użyj useNavigate zamiast useHistory

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredChampions = champions.filter(champion => {
    const tagMatch = !selectedTag || champion.tags.includes(selectedTag);
    const nameMatch = champion.name.toLowerCase().includes(searchText.toLowerCase());
    return tagMatch && nameMatch;
  });

  const handleChampionClick = (championName) => {
    // Przekazanie patchVersion jako props przy nawigacji
    navigate(`/champion/${championName}`, { state: { patchVersion } });
  };

  return (
    <div className="champion-list">
      <div className="filter-buttons">
        <button onClick={() => handleTagSelect(null)}>All</button>
        {['Fighter', 'Tank', 'Mage', 'Assassin', 'Support', 'Marksman'].map(tag => (
          <button key={tag} onClick={() => handleTagSelect(tag)}>{tag}</button>
        ))}
      </div>
      <div className="search-box">
        <input type="text" placeholder="Search..." value={searchText} onChange={handleSearchTextChange} />
      </div>
      <div className='champion-grid'>
        {filteredChampions.map(champion => (
          <div key={champion.name} className="champion-item-wrapper" style={{ backgroundImage: `url(${champion.image})` }} onClick={() => handleChampionClick(champion.name)}>
            <div className='champion-info-min'>
              <span className='championName'>{champion.name}</span>
              {champion.tags.length > 0 && (
                <span className='championTag'>{champion.tags[0]} {champion.tags[1]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChampionList;
