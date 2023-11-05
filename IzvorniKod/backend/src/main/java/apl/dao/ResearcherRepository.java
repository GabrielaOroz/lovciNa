package apl.dao;

import apl.domain.Researcher;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearcherRepository extends JpaRepository<Researcher, Long> {
}
