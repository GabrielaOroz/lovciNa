package apl.service;

import apl.domain.Action;
import apl.domain.RequestDTO;
import apl.domain.Station;
import apl.dto.DtoRequest;
import apl.dto.DtoStation;
import apl.dto.DtoTracker;

import java.util.List;

public interface ManagerService {

    DtoStation getExistingStation(Long userId);

    List<DtoTracker> getAvailableTrackers();

    Station addNewStation(Long managerId, Station station);

    List<DtoRequest> getIncomingRequests(Long userId);

    List<DtoTracker> getTrackersForManager(Long managerId);

    Action submitAction(RequestDTO requestDTO);

}
