package apl.service.impl;

import apl.dao.ActionRepository;
import apl.dao.RequirementRepository;
import apl.domain.*;
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

    @Autowired
    RequirementRepository requirementRepo;

    @Override
    public int createAction(Action action, List<TrackerRequirement> list) {

        Assert.notNull(action, "Action object must be given");  //moramo dobit objekt, ne možemo u bazu stavit null
        Assert.isNull(action.getId(), "Action ID must be null, not " + action.getId());    //zato što ga mi settiramo autom s generated value

        //System.out.println("ovo je akcija" + action);
        //if(actionRepo.countByResearcher(action.getResearcher()) > 0){
        //    return 1;
        //}

        try {
            actionRepo.save(action);
        } catch (Exception e) {return -1;}

        try {

            for(TrackerRequirement req : list){
                req.setActionId(action.getId());
                requirementRepo.save(req);
            }
        } catch (Exception e) {return -1;}

        return 0;
    }

    @Override
    public List<ManagerDTO> listAllManagers() {
        List<ManagerDTO> list = new ArrayList<>();
        try {
            for (Manager manager : actionRepo.listAllManagers()) {
                ManagerDTO managerDTO = new ManagerDTO(manager.getId(), manager.getName(),
                        manager.getSurname(), manager.getStation());

                list.add(managerDTO);
            }

        } catch (Exception e) {return null;}
        return list;
    }

    @Override
    public List<ResearcherMapDTO> getAllActions(Long idResearcher) {
        List<ResearcherMapDTO> researcherMapDTOS = new ArrayList<>();

        try{

            for(Action action : actionRepo.listAllActions()){
                if (action.getResearcher().getId().equals(idResearcher)) {
                    ResearcherMapDTO researcherMapDTO = new ResearcherMapDTO();

                    ManagerDTO managerDTO = new ManagerDTO(action.getManager().getId(),
                                                            action.getManager().getName(),
                                                            action.getManager().getSurname(),
                                                            action.getManager().getStation());
                    researcherMapDTO.setManagerDTO(managerDTO);

                    researcherMapDTO.setId(action.getId());
                    researcherMapDTO.setStartOfAction(action.getStartOfAction());
                    researcherMapDTO.setEndOfAction(action.getEndOfAction());
                    researcherMapDTO.setStatus(action.getStatus());
                    researcherMapDTO.setTitle(action.getTitle());
                    researcherMapDTO.setComments(action.getComments());

                    List<Animal> individuals = new ArrayList<>();
                    List<Species> species = new ArrayList<>();
                    for(Animal animal : action.getAnimals()){
                        individuals.add(animal);

                        if(!species.contains(animal.getSpecies())) {
                            species.add(animal.getSpecies());
                        }
                    }
                    researcherMapDTO.setIndividuals(individuals);
                    researcherMapDTO.setSpecies(species);

                    //for(TrackerInAction tracker : )
                    List<TrackerDTO> trackerDTOS = new ArrayList<>();
                    for(Tracker tracker : action.getTrackers()) {
                        TrackerDTO trackerDTO = new TrackerDTO();

                        trackerDTO.setId(tracker.getId());
                        trackerDTO.setName(tracker.getName());
                        trackerDTO.setLatitude(tracker.getLatitude());
                        trackerDTO.setPhoto(tracker.getPhoto());
                        trackerDTO.setSurname(tracker.getSurname());
                        trackerDTO.setLongitude(tracker.getLongitude());
                        trackerDTO.setTasks(tracker.getTasks());

                        for(TrackerInAction trackerInAction : actionRepo.listAllTrackersInActions()) {
                            if(trackerInAction.getIdAction().equals(action.getId())) {
                                if(trackerInAction.getIdTracker().equals(tracker.getId())) {
                                    trackerDTO.setMedium(trackerInAction.getMedium());
                                }
                            }
                        }

                        trackerDTOS.add(trackerDTO);
                    }

                    researcherMapDTO.setTrackers(trackerDTOS);
                    researcherMapDTO.setHabitats(action.getHabitats());

                    researcherMapDTOS.add(researcherMapDTO);
                }

            }

        } catch(Exception e){
            return null;
        }

        return researcherMapDTOS;
    }

    @Override
    public List<ResearcherMapDTO> getAllFinishedActions(Long usrId) {
        List<ResearcherMapDTO> researcherMapDTOs = getAllActions(usrId);
        List<ResearcherMapDTO> finishedActions = new ArrayList<>();

        for (ResearcherMapDTO researcherMapDTO : researcherMapDTOs) {
            if (researcherMapDTO.getStartOfAction() != null && researcherMapDTO.getEndOfAction() != null) {
                finishedActions.add(researcherMapDTO);
            }
        }
        return finishedActions;
    }
    @Override
    public List<ResearcherMapDTO> getAllUnfinishedActions(Long usrId) {
        List<ResearcherMapDTO> researcherMapDTOs = getAllActions(usrId);
        List<ResearcherMapDTO> unfinishedActions = new ArrayList<>();

        for (ResearcherMapDTO researcherMapDTO : researcherMapDTOs) {
            if (researcherMapDTO.getStartOfAction() != null && researcherMapDTO.getEndOfAction() == null) {
                unfinishedActions.add(researcherMapDTO);
            }
        }
        return unfinishedActions;
    }

}
