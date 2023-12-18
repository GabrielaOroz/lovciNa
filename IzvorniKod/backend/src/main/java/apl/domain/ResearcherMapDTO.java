package apl.domain;

import java.util.List;

public class ResearcherMapDTO {
    private Long id;
    private List<ActionComment> comments;
    private Long startOfAction;
    private Long endOfAction;
    private boolean status;
    private String title;
    private List<Animal> individuals;
    private ManagerDTO managerDTO;
    private List<Species> species;
    private List<Tracker> trackers;
    private List<Habitat> habitats;
}
