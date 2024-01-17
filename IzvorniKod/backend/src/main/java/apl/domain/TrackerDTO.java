package apl.domain;

import apl.dto.DtoAction;
import apl.dto.DtoMedium;
import apl.dto.DtoStation;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrackerDTO {

    public TrackerDTO(Long id, String name, String surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    private Long id;

    private String name;

    private String surname;

    private DtoMedium medium;

    private DtoAction action;

    private DtoStation station;

    //dodaj lista taskova

}
