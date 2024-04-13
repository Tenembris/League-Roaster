import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChampionList from './ChampionList';

const Champions = () => {
  const [currentPatch, setCurrentPatch] = useState(null);
  const [champions, setChampions] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [imageCache, setImageCache] = useState({}); // Dodaj stan dla cache obrazków

  useEffect(() => {
    // Pobierz numer patcha z serwera
    fetch('http://localhost:3000/api/patch-version')
      .then(response => response.json())
      .then(data => {
        setCurrentPatch(data.patchVersion);

        axios.get(`https://ddragon.leagueoflegends.com/cdn/${data.patchVersion}/data/en_US/champion.json`)
          .then(response => {
            const championData = response.data.data;
            
            const champions = Object.keys(championData).map(championKey => {
              const imageName = getChampionImageName(championData[championKey].name);

              // Sprawdź, czy obrazek jest już w cache
              const cachedImage = imageCache[imageName];
              const imageUrl = cachedImage ? cachedImage : `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${imageName}_0.jpg`;

              // Zapisz obrazek do cache
              if (!cachedImage) {
                setImageCache(prevCache => ({
                  ...prevCache,
                  [imageName]: imageUrl
                }));
              }

              return {
                name: championData[championKey].name,
                image: imageUrl,
                tags: championData[championKey].tags
              };
            });
            
            setChampions(champions);
            
          })
          .catch(error => {
            console.error('Wystąpił błąd podczas pobierania danych o postaciach:', error);
          });
      })
      .catch(error => console.error('Wystąpił błąd podczas pobierania numeru patcha:', error));
  }, []); 

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const filteredChampions = selectedTag
    ? champions.filter(champion => champion.tags.includes(selectedTag))
    : champions;

  return (
    <>
      <div className='component-parent-container'>
        <h1>Main Page</h1>
        <h2>{currentPatch}</h2>

        <ChampionList champions={filteredChampions} patchVersion={currentPatch} />
        <div></div>
      </div>
    </>
  );
}

// Funkcja do przekształcania nazwy postaci na nazwę obrazka
const getChampionImageName = (championName) => {
  let imageName = championName.replace(/\bWillump\b/g, '').replace(/[^\w\s]/g, '').replace(/\s/g, '');
  imageName = imageName.replace(/[ ']/g, '');

  const exceptions = {
    'KhaZix' : 'Khazix',
    'BelVeth': 'Belveth',
    'ChoGath': 'Chogath',
    'Fiddlesticks': 'FiddleSticks',
    'KaiSa': 'Kaisa',
    'LeBlanc': 'Leblanc',
    'VelKoz': 'Velkoz',
    'RenataGlasc': 'Renata',
    'Wukong':'MonkeyKing'
  };

  return exceptions[imageName] || imageName;
};

export default Champions;
