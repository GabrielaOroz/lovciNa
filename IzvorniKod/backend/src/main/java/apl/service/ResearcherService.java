package apl.service;


import apl.domain.*;
import apl.dto.*;

import java.util.List;

public interface ResearcherService {

    DtoUser createAction(Action action, Long usrId);

    List<DtoManager> listAllManagersDto();

    List<DtoAction> getAllActions(Long idResearcher);

    DtoAction getAllFinishedActions(ActionDTO actions, Long usrId);

    List<ActionDTO> getAllUnfinishedActions(Long usrId);

    List<DtoSpecies> getAllSpecies();

    List<DtoAnimal> getAllAnimals();

    List<DtoHabitat> getAllHabitats();

}
