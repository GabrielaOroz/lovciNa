package apl.dto;

import apl.converters.ConvertibleToLocation;
import apl.domain.*;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoStation implements ConvertibleToLocation {



    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }


    private Long id;

    private String name;

    private String description;

    private Double longitude;

    private Double latitude;


    private DtoManager manager;


    private List<DtoTracker> trackers;
}