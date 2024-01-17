package apl.dao;

import apl.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {

    List<Species> findByAnimalsActionsId(Long ActionId);

    Optional<Species> findByName(String name);
}
