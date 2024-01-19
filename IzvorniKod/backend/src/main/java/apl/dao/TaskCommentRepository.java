package apl.dao;


import apl.domain.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
}
