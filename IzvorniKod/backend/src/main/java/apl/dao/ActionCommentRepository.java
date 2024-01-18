package apl.dao;

import apl.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ActionCommentRepository extends JpaRepository<ActionComment, Long> {
    List<ActionComment> findByActionId(Long id);
}
