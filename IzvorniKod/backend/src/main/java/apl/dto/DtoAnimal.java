package apl.dto;

import apl.converters.ConvertibleToLocation;
import apl.domain.*;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoAnimal implements ConvertibleToLocation {




    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }

    private Long id;

    private DtoSpecies species;

    private byte[] photo;

    private String name;

    private String description;

    private Double longitude;

    private Double latitude;


    private List<DtoAnimalComment> comments;

    private List<DtoAnimalHistory> history;

    private List<DtoAction> actions;

    private List<DtoTask> tasks;

    @JsonIgnore
    private transient boolean includePhoto = false;

}