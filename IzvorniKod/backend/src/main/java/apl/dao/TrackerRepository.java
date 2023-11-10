package apl.dao;

import apl.domain.Tracker;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrackerRepository extends JpaRepository<Tracker, Long> {

    Optional<Tracker> findByUsername(String username);
    List<Tracker> findByName(String name);
    List<Tracker> findBySurname(String surname);
    Optional<Tracker> findByEmail(String email);
    List<Tracker> findByRegistered(boolean registered);
    List<Tracker> findByStationId(Long stationId);

    int countByUsername(String username);
    int countByEmail(String email);

}
