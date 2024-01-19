package apl.domain;

import apl.dto.DtoAction;
import apl.dto.DtoAnimal;
import apl.dto.DtoHabitat;
import apl.dto.DtoSpecies;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class UnfinishedActionDto {
    private DtoAction dtoAction;
    private List<DtoAnimal> existingDtoAnimals;
    private List<DtoHabitat> existingDtoHabitats;
    private List<DtoSpecies> existingDtoSpecies;
}
