package apl.dao;

import apl.domain.*;
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
}
