package apl.dto;

import apl.converters.ConvertibleToLocation;
import apl.domain.*;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import apl.serializers.DtoTrackerCustomSerializer;
import apl.serializers.DtoUserCustomSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonSerialize(using = DtoTrackerCustomSerializer.class)
public class DtoTracker extends DtoUser implements ConvertibleToLocation {



    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }


    private Double longitude;

    private Double latitude;

    private DtoStation station;

    private List<DtoTask> tasks;

    private List<DtoTrackerHistory> history;

    private List<DtoMedium> qualification;

    private List<DtoTrackerActionMedium> trackerActionMedia;


}