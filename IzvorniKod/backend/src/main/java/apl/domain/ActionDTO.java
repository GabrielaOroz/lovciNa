package apl.domain;

import apl.dto.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.core.SpringVersion;

import java.util.LinkedList;
import java.util.List;

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
}
