package apl.dto;

import apl.domain.*;
import apl.enums.TaskStatus;
import apl.filter.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DtoTask {

    private Long id;


    private DtoTracker tracker;


    private DtoAction action;


    private DtoRoute route;


    private List<DtoAnimal> animals;

    private LocalDateTime startOfTask;

    private LocalDateTime endOfTask;

    private Double longitude;

    private Double latitude;

    private Double lonStart;

    private Double lonFinish;

    private Double latStart;

    private Double latFinish;

    private String title;

    private String content;

    private TaskStatus status;

    private List<DtoTaskComment> comments;
}