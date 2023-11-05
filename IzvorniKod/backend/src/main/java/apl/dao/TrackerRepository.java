package apl.dao;

import apl.domain.Tracker;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackerRepository extends JpaRepository<Tracker, Long> {
}
