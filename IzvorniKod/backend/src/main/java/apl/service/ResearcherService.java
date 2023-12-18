package apl.service;

import apl.domain.*;

import java.util.List;

public interface ResearcherService {

    int createAction(Action action, List<TrackerRequirement> list);

    List<ManagerDTO> listAllManagers();

    List<ResearcherMapDTO> getAllActions();
}
