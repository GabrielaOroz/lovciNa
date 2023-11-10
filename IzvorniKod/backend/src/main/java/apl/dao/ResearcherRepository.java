package apl.dao;

import apl.domain.Researcher;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearcherRepository extends JpaRepository<Researcher, Long> {

    Optional<Researcher> findByUsername(String username);
    List<Researcher> findByName(String name);
    List<Researcher> findBySurname(String surname);
    Optional<Researcher> findByEmail(String email);
    List<Researcher> findByRegistered(boolean registered);

    int countByUsername(String username);
    int countByEmail(String email);
}
