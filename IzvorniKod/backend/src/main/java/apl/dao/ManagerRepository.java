package apl.dao;

import apl.domain.Manager;
import apl.domain.Tracker;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {

    Optional<Manager> findByUsername(String username);
    List<Manager> findByName(String name);
    List<Manager> findBySurname(String surname);
    Optional<Manager> findByEmail(String email);
    List<Manager> findByRegistered(boolean registered);
    Optional<Manager> findByStationId(Long stationId);

    int countByUsername(String username);
    int countByEmail(String email);
}
