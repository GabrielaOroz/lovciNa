package apl.serializers;

import apl.dto.DtoTracker;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class DtoTrackerCustomSerializer extends StdSerializer<DtoTracker> {

    public DtoTrackerCustomSerializer() {
        this(null);
    }

    public DtoTrackerCustomSerializer(Class<DtoTracker> t) {
        super(t);
    }

    @Override
    public void serialize(DtoTracker value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();

        // Serialize only non-null fields
        serializeIfNotNull("id", value.getId(), gen);
        serializeIfNotNull("username", value.getUsername(), gen);
        serializeIfNotNull("role", value.getRole(), gen);
        serializeIfNotNull("name", value.getName(), gen);
        serializeIfNotNull("surname", value.getSurname(), gen);
        serializeIfNotNull("email", value.getEmail(), gen);
        serializeIfNotNull("registered", value.isRegistered(), gen);

        serializeIfNotNull("longitude", value.getLongitude(), gen);
        serializeIfNotNull("latitude", value.getLatitude(), gen);

        // Include photo only if includePhoto is true and photo is not null
        if (value.isIncludePhoto() && value.getPhoto() != null) {
            gen.writeBinaryField("photo", value.getPhoto());
        }

        // Include password only if includePassword is true and password is not null
        if (value.isIncludePassword() && value.getPassword() != null) {
            gen.writeStringField("password", value.getPassword());
        }

        // Custom serialization for lists
        serializeIfNotNull("actionComments", value.getActionComments(), gen);
        serializeIfNotNull("animalComments", value.getAnimalComments(), gen);
        serializeIfNotNull("requests", value.getRequests(), gen);

        serializeIfNotNull("station", value.getStation(), gen);
        serializeIfNotNull("tasks", value.getTasks(), gen);
        serializeIfNotNull("history", value.getHistory(), gen);
        serializeIfNotNull("qualification", value.getQualification(), gen);
        serializeIfNotNull("trackerActionMedia", value.getTrackerActionMedia(), gen);


        gen.writeEndObject();
    }

    private <T> void serializeIfNotNull(String fieldName, T value, JsonGenerator gen) throws IOException {
        if (value != null) {
            gen.writeObjectField(fieldName, value);
        }
    }

}
