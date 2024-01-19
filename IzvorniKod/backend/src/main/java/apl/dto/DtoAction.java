package apl.dto;

import apl.converters.MyConverter;
import apl.domain.*;
import apl.enums.ActionStatus;
import apl.enums.MediumType;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoAction {

    private Long id;

    private DtoManager manager;

    private DtoResearcher researcher;

    private String title;

    private LocalDateTime startOfAction;

    private LocalDateTime endOfAction;

    private ActionStatus status;

    private Map<MediumType, Long> requirements;

    private List<DtoTask> tasks = new LinkedList<>();

    private List<String> comments = new LinkedList<>();

    private List<DtoAnimalComment> animalComments = new LinkedList<>();

    private List<DtoRequest> requests = new LinkedList<>();

    private List<DtoAnimal> animals = new LinkedList<>();

    private List<DtoHabitat> habitats = new LinkedList<>();

    private List<DtoTrackerActionMedium> trackerActionMedia = new LinkedList<>();

    private List<DtoSpecies> species = new LinkedList<>(); //not in class action


}
