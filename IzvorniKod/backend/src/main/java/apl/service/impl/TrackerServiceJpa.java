package apl.service.impl;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dao.*;
import apl.domain.*;
import apl.dto.DtoAnimal;
import apl.dto.DtoHabitat;
import apl.dto.DtoSpecies;
import apl.dto.DtoTracker;
import apl.enums.ActionStatus;
import apl.service.TrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;

@Service
public class TrackerServiceJpa implements TrackerService {

    @Autowired
    private TrackerRepository trackerRepo;

    @Autowired
    private TrackerActionMediumRepository trackerActionMediumRepo;

    @Autowired
    private AnimalRepository animalRepo;

    @Autowired
    private SpeciesRepository speciesRepo;

    @Autowired
    private HabitatRepository habitatRepo;


    @Override
    public DtoTracker getTrackerInfo(Long id) {
        Tracker tracker = trackerRepo.findById(id).orElse(null);

        return tracker.toTrackerDTO();
    }

    @Override
    public List<DtoTracker> getAllTrackersOnAction(Long id) {
        TrackerActionMedium actionMedium = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null);

        Long actionId = actionMedium.getAction().getId();

        List<Tracker> trackers = trackerRepo.findByTrackerActionMediaActionId(actionId);

        List<DtoTracker> dtoTrackers = new LinkedList<>();

        for(Tracker tracker : trackers){
            if(!Objects.equals(tracker.getId(), id))
                dtoTrackers.add(tracker.toTrackerDTO());
        }

        return dtoTrackers;
    }

    @Override
    public List<DtoAnimal> getAllAnimals(Long id) {

        Long actionId = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null).getId();

        List<DtoAnimal> dtoAnimals = new LinkedList<>();

        List<Animal> animals = animalRepo.findByActionsId(actionId);

        for (Animal animal : animals) {
            DtoAnimal dtoAnimal = animal.toDTO();
            dtoAnimals.add(dtoAnimal);
        }
        return dtoAnimals;
    }

    @Override
    public List<DtoSpecies> getAllSpecies(Long id) {
        Long actionId = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null).getId();

        List<DtoSpecies> speciesList = new LinkedList<>();

        List<Species> species = speciesRepo.findByAnimalsActionsId(actionId);

        for (Species species1 : species) {
            DtoSpecies dtoSpecies = species1.toDTO();
            speciesList.add(dtoSpecies);
        }
        return speciesList;
    }

    @Override
    public List<DtoHabitat> getAllHabitats(Long id) {
        Long actionId = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null).getId();

        List<DtoHabitat> habitatsList = new LinkedList<>();

        List<Habitat> habitats = habitatRepo.findByActionsId(actionId);

        for (Habitat habitat : habitats) {
            DtoHabitat dtoHabitat = habitat.toDTO();
            habitatsList.add(dtoHabitat);
        }
        return habitatsList;
    }


}
