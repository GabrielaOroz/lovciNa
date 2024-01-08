package apl.service.impl;

import apl.dao.ManagerRepository;
import apl.dao.RequestRepository;
import apl.dao.ResearcherRepository;
import apl.dao.UserRepository;
import apl.domain.*;
import apl.dto.DtoAction;
import apl.dto.DtoManager;
import apl.dto.DtoUser;
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
        if (actions != null) {
            for (Action action : actions) {
                DtoAction dtoAction = action.toDTO();
                dtoActions.add(dtoAction);
            }
        }
        return dtoActions;
    }

    @Override
    public List<DtoAction> getAllFinishedActions(Long usrId) {
        List<DtoAction> dtoActions = getAllActions(usrId);
        List<DtoAction> dtoFinishedActions = new LinkedList<>();
        for (DtoAction dtoAction : dtoActions) {
            if (ActionStatus.FINISHED.equals(dtoAction.getStatus())) {
                dtoFinishedActions.add(dtoAction);
            }
        }
        return dtoFinishedActions;
    }

    @Override
    public List<DtoAction> getAllUnfinishedActions(Long usrId) {
        List<DtoAction> dtoActions = getAllActions(usrId);
        List<DtoAction> dtoUnfinishedActions = new LinkedList<>();
        for (DtoAction dtoAction : dtoActions) {
            if (ActionStatus.ACTIVE.equals(dtoAction.getStatus())) {
                dtoUnfinishedActions.add(dtoAction);
            }
        }
        return dtoUnfinishedActions;
    }
}
