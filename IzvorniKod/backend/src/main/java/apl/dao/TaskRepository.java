package apl.dao;

import apl.domain.*;
import apl.enums.MediumType;
import apl.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find tasks by action ID
    List<Task> findByActionId(Long actionId);

    // Find tasks by tracker ID
    List<Task> findByTrackerId(Long trackerId);

    // Find tasks by status
    List<Task> findByStatus(TaskStatus status);

    // Find tasks by action ID and tracker ID combined
    List<Task> findByActionIdAndTrackerId(Long actionId, Long trackerId);

    // Find tasks by action ID and status combined
    List<Task> findByActionIdAndStatus(Long actionId, TaskStatus status);

    // Find tasks by tracker ID and status combined
    List<Task> findByTrackerIdAndStatus(Long trackerId, TaskStatus status);

    // Find tasks by action ID, tracker ID, and status combined
    List<Task> findByActionIdAndTrackerIdAndStatus(Long actionId, Long trackerId, TaskStatus status);

    List<Task> findByActionIdAndAnimalsSpeciesName(Long actionId, String species);


    List<Task> findByAction_TrackerActionMedia_Medium_Type(MediumType mediumType);

    List<Task> findByAction_IdAndAction_TrackerActionMedia_Medium_Type(Long actionId, MediumType mediumType);



}
