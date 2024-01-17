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
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Propagation;

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

    @Autowired
    private MediumRepository mediumRepo;


    @Transactional
    @Override
    public DtoStation getExistingStation(Long userId) {
        Station station = stationRepo.findByManagerId(userId);
        if(station != null){
            return station.toDTO();
        }
        System.out.println("stanica je null");
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
        System.out.println("tu sam 1");
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

        if (manager.getStation() == null) {
            System.out.println("stanica je null za slanje trackera");
            return null;
        }
        List<Tracker> trackersFromStation = manager.getStation().getTrackers();
        List<DtoTracker> trackers = new LinkedList<>();

        for (Tracker tracker : trackersFromStation){
            if(trackerActionMediumRepo.findByTrackerId(tracker.getId()).orElse(null) == null)
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
        //action.setStartOfAction(LocalDateTime.now());
        action.setStatus(ActionStatus.WAITING);

        Map<Long, MediumType> trackersForAction = requestDTO.getSelectedTrackers();

        for (Long trackerId : trackersForAction.keySet()){
            //System.out.println(trackerId);

            Tracker tracker = trackerRepo.findById(trackerId).orElse(null);
            Medium medium = mediumRepo.findById(trackersForAction.get(trackerId)).orElse(null);
            //System.out.println(tracker.getName());
            //System.out.println(action.getTitle());
            //System.out.println(medium.getType());
            TrackerActionMedium trackerActionMedium = new TrackerActionMedium(tracker, action, medium);

            //try{
                trackerActionMediumRepo.save(trackerActionMedium);
            //} catch (Exception e){
              //  return null;
            //}
        }
        return action;
    }

    @Transactional
    @Override
    public Station saveTrackerQualification(Long usrId, Map<Long, List<MediumType>> map) {
        Station station = stationRepo.findByManagerId(usrId);
        System.out.println("0. nepetlja");
        for (Long trackerId : map.keySet()){
            Tracker tracker = trackerRepo.findById(trackerId).orElse(null);
            List<Medium> media = new LinkedList<>();
            System.out.println("1. petlja");
            for (MediumType mediumType : map.get(trackerId)) {
                Medium medium = mediumRepo.findById(mediumType).orElse(null);
                System.out.println(mediumType);
                media.add(medium);
            }
            tracker.addMultipleMedia(media);
            tracker.assignStation(station);
            tracker.setLongitude(station.getLongitude());
            tracker.setLatitude(station.getLatitude());
            /*try{
                trackerRepo.save(tracker);
            } catch (Exception e){
                return null;
            }*/
        }


        return station;
    }

    //fill db with media

    public void saveMediaToDB() {
        //ON_FOOT
        Medium medium1 = new Medium(MediumType.ON_FOOT, false, 25D, 1D, 6D);
        mediumRepo.save(medium1);

        //CAR
        Medium medium2 = new Medium(MediumType.CAR, false, 300D, 0.6D, 60D);
        mediumRepo.save(medium2);

        //BOAT
        Medium medium3 = new Medium(MediumType.BOAT, false, 150D, 0.4D, 60D);
        mediumRepo.save(medium3);

        //AIRPLANE
        Medium medium4 = new Medium(MediumType.AIRPLANE, true, 1000D, 0.2D, 300D);
        mediumRepo.save(medium4);

        //BICYCLE
        Medium medium5 = new Medium(MediumType.BICYCLE, false, 60D, 0.8D, 25D);
        mediumRepo.save(medium5);

        //MOTORCYCLE
        Medium medium6 = new Medium(MediumType.MOTORCYCLE, false, 200D, 0.7D, 50D);
        mediumRepo.save(medium6);

        //DRON
        Medium medium7 = new Medium(MediumType.DRON, true, 20D, 0.3D, 55D);
        mediumRepo.save(medium7);

        //HELICOPTER
        Medium medium8 = new Medium(MediumType.HELICOPTER, true, 500D, 0.3D, 60D);
        mediumRepo.save(medium8);
    }



}
