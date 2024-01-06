package apl.domain;


import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.DtoAnimal;
import apl.dto.DtoRoute;
import apl.dto.DtoRoutePoint;
import apl.dto.DtoTask;
import apl.entityWrapper.EntityWrapper;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = Route.class)
public class Route implements ConvertibleToDTO<DtoRoute> {


    public Route(String name, String description, List<RoutePoint> points) {
        this.name = name;
        this.description = description;
        assignPoints(points);
    }


    @Override
    public DtoRoute toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoRoute route = new DtoRoute();
        route.setId(this.id);
        route.setName(this.name);
        route.setDescription(this.description);
        return route;
    }

    DtoRoute toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoRoute route = new DtoRoute();
        route.setId(this.id);
        route.setName(this.name);
        route.setDescription(this.description);
        return route;
    }


    public List<Location> retrievePointsLocation() {
        if (this.points!=null) return MyConverter.convertToLocationList(this.points);
        return Collections.emptyList();
    }

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String description;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "route", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @OrderBy("startOfTask ASC")
    private List<Task> tasks = new LinkedList<>();

    public void addTask(Task task) {
        this.tasks.add(task);
        task.setRoute(this);
    }

    public void addMultipleTasks(List<Task> tasks) {
        for (Task task:tasks) addTask(task);
    }

    public List<DtoTask> retrieveTasksDTO() {
        return MyConverter.convertToDTOList(this.tasks);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderPoint ASC")
    private List<RoutePoint> points;

    public void assignPoints(List<RoutePoint> points) {
        Long cnt=1L;
        this.points=new LinkedList<>();
        for (RoutePoint point:points) {
            this.points.add(point);
            point.setOrderPoint(cnt);
            point.setRoute(this);
            cnt++;
        }
    }

    public List<DtoRoutePoint> retrievePointsDTO() {
        return MyConverter.convertToDTOList(this.points);
    }

}
