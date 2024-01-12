package apl.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class RequestDTO {

    private Long requestId;

    private List<Tracker> trackers;
}
