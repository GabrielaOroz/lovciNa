package apl.domain;


import apl.converters.ConvertibleToDTO;
import apl.converters.ConvertibleToLocation;
import apl.dto.DtoAnimal;
import apl.dto.DtoRoute;
import apl.dto.DtoRoutePoint;
import apl.dto.DtoStation;
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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = RoutePoint.class)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"route_id", "order_point"})
})
public class RoutePoint implements ConvertibleToDTO<DtoRoutePoint>, ConvertibleToLocation {



    @Override
    public DtoRoutePoint toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoRoutePoint routePoint = new DtoRoutePoint();
        routePoint.setId(this.id);
        //if (this.route!=null) routePoint.setRoute(this.route.toDTO(entities));
        routePoint.setOrderPoint(this.orderPoint);
        routePoint.setLongitude(this.longitude);
        routePoint.setLatitude(this.latitude);
        return routePoint;
    }

    DtoRoutePoint toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoRoutePoint routePoint = new DtoRoutePoint();
        routePoint.setId(this.id);
        //if (this.route!=null) routePoint.setRoute(this.route.toDTO(localEntities));
        routePoint.setOrderPoint(this.orderPoint);
        routePoint.setLongitude(this.longitude);
        routePoint.setLatitude(this.latitude);
        return routePoint;
    }



    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }

    @Id
    @GeneratedValue
    private Long id;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Route route;

    public void assignRoute(Route route) {
        this.route=route;
        route.getPoints().add(this);
    }

    public DtoRoute retrieveRouteDTO() {
        if (this.route==null) return null;
        return this.route.toDTO();
    }

    @Column(name = "order_point", nullable = false)
    private Long orderPoint;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double latitude;
}
