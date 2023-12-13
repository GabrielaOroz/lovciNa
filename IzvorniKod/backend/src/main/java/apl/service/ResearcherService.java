package apl.service;

import apl.domain.Action;
import apl.domain.Manager;
import apl.domain.Researcher;
import apl.domain.TrackerRequirement;

import java.util.List;

public interface ResearcherService {

    int createAction(Action action, List<TrackerRequirement> list);

    List<Manager> listAllManagers();
}
