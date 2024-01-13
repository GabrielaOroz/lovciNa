package apl.service;

import apl.domain.Tracker;
import apl.dto.DtoAnimal;
import apl.dto.DtoHabitat;
import apl.dto.DtoSpecies;
import apl.dto.DtoTracker;

import java.sql.ClientInfoStatus;
import java.util.List;

public interface TrackerService {

    DtoTracker getTrackerInfo(Long id);

    List<DtoTracker> getAllTrackersOnAction(Long id);

    List<DtoAnimal> getAllAnimals(Long trackerId);

    List<DtoSpecies> getAllSpecies(Long usrId);

    List<DtoHabitat> getAllHabitats(Long id);
}
