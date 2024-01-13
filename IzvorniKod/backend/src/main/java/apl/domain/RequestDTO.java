package apl.domain;

import apl.dto.DtoMedium;
import apl.dto.DtoTracker;
import apl.enums.MediumType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
public class RequestDTO {

    private Long requestId;

    private Map<Tracker, Medium> trackers;
}
