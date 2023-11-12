package apl.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ApprovedDTO {
    private String role;
    private Long id;
    private Boolean approved;
}
