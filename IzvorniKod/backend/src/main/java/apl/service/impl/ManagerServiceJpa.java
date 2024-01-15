package apl.service.impl;

import apl.converters.MyConverter;
import apl.dao.*;
import apl.domain.*;
import apl.dto.*;
import apl.enums.ActionStatus;
import apl.enums.MediumType;
import apl.enums.RequestStatus;
import apl.service.ManagerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private TrackerActionMediumRepository trackerActionMediumRepo;

    @Transactional
    @Override
    public DtoStation getExistingStation(Long userId) {
        Station station = stationRepo.findByManagerId(userId);
        if(station != null){
            return station.toDTO();
        }
        return null;
    }

    @Transactional
    @Override
    public List<DtoTracker> getAvailableTrackers() {

        List<Tracker> availableTrackers = trackerRepo.findByStationIdIsNullAndRegisteredIsTrue();
        List<DtoTracker> availableTrackers1 = new LinkedList<>();

        for (Tracker tracker : availableTrackers){
            availableTrackers1.add(tracker.toTrackerDTO());

        }
        return availableTrackers1;
    }

    @Transactional
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

    @Transactional
    @Override
    public List<DtoAction> getIncomingRequests(Long managerId) {

        List<DtoRequest> incomingRequests = MyConverter.convertToDTOList(requestRepo.findByActionManagerIdAndRequestStatus(managerId, RequestStatus.ACTIVE));

        List<DtoAction> actions = new LinkedList<>();

        for(DtoRequest request : incomingRequests){
            actions.add(request.getAction());
        }

        return actions;
    }

    @Transactional
    @Override
    public List<DtoTracker> getAvailableTrackersForManager(Long managerId) {
        Manager manager = managerRepo.findById(managerId).orElse(null);

        List<Tracker> trackersFromStation = manager.getStation().getTrackers();
        List<DtoTracker> trackers = new LinkedList<>();

        for (Tracker tracker : trackersFromStation){
            if(!tracker.isTryingToHaveMultipleActiveActionsByMistake())
                trackers.add(tracker.toTrackerDTO());
        }

        return trackers;
    }

    @Transactional
    @Override
    public Action submitAction(RequestDTO requestDTO) {
        Request request = requestRepo.findById(requestDTO.getRequestId()).orElse(null);
        request.setRequestStatus(RequestStatus.INACTIVE);

        if(actionRepo.findById(request.getAction().getId()).orElse(null) == null){
            return null;
        }
        Action action = actionRepo.findById(request.getAction().getId()).orElse(null);
        action.setStartOfAction(LocalDateTime.now());
        action.setStatus(ActionStatus.ACTIVE);

        Map<Long, MediumType> trackersForAction = requestDTO.getSelectedTrackers();

        List<TrackerActionMedium> trackersInAction = new LinkedList<>();

        for (Long trackerId : trackersForAction.keySet()){
            System.out.println(trackerId);
                Medium medium = new Medium();
                medium.setType(trackersForAction.get(trackerId));
                Tracker tracker = trackerRepo.findById(trackerId).orElse(null);
                TrackerActionMedium trackerActionMedium = new TrackerActionMedium(tracker, action, medium);
            try{
                System.out.println("tu sam 4");
                trackerActionMediumRepo.save(trackerActionMedium);
                System.out.println("tu sam 5");
            } catch (Exception e){
                return null;
            }
        }
        return action;
    }

   @Transactional
    @Override
    public Station saveTrackerQualification(Long usrId, Map<Long, List<MediumType>> map) {
        Station station = stationRepo.findByManagerId(usrId);

        for (Long trackerId : map.keySet()){
            Tracker tracker = trackerRepo.findById(trackerId).orElse(null);
            List<Medium> media = new LinkedList<>();
            for (MediumType mediumType : map.get(trackerId)) {
                Medium medium = new Medium();
                medium.setType(mediumType);
                media.add(medium);
            }
            tracker.addMultipleMedia(media);
            tracker.assignStation(station);
            tracker.setLongitude(station.getLongitude());
            tracker.setLatitude(station.getLatitude());
            try{
                trackerRepo.save(tracker);
            } catch (Exception e){
                return null;
            }
        }


        return station;
    }
}
