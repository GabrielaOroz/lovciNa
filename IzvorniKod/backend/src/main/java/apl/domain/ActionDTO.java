package apl.domain;

import apl.dto.*;
import apl.enums.MediumType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.core.SpringVersion;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ActionDTO {

    private DtoAction action;

    private List<DtoAnimal> existingAnimals = new LinkedList<>();

    private List<DtoSpecies> existingSpecies = new LinkedList<>();

    private List<DtoHabitat> existingHabitats = new LinkedList<>();

    private List<DtoTracker> trackers = new LinkedList<>();

    private Map<Long, MediumType> mapOfTrackers = new HashMap<>();
}
