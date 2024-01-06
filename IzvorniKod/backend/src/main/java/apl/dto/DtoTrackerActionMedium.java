package apl.dto;

import apl.domain.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class DtoTrackerActionMedium {



    public static List<DtoTracker> convertToTrackerDTOList(List<DtoTrackerActionMedium> entityList) {
        return entityList.stream()
                .map(DtoTrackerActionMedium::getTracker)
                .collect(Collectors.toList());
    }

    public static List<DtoAction> convertToActionDTOList(List<DtoTrackerActionMedium> entityList) {
        return entityList.stream()
                .map(DtoTrackerActionMedium::getAction)
                .collect(Collectors.toList());
    }

    public static List<DtoMedium> convertToMediumDTOList(List<DtoTrackerActionMedium> entityList) {
        return entityList.stream()
                .map(DtoTrackerActionMedium::getMedium)
                .collect(Collectors.toList());
    }



    private Long id;


    private DtoTracker tracker;


    private DtoAction action;


    private DtoMedium medium;
}