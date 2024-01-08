package apl.service;


import apl.domain.*;
import apl.dto.DtoAction;
import apl.dto.DtoManager;
import apl.dto.DtoUser;

import java.util.List;

public interface ResearcherService {

    DtoUser createAction(Action action, Long usrId);

    List<DtoManager> listAllManagersDto();


    List<DtoAction> getAllActions(Long idResearcher);

    List<DtoAction> getAllFinishedActions(Long usrId);

    List<DtoAction> getAllUnfinishedActions(Long usrId);
}