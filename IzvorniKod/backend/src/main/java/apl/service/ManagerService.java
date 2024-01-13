package apl.service;

import apl.domain.Action;
import apl.domain.Medium;
import apl.domain.RequestDTO;
import apl.domain.Station;
import apl.dto.DtoAction;
import apl.dto.DtoRequest;
import apl.dto.DtoStation;
import apl.dto.DtoTracker;

import java.util.List;
import java.util.Map;

public interface ManagerService {

    DtoStation getExistingStation(Long userId);

    List<DtoTracker> getAvailableTrackers();

    Station addNewStation(Long managerId, Station station);

    List<DtoAction> getIncomingRequests(Long userId);

    List<DtoTracker> getAvailableTrackersForManager(Long managerId);

    Action submitAction(RequestDTO requestDTO);

    Station saveTrackerQualification(Long usrId, Map<Long, List<Medium>>  map);

}
