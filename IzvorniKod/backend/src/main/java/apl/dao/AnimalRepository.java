package apl.dao;

import apl.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findByActionsId(Long actionId);                                        // al animals tracked in some action

    List<Animal> findBySpeciesNameAndActionsId(String speciesName, Long actionId);      // all animals of some species tracked in some action
    Optional<Animal> findByIdAndActionsId(Long id, Long actionId);                      // check if some animal is/was tracked in some action

    List<Animal> findByTasksId(Long taskId);

    List<Animal> findBySpeciesNameAndTasksId(String speciesName, Long taskId);
    Optional<Animal> findByIdAndTasksId(Long id, Long taskId);

}
