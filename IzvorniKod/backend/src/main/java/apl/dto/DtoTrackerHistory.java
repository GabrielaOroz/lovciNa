package apl.dto;

import apl.converters.ConvertibleToLocation;
import apl.domain.*;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoTrackerHistory implements ConvertibleToLocation {


    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }


    private Long id;

    private DtoTracker tracker;

    private LocalDateTime time;

    private Double longitude;

    private Double latitude;
}