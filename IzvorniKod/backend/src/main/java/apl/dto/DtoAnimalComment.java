package apl.dto;

import apl.domain.*;
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
public class DtoAnimalComment {

    private Long id;

    private DtoAnimal animal;

    private DtoUser user;

    private DtoAction action;

    private String title;

    private String content;

    private LocalDateTime creationTime;

}