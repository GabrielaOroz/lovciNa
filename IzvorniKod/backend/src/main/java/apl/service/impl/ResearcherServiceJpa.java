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
                DtoManager dtoManager = manager.toManagerDTO();
                dtoManagers.add(dtoManager);
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
            DtoAction dtoAction = action.toDTO();
            dtoAction.setSpecies(MyConverter.convertToDTOList(speciesRepo.findByAnimalsActionsId(action.getId())));
            dtoActions.add(dtoAction);
        }
        return dtoActions;
    }

    @Transactional
    public List<ActionDTO> getAllFinishedActions(Long usrId) {
        /*List<DtoAction> dtoActions = getAllActions(usrId);
        List<ActionDTO> dtoFinishedActions = new LinkedList<>();
        for (DtoAction dtoAction : dtoActions) {
            if (ActionStatus.FINISHED.equals(dtoAction.getStatus())) {
                dtoFinishedActions.add(dtoAction);
            }
        }
        return dtoFinishedActions;*/
        return null;
    }

    @Transactional
    public List<ActionDTO> getAllUnfinishedActions(Long usrId) {
        List<DtoAction> dtoActions = getAllActions(usrId);
        List<ActionDTO> dtoUnfinishedActions = new LinkedList<>();
        for (DtoAction dtoAction : dtoActions) {
            if (dtoAction.getStartOfAction() == null) {
                ActionDTO actionDTO = new ActionDTO();
                actionDTO.setDtoAction(dtoAction);
                dtoUnfinishedActions.add(actionDTO);
            }
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
