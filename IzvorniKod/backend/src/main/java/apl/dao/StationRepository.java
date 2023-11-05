package apl.dao;

import apl.domain.Station;
import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Long> {
}
