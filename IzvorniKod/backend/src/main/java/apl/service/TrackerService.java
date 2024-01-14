package apl.service;

import apl.domain.Action;
import apl.domain.ActionComment;
import apl.domain.AnimalComment;
import apl.domain.Tracker;
import apl.dto.*;

import java.sql.ClientInfoStatus;
import java.util.List;
import java.util.Map;

public interface TrackerService {

    DtoTracker getTrackerInfo(Long id);

    List<DtoTracker> getAllTrackersOnAction(Long id);

    List<DtoAnimal> getAllAnimals(Long trackerId);

    List<DtoSpecies> getAllSpecies(Long usrId);

    List<DtoHabitat> getAllHabitats(Long id);

    List<DtoTask> getAllTasks(Long id);

    DtoAction updateAllDoneTasks(Map<Long, Long> lista, Long usrId);

    List<DtoAnimal> updateNewComments(Map<Long, List<AnimalComment>> comments, Long usrId);

    DtoAction updateNewCommentsOnAction(List<ActionComment> comments, Long usrId);
}
