package apl.domain;

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

    private Long id;

    private String name;

    private String surname;

    private Double latitude;

    private Double longitude;

    private byte[] photo;

    private String medium;

    private List<Task> tasks;
}
