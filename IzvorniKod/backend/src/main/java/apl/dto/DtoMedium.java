package apl.dto;

import apl.domain.*;
import apl.enums.MediumType;
import apl.filter.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.LinkedList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoMedium {


    private MediumType type;

    private boolean airline;

    private Double radius;

    private Double detail;

    private Double speed;


    private List<DtoTracker> trackers;


    private List<DtoTrackerActionMedium> trackerActionMedia;
}