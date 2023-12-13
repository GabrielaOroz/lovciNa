package apl.service;

import apl.domain.Action;
import apl.domain.Manager;
import apl.domain.Researcher;

import java.util.List;

public interface ResearcherService {

    int createAction(Action action);

    List<Manager> listAllManagers();
}
