package apl.dao;

import apl.domain.*;
import apl.enums.ActionStatus;
import apl.enums.MediumType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    //List<Tracker> findByStationId(Long stationId);


    List<Tracker> findByTrackerActionMediaActionStatus(ActionStatus actionStatus);

    List<Tracker> findByStationIdAndTrackerActionMediaActionStatus(Long stationId, ActionStatus actionStatus);

    @Query("SELECT t FROM Tracker t WHERE t.station.id = :stationId AND NOT EXISTS (SELECT tam FROM TrackerActionMedium tam WHERE tam.tracker = t AND tam.action.status = apl.enums.ActionStatus.ACTIVE)")
    List<Tracker> findTrackersWithoutActiveActionsInStation(@Param("stationId") Long stationId); // all available trackers in some station


    List<Tracker> findByTrackerActionMediaActionId(Long actionId);                              // all trackers in some action

    @Query("SELECT t FROM Tracker t JOIN t.trackerActionMedia tam WHERE tam.action.id = :actionId AND tam.medium.type = :mediumType")
    List<Tracker> findByActionAndMedium(@Param("actionId") Long actionId, @Param("mediumType") MediumType mediumType);
                                                                                                // all trackers with some medium in some action

    Optional<Tracker> findByIdAndTrackerActionMediaActionId(Long id, Long actionId);            //check if some tracker is/was in some action




    int countByUsername(String username);
    int countByEmail(String email);

}
