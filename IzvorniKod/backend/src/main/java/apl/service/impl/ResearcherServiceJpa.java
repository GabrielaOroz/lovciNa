package apl.service.impl;

import apl.converters.MyConverter;
import apl.dao.*;
import apl.domain.*;
import apl.dto.*;
import apl.enums.ActionStatus;
import apl.enums.HandleRequest;
import apl.enums.MediumType;
import apl.service.ResearcherService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class ResearcherServiceJpa implements ResearcherService {

    @Autowired
    ResearcherRepository researcherRepo;
    @Autowired
    ManagerRepository managerRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    RequestRepository requestRepo;

    @Autowired
    SpeciesRepository speciesRepo;

    @Autowired
    AnimalRepository animalRepo;

    @Autowired
    HabitatRepository habitatRepo;

    @Autowired
    private ActionRepository actionRepo;

    @Autowired
    private TrackerActionMediumRepository trackerActionMediumRepo;

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private TrackerRepository trackerRepo;

    @Autowired
    private ActionCommentRepository actionCommentRepo;

    @Transactional
    public DtoUser createAction(Action action, Long usrId) {
        try {
            Researcher researcher = researcherRepo.findById(usrId).orElse(null);

            Manager manager = managerRepo.findById(action.getManager().getId()).orElse(null);

            User user = userRepo.findById(manager.getId()).orElse(null);

            Action action1 = new Action(manager, researcher, action.getTitle(), action.getRequirements());

            Request request = new Request(HandleRequest.MANAGER_CHOOOSE_TRACKERS_FOR_ACTION, action1, user);

            requestRepo.save(request);
            DtoUser dtoUser = user.toDTO();
            return dtoUser;
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public List<DtoManager> listAllManagersDto() {
        List<DtoManager> dtoManagers = new LinkedList<>();
        List<Manager> managers = managerRepo.listAllManagers();
        if (managers != null) {
            for (Manager manager : managers) {
                if(manager.getStation() != null) {
                    DtoManager dtoManager = manager.toManagerDTO();
                    dtoManagers.add(dtoManager);
                }
            }
        }
        return dtoManagers;
    }


    @Transactional
    public List<ActionDTO> getAllActions(Long idResearcher) {
        List<DtoAction> dtoActions = MyConverter.convertToDTOList(actionRepo.findByResearcherIdAndStatus(idResearcher, ActionStatus.ACTIVE));
        List<ActionDTO> allActions = new LinkedList<>();
        for (DtoAction action : dtoActions) {

            ActionDTO actionDTO = new ActionDTO();

            List<DtoTracker> trackers = new LinkedList<>();
            List<TrackerActionMedium> trackersDB = trackerActionMediumRepo.findByActionId(action.getId()).orElse(null);

            Map<Long, MediumType> mediumForTrackers = new HashMap<>();

            for(TrackerActionMedium trackerActionMedium : trackersDB){
                DtoTracker tracker = new DtoTracker();
                tracker.setId(trackerActionMedium.getTracker().getId());
                tracker.setPhoto(trackerActionMedium.getTracker().getPhoto());
                tracker.setName(trackerActionMedium.getTracker().getName());
                tracker.setSurname(trackerActionMedium.getTracker().getSurname());
                tracker.setLongitude(trackerActionMedium.getTracker().getLongitude());
                tracker.setLatitude(trackerActionMedium.getTracker().getLatitude());

                List<DtoTask> tasks = new LinkedList<>();
                List<Task> tasksDB = taskRepo.findByActionIdAndTrackerId(action.getId(), tracker.getId());
                for(Task t : tasksDB){
                    tasks.add(t.toDTO());
                }

                tracker.setTasks(tasks);
                trackers.add(tracker);

                mediumForTrackers.put(trackerActionMedium.getTracker().getId(), trackerActionMedium.getMedium().getType());

                List<DtoAnimal> animals = new LinkedList<>();
                if(animalRepo.findByActionsId(action.getId()) != null){
                    for(Animal a : animalRepo.findByActionsId(action.getId())){
                        animals.add(a.toDTO());
                    }
                }
                action.setAnimals(animals);

                List<DtoHabitat> habitats = new LinkedList<>();
                if(habitatRepo.findByActionsId(action.getId()) != null){
                    for(Habitat h : habitatRepo.findByActionsId(action.getId())){
                        habitats.add(h.toDTO());
                    }
                }
                action.setHabitats(habitats);

                List<DtoSpecies> species = new LinkedList<>();
                if(speciesRepo.findByAnimalsActionsId(action.getId()) != null){
                    for(Species s : speciesRepo.findByAnimalsActionsId(action.getId())){
                        species.add(s.toDTO());
                    }
                }
                action.setSpecies(species);

                List<String> actionComments = new LinkedList<>();
                if(actionCommentRepo.findByActionId(action.getId()).orElse(null) != null){
                    for(ActionComment ac : actionCommentRepo.findByActionId(action.getId()).orElse(null)){
                        actionComments.add(ac.getContent());
                    }
                }
                action.setComments(actionComments);
            }

            actionDTO.setTrackers(trackers);
            actionDTO.setAction(action);
            actionDTO.setMapOfTrackers(mediumForTrackers);
            allActions.add(actionDTO);

        }
        return allActions;

    }

    @Transactional
    public DtoAction getAllFinishedActions(ActionDTO action, Long usrId) {

        Action action1 = actionRepo.findById(action.getAction().getId()).orElse(null);

        action1.setStartOfAction(LocalDateTime.now());
        action1.setStatus(ActionStatus.ACTIVE);

        for(DtoSpecies s : action.getAction().getSpecies()){
            Species species1 = speciesRepo.findByName(s.getName().toUpperCase()).orElse(null);
            if(species1 == null){
                species1 = new Species(s.getName().toUpperCase(), s.getDescription(), s.getPhoto());
                speciesRepo.save(species1);
            }

        }

        List<Animal> animalsForDB = new LinkedList<>();
        for(DtoAnimal animal : action.getAction().getAnimals()){

            Species species = speciesRepo.findByName(animal.getSpecies().getName().toUpperCase()).orElse(null);
            if(species == null){
                species = new Species(animal.getSpecies().getName().toUpperCase(), animal.getSpecies().getDescription(), animal.getSpecies().getPhoto());
                speciesRepo.save(species);
            }

            Animal a = new Animal(species, animal.getName(), animal.getDescription(), animal.getPhoto());
            a.updateLocation(action1.getManager().getStation().getLongitude()+0.05D, action1.getManager().getStation().getLatitude()+0.06D);

            List<String> commentsOnAnimal = animal.getComments();
            List<AnimalComment> newComments = new LinkedList<>();

            for(String s : commentsOnAnimal){
                Researcher researcher = researcherRepo.findById(action.getAction().getResearcher().getId()).orElse(null);
                AnimalComment newAnimalComment = new AnimalComment(a, researcher, action1, null, s);
                newComments.add(newAnimalComment);
            }

            a.addMultipleComments(newComments);
            animalsForDB.add(a);
        }

        for(DtoAnimal animal : action.getExistingAnimals()){
            Animal animal1 = animalRepo.findById(animal.getId()).orElse(null);
            animalsForDB.add(animal1);
        }

        action1.addMultipleAnimals(animalsForDB);





        //komentari
        List<String> commentsOnAction = action.getAction().getComments();
        List<ActionComment> newComments = new LinkedList<>();

        for(String s : commentsOnAction){
            Researcher researcher = researcherRepo.findById(action.getAction().getResearcher().getId()).orElse(null);
            ActionComment newActionComment = new ActionComment(researcher, action1, null, s);
            newComments.add(newActionComment);
        }

        //zadaci i komentari


        for(DtoTracker t : action.getTrackers()){
            List<Task> tasksForTracker = new LinkedList<>();

            Tracker tracker = trackerRepo.findById(t.getId()).orElse(null);

            for(DtoTask task : t.getTasks()){

                Task taskDB = new Task();
                taskDB.assignAction(action1);
                taskDB.assignTracker(tracker);


                //List<RoutePoint> routePoints = new LinkedList<>();
                //for(DtoRoutePoint rp : task.getRoute().getPoints()){
                    //RoutePoint routePoint = new RoutePoint();
                    //routePoint.setOrderPoint(rp.getOrderPoint());
                    //routePoint.setLatitude(rp.getLatitude());
                    //routePoint.setLongitude(rp.getLongitude());

                    //routePoints.add(routePoint);
                //}

                //Route route = new Route(task.getRoute().getName(), task.getRoute().getDescription(), routePoints);
                //taskDB.assignRoute(route);

                taskDB.setContent(task.getContent());   //ok
                taskDB.setLatStart(task.getLatStart());
                taskDB.setLonStart(task.getLonStart());
                taskDB.setLatFinish(task.getLatFinish());
                taskDB.setLonFinish(task.getLonFinish());
                taskDB.setTitle(task.getTitle());       //ok


                List<Habitat> habitatsForDB = new LinkedList<>();
                for(DtoHabitat habitat : action.getAction().getHabitats()){
                    Habitat habitat1 = new Habitat(taskDB.getLonFinish()+0.05D, taskDB.getLatStart()+0.06D, 20D, habitat.getName(), habitat.getDescription(), habitat.getPhoto());
                    habitatsForDB.add(habitat1);
                }

                for(DtoHabitat habitat : action.getExistingHabitats()){
                    Habitat habitat1 = habitatRepo.findById(habitat.getId()).orElse(null);
                    habitatsForDB.add(habitat1);
                }

                action1.addMultipleHabitats(habitatsForDB);



                if(task.getComments() != null) {
                    List<TaskComment> newCommentsForTask = new LinkedList<>();
                    for (String s : task.getComments()) {
                        TaskComment comment = new TaskComment(taskDB, s);
                        newCommentsForTask.add(comment);
                    }
                    taskDB.addMultipleComments(newCommentsForTask);
                }

                if(task.getAnimals() != null) {
                    List<Animal> animalsForTask = new LinkedList<>();
                    for (DtoAnimal animal : task.getAnimals()) {

                        Species species = speciesRepo.findByName(animal.getSpecies().getName()).orElse(null);
                        if (species == null) {
                            species = new Species(animal.getSpecies().getName(), animal.getSpecies().getDescription(), animal.getSpecies().getPhoto());
                            speciesRepo.save(species);
                        }
                        Animal animal1 = new Animal(species, animal.getName(), animal.getDescription(), animal.getPhoto());
                        animalsForTask.add(animal1);
                    }
                    taskDB.addMultipleAnimals(animalsForTask);
                }

                tasksForTracker.add(taskDB);
            }

            tracker.addMultipleTasks(tasksForTracker);
        }


        action1.addMultipleActionComments(newComments);
        try{
            actionRepo.save(action1);
        }catch (Exception e){
            return null;
        }

        return action1.toDTO();
    }

    @Transactional
    public List<ActionDTO> getAllUnfinishedActions(Long usrId) {
        List<DtoAction> dtoActions = MyConverter.convertToDTOList(actionRepo.findByResearcherIdAndStatus(usrId, ActionStatus.WAITING));
        List<ActionDTO> dtoUnfinishedActions = new LinkedList<>();
        for (DtoAction action : dtoActions) {

            ActionDTO actionDTO = new ActionDTO();

            List<DtoTracker> trackers = new LinkedList<>();
            List<TrackerActionMedium> trackersDB = trackerActionMediumRepo.findByActionId(action.getId()).orElse(null);

            Map<Long, MediumType> mediumForTrackers = new HashMap<>();

            for(TrackerActionMedium trackerActionMedium : trackersDB){
                DtoTracker tracker = new DtoTracker();
                tracker.setId(trackerActionMedium.getTracker().getId());
                tracker.setPhoto(trackerActionMedium.getTracker().getPhoto());
                tracker.setName(trackerActionMedium.getTracker().getName());
                tracker.setSurname(trackerActionMedium.getTracker().getSurname());
                tracker.setLongitude(trackerActionMedium.getTracker().getLongitude());
                tracker.setLatitude(trackerActionMedium.getTracker().getLatitude());

                List<DtoTask> tasks = new LinkedList<>();
                List<Task> tasksDB = taskRepo.findByActionIdAndTrackerId(action.getId(), tracker.getId());
                for(Task t : tasksDB){
                    tasks.add(t.toDTO());
                }

                tracker.setTasks(tasks);
                trackers.add(tracker);

                mediumForTrackers.put(trackerActionMedium.getTracker().getId(), trackerActionMedium.getMedium().getType());
            }

            actionDTO.setTrackers(trackers);
            actionDTO.setAction(action);
            actionDTO.setMapOfTrackers(mediumForTrackers);
            dtoUnfinishedActions.add(actionDTO);

        }
        return dtoUnfinishedActions;
    }

    @Transactional
    public List<DtoSpecies> getAllSpecies() {
        List<DtoSpecies> dtoSpecies = new LinkedList<>();
        List<Species> species = speciesRepo.findAll();
        for (Species species1 : species) {
            DtoSpecies dtoSpecies1 = species1.toDTO();
            dtoSpecies.add(dtoSpecies1);
        }
        return dtoSpecies;
    }

    @Transactional
    public List<DtoAnimal> getAllAnimals() {
        List<DtoAnimal> dtoAnimals = new LinkedList<>();
        List<Animal> animals = animalRepo.findAll();
        for (Animal animal : animals) {
            DtoAnimal dtoAnimal = animal.toDTO();
            dtoAnimals.add(dtoAnimal);
        }
        return dtoAnimals;
    }

    @Transactional
    public List<DtoHabitat> getAllHabitats() {
        List<DtoHabitat> dtoHabitats = new LinkedList<>();
        List<Habitat> habitats = habitatRepo.findAll();
        for (Habitat habitat : habitats) {
            DtoHabitat dtoHabitat = habitat.toDTO();
            dtoHabitats.add(dtoHabitat);
        }
        return dtoHabitats;
    }

    @Override
    public CoordsDTO getCoords(Long usrId) {
        //int randomNumber = new Random().nextInt(90) + 1;
        //double randomLatitude = -90 + Math.random() * (90 - (-90));
        //double randomDouble = Math.random();

        CoordsDTO coords = new CoordsDTO();

        List<Animal> animalsDB = animalRepo.findAllAnimalsByResearcherId(usrId);

        List<AnimalCoordsDTO> animalsCoords = new LinkedList<>();
        //double n = Math.round(1 + Math.random() * (20 - (1)));
        for(Animal a : animalsDB){
            AnimalCoordsDTO animal = new AnimalCoordsDTO();
            animal.setId(a.getId());
            animal.setSpecies(a.getSpecies().getName());

            double n = Math.round(1 + Math.random() * (20 - (1)));
            System.out.println(n);
            List<List<Double>> coordsList = new LinkedList<>();
            for(int i = 1; i <= n; i++) {


                List<Double> coord = new LinkedList<>();
                Double randomLatitude = -90 + Math.random() * (90 - (-90));
                Double randomLongitude = -180 + Math.random() * (180 - (-180));
                Double randomIntensity = Math.random();
                coord.add(randomLatitude);
                coord.add(randomLongitude);
                coord.add(randomIntensity);
                coordsList.add(coord);
            }

            animal.setCoords(coordsList);

            animalsCoords.add(animal);
        }
        coords.setAnimals(animalsCoords);

        

        return coords;
    }
}
