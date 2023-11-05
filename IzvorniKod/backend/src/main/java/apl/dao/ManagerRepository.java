package apl.dao;

import apl.domain.Manager;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
}
