package apl.entityWrapper;

import java.util.Objects;


public class EntityWrapper {

    private final Class<?> clazz;
    private final Object id;

    public EntityWrapper(Class<?> clazz, Object id) {
        this.clazz = clazz;
        this.id = id;
    }

    public Class<?> getClazz() {
        return clazz;
    }

    public Object getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EntityWrapper that)) return false;
        return Objects.equals(getClazz(), that.getClazz()) &&
                Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getClazz(), getId());
    }

}
