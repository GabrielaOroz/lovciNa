package apl.service.impl;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dao.*;
import apl.domain.*;
import apl.dto.*;
import apl.enums.ActionStatus;
import apl.enums.TaskStatus;
import apl.service.TrackerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private ActionRepository actionRepo;


    @Transactional
    @Override
    public TrackerDTO getTrackerInfo(Long id) {
        Tracker tracker = trackerRepo.findById(id).orElse(null);
        TrackerActionMedium actionMedium = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null);

        TrackerDTO trackerDTO = new TrackerDTO(tracker.getId(), tracker.getName(), tracker.getSurname());

        if(actionMedium != null){
            trackerDTO.setMedium(actionMedium.getMedium().toDTO());
            trackerDTO.setAction(actionMedium.getAction().toDTO());
        }
        if(tracker.getStation() != null){
            trackerDTO.setStation(tracker.getStation().toDTO());
        }

        return trackerDTO;
    }

    @Transactional
    @Override
    public List<DtoTracker> getAllTrackersOnAction(Long id) {
        List<DtoTracker> dtoTrackers = new LinkedList<>();
        if(trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null) == null){
            return dtoTrackers;
        }

        TrackerActionMedium actionMedium = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null);

        Long actionId = actionMedium.getAction().getId();

        List<Tracker> trackers = trackerRepo.findByTrackerActionMediaActionId(actionId);



        for(Tracker tracker : trackers){
            if(!Objects.equals(tracker.getId(), id))
                dtoTrackers.add(tracker.toTrackerDTO());
        }

        return dtoTrackers;
    }

    @Transactional
    @Override
    public List<DtoAnimal> getAllAnimals(Long id) {
        List<DtoAnimal> dtoAnimals = new LinkedList<>();
        if(trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null) == null){
            return dtoAnimals;
        }

        Long actionId = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null).getId();


        List<Animal> animals = animalRepo.findByActionsId(actionId);

        for (Animal animal : animals) {
            DtoAnimal dtoAnimal = animal.toDTO();
            dtoAnimals.add(dtoAnimal);
        }
        return dtoAnimals;
    }

    @Transactional
    @Override
    public List<DtoSpecies> getAllSpecies(Long id) {
        List<DtoSpecies> speciesList = new LinkedList<>();
        if (trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null) == null) {
            return speciesList;
        }
        Long actionId = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null).getId();



        List<Species> species = speciesRepo.findByAnimalsActionsId(actionId);

        for (Species species1 : species) {
            DtoSpecies dtoSpecies = species1.toDTO();
            speciesList.add(dtoSpecies);
        }
        return speciesList;
    }

    @Transactional
    @Override
    public List<DtoHabitat> getAllHabitats(Long id) {
        List<DtoHabitat> habitatsList = new LinkedList<>();
        if(trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null) == null){
            return habitatsList;
        }
        Long actionId = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(id, ActionStatus.ACTIVE).orElse(null).getId();


        List<Habitat> habitats = habitatRepo.findByActionsId(actionId);

        for (Habitat habitat : habitats) {
            DtoHabitat dtoHabitat = habitat.toDTO();
            habitatsList.add(dtoHabitat);
        }
        return habitatsList;
    }

    @Transactional
    @Override
    public List<DtoTask> getAllTasks(Long id) {
        List<DtoTask> tasksList = new LinkedList<>();

        List<Task> tasks = taskRepo.findByTrackerId(id);

        for (Task task : tasks) {
            tasksList.add(task.toDTO());
        }
        return tasksList;
    }

    @Transactional
    @Override
    public DtoAction updateAllDoneTasks(Map<Long, Long> lista, Long usrId) {
        if(trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(usrId, ActionStatus.ACTIVE).orElse(null) == null){
            return null;
        }

        Action action = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(usrId, ActionStatus.ACTIVE).orElse(null).getAction();

        List<Task> allTasksOfTracker = taskRepo.findByActionIdAndTrackerId(action.getId(), usrId);

        for(Task task : allTasksOfTracker){
            if(lista.containsKey(task.getId())){
                if(lista.get(task.getId()) == 2){
                    task.setStatus(TaskStatus.SOLVED);
                    task.setEndOfTask(LocalDateTime.now());
                    try{
                        taskRepo.save(task);
                    } catch (Exception e){
                        return null;
                    }
                }
            }
        }

        boolean temp = false;
        for(Task task : action.getTasks()){
            if(task.getStatus().equals(TaskStatus.ACTIVE)){
                temp = true;
            }
        }

        if(!temp){
            action.setStatus(ActionStatus.FINISHED);
            action.setEndOfAction(LocalDateTime.now());
            try{
                actionRepo.save(action);
            } catch (Exception e){
                return null;
            }
        }

        return action.toDTO();
    }

    @Transactional
    @Override
    public List<DtoAnimal> updateNewComments(Map<Long, List<AnimalComment>> comments, Long usrId) {
        List<Animal> animalsOnAction = animalRepo.findByActionsId(trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(usrId, ActionStatus.ACTIVE).orElse(null).getAction().getId());

        for(Long id : comments.keySet()){
            Animal animal = animalRepo.findById(id).orElse(null);
            animal.addMultipleComments(comments.get(id));
            try{
                animalRepo.save(animal);
            } catch (Exception e){
                return null;
            }
        }
        return MyConverter.convertToDTOList(animalsOnAction);
    }

    @Transactional
    @Override
    public DtoAction updateNewCommentsOnAction(List<ActionComment> comments, Long usrId) {
        Action action = trackerActionMediumRepo.findTopByTrackerIdAndActionStatus(usrId, ActionStatus.ACTIVE).orElse(null).getAction();

        action.addMultipleActionComments(comments);
        try{
            actionRepo.save(action);
        } catch (Exception e){
            return null;
        }

        return action.toDTO();
    }


}
