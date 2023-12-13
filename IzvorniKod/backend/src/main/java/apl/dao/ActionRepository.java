package apl.dao;

import apl.domain.Action;
import apl.domain.Manager;
import apl.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {
    int countByResearcherId(Long id);

    @Transactional
    @Query("SELECT m FROM Manager m WHERE m.approved = true")
    List<Manager> listAllManagers();
}
