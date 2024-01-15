package apl.serializers;

import apl.dto.DtoAnimal;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class DtoAnimalCustomSerializer extends StdSerializer<DtoAnimal> {

    public DtoAnimalCustomSerializer() {
        this(null);
    }

    public DtoAnimalCustomSerializer(Class<DtoAnimal> t) {
        super(t);
    }

    @Override
    public void serialize(DtoAnimal value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();

        // Serialize only non-null fields
        serializeIfNotNull("id", value.getId(), gen);
        serializeIfNotNull("species", value.getSpecies(), gen);


        // Include photo only if includePhoto is true and photo is not null
        serializeIfNotNull("photo", value.isIncludePhoto() ? value.getPhoto() : null, gen);


        serializeIfNotNull("name", value.getName(), gen);
        serializeIfNotNull("description", value.getDescription(), gen);
        serializeIfNotNull("longitude", value.getLongitude(), gen);
        serializeIfNotNull("latitude", value.getLatitude(), gen);

        // Custom serialization for lists
        serializeIfNotNull("comments", value.getComments(), gen);
        serializeIfNotNull("history", value.getHistory(), gen);
        serializeIfNotNull("actions", value.getActions(), gen);
        serializeIfNotNull("tasks", value.getTasks(), gen);

        gen.writeEndObject();
    }

    private <T> void serializeIfNotNull(String fieldName, T value, JsonGenerator gen) throws IOException {
        if (value != null) {
            gen.writeObjectField(fieldName, value);
        }
    }

}
