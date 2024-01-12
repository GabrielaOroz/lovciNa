package apl.service.impl;

import apl.converters.MyConverter;
import apl.dao.*;
import apl.domain.*;
import apl.dto.DtoRequest;
import apl.dto.DtoStation;
import apl.dto.DtoTracker;
import apl.enums.ActionStatus;
import apl.enums.RequestStatus;
import apl.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Service
public class ManagerServiceJpa implements ManagerService {

    @Autowired
    private StationRepository stationRepo;

    @Autowired
    private TrackerRepository trackerRepo;

    @Autowired
    private ManagerRepository managerRepo;

    @Autowired
    private RequestRepository requestRepo;

    @Autowired
    private ActionRepository actionRepo;

    @Override
    public DtoStation getExistingStation(Long userId) {
        Station station = stationRepo.findByManagerId(userId);
        if(station != null){
            return station.toDTO();
        }
        return null;
    }

    @Override
    public List<DtoTracker> getAvailableTrackers() {

        List<Tracker> availableTrackers = trackerRepo.findByStationIdIsNullAndRegisteredIsTrue();
        List<DtoTracker> availableTrackers1 = new LinkedList<>();

        for (Tracker tracker : availableTrackers){
            availableTrackers1.add(tracker.toTrackerDTO());

        }
        return availableTrackers1;
    }

    @Override
    public Station addNewStation(Long managerId, Station station) {
        Manager manager = managerRepo.findById(managerId).orElse(null);

        try{
            stationRepo.save(station);
            manager.assignStation(station);
        } catch (Exception e){
            return null;
        }
        return station;
    }

    @Override
    public List<DtoRequest> getIncomingRequests(Long managerId) {

        List<DtoRequest> incomingRequests = MyConverter.convertToDTOList(requestRepo.findByActionManagerIdAndRequestStatus(managerId, RequestStatus.ACTIVE));

        return incomingRequests;
    }

    @Override
    public List<DtoTracker> getTrackersForManager(Long managerId) {
        Manager manager = managerRepo.findById(managerId).orElse(null);

        List<Tracker> trackersFromStation = manager.getStation().getTrackers();
        List<DtoTracker> trackers = new LinkedList<>();

        for (Tracker tracker : trackersFromStation){
            if(!tracker.isTryingToHaveMultipleActiveActionsByMistake())
                trackers.add(tracker.toTrackerDTO());
        }

        return trackers;
    }

    @Override
    public Action submitAction(RequestDTO requestDTO) {
        Request request = requestRepo.findById(requestDTO.getRequestId()).orElse(null);

        request.setRequestStatus(RequestStatus.INACTIVE);

        Action action = actionRepo.findById(request.getAction().getId()).orElse(null);

        action.setStartOfAction(LocalDateTime.now());
        action.setStatus(ActionStatus.ACTIVE);


        return null;
    }
}
