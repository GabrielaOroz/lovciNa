package apl.dto;

import apl.converters.MyConverter;
import apl.domain.*;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoRoute {



    public List<Location> retrievePointsLocation() {
        return MyConverter.convertToLocationList(this.points);
    }


    private Long id;

    private String name;

    private String description;


    private List<DtoTask> tasks;

    private List<DtoRoutePoint> points;
}