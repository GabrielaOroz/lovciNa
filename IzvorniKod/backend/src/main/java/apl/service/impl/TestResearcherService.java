package apl.service.impl;

import apl.dao.*;
import apl.domain.*;
import apl.dto.DtoManager;
import apl.dto.DtoRequest;
import apl.dto.DtoUser;
import apl.enums.ActionStatus;
import apl.enums.HandleRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
public class TestResearcherService {


    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private StationRepository stationRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    @Autowired
    private ActionRepository actionRepo;

    @Autowired
    private RequestRepository requestRepo;

    @Transactional
    public DtoUser createAction(Action action, Long usrId) {
        try {

            //Action action1 = new Action();

            Researcher researcher = researcherRepo.findById(usrId).orElse(null);



            //System.out.println(action.getManager());

            //Object obj=action.getManager();


            Manager manager = managerRepo.findById(action.getManager().getId()).orElse(null);
            //manager.getRequests();

            User user = userRepo.findById(manager.getId()).orElse(null);

            Action action1 = new Action(manager, researcher, action.getTitle(), action.getRequirements());

            Request r1 = new Request(HandleRequest.MANAGER_CHOOOSE_TRACKERS_FOR_ACTION, action1,user);
            System.out.println(manager.getUsername());
            action.assignResearcher(researcher);
            action.assignManager(manager);
            //action1.setTitle(action.getTitle());
            //action1.setRequirements(action.getRequirements());


            //action.setResearcher(researcher);
            //action.setManager(manager);





            Request request=new Request();
            request.setType(HandleRequest.MANAGER_CHOOOSE_TRACKERS_FOR_ACTION);
            request.assignUser(user);
            action.addRequest(request);

            System.out.println(request.getAction().getId() + "   "+ action.getRequests().get(0).getId());

            actionRepo.save(action);

            //action1 = actionRepo.save(action1);

            System.out.println(request.getAction().getId() + "   "+ action.getRequests().get(0).getId());

            //Request request = new Request(HandleRequest.MANAGER_CHOOOSE_TRACKERS_FOR_ACTION, action1, user);
            //System.out.println("no save id = " + request.getId());
            //requestRepo.save(request);
            //System.out.println("save id = " + request.getId());
            //request.setUser(user);
            //user.getRequests().add(request);
            //user = userRepo.save(user);
            //request = requestRepo.save(request);
            //action1.getRequests().add(request);
            //System.out.println("prvotni u req size = " + user.getRequests().size());
            Station s = new Station("S2", "very good", 2., 3.);
            s.assignManager(manager);
            //manager.setStation(new Station("S1", "very good", 2., 3.));
            //manager.assignStation(new Station("S1", "very good", 2., 3.));
            //entityManager.refresh(user);

            //stationRepo.save(manager.getStation());
            //entityManager.detach(user);
            //user = entityManager.merge(user);
            //System.out.println(manager.getStation().getName() + " " + manager.getStation().getManager().getId());

            //user = userRepo.findById(manager.getId()).orElse(null);
            //Hibernate.initialize(user.getRequests());
            //userRepo.save(user);

            //System.out.println("u req size = " + user.getRequests().size());
            //for (Request r:user.getRequests()) System.out.println(r.getType());
            //System.out.println("u req [0] id = " + user.getRequests().get(0).getId());

            /*Action action2 = new Action();
            action2.setId(-1L);
            action2.setTitle("akcija");*/

            //System.out.println("a req size = " + action1.getRequests().size());

            System.out.println("========================================================");
            //return manager.toManagerDTO();
            //return new DtoManager();
            Hibernate.initialize(manager.getActions());

            //manager.addAction(action1);

           // managerRepo.save(manager);

            //Hibernate.initialize(manager.getActions());

            //for (Action action2:manager.getActions()) Hibernate.initialize(action2.getRequirements());

            //System.out.println("size = " + actionRepo.findByManagerUsername("dorjan").size());
            //manager=managerRepo.findById(manager.getId()).orElse(null);
            //System.out.println(actionRepo.findByResearcherIdAndManagerIdAndStatus(1L,2L, ActionStatus.PENDING).size());
            //System.out.println("size = " + managerRepo.findByActionsStatus(ActionStatus.PENDING).size());
            //return manager;
            //User usr = userRepo.findById(manager.getId()).orElse(null);
            //usr.setIncludePassword(true);
            //System.out.println("inp = " + usr.isIncludePassword());
            DtoUser usrDTO = user.toDTO();
            //Hibernate.initialize(usr.getRequests());
            //for (Request req:user.getRequests()) System.out.println(req.getId()+" ");
            usrDTO.setRequests(user.retrieveRequestsDTO());
            //DtoRequest req=usr.getRequests()
            //System.out.println("blablabla");
            //Hibernate.initialize(usr.getRequests());
            //usr.setId(null);
            //DtoRequest dtoRequest = user.getRequests().get(0).toDTO();
            //for (DtoRequest r:usrDTO.getRequests()) r.setUser(null);
            //usrDTO.setIncludePassword(true);
            //usrDTO.setIncludePhoto(true);
            return usrDTO;
        }
        catch (Exception e) {
            System.out.println("s null");
            return null;
        }
    }

}
