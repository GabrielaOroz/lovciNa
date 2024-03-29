package apl.serializers;

import apl.dto.DtoHabitat;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class DtoHabitatCustomSerializer extends StdSerializer<DtoHabitat> {

    public DtoHabitatCustomSerializer() {
        this(null);
    }

    public DtoHabitatCustomSerializer(Class<DtoHabitat> t) {
        super(t);
    }

    @Override
    public void serialize(DtoHabitat value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();

        // Serialize only non-null fields
        serializeIfNotNull("id", value.getId(), gen);
        serializeIfNotNull("longitude", value.getLongitude(), gen);
        serializeIfNotNull("latitude", value.getLatitude(), gen);
        serializeIfNotNull("radius", value.getRadius(), gen);
        serializeIfNotNull("name", value.getName(), gen);
        serializeIfNotNull("description", value.getDescription(), gen);

        // Include photo only if includePhoto is true and photo is not null
        if (value.isIncludePhoto() && value.getPhoto() != null) {
            gen.writeBinaryField("photo", value.getPhoto());
        }

        // Custom serialization for lists
        serializeIfNotNull("actions", value.getActions(), gen);

        gen.writeEndObject();
    }

    private <T> void serializeIfNotNull(String fieldName, T value, JsonGenerator gen) throws IOException {
        if (value != null) {
            gen.writeObjectField(fieldName, value);
        }
    }


}
