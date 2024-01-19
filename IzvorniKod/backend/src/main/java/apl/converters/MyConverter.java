package apl.converters;

import apl.location.Location;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


public class MyConverter {

    public static <T> List<T> convertToDTOList(List<? extends ConvertibleToDTO<T>> entityList) {
        if (entityList == null) {
            return Collections.emptyList();  // Return an empty list if the argument is null
        }

        return entityList.stream()
                .map(ConvertibleToDTO::toDTO)
                .collect(Collectors.toList());
    }


    public static List<Location> convertToLocationList(List<? extends ConvertibleToLocation> entityList) {
        if (entityList == null) {
            return Collections.emptyList();  // Return an empty list if the argument is null
        }

        return entityList.stream()
                .map(ConvertibleToLocation::toLocation)
                .collect(Collectors.toList());
    }

}

