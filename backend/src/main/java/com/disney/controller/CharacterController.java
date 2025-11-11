package com.disney.controller;

import com.disney.dto.CharacterDataDTO;
import com.disney.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:4200")
public class CharacterController {
    
    @Autowired
    private CharacterService characterService;
    
    @GetMapping
    public ResponseEntity<List<CharacterDataDTO>> getAllCharacters() {
        return ResponseEntity.ok(characterService.getAllCharacters());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CharacterDataDTO> getCharacterById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(characterService.getCharacterById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<CharacterDataDTO> createCharacter(@RequestBody CharacterDataDTO dto) {
        return ResponseEntity.ok(characterService.createCharacter(dto));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<CharacterDataDTO> updateCharacter(@PathVariable Long id, @RequestBody CharacterDataDTO dto) {
        try {
            return ResponseEntity.ok(characterService.updateCharacter(id, dto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<?> deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id);
        return ResponseEntity.ok().build();
    }
}

