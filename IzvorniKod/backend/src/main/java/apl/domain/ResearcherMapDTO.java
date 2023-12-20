package apl.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ResearcherMapDTO {
    private Long id;
    private List<ActionComment> comments;
    private LocalDateTime startOfAction;
    private LocalDateTime endOfAction;
    private boolean status;
    private String title;
    private List<Animal> individuals;
    private ManagerDTO managerDTO;
    private List<Species> species;
    private List<TrackerDTO> trackers;
    private List<Habitat> habitats;

}
