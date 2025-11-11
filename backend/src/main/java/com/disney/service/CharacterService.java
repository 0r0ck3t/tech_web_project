package com.disney.service;

import com.disney.dto.CharacterDataDTO;
import com.disney.model.DisneyCharacter;
import com.disney.repository.DisneyCharacterRepository;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CharacterService {
    
    @Autowired
    private DisneyCharacterRepository characterRepository;
    
    private final Gson gson = new Gson();
    
    public List<CharacterDataDTO> getAllCharacters() {
        List<DisneyCharacter> characters = characterRepository.findAll();
        List<CharacterDataDTO> result = new ArrayList<>();
        
        for (DisneyCharacter character : characters) {
            CharacterDataDTO dto = parseCharacterData(character);
            result.add(dto);
        }
        
        return result;
    }
    
    public CharacterDataDTO getCharacterById(Long id) {
        DisneyCharacter character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        return parseCharacterData(character);
    }
    
    public CharacterDataDTO updateCharacter(Long id, CharacterDataDTO dto) {
        DisneyCharacter character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", dto.getName());
        jsonObject.addProperty("url", dto.getUrl());
        jsonObject.addProperty("image", dto.getImage());
        jsonObject.add("films", gson.toJsonTree(dto.getFilms()));
        jsonObject.add("shortFilms", gson.toJsonTree(dto.getShortFilms()));
        jsonObject.add("tvShows", gson.toJsonTree(dto.getTvShows()));
        jsonObject.add("videoGames", gson.toJsonTree(dto.getVideoGames()));
        jsonObject.add("parkAttractions", gson.toJsonTree(dto.getParkAttractions()));
        jsonObject.add("allies", gson.toJsonTree(dto.getAllies()));
        jsonObject.add("enemies", gson.toJsonTree(dto.getEnemies()));
        
        character.setData(gson.toJson(jsonObject));
        DisneyCharacter updated = characterRepository.save(character);
        
        return parseCharacterData(updated);
    }
    
    public void deleteCharacter(Long id) {
        characterRepository.deleteById(id);
    }
    
    public CharacterDataDTO createCharacter(CharacterDataDTO dto) {
        DisneyCharacter character = new DisneyCharacter();
        
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", dto.getName());
        jsonObject.addProperty("url", dto.getUrl());
        jsonObject.addProperty("image", dto.getImage());
        jsonObject.add("films", gson.toJsonTree(dto.getFilms()));
        jsonObject.add("shortFilms", gson.toJsonTree(dto.getShortFilms()));
        jsonObject.add("tvShows", gson.toJsonTree(dto.getTvShows()));
        jsonObject.add("videoGames", gson.toJsonTree(dto.getVideoGames()));
        jsonObject.add("parkAttractions", gson.toJsonTree(dto.getParkAttractions()));
        jsonObject.add("allies", gson.toJsonTree(dto.getAllies()));
        jsonObject.add("enemies", gson.toJsonTree(dto.getEnemies()));
        
        character.setData(gson.toJson(jsonObject));
        DisneyCharacter saved = characterRepository.save(character);
        
        return parseCharacterData(saved);
    }
    
    private CharacterDataDTO parseCharacterData(DisneyCharacter character) {
        JsonObject jsonObject = gson.fromJson(character.getData(), JsonObject.class);
        
        CharacterDataDTO dto = new CharacterDataDTO();
        dto.setId(character.getId());
        dto.setName(jsonObject.get("name").getAsString());
        dto.setUrl(jsonObject.has("url") ? jsonObject.get("url").getAsString() : "");
        dto.setImage(jsonObject.has("image") ? jsonObject.get("image").getAsString() : "");
        dto.setFilms(gson.fromJson(jsonObject.get("films"), List.class));
        dto.setShortFilms(gson.fromJson(jsonObject.get("shortFilms"), List.class));
        dto.setTvShows(gson.fromJson(jsonObject.get("tvShows"), List.class));
        dto.setVideoGames(gson.fromJson(jsonObject.get("videoGames"), List.class));
        dto.setParkAttractions(gson.fromJson(jsonObject.get("parkAttractions"), List.class));
        dto.setAllies(gson.fromJson(jsonObject.get("allies"), List.class));
        dto.setEnemies(gson.fromJson(jsonObject.get("enemies"), List.class));
        
        return dto;
    }
}

