package com.disney.repository;

import com.disney.model.DisneyCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisneyCharacterRepository extends JpaRepository<DisneyCharacter, Long> {
}

