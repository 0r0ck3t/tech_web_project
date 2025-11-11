package com.disney.dto;

import lombok.Data;
import java.util.List;

@Data
public class CharacterDataDTO {
    private Long id;
    private String name;
    private String url;
    private String image;
    private List<String> films;
    private List<String> shortFilms;
    private List<String> tvShows;
    private List<String> videoGames;
    private List<String> parkAttractions;
    private List<String> allies;
    private List<String> enemies;
}

