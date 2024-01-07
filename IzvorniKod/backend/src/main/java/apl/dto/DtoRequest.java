package apl.dto;

import apl.domain.*;
import apl.enums.HandleRequest;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
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
public class DtoRequest {

    private Long id;


    private HandleRequest type;


    private LocalDateTime creationTime;


    private DtoAction action;


    private DtoUser user;
}