package apl.dao;

import apl.domain.*;
import apl.enums.ActionStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {

    @Transactional
    @Query("SELECT m FROM Manager m WHERE m.approved = true")
    List<Manager> listAllManagers();

    int countByResearcher(Researcher researcher);

    @Transactional
    @Query("SELECT a FROM Action a")
    List<Action> listAllActions();

    List<Action> findByManagerUsername(String username);
    List<Action> findByManagerId(Long managerId);

    List<Action> findByResearcherId(Long researcherId);

    List<Action> findByStatus(ActionStatus status);

    List<Action> findByManagerIdAndStatus(Long managerId, ActionStatus status);

    List<Action> findByResearcherIdAndStatus(Long researcherId, ActionStatus status);

    List<Action> findByResearcherIdAndManagerIdAndStatus(Long researcherId, Long managerId, ActionStatus status);

}
