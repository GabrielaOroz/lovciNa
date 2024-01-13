package apl.dao;

import apl.domain.*;
import apl.enums.ActionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface TrackerActionMediumRepository extends JpaRepository<TrackerActionMedium, Long> {

    Optional<TrackerActionMedium> findTopByTrackerIdAndActionStatus(Long trackerId, ActionStatus actionStatus);

}
