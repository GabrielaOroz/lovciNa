package apl.service.impl;

import apl.dao.ActionRepository;
import apl.dao.ResearcherRepository;
import apl.domain.Action;
import apl.domain.Manager;
import apl.domain.Researcher;
import apl.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResearcherServiceJpa implements ResearcherService {

    @Autowired
    ActionRepository actionRepo;

    @Override
    public int createAction(Action action) {

        Assert.notNull(action, "Action object must be given");  //moramo dobit objekt, ne možemo u bazu stavit null
        Assert.isNull(action.getId(), "Action ID must be null, not " + action.getId());    //zato što ga mi settiramo autom s generated value

        if(actionRepo.countByResearcherId(action.getResearcherId()) > 0){
            return 1;
        }

        try {
            actionRepo.save(action);
        } catch (Exception e) {return -1;}


        return 0;
    }

    @Override
    public List<Manager> listAllManagers() {
        try {
            return actionRepo.listAllManagers();
        } catch (Exception e) {return null;}
    }
}
