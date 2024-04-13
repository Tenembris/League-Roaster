import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const Champion = () => {
  const { name } = useParams();
  const location = useLocation();
  const patchVersion = location.state && location.state.patchVersion;

  const [championData, setChampionData] = useState(null);
  const [imageName, setImageName] = useState('');
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedSpellIndex, setSelectedSpellIndex] = useState(0);
  const [abilityVideoLink, setAbilityVideoLink] = useState('');

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        let imageName = name.replace(/\bWillump\b/g, '').replace(/[^\w\s]/g, '').replace(/\s/g, '');
        imageName = imageName.replace(/[ ']/g, '');

        const exceptions = {
          'KhaZix': 'Khazix',
          'BelVeth': 'Belveth',
          'ChoGath': 'Chogath',
          'Fiddlesticks': 'FiddleSticks',
          'KaiSa': 'Kaisa',
          'LeBlanc': 'Leblanc',
          'VelKoz': 'Velkoz',
          'RenataGlasc': 'Renata',
          'Wukong': 'MonkeyKing'
        };

        imageName = exceptions[imageName] || imageName;
        setImageName(imageName);
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/en_US/champion/${imageName}.json`);

        setChampionData(response.data.data[imageName]);
        setSelectedSpell(response.data.data[imageName].spells[0]);
        setAbilityVideoLink(generateAbilityVideoLink(response.data.data[imageName].key, 0));
      } catch (error) {
        console.error('Błąd podczas pobierania danych bohatera:', error);
      }
    };

    if (patchVersion && name) {
      fetchChampionData();
    }
  }, [name, patchVersion]);

  const generateAbilityVideoLink = (championId, spellIndex) => {
    const formattedChampionId = championId.toString().padStart(4, '0');
    let spellName;
    switch (spellIndex) {
      case 0:
        spellName = 'Q';
        break;
      case 1:
        spellName = 'W';
        break;
      case 2:
        spellName = 'E';
        break;
      case 3:
        spellName = 'R';
        break;
      default:
        spellName = 'passive';
    }
    return `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${formattedChampionId}/ability_${formattedChampionId}_${spellName}1.webm`;
  };

  const handleSpellClick = (spell, index) => {
    setSelectedSpell(spell);
    setSelectedSpellIndex(index);
    setAbilityVideoLink(generateAbilityVideoLink(championData.key, index));
  };

  const handleImageClick = () => {
    setAbilityVideoLink(generateAbilityVideoLink(championData.key, selectedSpellIndex));
  };

  if (!championData) {
    return <div>Loading...</div>;
  }

  const splashArtName = `${imageName}_0.jpg`;

  return (
    <div className='component-parent-container'>
      <div className='component-parent-container'>
        <div className='Champion-section-Hero' style={{ backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${splashArtName})` }}>
          <h1>{championData.name}</h1>
          <h2>{championData.title}</h2>
        </div>
      </div>

      <div className='padding'>
        <div className='champion-information'>
<div className='stats-box'>
  <h4>
    <span className='golden-span'>
    Role
    </span>
  </h4>
<h3>
  {championData.tags[0]}
  {championData.tags[1] && ` • ${championData.tags[1]}`}
</h3>
</div>
          <div>
            <ul>
              <li> <img src="../assets/statmodshealthscalingicon.png" alt="" /> Health: {championData.stats.hp}</li>
              <li>Health per Level: {championData.stats.hpperlevel}</li>
              <li>Magic Resist: {championData.stats.spellblock}</li>
              <li>Magic Resist per level: {championData.stats.spellblockperlevel}</li>
              <li>hpregen: {championData.stats.hpregen}</li>
              <li>hpregenperlevel: {championData.stats.hpregenperlevel}</li>
            </ul>
            <ul>
              <li>movespeed: {championData.stats.movespeed}</li>
              <li>attackrange: {championData.stats.attackrange}</li>
              <li>attackdamage: {championData.stats.attackdamage}</li>
              <li>attackdamageperlevel: {championData.stats.attackdamageperlevel}</li>
              <li>attackspeed: {championData.stats.attackspeed}</li>
              <li>attackspeedperlevel: {championData.stats.attackspeedperlevel}</li>
            </ul>
          </div>
        </div>

        <p className='champion-lore'>{championData.lore}</p>

        <h2>
            SKills
          </h2>
<div className='info-video-container'>

  
{selectedSpell && (
          <div className="selected-spell-info">
            <h2>{selectedSpell.name}</h2>
            <p>Description: {selectedSpell.description}</p>
            <p>Cost: {selectedSpell.costBurn || selectedSpell.costBurn === 0 ? selectedSpell.costBurn : 'No cost'}</p>
            <p>Cooldown: {selectedSpell.cooldownBurn || selectedSpell.cooldownBurn === 0 ? selectedSpell.cooldownBurn : '0'}</p>
          </div>
        )}

<div className="additional-ability-videos">
          {abilityVideoLink && (
            <video key={selectedSpell.id}  autoPlay={true} loop={true} muted controls={false}>
              <source src={abilityVideoLink} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
</div>

        <div className='champion-skills'>
        
          <div className='skills-container'>
            {championData.spells.map((spell, index) => (
              <div key={index} className='spell' onClick={() => handleSpellClick(spell, index)}>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${spell.image.full}`}
                  alt={spell.name}
                />
                <div className='spell-details'>
                  
                </div>
              </div>
            ))}
            <div className='spell' onClick={() => handleSpellClick(championData.passive, 4)}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/passive/${championData.passive.image.full}`}
                alt={championData.passive.name}
                onClick={handleImageClick} // Dodane obsługi zdarzenia kliknięcia na obrazek
              />
              <div className='spell-details'>
                
              </div>
            </div>
          </div>
        </div>

        <div className='champion-tips'>
          <h3>Ally Tips:</h3>
          <ul>
            {championData.allytips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
          <h3>Enemy Tips:</h3>
          <ul>
            {championData.enemytips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>


      </div>
    </div>
  );
}

export default Champion;
