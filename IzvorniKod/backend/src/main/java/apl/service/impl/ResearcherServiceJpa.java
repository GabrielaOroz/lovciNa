package apl.service.impl;

import apl.converters.MyConverter;
import apl.dao.*;
import apl.domain.*;
import apl.dto.*;
import apl.enums.ActionStatus;
import apl.enums.HandleRequest;
import apl.service.ResearcherService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

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
    public List<DtoAction> getAllActions(Long idResearcher) {
        List<DtoAction> dtoActions = new LinkedList<>();
        Researcher researcher = researcherRepo.findById(idResearcher).orElse(null);
        List<Action> actions = researcher.getActions();
        for (Action action : actions) {
            if(action.getStartOfAction() != null){
                DtoAction dtoAction = action.toDTO();
                dtoAction.setSpecies(MyConverter.convertToDTOList(speciesRepo.findByAnimalsActionsId(action.getId())));
                dtoActions.add(dtoAction);
            }

        }
        return dtoActions;
    }

    @Transactional
    public DtoAction getAllFinishedActions(ActionDTO action, Long usrId) {

        Action action1 = actionRepo.findById(action.getDtoAction().getId()).orElse(null);

        action1.setStartOfAction(LocalDateTime.now());
        action1.setStatus(ActionStatus.ACTIVE);

        List<Animal> animalsForDB = new LinkedList<>();
        for(DtoAnimal animal : action.getDtoAction().getAnimals()){
            Species species = new Species(animal.getSpecies().getName(), animal.getSpecies().getDescription(), animal.getSpecies().getPhoto());
            Animal a = new Animal(species, animal.getName(), animal.getDescription(), animal.getPhoto());
            animalsForDB.add(a);
        }

        for(DtoAnimal animal : action.getExistingAnimals()){
            Animal animal1 = animalRepo.findById(animal.getId()).orElse(null);
            animalsForDB.add(animal1);
        }

        action1.addMultipleAnimals(animalsForDB);


        List<Habitat> habitatsForDB = new LinkedList<>();
        for(DtoHabitat habitat : action.getDtoAction().getHabitats()){
            Habitat habitat1 = new Habitat(habitat.getLongitude(), habitat.getLatitude(), habitat.getRadius(), habitat.getName(), habitat.getDescription(), habitat.getPhoto());
            habitatsForDB.add(habitat1);
        }

        for(DtoHabitat habitat : action.getExistingHabitats()){
            Habitat habitat1 = habitatRepo.findById(habitat.getId()).orElse(null);
            habitatsForDB.add(habitat1);
        }

        action1.addMultipleHabitats(habitatsForDB);
        try{
            actionRepo.save(action1);
        }catch (Exception e){
            return null;
        }


        for(DtoSpecies species : action.getDtoAction().getSpecies()){
            Species species1 = new Species(species.getName(), species.getDescription(), species.getPhoto());
            try{
                speciesRepo.save(species1);
            }catch (Exception e){
                return null;
            }
        }

        return action1.toDTO();
    }

    @Transactional
    public List<ActionDTO> getAllUnfinishedActions(Long usrId) {
        List<DtoAction> dtoActions = MyConverter.convertToDTOList(actionRepo.findByResearcherIdAndStatus(usrId, ActionStatus.WAITING));
        List<ActionDTO> dtoUnfinishedActions = new LinkedList<>();
        for (DtoAction dtoAction : dtoActions) {
            ActionDTO actionDTO = new ActionDTO();
            actionDTO.setDtoAction(dtoAction);
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
}
