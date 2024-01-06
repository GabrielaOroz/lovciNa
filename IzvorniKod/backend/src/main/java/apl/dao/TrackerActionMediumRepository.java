package apl.dao;

import apl.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackerActionMediumRepository extends JpaRepository<TrackerActionMedium, Long> {
}
