package apl.dto;

import apl.converters.ConvertibleToLocation;
import apl.domain.*;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoActionComment implements ConvertibleToLocation {


    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }

    private Long id;

    private DtoUser user;

    private DtoAction action;

    private String title;

    private String content;

    private Double longitude;

    private Double latitude;

    private LocalDateTime creationTime;

}